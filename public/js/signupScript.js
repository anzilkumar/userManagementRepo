const signupForm = document.querySelector('.signup-form');
const usernameError = document.querySelector('#usernameError');
const usernameInput = document.querySelector('#username');
const emailError = document.querySelector('#emailError');
const emailInput = document.querySelector('#email');
const passwordError = document.querySelector('#passwordError');
const passwordInput = document.querySelector('#password');
const confirmPasswordError = document.querySelector('#confirmPasswordError');
const confirmPasswordInput = document.querySelector('#confirmPassword');
const togglePasswords = document.querySelectorAll('.toggle-password');

const setError = (field, message) => {
    const errorElement = {
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
    }[field];

    if (errorElement) {
        errorElement.textContent = message || '';
    }
};

const clearErrors = () => {
    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
};

const getUsernameError = (username, showRequired = true) => {
    if (!username) return showRequired ? 'Please enter username' : '';
    if (username.length < 3 || username.length > 20) return 'Username must contain 3 to 20 characters';
    if (/\s/.test(username)) return 'Spaces are not allowed in username';
    if (!/^[a-z0-9_.]+$/.test(username)) {
        return 'Use only letters (a-z), numbers (0-9), underscore (_) and dot (.)';
    }
    if (username.includes('..')) return "Do not use two dots together like '..'";
    if (username.startsWith('.')) return "Username cannot start with '.'";
    if (username.endsWith('.')) return "Username cannot end with '.'";
    return '';
};

const getEmailError = (email) => {
    const emailRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

    if (!email) return 'Please enter email address';
    if (/\s/.test(email) || !emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
};

const getPasswordError = (password, showRequired = true) => {
    if (!password) return showRequired ? 'Please enter password' : '';
    if (password.length < 6) return 'Password must contain at least 6 characters';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    return '';
};

const getPasswordErrors = (password, confirmPassword) => {
    const errors = {};
    const passwordError = getPasswordError(password);

    if (passwordError) errors.password = passwordError;
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';

    if (!errors.confirmPassword && password && password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
};

usernameInput.addEventListener('input', () => {
    setError('username', getUsernameError(usernameInput.value.trim(), false));
});

emailInput.addEventListener('input', () => {
    setError('email', '');
});

passwordInput.addEventListener('input', () => {
    setError('password', getPasswordError(passwordInput.value, false));
});

confirmPasswordInput.addEventListener('input', () => {
    if (!confirmPasswordInput.value || passwordInput.value === confirmPasswordInput.value) {
        setError('confirmPassword', '');
        return;
    }

    setError('confirmPassword', 'Passwords do not match');
});

togglePasswords.forEach(icon => {
    icon.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('custom-slash');
    });
});

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const errors = {};
    const usernameValidation = getUsernameError(username);
    const emailValidation = getEmailError(email);
    const passwordValidation = getPasswordErrors(password, confirmPassword);

    if (usernameValidation) errors.username = usernameValidation;
    if (emailValidation) errors.email = emailValidation;
    Object.assign(errors, passwordValidation);

    if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([field, message]) => setError(field, message));
        return;
    }

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, confirmPassword })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = data.redirectUrl;
            return;
        }

        if (data.errors) {
            Object.entries(data.errors).forEach(([field, message]) => setError(field, message));
        }
    } catch (error) {
        console.error('Signup request failed:', error);
    }
});
