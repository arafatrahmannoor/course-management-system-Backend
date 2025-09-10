# Course Management System API

## Project Overview
A RESTful API for managing courses, users, and purchases. Built with Node.js, Express.js, and MongoDB. Supports user registration/login, course browsing, purchasing, and admin management.

## Features
- User authentication (JWT, access/refresh tokens)
- Roles: user and admin
- Admin: add/delete courses
- Users: browse courses, purchase courses, view purchased courses
- Input validation and centralized error handling
- Password hashing with bcrypt

## Installation Guide
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ```
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get tokens
- `POST /api/auth/refresh` — Get new access token using refresh token
- `POST /api/auth/logout` — Logout and invalidate refresh token

### Courses
- `POST /api/courses/add` — Add a new course (admin only)
- `DELETE /api/courses/delete/:id` — Delete a course (admin only)
- `GET /api/courses/all` — Get all courses (user)
- `GET /api/courses/:id` — Get course by ID (user)

### Purchases
- `POST /api/purchase/buy` — Purchase a course (user)
- `GET /api/purchase/my` — View purchased courses (user)

## Example Requests

**Register:**
```http
POST /api/auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Add Course (admin):**
```http
POST /api/courses/add
Authorization: Bearer <accessToken>
Content-Type: application/json
{
  "title": "Node.js Basics",
  "description": "Learn Node.js fundamentals",
  "price": 99.99,
  "instructor": "Jane Smith"
}
```

**Purchase Course:**
```http
POST /api/purchase/buy
Authorization: Bearer <accessToken>
Content-Type: application/json
{
  "courseId": "<course_id>"
}
```

## Explanation of Features
- **Authentication:** JWT-based, with refresh token and logout support.
- **Roles:** Only admins can add/delete courses; users can browse and purchase.
- **Validation:** All input is validated using express-validator.
- **Error Handling:** Centralized error handler for consistent API responses.
- **Password Security:** Passwords are hashed using bcrypt before storing.

---
For any questions or issues, please contact the maintainer.
