const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

class AuthController {
    // Register new clinic with owner user
    async register(req, res) {
        const client = await db.pool.connect();

        try {
            await client.query('BEGIN');

            const {
                name,
                ownerName,
                phone,
                email,
                address,
                specialty,
                workingHours,
                password
            } = req.body;

            // Check if email already exists
            const emailCheck = await client.query(
                'SELECT id FROM users WHERE email = $1',
                [email]
            );

            if (emailCheck.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert clinic
            const clinicResult = await client.query(
                `INSERT INTO clinics (name, phone, email, address, specialty, working_hours, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'active')
         RETURNING id, name, phone, email, address, specialty, working_hours, created_at`,
                [name, phone, email, address, specialty, workingHours]
            );

            const clinic = clinicResult.rows[0];

            // Insert owner user
            const userResult = await client.query(
                `INSERT INTO users (clinic_id, name, email, password, role, status)
         VALUES ($1, $2, $3, $4, 'owner', 'active')
         RETURNING id, name, email, role`,
                [clinic.id, ownerName, email, hashedPassword]
            );

            const user = userResult.rows[0];

            await client.query('COMMIT');

            // Generate tokens
            const accessToken = jwt.sign(
                { userId: user.id, clinicId: clinic.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '24h' }
            );

            const refreshToken = jwt.sign(
                { userId: user.id, clinicId: clinic.id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
            );

            res.status(201).json({
                success: true,
                message: 'Clinic registered successfully',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    clinic: {
                        id: clinic.id,
                        name: clinic.name,
                        phone: clinic.phone,
                        email: clinic.email,
                        address: clinic.address,
                        specialty: clinic.specialty,
                        workingHours: clinic.working_hours
                    },
                    tokens: {
                        accessToken,
                        refreshToken
                    }
                }
            });

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration'
            });
        } finally {
            client.release();
        }
    }

    // Login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user with clinic info
            const result = await db.query(
                `SELECT u.id, u.name, u.email, u.password, u.role, u.clinic_id,
                c.name as clinic_name, c.phone as clinic_phone, c.specialty
         FROM users u
         JOIN clinics c ON u.clinic_id = c.id
         WHERE u.email = $1 AND u.status = 'active' AND c.status = 'active'`,
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const user = result.rows[0];

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate tokens
            const accessToken = jwt.sign(
                { userId: user.id, clinicId: user.clinic_id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '24h' }
            );

            const refreshToken = jwt.sign(
                { userId: user.id, clinicId: user.clinic_id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        clinicId: user.clinic_id,
                        clinicName: user.clinic_name
                    },
                    tokens: {
                        accessToken,
                        refreshToken
                    }
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    }

    // Get current user info
    async me(req, res) {
        try {
            const result = await db.query(
                `SELECT u.id, u.name, u.email, u.role, u.clinic_id,
                c.name as clinic_name, c.phone as clinic_phone, 
                c.email as clinic_email, c.specialty, c.working_hours
         FROM users u
         JOIN clinics c ON u.clinic_id = c.id
         WHERE u.id = $1`,
                [req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const user = result.rows[0];

            res.json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    clinic: {
                        id: user.clinic_id,
                        name: user.clinic_name,
                        phone: user.clinic_phone,
                        email: user.clinic_email,
                        specialty: user.specialty,
                        workingHours: user.working_hours
                    }
                }
            });

        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Refresh token
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token required'
                });
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            // Generate new access token
            const accessToken = jwt.sign(
                { userId: decoded.userId, clinicId: decoded.clinicId, role: decoded.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '24h' }
            );

            res.json({
                success: true,
                data: {
                    accessToken
                }
            });

        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }
    }
}

module.exports = new AuthController();
