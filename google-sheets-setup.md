# Google Sheets Integration Setup Guide

## Overview
This guide explains how to set up Google Sheets integration to optionally save clinic and appointment data without requiring a backend server.

## Prerequisites
- Google Account
- Google Sheets access
- Basic understanding of Google Apps Script

---

## Step-by-Step Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Clinic Appointments Data"
4. Create two sheets (tabs):
   - **Clinics** - for clinic registrations
   - **Appointments** - for appointment bookings

### Step 2: Set Up Sheet Headers

**Clinics Sheet (Sheet1):**
```
| Timestamp | Clinic Name | Owner Name | Phone | Email | Address | Specialty | Working Hours | Status |
```

**Appointments Sheet (Sheet2):**
```
| Timestamp | Clinic Name | Patient Name | Patient Phone | Appointment Date | Appointment Time | Notes | Status |
```

### Step 3: Create Google Apps Script

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code
3. Paste the following script:

```javascript
// Google Apps Script for Clinic Appointment SaaS

function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    const type = data.type;
    const payload = data.data;
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Route to appropriate handler
    if (type === 'clinic_registration') {
      return handleClinicRegistration(ss, payload);
    } else if (type === 'appointment') {
      return handleAppointment(ss, payload);
    } else if (type === 'test') {
      return handleTest(payload);
    } else {
      return createResponse(false, 'Unknown request type');
    }
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return createResponse(false, error.toString());
  }
}

function handleClinicRegistration(ss, data) {
  const sheet = ss.getSheetByName('Clinics');
  
  if (!sheet) {
    return createResponse(false, 'Clinics sheet not found');
  }
  
  // Append row with clinic data
  sheet.appendRow([
    new Date(),                    // Timestamp
    data.name || '',               // Clinic Name
    data.ownerName || '',          // Owner Name
    data.phone || '',              // Phone
    data.email || '',              // Email
    data.address || '',            // Address
    data.specialty || '',          // Specialty
    data.workingHours || '',       // Working Hours
    'Active'                       // Status
  ]);
  
  return createResponse(true, 'Clinic registered successfully');
}

function handleAppointment(ss, data) {
  const sheet = ss.getSheetByName('Appointments');
  
  if (!sheet) {
    return createResponse(false, 'Appointments sheet not found');
  }
  
  // Append row with appointment data
  sheet.appendRow([
    new Date(),                    // Timestamp
    data.clinicName || '',         // Clinic Name
    data.patientName || '',        // Patient Name
    data.patientPhone || '',       // Patient Phone
    data.date || '',               // Appointment Date
    data.time || '',               // Appointment Time
    data.notes || '',              // Notes
    'Pending'                      // Status
  ]);
  
  return createResponse(true, 'Appointment saved successfully');
}

function handleTest(data) {
  Logger.log('Test request received: ' + JSON.stringify(data));
  return createResponse(true, 'Connection test successful');
}

function createResponse(success, message) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function (can be run from Apps Script editor)
function testScript() {
  const testData = {
    type: 'test',
    data: {
      message: 'Test from Apps Script editor'
    }
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(e);
  Logger.log(result.getContent());
}
```

### Step 4: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Clinic Appointment Data Receiver"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Authorize** the script (you may see a warning - click "Advanced" > "Go to [Project Name]")
7. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

### Step 5: Test the Integration

1. In the Apps Script editor, click **Run** > **testScript**
2. Check the **Execution log** for success message
3. Or use a tool like Postman to send a POST request:

```bash
curl -X POST \
  'YOUR_WEB_APP_URL' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "test",
    "data": {
      "message": "Test from curl"
    }
  }'
```

### Step 6: Add URL to Clinic Registration

When registering a clinic in the app, paste the Web App URL in the "Google Sheets URL" field.

---

## Data Format Examples

### Clinic Registration Request
```json
{
  "type": "clinic_registration",
  "data": {
    "name": "عيادة د. أحمد",
    "ownerName": "د. أحمد محمد",
    "phone": "01012345678",
    "email": "ahmed@clinic.com",
    "address": "شارع الجمهورية، القاهرة",
    "specialty": "باطنة",
    "workingHours": "من 9 صباحاً إلى 5 مساءً",
    "registeredAt": "2026-01-22T00:00:00Z"
  }
}
```

### Appointment Request
```json
{
  "type": "appointment",
  "data": {
    "clinicName": "عيادة د. أحمد",
    "patientName": "محمد علي",
    "patientPhone": "01098765432",
    "date": "2026-01-25",
    "time": "10:00",
    "notes": "أول زيارة",
    "bookedAt": "2026-01-22T00:00:00Z"
  }
}
```

---

## Security Considerations

### ⚠️ Important Security Notes

1. **No Sensitive Data**: Never send passwords or sensitive medical information to Google Sheets
2. **Public Access**: The Web App URL is publicly accessible - anyone with the URL can send data
3. **Rate Limiting**: Google Apps Script has quotas (see below)
4. **Data Privacy**: Ensure compliance with data protection regulations

### Improving Security

#### Option 1: Add API Key Validation
```javascript
const API_KEY = 'your-secret-api-key';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  // Validate API key
  if (data.apiKey !== API_KEY) {
    return createResponse(false, 'Unauthorized');
  }
  
  // ... rest of the code
}
```

#### Option 2: Restrict by Domain
```javascript
function doPost(e) {
  const allowedDomains = ['yourdomain.com', 'localhost'];
  const origin = e.parameter.origin;
  
  if (!allowedDomains.includes(origin)) {
    return createResponse(false, 'Unauthorized domain');
  }
  
  // ... rest of the code
}
```

---

## Google Apps Script Quotas

### Free Account Limits:
- **Executions per day**: 20,000
- **Execution time**: 6 minutes per execution
- **URL Fetch calls**: 20,000 per day
- **Triggers**: 20 time-based triggers

### Workspace Account Limits:
- **Executions per day**: 100,000
- **Execution time**: 6 minutes per execution
- **URL Fetch calls**: 100,000 per day

**For most small clinics, free account limits are sufficient.**

---

## Troubleshooting

### Issue: "Script function not found: doPost"
**Solution**: Make sure the function is named exactly `doPost` (case-sensitive)

### Issue: "Authorization required"
**Solution**: 
1. Go to Apps Script editor
2. Run any function manually
3. Complete the authorization flow

### Issue: "Sheet not found"
**Solution**: Ensure sheet names match exactly:
- "Clinics" (not "clinics" or "Clinic")
- "Appointments" (not "appointments")

### Issue: "No data appearing in sheet"
**Solution**:
1. Check the Execution log in Apps Script
2. Verify the Web App URL is correct
3. Test with the `testScript()` function
4. Check that the sheet has headers in row 1

### Issue: "CORS error in browser"
**Solution**: Google Apps Script Web Apps don't support CORS. Use `mode: 'no-cors'` in fetch:
```javascript
fetch(url, {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

---

## Advanced Features

### Add Data Validation
```javascript
function validateClinicData(data) {
  if (!data.name || data.name.length < 3) {
    throw new Error('Clinic name must be at least 3 characters');
  }
  
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  // Egyptian phone validation
  const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
  if (!phoneRegex.test(data.phone)) {
    throw new Error('Invalid Egyptian phone number');
  }
  
  return true;
}
```

### Add Email Notifications
```javascript
function handleAppointment(ss, data) {
  const sheet = ss.getSheetByName('Appointments');
  sheet.appendRow([...]);
  
  // Send email notification to clinic owner
  const clinicEmail = getClinicEmail(data.clinicName);
  if (clinicEmail) {
    MailApp.sendEmail({
      to: clinicEmail,
      subject: 'New Appointment Booking',
      body: `New appointment for ${data.patientName} on ${data.date} at ${data.time}`
    });
  }
  
  return createResponse(true, 'Appointment saved successfully');
}
```

### Add Duplicate Prevention
```javascript
function isDuplicateAppointment(sheet, clinicName, date, time) {
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === clinicName && 
        data[i][4] === date && 
        data[i][5] === time) {
      return true;
    }
  }
  
  return false;
}
```

---

## Migration to Backend

When ready to move to a real backend:

1. **Export Data**: Download sheets as CSV
2. **Import to Database**: Use SQL import or migration scripts
3. **Update App**: Change API endpoints from Google Sheets URL to backend URL
4. **Keep as Backup**: Optionally keep Google Sheets as backup

---

## Summary

✅ **Pros:**
- No backend required
- Free (within quotas)
- Easy to set up
- Data visible in spreadsheet
- Good for MVP

❌ **Cons:**
- Limited security
- No complex queries
- Manual data management
- Not suitable for production at scale
- No real-time updates

**Recommendation**: Use for MVP and testing, then migrate to proper backend for production.
