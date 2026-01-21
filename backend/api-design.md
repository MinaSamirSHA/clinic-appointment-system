# REST API Design - Clinic Appointment SaaS

## Base URL
```
Production: https://api.clinicapp.com/v1
Development: http://localhost:3000/v1
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "timestamp": "2026-01-22T00:00:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  },
  "timestamp": "2026-01-22T00:00:00Z"
}
```

---

## Endpoints

### 1. Authentication

#### POST /auth/register
Register a new clinic and owner account.

**Request:**
```json
{
  "clinic": {
    "name": "عيادة د. أحمد",
    "ownerName": "د. أحمد محمد",
    "phone": "01012345678",
    "email": "ahmed@clinic.com",
    "address": "شارع الجمهورية، القاهرة",
    "specialty": "باطنة",
    "workingHours": "من 9 صباحاً إلى 5 مساءً",
    "googleSheetsUrl": "https://script.google.com/..."
  },
  "user": {
    "password": "securePassword123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clinic": {
      "id": "uuid",
      "name": "عيادة د. أحمد",
      ...
    },
    "user": {
      "id": "uuid",
      "name": "د. أحمد محمد",
      "email": "ahmed@clinic.com",
      "role": "owner"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token",
      "expiresIn": 3600
    }
  }
}
```

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "ahmed@clinic.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "د. أحمد محمد",
      "email": "ahmed@clinic.com",
      "role": "owner",
      "clinicId": "uuid"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token",
      "expiresIn": 3600
    }
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "expiresIn": 3600
  }
}
```

#### POST /auth/logout
Logout and invalidate refresh token.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. Clinics

#### GET /clinics/:clinicId
Get clinic details.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "عيادة د. أحمد",
    "ownerName": "د. أحمد محمد",
    "phone": "01012345678",
    "email": "ahmed@clinic.com",
    "address": "شارع الجمهورية، القاهرة",
    "specialty": "باطنة",
    "workingHours": "من 9 صباحاً إلى 5 مساءً",
    "status": "active",
    "subscriptionPlan": "free",
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

#### PATCH /clinics/:clinicId
Update clinic information.

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "name": "عيادة د. أحمد المحدثة",
  "workingHours": "من 10 صباحاً إلى 6 مساءً"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated clinic object */ }
}
```

#### GET /clinics/:clinicId/statistics
Get clinic statistics.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPatients": 150,
    "totalAppointments": 450,
    "todayAppointments": 12,
    "pendingAppointments": 5,
    "confirmedAppointments": 7,
    "completedAppointments": 380,
    "cancelledAppointments": 50,
    "noShowAppointments": 13
  }
}
```

---

### 3. Patients

#### POST /clinics/:clinicId/patients
Create a new patient.

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "name": "أحمد محمد",
  "phone": "01012345678",
  "email": "patient@example.com",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "address": "القاهرة",
  "medicalNotes": "ملاحظات طبية"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clinicId": "uuid",
    "name": "أحمد محمد",
    "phone": "01012345678",
    ...
  }
}
```

#### GET /clinics/:clinicId/patients
Get all patients for a clinic.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by name or phone

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [ /* array of patient objects */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### GET /clinics/:clinicId/patients/:patientId
Get patient details.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": { /* patient object */ }
}
```

#### PATCH /clinics/:clinicId/patients/:patientId
Update patient information.

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "phone": "01098765432",
  "medicalNotes": "ملاحظات محدثة"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated patient object */ }
}
```

---

### 4. Appointments

#### POST /clinics/:clinicId/appointments
Create a new appointment.

**Headers:** `Authorization: Bearer <access_token>` (optional for public booking)

**Request:**
```json
{
  "patientName": "أحمد محمد",
  "patientPhone": "01012345678",
  "appointmentDate": "2026-01-25",
  "appointmentTime": "10:00",
  "notes": "ملاحظات الموعد"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clinicId": "uuid",
    "patientId": "uuid",
    "appointmentDate": "2026-01-25",
    "appointmentTime": "10:00",
    "status": "pending",
    "notes": "ملاحظات الموعد",
    "createdAt": "2026-01-22T00:00:00Z"
  }
}
```

#### GET /clinics/:clinicId/appointments
Get all appointments for a clinic.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "appointments": [ /* array of appointment objects */ ],
    "pagination": { ... }
  }
}
```

#### GET /clinics/:clinicId/appointments/today
Get today's appointments.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": [ /* array of today's appointments */ ]
}
```

#### GET /clinics/:clinicId/appointments/:appointmentId
Get appointment details.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": { /* appointment object with patient and doctor details */ }
}
```

#### PATCH /clinics/:clinicId/appointments/:appointmentId
Update appointment (status, time, etc.).

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "status": "confirmed",
  "doctorId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated appointment object */ }
}
```

#### DELETE /clinics/:clinicId/appointments/:appointmentId
Cancel an appointment.

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "cancellationReason": "سبب الإلغاء"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

#### GET /clinics/:clinicId/appointments/available-slots
Get available time slots for a specific date.

**Headers:** `Authorization: Bearer <access_token>` (optional)

**Query Parameters:**
- `date` (required): Date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-01-25",
    "availableSlots": [
      { "time": "09:00", "available": true },
      { "time": "09:30", "available": true },
      { "time": "10:00", "available": false },
      ...
    ]
  }
}
```

---

### 5. Notifications

#### POST /clinics/:clinicId/notifications/send
Send a notification (WhatsApp/SMS).

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "appointmentId": "uuid",
  "notificationType": "whatsapp",
  "messageTemplate": "appointment_confirmation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "sent",
    "sentAt": "2026-01-22T00:00:00Z"
  }
}
```

#### GET /clinics/:clinicId/notifications
Get notification history.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": [ /* array of notification objects */ ]
}
```

---

### 6. Users

#### POST /clinics/:clinicId/users
Add a new user (secretary/doctor).

**Headers:** `Authorization: Bearer <access_token>`
**Required Role:** owner

**Request:**
```json
{
  "name": "سارة أحمد",
  "email": "sara@clinic.com",
  "password": "securePassword123",
  "role": "secretary",
  "phone": "01012345678"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* user object */ }
}
```

#### GET /clinics/:clinicId/users
Get all users for a clinic.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": [ /* array of user objects */ ]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication token |
| `FORBIDDEN` | User doesn't have permission |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `DUPLICATE_ENTRY` | Resource already exists |
| `INTERNAL_ERROR` | Server error |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

---

## Rate Limiting

- Free plan: 100 requests per hour
- Basic plan: 1000 requests per hour
- Premium plan: 10000 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Webhooks (Future)

Clinics can register webhook URLs to receive real-time notifications:
- `appointment.created`
- `appointment.updated`
- `appointment.cancelled`
- `patient.created`
