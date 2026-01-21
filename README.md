# 🏥 Clinic Appointment SaaS

> A bilingual (Arabic/English) clinic appointment management system designed for small clinics in Egypt. Start with LocalStorage MVP, optionally integrate with Google Sheets, and scale to a full backend when ready.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Arabic Support](https://img.shields.io/badge/Arabic-Supported-green.svg)]()
[![English Support](https://img.shields.io/badge/English-Supported-green.svg)]()

---

## ✨ Features

### 🌐 Bilingual Support
- **Arabic & English** interface with instant toggle
- **RTL layout** for Arabic
- **Localized** date and time formats

### 💾 Flexible Data Storage
- **LocalStorage MVP**: No backend required to start
- **Google Sheets Integration**: Optional cloud backup
- **Backend Ready**: Architected for easy migration to PostgreSQL/MySQL

### 📱 Responsive Design
- **Mobile-first** approach
- Works on all devices (phones, tablets, desktops)
- **Modern UI** with glassmorphism and smooth animations

### 👥 Multi-Tenant Architecture
- Each clinic has isolated data
- Role-based access control (Owner, Doctor, Secretary)
- Secure authentication ready

### 📅 Appointment Management
- **Easy booking** for patients
- **Time slot** availability checking
- **Status tracking** (Pending, Confirmed, Completed, Cancelled)
- **Dashboard** for clinic staff

### 🔔 Notification Ready
- Architecture for **WhatsApp** integration
- **SMS** fallback support
- Automated reminders and confirmations

---

## 🚀 Quick Start

### 1. Clone or Download

```bash
git clone <repository-url>
cd "sass v1"
```

### 2. Open in Browser

#### **🌐 Live URL (Recommended)**
Visit the application directly at:
**[https://minasamirsha.github.io/clinic-appointment-system/](https://minasamirsha.github.io/clinic-appointment-system/)**

#### **💻 Local Run**
Simply open `index.html` in your web browser:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 3. Start Using

1. **Register a Clinic**: Click "تسجيل عيادة" (Register Clinic)
2. **Book Appointment**: Click "حجز موعد" (Book Appointment)
3. **Login**: Use the email and password you registered with
4. **Manage**: View dashboard to manage appointments

---

## 📁 Project Structure

```
sass v1/
├── index.html                          # Main entry point
├── css/
│   └── styles.css                      # Complete design system
├── js/
│   ├── app.js                          # Main application logic
│   ├── translations.js                 # Bilingual translations
│   ├── storage.js                      # LocalStorage management
│   ├── clinic-registration.js          # Clinic registration module
│   ├── patient-booking.js              # Patient booking module
│   ├── dashboard.js                    # Dashboard module
│   └── google-sheets.js                # Google Sheets integration
├── backend/
│   ├── database-schema.sql             # PostgreSQL schema
│   ├── api-design.md                   # REST API documentation
│   ├── auth-flow.md                    # Authentication flow
│   └── notification-architecture.md    # WhatsApp/SMS integration
├── google-sheets-setup.md              # Google Sheets setup guide
└── README.md                           # This file
```

---

## 🎯 Use Cases

### For Patients
1. Visit clinic's booking link
2. Fill in name and phone number
3. Select preferred date and time
4. Receive automatic confirmation via WhatsApp/SMS

### For Clinic Staff
1. Register clinic (one-time)
2. Share booking link with patients
3. View and manage appointments in dashboard
4. Update appointment status
5. Track patient history

---

## 🔧 Configuration

### Google Sheets Integration (Optional)

To enable Google Sheets backup:

1. Follow the [Google Sheets Setup Guide](google-sheets-setup.md)
2. Get your Web App URL
3. Enter it during clinic registration in the "Google Sheets URL" field

### Backend Migration (Future)

When ready to scale:

1. Set up PostgreSQL database using `backend/database-schema.sql`
2. Implement REST API following `backend/api-design.md`
3. Set up authentication using `backend/auth-flow.md`
4. Integrate notifications using `backend/notification-architecture.md`
5. Update frontend API calls to point to your backend

---

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern design with CSS variables
- **Vanilla JavaScript**: No framework dependencies
- **LocalStorage API**: Client-side data persistence

### Backend (Architecture)
- **Database**: PostgreSQL (schema provided)
- **API**: RESTful design (documented)
- **Authentication**: JWT with refresh tokens
- **Notifications**: WhatsApp Business API + SMS

### Fonts
- **Arabic**: Cairo (Google Fonts)
- **English**: Inter (Google Fonts)

---

## 📊 Data Model

### Core Entities
- **Clinics**: Multi-tenant clinic information
- **Users**: Staff with role-based access
- **Patients**: Patient records per clinic
- **Appointments**: Booking with status tracking
- **Notifications**: Message delivery logs
- **Testing Results:**
✅ Language toggle works flawlessly
✅ All UI elements translate correctly
✅ RTL/LTR layouts switch properly
✅ No text overflow or layout issues

**Live Deployment:**
🚀 **Site is live at:** [https://minasamirsha.github.io/clinic-appointment-system/](https://minasamirsha.github.io/clinic-appointment-system/)

**Screenshot Evidence:**
![Live Site Configuration](file:///C:/Users/hp/.gemini/antigravity/brain/4961e16c-92bf-4183-93ff-cd09551662db/github_pages_configuration_live_1769033511547.png)

---

## 🔐 Security

### Current (LocalStorage MVP)
- Client-side data storage
- Basic password validation
- No server-side security

### Production Ready
- **JWT Authentication**: Access + refresh tokens
- **Password Hashing**: bcrypt with salt
- **HTTPS Only**: Enforce SSL/TLS
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize all inputs
- **RBAC**: Role-based access control

See [auth-flow.md](backend/auth-flow.md) for details.

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🌍 Localization

### Supported Languages
- 🇪🇬 Arabic (العربية) - Default
- 🇬🇧 English

### Adding New Languages
1. Add translations to `js/translations.js`
2. Update language toggle in `js/app.js`

---

## 📈 Roadmap

### Phase 1: MVP (Current)
- ✅ Bilingual UI
- ✅ LocalStorage persistence
- ✅ Clinic registration
- ✅ Patient booking
- ✅ Dashboard
- ✅ Google Sheets integration

### Phase 2: Backend
- [ ] PostgreSQL database
- [ ] REST API implementation
- [ ] JWT authentication
- [ ] User management

### Phase 3: Notifications
- [ ] WhatsApp Business API
- [ ] SMS integration
- [ ] Email notifications
- [ ] Automated reminders

### Phase 4: Advanced Features
- [ ] Payment integration
- [ ] Medical records
- [ ] Prescription management
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💡 Support

For questions or issues:

- 📧 Email: info@clinicapp.com
- 📖 Documentation: See `backend/` folder
- 🐛 Issues: GitHub Issues (if applicable)

---

## 🙏 Acknowledgments

- **Google Fonts**: Cairo and Inter fonts
- **Design Inspiration**: Modern healthcare applications
- **Target Market**: Small clinics in Egypt

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Clinic Registration
![Clinic Registration](screenshots/registration.png)

### Patient Booking
![Patient Booking](screenshots/booking.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

---

## 🔄 Version History

### v1.0.0 (2026-01-22)
- Initial release
- Bilingual support (Arabic/English)
- LocalStorage MVP
- Google Sheets integration
- Complete backend architecture documentation

---

## 📞 Contact

**Project Maintainer**: Clinic App Team

**Website**: [Coming Soon]

**Made with ❤️ for Egyptian clinics**

---

## 🎓 Learning Resources

### For Developers
- [REST API Design](backend/api-design.md)
- [Authentication Flow](backend/auth-flow.md)
- [Database Schema](backend/database-schema.sql)
- [Notification Architecture](backend/notification-architecture.md)

### For Clinic Owners
- [Google Sheets Setup](google-sheets-setup.md)
- [User Guide](docs/user-guide.md) (Coming Soon)

---

**⭐ If you find this project useful, please consider giving it a star!**
