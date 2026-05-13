export const getCookieValue = (req, name) => {
    const cookies = req.headers.cookie || '';
    const match = cookies
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${name}=`));

    if (!match) return '';

    return decodeURIComponent(match.slice(name.length + 1));
};

export const hasCookie = (req, name, value) => getCookieValue(req, name) === value;
