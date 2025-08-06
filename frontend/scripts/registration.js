//Helper: Get current page name 
function getCurrentPage() {
    return window.location.pathname.split('/').pop().toLowerCase();
}

// Registration form submit handler
document.getElementById("registrationForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Collect form values
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Prevent duplicate email registration
    if (users.some(u => u.email === email)) {
        alert("User already exists with that email.");
        return;
    }
    
    // Save new user
    users.push({ name, email, phone, password, role });
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Registration successful!");
    // Redirect to login page
    window.location.href = "login.html";
});

