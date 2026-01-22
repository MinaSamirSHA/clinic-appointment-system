// Production Configuration
// استخدم هذا الملف عند النشر على GitHub Pages

const PRODUCTION_CONFIG = {
    // غيّر هذا الرابط بعد رفع Backend على Railway
    API_BASE_URL: 'https://your-backend-url.up.railway.app/api',

    // أو استخدم Backend محلي للتطوير
    // API_BASE_URL: 'http://localhost:3000/api',
};

// تحديث API Client للاستخدام في Production
if (typeof apiClient !== 'undefined') {
    apiClient.baseURL = PRODUCTION_CONFIG.API_BASE_URL;
}
