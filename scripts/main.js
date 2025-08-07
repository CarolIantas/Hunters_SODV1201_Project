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

function loadSearchResults() {
    const workspaces = JSON.parse(localStorage.getItem('filteredWorkspaces')) || JSON.parse(localStorage.getItem('workspaces')) || [];
    const properties = JSON.parse(localStorage.getItem('properties')) || [];

    $('#searchResults').empty();

    workspaces.forEach(ws => {
        const property = properties.find(p => p.property_id == ws.property_id);
        if (property) {
            const imgUrl = property.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80';

            $('#searchResults').append(`
                <div class="flex bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-6 overflow-hidden" style="height: 160px;">
                    
                    <!-- Left Image Section -->
                    <div class="w-1/3 h-full flex-shrink-0 bg-gray-100">
                        <img src="${imgUrl}" 
                             alt="Workspace Image" 
                             class="object-cover w-full h-full">
                    </div>
                    
                    <!-- Right Content Section -->
                    <div class="w-2/3 p-5 flex flex-col justify-between h-full">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 truncate">${property.title}</h3>
                            <p class="text-gray-700 mt-2">${ws.type_of_room} &bull; Capacity: ${ws.capacity} people</p>
                            <p class="text-indigo-600 font-medium mt-2 text-lg">$${ws.price}</p>
                        </div>
                        <div class="mt-4 text-right">
                            <button onclick="viewWorkspaceDetail('${ws.id}')" 
                                    class="inline-flex items-center text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                                    title="View Details">
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                     fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
                                     stroke="currentColor" class="w-6 h-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" 
                                        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" 
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span class="sr-only">View workspace details</span>
                            </button>
                        </div>
                    </div>
                </div>
            `);
        }
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
});

// Make functions available globally for HTML onclick attributes
window.Logout = Logout;
window.viewWorkspaceDetail = function (workspaceId) {
    const workspace = JSON.parse(localStorage.getItem('workspaces')).find(ws => ws.id === workspaceId);
    const property = JSON.parse(localStorage.getItem('properties')).find(p => p.id === workspace.propertyId);

    $('#workspaceTitle').text(`${workspace.type} at ${property.address}`);
    $('#workspaceLocation').text(property.neighborhood);
    $('#workspaceCapacity').text(workspace.capacity);
    $('#workspacePrice').text(workspace.price);
    $('#workspaceDescription').text(workspace.description || 'No description provided.');

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
        const prop = JSON.parse(localStorage.getItem("properties")).find(p => p.id === ws.propertyId);

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
