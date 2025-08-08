//Helper: Get current page name
function getCurrentPage() {
    return window.location.pathname.split('/').pop().toLowerCase();
}

//add actions for sign in and get started button with JQuery
$(() => {
    $('#signInButton').on('click', () => {
        window.location.href = 'login.html';
    });
    $('#getStartedButton').on('click', () => {
        window.location.href = 'registration.html';
    });
});

// Global helper functions
function updateHeaderNavigation() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        // User is logged in - show dashboard/logout buttons
        $('.auth-buttons').html(`
            <button id="dashboardButton" class="text-gray-700 hover:text-blue-600 transition-colors">
                ${user.role === 'owner' ? 'My Dashboard' : 'Find Workspaces'}
            </button>
            <button id="logoutButton" class="text-gray-700 hover:text-blue-600 transition-colors">
                Logout
            </button>
        `);

        $('#dashboardButton').click(function () {
            const target = user.role === 'owner' ? 'dash.html' : 'search.html';
            if (user && getCurrentPage() !== target) { window.location.href = target; }
        });

        $('#logoutButton').click(Logout);
    } else {
        // User is not logged in - show sign in/get started
        $('.auth-buttons').html(`
            <button id="signInButton" class="text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
            </button>
            <button id="getStartedButton" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
            </button>
        `);

        // Add event listeners for these buttons
        $('#signInButton').on('click', () => {
            window.location.href = 'login.html';
        });

        $('#getStartedButton').on('click', () => {
            window.location.href = 'registration.html';
        });
    }
}

function Logout() {
    localStorage.removeItem('currentUser');
    if (getCurrentPage() !== 'index.html') { window.location.href = 'index.html'; }
}

function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const currentPage = window.location.pathname.split('/').pop();

    if (user && currentPage === 'index.html') {
        // Get the previous page from sessionStorage instead of referrer
        const previousPage = sessionStorage.getItem('previousPage');
        const fromAuthFlow = previousPage &&
            (previousPage.includes('login.html') ||
                previousPage.includes('registration.html'));

        if (!fromAuthFlow) {
            const target = user.role === 'owner' ? 'dash.html' : 'search.html';
            if (user && getCurrentPage() !== target) { window.location.href = target; }
        } else {
            // Clear the auth flow flag after first use
            sessionStorage.removeItem('previousPage');
        }
    }

    // Track current page for next navigation
    sessionStorage.setItem('previousPage', currentPage);

    // If user is not logged in but trying to access protected pages, redirect to index
    const protectedPages = ['dash.html', 'search.html'];
    if (!user && protectedPages.includes(currentPage) && currentPage !== 'index.html') {
        if (getCurrentPage() !== 'index.html') { window.location.href = 'index.html'; }
    }
}

function loadSearchResults(filteredList = null) {
    const workspaces = filteredList || JSON.parse(localStorage.getItem('workspaces')) || [];
    const properties = JSON.parse(localStorage.getItem('properties')) || [];

    const $results = $('#searchResults');
    $results.empty();

    if (workspaces.length === 0) {
        $results.append('<p class="text-gray-500 text-center mt-10">No workspaces found.</p>');
        return;
    }

    // Create grid container
    $results.append('<div id="workspaceGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>');

    workspaces.forEach(ws => {
        const property = properties.find(p => p.property_id == ws.property_id);
        if (!property) return;

        const imgUrl = property.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80';

        $('#workspaceGrid').append(`
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between">
                
                <!-- Image -->
                <div class="h-40 bg-gray-100 rounded overflow-hidden">
                    <img src="${imgUrl}" alt="Workspace Image" class="w-full h-full object-cover">
                </div>

                <!-- Features -->
                <ul class="text-sm text-gray-700 mt-4 space-y-1 list-disc list-inside">
                    <li>${ws.name}</li>
                    <li>${ws.type_of_room || "Room"}</li>                    
                    <li>Capacity: ${ws.capacity} people</li>
                    <li>Located in ${property.neighborhood}</li>
                    <li>${ws.decription || 'No description provided.'}</li>
                </ul>

                <!-- Price + Button -->
                <div class="mt-4 flex justify-between items-center">
                    <div class="text-2xl font-bold text-gray-900">$${ws.price}</div>
                    <button onclick="viewWorkspaceDetail('${ws.workspace_id}')"
                        class="bg-gray-800 text-white text-sm px-4 py-2 rounded hover:bg-gray-900 transition">
                        Book
                    </button>
                </div>
            </div>
        `);
    });
}



// Document ready handler
$(document).ready(function () {
    // Initialize header navigation
    updateHeaderNavigation();

    // Check authentication state
    checkAuthState();

    // Set up any page-specific functionality
    if (typeof loadSearchResults === 'function' && $('#searchResults').length) {
        loadSearchResults();
    }

    // Add applyFilters button click listener
    $('#applyFilters').on('click', applyFilters);

    $('#closeDetailModal').on('click', closeBookDetailsModal);

    $('#contactOwnerBtn').on('click', showOwnerContact);
});

function closeBookDetailsModal() {    
    $('#workspaceDetailModal').addClass('hidden');    
    $("#contactOwnerBtn").removeClass("hidden");
}

async function showOwnerContact() {
 $("#contactOwnerBtn").addClass("hidden");


 //get user information
 const ownerId = $("#contactOwnerBtn").attr("userId");
 const ownerInfo = await api_getUserById(ownerId);
 console.log(ownerInfo);

 //$("#bookInformationList").append();
}

// Make functions available globally for HTML onclick attributes
window.Logout = Logout;
window.viewWorkspaceDetail = function (workspaceId) {
    console.log(workspaceId)
    const workspace = JSON.parse(localStorage.getItem('workspaces')).find(ws => ws.workspace_id == workspaceId);
    const property = JSON.parse(localStorage.getItem('properties')).find(p => p.property_id == workspace.property_id);

    $('#workspaceTitle').text(`${workspace.type_of_room} at ${property.address}`);
    $('#workspaceLocation').text(property.neighborhood);
    $('#workspaceCapacity').text(workspace.capacity);
    $('#workspacePrice').text(workspace.price);
    $('#workspaceDescription').text(workspace.decription || 'No description provided.');

    $("#contactOwnerBtn").attr("userId", property.user_id);
    $('#workspaceDetailModal').removeClass('hidden');
};


function applyFilters(e) {
    e.preventDefault();

    // Get original unfiltered workspaces and properties
    const allWorkspaces = JSON.parse(localStorage.getItem("workspaces")) || [];    

    // Get filters
    const location = $("#locationFilter").val()?.toLowerCase();
    const type = $("#typeFilter").val()?.toLowerCase();
    const capacity = parseInt($("#capacityFilter").val());
    const price = parseFloat($("#priceFilter").val());

    // Apply filters
    const filteredWS = allWorkspaces.filter(ws => {
        const prop = JSON.parse(localStorage.getItem("properties")).find(p => p.property_id == ws.property_id);

        if (!prop) return false;

        // Apply each filter if it has a value
        if (location && !prop.neighborhood?.toLowerCase().includes(location)) return false;
        if (type && ws.type_of_room?.toLowerCase() !== type) return false;
        if (!isNaN(capacity) && ws.capacity < capacity) return false;
        if (!isNaN(price) && parseFloat(ws.price) > price) return false;

        return true;
    });

    // Optional: store filtered list separately (don’t overwrite original!)
    localStorage.setItem("filteredWorkspaces", JSON.stringify(filteredWS));

    // Update UI with filtered results (pass data directly or modify loadSearchResults to use filtered data)
    loadSearchResults(filteredWS);
}
