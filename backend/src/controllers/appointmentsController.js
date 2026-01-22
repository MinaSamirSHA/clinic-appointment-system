const db = require('../config/database');

class AppointmentsController {
    // Create new appointment
    async create(req, res) {
        const client = await db.pool.connect();

        try {
            await client.query('BEGIN');

            const { clinicId, patientName, patientPhone, date, time, notes } = req.body;

            // Check if clinic exists
            const clinicCheck = await client.query(
                'SELECT id FROM clinics WHERE id = $1 AND status = $\'active\'',
                [clinicId]
            );

            if (clinicCheck.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'Clinic not found'
                });
            }

            // Check if slot is available
            const slotCheck = await client.query(
                `SELECT id FROM appointments
         WHERE clinic_id = $1 AND date = $2 AND time = $3 AND status != 'cancelled'`,
                [clinicId, date, time]
            );

            if (slotCheck.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: 'Time slot already booked'
                });
            }

            // Check if patient exists, if not create
            let patientResult = await client.query(
                'SELECT id FROM patients WHERE phone = $1 AND clinic_id = $2',
                [patientPhone, clinicId]
            );

            let patientId;
            if (patientResult.rows.length === 0) {
                // Create new patient
                const newPatient = await client.query(
                    'INSERT INTO patients (clinic_id, name, phone) VALUES ($1, $2, $3) RETURNING id',
                    [clinicId, patientName, patientPhone]
                );
                patientId = newPatient.rows[0].id;
            } else {
                patientId = patientResult.rows[0].id;
            }

            // Create appointment
            const appointmentResult = await client.query(
                `INSERT INTO appointments (clinic_id, patient_id, date, time, notes, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING id, clinic_id, patient_id, date, time, notes, status, created_at`,
                [clinicId, patientId, date, time, notes || null]
            );

            const appointment = appointmentResult.rows[0];

            await client.query('COMMIT');

            res.status(201).json({
                success: true,
                message: 'Appointment booked successfully',
                data: {
                    ...appointment,
                    patientName,
                    patientPhone
                }
            });

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Create appointment error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        } finally {
            client.release();
        }
    }

    // Get appointments for a clinic
    async getByClinic(req, res) {
        try {
            const { clinicId } = req.params;

            // Check authorization
            if (req.user.clinicId !== parseInt(clinicId)) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized'
                });
            }

            const result = await db.query(
                `SELECT a.id, a.date, a.time, a.notes, a.status, a.created_at,
                p.name as patient_name, p.phone as patient_phone
         FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         WHERE a.clinic_id = $1
         ORDER BY a.date DESC, a.time DESC`,
                [clinicId]
            );

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            console.error('Get appointments error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Get appointment by ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            const result = await db.query(
                `SELECT a.id, a.clinic_id, a.date, a.time, a.notes, a.status, a.created_at,
                p.name as patient_name, p.phone as patient_phone,
                c.name as clinic_name
         FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         JOIN clinics c ON a.clinic_id = c.id
         WHERE a.id = $1`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }

            const appointment = result.rows[0];

            // Check authorization
            if (req.user.clinicId !== appointment.clinic_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized'
                });
            }

            res.json({
                success: true,
                data: appointment
            });
        } catch (error) {
            console.error('Get appointment error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Update appointment status
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Validate status
            const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
            }

            // Check authorization
            const authCheck = await db.query(
                'SELECT clinic_id FROM appointments WHERE id = $1',
                [id]
            );

            if (authCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }

            if (req.user.clinicId !== authCheck.rows[0].clinic_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized'
                });
            }

            // Update status
            const result = await db.query(
                `UPDATE appointments
         SET status = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, status, updated_at`,
                [status, id]
            );

            res.json({
                success: true,
                message: 'Appointment status updated',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Update appointment status error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Delete appointment
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Check authorization
            const authCheck = await db.query(
                'SELECT clinic_id FROM appointments WHERE id = $1',
                [id]
            );

            if (authCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }

            if (req.user.clinicId !== authCheck.rows[0].clinic_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized'
                });
            }

            // Delete appointment
            await db.query('DELETE FROM appointments WHERE id = $1', [id]);

            res.json({
                success: true,
                message: 'Appointment deleted successfully'
            });
        } catch (error) {
            console.error('Delete appointment error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
}

module.exports = new AppointmentsController();
