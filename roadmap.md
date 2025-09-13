# 📘 Course Platform Backend API – Roadmap

This document lists all modules and APIs to develop for the backend, in the recommended order of implementation.  
It’s structured so you can build incrementally while ensuring authentication, security, and scalability.

---

## 🔹 Step 0: Project Setup

- Initialize NestJS project.
- Set up PostgreSQL with Prisma.
- Define base schema (User, Course, Module, Lesson, Test, Membership, Review).
- Configure environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.).

---

## 🔹 Step 1: Authentication & Authorization

### APIs

- **Register**: Create user (default role = STUDENT).
- **Login**: Return JWT + role.
- **Get Profile**: Fetch logged-in user details.
- **Role Management**: Allow Admins to promote/demote users.

👉 These APIs ensure all future endpoints are secured with JWT and role-based access.

---

## 🔹 Step 2: Courses Management

### APIs

- **Create Course** (Instructor/Admin).
- **Update Course** (Instructor/Admin).
- **Delete Course** (Instructor/Admin).
- **Get All Courses** (Public).
- **Get Single Course** (Public).
- **Get Instructor’s Courses** (Restricted to Instructor/Admin).
- **Change Course Status** (Draft → Published).

👉 Courses are the core entity. Implement before modules/lessons.

---

## 🔹 Step 3: Modules

### APIs

- **Add Module to Course** (Instructor/Admin).
- **Update Module**.
- **Delete Module**.
- **Reorder Modules**.
- **Get Course Modules**.

👉 Modules break a course into sections, making lessons manageable.

---

## 🔹 Step 4: Lessons

### APIs

- **Add Lesson to Module**.
- **Update Lesson** (content, video, duration, etc.).
- **Delete Lesson**.
- **Reorder Lessons in Module**.
- **Track Lesson Completion** (Student).
- **Get Lessons by Module**.

👉 At this point, the **learning flow** is complete (Course → Module → Lesson).

---

## 🔹 Step 5: Tests & Quizzes

### APIs

- **Create Test for Lesson**.
- **Add Questions to Test**.
- **Update/Delete Questions**.
- **Take Test (Student)** → store answers + calculate score.
- **Get Test Attempts (Student/Admin/Instructor)**.
- **Set Minimum Score for Lesson/Test**.

👉 Enables assessments to check student progress.

---

## 🔹 Step 6: Course Membership (Enrollments & Progress)

### APIs

- **Enroll in Course** (Student).
- **Unenroll from Course**.
- **Get My Enrolled Courses** (Student).
- **Track Progress** (update as lessons/tests are completed).
- **Get Enrollment Details** (Instructor/Admin).

👉 Critical for student-course relationships and progress tracking.

---

## 🔹 Step 7: Reviews & Ratings

### APIs

- **Add Review for Course** (Student).
- **Update/Delete Review** (Student).
- **Get Reviews for Course** (Public).
- **Get My Reviews** (Student).

👉 Adds social proof and feedback loop.

---

## 🔹 Step 8: Video Conferencing (Live Classes)

_(Not in Prisma schema yet, but add later as separate module/table)_

### APIs

- **Create Live Session** (Instructor/Admin).
- **Join Live Session** (Students).
- **End Session**.
- **List Upcoming Sessions per Course**.

👉 Can integrate with WebRTC or third-party APIs (Zoom SDK, Twilio, Agora).  
👉 Build after core learning flow is stable.

---

## 🔹 Step 9: Real-time Messaging (Chat & Notifications)

_(Also separate from Prisma schema, add via WebSockets/Redis)_

### APIs

- **Send Message (Course Chat)**.
- **Get Messages for Course**.
- **Join Chat Room (Realtime)**.
- **System Notifications** (Lesson published, Test assigned, etc.).

👉 Enhances engagement; should be added after core features & video are stable.

---

## 🔹 Step 10: Testing Module

### APIs / Features

- **Run Unit Tests (Jest)**.
- **Run Integration Tests (Supertest)**.
- **E2E Test Coverage for**:
  - Auth flows.
  - Course creation & enrollment.
  - Lesson completion tracking.
  - Test taking & scoring.
  - Permissions (only instructors can modify their courses).

👉 Testing ensures stability before adding scaling features.

---

# ⏳ Recommended Development Timeline

1. **Week 1** → Setup, Auth, Users.
2. **Week 2** → Courses + Modules.
3. **Week 3** → Lessons + Memberships.
4. **Week 4** → Tests/Quizzes + Reviews.
5. **Week 5** → Video Conferencing (basic integration).
6. **Week 6** → Realtime Messaging + Notifications.
7. **Week 7+** → Testing module + CI/CD + optimizations.
