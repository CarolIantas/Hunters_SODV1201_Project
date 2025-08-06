// Helper: Get current page name
function getCurrentPage() {
    return window.location.pathname.split('/').pop().toLowerCase();
}

// login.js
$(document).ready(function() {
    // Handle login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        const email = $('#loginEmail').val().trim();
        
        if (!email) {
            alert('Please enter your email');
            return;
        }

        // Check against stored users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            const target = user.role === 'owner' ? 'dash.html' : 'search.html';
if (user && getCurrentPage() !== target) { window.location.href = target; }
        } else {
            alert('User not found. Please register first.');
            window.location.href = 'registration.html';
        }
    });

    // Check auth state on page load
    checkAuthState();
});

function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const target = user.role === 'owner' ? 'dash.html' : 'search.html';
if (user && getCurrentPage() !== target) { window.location.href = target; }
    }
}

function Logout() {
    localStorage.removeItem('currentUser');
    if (getCurrentPage() !== 'index.html') { window.location.href = 'index.html'; }
}
