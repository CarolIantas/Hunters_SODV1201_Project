//Helper: Get current page name 
function getCurrentPage() {
    return window.location.pathname.split('/').pop().toLowerCase();
}

// Registration form submit handler
document?.getElementById("registrationForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    try 
    {            
        // Collect form values
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const role = document.querySelector('input[name="role"]:checked').value;
        
        const newUser = { firstName, lastName, email, phone, password, role };

        // Save new user
        userResp = await api_createUser(newUser)    
                
        alert("Registration successful!");
        // Redirect to login page
        window.location.href = "login.html";    
    } catch(e) {
        alert(`Registration error: ${e}`);
    }    
});
