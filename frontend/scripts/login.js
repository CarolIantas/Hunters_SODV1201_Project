// Helper: Get current page name
function getCurrentPage() {
    return window.location.pathname.split('/').pop().toLowerCase();
}

// login.js
$(document).ready(function () {
    // Handle login form submission
    $('#loginForm').submit(async function (e) {
        e.preventDefault();

        const email = $('#loginEmail').val().trim();
        const password = $('#loginPassword').val().trim();

        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        try {
            const user = await loginUser(email, password);
            if (user) {                
                //get data base on user role and store all important data in local storage    
                //get properties
                const properties = await getPropertiesByUser(user);                         
                
                //store user and properties on local storage
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('properties', JSON.stringify(properties));                                
                
                //get workspaces if the user is coworker
                //if (user.role === "coworker") {
                    const workspaces = await getWorkspaces();
                    localStorage.setItem('workspaces', JSON.stringify(workspaces));       
                //}                             

                const target = user.role === 'owner' ? 'dash.html' : 'search.html';
                if (getCurrentPage() !== target) {
                    window.location.href = target;
                }
            } else {
                alert('Login failed. Please check your credentials or register.');
                window.location.href = 'registration.html';
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Something went wrong while logging in.');
        }
    });

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

//GET properties by user
async function getPropertiesByUser(user) {
    const jsonBody = JSON.stringify(user);    
    const res = await fetch('http://localhost:3001/properties/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody,
    });

    if (!res.ok) {
        if (res.status === 401) return null; // Unauthorized
        throw new Error(`Get properties failed with status: ${res.status}`, res);
    }

    const data = await res.json();
    return data;
}

//GET properties by user
async function getWorkspaces() {    
    const res = await fetch('http://localhost:3001/workspaces');

    if (!res.ok) {
        if (res.status === 401) return null; // Unauthorized
        throw new Error(`Get workspaces failed with status: ${res.status}`, res);
    }

    const data = await res.json();
    return data;
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
    
    //clean local storage
    localStorage.removeItem('workspaces');
    localStorage.removeItem('properties');
    localStorage.removeItem('currentUser');

    //redirect to Landing page
    if (getCurrentPage() !== 'index.html') {
        window.location.href = 'index.html';
    }
}
