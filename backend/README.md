# Clinic Appointment System - Backend API

Backend API built with Node.js, Express, and PostgreSQL for the Clinic Appointment Management System.

## 🚀 Features

- ✅ **Authentication** - JWT-based auth with access & refresh tokens
- ✅ **Clinics Management** - CRUD operations for clinics
- ✅ **Appointments** - Complete appointment booking system
- ✅ **Multi-tenant** - Each clinic has isolated data
- ✅ **Validation** - Input validation on all endpoints
- ✅ **Security** - Password hashing, JWT tokens, CORS

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/clinic_db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
FRONTEND_URL=http://localhost:5500
```

### 3. Setup Database

Create PostgreSQL database:
```bash
createdb clinic_db
```

Run the schema:
```bash
npm run init-db
```

## 🏃 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new clinic | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Clinics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/clinics` | Get all clinics | No |
| GET | `/api/clinics/:id` | Get clinic by ID | No |
| PUT | `/api/clinics/:id` | Update clinic | Yes (Owner) |

### Appointments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/appointments` | Book appointment | No |
| GET | `/api/appointments/clinic/:clinicId` | Get clinic appointments | Yes |
| GET | `/api/appointments/:id` | Get appointment by ID | Yes |
| PATCH | `/api/appointments/:id/status` | Update status | Yes |
| DELETE | `/api/appointments/:id` | Delete appointment | Yes |

## 📝 Example Requests

### Register Clinic
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "عيادة د. أحمد",
    "ownerName": "د. أحمد محمد",
    "phone": "01012345678",
    "email": "clinic@example.com",
    "address": "القاهرة",
    "specialty": "طب الأسنان",
    "workingHours": "9 AM - 5 PM",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "clinic@example.com",
    "password": "password123"
  }'
```

### Book Appointment
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clinicId": 1,
    "patientName": "أحمد محمد",
    "patientPhone": "01012345678",
    "date": "2026-01-25",
    "time": "10:00",
    "notes": "فحص دوري"
  }'
```

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- Input validation on all endpoints
- CORS configured for frontend domain
- SQL injection prevention (parameterized queries)

## 🚀 Deployment

### Railway (Recommended - Free Tier)

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Add PostgreSQL database
5. Set environment variables
6. Deploy automatically

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=<railway-postgres-url>
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<another-strong-secret>
FRONTEND_URL=https://your-frontend-domain.com
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Database connection
│   │   └── init-db.js       # Database initialization
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clinicsController.js
│   │   └── appointmentsController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── validate.js      # Input validation
│   ├── routes/
│   │   ├── auth.js
│   │   ├── clinics.js
│   │   └── appointments.js
│   └── server.js            # Main entry point
├── package.json
├── .env.example
└── README.md
```

## 🧪 Testing

Test the API with:
- Postman
- cURL
- Thunder Client (VS Code extension)

Health check:
```bash
curl http://localhost:3000/health
```

## 📞 Support

For issues or questions, check the main project documentation.

---

**Built with ❤️ by Hawash Group**
