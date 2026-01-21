// Dashboard Module
function initDashboard(user) {
    if (!user || !user.clinicId) {
        console.error('No user or clinic ID provided');
        return;
    }

    const container = document.getElementById('modalContainer');
    if (!container) return;

    // Create dashboard modal
    const dashboardHTML = createDashboardHTML(user);
    container.innerHTML = dashboardHTML;

    // Load dashboard data
    loadDashboardData(user.clinicId);

    // Setup event listeners
    setupDashboardEventListeners(user.clinicId);
}

function createDashboardHTML(user) {
    return `
        <div class="modal-overlay" style="align-items: flex-start; padding-top: 2rem;">
            <div class="modal" style="max-width: 1200px; max-height: 95vh;">
                <div class="modal-header">
                    <div>
                        <h2 class="modal-title">${t('dashboardTitle')}</h2>
                        <p style="color: var(--text-secondary); margin-top: 0.25rem;">${t('welcomeBack')}, ${user.name}</p>
                    </div>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <button class="btn btn-outline" id="logoutBtn">
                            ${t('logout')}
                        </button>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="modal-body" style="padding: 0;">
                    <!-- Dashboard Tabs -->
                    <div class="dashboard-tabs" style="display: flex; border-bottom: 2px solid var(--border-light); padding: 0 1.5rem;">
                        <button class="dashboard-tab active" data-tab="overview" style="padding: 1rem 1.5rem; border: none; background: none; cursor: pointer; border-bottom: 3px solid var(--primary-color); font-weight: 600; color: var(--primary-color);">
                            ${t('todayAppointments')}
                        </button>
                        <button class="dashboard-tab" data-tab="appointments" style="padding: 1rem 1.5rem; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 600; color: var(--text-secondary);">
                            ${t('allAppointments')}
                        </button>
                        <button class="dashboard-tab" data-tab="patients" style="padding: 1rem 1.5rem; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 600; color: var(--text-secondary);">
                            ${t('patients')}
                        </button>
                        <button class="dashboard-tab" data-tab="settings" style="padding: 1rem 1.5rem; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 600; color: var(--text-secondary);">
                            ${t('settings')}
                        </button>
                    </div>
                    
                    <!-- Dashboard Content -->
                    <div class="dashboard-content" style="padding: 1.5rem;">
                        <div id="overviewTab" class="dashboard-tab-content">
                            <div id="statsCards" class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;"></div>
                            <div id="todayAppointmentsList"></div>
                        </div>
                        
                        <div id="appointmentsTab" class="dashboard-tab-content" style="display: none;">
                            <div id="allAppointmentsList"></div>
                        </div>
                        
                        <div id="patientsTab" class="dashboard-tab-content" style="display: none;">
                            <div id="patientsList"></div>
                        </div>
                        
                        <div id="settingsTab" class="dashboard-tab-content" style="display: none;">
                            <div id="clinicSettings"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupDashboardEventListeners(clinicId) {
    // Tab switching
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.dashboard-tab').forEach(t => {
                t.classList.remove('active');
                t.style.borderBottomColor = 'transparent';
                t.style.color = 'var(--text-secondary)';
            });
            tab.classList.add('active');
            tab.style.borderBottomColor = 'var(--primary-color)';
            tab.style.color = 'var(--primary-color)';

            // Show corresponding content
            const tabName = tab.getAttribute('data-tab');
            document.querySelectorAll('.dashboard-tab-content').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(`${tabName}Tab`).style.display = 'block';

            // Load tab-specific data
            if (tabName === 'appointments') {
                loadAllAppointments(clinicId);
            } else if (tabName === 'patients') {
                loadPatients(clinicId);
            } else if (tabName === 'settings') {
                loadSettings(clinicId);
            }
        });
    });

    // Logout button
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        StorageManager.logout();
        app.currentUser = null;
        document.querySelector('.modal-overlay')?.remove();

        // Update UI
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.textContent = t('navLogin');
            loginBtn.onclick = () => app.showLogin();
        }

        app.showNotification(getCurrentLanguage() === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'success');
    });
}

function loadDashboardData(clinicId) {
    const stats = StorageManager.getClinicStats(clinicId);

    // Render stats cards
    const statsContainer = document.getElementById('statsCards');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card" style="background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: white; padding: 1.5rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
                <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem;">${stats.todayAppointments}</div>
                <div style="opacity: 0.9;">${t('todayAppointments')}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, var(--secondary-color), var(--secondary-dark)); color: white; padding: 1.5rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
                <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem;">${stats.totalAppointments}</div>
                <div style="opacity: 0.9;">${t('allAppointments')}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, var(--accent-color), var(--accent-light)); color: white; padding: 1.5rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
                <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem;">${stats.totalPatients}</div>
                <div style="opacity: 0.9;">${t('patients')}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 1.5rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
                <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem;">${stats.pendingAppointments}</div>
                <div style="opacity: 0.9;">${t('pending')}</div>
            </div>
        `;
    }

    // Load today's appointments
    loadTodayAppointments(clinicId);
}

function loadTodayAppointments(clinicId) {
    const appointments = StorageManager.getTodayAppointments(clinicId);
    const container = document.getElementById('todayAppointmentsList');

    if (!container) return;

    if (appointments.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📅</div>
                <p>${t('noAppointments')}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <h3 style="margin-bottom: 1rem;">${t('todayAppointments')}</h3>
        <div class="appointments-list">
            ${appointments.map(apt => createAppointmentCard(apt, clinicId)).join('')}
        </div>
    `;
}

function loadAllAppointments(clinicId) {
    const appointments = StorageManager.getClinicAppointments(clinicId);
    const container = document.getElementById('allAppointmentsList');

    if (!container) return;

    if (appointments.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <p>${t('noAppointments')}</p>
            </div>
        `;
        return;
    }

    // Sort by date and time
    appointments.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB - dateA;
    });

    container.innerHTML = `
        <h3 style="margin-bottom: 1rem;">${t('appointmentsList')}</h3>
        <div class="appointments-list">
            ${appointments.map(apt => createAppointmentCard(apt, clinicId)).join('')}
        </div>
    `;
}

function createAppointmentCard(appointment, clinicId) {
    const statusColors = {
        pending: 'var(--warning)',
        confirmed: 'var(--info)',
        completed: 'var(--success)',
        cancelled: 'var(--error)'
    };

    return `
        <div class="appointment-card" style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--radius-xl); margin-bottom: 1rem; border-left: 4px solid ${statusColors[appointment.status]};">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">${appointment.patientName}</h4>
                    <p style="color: var(--text-secondary); margin-bottom: 0.25rem;">📞 ${appointment.patientPhone}</p>
                    <p style="color: var(--text-secondary);">📅 ${formatDate(appointment.date)} • ⏰ ${formatTime(appointment.time)}</p>
                </div>
                <span style="padding: 0.5rem 1rem; background: ${statusColors[appointment.status]}; color: white; border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600;">
                    ${t(appointment.status)}
                </span>
            </div>
            ${appointment.notes ? `<p style="color: var(--text-secondary); font-style: italic; margin-bottom: 1rem;">💬 ${appointment.notes}</p>` : ''}
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${appointment.status === 'pending' ? `
                    <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="updateAppointmentStatus('${clinicId}', '${appointment.id}', 'confirmed')">
                        ${t('confirm')}
                    </button>
                ` : ''}
                ${appointment.status === 'confirmed' ? `
                    <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="updateAppointmentStatus('${clinicId}', '${appointment.id}', 'completed')">
                        ${t('complete')}
                    </button>
                ` : ''}
                ${appointment.status !== 'cancelled' && appointment.status !== 'completed' ? `
                    <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem; color: var(--error); border-color: var(--error);" onclick="updateAppointmentStatus('${clinicId}', '${appointment.id}', 'cancelled')">
                        ${t('cancelAppointment')}
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

function loadPatients(clinicId) {
    const patients = StorageManager.getClinicPatients(clinicId);
    const container = document.getElementById('patientsList');

    if (!container) return;

    if (patients.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <p>${getCurrentLanguage() === 'ar' ? 'لا يوجد مرضى' : 'No patients'}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <h3 style="margin-bottom: 1rem;">${t('patientsList')}</h3>
        <div class="patients-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
            ${patients.map(patient => `
                <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--radius-xl);">
                    <h4 style="margin-bottom: 0.5rem;">${patient.name}</h4>
                    <p style="color: var(--text-secondary);">📞 ${patient.phone}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function loadSettings(clinicId) {
    const clinic = StorageManager.getClinicById(clinicId);
    const container = document.getElementById('clinicSettings');

    if (!container || !clinic) return;

    container.innerHTML = `
        <h3 style="margin-bottom: 1.5rem;">${t('settings')}</h3>
        <div style="background: var(--bg-secondary); padding: 2rem; border-radius: var(--radius-xl);">
            <div style="margin-bottom: 1.5rem;">
                <strong>${t('clinicName')}:</strong> ${clinic.name}
            </div>
            <div style="margin-bottom: 1.5rem;">
                <strong>${t('ownerName')}:</strong> ${clinic.ownerName}
            </div>
            <div style="margin-bottom: 1.5rem;">
                <strong>${t('phoneNumber')}:</strong> ${clinic.phone}
            </div>
            <div style="margin-bottom: 1.5rem;">
                <strong>${t('email')}:</strong> ${clinic.email}
            </div>
            <div style="margin-bottom: 1.5rem;">
                <strong>${t('address')}:</strong> ${clinic.address}
            </div>
            <div style="margin-bottom: 1.5rem;">
                <strong>${t('specialty')}:</strong> ${clinic.specialty}
            </div>
            <div style="margin-bottom: 1.5rem;">
                <strong>${t('workingHours')}:</strong> ${clinic.workingHours}
            </div>
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-light);">
                <button class="btn btn-primary" onclick="exportClinicData('${clinicId}')">
                    ${t('export')} ${getCurrentLanguage() === 'ar' ? 'البيانات' : 'Data'}
                </button>
            </div>
        </div>
    `;
}

// Global functions for button onclick handlers
function updateAppointmentStatus(clinicId, appointmentId, newStatus) {
    StorageManager.updateAppointment(clinicId, appointmentId, { status: newStatus });
    loadDashboardData(clinicId);
    loadAllAppointments(clinicId);
    app.showNotification(getCurrentLanguage() === 'ar' ? 'تم تحديث الحالة' : 'Status updated', 'success');
}

function exportClinicData(clinicId) {
    const data = StorageManager.exportClinicData(clinicId);
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clinic_data_${clinicId}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    app.showNotification(getCurrentLanguage() === 'ar' ? 'تم تصدير البيانات' : 'Data exported', 'success');
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initDashboard, updateAppointmentStatus, exportClinicData };
}
