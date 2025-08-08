//Helper: Get current page name 
function getCurrentPage() {
    return window.location.pathname.split('/').pop().toLowerCase();
}

appUtils.attachPhoneFormatter('phone');

// Registration form submit handler
document?.getElementById("registrationForm")?.addEventListener("submit", async function(e) {
     e.preventDefault();
 try {
   // Collect & trim
   const firstName = document.getElementById("firstName").value.trim();
   const lastName = document.getElementById("lastName").value.trim();
   const email = document.getElementById("email").value.trim();
   const phone = document.getElementById("phone").value.trim();
   const password = document.getElementById("loginPassword").value;
   const roleNode = document.querySelector('input[name="role"]:checked');
   const role = roleNode ? roleNode.value : null;

   // clear previous errors
   ['firstName','lastName','email','phone','loginPassword'].forEach(id => appUtils.clearFieldError(id));

   // Basic client-side checks
   let hasError = false;
   const nameRegex = /^[A-Za-z ,.'-]{2,50}$/;
   if (!nameRegex.test(firstName)) { appUtils.showFieldError('firstName', 'Enter a valid first name (2–50 letters).'); hasError = true; }
   if (!nameRegex.test(lastName))  { appUtils.showFieldError('lastName', 'Enter a valid last name (2–50 letters).'); hasError = true; }
   if (!appUtils.validateEmail(email)) { appUtils.showFieldError('email','Enter a valid email address.'); hasError = true; }
   const pwCheck = appUtils.checkPasswordStrength(password);
   if (!pwCheck.ok) { appUtils.showFieldError('loginPassword', pwCheck.message); hasError = true; }
   if (!role) { alert('Please select a role before registering.'); hasError = true; }

   // Phone validation 
   if (phone && !/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone)) {
     appUtils.showFieldError('phone','Enter a valid 10-digit phone number.'); hasError = true;
   }

   if (hasError) return; // stop here while user fixes errors

   // Duplicate email check via API to avoid unnecessary posts
   const usersResp = await api_getUsers();
   const existing = (usersResp || []).find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
   if (existing) { appUtils.showFieldError('email', 'Email already registered. Try logging in.'); return; }

   
   const newUser = { firstName, lastName, email, phone, password, role };
   const userResp = await api_createUser(newUser);

   alert('Registration successful!');
   window.location.href = 'login.html';
 } catch (e) {
   alert(`Registration error: ${e}`);
 }   
});
