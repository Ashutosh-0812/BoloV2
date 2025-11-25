# API Testing Guide - BoloBackend

**Base URL**: `http://localhost:4000`

---

## 📋 Table of Contents
1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Tasks](#tasks)
5. [Recordings](#recordings)
6. [Invites](#invites)

---

## 🏠 Health Check

### Check API Status
```http
GET http://localhost:4000/
```

**Expected Response:**
```json
{
  "ok": true,
  "env": "dev"
}
```

---

## 🔐 Authentication

### 1. Request OTP
```http
POST http://localhost:4000/api/auth/request-otp
Content-Type: application/json

{
  "phone": "+918502050534",
  "name": "John Doe"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent",
    "logId": "6473a2b1c9d4e5f6a7b8c9d0"
  }
}
```

**Check Terminal** for OTP: `[MOCK OTP] Sending OTP 896479 to +918502050534`

---

### 2. Verify OTP
```http
POST http://localhost:4000/api/auth/verify-otp
Content-Type: application/json

{
  "phone": "+918502050534",
  "otp": "896479"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6473a2b1c9d4e5f6a7b8c9d0",
      "name": "John Doe",
      "phone": "+918502050534",
      "role": "participant",
      "status": "active"
    }
  }
}
```

**Note:** Token is also set in httpOnly cookie automatically.

---

### 3. Logout
```http
POST http://localhost:4000/api/auth/logout
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## 👤 Users

**⚠️ All user endpoints require authentication**

### Get Current User Profile
```http
GET http://localhost:4000/api/users/me
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6473a2b1c9d4e5f6a7b8c9d0",
    "name": "John Doe",
    "phone": "+918502050534",
    "role": "participant",
    "status": "active",
    "createdAt": "2025-11-21T10:30:00.000Z"
  }
}
```

---

### Update Current User Profile
```http
PUT http://localhost:4000/api/users/me
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "gender": "female",
  "city": "Mumbai",
  "state": "Maharashtra",
  "occupation": "Student",
  "languages": ["Hindi", "English", "Marathi"],
  "accents": ["Mumbai"],
  "ageGroup": "18-25"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6473a2b1c9d4e5f6a7b8c9d0",
    "name": "Jane Doe",
    "phone": "+918502050534",
    "gender": "female",
    "city": "Mumbai",
    "state": "Maharashtra",
    "occupation": "Student",
    "languages": ["Hindi", "English", "Marathi"],
    "accents": ["Mumbai"],
    "ageGroup": "18-25",
    "role": "participant",
    "status": "active"
  }
}
```

---

### List All Users
```http
GET http://localhost:4000/api/users
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6473a2b1c9d4e5f6a7b8c9d0",
      "name": "John Doe",
      "phone": "+918502050534",
      "role": "participant"
    },
    {
      "_id": "6473a2b1c9d4e5f6a7b8c9d1",
      "name": "Jane Smith",
      "phone": "+919876543210",
      "role": "moderator"
    }
  ]
}
```

---

## 📋 Tasks

**⚠️ All task endpoints require authentication**

### Create Task (Admin/Moderator Only)
```http
POST http://localhost:4000/api/tasks
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Read Hindi News Article",
  "text": "भारत में आज एक नई योजना की घोषणा की गई।",
  "type": "read",
  "language": "Hindi",
  "domain": "news",
  "topic": "politics",
  "state": "Maharashtra",
  "district": "Mumbai",
  "tags": ["news", "politics", "hindi"]
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6473a2b1c9d4e5f6a7b8c9d2",
    "title": "Read Hindi News Article",
    "text": "भारत में आज एक नई योजना की घोषणा की गई।",
    "type": "read",
    "language": "Hindi",
    "domain": "news",
    "topic": "politics",
    "status": "active",
    "createdBy": "6473a2b1c9d4e5f6a7b8c9d0",
    "createdAt": "2025-11-21T10:30:00.000Z"
  }
}
```

---

### List All Tasks
```http
GET http://localhost:4000/api/tasks
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6473a2b1c9d4e5f6a7b8c9d2",
      "title": "Read Hindi News Article",
      "text": "भारत में आज एक नई योजना की घोषणा की गई।",
      "type": "read",
      "language": "Hindi",
      "status": "active"
    }
  ]
}
```

---

### Get Single Task
```http
GET http://localhost:4000/api/tasks/6473a2b1c9d4e5f6a7b8c9d2
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6473a2b1c9d4e5f6a7b8c9d2",
    "title": "Read Hindi News Article",
    "text": "भारत में आज एक नई योजना की घोषणा की गई।",
    "type": "read",
    "language": "Hindi",
    "domain": "news",
    "topic": "politics",
    "status": "active",
    "createdBy": "6473a2b1c9d4e5f6a7b8c9d0",
    "createdAt": "2025-11-21T10:30:00.000Z"
  }
}
```

---

### Delete Task (Admin/Moderator Only)
```http
DELETE http://localhost:4000/api/tasks/6473a2b1c9d4e5f6a7b8c9d2
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully"
  }
}
```

---

## 🎙️ Recordings

**⚠️ All recording endpoints require authentication**


### Check Scoring System (Test API)
```http
POST http://localhost:4000/api/recordings/score/check
Content-Type: application/json

{
  "transcript": "your transcript text here",
  "article": "the news article text here",
  "duration": 120
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "score": 67,
    "audioDuration": 120,
    "totalWords": 12,
    "uniqueWords": 10,
    "newWords": 3,
    "emotion": "neutral",
    "points": 6,
    "accent": "detected-accent",
    "dialect": "detected-dialect"
  }
}
```

---

### Upload Recording
```http
POST http://localhost:4000/api/recordings/upload
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

file: [Select audio file - .mp3, .wav, .m4a, etc.]
taskID: 6473a2b1c9d4e5f6a7b8c9d2
```

**Using cURL:**
```bash
curl -X POST http://localhost:4000/api/recordings/upload \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/path/to/audio.mp3" \
  -F "taskID=6473a2b1c9d4e5f6a7b8c9d2"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6473a2b1c9d4e5f6a7b8c9d3",
    "userID": "6473a2b1c9d4e5f6a7b8c9d0",
    "taskID": "6473a2b1c9d4e5f6a7b8c9d2",
    "audioURL": "https://res.cloudinary.com/dzatbuk2e/video/upload/v1234567890/bolo-recordings/audio.mp3",
    "duration": 45,
    "status": "pending",
    "points": 0,
    "createdAt": "2025-11-21T10:30:00.000Z"
  }
}
```

---

### List All Recordings
```http
GET http://localhost:4000/api/recordings
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6473a2b1c9d4e5f6a7b8c9d3",
      "userID": "6473a2b1c9d4e5f6a7b8c9d0",
      "taskID": "6473a2b1c9d4e5f6a7b8c9d2",
      "audioURL": "https://res.cloudinary.com/...",
      "duration": 45,
      "status": "pending",
      "createdAt": "2025-11-21T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Recording
```http
GET http://localhost:4000/api/recordings/6473a2b1c9d4e5f6a7b8c9d3
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6473a2b1c9d4e5f6a7b8c9d3",
    "userID": {
      "_id": "6473a2b1c9d4e5f6a7b8c9d0",
      "name": "John Doe",
      "phone": "+918502050534"
    },
    "taskID": {
      "_id": "6473a2b1c9d4e5f6a7b8c9d2",
      "title": "Read Hindi News Article"
    },
    "audioURL": "https://res.cloudinary.com/...",
    "duration": 45,
    "transcript": "भारत में आज एक नई योजना की घोषणा की गई।",
    "emotion": "neutral",
    "accent": "Hindi-Mumbai",
    "status": "verified",
    "score": 85,
    "points": 10,
    "createdAt": "2025-11-21T10:30:00.000Z"
  }
}
```

---

## 📨 Invites

**⚠️ All invite endpoints require authentication**

### Send Invite
```http
POST http://localhost:4000/api/invites
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "phone": "+919876543210",
  "message": "Join me on Bolo Voice App!"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6473a2b1c9d4e5f6a7b8c9d4",
    "inviterID": "6473a2b1c9d4e5f6a7b8c9d0",
    "inviteePhone": "+919876543210",
    "status": "sent",
    "createdAt": "2025-11-21T10:30:00.000Z"
  }
}
```

---

### Respond to Invite
```http
POST http://localhost:4000/api/invites/6473a2b1c9d4e5f6a7b8c9d4/respond
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "response": "accepted"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6473a2b1c9d4e5f6a7b8c9d4",
    "inviterID": "6473a2b1c9d4e5f6a7b8c9d0",
    "inviteeID": "6473a2b1c9d4e5f6a7b8c9d1",
    "status": "accepted",
    "respondedAt": "2025-11-21T10:35:00.000Z"
  }
}
```

---

## 🔧 Testing Tips

### Using Postman
1. Create a new request collection
2. Set base URL as variable: `{{baseUrl}}` = `http://localhost:4000`
3. After login, save token in environment variable: `{{token}}`
4. Use `{{token}}` in Authorization header for all protected routes

### Using cURL
```bash
# Save token to variable
TOKEN="your_jwt_token_here"

# Use in requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/users/me
```

### Using VS Code REST Client
Install "REST Client" extension and create a `.http` file with requests.

---

## ⚠️ Common Errors

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```
**Solution:** Include `Authorization: Bearer <token>` header

---

### 400 Bad Request
```json
{
  "success": false,
  "message": "Phone is required"
}
```
**Solution:** Check request body has all required fields

---

### 404 Not Found
```json
{
  "success": false,
  "message": "Task not found"
}
```
**Solution:** Verify the resource ID exists in database

---

## 📝 Notes

- **Cookie Authentication**: Tokens are automatically set in httpOnly cookies after login
- **Token Expiry**: JWT tokens expire after 7 days
- **OTP Expiry**: OTPs expire after 5 minutes
- **Mock OTP**: Check terminal for OTP when using mock provider
- **File Upload**: Max file size depends on multer configuration
- **CORS**: Credentials are enabled for cookie support

---

## 🚀 Quick Test Flow

1. **Request OTP** → Get OTP from terminal
2. **Verify OTP** → Get JWT token
3. **Get Profile** → Test authentication
4. **Create Task** → Test admin/moderator role
5. **Upload Recording** → Test file upload
6. **Logout** → Clear cookie
