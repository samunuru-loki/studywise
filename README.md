# StudyWise 🎓 - Student Study Planner & Dashboard

**StudyWise** is an enterprise-grade, full-stack student study planner and academic tracking web application. Built with **Spring Boot 3 (Java 21)** and **React 18 (Vite + Tailwind CSS)**, StudyWise enables students to manage academic subjects, schedule structured study sessions, track task completion in real-time, organize rich study notes, and visualize performance metrics through an interactive analytics dashboard.

---

## 🚀 Features Overview

1. **JWT-Based Authentication & User Management**
   - Secure student registration and login with BCrypt password hashing.
   - Stateless JWT authentication filter with token expiration management.
   - User-scoped data isolation across all academic entities.

2. **Subject & Course Management**
   - CRUD operations for academic courses and subjects.
   - Custom hex color badges for visual organization.
   - Real-time aggregation of task and note counts per subject.

3. **Study Planning & Task Tracking**
   - Schedule study sessions by topic, date, start time, and end time.
   - Priority classification (`HIGH`, `MEDIUM`, `LOW`).
   - Lifecycle task status tracking (`PENDING`, `IN_PROGRESS`, `COMPLETED`).
   - Quick one-click status updates from dashboard or task list.

4. **Interactive Dashboard & Analytics**
   - Personalized welcome header with real-time stats overview.
   - Dynamic metrics: Active Subjects, Today's Tasks, Pending Tasks, Completed Tasks, and Study Streak counter.
   - Weekly target completion rate progress bar.
   - Upcoming study sessions timeline.

5. **Study Notes & Concept Summaries**
   - Note creation, editing, and subject categorization.
   - Rich formatting support (headings, code blocks, lists, bold/italics).
   - Instant search and subject filtering.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA (Hibernate), JJWT 0.12.6, Lombok, Jakarta Validation |
| **Database** | MySQL 8.x (or H2 in-memory for testing) |
| **Frontend** | React 18, Vite 5, React Router v6, Tailwind CSS v3, Axios, Context API, Lucide Icons |
| **Build Tools** | Apache Maven 3.9+, Node.js 18+ / npm 10+ |

---

## 📂 Project Structure

```text
studywise/
├── backend/
│   ├── .mvn/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/studywise/
│   │   │   │   ├── config/             # SecurityConfig, CorsConfig
│   │   │   │   ├── controller/         # Auth, Subject, StudyPlan, Note, Dashboard
│   │   │   │   ├── dto/                # Request and Response DTOs
│   │   │   │   ├── entity/             # User, Subject, StudyPlan, Note, Enums
│   │   │   │   ├── exception/          # GlobalExceptionHandler, Custom Exceptions
│   │   │   │   ├── repository/         # Spring Data JPA Repositories
│   │   │   │   ├── security/           # JwtService, JwtFilter, CustomUserDetailsService
│   │   │   │   ├── service/            # Core business logic services
│   │   │   │   └── StudyWiseApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql            # Seed demo data
│   │   └── test/
│   ├── pom.xml
│   └── .gitignore
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/                        # Axios instance & API service modules
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/                   # ProtectedRoute
│   │   │   ├── common/                 # Navbar, Sidebar, Button, Card, Input, Modal
│   │   │   ├── dashboard/              # StatsCard, WeeklyProgress, UpcomingSessions
│   │   │   ├── subjects/               # SubjectCard, SubjectModal
│   │   │   ├── studyplans/             # StudyPlanCard, StudyPlanModal
│   │   │   └── notes/                  # NoteCard, NoteModal
│   │   ├── contexts/                   # AuthContext (State & JWT storage)
│   │   ├── hooks/                      # useAuth, useSubjects, useStudyPlans, useNotes
│   │   ├── pages/                      # LoginPage, RegisterPage, DashboardPage, etc.
│   │   ├── routes/                     # AppRoutes
│   │   ├── utils/                      # Formatters & date helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                   # Tailwind directives & design tokens
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Java Development Kit (JDK):** Version 21 or higher
- **Node.js:** Version 18.x or higher & `npm`
- **MySQL Database Server:** Version 8.0+ running on port 3306 (or configured as below)

---

### 2. Backend Setup & Run

1. **Configure Database Connection:**
   Verify `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/studywise_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=root
   ```

2. **Navigate to backend and run:**
   ```bash
   cd studywise/backend
   mvn clean spring-boot:run
   ```
   The backend API will start on **`http://localhost:8080`**.

---

### 3. Frontend Setup & Run

1. **Navigate to frontend directory and install dependencies:**
   ```bash
   cd studywise/frontend
   npm install
   ```

2. **Start Vite development server:**
   ```bash
   npm run dev
   ```
   The application UI will be accessible at **`http://localhost:5173`**.

---

## 🔑 Demo User Credentials

The application includes pre-seeded demo data for quick exploration:
- **Email:** `demo@studywise.com`
- **Password:** `password123`

*(You can also use the "Fill Demo Credentials" button on the Login page or register a new student account).*

---

## 📡 REST API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login and obtain JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |

### Subject Endpoints (`/api/subjects`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/subjects` | List all user subjects | Authenticated |
| `GET` | `/api/subjects/{id}` | Get single subject | Authenticated |
| `POST` | `/api/subjects` | Create a new subject | Authenticated |
| `PUT` | `/api/subjects/{id}` | Update existing subject | Authenticated |
| `DELETE` | `/api/subjects/{id}` | Delete subject & cascade data | Authenticated |

### Study Plan Endpoints (`/api/study-plans`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/study-plans` | List plans (optional `date`, `startDate`, `endDate`, `subjectId`) | Authenticated |
| `GET` | `/api/study-plans/{id}` | Get study plan by ID | Authenticated |
| `POST` | `/api/study-plans` | Create a new study plan | Authenticated |
| `PUT` | `/api/study-plans/{id}` | Update study plan | Authenticated |
| `PATCH` | `/api/study-plans/{id}/status` | Quick update status (`PENDING`, `IN_PROGRESS`, `COMPLETED`) | Authenticated |
| `DELETE` | `/api/study-plans/{id}` | Delete study plan | Authenticated |

### Notes Endpoints (`/api/notes`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | List notes (optional `subjectId` filter) | Authenticated |
| `GET` | `/api/notes/{id}` | Get note by ID | Authenticated |
| `POST` | `/api/notes` | Create a new note | Authenticated |
| `PUT` | `/api/notes/{id}` | Update note | Authenticated |
| `DELETE` | `/api/notes/{id}` | Delete note | Authenticated |

### Dashboard Endpoints (`/api/dashboard`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Get aggregated student stats & schedule | Authenticated |
