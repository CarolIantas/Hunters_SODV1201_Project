// Small, dependency-free utilities used across pages

function showFieldError(elOrId, message) {
  const el = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
  if (!el) return;

  // set aria and create message node if missing
  el.setAttribute('aria-invalid', 'true');
  const id = el.id || ('err-' + Math.random().toString(36).slice(2,8));
  el.id = el.id || id;
  let msg = document.getElementById(el.id + '-error');
  if (!msg) {
    msg = document.createElement('p');
    msg.id = el.id + '-error';
    msg.className = 'text-red-600 text-sm mt-1';
    msg.setAttribute('role','alert');
    el.insertAdjacentElement('afterend', msg);
  }
  msg.textContent = message;
  msg.classList.remove('hidden');
}

function clearFieldError(elOrId) {
  const el = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
  if (!el) return;
  el.removeAttribute('aria-invalid');
  const msg = document.getElementById((el.id || '') + '-error');
  if (msg) msg.remove();
}

function validateEmail(email) {
  // regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkPasswordStrength(pw) {
  // returns {ok: boolean, message: string}
  if (!pw || pw.length < 8) return {ok:false, message: 'Password must be at least 8 characters.'};
  if (!/[A-Z]/.test(pw)) return {ok:false, message: 'Add at least one uppercase letter.'};
  if (!/[a-z]/.test(pw)) return {ok:false, message: 'Add at least one lowercase letter.'};
  if (!/[0-9]/.test(pw)) return {ok:false, message: 'Add at least one number.'};
  if (!/[^A-Za-z0-9]/.test(pw)) return {ok:false, message: 'Add at least one special character (e.g. !@#$%).'};
  return {ok:true, message: ''};
}

function formatPhoneInput(value) {
  // keep digits and format as (123) 456-7890 for 10 digits
  const digits = (value || '').replace(/\D/g, '').slice(0,10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

// Attach phone formatter helper to an input element (id or element)
function attachPhoneFormatter(elOrId) {
  const el = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
  if (!el) return;
  el.addEventListener('input', function(e) {
    const start = el.selectionStart;
    const newVal = formatPhoneInput(el.value);
    el.value = newVal;
  });
}

// Export for module-less pages (global)
window.appUtils = { showFieldError, clearFieldError, validateEmail, checkPasswordStrength, formatPhoneInput, attachPhoneFormatter };
