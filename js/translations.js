// Bilingual translations for Arabic and English
const translations = {
    ar: {
        // Navigation
        appName: 'نظام حجز المواعيد',
        navHome: 'الرئيسية',
        navFeatures: 'المميزات',
        navAbout: 'عن النظام',
        navLogin: 'تسجيل الدخول',
        
        // Hero Section
        heroTitle: 'نظام إدارة المواعيد للعيادات',
        heroSubtitle: 'حل متكامل وبسيط لإدارة مواعيد العيادات الصغيرة في مصر',
        registerClinic: 'تسجيل عيادة',
        bookAppointment: 'حجز موعد',
        heroCardTitle: 'موعد اليوم',
        heroCardPatient: 'أحمد محمد',
        heroCardPatient2: 'سارة علي',
        heroCardPatient3: 'محمود حسن',
        
        // Features Section
        featuresTitle: 'لماذا تختار نظامنا؟',
        featuresSubtitle: 'مميزات تجعل إدارة عيادتك أسهل وأكثر احترافية',
        feature1Title: 'بدون تكاليف مبدئية',
        feature1Desc: 'ابدأ مجاناً بدون الحاجة لخادم أو اشتراكات مدفوعة',
        feature2Title: 'متوافق مع الجوال',
        feature2Desc: 'يعمل بكفاءة على جميع الأجهزة المحمولة والحواسيب',
        feature3Title: 'تنبيهات تلقائية',
        feature3Desc: 'إرسال تأكيدات عبر واتساب ورسائل SMS للمرضى',
        feature4Title: 'متعدد المستخدمين',
        feature4Desc: 'صلاحيات مختلفة للطبيب والسكرتيرة والمدير',
        feature5Title: 'تكامل مع Google Sheets',
        feature5Desc: 'حفظ البيانات اختيارياً في جداول Google',
        feature6Title: 'قابل للتطوير',
        feature6Desc: 'جاهز للربط بقاعدة بيانات حقيقية لاحقاً',
        
        // About Section
        aboutTitle: 'عن النظام',
        aboutDesc1: 'نظام حجز المواعيد مصمم خصيصاً للعيادات الصغيرة في مصر. نحن نفهم التحديات التي تواجهها العيادات في إدارة المواعيد والتواصل مع المرضى.',
        aboutDesc2: 'يتيح لك النظام البدء فوراً بدون تكاليف، مع إمكانية التطوير والتوسع حسب احتياجاتك. سواء كنت تدير عيادة صغيرة أو مركز طبي، نظامنا يوفر لك الأدوات اللازمة لإدارة مواعيدك باحترافية.',
        statFree: 'مجاني للبدء',
        statAvailable: 'متاح دائماً',
        statScalable: 'قابل للتوسع',
        aboutCardTitle: 'كيف يعمل النظام؟',
        step1: 'سجل عيادتك في دقائق',
        step2: 'شارك رابط الحجز مع المرضى',
        step3: 'يحجز المريض موعده بسهولة',
        step4: 'يصل تأكيد تلقائي عبر واتساب',
        
        // Footer
        footerAbout: 'عن النظام',
        footerAboutText: 'حل متكامل لإدارة مواعيد العيادات الصغيرة في مصر',
        footerQuickLinks: 'روابط سريعة',
        footerContact: 'تواصل معنا',
        footerEmail: 'البريد الإلكتروني:',
        footerCopyright: '© 2026 نظام حجز المواعيد. جميع الحقوق محفوظة.',
        
        // Clinic Registration
        clinicRegTitle: 'تسجيل عيادة جديدة',
        clinicRegSubtitle: 'املأ البيانات التالية لتسجيل عيادتك',
        clinicName: 'اسم العيادة',
        clinicNamePlaceholder: 'مثال: عيادة د. أحمد',
        ownerName: 'اسم المالك',
        ownerNamePlaceholder: 'د. أحمد محمد',
        phoneNumber: 'رقم الهاتف',
        phonePlaceholder: '01012345678',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'clinic@example.com',
        address: 'العنوان',
        addressPlaceholder: 'شارع، حي، مدينة',
        specialty: 'التخصص',
        specialtyPlaceholder: 'مثال: باطنة، أطفال، أسنان',
        workingHours: 'ساعات العمل',
        workingHoursPlaceholder: 'من 9 صباحاً إلى 5 مساءً',
        googleSheetsUrl: 'رابط Google Sheets (اختياري)',
        googleSheetsPlaceholder: 'https://script.google.com/...',
        password: 'كلمة المرور',
        passwordPlaceholder: 'أدخل كلمة مرور قوية',
        confirmPassword: 'تأكيد كلمة المرور',
        confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
        submitRegistration: 'تسجيل العيادة',
        cancel: 'إلغاء',
        registrationSuccess: 'تم تسجيل العيادة بنجاح!',
        registrationError: 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.',
        passwordMismatch: 'كلمتا المرور غير متطابقتين',
        fillAllFields: 'يرجى ملء جميع الحقول المطلوبة',
        
        // Patient Booking
        bookingTitle: 'حجز موعد',
        bookingSubtitle: 'اختر العيادة واحجز موعدك',
        selectClinic: 'اختر العيادة',
        selectClinicPlaceholder: 'اختر من القائمة',
        patientName: 'اسم المريض',
        patientNamePlaceholder: 'الاسم الكامل',
        patientPhone: 'رقم الهاتف',
        patientPhonePlaceholder: '01012345678',
        appointmentDate: 'تاريخ الموعد',
        appointmentTime: 'وقت الموعد',
        selectTime: 'اختر الوقت',
        notes: 'ملاحظات (اختياري)',
        notesPlaceholder: 'أي ملاحظات خاصة',
        submitBooking: 'تأكيد الحجز',
        bookingSuccess: 'تم حجز الموعد بنجاح!',
        bookingError: 'حدث خطأ أثناء الحجز. حاول مرة أخرى.',
        noClinicSelected: 'يرجى اختيار عيادة',
        noClinicsAvailable: 'لا توجد عيادات متاحة حالياً',
        confirmationMessage: 'سيتم إرسال تأكيد عبر واتساب إلى رقمك',
        
        // Dashboard
        dashboardTitle: 'لوحة التحكم',
        welcomeBack: 'مرحباً بعودتك',
        todayAppointments: 'مواعيد اليوم',
        allAppointments: 'جميع المواعيد',
        patients: 'المرضى',
        settings: 'الإعدادات',
        logout: 'تسجيل الخروج',
        noAppointments: 'لا توجد مواعيد',
        appointmentsList: 'قائمة المواعيد',
        patientsList: 'قائمة المرضى',
        time: 'الوقت',
        date: 'التاريخ',
        status: 'الحالة',
        actions: 'الإجراءات',
        confirmed: 'مؤكد',
        pending: 'قيد الانتظار',
        cancelled: 'ملغي',
        completed: 'مكتمل',
        confirm: 'تأكيد',
        cancelAppointment: 'إلغاء',
        complete: 'إكمال',
        view: 'عرض',
        edit: 'تعديل',
        delete: 'حذف',
        
        // Login
        loginTitle: 'تسجيل الدخول',
        loginSubtitle: 'ادخل إلى لوحة التحكم',
        loginButton: 'دخول',
        loginError: 'بيانات الدخول غير صحيحة',
        noAccount: 'ليس لديك حساب؟',
        registerNow: 'سجل الآن',
        
        // Common
        close: 'إغلاق',
        save: 'حفظ',
        search: 'بحث',
        filter: 'تصفية',
        export: 'تصدير',
        import: 'استيراد',
        loading: 'جاري التحميل...',
        success: 'نجح!',
        error: 'خطأ!',
        warning: 'تحذير',
        info: 'معلومة',
        yes: 'نعم',
        no: 'لا',
        required: 'مطلوب',
        optional: 'اختياري'
    },
    
    en: {
        // Navigation
        appName: 'Clinic Appointment System',
        navHome: 'Home',
        navFeatures: 'Features',
        navAbout: 'About',
        navLogin: 'Login',
        
        // Hero Section
        heroTitle: 'Clinic Appointment Management System',
        heroSubtitle: 'A complete and simple solution for managing appointments in small clinics in Egypt',
        registerClinic: 'Register Clinic',
        bookAppointment: 'Book Appointment',
        heroCardTitle: "Today's Appointments",
        heroCardPatient: 'Ahmed Mohamed',
        heroCardPatient2: 'Sara Ali',
        heroCardPatient3: 'Mahmoud Hassan',
        
        // Features Section
        featuresTitle: 'Why Choose Our System?',
        featuresSubtitle: 'Features that make managing your clinic easier and more professional',
        feature1Title: 'No Initial Costs',
        feature1Desc: 'Start for free without needing a server or paid subscriptions',
        feature2Title: 'Mobile Compatible',
        feature2Desc: 'Works efficiently on all mobile devices and computers',
        feature3Title: 'Automatic Notifications',
        feature3Desc: 'Send confirmations via WhatsApp and SMS to patients',
        feature4Title: 'Multi-User',
        feature4Desc: 'Different permissions for doctor, secretary, and manager',
        feature5Title: 'Google Sheets Integration',
        feature5Desc: 'Optionally save data in Google Sheets',
        feature6Title: 'Scalable',
        feature6Desc: 'Ready to connect to a real database later',
        
        // About Section
        aboutTitle: 'About the System',
        aboutDesc1: 'The appointment booking system is designed specifically for small clinics in Egypt. We understand the challenges clinics face in managing appointments and communicating with patients.',
        aboutDesc2: 'The system allows you to start immediately at no cost, with the ability to develop and expand according to your needs. Whether you manage a small clinic or medical center, our system provides you with the tools needed to manage your appointments professionally.',
        statFree: 'Free to Start',
        statAvailable: 'Always Available',
        statScalable: 'Scalable',
        aboutCardTitle: 'How Does It Work?',
        step1: 'Register your clinic in minutes',
        step2: 'Share the booking link with patients',
        step3: 'Patient books their appointment easily',
        step4: 'Automatic confirmation arrives via WhatsApp',
        
        // Footer
        footerAbout: 'About the System',
        footerAboutText: 'A complete solution for managing appointments in small clinics in Egypt',
        footerQuickLinks: 'Quick Links',
        footerContact: 'Contact Us',
        footerEmail: 'Email:',
        footerCopyright: '© 2026 Clinic Appointment System. All rights reserved.',
        
        // Clinic Registration
        clinicRegTitle: 'Register New Clinic',
        clinicRegSubtitle: 'Fill in the following information to register your clinic',
        clinicName: 'Clinic Name',
        clinicNamePlaceholder: 'Example: Dr. Ahmed Clinic',
        ownerName: 'Owner Name',
        ownerNamePlaceholder: 'Dr. Ahmed Mohamed',
        phoneNumber: 'Phone Number',
        phonePlaceholder: '01012345678',
        email: 'Email',
        emailPlaceholder: 'clinic@example.com',
        address: 'Address',
        addressPlaceholder: 'Street, District, City',
        specialty: 'Specialty',
        specialtyPlaceholder: 'Example: Internal Medicine, Pediatrics, Dentistry',
        workingHours: 'Working Hours',
        workingHoursPlaceholder: 'From 9 AM to 5 PM',
        googleSheetsUrl: 'Google Sheets URL (Optional)',
        googleSheetsPlaceholder: 'https://script.google.com/...',
        password: 'Password',
        passwordPlaceholder: 'Enter a strong password',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Re-enter password',
        submitRegistration: 'Register Clinic',
        cancel: 'Cancel',
        registrationSuccess: 'Clinic registered successfully!',
        registrationError: 'An error occurred during registration. Please try again.',
        passwordMismatch: 'Passwords do not match',
        fillAllFields: 'Please fill in all required fields',
        
        // Patient Booking
        bookingTitle: 'Book Appointment',
        bookingSubtitle: 'Select clinic and book your appointment',
        selectClinic: 'Select Clinic',
        selectClinicPlaceholder: 'Choose from list',
        patientName: 'Patient Name',
        patientNamePlaceholder: 'Full Name',
        patientPhone: 'Phone Number',
        patientPhonePlaceholder: '01012345678',
        appointmentDate: 'Appointment Date',
        appointmentTime: 'Appointment Time',
        selectTime: 'Select Time',
        notes: 'Notes (Optional)',
        notesPlaceholder: 'Any special notes',
        submitBooking: 'Confirm Booking',
        bookingSuccess: 'Appointment booked successfully!',
        bookingError: 'An error occurred during booking. Please try again.',
        noClinicSelected: 'Please select a clinic',
        noClinicsAvailable: 'No clinics available at the moment',
        confirmationMessage: 'A confirmation will be sent via WhatsApp to your number',
        
        // Dashboard
        dashboardTitle: 'Dashboard',
        welcomeBack: 'Welcome Back',
        todayAppointments: "Today's Appointments",
        allAppointments: 'All Appointments',
        patients: 'Patients',
        settings: 'Settings',
        logout: 'Logout',
        noAppointments: 'No appointments',
        appointmentsList: 'Appointments List',
        patientsList: 'Patients List',
        time: 'Time',
        date: 'Date',
        status: 'Status',
        actions: 'Actions',
        confirmed: 'Confirmed',
        pending: 'Pending',
        cancelled: 'Cancelled',
        completed: 'Completed',
        confirm: 'Confirm',
        cancelAppointment: 'Cancel',
        complete: 'Complete',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        
        // Login
        loginTitle: 'Login',
        loginSubtitle: 'Access your dashboard',
        loginButton: 'Login',
        loginError: 'Invalid credentials',
        noAccount: "Don't have an account?",
        registerNow: 'Register Now',
        
        // Common
        close: 'Close',
        save: 'Save',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
        warning: 'Warning',
        info: 'Info',
        yes: 'Yes',
        no: 'No',
        required: 'Required',
        optional: 'Optional'
    }
};

// Get current language from localStorage or default to Arabic
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ar';
}

// Set language
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    updatePageContent();
}

// Update all translatable content on the page
function updatePageContent() {
    const lang = getCurrentLanguage();
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // Check if element is an input placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

// Get translation for a specific key
function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || key;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, getCurrentLanguage, setLanguage, updatePageContent, t };
}
