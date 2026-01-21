// Patient Booking Module
function initPatientBooking() {
    const form = document.getElementById('patientBookingForm');
    const clinicSelect = document.getElementById('selectClinic');
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');

    if (!form) return;

    // Set minimum date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    // Load time slots when clinic or date changes
    if (clinicSelect && timeSelect) {
        clinicSelect.addEventListener('change', () => loadTimeSlots());
        if (dateInput) {
            dateInput.addEventListener('change', () => loadTimeSlots());
        }
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const clinicId = clinicSelect?.value;

        if (!clinicId) {
            app.showNotification(t('noClinicSelected'), 'error');
            return;
        }

        const formData = {
            patientName: document.getElementById('patientName').value.trim(),
            patientPhone: document.getElementById('patientPhone').value.trim(),
            date: dateInput.value,
            time: timeSelect.value,
            notes: document.getElementById('notes')?.value.trim() || ''
        };

        // Validation
        if (!validatePatientBooking(formData)) {
            return;
        }

        try {
            // Save appointment
            const appointment = StorageManager.saveAppointment(clinicId, formData);

            // Get clinic info for Google Sheets
            const clinic = StorageManager.getClinicById(clinicId);

            // Optionally send to Google Sheets
            if (clinic && clinic.googleSheetsUrl) {
                await sendToGoogleSheets(clinic.googleSheetsUrl, {
                    type: 'appointment',
                    data: {
                        clinicName: clinic.name,
                        ...formData,
                        bookedAt: new Date().toISOString()
                    }
                });
            }

            // Show success message
            app.showNotification(t('bookingSuccess'), 'success');

            // Show confirmation details
            showBookingConfirmation(appointment, clinic);

            // Close modal after delay
            setTimeout(() => {
                document.querySelector('.modal-overlay')?.remove();
            }, 5000);

        } catch (error) {
            console.error('Booking error:', error);
            app.showNotification(t('bookingError'), 'error');
        }
    });
}

function loadTimeSlots() {
    const clinicSelect = document.getElementById('selectClinic');
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');

    if (!clinicSelect || !dateInput || !timeSelect) return;

    const clinicId = clinicSelect.value;
    const selectedDate = dateInput.value;

    if (!clinicId || !selectedDate) return;

    // Get clinic info
    const clinic = StorageManager.getClinicById(clinicId);

    // Get existing appointments for the selected date
    const existingAppointments = StorageManager.getClinicAppointments(clinicId)
        .filter(apt => apt.date === selectedDate)
        .map(apt => apt.time);

    // Generate time slots (9 AM to 9 PM, 30-minute intervals)
    const timeSlots = generateTimeSlots();

    // Clear existing options
    timeSelect.innerHTML = `<option value="">${t('selectTime')}</option>`;

    // Add available time slots
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.value;
        option.textContent = slot.label;

        // Disable if already booked
        if (existingAppointments.includes(slot.value)) {
            option.disabled = true;
            option.textContent += ` (${getCurrentLanguage() === 'ar' ? 'محجوز' : 'Booked'})`;
        }

        timeSelect.appendChild(option);
    });
}

function generateTimeSlots() {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 21; // 9 PM

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute of [0, 30]) {
            const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

            // Convert to 12-hour format for display
            const hour12 = hour > 12 ? hour - 12 : hour;
            const period = hour >= 12 ? 'PM' : 'AM';
            const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;

            slots.push({
                value: time24,
                label: getCurrentLanguage() === 'ar'
                    ? `${time24} (${period === 'PM' ? 'مساءً' : 'صباحاً'})`
                    : time12
            });
        }
    }

    return slots;
}

function validatePatientBooking(formData) {
    // Check required fields
    if (!formData.patientName || !formData.patientPhone || !formData.date || !formData.time) {
        app.showNotification(t('fillAllFields'), 'error');
        return false;
    }

    // Validate phone format (Egyptian format)
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(formData.patientPhone)) {
        app.showNotification(
            getCurrentLanguage() === 'ar'
                ? 'رقم الهاتف يجب أن يكون بصيغة مصرية صحيحة (مثال: 01012345678)'
                : 'Phone number must be in valid Egyptian format (e.g., 01012345678)',
            'error'
        );
        return false;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        app.showNotification(
            getCurrentLanguage() === 'ar'
                ? 'لا يمكن حجز موعد في الماضي'
                : 'Cannot book appointment in the past',
            'error'
        );
        return false;
    }

    return true;
}

function showBookingConfirmation(appointment, clinic) {
    const modal = document.querySelector('.modal-body');
    if (!modal) return;

    const confirmationHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h3 style="color: var(--success); margin-bottom: 1rem;">${t('bookingSuccess')}</h3>
            
            <div style="background: var(--bg-secondary); border-radius: var(--radius-xl); padding: 1.5rem; margin: 1.5rem 0; text-align: ${getCurrentLanguage() === 'ar' ? 'right' : 'left'};">
                <div style="margin-bottom: 1rem;">
                    <strong>${getCurrentLanguage() === 'ar' ? 'العيادة:' : 'Clinic:'}</strong> ${clinic.name}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>${getCurrentLanguage() === 'ar' ? 'المريض:' : 'Patient:'}</strong> ${appointment.patientName}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>${getCurrentLanguage() === 'ar' ? 'التاريخ:' : 'Date:'}</strong> ${formatDate(appointment.date)}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>${getCurrentLanguage() === 'ar' ? 'الوقت:' : 'Time:'}</strong> ${formatTime(appointment.time)}
                </div>
                ${appointment.notes ? `
                    <div>
                        <strong>${getCurrentLanguage() === 'ar' ? 'ملاحظات:' : 'Notes:'}</strong> ${appointment.notes}
                    </div>
                ` : ''}
            </div>
            
            <div style="background: linear-gradient(135deg, var(--primary-light), var(--secondary-light)); color: white; border-radius: var(--radius-lg); padding: 1rem; margin-top: 1.5rem;">
                <p style="margin: 0;">
                    📱 ${getCurrentLanguage() === 'ar'
            ? 'سيتم إرسال تأكيد عبر واتساب إلى رقمك قريباً'
            : 'A WhatsApp confirmation will be sent to your number soon'}
                </p>
            </div>
        </div>
    `;

    modal.innerHTML = confirmationHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const lang = getCurrentLanguage();

    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const hour12 = hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';

    if (getCurrentLanguage() === 'ar') {
        return `${timeString} (${period === 'PM' ? 'مساءً' : 'صباحاً'})`;
    } else {
        return `${hour12}:${minutes} ${period}`;
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initPatientBooking, validatePatientBooking, loadTimeSlots, generateTimeSlots };
}
