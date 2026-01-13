
```markdown
# Complaint System Extension for VS Code

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Next.js](https://img.shields.io/badge/Next.js-13.x-000000?logo=next.js)

A modern complaint management system extension for VS Code that helps teams track and resolve issues directly within their development environment.

## Features ✨

- **Intuitive Complaint Submission**: Quickly log issues with customizable complaint forms
- **Real-time Tracking**: Monitor complaint status updates in real-time
- **Dashboard Overview**: Visualize complaint statistics and trends
- **Priority Management**: Categorize and prioritize complaints with color-coded tags
- **Team Collaboration**: Assign complaints to team members with @mentions
- **Dark/Light Mode**: Supports VS Code's theme system

## Installation 🛠️

1. **Prerequisites**:
   - [VS Code](https://code.visualstudio.com/) v1.75+
   - [Node.js](https://nodejs.org/) v18+
   - [npm](https://www.npmjs.com/) v9+

2. **Install the extension**:
   ```bash
   git clone https://github.com/your-username/complaint-system.git
   cd complaint-system
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Usage 🚀

1. Open VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Search for "Complaint System" commands:
   - `Complaint: New` - Create new complaint ticket
   - `Complaint: Dashboard` - Open management dashboard
   - `Complaint: Search` - Find existing complaints

**Basic Workflow**:
```javascript
// Sample complaint object structure
{
  id: 'COMP-2023-001',
  title: 'UI Alignment Issue',
  description: 'Login button misaligned on mobile view',
  category: 'UI/UX',
  priority: 'High',
  status: 'Open',
  assignedTo: '@developer-name',
  createdAt: new Date().toISOString()
}
```

## Key Technologies 💻

- **Next.js**: Server-side rendering and API routes
- **React**: Component-based UI architecture
- **React Router**: Navigation and routing management
- **Lucide React**: Beautiful SVG icons
- **js-cookie**: Client-side cookie management

## Configuration ⚙️

Create `.env.local` file in root directory:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.your-service.com
COOKIE_DOMAIN=.yourdomain.com
SESSION_MAX_AGE=86400 # 24 hours
```

## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
