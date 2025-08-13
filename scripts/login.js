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

      
        //Better val check
        if (!appUtils.validateEmail(email)) {
        alert('Please enter a valid email');
        return;
        }        


        try {
            const user_obj = { email: email, password: password };
            const user = await api_login(user_obj);
            if (user.user) {                
                //store user and properties on local storage                
                localStorage.setItem('currentUser', JSON.stringify(user.user));                
                
                //get workspaces if the user is coworker
                if (user.user.role == "coworker") {

                    const properties = await api_getProperties();         
                    
                    localStorage.setItem('properties', JSON.stringify(properties));                                
                    localStorage.setItem('filteredProperties', JSON.stringify(properties));

                    const workspaces = await api_getWorkspaces();                    
                    localStorage.setItem('workspaces', JSON.stringify(workspaces));       
                    localStorage.setItem('filteredWorkspaces', JSON.stringify(workspaces));       
                } else {
                    //get data base on user role and store all important data in local storage    
                    //get properties

                    const properties = await api_getPropertiesByUser(user.user);         
                    
                    localStorage.setItem('properties', JSON.stringify(properties));                                
                    localStorage.setItem('filteredProperties', JSON.stringify(properties));                                
                }                             
                
                const target = user.user.role === 'owner' ? 'dash.html' : 'search.html';
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
