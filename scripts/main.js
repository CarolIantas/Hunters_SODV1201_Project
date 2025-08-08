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

        const imgUrl = ws.image || property.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80';

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
                    <li>Available from ${property.date}</li>
                    <li>${ws.description.substr(0, 35) || 'No description provided.'}${ws.description.length > 35 ? "..." : ""}</li>
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
    $('#bookContactName')?.remove();
    $('#bookContactEmail')?.remove();
    $('#bookContactPhone')?.remove();
    $('#workspaceDetailModal').addClass('hidden');
    $("#contactOwnerBtn").removeClass("hidden");
}

async function showOwnerContact() {
    $("#contactOwnerBtn").addClass("hidden");


    //get user information
    const ownerId = $("#contactOwnerBtn").attr("userId");
    const ownerInfo = await api_getUserById(ownerId);

    const formattedPhone = ownerInfo.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    const newElement = $(`
        <li id="bookContactName" class="flex items-center text-sm text-gray-700 mb-2">
            <svg class="h-4 w-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.05 3.636A9 9 0 0116.364 14.95l-2.121-2.122a1 1 0 00-1.414 0l-1.414 1.414a8 8 0 01-6.364-6.364l1.414-1.414a1 1 0 000-1.414L5.05 3.636z" />
            </svg>
            <span><strong>Name:</strong> ${ownerInfo.firstName} ${ownerInfo.lastName}</span>
        </li>
        <li id="bookContactPhone" class="flex items-center text-sm text-gray-700 mb-2">
            <svg class="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.003 5.884a1.5 1.5 0 012.121 0l1.795 1.794a1.5 1.5 0 010 2.122l-.586.586a1 1 0 00-.293.707c0 3.18 2.58 5.76 5.76 5.76a1 1 0 00.707-.293l.586-.586a1.5 1.5 0 012.122 0l1.794 1.795a1.5 1.5 0 010 2.121l-1.058 1.059a3 3 0 01-3.708.293c-4.237-2.648-6.886-5.297-9.535-9.535a3 3 0 01.293-3.708l1.059-1.058z" clip-rule="evenodd"/>
            </svg>
            <span><strong>Phone:</strong> ${formattedPhone}</span>
            </li>
        <li id="bookContactEmail" class="flex items-center text-sm text-gray-700 mb-2">
            <svg class="h-4 w-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.94 6.94A2 2 0 014.5 6h11a2 2 0 011.56.94L10 12.414 2.94 6.94z" />
            <path d="M18 8.118V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.118l7.293 5.64a1 1 0 001.414 0L18 8.118z" />
            </svg>
            <span><strong>Email:</strong> ${ownerInfo.email}</span>
        </li>
        `);


    $("#bookInformationList").append(newElement);
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
    $('#workspaceDescription').text(workspace.description || 'No description provided.');
    const imgUrl = workspace.image || property.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80';
    console.log(imgUrl);
    $('#workspaceImage').attr('src', imgUrl);

    $("#contactOwnerBtn").attr("userId", property.user_id);
    $('#workspaceDetailModal').removeClass('hidden');
};


function applyFilters(e) {
    e.preventDefault();

    const allWorkspaces = JSON.parse(localStorage.getItem("workspaces")) || [];

    // Filters
    const location = $("#locationFilter").val()?.toLowerCase();
    const type = $("#typeFilter").val()?.toLowerCase();
    const capacity = parseInt($("#capacityFilter").val());
    const price = parseFloat($("#priceFilter").val());
    const smoking = $("#smokingFilter").is(":checked");
    const sortBy = $("#sortFilter").val(); // <-- NEW

    const filteredWS = allWorkspaces.filter(ws => {
        const prop = JSON.parse(localStorage.getItem("properties")).find(p => p.property_id == ws.property_id);
        if (!prop) return false;

        if (
            location &&
            !prop.neighborhood?.toLowerCase().includes(location) &&
            !prop.address?.toLowerCase().includes(location)
        ) return false;

        if (type && ws.type_of_room?.toLowerCase() !== type) return false;
        if (!isNaN(capacity) && ws.capacity < capacity) return false;
        if (!isNaN(price) && parseFloat(ws.price) > price) return false;
        if (smoking && !prop.smoking_allowed) return false;

        return true;
    });

    // Sort results
    if (sortBy) {
        filteredWS.sort((a, b) => {
            const propA = JSON.parse(localStorage.getItem("properties")).find(p => p.property_id == a.property_id);
            const propB = JSON.parse(localStorage.getItem("properties")).find(p => p.property_id == b.property_id);

            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "address") {
                return propA.address.localeCompare(propB.address);
            } else if (sortBy === "neighborhood") {
                return propA.neighborhood.localeCompare(propB.neighborhood);
            } else if (sortBy === "available_from") {
                return new Date(a.available_from) - new Date(b.available_from);
            }
            return 0;
        });
    }

    localStorage.setItem("filteredWorkspaces", JSON.stringify(filteredWS));
    loadSearchResults(filteredWS);
}




//MAP

$(document).ready(() => {
    const mapContainer = $('#map');
    if (!mapContainer.length) return; // Exit if there's no map div on the page

    const map = L.map('map').setView([51.0447, -114.0719], 10); // Default to Calgary

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const allProperties = JSON.parse(localStorage.getItem("properties")) || [];
    const addresses = allProperties.map(p => p.address);

    // Function to geocode and place markers
    async function geocodeAddress(address) {
        try {
                        
            const data = await api_geocodeAddress(address);

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const marker = L.marker([+lat, +lon]).addTo(map).bindPopup(display_name || address);
                return [+lat, +lon];
            } else {
                console.warn(`Geocoding failed for: ${address}`);
                return null;
            }
        } catch (error) {
            console.error(`Error geocoding '${address}':`, error);
            return null;
        }
    }

    // Add markers for all property addresses
    async function loadAddressesOnMap() {
        const coords = [];

        for (const address of addresses) {
            const coord = await geocodeAddress(address);
            if (coord) coords.push(coord);
            await new Promise(res => setTimeout(res, 1000)); // Respect Nominatim's 1 request/sec rule
        }

        if (coords.length > 0) {
            map.fitBounds(coords);
        } else {
            map.setView([51.0447, -114.0719], 10); // Fallback to Calgary view
        }
    }

    loadAddressesOnMap();
});
