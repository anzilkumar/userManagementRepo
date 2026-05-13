const loginForm = document.querySelector('.admin-form');
const usernameError = document.querySelector('#usernameError');
const usernameInput = document.querySelector('#username');
const passwordError = document.querySelector('#passwordError');
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('#togglePassword');

usernameInput.addEventListener('input', () => {
    usernameError.textContent = '';
});

passwordInput.addEventListener('input', () => {
    if (usernameError.textContent === 'Please enter username and password') {
        usernameError.textContent = '';
    }

    passwordError.textContent = '';
});

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('custom-slash');
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    usernameError.textContent = '';
    passwordError.textContent = '';
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Frontend Validation
    if (!username && !password) {
        usernameError.textContent = 'Please enter username and password';
        return;
    }
    if (!username) {
        usernameError.textContent = 'Please enter username';
        return;
    }
    if (!password) {
        passwordError.textContent = 'Please enter password';
        return;
    }
    
    // Backend Authentication (AJAX)
    try {
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            window.location.href = data.redirectUrl;
        } else {
            if (data.field === 'password') {
                passwordError.textContent = data.message;
            } else {
                usernameError.textContent = data.message || 'Invalid username or password';
            }
        }
    } catch (error) {
        console.error('Login request failed:', error);
    }
});
