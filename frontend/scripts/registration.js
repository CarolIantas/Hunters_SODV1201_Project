//Helper: Get current page name 
function getCurrentPage() {
    return window.location.pathname.split('/').pop().toLowerCase();
}

// Registration form submit handler
document.getElementById("registrationForm").addEventListener("submit", async function(e) {
    try 
    {
        e.preventDefault();
    
        // Collect form values
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const role = document.querySelector('input[name="role"]:checked').value;
        
        const newUser = { firstName, lastName, email, phone, password, role };

        // Save new user
        userResp = await createUser(newUser)    

        
        localStorage.setItem("currentUser", JSON.stringify(userResp.user));
        alert("Registration successful!");
        // Redirect to login page
        window.location.href = "login.html";    
    } catch(e) {
        alert(`Registration error: ${e}`);
    }    
});

//POST Create user
async function createUser(user) {    
    const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });

    if (!res.ok) {
        if (res.status === 401) return null; // Unauthorized        
        throw new Error(`Login failed with status: ${res.status}`);        
    }

    const data = await res.json();
    return data.user;
}
