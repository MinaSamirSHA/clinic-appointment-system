-- Database Schema for Clinic Appointment SaaS
-- Database-agnostic SQL (PostgreSQL syntax)
-- Supports multi-tenant architecture

-- ===========================
-- Clinics Table
-- ===========================
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    working_hours VARCHAR(255) NOT NULL,
    google_sheets_url TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    subscription_plan VARCHAR(50) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_clinics_email ON clinics(email);
CREATE INDEX idx_clinics_status ON clinics(status);

-- ===========================
-- Users Table (Multi-role support)
-- ===========================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'doctor', 'secretary', 'admin')),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(clinic_id, email)
);

-- Indexes
CREATE INDEX idx_users_clinic_id ON users(clinic_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ===========================
-- Patients Table
-- ===========================
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    medical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(clinic_id, phone)
);

-- Indexes
CREATE INDEX idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_name ON patients(name);

-- ===========================
-- Appointments Table
-- ===========================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    cancellation_reason TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    reminder_sent_at TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(clinic_id, appointment_date, appointment_time)
);

-- Indexes
CREATE INDEX idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);

-- ===========================
-- Notifications Table
-- ===========================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(255),
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('whatsapp', 'sms', 'email')),
    message_template VARCHAR(50) NOT NULL CHECK (message_template IN ('appointment_confirmation', 'appointment_reminder', 'appointment_cancellation', 'appointment_rescheduled')),
    message_content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_notifications_clinic_id ON notifications(clinic_id);
CREATE INDEX idx_notifications_appointment_id ON notifications(appointment_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- ===========================
-- Audit Log Table
-- ===========================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_audit_logs_clinic_id ON audit_logs(clinic_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ===========================
-- Sessions Table (for JWT refresh tokens)
-- ===========================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL UNIQUE,
    device_info TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- ===========================
-- Triggers for updated_at
-- ===========================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================
-- Views for Common Queries
-- ===========================

-- View for today's appointments with patient and doctor info
CREATE VIEW todays_appointments AS
SELECT 
    a.id,
    a.clinic_id,
    c.name AS clinic_name,
    a.appointment_date,
    a.appointment_time,
    a.status,
    p.name AS patient_name,
    p.phone AS patient_phone,
    u.name AS doctor_name,
    a.notes
FROM appointments a
JOIN clinics c ON a.clinic_id = c.id
JOIN patients p ON a.patient_id = p.id
LEFT JOIN users u ON a.doctor_id = u.id
WHERE a.appointment_date = CURRENT_DATE
ORDER BY a.appointment_time;

-- View for clinic statistics
CREATE VIEW clinic_statistics AS
SELECT 
    c.id AS clinic_id,
    c.name AS clinic_name,
    COUNT(DISTINCT p.id) AS total_patients,
    COUNT(DISTINCT a.id) AS total_appointments,
    COUNT(DISTINCT CASE WHEN a.appointment_date = CURRENT_DATE THEN a.id END) AS today_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'pending' THEN a.id END) AS pending_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'confirmed' THEN a.id END) AS confirmed_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) AS completed_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'cancelled' THEN a.id END) AS cancelled_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'no_show' THEN a.id END) AS no_show_appointments
FROM clinics c
LEFT JOIN patients p ON c.id = p.clinic_id
LEFT JOIN appointments a ON c.id = a.clinic_id
GROUP BY c.id, c.name;

-- ===========================
-- Sample Data (for testing)
-- ===========================

-- Insert sample clinic
-- INSERT INTO clinics (name, owner_name, phone, email, address, specialty, working_hours)
-- VALUES ('عيادة د. أحمد', 'د. أحمد محمد', '01012345678', 'ahmed@clinic.com', 'شارع الجمهورية، القاهرة', 'باطنة', 'من 9 صباحاً إلى 5 مساءً');

-- ===========================
-- Comments
-- ===========================

COMMENT ON TABLE clinics IS 'Stores clinic information for multi-tenant support';
COMMENT ON TABLE users IS 'Stores user accounts with role-based access control';
COMMENT ON TABLE patients IS 'Stores patient information per clinic';
COMMENT ON TABLE appointments IS 'Stores appointment bookings with status tracking';
COMMENT ON TABLE notifications IS 'Stores notification history for WhatsApp/SMS/Email';
COMMENT ON TABLE audit_logs IS 'Stores audit trail for all important actions';
COMMENT ON TABLE sessions IS 'Stores user sessions for JWT refresh token management';
