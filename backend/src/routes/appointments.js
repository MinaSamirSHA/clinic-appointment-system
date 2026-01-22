const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const appointmentsController = require('../controllers/appointmentsController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

// Create appointment (public - for patients)
router.post('/', [
    body('clinicId').isInt().withMessage('Valid clinic ID is required'),
    body('patientName').trim().notEmpty().withMessage('Patient name is required'),
    body('patientPhone').matches(/^01[0-2,5]{1}[0-9]{8}$/).withMessage('Invalid Egyptian phone number'),
    body('date').isDate().withMessage('Valid date is required'),
    body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required (HH:MM)'),
    body('notes').optional().trim(),
    validate
], appointmentsController.create);

// Get appointments for clinic (protected)
router.get('/clinic/:clinicId', authMiddleware, appointmentsController.getByClinic);

// Get appointment by ID (protected)
router.get('/:id', authMiddleware, appointmentsController.getById);

// Update appointment status (protected)
router.patch('/:id/status', authMiddleware, [
    body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
    validate
], appointmentsController.updateStatus);

// Delete appointment (protected)
router.delete('/:id', authMiddleware, appointmentsController.delete);

module.exports = router;
