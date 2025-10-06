# ABEMIS 3.0

Agricultural & Biosystems Engineering Management Information System

A modern, responsive web application built with Next.js, TypeScript, React, and Tailwind CSS for managing agricultural and biosystems engineering projects.

## Features

- **Role-based Authentication**: Admin, Engineer, and Stakeholder roles with different permissions
- **Project Management**: Track infrastructure and FMR (Farm Management and Research) projects
- **Document Management**: Upload, review, and manage project documents
- **Analytics Dashboard**: View project statistics and performance metrics
- **Responsive Design**: Mobile-first design with collapsible sidebar
- **Dark/Light Theme**: System theme detection with manual toggle
- **Mock Data**: Complete frontend-only implementation with localStorage persistence

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd abemis-3.0
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

The application includes mock authentication with the following test credentials:

- **Admin**: Any email + password `admin123`
- **Engineer**: Any email + password `eng123`  
- **Stakeholder**: Any email + any other password

## Project Structure

```
app/
├── (public)/
│   └── login/
│       └── page.tsx          # Login page
├── (protected)/
│   ├── layout.tsx            # Protected layout with sidebar
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard with stats
│   ├── projects/
│   │   └── page.tsx          # Projects listing
│   ├── documents/
│   │   └── page.tsx          # Documents management
│   ├── analytics/
│   │   └── page.tsx          # Analytics dashboard
│   └── settings/
│       └── page.tsx          # User settings
components/
├── ui/                       # shadcn/ui components
├── app-sidebar.tsx           # Main navigation sidebar
├── topbar.tsx                # Top navigation bar
├── stat-card.tsx             # Dashboard stat cards
├── data-table.tsx            # Reusable data table
└── ...                       # Other components
lib/
├── contexts/
│   └── auth-context.tsx      # Authentication context
├── mock/
│   ├── auth.ts              # Mock authentication
│   └── data.ts              # Mock data
├── providers/
│   └── theme-provider.tsx   # Theme provider
├── types.ts                 # TypeScript types
└── utils.ts                 # Utility functions
```

## Key Features

### Authentication & Authorization
- Mock authentication with localStorage persistence
- Role-based access control (Admin, Engineer, Stakeholder)
- Protected routes with automatic redirects
- Session management with expiration

### Dashboard
- Key performance indicators (KPIs)
- Recent activities feed
- Quick overview cards
- Responsive grid layout

### Project Management
- Project listing with filtering and search
- Status tracking (Proposal, Procurement, Implementation, Completed)
- Project type categorization (FMR, Infrastructure)
- Budget and timeline information

### Document Management
- Document upload and listing
- Status tracking (Validated, For Review, Missing)
- File type support (PDF, DOCX, XLSX, DWG)
- Linked project association

### Analytics
- Project distribution charts
- Status overview
- Performance metrics
- Placeholder for real chart integration

### Settings
- User profile management
- Theme preferences (light/dark)
- Notification settings
- System information

## Role Permissions

### Admin
- Access to all features
- Can view Analytics and Settings
- Full system access

### Engineer
- Access to Dashboard, Projects, Documents, Analytics
- Cannot access Settings
- Project management capabilities

### Stakeholder
- Access to Dashboard, Projects, Documents
- Cannot access Analytics or Settings
- Read-only access to most features

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration for TypeScript
- Prettier for code formatting
- Tailwind CSS for styling
- Absolute imports with `@/` prefix

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
