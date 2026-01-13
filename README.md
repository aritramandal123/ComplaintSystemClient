# Complaint System Client - Detailed Documentation

## 1. System Overview
The **Complaint System Client** is a frontend application built with **Next.js 16 (App Router)** and **React 19**. It serves as the user interface for a complaint management platform, catering to two distinct user roles:
-   **Users**: Can log in, submit complaints, and track their status.
-   **Admins**: Have a dashboard to view, manage, assign, and update complaints and view analytics.

The application interacts with an external backend API (currently hardcoded as `http://localhost:8800`) and uses **Client-Side Rendering (CSR)** for dynamic content, managed effectively via the Next.js App Router structure.

## 2. Technical Stack
-   **Framework**: Next.js 16.1.1 (App Router)
-   **UI Library**: React 19.2.3
-   **Styling**: Tailwind CSS v4
-   **Icons**: Lucide React
-   **State Management**: React `useState`, `useEffect` (Local State)
-   **Changes/Side Effects**: `js-cookie` for session management
-   **Visualizations**: Recharts (for Analytics)

## 3. Architecture & Data Flow

### 3.1 Directory Structure (App Router)
The project follows the modern Next.js App Router conventions:
```
/app
├── admin/              # Admin-specific routes
│   ├── analytics/      # Analytics dashboard
│   ├── home/           # Main admin dashboard (Kanban board)
│   └── login/          # Admin login page
├── user/               # User-specific routes
│   ├── home/           # User dashboard
│   └── login/          # User login page
├── landing/            # Landing page component
├── components/         # Reusable UI components
│   ├── admin/          # Admin specific components (QueueBoard, AnalyticsDashboard)
│   └── loadingScreen.js
├── layout.js           # Root layout
├── page.js             # Root entry point (Handles redirection)
└── globals.css         # Global styles & Tailwind directives
```

### 3.2 Authentication Flow
Authentication is handled entirely client-side using **cookies**.
-   **Login**:
    -   User/Admin submits credentials to `POST /login/user` or `POST /login/admin`.
    -   On success, the following cookies are set:
        -   `token`: JWT or Session token.
        -   `isLoggedIn`: Boolean flag ('true').
        -   `userType`: 'user' or 'admin'.
        -   `userId`: The unique ID of the logged-in entity.
-   **Route Protection**:
    -   `app/page.js`: The root route checks cookies.
        -   If `isLoggedIn` & `userType === 'user'` -> Redirects to `/user/home`.
        -   If `isLoggedIn` & `userType === 'admin'` -> Redirects to `/admin/home`.
        -   Else -> Shows Landing Page.
    -   Individual pages (e.g., `/admin/home/page.js`) perform a secondary check in `useEffect` and redirect to `/` if unauthorized.

### 3.3 Data Fetching
Data fetching is primarily **client-side** using `fetch` inside `useEffect` hooks.
-   **Base URL**: Hardcoded as `http://localhost:8800`.
-   **Authorization**: API requests include the `Authorization: Bearer <token>` header.

## 4. API Integration Points
The application relies on the following backend endpoints:

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| **POST** | `/login/user` | User Login | `{ email, password }` |
| **POST** | `/login/admin` | Admin Login | `{ email, password }` |
| **POST** | `/getInfo/adminInfo/` | Get Admin Profile | `{ id, userType: 'admin' }` |
| **POST** | `/getInfo/admin/complaints/` | Fetch All Complaints | `{ id }` |
| **POST** | `/getInfo/admin/employees/` | Fetch All Employees | `{ id }` |
| **POST** | `/complaints/admin/update` | Update Complaint | `{ id, complaint: object }` |

## 5. Components Breakdown

### 5.1 Admin Dashboard (`/app/admin/home`)
The core of the admin experience.
-   **Features**:
    -   **Kanban Board**: Columns for 'Pending', 'In Progress', 'Resolved'.
    -   **Detailed View**: Modal to view complaint details, change priority, and assign technicians.
    -   **Tab Switching**: Toggles between 'Queue' and 'Analytics' views.
-   **State**: Manages lists of complaints and employees locally. Polls/refreshes data using an `update` counter dependency in `useEffect`.

### 5.2 User Login (`/app/user/login`)
-   Standard login form.
-   Handles error messaging and cookie setting upon successful response.

### 5.3 Loading Screen (`/components/loadingScreen.js`)
-   A shared utility component used during data fetching and authentication checks to prevent flash-of-unstyled-content or unauthorized views.

## 6. Configuration
-   **Tailwind CSS**: Configured in `package.json` dependencies (v4). Use standard utility classes.
-   **Next.js Config**: `next.config.mjs` is present but currently standard/empty.

## 7. Development Guidelines
-   **Running**: `npm run dev`
-   **Building**: `npm run build`
-   **Linting**: `npm run lint`
