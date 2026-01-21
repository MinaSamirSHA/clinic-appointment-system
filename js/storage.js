// LocalStorage Management with Multi-tenant Support
class StorageManager {
    static STORAGE_PREFIX = 'clinic_app_';

    // Generate unique ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Get item from localStorage
    static getItem(key) {
        try {
            const item = localStorage.getItem(this.STORAGE_PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    // Set item in localStorage
    static setItem(key, value) {
        try {
            localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    }

    // Remove item from localStorage
    static removeItem(key) {
        try {
            localStorage.removeItem(this.STORAGE_PREFIX + key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    // Clear all app data
    static clearAll() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // ===========================
    // Clinic Management
    // ===========================

    static saveClinic(clinicData) {
        const clinics = this.getAllClinics();
        const clinic = {
            id: this.generateId(),
            ...clinicData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        clinics.push(clinic);
        this.setItem('clinics', clinics);

        // Create clinic-specific storage
        this.setItem(`clinic_${clinic.id}_appointments`, []);
        this.setItem(`clinic_${clinic.id}_patients`, []);
        this.setItem(`clinic_${clinic.id}_users`, [{
            id: this.generateId(),
            clinicId: clinic.id,
            name: clinicData.ownerName,
            email: clinicData.email,
            password: clinicData.password, // In production, this should be hashed
            role: 'owner',
            createdAt: new Date().toISOString()
        }]);

        return clinic;
    }

    static getAllClinics() {
        return this.getItem('clinics') || [];
    }

    static getClinicById(clinicId) {
        const clinics = this.getAllClinics();
        return clinics.find(clinic => clinic.id === clinicId);
    }

    static updateClinic(clinicId, updates) {
        const clinics = this.getAllClinics();
        const index = clinics.findIndex(clinic => clinic.id === clinicId);

        if (index !== -1) {
            clinics[index] = {
                ...clinics[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.setItem('clinics', clinics);
            return clinics[index];
        }

        return null;
    }

    static deleteClinic(clinicId) {
        const clinics = this.getAllClinics();
        const filtered = clinics.filter(clinic => clinic.id !== clinicId);
        this.setItem('clinics', filtered);

        // Clean up clinic-specific data
        this.removeItem(`clinic_${clinicId}_appointments`);
        this.removeItem(`clinic_${clinicId}_patients`);
        this.removeItem(`clinic_${clinicId}_users`);

        return true;
    }

    // ===========================
    // Appointment Management
    // ===========================

    static saveAppointment(clinicId, appointmentData) {
        const appointments = this.getClinicAppointments(clinicId);
        const appointment = {
            id: this.generateId(),
            clinicId,
            ...appointmentData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        appointments.push(appointment);
        this.setItem(`clinic_${clinicId}_appointments`, appointments);

        // Also save/update patient
        this.saveOrUpdatePatient(clinicId, {
            name: appointmentData.patientName,
            phone: appointmentData.patientPhone
        });

        return appointment;
    }

    static getClinicAppointments(clinicId) {
        return this.getItem(`clinic_${clinicId}_appointments`) || [];
    }

    static getAppointmentById(clinicId, appointmentId) {
        const appointments = this.getClinicAppointments(clinicId);
        return appointments.find(apt => apt.id === appointmentId);
    }

    static updateAppointment(clinicId, appointmentId, updates) {
        const appointments = this.getClinicAppointments(clinicId);
        const index = appointments.findIndex(apt => apt.id === appointmentId);

        if (index !== -1) {
            appointments[index] = {
                ...appointments[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.setItem(`clinic_${clinicId}_appointments`, appointments);
            return appointments[index];
        }

        return null;
    }

    static deleteAppointment(clinicId, appointmentId) {
        const appointments = this.getClinicAppointments(clinicId);
        const filtered = appointments.filter(apt => apt.id !== appointmentId);
        this.setItem(`clinic_${clinicId}_appointments`, filtered);
        return true;
    }

    static getTodayAppointments(clinicId) {
        const appointments = this.getClinicAppointments(clinicId);
        const today = new Date().toISOString().split('T')[0];
        return appointments.filter(apt => apt.date === today);
    }

    // ===========================
    // Patient Management
    // ===========================

    static saveOrUpdatePatient(clinicId, patientData) {
        const patients = this.getClinicPatients(clinicId);
        const existingIndex = patients.findIndex(p => p.phone === patientData.phone);

        if (existingIndex !== -1) {
            // Update existing patient
            patients[existingIndex] = {
                ...patients[existingIndex],
                ...patientData,
                updatedAt: new Date().toISOString()
            };
        } else {
            // Add new patient
            patients.push({
                id: this.generateId(),
                clinicId,
                ...patientData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        this.setItem(`clinic_${clinicId}_patients`, patients);
        return patients;
    }

    static getClinicPatients(clinicId) {
        return this.getItem(`clinic_${clinicId}_patients`) || [];
    }

    static getPatientById(clinicId, patientId) {
        const patients = this.getClinicPatients(clinicId);
        return patients.find(p => p.id === patientId);
    }

    static getPatientByPhone(clinicId, phone) {
        const patients = this.getClinicPatients(clinicId);
        return patients.find(p => p.phone === phone);
    }

    // ===========================
    // User Management & Authentication
    // ===========================

    static authenticateUser(email, password) {
        const clinics = this.getAllClinics();

        for (const clinic of clinics) {
            const users = this.getItem(`clinic_${clinic.id}_users`) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Set current session
                this.setItem('current_user', {
                    ...user,
                    clinicId: clinic.id,
                    clinicName: clinic.name
                });
                return user;
            }
        }

        return null;
    }

    static getCurrentUser() {
        return this.getItem('current_user');
    }

    static logout() {
        this.removeItem('current_user');
        return true;
    }

    static addUser(clinicId, userData) {
        const users = this.getItem(`clinic_${clinicId}_users`) || [];
        const user = {
            id: this.generateId(),
            clinicId,
            ...userData,
            createdAt: new Date().toISOString()
        };

        users.push(user);
        this.setItem(`clinic_${clinicId}_users`, users);
        return user;
    }

    // ===========================
    // Data Export/Import
    // ===========================

    static exportClinicData(clinicId) {
        const clinic = this.getClinicById(clinicId);
        const appointments = this.getClinicAppointments(clinicId);
        const patients = this.getClinicPatients(clinicId);
        const users = this.getItem(`clinic_${clinicId}_users`) || [];

        return {
            clinic,
            appointments,
            patients,
            users: users.map(u => ({ ...u, password: undefined })), // Don't export passwords
            exportedAt: new Date().toISOString()
        };
    }

    static exportAllData() {
        const data = {};
        const keys = Object.keys(localStorage);

        keys.forEach(key => {
            if (key.startsWith(this.STORAGE_PREFIX)) {
                const cleanKey = key.replace(this.STORAGE_PREFIX, '');
                data[cleanKey] = this.getItem(cleanKey);
            }
        });

        return {
            data,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
    }

    static importData(importData) {
        try {
            if (importData.version && importData.data) {
                Object.keys(importData.data).forEach(key => {
                    this.setItem(key, importData.data[key]);
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // ===========================
    // Statistics & Analytics
    // ===========================

    static getClinicStats(clinicId) {
        const appointments = this.getClinicAppointments(clinicId);
        const patients = this.getClinicPatients(clinicId);
        const today = new Date().toISOString().split('T')[0];

        return {
            totalAppointments: appointments.length,
            todayAppointments: appointments.filter(a => a.date === today).length,
            totalPatients: patients.length,
            pendingAppointments: appointments.filter(a => a.status === 'pending').length,
            confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
            completedAppointments: appointments.filter(a => a.status === 'completed').length,
            cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
