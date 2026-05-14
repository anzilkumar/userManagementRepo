import { resolveMx } from 'node:dns/promises';
import validator from 'validator';

const invalidEmailDomains = new Set([
    'gamil.com',
    'gmial.com',
    'gmail.coom',
    'yaho.com',
    'hotnail.com',
    'outllok.com'
]);

export const sanitizeEmail = (email = '') => email.trim().toLowerCase();

export const validateEmail = async (email) => {
    const sanitizedEmail = sanitizeEmail(email);

    if (!validator.isEmail(sanitizedEmail)) {
        return { isValid: false, email: sanitizedEmail, message: 'Invalid email format' };
    }

    const domain = sanitizedEmail.split('@').pop();

    if (!domain || invalidEmailDomains.has(domain)) {
        return { isValid: false, email: sanitizedEmail, message: 'Invalid email domain' };
    }

    try {
        const records = await resolveMx(domain);

        if (!records || records.length === 0) {
            return { isValid: false, email: sanitizedEmail, message: 'Email domain does not exist' };
        }
    } catch (error) {
        return { isValid: false, email: sanitizedEmail, message: 'Email domain does not exist' };
    }

    return { isValid: true, email: sanitizedEmail };
};
