// Main Application Logic
class ClinicApp {
    constructor() {
        this.currentLanguage = getCurrentLanguage();
        this.currentUser = null;
        this.init();
    }

    init() {
        // Set initial language
        setLanguage(this.currentLanguage);

        // Setup event listeners
        this.setupEventListeners();

        // Check if user is logged in
        this.checkAuth();

        // Initialize smooth scrolling
        this.initSmoothScroll();
    }

    setupEventListeners() {
        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Register clinic button
        const registerClinicBtn = document.getElementById('registerClinicBtn');
        if (registerClinicBtn) {
            registerClinicBtn.addEventListener('click', () => this.showClinicRegistration());
        }

        // Book appointment button
        const bookAppointmentBtn = document.getElementById('bookAppointmentBtn');
        if (bookAppointmentBtn) {
            bookAppointmentBtn.addEventListener('click', () => this.showPatientBooking());
        }

        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLogin());
        }

        // Navigation links smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    toggleLanguage() {
        const newLang = this.currentLanguage === 'ar' ? 'en' : 'ar';
        this.currentLanguage = newLang;
        setLanguage(newLang);

        // Update language toggle button text
        const langText = document.getElementById('langText');
        if (langText) {
            langText.textContent = newLang === 'ar' ? 'EN' : 'AR';
        }
    }

    toggleMobileMenu() {
        const nav = document.getElementById('mainNav');
        if (nav) {
            nav.classList.toggle('mobile-active');
        }
    }

    checkAuth() {
        const user = StorageManager.getCurrentUser();
        if (user) {
            this.currentUser = user;
            this.updateUIForLoggedInUser();
        }
    }

    updateUIForLoggedInUser() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && this.currentUser) {
            loginBtn.textContent = this.currentUser.name;
            loginBtn.onclick = () => this.showDashboard();
        }
    }

    showClinicRegistration() {
        const modal = this.createModal({
            title: t('clinicRegTitle'),
            content: this.getClinicRegistrationForm(),
            size: 'large'
        });

        document.getElementById('modalContainer').appendChild(modal);

        // Initialize clinic registration handler
        if (typeof initClinicRegistration === 'function') {
            initClinicRegistration();
        }
    }

    showPatientBooking() {
        const modal = this.createModal({
            title: t('bookingTitle'),
            content: this.getPatientBookingForm(),
            size: 'large'
        });

        document.getElementById('modalContainer').appendChild(modal);

        // Initialize patient booking handler
        if (typeof initPatientBooking === 'function') {
            initPatientBooking();
        }
    }

    showLogin() {
        const modal = this.createModal({
            title: t('loginTitle'),
            content: this.getLoginForm(),
            size: 'medium'
        });

        document.getElementById('modalContainer').appendChild(modal);
        this.initLoginForm();
    }

    showDashboard() {
        if (!this.currentUser) {
            this.showLogin();
            return;
        }

        // Redirect to dashboard (will be handled by dashboard.js)
        window.location.href = '#dashboard';

        if (typeof initDashboard === 'function') {
            initDashboard(this.currentUser);
        }
    }

    createModal({ title, content, size = 'medium' }) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal modal-${size}">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
            }
        });

        return overlay;
    }

    getClinicRegistrationForm() {
        return `
            <form id="clinicRegistrationForm" class="registration-form">
                <p class="form-subtitle">${t('clinicRegSubtitle')}</p>
                
                <div class="form-group">
                    <label class="form-label" for="clinicName">${t('clinicName')} <span style="color: var(--error)">*</span></label>
                    <input type="text" id="clinicName" class="form-input" placeholder="${t('clinicNamePlaceholder')}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="ownerName">${t('ownerName')} <span style="color: var(--error)">*</span></label>
                    <input type="text" id="ownerName" class="form-input" placeholder="${t('ownerNamePlaceholder')}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="phoneNumber">${t('phoneNumber')} <span style="color: var(--error)">*</span></label>
                    <input type="tel" id="phoneNumber" class="form-input" placeholder="${t('phonePlaceholder')}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="email">${t('email')} <span style="color: var(--error)">*</span></label>
                    <input type="email" id="email" class="form-input" placeholder="${t('emailPlaceholder')}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="address">${t('address')} <span style="color: var(--error)">*</span></label>
                    <input type="text" id="address" class="form-input" placeholder="${t('addressPlaceholder')}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="specialty">${t('specialty')} <span style="color: var(--error)">*</span></label>
                    <input type="text" id="specialty" class="form-input" placeholder="${t('specialtyPlaceholder')}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="workingHours">${t('workingHours')} <span style="color: var(--error)">*</span></label>
                    <input type="text" id="workingHours" class="form-input" placeholder="${t('workingHoursPlaceholder')}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="googleSheetsUrl">${t('googleSheetsUrl')}</label>
                    <input type="url" id="googleSheetsUrl" class="form-input" placeholder="${t('googleSheetsPlaceholder')}">
                    <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">${t('optional')}</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="password">${t('password')} <span style="color: var(--error)">*</span></label>
                    <div style="position: relative;">
                        <input type="password" id="password" class="form-input" placeholder="${t('passwordPlaceholder')}" required style="padding-right: 3rem;">
                        <button type="button" class="password-toggle" onclick="togglePasswordVisibility('password')" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0.5rem;" aria-label="Toggle password visibility">
                            <svg id="password-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="confirmPassword">${t('confirmPassword')} <span style="color: var(--error)">*</span></label>
                    <div style="position: relative;">
                        <input type="password" id="confirmPassword" class="form-input" placeholder="${t('confirmPasswordPlaceholder')}" required style="padding-right: 3rem;">
                        <button type="button" class="password-toggle" onclick="togglePasswordVisibility('confirmPassword')" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0.5rem;" aria-label="Toggle password visibility">
                            <svg id="confirmPassword-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">${t('cancel')}</button>
                    <button type="submit" class="btn btn-primary">${t('submitRegistration')}</button>
                </div>
            </form>
        `;
    }

    getPatientBookingForm() {
        const clinics = StorageManager.getAllClinics();
        const clinicOptions = clinics.map(clinic =>
            `<option value="${clinic.id}">${clinic.name}</option>`
        ).join('');

        return `
            <form id="patientBookingForm" class="booking-form">
                <p class="form-subtitle">${t('bookingSubtitle')}</p>
                
                ${clinics.length === 0 ? `
                    <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                        <p>${t('noClinicsAvailable')}</p>
                    </div>
                ` : `
                    <div class="form-group">
                        <label class="form-label" for="selectClinic">${t('selectClinic')} <span style="color: var(--error)">*</span></label>
                        <select id="selectClinic" class="form-select" required>
                            <option value="">${t('selectClinicPlaceholder')}</option>
                            ${clinicOptions}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="patientName">${t('patientName')} <span style="color: var(--error)">*</span></label>
                        <input type="text" id="patientName" class="form-input" placeholder="${t('patientNamePlaceholder')}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="patientPhone">${t('patientPhone')} <span style="color: var(--error)">*</span></label>
                        <input type="tel" id="patientPhone" class="form-input" placeholder="${t('patientPhonePlaceholder')}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="appointmentDate">${t('appointmentDate')} <span style="color: var(--error)">*</span></label>
                        <input type="date" id="appointmentDate" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="appointmentTime">${t('appointmentTime')} <span style="color: var(--error)">*</span></label>
                        <select id="appointmentTime" class="form-select" required>
                            <option value="">${t('selectTime')}</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="notes">${t('notes')}</label>
                        <textarea id="notes" class="form-textarea" placeholder="${t('notesPlaceholder')}"></textarea>
                    </div>
                    
                    <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-lg); margin-bottom: 1rem;">
                        <p style="color: var(--text-secondary); font-size: var(--font-size-sm);">
                            ℹ️ ${t('confirmationMessage')}
                        </p>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">${t('cancel')}</button>
                        <button type="submit" class="btn btn-primary">${t('submitBooking')}</button>
                    </div>
                `}
            </form>
        `;
    }

    getLoginForm() {
        return `
            <form id="loginForm" class="login-form">
                <p class="form-subtitle">${t('loginSubtitle')}</p>
                
                <div class="form-group">
                    <label class="form-label" for="loginEmail">${t('email')}</label>
                    <input type="email" id="loginEmail" class="form-input" placeholder="${t('emailPlaceholder')}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="loginPassword">${t('password')}</label>
                    <div style="position: relative;">
                        <input type="password" id="loginPassword" class="form-input" placeholder="${t('passwordPlaceholder')}" required style="padding-right: 3rem;">
                        <button type="button" class="password-toggle" onclick="togglePasswordVisibility('loginPassword')" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0.5rem;" aria-label="Toggle password visibility">
                            <svg id="loginPassword-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">${t('cancel')}</button>
                    <button type="submit" class="btn btn-primary">${t('loginButton')}</button>
                </div>
                
                <div style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
                    <p>${t('noAccount')} <a href="#" onclick="app.showClinicRegistration(); this.closest('.modal-overlay').remove();" style="color: var(--primary-color); font-weight: 600;">${t('registerNow')}</a></p>
                </div>
            </form>
        `;
    }

    initLoginForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                try {
                    const response = await apiClient.login(email, password);

                    if (response.success) {
                        this.currentUser = response.data.user;
                        this.updateUIForLoggedInUser();
                        document.querySelector('.modal-overlay').remove();
                        this.showNotification(t('success'), 'success');
                        this.showDashboard();
                    }
                } catch (error) {
                    this.showNotification(error.message || t('loginError'), 'error');
                }
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 5rem;
            right: 1rem;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)'};
            color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        if (getCurrentLanguage() === 'ar') {
            notification.style.right = 'auto';
            notification.style.left = '1rem';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    initSmoothScroll() {
        // Add smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

// Password visibility toggle function
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(`${inputId}-icon`);

    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        // Change to eye-off icon
        icon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        input.type = 'password';
        // Change back to eye icon
        icon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// Initialize app when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new ClinicApp();
    });
} else {
    app = new ClinicApp();
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    html[dir="rtl"] @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    html[dir="rtl"] @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);
