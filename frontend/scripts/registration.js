//Helper: Get current page name 
function getCurrentPage() {
    return window.location.pathname.split('/').pop().toLowerCase();
}

function handleRegistration() {
    console.log("Registration function called");
    // Wait for DOM to load
$(document).ready(function() {
        $('#registrationForm').submit(function(event) {
            event.preventDefault();
            
            const user = {
                name: $('#fullName').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                role: $('input[name="role"]:checked').val()
            };

            // Save to localStorage (Phase 1)
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Set current user and redirect
            localStorage.setItem('currentUser', JSON.stringify(user));
            const target = user.role === 'owner' ? 'dash.html' : 'search.html';
if (user && getCurrentPage() !== target) { window.location.href = target; }
        });
    });
}

function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isHomepage = window.location.pathname.endsWith('index.html');
    
    if (user && isHomepage) {
        // Check if user came from auth flow
        const fromAuthFlow = document.referrer.includes('registration.html') || 
                            document.referrer.includes('login.html');
        
        // Only redirect if coming from auth flow
        if (fromAuthFlow) {
            const target = user.role === 'owner' ? 'dash.html' : 'search.html';
if (user && getCurrentPage() !== target) { window.location.href = target; }
        }
    }
}

// Initialize when page loads
$(document).ready(function() {
    handleRegistration(); // Your existing registration handler
});
