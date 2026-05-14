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
const availabilityMessages = {
    username: 'Username is already taken',
    email: 'This email is already registered'
};
const availabilityState = {
    username: { value: '', available: null, controller: null },
    email: { value: '', available: null, controller: null }
};
const availabilityTimers = {
    username: null,
    email: null
};

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
    if (/\s/.test(email) || !emailRegex.test(email)) return 'Invalid email format';
    return '';
};

const resetAvailability = (field) => {
    availabilityState[field].value = '';
    availabilityState[field].available = null;
    availabilityState[field].controller?.abort();
    availabilityState[field].controller = null;
    clearTimeout(availabilityTimers[field]);
};

const checkAvailability = async (field, value) => {
    availabilityState[field].controller?.abort();

    const controller = new AbortController();
    availabilityState[field].controller = controller;
    availabilityState[field].value = value;
    availabilityState[field].available = null;

    try {
        const response = await fetch(`/signup/check?field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}`, {
            signal: controller.signal
        });
        const data = await response.json();

        if (availabilityState[field].value !== value) return null;

        availabilityState[field].available = Boolean(data.success && data.available);

        if (!availabilityState[field].available) {
            setError(field, data.message || availabilityMessages[field]);
            return false;
        }

        setError(field, '');
        return true;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error(`${field} availability check failed:`, error);
        }
        return null;
    } finally {
        if (availabilityState[field].controller === controller) {
            availabilityState[field].controller = null;
        }
    }
};

const scheduleAvailabilityCheck = (field, value) => {
    clearTimeout(availabilityTimers[field]);
    availabilityTimers[field] = setTimeout(() => {
        checkAvailability(field, value);
    }, 450);
};

const ensureAvailability = async (field, value) => {
    const cached = availabilityState[field];

    if (cached.value === value && cached.available !== null) {
        if (!cached.available) setError(field, availabilityMessages[field]);
        return cached.available;
    }

    return await checkAvailability(field, value);
};

const getPasswordError = (password, showRequired = true) => {
    if (!password) return showRequired ? 'Please enter password' : '';
    if (password.length < 8) return 'Password must contain at least 8 characters';
    if (/\s/.test(password)) return 'Password cannot contain spaces';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9\s]/.test(password)) return 'Password must contain at least one special character';
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
    const username = usernameInput.value.trim();
    const usernameValidation = getUsernameError(username, false);

    if (usernameValidation) {
        resetAvailability('username');
        setError('username', usernameValidation);
        return;
    }

    setError('username', '');

    if (!username) {
        resetAvailability('username');
        return;
    }

    scheduleAvailabilityCheck('username', username);
});

emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim().toLowerCase();
    const emailValidation = email ? getEmailError(email) : '';

    if (emailValidation) {
        resetAvailability('email');
        setError('email', emailValidation);
        return;
    }

    setError('email', '');

    if (!email) {
        resetAvailability('email');
        return;
    }

    scheduleAvailabilityCheck('email', email);
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
    const email = emailInput.value.trim().toLowerCase();
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

    const [isUsernameAvailable, isEmailAvailable] = await Promise.all([
        ensureAvailability('username', username),
        ensureAvailability('email', email)
    ]);

    if (isUsernameAvailable === false || isEmailAvailable === false) {
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
