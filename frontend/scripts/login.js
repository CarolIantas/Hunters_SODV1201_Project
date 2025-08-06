// Helper: Get current page name
function getCurrentPage() {
    return window.location.pathname.split('/').pop().toLowerCase();
}

// Login form submit handler
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Get login input values
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    
    // Retrieve stored users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store the currently logged-in user
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        alert(`Welcome, ${user.name}!`);
        
        // Navigate based on role
        if (user.role === "owner") {
            window.location.href = "dash.html";
        } else {
            window.location.href = "search.html";
        }
    } else {
        alert("Invalid email or password.");
    }

    // Check auth state on page load
    checkAuthState();
});


    

// POST login request
async function loginUser(email, password) {    
    const res = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        if (res.status === 401) return null; // Unauthorized
        throw new Error(`Login failed with status: ${res.status}`);
    }

    const data = await res.json();
    return data.user;
}

function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const target = user.role === 'owner' ? 'dash.html' : 'search.html';
        if (getCurrentPage() !== target) {
            window.location.href = target;
        }
    }
}

function Logout() {
    localStorage.removeItem('currentUser');
    if (getCurrentPage() !== 'index.html') {
        window.location.href = 'index.html';
    }
}
