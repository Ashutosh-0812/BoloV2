# Voice App Backend

## Setup
1. copy `.env.example` -> `.env` and set values (MONGO_URI, CLOUDINARY_*, JWT_SECRET)
2. npm install
3. npm run dev

## Endpoints
- POST /api/auth/request-otp { phone, name? }
- POST /api/auth/verify-otp { phone, otp }
- GET /api/users/me
- PUT /api/users/me
- POST /api/tasks (admin/moderator)
- GET /api/tasks
- POST /api/invites
- POST /api/invites/:inviteId/respond { action: 'accepted'|'declined' }
- POST /api/recordings/upload (form-data file field `file`) -- authenticated
