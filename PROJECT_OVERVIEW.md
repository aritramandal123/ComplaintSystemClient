

```markdown
# Complaint System Technical Documentation

## Project Overview
**Name**: complaint-system  
**Version**: 0.1.0  
**Description**: Next.js-based complaint management system with internationalization support. Handles complaint submission, tracking, and administration with cookie-based session management.

---

## Architecture
### Core Stack
- **Framework**: Next.js (SSR/SSG capabilities)
- **UI**: React 18 + Lucide React icons
- **Routing**: react-router-dom
- **State**: Context API + js-cookie for client-side persistence
- **i18n**: Next.js domain-based internationalization

### Directory Structure (Inferred)
```
/
├── pages/
│   ├── api/         # API routes
│   ├── complaints/  # Complaint views
│   └── index.js     # Landing page
├── public/          # Static assets
├── styles/          # CSS modules
└── utils/           # Shared utilities
```

### Data Flow
1. Client submits complaint via `/api/complaints` endpoint
2. Serverless function processes request
3. Cookies set for session persistence
4. i18n middleware detects locale via `detect-domain-locale`
5. React components render localized content

---

## API Reference

### Core Functions
#### `detectDomainLocale(domainItems, hostname, detectedLocale)`
```javascript
export function detectDomainLocale(domainItems, hostname, detectedLocale) {
  // Implementation from Next.js i18n
}
```
- **Parameters**:
  - `domainItems`: Array<DomainLocale> - Configured domain locales
  - `hostname`: string - Current hostname
  - `detectedLocale`: string - Fallback locale
- **Returns**: Matching DomainLocale object or undefined

#### `getDomainLocale(path, locale, locales, domainLocales)`
```javascript
export function getDomainLocale(path, locale, locales, domainLocales) {
  // Next.js locale resolution
}
```
- **Parameters**:
  - `path`: string - Request path
  - `locale`: string - Forced locale
  - `locales`: string[] - Supported locales
  - `domainLocales`: DomainLocale[] - Configured domains
- **Returns**: Formatted URL string or false

---

## Configuration

### Next.js i18n (domain-based)
```javascript
// next.config.js
module.exports = {
  i18n: {
    domains: [
      {
        domain: "example.com",
        defaultLocale: "en-US",
        http: true
      }
    ]
  }
}
```

### Environment Variables
```
.env.local
-----------------------------
NEXT_PUBLIC_API_URL=https://api.example.com
SESSION_KEY=complaint_system_cookie
```

### Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext js,jsx"
  }
}
```

---

## Error Handling
### API Error Codes
```javascript
// pages/api/complaints.js
export default function handler(req, res) {
  try {
    // Processing logic
  } catch (error) {
    res.status(500).json({
      errorCode: "COMPLAINT_SUBMISSION_FAILED",
      message: "Failed to submit complaint"
    });
  }
}
```

### i18n Fallbacks
- Uses `detectedLocale` when domain match fails
- Defaults to first locale in `locales` array

---

## Performance
### Optimizations
1. **Static Optimization**: Pre-rendered complaint forms
2. **API Cache-Control**: `res.setHeader('Cache-Control', 's-maxage=60')`
3. **Code Splitting**: Dynamic imports for admin components

### Limitations
- Client-side cookies increase initial payload size
- No CDN configuration in base implementation

---

## Technical Specifications

### Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| next | ^12.x | Framework core |
| react-router-dom | ^6.x | Client-side routing |
| js-cookie | ^3.x | Client-side cookie management |
| lucide-react | ^0.2.x | Icon system |

### Browser Support
Targets modern browsers (ES2020+):
- Chrome >= 90
- Firefox >= 88
- Safari >= 14.1

---

## Code Examples

### Complaint Submission
```javascript
// pages/api/complaints.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description } = req.body;
    const session = JSON.parse(Cookies.get('session'));

    try {
      await db.complaints.create({
        userId: session.userId,
        title,
        description
      });
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Submission failed" });
    }
  }
}
```

### Localized Route Handling
```javascript
// middleware.js
import { getDomainLocale } from 'next/dist/client/get-domain-locale';

export function middleware(req) {
  const locale = getDomainLocale(
    req.nextUrl.pathname,
    req.headers.get('accept-language'),
    ['en', 'es'],
    config.domains
  );

  req.nextUrl.locale = locale;
  return NextResponse.rewrite(req.nextUrl);
}
```

---

## Contribution Guidelines

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with TypeScript typings
3. Update snapshot tests: `npm test -u`
4. Submit PR with architecture diagram updates

### Testing Matrix
| Test Type | Command | Coverage |
|-----------|---------|----------|
| Unit | `npm test` | >80% |
| E2E | `npm run test:e2e` | 100% critical paths |
| i18n | `npm run test:i18n` | All locale combinations |

### Performance Budget
| Metric | Threshold |
|--------|-----------|
| JS Bundle | <150KB |
| TTI | <3s 3G |
| FCP | <1.5s |
```