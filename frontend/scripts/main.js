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
        
        $('#dashboardButton').click(function() {
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
    const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];
    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    
    $('#searchResults').empty();
    workspaces.forEach(ws => {
        const property = properties.find(p => p.id === ws.propertyId);
        if (property) {
            $('#searchResults').append(`
                <div class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div class="p-4">
                        <h3 class="text-xl font-semibold">${property.address}</h3>
                        <p class="text-gray-600">${ws.type} • ${ws.capacity} people</p>
                        <button class="mt-3 text-blue-600 hover:underline"
                                onclick="viewWorkspaceDetail('${ws.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

// Document ready handler
$(document).ready(function() {
    // Initialize header navigation
    updateHeaderNavigation();
    
    // Check authentication state
    checkAuthState();
    
    // Set up any page-specific functionality
    if (typeof loadSearchResults === 'function' && $('#searchResults').length) {
        loadSearchResults();
    }
});

// Make functions available globally for HTML onclick attributes
window.Logout = Logout;
window.viewWorkspaceDetail = function(workspaceId) {
    const workspace = JSON.parse(localStorage.getItem('workspaces')).find(ws => ws.id === workspaceId);
    const property = JSON.parse(localStorage.getItem('properties')).find(p => p.id === workspace.propertyId);
    
    $('#workspaceTitle').text(`${workspace.type} at ${property.address}`);
    $('#workspaceLocation').text(property.neighborhood);
    $('#workspaceCapacity').text(workspace.capacity);
    $('#workspacePrice').text(workspace.price);
    $('#workspaceDescription').text(workspace.description || 'No description provided.');
    
    $('#workspaceDetailModal').removeClass('hidden');
};
