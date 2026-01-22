const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const clinicsController = require('../controllers/clinicsController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

// Get all clinics (public)
router.get('/', clinicsController.getAll);

// Get clinic by ID (public)
router.get('/:id', clinicsController.getById);

// Update clinic (protected, owner only)
router.put('/:id', authMiddleware, [
    body('name').optional().trim().notEmpty().withMessage('Clinic name cannot be empty'),
    body('phone').optional().matches(/^01[0-2,5]{1}[0-9]{8}$/).withMessage('Invalid Egyptian phone number'),
    body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
    body('specialty').optional().trim().notEmpty().withMessage('Specialty cannot be empty'),
    body('workingHours').optional().trim().notEmpty().withMessage('Working hours cannot be empty'),
    validate
], clinicsController.update);

module.exports = router;
