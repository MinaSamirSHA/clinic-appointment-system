// Clinic Registration Module
function initClinicRegistration() {
    const form = document.getElementById('clinicRegistrationForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('clinicName').value.trim(),
            ownerName: document.getElementById('ownerName').value.trim(),
            phone: document.getElementById('phoneNumber').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            specialty: document.getElementById('specialty').value.trim(),
            workingHours: document.getElementById('workingHours').value.trim(),
            googleSheetsUrl: document.getElementById('googleSheetsUrl').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };

        // Validation
        if (!validateClinicRegistration(formData)) {
            return;
        }

        // Remove confirmPassword before saving
        delete formData.confirmPassword;

        try {
            // Save to LocalStorage
            const clinic = StorageManager.saveClinic(formData);

            // Optionally send to Google Sheets
            if (formData.googleSheetsUrl) {
                await sendToGoogleSheets(formData.googleSheetsUrl, {
                    type: 'clinic_registration',
                    data: {
                        ...formData,
                        password: undefined, // Don't send password to sheets
                        registeredAt: new Date().toISOString()
                    }
                });
            }

            // Show success message
            app.showNotification(t('registrationSuccess'), 'success');

            // Close modal
            setTimeout(() => {
                document.querySelector('.modal-overlay')?.remove();

                // Auto-login the user
                const user = StorageManager.authenticateUser(formData.email, formData.password);
                if (user) {
                    app.currentUser = user;
                    app.updateUIForLoggedInUser();
                }
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            app.showNotification(t('registrationError'), 'error');
        }
    });
}

function validateClinicRegistration(formData) {
    // Check required fields
    const requiredFields = ['name', 'ownerName', 'phone', 'email', 'address', 'specialty', 'workingHours', 'password', 'confirmPassword'];

    for (const field of requiredFields) {
        if (!formData[field]) {
            app.showNotification(t('fillAllFields'), 'error');
            return false;
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        app.showNotification(getCurrentLanguage() === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format', 'error');
        return false;
    }

    // Validate phone format (Egyptian format)
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
        app.showNotification(
            getCurrentLanguage() === 'ar'
                ? 'رقم الهاتف يجب أن يكون بصيغة مصرية صحيحة (مثال: 01012345678)'
                : 'Phone number must be in valid Egyptian format (e.g., 01012345678)',
            'error'
        );
        return false;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
        app.showNotification(t('passwordMismatch'), 'error');
        return false;
    }

    // Validate password strength
    if (formData.password.length < 6) {
        app.showNotification(
            getCurrentLanguage() === 'ar'
                ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
                : 'Password must be at least 6 characters',
            'error'
        );
        return false;
    }

    // Check if email already exists
    const clinics = StorageManager.getAllClinics();
    if (clinics.some(c => c.email === formData.email)) {
        app.showNotification(
            getCurrentLanguage() === 'ar'
                ? 'البريد الإلكتروني مسجل بالفعل'
                : 'Email already registered',
            'error'
        );
        return false;
    }

    return true;
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initClinicRegistration, validateClinicRegistration };
}
