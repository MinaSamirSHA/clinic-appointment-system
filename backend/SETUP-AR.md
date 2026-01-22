# دليل الإعداد السريع للـ Backend

## الخطوة 1: تثبيت المتطلبات ✅

### تثبيت Node.js
إذا لم يكن مثبتاً، حمّل من: https://nodejs.org (النسخة LTS)

### تثبيت PostgreSQL
حمّل من: https://www.postgresql.org/download/windows/

## الخطوة 2: إعداد قاعدة البيانات 🗄️

### افتح PowerShell واكتب:

```powershell
# انتقل لمجلد backend
cd "E:\Antigrafity projects\sass v1\backend"

# ثبّت التبعيات
npm install

# أنشئ ملف .env
copy .env.example .env
```

### عدّل ملف .env:
افتح `.env` وضع بياناتك:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/clinic_db
JWT_SECRET=hawash-clinic-secret-2026
JWT_REFRESH_SECRET=hawash-clinic-refresh-secret-2026
FRONTEND_URL=http://localhost:5500
```

### أنشئ قاعدة البيانات:

```powershell
# في PowerShell (كمسؤول)
# افتح PostgreSQL
psql -U postgres

# في PostgreSQL shell
CREATE DATABASE clinic_db;
\q
```

### شغّل السكيما:

```powershell
# في PowerShell
npm run init-db
```

## الخطوة 3: تشغيل السيرفر 🚀

```powershell
# للتطوير (مع auto-reload)
npm run dev

# أو للإنتاج
npm start
```

يجب أن ترى:
```
╔════════════════════════════════════════╗
║   🏥 Clinic Appointment System API    ║
║   ✅ Server running on port 3000      ║
║   🌐 Environment: development        ║
╚════════════════════════════════════════╝
```

## الخطوة 4: اختبار API 🧪

### افتح متصفح جديد:
```
http://localhost:3000/health
```

يجب أن ترى:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-22T..."
}
```

## الخطوة 5: اختبار التسجيل 📝

### استخدم Postman أو cURL:

```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"عيادة تجريبية\",\"ownerName\":\"د. أحمد\",\"phone\":\"01012345678\",\"email\":\"test@clinic.com\",\"address\":\"القاهرة\",\"specialty\":\"عام\",\"workingHours\":\"9-5\",\"password\":\"123456\"}"
```

## حل المشاكل الشائعة 🔧

### المشكلة: "Cannot find module"
**الحل:**
```powershell
npm install
```

### المشكلة: "Database connection error"
**الحل:**
1. تأكد أن PostgreSQL يعمل
2. تأكد من `DATABASE_URL` في `.env`
3. تأكد أن قاعدة البيانات موجودة

### المشكلة: "Port already in use"
**الحل:**
غيّر `PORT` في `.env` إلى 3001 أو أي رقم آخر

## الخطوة التالية 🎯

بعد تشغيل Backend بنجاح:
1. ✅ اختبر جميع الـ APIs
2. ✅ اربط Frontend بالـ Backend
3. ✅ انشر على Railway

---

**هل واجهت مشكلة؟** اسألني وسأساعدك! 😊
