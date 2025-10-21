# Form Builder Feature

## Overview

The Form Builder is a powerful admin-only feature that allows administrators to create and customize dynamic forms for different project types in the ABEMIS system. This feature provides a drag-and-drop interface for building forms with various input types and validation rules.

## Features

### 🎯 Core Functionality
- **Admin-Only Access**: Restricted to users with 'admin' role
- **Drag-and-Drop Interface**: Intuitive form building experience
- **Real-time Preview**: See how forms will look to end users
- **Form Persistence**: Save and load form configurations
- **Dynamic Form Rendering**: Render forms based on saved configurations

### 📋 Supported Form Types
1. **Infrastructure**
   - Infra Registration Form
   - Infra Stages Configuration

2. **Machinery**
   - Machinery Registration Form
   - Machinery Stages Configuration

3. **FMR (Farm-to-Market Road)**
   - FMR Registration Form
   - FMR Stages Configuration

4. **Package Project**
   - Package Registration Form
   - Package Stages Configuration

### 🧩 Form Elements
- **Text Input**: Single-line text fields
- **Email**: Email address validation
- **Number**: Numeric input with min/max validation
- **Date Picker**: Date selection
- **File Upload**: File attachment fields
- **Dropdown**: Select from predefined options
- **Text Area**: Multi-line text input
- **Checkbox**: Boolean input
- **Radio Buttons**: Single selection from options

## File Structure

```
components/
├── form-builder-interface.tsx     # Main form builder component
├── form-preview.tsx               # Form preview component
├── dynamic-form-renderer.tsx      # Dynamic form renderer
└── infrastructure-form-integration.tsx # Integration example

app/(protected)/form-builder/
├── page.tsx                       # Main form builder page
└── [formType]/[optionId]/
    └── page.tsx                   # Dynamic form builder pages

lib/
└── types.ts                       # FormField and FormConfig interfaces
```

## Usage

### 1. Accessing the Form Builder

Only admin users can access the Form Builder through the sidebar navigation:
- Navigate to "Form Builder" in the admin sidebar
- Select a project type (Infrastructure, Machinery, FMR, Package Project)
- Choose a specific form to configure

### 2. Building Forms

1. **Add Fields**: Drag elements from the left panel or click the + button
2. **Configure Fields**: Click on fields to configure their properties:
   - Label and placeholder text
   - Required field status
   - Validation rules (min/max for numbers)
   - Options for select/radio fields
3. **Preview**: Use the Preview tab to see how the form will appear
4. **Save**: Form configurations are automatically saved to localStorage

### 3. Form Configuration

Each form configuration includes:
- **Basic Info**: Title and description
- **Fields**: Array of form fields with their properties
- **Validation**: Field-level validation rules
- **Options**: For select and radio button fields

### 4. Integration with Existing Forms

The Form Builder can be integrated with existing project modals:

```tsx
import { InfrastructureFormIntegration } from '@/components/infrastructure-form-integration'

// Use in your component
<InfrastructureFormIntegration
  formType="infra-registration"
  onFormSubmit={(data) => {
    // Handle form submission
    console.log('Form data:', data)
  }}
  onFormCancel={() => {
    // Handle form cancellation
  }}
/>
```

## Technical Implementation

### Form Configuration Structure

```typescript
interface FormConfig {
  id: string
  title: string
  description: string
  fields: FormField[]
}

interface FormField {
  id: string
  type: 'text' | 'email' | 'number' | 'date' | 'file' | 'select' | 'textarea' | 'checkbox' | 'radio'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}
```

### Data Persistence

- Form configurations are stored in localStorage
- Key format: `form-config-{formType}-{optionId}`
- Automatic saving on configuration changes
- Loading of saved configurations on page load

### Validation

- **Required Fields**: Client-side validation for required fields
- **Number Validation**: Min/max value validation
- **Email Validation**: Built-in email format validation
- **File Validation**: File type and size validation

## Security

- **Role-Based Access**: Only admin users can access the Form Builder
- **Input Sanitization**: All form inputs are sanitized
- **Validation**: Client-side and server-side validation
- **File Upload Security**: Restricted file types and sizes

## Future Enhancements

### Planned Features
- **Server-Side Storage**: Move from localStorage to database
- **Form Templates**: Pre-built form templates
- **Advanced Validation**: Custom validation rules
- **Form Analytics**: Track form usage and completion rates
- **Multi-Step Forms**: Support for multi-step form workflows
- **Conditional Logic**: Show/hide fields based on other field values
- **Form Versioning**: Track form configuration changes
- **Export/Import**: Export and import form configurations

### Integration Opportunities
- **API Integration**: Connect with backend APIs
- **Workflow Integration**: Integrate with project workflows
- **Notification System**: Form submission notifications
- **Audit Trail**: Track form modifications and submissions

## Troubleshooting

### Common Issues

1. **Form Builder Not Accessible**
   - Ensure user has 'admin' role
   - Check navigation permissions

2. **Form Configuration Not Loading**
   - Check localStorage for saved configurations
   - Verify form type and option ID

3. **Preview Not Working**
   - Ensure all required fields are configured
   - Check for validation errors

4. **Form Submission Issues**
   - Verify form validation rules
   - Check required field completion

### Debug Mode

Enable debug mode by adding `?debug=true` to the URL to see:
- Form configuration details
- Validation errors
- Field properties

## Contributing

When adding new form elements or features:

1. Update the `FormField` type in `lib/types.ts`
2. Add the new element to `form-builder-interface.tsx`
3. Implement rendering in `dynamic-form-renderer.tsx`
4. Add validation rules if needed
5. Update documentation

## Support

For issues or questions regarding the Form Builder:
1. Check the troubleshooting section
2. Review the component documentation
3. Contact the development team
4. Create an issue in the project repository
