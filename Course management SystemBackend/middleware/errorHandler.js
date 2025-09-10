const { validationResult } = require('express-validator');

// Centralized error handler middleware
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        errors: err.errors || undefined
    });
}

// Validation result checker middleware
function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = { errorHandler, validateRequest };
