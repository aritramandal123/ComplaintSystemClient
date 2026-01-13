# Complaint System Client 🛡️

![Version](https://img.shields.io/badge/version-0.1.0-blue) ![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)

## 📖 Introduction
The **Complaint System Client** is a cutting-edge, enterprise-grade frontend application designed to streamline the lifecycle of organizational issue tracking. Built on the latest web technologies, it provides a dual-interface experience:
1.  **User Portal**: For employees/clients to seamlessly lodge and track complaints.
2.  **Admin Command Center**: A powerful Kanban-style dashboard for technicians and managers to triage, assign, and resolve issues in real-time, backed by data visualization.

---

## ✨ Key Features

### For Administrators
-   **Kanban Workflow**: Drag-and-drop style organization (pending implementation) with "Pending", "In Progress", and "Resolved" columns.
-   **Live Analytics**: Real-time charts showing category breakdowns, status distribution, and critical issue tracking.
-   **Personnel Database**: Searchable directory of employees for quick checking and assignment.
-   **Inspection Module**: Deep-dive modal for every complaint to update priority, assign technicians, and add notes.

### For Users
-   **Secure Authentication**: Role-based access control ensuring data privacy.
-   **Quick Submission**: Streamlined forms for rapid issue reporting.
-   **Status Tracking**: Real-time updates on their submitted tickets.

---

## 🛠️ Technical Architecture

### Tech Stack
| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 16.1.1 | Server/Client Component Orchestration |
| **UI Engine** | React | 19.2.3 | Component Logic & State |
| **Styling** | Tailwind CSS | v4 | Utility-first Design System |
| **Icons** | Lucide React | Latest | Consistent Iconography |
| **Charts** | Recharts | 3.x | Analytics Visualization |
| **State** | React Hooks | - | Local UI State Management |
| **Auth** | JS-Cookie | 3.x | Client-Side Session Persistence |

### Directory Structure
The project uses the **Next.js App Router** structure, ensuring features are grouped by route.

```
/
├── app/                        # Application Source
│   ├── admin/                  # Admin Module
│   │   ├── analytics/          # Analytics Dashboard Page
│   │   ├── home/               # Main Kanban Dashboard
│   │   └── login/              # Admin Authentication
│   ├── user/                   # User Module
│   │   ├── home/               # User Dashboard
│   │   └── login/              # User Authentication
│   ├── landing/                # Public Landing Page
│   ├── layout.js               # Root Application Shell
│   ├── page.js                 # Auth Gate (Redirect Logic)
│   └── globals.css             # Tailwind v4 & Global Styles
├── components/                 # Shared UI Components
│   ├── admin/                  # Admin-Specific Widgets
│   │   ├── queueBoard.js       # The Core Kanban Board Logic
│   │   └── analyticsDashboard.js # Charts & Graphs Component
│   └── loadingScreen.js        # Global Fallback Spinner
├── public/                     # Static Assets
├── next.config.mjs             # Framework Configuration
└── package.json                # Dependencies & Scripts
```

---

## 💾 Data Models

The application relies on specific data structures to function.

### 1. Complaint Object
The core unit of work in the system.
```typescript
interface Complaint {
  id: string;             // Unique Database Key (e.g., "64f...")
  complaintId: string;    // Human Readable ID (e.g., "CMP-102")
  title: string;          // Short summary
  description: string;    // Full details
  category: string;       // e.g., "Hardware", "Network"
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  technician?: string;    // Employee ID of assigned staff
  date: string;           // ISO Date String or Formatted Date
}
```

### 2. Employee Object
Used for assignment and authorization.
```typescript
interface Employee {
  employeeId: string;     // Unique ID (e.g., "EMP-001")
  fullName: string;
  role: string;           // e.g., "Technician", "Manager"
  status: 'Active' | 'Inactive';
}
```

---

## 🚀 Installation & Setup

### Prerequisites
-   **Node.js**: v18 or higher
-   **NPM**: v9 or higher

### Step-by-Step
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-org/complaint-system-client.git
    cd complaint-system-client
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.

4.  **Backend Connection**
    *Note: The application currently points to a local backend.*
    Ensure your backend service is running on `http://localhost:8800`.
    
    > **Configuration**: Go to `app/admin/home/page.js` and `app/user/login/page.js` to update API endpoints if your backend runs on a different port.

---

## 📘 Component Reference

### `QueueBoard.js`
The heart of the Admin Home. 
-   **Props**: `complaints` (Array), `employees` (Array), `onSaveChanges` (Function).
-   **Functionality**: 
    -   Renders three columns based on `status`.
    -   Clicking a card opens the **Inspection Module**.
    -   "View All" buttons expand a full-table view of that category.

### `AnalyticsDashboard.js`
Provides visual insights.
-   **metrics**: 
    -   **Total Logs**: Count of all records.
    -   **Critical**: Count of 'high' priority issues.
    -   **Staff Active**: Number of technicians currently assigned tasks.
-   **Charts**: 
    -   **Vertical Bar Chart**: Breakedown by Category (Network, Hardware, etc.).
    -   **Pie Chart**: Status distribution (Pending vs Resolved).

---

## 🔐 Authentication & Security
The app uses a **Cookie-Based** session strategy.

1.  **Login**: User posts credentials. Backend returns a `token` and `userId`.
2.  **Storage**: `js-cookie` stores `token`, `isLoggedIn`, `userType`, and `userId`.
3.  **Protection**: 
    -   `middleware` (logic in `app/page.js`) checks cookies on load.
    -   If a User tries to access `/admin`, they are redirected to `/`.
    -   If an unauthenticated user tries to access internal pages, they strike the `LoadingScreen` and are bounced to `/landing`.

---

## 🚧 Roadmap & Improvements
-   [ ] **Dynamic Configuration**: Move API URLs to `.env` files.
-   [ ] **Server Components**: Migrate client-side data fetching to React Server Components (RSC) for better performance.
-   [ ] **Type Safety**: Migration to TypeScript for robust development.
-   [ ] **Theme Toggle**: Add Dark/Light mode switcher (Tailwind support already enabled).

---

