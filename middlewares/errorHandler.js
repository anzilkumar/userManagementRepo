const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
        const message = field === 'email' ? 'Email not available' : 'Username not available';

        return res.status(409).json({
            success: false,
            errors: { [field || 'username']: message }
        });
    }

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server error'
    });
};

export default errorHandler;
