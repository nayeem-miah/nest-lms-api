# 🚀 Online Course & Subscription Management System (Backend API)

A **scalable and production-ready backend API** built with **NestJS** for an online learning platform.  
This system supports **authentication, course management, enrollment, payments, subscriptions, reviews, notifications, and admin analytics**.

🔗 **Live Backend API**  
👉 https://nest-lms-api-fbhm.onrender.com/api/v1

---

## 🎯 Project Overview

This backend powers an online course platform where:

- **Students** can register, purchase courses, subscribe to plans, and track learning progress
- **Instructors** can create and manage their own courses
- **Admins** have full control over users, courses, payments, and analytics

The architecture is **scalable, secure, and SaaS-ready**.

---

## 👥 User Roles

| Role       | Permissions                |
| ---------- | -------------------------- |
| Admin      | Full system access         |
| Instructor | Manage own courses         |
| Student    | Purchase & consume courses |

---

## 🔐 Authentication & Authorization

### Authentication

- Email & password signup
- Secure login with **JWT**
- Refresh token system
- Password hashing using **bcrypt**
- Logout (invalidate refresh token)
- Google OAuth (optional)

### Authorization

- Role-Based Access Control (RBAC)
- Route protection using **Guards**
- Instructor can manage only own courses
- Admin can manage everything

---

## 👤 User Module

### Features

- User registration & login
- View & update profile
- Change password
- Device-based login limit (max 3 devices)
- Account status (active / blocked)

### User Fields

```ts
id, name, email, password, role, isActive, devices[], createdAt
```

---

## 📚 Course Module

### Features

- Create / Update / Delete course
- Publish / Unpublish course
- Course listing with:
  - Pagination
  - Search
  - Category filter

- Course details view

### Course Fields

```ts
(id, title, description, price, category, instructorId, isPublished);
```

---

## 🎓 Enrollment Module

### Features

- Purchase course
- Auto enrollment after successful payment
- Prevent duplicate enrollment
- View enrolled courses
- Track progress (percentage-based)

---

## 💳 Subscription & Payment Module

### Features

- Monthly & yearly subscription plans
- Stripe / SSLCommerz (design-ready)
- Secure payment handling
- Webhook support
- Payment history
- Invoice generation (PDF)

---

## 🧾 Review & Rating Module

### Features

- Students can leave reviews
- One review per course per user
- Admin can moderate reviews

---

## 🔔 Notification Module

### Features

- Email notifications
- Enrollment confirmation
- Subscription expiry reminders
- Admin announcements

---

## 📊 Admin Dashboard APIs

### Features

- Total users, courses & revenue
- Monthly revenue analytics
- Most popular courses
- Active vs inactive users

---

## 🧪 Security & Performance

- Global validation pipe
- Rate limiting
- CORS & Helmet
- Request logging
- Global error handling

---

## 📂 Project Structure

```
src/
├── auth/
├── users/
├── courses/
├── enrollments/
├── payments/
├── subscriptions/
├── reviews/
├── notifications/
├── dashboard/
├── common/
│ ├── guards/
│ ├── decorators/
│ ├── interceptors/
│ └── filters/
└── main.ts
```

---

## 🛠️ Tech Stack

- **NestJS**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT + Passport**
- **Stripe**
- **Swagger API Documentation**

---

## 📈 Advanced Features (Optional)

- CQRS Pattern
- Event-driven architecture
- Background jobs (BullMQ)
- API versioning
- Microservice-ready structure

---

## 🚀 Getting Started (Local Setup)

```bash
# Clone repository
git clone https://github.com/nayeem-miah/nest-lms-api.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run start:dev
```

---

## 📄 API Documentation

Swagger available at:
👉 `/api/docs` (when running locally)

---

## 🎯 Why This Project Matters

✅ Solves real-world backend problems
✅ Recruiter-friendly architecture
✅ Clean & scalable codebase
✅ SaaS-ready design
✅ Strong backend portfolio project
