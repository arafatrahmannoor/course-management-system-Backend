const { body } = require('express-validator');

// Validation for course creation
const courseValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('instructor').notEmpty().withMessage('Instructor is required')
];

// Validation for purchase
const purchaseValidation = [
    body('courseId').notEmpty().withMessage('Course ID is required').isMongoId().withMessage('Invalid Course ID')
];

module.exports = { courseValidation, purchaseValidation };
