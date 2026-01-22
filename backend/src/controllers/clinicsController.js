const db = require('../config/database');

class ClinicsController {
    // Get all clinics (public)
    async getAll(req, res) {
        try {
            const result = await db.query(
                `SELECT id, name, phone, email, address, specialty, working_hours, created_at
         FROM clinics
         WHERE status = 'active'
         ORDER BY created_at DESC`
            );

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            console.error('Get clinics error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Get clinic by ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            const result = await db.query(
                `SELECT id, name, phone, email, address, specialty, working_hours, created_at
         FROM clinics
         WHERE id = $1 AND status = 'active'`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Clinic not found'
                });
            }

            res.json({
                success: true,
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Get clinic error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Update clinic (owner only)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, phone, address, specialty, workingHours } = req.body;

            // Check if user owns this clinic
            if (req.user.clinicId !== parseInt(id)) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this clinic'
                });
            }

            const result = await db.query(
                `UPDATE clinics
         SET name = $1, phone = $2, address = $3, specialty = $4, working_hours = $5, updated_at = NOW()
         WHERE id = $6 AND status = 'active'
         RETURNING id, name, phone, email, address, specialty, working_hours, updated_at`,
                [name, phone, address, specialty, workingHours, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Clinic not found'
                });
            }

            res.json({
                success: true,
                message: 'Clinic updated successfully',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Update clinic error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
}

module.exports = new ClinicsController();
