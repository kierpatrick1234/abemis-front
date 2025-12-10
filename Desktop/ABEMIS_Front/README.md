# ABEMIS 3.0

Agricultural & Biosystems Engineering Management Information System

A modern, responsive web application built with Next.js, TypeScript, React, and Tailwind CSS for managing agricultural and biosystems engineering projects. ABEMIS 3.0 is the official information system of the Department of Agriculture - Bureau of Agricultural and Fisheries Engineering (DA-BAFE) Central Office.

## Features

- **Role-based Authentication**: Multiple user roles (Admin, Engineer, Stakeholder, RAED, EPDSD, PPMD, SEPD, Manager, Supervisor, etc.) with granular permissions
- **Comprehensive Project Management**: Track multiple project types including Infrastructure, FMR (Farm-to-Market Road), Machinery, and Package Projects
- **Dynamic Form Builder**: Admin-only drag-and-drop form builder for creating custom project registration forms
- **Interactive Project Map**: Visualize project locations across the Philippines with clustering and region filtering
- **Document Management**: Upload, review, validate, and manage project documents with status tracking
- **Project Tracking**: Public-facing project tracking system on landing page for stakeholders
- **Analytics Dashboard**: View project statistics, performance metrics, and distribution charts
- **Evaluation System**: Project evaluation workflow for EPDSD users
- **AI Chatbot**: Integrated chatbot assistant for system help and guidance
- **Notifications**: Real-time notification system with dropdown and dedicated notifications page
- **Responsive Design**: Mobile-first design with collapsible sidebar
- **Dark/Light Theme**: System theme detection with manual toggle
- **District Mapping**: Integration with PSGC (Philippine Standard Geographic Code) API for location data
- **Mock Data**: Complete frontend-only implementation with localStorage persistence

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Theme**: next-themes
- **Maps**: Leaflet + React Leaflet with Marker Clustering
- **Charts**: Recharts
- **File Processing**: XLSX (Excel file support)
- **Location Services**: PSGC API integration

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
- **RAED**: Any email + password `raed123`
- **EPDSD**: Any email + password `epdsd123`
- **PPMD**: Any email + password `ppmd123`
- **SEPD**: Any email + password `sepd123`

## Project Structure

```
app/
├── (public)/
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── verify-email/
│   │   └── page.tsx          # Email verification
│   └── verification-success/
│       └── page.tsx          # Verification success page
├── (protected)/
│   ├── layout.tsx            # Protected layout with sidebar
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard with stats and KPIs
│   ├── projects/
│   │   └── page.tsx          # General projects listing
│   ├── epdsd-projects/
│   │   └── page.tsx          # EPDSD-specific projects
│   ├── sepd-projects/
│   │   └── page.tsx          # SEPD-specific projects
│   ├── ppmd-projects/
│   │   └── page.tsx          # PPMD-specific projects
│   ├── raed-projects/        # RAED-specific projects
│   ├── documents/
│   │   └── page.tsx          # Documents management
│   ├── document-manager/
│   │   └── page.tsx          # RAED document manager
│   ├── document-test/
│   │   └── page.tsx          # Document testing page
│   ├── analytics/
│   │   └── page.tsx          # Analytics dashboard
│   ├── my-evaluation/
│   │   └── page.tsx          # EPDSD evaluation page
│   ├── form-builder/
│   │   ├── page.tsx          # Form builder main page
│   │   └── [formType]/[optionId]/
│   │       └── page.tsx      # Dynamic form builder pages
│   ├── notifications/
│   │   └── page.tsx          # Notifications page
│   ├── profile/
│   │   └── page.tsx          # User profile
│   ├── users/
│   │   └── page.tsx          # User management (admin)
│   └── summary/
│       └── page.tsx          # Summary view (VIEWER role)
├── landing/
│   └── page.tsx              # Public landing page with project tracking
├── layout.tsx                # Root layout
├── page.tsx                  # Home page
├── globals.css               # Global styles
└── not-found.tsx             # 404 page

components/
├── ui/                       # shadcn/ui components
├── app-sidebar.tsx           # Main navigation sidebar
├── topbar.tsx                # Top navigation bar
├── chatbot.tsx               # AI chatbot component
├── project-map.tsx           # Interactive project map
├── form-builder-interface.tsx # Form builder UI
├── dynamic-form-renderer.tsx # Dynamic form renderer
├── project-details-modal.tsx # Project details modal
├── notification-dropdown.tsx # Notification dropdown
├── data-table.tsx            # Reusable data table
└── ...                       # Other components

lib/
├── contexts/
│   ├── auth-context.tsx      # Authentication context
│   ├── chatbot-context.tsx   # Chatbot context
│   ├── evaluation-context.tsx # Evaluation context
│   └── theme-context.tsx    # Theme context
├── mock/
│   ├── auth.ts              # Mock authentication
│   ├── data.ts              # Mock data
│   ├── raed-projects.ts     # RAED project data
│   └── ...                  # Other mock data files
├── services/
│   ├── psgc-api.ts          # PSGC API service
│   └── congressional-district-mapping.ts # District mapping
├── providers/
│   └── theme-provider.tsx   # Theme provider
├── types.ts                 # TypeScript types
└── utils.ts                 # Utility functions
```

## Key Features

### Authentication & Authorization
- Mock authentication with localStorage persistence
- Role-based access control with 12+ user roles
- Protected routes with automatic redirects
- Session management with expiration
- Email verification flow (UI implemented)
- Role-specific navigation and permissions

### Dashboard
- Key performance indicators (KPIs) with trend indicators
- Recent activities feed
- Quick overview cards with icons
- Responsive grid layout
- Project statistics and summaries
- Status distribution visualizations

### Project Management
- **Multiple Project Types**: Infrastructure, FMR, Machinery, Package Projects
- Project listing with filtering, search, and sorting
- Status tracking (Proposal, Procurement, Implementation, Completed)
- Budget and timeline information
- Project details modals with comprehensive information
- **Role-Specific Views**: 
  - EPDSD Projects page
  - SEPD Projects page
  - PPMD Projects page
  - RAED Projects page
- Interactive project map with clustering
- Region and province filtering
- Project creation and editing workflows

### Form Builder (Admin Only)
- Drag-and-drop form building interface
- Real-time form preview
- Support for multiple form types (Infrastructure, Machinery, FMR, Package)
- Dynamic form rendering based on saved configurations
- Form field types: text, email, number, date, file, dropdown, textarea, checkbox, radio
- Form validation and configuration
- localStorage persistence for form configurations
- See [FORM_BUILDER_README.md](./FORM_BUILDER_README.md) for detailed documentation

### Document Management
- Document upload and listing
- Status tracking (Validated, For Review, Missing)
- File type support (PDF, DOCX, XLSX, DWG)
- Linked project association
- Document preview modal
- Document sidebar for navigation
- Role-specific document managers

### Project Tracking (Public)
- Public-facing project tracking on landing page
- Project code search functionality
- Progress visualization with milestones
- Status and timeline information
- Budget and location details

### Interactive Map
- Leaflet-based interactive map
- Project location markers with clustering
- Region-based filtering and zooming
- Marker popups with project information
- Responsive map controls

### Analytics
- Project distribution charts using Recharts
- Status overview visualizations
- Performance metrics
- Project type breakdowns
- Regional distribution analysis

### Evaluation System
- EPDSD evaluation workflow
- Project evaluation interface
- Evaluation context management
- Status tracking for evaluations

### Chatbot
- AI-powered chatbot assistant
- Context-aware responses
- System help and guidance
- Minimizable/maximizable interface
- Quick action suggestions

### Notifications
- Real-time notification system
- Notification dropdown in topbar
- Dedicated notifications page
- Notification templates
- Role-based notification filtering

### Location Services
- PSGC (Philippine Standard Geographic Code) API integration
- Congressional district mapping
- Region, province, and municipality data
- Location-based project filtering

### Settings & Profile
- User profile management
- Theme preferences (light/dark/system)
- Notification settings
- System information
- User management (admin only)

## Role Permissions

### Admin / Superadmin
- Access to all features
- Form Builder access (create and edit dynamic forms)
- User management
- Analytics and Settings access
- Full system access

### Engineer
- Access to Dashboard, Projects, Documents, Analytics
- Project management capabilities
- Cannot access Settings or Form Builder

### Stakeholder / Read
- Access to Dashboard, Projects, Documents
- Cannot access Analytics, Settings, or Form Builder
- Read-only access to most features

### RAED (Regional Agricultural Engineering Division)
- Access to Dashboard, Projects, Document Manager
- RAED-specific project views
- Document management capabilities

### EPDSD (Engineering Planning and Design Services Division)
- Access to Dashboard, EPDSD Projects, Document Manager
- My Evaluation page access
- Project evaluation capabilities

### PPMD (Project Planning and Management Division)
- Access to Dashboard, PPMD Projects, Document Manager
- PPMD-specific project views

### SEPD (Systems Engineering and Planning Division)
- Access to Dashboard, SEPD Projects, Document Manager
- SEPD-specific project views

### Manager / Supervisor
- Enhanced project management capabilities
- Access to Analytics
- Team oversight features

### VIEWER
- Access to Summary page only
- Read-only access to project summaries

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes changelog generation)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run changelog` - Generate changelog from git history

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

## Additional Documentation

- **[Form Builder Documentation](./FORM_BUILDER_README.md)** - Comprehensive guide to the Form Builder feature

## Environment Variables

Currently, the application uses mock data stored in localStorage. For production deployment, you may need to configure:

- API endpoints for backend integration
- Environment variables for external services
- Database connection strings (when backend is integrated)

## Deployment

The application is configured for deployment on Vercel (see `vercel.json`). To deploy:

1. Build the project: `npm run build`
2. Deploy to your hosting platform
3. Configure environment variables if needed

## Known Limitations

- Currently uses localStorage for data persistence (frontend-only)
- Mock authentication (no real backend integration)
- Form Builder configurations stored in localStorage
- No real-time collaboration features
- File uploads are simulated (not actually stored)

## Future Enhancements

- Backend API integration
- Database persistence
- Real file upload and storage
- Real-time notifications
- Advanced analytics and reporting
- Export functionality (PDF, Excel)
- Multi-language support
- Advanced search and filtering
- Audit logging
- Workflow automation

## Support

For support and questions, please contact the development team or create an issue in the repository.

## License

This project is licensed under the MIT License.
