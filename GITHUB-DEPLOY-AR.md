# 📤 دليل رفع المشروع على GitHub ونشره

## الخطوة 1️⃣: إنشاء Repository على GitHub

1. اذهب إلى https://github.com/new
2. اسم المشروع: `clinic-appointment-system`
3. اجعله **Public**
4. **لا تضف** README أو .gitignore (موجودين بالفعل)
5. اضغط "Create repository"

---

## الخطوة 2️⃣: رفع الكود (في Terminal)

```bash
cd "e:\Antigrafity projects\sass v1"

# تهيئة Git (إذا لم يكن موجود)
git init

# إضافة جميع الملفات
git add .

# أول Commit
git commit -m "Initial commit: Clinic Appointment System"

# ربط بـ GitHub (غيّر USERNAME باسم حسابك)
git remote add origin https://github.com/MinaSamirSHA/clinic-appointment-system.git

# رفع الكود
git branch -M main
git push -u origin main
```

---

## الخطوة 3️⃣: تفعيل GitHub Pages

### الطريقة الأولى: نشر Frontend فقط (أسهل)

1. اذهب إلى Settings في الـ Repository
2. اضغط على "Pages" من القائمة الجانبية
3. في "Source" اختر: **Deploy from a branch**
4. في "Branch" اختر: **main** و **/ (root)**
5. اضغط "Save"
6. انتظر 2-3 دقائق
7. الرابط سيكون: `https://minasamirsha.github.io/clinic-appointment-system/`

> ⚠️ **ملاحظة مهمة:** GitHub Pages يدعم الـ Frontend فقط (HTML/CSS/JS). الـ Backend يحتاج استضافة منفصلة.

---

## الخطوة 4️⃣: استضافة Backend (مجاناً)

### استخدام Railway.app:

1. اذهب إلى https://railway.app
2. سجل دخول بحساب GitHub
3. اضغط "New Project" → "Deploy from GitHub repo"
4. اختر `clinic-appointment-system`
5. اضغط "Add variables" وأضف:
   ```
   DATABASE_URL=postgresql://toota:Merna@localhost:5432/clinic_db
   JWT_SECRET=hawash-clinic-secret-2026-change-in-production
   PORT=3000
   NODE_ENV=production
   ```
6. Railway سيعطيك رابط مثل: `https://clinic-backend-production.up.railway.app`

### تحديث Frontend للاتصال بالـ Backend:

افتح `js/api-client.js` وغيّر:

```javascript
const API_BASE_URL = 'https://clinic-backend-production.up.railway.app/api';
```

ثم ارفع التعديل:
```bash
git add js/api-client.js
git commit -m "Update API URL for production"
git push
```

---

## ✅ النتيجة النهائية

- **Frontend:** https://minasamirsha.github.io/clinic-appointment-system/
- **Backend:** https://clinic-backend-production.up.railway.app
- **GitHub Repo:** https://github.com/MinaSamirSHA/clinic-appointment-system

---

## 🔧 استكشاف الأخطاء

### المشكلة: الصفحة تظهر 404
- تأكد من تفعيل GitHub Pages
- تأكد من اختيار branch الصحيح (main)

### المشكلة: API لا يعمل
- تأكد من رفع Backend على Railway
- تأكد من تحديث `API_BASE_URL` في الكود

### المشكلة: قاعدة البيانات لا تعمل
- Railway يوفر PostgreSQL مجاني
- اذهب إلى Dashboard → Add Database → PostgreSQL
- انسخ الـ `DATABASE_URL` الجديد وحدثه في المتغيرات
