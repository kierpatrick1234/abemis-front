'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Megaphone,
  RotateCcw,
  Eye,
  FileText,
  Shield,
  Lock,
  UserCheck,
  AlertTriangle,
  Search,
  Download,
  Filter,
  X,
  Save
} from 'lucide-react'
import { Announcement, DeliveryMethod, TargetAudience, Frequency, OperatingUnit, Role, AuditLog, PasswordPolicy, SessionPolicy } from '@/lib/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// RAED Regions List
const RAED_REGIONS = [
  'Region I (Ilocos Region)',
  'Region II (Cagayan Valley)',
  'Region III (Central Luzon)',
  'Region IV-A (CALABARZON)',
  'Region IV-B (MIMAROPA)',
  'Region V (Bicol Region)',
  'Region VI (Western Visayas)',
  'Region VII (Central Visayas)',
  'Region VIII (Eastern Visayas)',
  'Region IX (Zamboanga Peninsula)',
  'Region X (Northern Mindanao)',
  'Region XI (Davao Region)',
  'Region XII (SOCCSKSARGEN)',
  'Region XIII (Caraga)',
  'CAR (Cordillera Administrative Region)',
  'NCR (National Capital Region)',
  'BARMM (Bangsamoro Autonomous Region in Muslim Mindanao)'
]

// Available Roles
const AVAILABLE_ROLES: Role[] = [
  'admin',
  'engineer',
  'stakeholder',
  'read',
  'manager',
  'supervisor',
  'superadmin',
  'RAED',
  'EPDSD',
  'PPMD',
  'SEPD',
  'VIEWER'
]

// Available Permissions
const AVAILABLE_PERMISSIONS = [
  'Create Projects',
  'Edit Projects',
  'Delete Projects',
  'View Projects',
  'Evaluate Projects',
  'Approve Projects',
  'Manage Users',
  'Manage Announcements',
  'Manage Operating Units',
  'View Reports',
  'Generate Reports',
  'Manage Documents',
  'Upload Documents',
  'Download Documents',
  'Manage System Configuration',
  'View Analytics',
  'Export Data'
]

// Default operating units
const getDefaultOperatingUnits = (userId: string): OperatingUnit[] => {
  const now = new Date().toISOString()
  return [
    {
      id: 'ou-1',
      name: 'EPDSD',
      responsibility: 'Engineering Planning and Design Services Division - Responsible for project planning, design, and engineering services',
      scope: 'All infrastructure and engineering projects requiring planning and design services',
      roles: ['EPDSD', 'engineer', 'evaluator'] as Role[],
      permissions: ['View Projects', 'Evaluate Projects', 'Approve Projects', 'Manage Documents', 'View Reports'],
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
    {
      id: 'ou-2',
      name: 'PPMD',
      responsibility: 'Project Planning and Management Division - Manages project implementation, monitoring, and evaluation',
      scope: 'Project management, monitoring, and evaluation across all project types',
      roles: ['PPMD', 'manager', 'supervisor'] as Role[],
      permissions: ['Create Projects', 'Edit Projects', 'View Projects', 'Manage Documents', 'View Reports', 'Generate Reports'],
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
    {
      id: 'ou-3',
      name: 'SEPD',
      responsibility: 'Systems Engineering and Planning Division - Handles systems engineering and strategic planning',
      scope: 'Systems engineering, strategic planning, and technical support services',
      roles: ['SEPD', 'engineer', 'evaluator'] as Role[],
      permissions: ['View Projects', 'Evaluate Projects', 'Approve Projects', 'Manage Documents', 'View Reports', 'View Analytics'],
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
    {
      id: 'ou-4',
      name: 'RAED',
      responsibility: 'Regional Agricultural Engineering Division - Regional project coordination and field implementation',
      scope: 'Regional project coordination, field implementation, and regional project evaluation',
      roles: ['RAED', 'engineer'] as Role[],
      permissions: ['Create Projects', 'Edit Projects', 'View Projects', 'Upload Documents', 'Download Documents', 'View Reports'],
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
  ]
}

// Default announcements
const getDefaultAnnouncements = (userId: string): Announcement[] => {
  const now = new Date().toISOString()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDate = tomorrow.toISOString().split('T')[0]
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextWeekDate = nextWeek.toISOString().split('T')[0]
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const nextMonthDate = nextMonth.toISOString().split('T')[0]

  return [
    {
      id: 'announcement-default-1',
      title: 'Quarterly Accomplishment Submission Reminder',
      message: 'All valid accomplishments for the 3rd Quarter are already uploaded to the IMS. Kindly provide justifications and ensure all documentation is complete before the deadline.',
      deliveryMethods: ['in-app', 'email'] as DeliveryMethod[],
      targetAudience: 'all-raed' as TargetAudience,
      isScheduled: false,
      frequency: 'quarterly' as Frequency,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
    {
      id: 'announcement-default-2',
      title: 'System Maintenance Notice',
      message: 'Scheduled system maintenance will be performed on the upcoming weekend. The system will be unavailable from Saturday 10:00 PM to Sunday 2:00 AM. Please save your work in advance.',
      deliveryMethods: ['email', 'sms', 'in-app'] as DeliveryMethod[],
      targetAudience: 'all-operating-units' as TargetAudience,
      scheduledDate: tomorrowDate,
      scheduledTime: '09:00',
      isScheduled: true,
      frequency: 'none' as Frequency,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
    {
      id: 'announcement-default-3',
      title: 'New Feature Release: Enhanced Reporting',
      message: 'We are excited to announce the release of enhanced reporting features. You can now generate comprehensive reports with advanced filtering options. Check out the new features in the Reports section.',
      deliveryMethods: ['in-app', 'email'] as DeliveryMethod[],
      targetAudience: 'all-operating-units' as TargetAudience,
      isScheduled: false,
      frequency: 'none' as Frequency,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
    {
      id: 'announcement-default-4',
      title: 'PPMD Project Monitoring Update',
      message: 'All PPMD projects are required to submit monthly monitoring reports by the 5th of each month. Please ensure all project status updates, budget utilization, and milestone achievements are documented accurately.',
      deliveryMethods: ['email', 'in-app'] as DeliveryMethod[],
      targetAudience: 'specific-operating-unit' as TargetAudience,
      specificOperatingUnit: 'PPMD',
      scheduledDate: nextWeekDate,
      scheduledTime: '08:00',
      isScheduled: true,
      frequency: 'monthly' as Frequency,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
    {
      id: 'announcement-default-5',
      title: 'SEPD Infrastructure Project Evaluation Guidelines',
      message: 'New evaluation guidelines for infrastructure projects have been released. All SEPD evaluators must review the updated criteria and standards before conducting project evaluations. Training materials are available in the Resources section.',
      deliveryMethods: ['email', 'sms', 'in-app'] as DeliveryMethod[],
      targetAudience: 'specific-operating-unit' as TargetAudience,
      specificOperatingUnit: 'SEPD',
      isScheduled: false,
      frequency: 'none' as Frequency,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
    {
      id: 'announcement-default-6',
      title: 'RAED Regional Meeting Schedule',
      message: 'Monthly regional coordination meeting for all RAED personnel will be held on the last Friday of each month at 2:00 PM. Agenda items include project updates, regional performance review, and upcoming initiatives. Virtual attendance option available.',
      deliveryMethods: ['email', 'in-app'] as DeliveryMethod[],
      targetAudience: 'all-raed' as TargetAudience,
      scheduledDate: nextMonthDate,
      scheduledTime: '14:00',
      isScheduled: true,
      frequency: 'monthly' as Frequency,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
    {
      id: 'announcement-default-7',
      title: 'Budget Allocation Update for Q4 2024',
      message: 'The Q4 2024 budget allocation has been finalized and distributed across all operating units. Please review your unit\'s allocated budget in the Finance section. Budget utilization reports must be submitted weekly.',
      deliveryMethods: ['email', 'in-app'] as DeliveryMethod[],
      targetAudience: 'all-operating-units' as TargetAudience,
      isScheduled: false,
      frequency: 'quarterly' as Frequency,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    },
  ]
}

export default function SystemPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  // Initialize with empty array, will be populated by useEffect
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [previewingAnnouncement, setPreviewingAnnouncement] = useState<Announcement | null>(null)
  const [previewMode, setPreviewMode] = useState<'sms' | 'email' | 'in-app'>('in-app')
  const [highlightedAnnouncementId, setHighlightedAnnouncementId] = useState<string | null>(null)
  
  // Operating Units state
  const [operatingUnits, setOperatingUnits] = useState<OperatingUnit[]>([])
  const [isOperatingUnitsInitialized, setIsOperatingUnitsInitialized] = useState(false)
  const [isOperatingUnitModalOpen, setIsOperatingUnitModalOpen] = useState(false)
  const [editingOperatingUnit, setEditingOperatingUnit] = useState<OperatingUnit | null>(null)
  const [isOperatingUnitDeleteDialogOpen, setIsOperatingUnitDeleteDialogOpen] = useState(false)
  const [operatingUnitToDelete, setOperatingUnitToDelete] = useState<OperatingUnit | null>(null)
  const [operatingUnitFormData, setOperatingUnitFormData] = useState({
    name: '',
    responsibility: '',
    scope: '',
    roles: [] as Role[],
    permissions: [] as string[],
  })
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    deliveryMethods: [] as DeliveryMethod[],
    targetAudience: 'all-operating-units' as TargetAudience,
    specificOperatingUnit: '',
    specificRAED: '',
    scheduledDate: '',
    scheduledTime: '',
    isScheduled: false,
    frequency: 'none' as Frequency,
    isActive: true,
  })

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [isAuditLogsInitialized, setIsAuditLogsInitialized] = useState(false)
  const [auditLogsSearch, setAuditLogsSearch] = useState('')
  const [auditLogsFilter, setAuditLogsFilter] = useState<'all' | AuditLog['category']>('all')
  const [auditLogsStatusFilter, setAuditLogsStatusFilter] = useState<'all' | AuditLog['status']>('all')
  
  // Password Policy state
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90,
    preventReuse: 5,
    lockoutAttempts: 5,
    lockoutDuration: 30,
    requireChangeOnFirstLogin: true,
  })
  const [isPasswordPolicyInitialized, setIsPasswordPolicyInitialized] = useState(false)
  
  // Session Policy state
  const [sessionPolicy, setSessionPolicy] = useState<SessionPolicy>({
    sessionTimeout: 480, // 8 hours
    maxConcurrentSessions: 3,
    requireReauthForSensitiveActions: true,
    idleTimeout: 30,
    rememberMeDuration: 30,
  })
  const [isSessionPolicyInitialized, setIsSessionPolicyInitialized] = useState(false)
  
  // Edit mode states
  const [isEditingPasswordPolicy, setIsEditingPasswordPolicy] = useState(false)
  const [isEditingSessionPolicy, setIsEditingSessionPolicy] = useState(false)
  const [tempPasswordPolicy, setTempPasswordPolicy] = useState<PasswordPolicy | null>(null)
  const [tempSessionPolicy, setTempSessionPolicy] = useState<SessionPolicy | null>(null)

  // Load announcements from localStorage or use defaults
  useEffect(() => {
    if (loading || isInitialized) return // Wait for auth to load, and only run once
    
    const stored = localStorage.getItem('abemis-announcements')
    let loadedAnnouncements: Announcement[] = []
    
    // Try to load from localStorage
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Check if parsed is valid array and has items
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedAnnouncements = parsed
        }
      } catch (error) {
        console.error('Error loading announcements:', error)
        // Will fall through to use defaults
      }
    }
    
    // If no valid announcements found, use defaults
    if (loadedAnnouncements.length === 0) {
      loadedAnnouncements = getDefaultAnnouncements(user?.id || 'admin')
      // Save defaults to localStorage
      localStorage.setItem('abemis-announcements', JSON.stringify(loadedAnnouncements))
    }
    
    // Set announcements and mark as initialized
    setAnnouncements(loadedAnnouncements)
    setIsInitialized(true)
  }, [user?.id, loading, isInitialized])

  // Load operating units from localStorage or use defaults
  useEffect(() => {
    if (loading || isOperatingUnitsInitialized) return
    
    const stored = localStorage.getItem('abemis-operating-units')
    let loadedOperatingUnits: OperatingUnit[] = []
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedOperatingUnits = parsed
        }
      } catch (error) {
        console.error('Error loading operating units:', error)
      }
    }
    
    if (loadedOperatingUnits.length === 0) {
      loadedOperatingUnits = getDefaultOperatingUnits(user?.id || 'admin')
      localStorage.setItem('abemis-operating-units', JSON.stringify(loadedOperatingUnits))
    }
    
    setOperatingUnits(loadedOperatingUnits)
    setIsOperatingUnitsInitialized(true)
  }, [user?.id, loading, isOperatingUnitsInitialized])

  // Save operating units to localStorage
  const saveOperatingUnits = (newOperatingUnits: OperatingUnit[]) => {
    localStorage.setItem('abemis-operating-units', JSON.stringify(newOperatingUnits))
    setOperatingUnits(newOperatingUnits)
  }

  // Load audit logs from localStorage
  useEffect(() => {
    if (loading || isAuditLogsInitialized) return
    
    const stored = localStorage.getItem('abemis-audit-logs')
    let loadedLogs: AuditLog[] = []
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedLogs = parsed
        }
      } catch (error) {
        console.error('Error loading audit logs:', error)
      }
    }
    
    // If no logs, create comprehensive sample logs for each category
    if (loadedLogs.length === 0) {
      const now = new Date()
      loadedLogs = [
        // Authentication Category (5+ examples)
        {
          id: 'audit-auth-1',
          action: 'User Login',
          category: 'authentication',
          userId: 'user-001',
          userName: 'John Engineer',
          userEmail: 'john.engineer@abemis.gov.ph',
          userRole: 'engineer',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success',
          timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'audit-auth-2',
          action: 'Password Changed',
          category: 'authentication',
          userId: 'user-002',
          userName: 'Jane Manager',
          userEmail: 'jane.manager@abemis.gov.ph',
          userRole: 'manager',
          ipAddress: '192.168.1.105',
          status: 'success',
          details: 'Password successfully updated',
          timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
        },
        {
          id: 'audit-auth-3',
          action: 'Failed Login Attempt',
          category: 'authentication',
          userId: 'unknown',
          userName: 'Unknown User',
          userEmail: 'attacker@example.com',
          userRole: 'admin',
          ipAddress: '203.0.113.45',
          status: 'failure',
          details: 'Invalid credentials provided',
          timestamp: new Date(now.getTime() - 10800000).toISOString(), // 3 hours ago
        },
        {
          id: 'audit-auth-4',
          action: 'Session Expired',
          category: 'authentication',
          userId: 'user-003',
          userName: 'Mike Supervisor',
          userEmail: 'mike.supervisor@abemis.gov.ph',
          userRole: 'supervisor',
          ipAddress: '192.168.1.110',
          status: 'warning',
          details: 'Session expired due to inactivity',
          timestamp: new Date(now.getTime() - 14400000).toISOString(), // 4 hours ago
        },
        {
          id: 'audit-auth-5',
          action: 'Account Locked',
          category: 'authentication',
          userId: 'user-004',
          userName: 'Sarah Engineer',
          userEmail: 'sarah.engineer@abemis.gov.ph',
          userRole: 'engineer',
          ipAddress: '192.168.1.115',
          status: 'warning',
          details: 'Account locked after 5 failed login attempts',
          timestamp: new Date(now.getTime() - 18000000).toISOString(), // 5 hours ago
        },
        {
          id: 'audit-auth-6',
          action: 'Password Reset Request',
          category: 'authentication',
          userId: 'user-005',
          userName: 'David RAED',
          userEmail: 'david.raed@abemis.gov.ph',
          userRole: 'RAED',
          ipAddress: '192.168.1.120',
          status: 'success',
          details: 'Password reset email sent',
          timestamp: new Date(now.getTime() - 21600000).toISOString(), // 6 hours ago
        },
        
        // User Management Category (5+ examples)
        {
          id: 'audit-user-1',
          action: 'User Created',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-010',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'New user created: alice.engineer@abemis.gov.ph with role engineer',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-user-2',
          action: 'User Updated',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-011',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'User role changed from engineer to manager',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-user-3',
          action: 'User Deactivated',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-012',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'User account deactivated',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        {
          id: 'audit-user-4',
          action: 'User Invited',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'invite-001',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Invitation sent to new.user@abemis.gov.ph',
          timestamp: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
        },
        {
          id: 'audit-user-5',
          action: 'Bulk User Import',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: '15 users imported from CSV file',
          timestamp: new Date(now.getTime() - 432000000).toISOString(), // 5 days ago
        },
        {
          id: 'audit-user-6',
          action: 'User Role Changed',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-013',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'User role updated from stakeholder to engineer',
          timestamp: new Date(now.getTime() - 518400000).toISOString(), // 6 days ago
        },
        
        // Project Category (5+ examples)
        {
          id: 'audit-project-1',
          action: 'Project Created',
          category: 'project',
          userId: 'user-020',
          userName: 'Robert Engineer',
          userEmail: 'robert.engineer@abemis.gov.ph',
          userRole: 'engineer',
          resourceType: 'project',
          resourceId: 'PRJ-001',
          ipAddress: '192.168.1.130',
          status: 'success',
          details: 'New FMR project created: Farm-to-Market Road - Northern Province',
          timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'audit-project-2',
          action: 'Project Status Updated',
          category: 'project',
          userId: 'user-021',
          userName: 'Lisa Manager',
          userEmail: 'lisa.manager@abemis.gov.ph',
          userRole: 'manager',
          resourceType: 'project',
          resourceId: 'PRJ-002',
          ipAddress: '192.168.1.135',
          status: 'success',
          details: 'Project status changed from Proposal to Procurement',
          timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
        },
        {
          id: 'audit-project-3',
          action: 'Project Deleted',
          category: 'project',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'project',
          resourceId: 'PRJ-003',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Project deleted: Cancelled Infrastructure Project',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-project-4',
          action: 'Project Budget Updated',
          category: 'project',
          userId: 'user-022',
          userName: 'Tom Supervisor',
          userEmail: 'tom.supervisor@abemis.gov.ph',
          userRole: 'supervisor',
          resourceType: 'project',
          resourceId: 'PRJ-004',
          ipAddress: '192.168.1.140',
          status: 'success',
          details: 'Budget updated from ₱5,000,000 to ₱5,500,000',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        {
          id: 'audit-project-5',
          action: 'Project Assigned',
          category: 'project',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'project',
          resourceId: 'PRJ-005',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Project assigned to John Engineer',
          timestamp: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
        },
        {
          id: 'audit-project-6',
          action: 'Project Evaluation Submitted',
          category: 'project',
          userId: 'user-023',
          userName: 'Emma EPDSD',
          userEmail: 'emma.epdsd@abemis.gov.ph',
          userRole: 'EPDSD',
          resourceType: 'project',
          resourceId: 'PRJ-006',
          ipAddress: '192.168.1.145',
          status: 'success',
          details: 'Project evaluation completed and submitted',
          timestamp: new Date(now.getTime() - 432000000).toISOString(), // 5 days ago
        },
        
        // Document Category (5+ examples)
        {
          id: 'audit-doc-1',
          action: 'Document Uploaded',
          category: 'document',
          userId: 'user-030',
          userName: 'Paul Engineer',
          userEmail: 'paul.engineer@abemis.gov.ph',
          userRole: 'engineer',
          resourceType: 'document',
          resourceId: 'DOC-001',
          ipAddress: '192.168.1.150',
          status: 'success',
          details: 'Document uploaded: Environmental Impact Assessment.pdf (2.4 MB)',
          timestamp: new Date(now.getTime() - 10800000).toISOString(), // 3 hours ago
        },
        {
          id: 'audit-doc-2',
          action: 'Document Validated',
          category: 'document',
          userId: 'user-031',
          userName: 'Nancy EPDSD',
          userEmail: 'nancy.epdsd@abemis.gov.ph',
          userRole: 'EPDSD',
          resourceType: 'document',
          resourceId: 'DOC-002',
          ipAddress: '192.168.1.155',
          status: 'success',
          details: 'Document validated: Feasibility Study.pdf',
          timestamp: new Date(now.getTime() - 14400000).toISOString(), // 4 hours ago
        },
        {
          id: 'audit-doc-3',
          action: 'Document Deleted',
          category: 'document',
          userId: 'user-032',
          userName: 'Oliver Manager',
          userEmail: 'oliver.manager@abemis.gov.ph',
          userRole: 'manager',
          resourceType: 'document',
          resourceId: 'DOC-003',
          ipAddress: '192.168.1.160',
          status: 'success',
          details: 'Document deleted: Outdated Report.pdf',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-doc-4',
          action: 'Document Download',
          category: 'document',
          userId: 'user-033',
          userName: 'Patricia RAED',
          userEmail: 'patricia.raed@abemis.gov.ph',
          userRole: 'RAED',
          resourceType: 'document',
          resourceId: 'DOC-004',
          ipAddress: '192.168.1.165',
          status: 'success',
          details: 'Document downloaded: Project Proposal.pdf',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-doc-5',
          action: 'Document Rejected',
          category: 'document',
          userId: 'user-034',
          userName: 'Quinn SEPD',
          userEmail: 'quinn.sepd@abemis.gov.ph',
          userRole: 'SEPD',
          resourceType: 'document',
          resourceId: 'DOC-005',
          ipAddress: '192.168.1.170',
          status: 'warning',
          details: 'Document rejected: Missing required information',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        {
          id: 'audit-doc-6',
          action: 'Bulk Document Upload',
          category: 'document',
          userId: 'user-035',
          userName: 'Ryan Engineer',
          userEmail: 'ryan.engineer@abemis.gov.ph',
          userRole: 'engineer',
          resourceType: 'document',
          resourceId: 'DOC-BULK-001',
          ipAddress: '192.168.1.175',
          status: 'success',
          details: '8 documents uploaded in bulk',
          timestamp: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
        },
        
        // System Config Category (5+ examples)
        {
          id: 'audit-config-1',
          action: 'Password Policy Updated',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Password policy updated: Minimum length changed to 10',
          timestamp: new Date(now.getTime() - 18000000).toISOString(), // 5 hours ago
        },
        {
          id: 'audit-config-2',
          action: 'Session Policy Updated',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Session timeout updated to 480 minutes',
          timestamp: new Date(now.getTime() - 21600000).toISOString(), // 6 hours ago
        },
        {
          id: 'audit-config-3',
          action: 'System Announcement Created',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'announcement',
          resourceId: 'ANN-001',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'New system announcement created and published',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-config-4',
          action: 'Operating Unit Created',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'operating_unit',
          resourceId: 'OU-005',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'New operating unit created: Regional Office',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-config-5',
          action: 'System Settings Backup',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'System configuration backup created',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        {
          id: 'audit-config-6',
          action: 'System Maintenance Mode Enabled',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'warning',
          details: 'System maintenance mode activated',
          timestamp: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
        },
        
        // Permission Category (5+ examples)
        {
          id: 'audit-perm-1',
          action: 'Role Permissions Updated',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'role',
          resourceId: 'role-engineer',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Engineer role permissions updated: Added "Approve Projects" permission',
          timestamp: new Date(now.getTime() - 25200000).toISOString(), // 7 hours ago
        },
        {
          id: 'audit-perm-2',
          action: 'User Permission Granted',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-040',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Special permission granted: Access to confidential projects',
          timestamp: new Date(now.getTime() - 28800000).toISOString(), // 8 hours ago
        },
        {
          id: 'audit-perm-3',
          action: 'Permission Denied',
          category: 'permission',
          userId: 'user-041',
          userName: 'Sam Stakeholder',
          userEmail: 'sam.stakeholder@abemis.gov.ph',
          userRole: 'stakeholder',
          resourceType: 'project',
          resourceId: 'PRJ-010',
          ipAddress: '192.168.1.180',
          status: 'failure',
          details: 'Access denied: Insufficient permissions to view project',
          timestamp: new Date(now.getTime() - 32400000).toISOString(), // 9 hours ago
        },
        {
          id: 'audit-perm-4',
          action: 'Role Created',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'role',
          resourceId: 'role-custom',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'New custom role created: Project Coordinator',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-perm-5',
          action: 'Bulk Permission Update',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Permissions updated for 12 users in bulk operation',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-perm-6',
          action: 'Permission Revoked',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-042',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Admin permissions revoked from user',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        
        // Other Category (5+ examples)
        {
          id: 'audit-other-1',
          action: 'Data Export',
          category: 'other',
          userId: 'user-050',
          userName: 'Tina Manager',
          userEmail: 'tina.manager@abemis.gov.ph',
          userRole: 'manager',
          ipAddress: '192.168.1.185',
          status: 'success',
          details: 'Project data exported to Excel format',
          timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'audit-other-2',
          action: 'Report Generated',
          category: 'other',
          userId: 'user-051',
          userName: 'Victor Supervisor',
          userEmail: 'victor.supervisor@abemis.gov.ph',
          userRole: 'supervisor',
          ipAddress: '192.168.1.190',
          status: 'success',
          details: 'Monthly project report generated',
          timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
        },
        {
          id: 'audit-other-3',
          action: 'API Access',
          category: 'other',
          userId: 'user-052',
          userName: 'Wendy Engineer',
          userEmail: 'wendy.engineer@abemis.gov.ph',
          userRole: 'engineer',
          ipAddress: '192.168.1.195',
          status: 'success',
          details: 'External API accessed: PSGC Location Service',
          timestamp: new Date(now.getTime() - 10800000).toISOString(), // 3 hours ago
        },
        {
          id: 'audit-other-4',
          action: 'System Error',
          category: 'other',
          userId: 'system',
          userName: 'System',
          userEmail: 'system@abemis.gov.ph',
          userRole: 'admin',
          ipAddress: '127.0.0.1',
          status: 'warning',
          details: 'Database connection timeout occurred',
          timestamp: new Date(now.getTime() - 14400000).toISOString(), // 4 hours ago
        },
        {
          id: 'audit-other-5',
          action: 'Bulk Operation',
          category: 'other',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Bulk project status update: 25 projects updated',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-other-6',
          action: 'System Health Check',
          category: 'other',
          userId: 'system',
          userName: 'System',
          userEmail: 'system@abemis.gov.ph',
          userRole: 'admin',
          ipAddress: '127.0.0.1',
          status: 'success',
          details: 'Automated system health check completed',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
      ]
      localStorage.setItem('abemis-audit-logs', JSON.stringify(loadedLogs))
    }
    
    setAuditLogs(loadedLogs)
    setIsAuditLogsInitialized(true)
  }, [user?.id, loading, isAuditLogsInitialized])

  // Load password policy from localStorage
  useEffect(() => {
    if (loading || isPasswordPolicyInitialized) return
    
    const stored = localStorage.getItem('abemis-password-policy')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPasswordPolicy(parsed)
      } catch (error) {
        console.error('Error loading password policy:', error)
      }
    } else {
      // Save default policy
      const defaultPolicy: PasswordPolicy = {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90,
        preventReuse: 5,
        lockoutAttempts: 5,
        lockoutDuration: 30,
        requireChangeOnFirstLogin: true,
      }
      localStorage.setItem('abemis-password-policy', JSON.stringify(defaultPolicy))
      setPasswordPolicy(defaultPolicy)
    }
    
    setIsPasswordPolicyInitialized(true)
  }, [loading, isPasswordPolicyInitialized])

  // Load session policy from localStorage
  useEffect(() => {
    if (loading || isSessionPolicyInitialized) return
    
    const stored = localStorage.getItem('abemis-session-policy')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSessionPolicy(parsed)
      } catch (error) {
        console.error('Error loading session policy:', error)
      }
    } else {
      // Save default policy
      const defaultPolicy: SessionPolicy = {
        sessionTimeout: 480,
        maxConcurrentSessions: 3,
        requireReauthForSensitiveActions: true,
        idleTimeout: 30,
        rememberMeDuration: 30,
      }
      localStorage.setItem('abemis-session-policy', JSON.stringify(defaultPolicy))
      setSessionPolicy(defaultPolicy)
    }
    
    setIsSessionPolicyInitialized(true)
  }, [loading, isSessionPolicyInitialized])

  // Save password policy to localStorage
  const savePasswordPolicy = (policy: PasswordPolicy) => {
    localStorage.setItem('abemis-password-policy', JSON.stringify(policy))
    setPasswordPolicy(policy)
  }

  // Save session policy to localStorage
  const saveSessionPolicy = (policy: SessionPolicy) => {
    localStorage.setItem('abemis-session-policy', JSON.stringify(policy))
    setSessionPolicy(policy)
  }

  // Password Policy handlers
  const handleModifyPasswordPolicy = () => {
    setTempPasswordPolicy({ ...passwordPolicy })
    setIsEditingPasswordPolicy(true)
  }

  const handleSavePasswordPolicy = () => {
    if (tempPasswordPolicy) {
      savePasswordPolicy(tempPasswordPolicy)
      setIsEditingPasswordPolicy(false)
      setTempPasswordPolicy(null)
    }
  }

  const handleCancelPasswordPolicy = () => {
    setIsEditingPasswordPolicy(false)
    setTempPasswordPolicy(null)
  }

  // Session Policy handlers
  const handleModifySessionPolicy = () => {
    setTempSessionPolicy({ ...sessionPolicy })
    setIsEditingSessionPolicy(true)
  }

  const handleSaveSessionPolicy = () => {
    if (tempSessionPolicy) {
      saveSessionPolicy(tempSessionPolicy)
      setIsEditingSessionPolicy(false)
      setTempSessionPolicy(null)
    }
  }

  const handleCancelSessionPolicy = () => {
    setIsEditingSessionPolicy(false)
    setTempSessionPolicy(null)
  }

  // Save announcements to localStorage
  const saveAnnouncements = (newAnnouncements: Announcement[]) => {
    localStorage.setItem('abemis-announcements', JSON.stringify(newAnnouncements))
    setAnnouncements(newAnnouncements)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not admin (only after loading is complete)
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      const redirectPath = user?.role === 'VIEWER' ? '/summary' : '/dashboard'
      router.push(redirectPath)
    }
  }, [loading, user, router])

  // Show loading or nothing while redirecting
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  const handleOpenModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement)
      setFormData({
        title: announcement.title,
        message: announcement.message,
        deliveryMethods: announcement.deliveryMethods,
        targetAudience: announcement.targetAudience,
        specificOperatingUnit: announcement.specificOperatingUnit || '',
        specificRAED: announcement.specificRAED || '',
        scheduledDate: announcement.scheduledDate || '',
        scheduledTime: announcement.scheduledTime || '',
        isScheduled: announcement.isScheduled,
        frequency: announcement.frequency || 'none',
        isActive: announcement.isActive,
      })
    } else {
      setEditingAnnouncement(null)
      setFormData({
        title: '',
        message: '',
        deliveryMethods: [],
        targetAudience: 'all-operating-units',
        specificOperatingUnit: '',
        specificRAED: '',
        scheduledDate: '',
        scheduledTime: '',
        isScheduled: false,
        frequency: 'none',
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAnnouncement(null)
      setFormData({
        title: '',
        message: '',
        deliveryMethods: [],
        targetAudience: 'all-operating-units',
        specificOperatingUnit: '',
        specificRAED: '',
        scheduledDate: '',
        scheduledTime: '',
        isScheduled: false,
        frequency: 'none',
        isActive: true,
      })
  }

  const handleDeliveryMethodToggle = (method: DeliveryMethod) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethods: prev.deliveryMethods.includes(method)
        ? prev.deliveryMethods.filter(m => m !== method)
        : [...prev.deliveryMethods, method]
    }))
  }

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields')
      return
    }

    if (formData.deliveryMethods.length === 0) {
      alert('Please select at least one delivery method')
      return
    }

    if (formData.targetAudience === 'specific-operating-unit' && !formData.specificOperatingUnit) {
      alert('Please select a specific operating unit')
      return
    }

    if (formData.targetAudience === 'specific-raed' && !formData.specificRAED) {
      alert('Please select a specific RAED region')
      return
    }

    if (formData.isScheduled && (!formData.scheduledDate || !formData.scheduledTime)) {
      alert('Please provide both date and time for scheduled announcement')
      return
    }

    const now = new Date().toISOString()
    const announcement: Announcement = {
      id: editingAnnouncement?.id || `announcement-${Date.now()}`,
      title: formData.title,
      message: formData.message,
      deliveryMethods: formData.deliveryMethods,
      targetAudience: formData.targetAudience,
      specificOperatingUnit: formData.specificOperatingUnit || undefined,
      specificRAED: formData.specificRAED || undefined,
      scheduledDate: formData.isScheduled ? formData.scheduledDate : undefined,
      scheduledTime: formData.isScheduled ? formData.scheduledTime : undefined,
      isScheduled: formData.isScheduled,
      frequency: formData.frequency,
      isActive: formData.isActive,
      createdAt: editingAnnouncement?.createdAt || now,
      updatedAt: now,
      createdBy: user.id,
    }

    let updatedAnnouncements: Announcement[]
    if (editingAnnouncement) {
      // When editing, update the existing announcement but keep it in its current position
      updatedAnnouncements = announcements.map(a =>
        a.id === announcement.id ? announcement : a
      )
    } else {
      // When creating new, add it at the top of the list
      updatedAnnouncements = [announcement, ...announcements]
    }

    saveAnnouncements(updatedAnnouncements)
    handleCloseModal()
    
    // Highlight the newly created/updated announcement
    const savedAnnouncementId = announcement.id
    setHighlightedAnnouncementId(savedAnnouncementId)
    
    // Scroll to the highlighted announcement
    setTimeout(() => {
      const element = document.getElementById(`announcement-${savedAnnouncementId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedAnnouncementId(null)
      }, 3000)
    }, 100)
  }

  const handleDeleteClick = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (announcementToDelete) {
      const updatedAnnouncements = announcements.filter(a => a.id !== announcementToDelete.id)
      saveAnnouncements(updatedAnnouncements)
      setIsDeleteDialogOpen(false)
      setAnnouncementToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
    setAnnouncementToDelete(null)
  }

  const handleToggleActive = (id: string) => {
    const updatedAnnouncements = announcements.map(a =>
      a.id === id ? { ...a, isActive: !a.isActive, updatedAt: new Date().toISOString() } : a
    )
    saveAnnouncements(updatedAnnouncements)
  }

  const handleViewAnnouncement = (announcement: Announcement) => {
    setPreviewingAnnouncement(announcement)
    // Set default preview mode to first available delivery method
    if (announcement.deliveryMethods.length > 0) {
      setPreviewMode(announcement.deliveryMethods[0] as 'sms' | 'email' | 'in-app')
    }
    setIsPreviewModalOpen(true)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString?: string, timeString?: string) => {
    if (!dateString || !timeString) return 'N/A'
    const date = new Date(`${dateString}T${timeString}`)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTargetAudienceLabel = (audience: TargetAudience) => {
    switch (audience) {
      case 'all-operating-units':
        return 'All Operating Units'
      case 'specific-operating-unit':
        return 'Specific Operating Unit'
      case 'all-raed':
        return 'All RAED'
      case 'specific-raed':
        return 'Specific RAED'
      case 'evaluator':
        return 'Evaluator'
      default:
        return audience
    }
  }

  const getDeliveryMethodIcon = (method: DeliveryMethod) => {
    switch (method) {
      case 'sms':
        return MessageSquare
      case 'email':
        return Mail
      case 'in-app':
        return Bell
      default:
        return Bell
    }
  }

  const getFrequencyLabel = (frequency: Frequency) => {
    switch (frequency) {
      case 'none':
        return 'One-time'
      case 'daily':
        return 'Daily'
      case 'weekly':
        return 'Weekly'
      case 'monthly':
        return 'Monthly'
      case 'quarterly':
        return 'Quarterly'
      case 'annually':
        return 'Annually'
      default:
        return frequency
    }
  }

  // Operating Unit handlers
  const handleOpenOperatingUnitModal = (operatingUnit?: OperatingUnit) => {
    if (operatingUnit) {
      setEditingOperatingUnit(operatingUnit)
      setOperatingUnitFormData({
        name: operatingUnit.name,
        responsibility: operatingUnit.responsibility,
        scope: operatingUnit.scope,
        roles: operatingUnit.roles || [],
        permissions: operatingUnit.permissions || [],
      })
    } else {
      setEditingOperatingUnit(null)
      setOperatingUnitFormData({
        name: '',
        responsibility: '',
        scope: '',
        roles: [],
        permissions: [],
      })
    }
    setIsOperatingUnitModalOpen(true)
  }

  const handleCloseOperatingUnitModal = () => {
    setIsOperatingUnitModalOpen(false)
    setEditingOperatingUnit(null)
    setOperatingUnitFormData({
      name: '',
      responsibility: '',
      scope: '',
      roles: [],
      permissions: [],
    })
  }

  const handleRoleToggle = (role: Role) => {
    setOperatingUnitFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }))
  }

  const handlePermissionToggle = (permission: string) => {
    setOperatingUnitFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const handleSubmitOperatingUnit = () => {
    if (!operatingUnitFormData.name.trim() || !operatingUnitFormData.responsibility.trim() || !operatingUnitFormData.scope.trim()) {
      alert('Please fill in all required fields')
      return
    }

    const now = new Date().toISOString()
    const operatingUnit: OperatingUnit = {
      id: editingOperatingUnit?.id || `ou-${Date.now()}`,
      name: operatingUnitFormData.name.trim(),
      responsibility: operatingUnitFormData.responsibility.trim(),
      scope: operatingUnitFormData.scope.trim(),
      roles: operatingUnitFormData.roles.length > 0 ? operatingUnitFormData.roles : undefined,
      permissions: operatingUnitFormData.permissions.length > 0 ? operatingUnitFormData.permissions : undefined,
      createdAt: editingOperatingUnit?.createdAt || now,
      updatedAt: now,
      createdBy: user.id,
    }

    let updatedOperatingUnits: OperatingUnit[]
    if (editingOperatingUnit) {
      updatedOperatingUnits = operatingUnits.map(ou =>
        ou.id === operatingUnit.id ? operatingUnit : ou
      )
    } else {
      updatedOperatingUnits = [...operatingUnits, operatingUnit]
    }

    saveOperatingUnits(updatedOperatingUnits)
    handleCloseOperatingUnitModal()
  }

  const handleDeleteOperatingUnitClick = (operatingUnit: OperatingUnit) => {
    setOperatingUnitToDelete(operatingUnit)
    setIsOperatingUnitDeleteDialogOpen(true)
  }

  const handleDeleteOperatingUnitConfirm = () => {
    if (operatingUnitToDelete) {
      const updatedOperatingUnits = operatingUnits.filter(ou => ou.id !== operatingUnitToDelete.id)
      saveOperatingUnits(updatedOperatingUnits)
      setIsOperatingUnitDeleteDialogOpen(false)
      setOperatingUnitToDelete(null)
    }
  }

  // Get operating unit names for dropdowns
  const getOperatingUnitNames = (): string[] => {
    return operatingUnits.map(ou => ou.name)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">
          Manage system-wide settings, announcements, and operating units
        </p>
      </div>

      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="h-4 w-4" />
            System Announcements
          </TabsTrigger>
          <TabsTrigger value="operating-units" className="gap-2">
            <Settings className="h-4 w-4" />
            Operating Units
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="gap-2">
            <FileText className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* System Announcements Tab */}
        <TabsContent value="announcements" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">System Announcements</h2>
              <p className="text-muted-foreground">
                Create and manage system announcements. Send via SMS, Email, or In-app notifications.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleOpenModal()} className="gap-2">
                <Plus className="h-4 w-4" />
                New Announcement
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-blue-600" />
                <CardTitle>Announcements</CardTitle>
              </div>
              <CardDescription>
                Manage all system announcements and their delivery methods
              </CardDescription>
            </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No announcements yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first announcement to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Delivery Methods</TableHead>
                    <TableHead>Target Audience</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow 
                      key={announcement.id}
                      id={`announcement-${announcement.id}`}
                      className={highlightedAnnouncementId === announcement.id ? 'bg-green-50 border-green-300 ring-2 ring-green-500 ring-offset-2 transition-all duration-500' : ''}
                    >
                      <TableCell className="font-medium">{announcement.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {announcement.message}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {announcement.deliveryMethods.map((method) => {
                            const Icon = getDeliveryMethodIcon(method)
                            return (
                              <Badge key={method} variant="secondary" className="gap-1">
                                <Icon className="h-3 w-3" />
                                {method.toUpperCase()}
                              </Badge>
                            )
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {announcement.specificOperatingUnit 
                            ? `${announcement.specificOperatingUnit}`
                            : announcement.specificRAED
                            ? `${announcement.specificRAED}`
                            : getTargetAudienceLabel(announcement.targetAudience)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getFrequencyLabel(announcement.frequency || 'none')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {announcement.isScheduled ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(announcement.scheduledDate, announcement.scheduledTime)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Immediate</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(announcement.id)}
                          className="gap-1"
                        >
                          {announcement.isActive ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-400">Inactive</span>
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(announcement.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAnnouncement(announcement)}
                            title="View announcement preview"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(announcement)}
                            title="Edit announcement"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(announcement)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete announcement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
          </Card>
        </TabsContent>

        {/* Operating Units Tab */}
        <TabsContent value="operating-units" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Operating Units</h2>
              <p className="text-muted-foreground">
                Manage operating units, their responsibilities, and scope of work
              </p>
            </div>
            <Button onClick={() => handleOpenOperatingUnitModal()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Operating Unit
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <CardTitle>Operating Units Management</CardTitle>
              </div>
              <CardDescription>
                Define and manage operating units with their responsibilities and scope
              </CardDescription>
            </CardHeader>
        <CardContent>
          {operatingUnits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No operating units yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first operating unit to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Responsibility</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operatingUnits.map((operatingUnit) => (
                    <TableRow key={operatingUnit.id}>
                      <TableCell className="font-medium">{operatingUnit.name}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {operatingUnit.responsibility}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {operatingUnit.scope}
                        </p>
                      </TableCell>
                      <TableCell>
                        {operatingUnit.roles && operatingUnit.roles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {operatingUnit.roles.map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs capitalize">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No roles</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {operatingUnit.permissions && operatingUnit.permissions.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {operatingUnit.permissions.slice(0, 3).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                            {operatingUnit.permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{operatingUnit.permissions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No permissions</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(operatingUnit.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(operatingUnit.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenOperatingUnitModal(operatingUnit)}
                            title="Edit operating unit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOperatingUnitClick(operatingUnit)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete operating unit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit-logs" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Audit Logs</h2>
              <p className="text-muted-foreground">
                Track all system actions and configure security policies
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Logs
              </Button>
            </div>
          </div>

          {/* Password Policy & Session Limits Configuration */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Password Policy Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle>Password Policy</CardTitle>
                      <CardDescription>
                        Configure password requirements and security settings
                      </CardDescription>
                    </div>
                  </div>
                  {!isEditingPasswordPolicy ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleModifyPasswordPolicy}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modify
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelPasswordPolicy}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSavePasswordPolicy}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min-length">Minimum Length</Label>
                  <Input
                    id="min-length"
                    type="number"
                    min="6"
                    max="32"
                    disabled={!isEditingPasswordPolicy}
                    value={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.minLength : passwordPolicy.minLength}
                    onChange={(e) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, minLength: parseInt(e.target.value) || 8 })}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Password Requirements</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="require-uppercase"
                        disabled={!isEditingPasswordPolicy}
                        checked={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.requireUppercase : passwordPolicy.requireUppercase}
                        onCheckedChange={(checked) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, requireUppercase: checked as boolean })}
                      />
                      <Label htmlFor="require-uppercase" className={`cursor-pointer font-normal ${!isEditingPasswordPolicy ? 'cursor-default' : ''}`}>
                        Require uppercase letters
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="require-lowercase"
                        disabled={!isEditingPasswordPolicy}
                        checked={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.requireLowercase : passwordPolicy.requireLowercase}
                        onCheckedChange={(checked) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, requireLowercase: checked as boolean })}
                      />
                      <Label htmlFor="require-lowercase" className={`cursor-pointer font-normal ${!isEditingPasswordPolicy ? 'cursor-default' : ''}`}>
                        Require lowercase letters
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="require-numbers"
                        disabled={!isEditingPasswordPolicy}
                        checked={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.requireNumbers : passwordPolicy.requireNumbers}
                        onCheckedChange={(checked) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, requireNumbers: checked as boolean })}
                      />
                      <Label htmlFor="require-numbers" className={`cursor-pointer font-normal ${!isEditingPasswordPolicy ? 'cursor-default' : ''}`}>
                        Require numbers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="require-special"
                        disabled={!isEditingPasswordPolicy}
                        checked={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.requireSpecialChars : passwordPolicy.requireSpecialChars}
                        onCheckedChange={(checked) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, requireSpecialChars: checked as boolean })}
                      />
                      <Label htmlFor="require-special" className={`cursor-pointer font-normal ${!isEditingPasswordPolicy ? 'cursor-default' : ''}`}>
                        Require special characters
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-age">Maximum Password Age (days)</Label>
                  <Input
                    id="max-age"
                    type="number"
                    min="0"
                    disabled={!isEditingPasswordPolicy}
                    value={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.maxAge : passwordPolicy.maxAge}
                    onChange={(e) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, maxAge: parseInt(e.target.value) || 90 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prevent-reuse">Prevent Reuse (number of previous passwords)</Label>
                  <Input
                    id="prevent-reuse"
                    type="number"
                    min="0"
                    disabled={!isEditingPasswordPolicy}
                    value={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.preventReuse : passwordPolicy.preventReuse}
                    onChange={(e) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, preventReuse: parseInt(e.target.value) || 5 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lockout-attempts">Account Lockout After Failed Attempts</Label>
                  <Input
                    id="lockout-attempts"
                    type="number"
                    min="1"
                    disabled={!isEditingPasswordPolicy}
                    value={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.lockoutAttempts : passwordPolicy.lockoutAttempts}
                    onChange={(e) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, lockoutAttempts: parseInt(e.target.value) || 5 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                  <Input
                    id="lockout-duration"
                    type="number"
                    min="1"
                    disabled={!isEditingPasswordPolicy}
                    value={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.lockoutDuration : passwordPolicy.lockoutDuration}
                    onChange={(e) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, lockoutDuration: parseInt(e.target.value) || 30 })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require-change-first"
                    disabled={!isEditingPasswordPolicy}
                    checked={isEditingPasswordPolicy && tempPasswordPolicy ? tempPasswordPolicy.requireChangeOnFirstLogin : passwordPolicy.requireChangeOnFirstLogin}
                    onCheckedChange={(checked) => tempPasswordPolicy && setTempPasswordPolicy({ ...tempPasswordPolicy, requireChangeOnFirstLogin: checked as boolean })}
                  />
                  <Label htmlFor="require-change-first" className={`cursor-pointer ${!isEditingPasswordPolicy ? 'cursor-default' : ''}`}>
                    Require password change on first login
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Session Policy Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle>Session Limits</CardTitle>
                      <CardDescription>
                        Configure session timeout and concurrent session limits
                      </CardDescription>
                    </div>
                  </div>
                  {!isEditingSessionPolicy ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleModifySessionPolicy}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modify
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelSessionPolicy}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveSessionPolicy}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min="5"
                    disabled={!isEditingSessionPolicy}
                    value={isEditingSessionPolicy && tempSessionPolicy ? tempSessionPolicy.sessionTimeout : sessionPolicy.sessionTimeout}
                    onChange={(e) => tempSessionPolicy && setTempSessionPolicy({ ...tempSessionPolicy, sessionTimeout: parseInt(e.target.value) || 480 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum time a session can remain active
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idle-timeout">Idle Timeout (minutes)</Label>
                  <Input
                    id="idle-timeout"
                    type="number"
                    min="1"
                    disabled={!isEditingSessionPolicy}
                    value={isEditingSessionPolicy && tempSessionPolicy ? tempSessionPolicy.idleTimeout : sessionPolicy.idleTimeout}
                    onChange={(e) => tempSessionPolicy && setTempSessionPolicy({ ...tempSessionPolicy, idleTimeout: parseInt(e.target.value) || 30 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time before inactive session expires
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-sessions">Maximum Concurrent Sessions</Label>
                  <Input
                    id="max-sessions"
                    type="number"
                    min="1"
                    disabled={!isEditingSessionPolicy}
                    value={isEditingSessionPolicy && tempSessionPolicy ? tempSessionPolicy.maxConcurrentSessions : sessionPolicy.maxConcurrentSessions}
                    onChange={(e) => tempSessionPolicy && setTempSessionPolicy({ ...tempSessionPolicy, maxConcurrentSessions: parseInt(e.target.value) || 3 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of simultaneous sessions per user
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remember-me">Remember Me Duration (days)</Label>
                  <Input
                    id="remember-me"
                    type="number"
                    min="1"
                    disabled={!isEditingSessionPolicy}
                    value={isEditingSessionPolicy && tempSessionPolicy ? tempSessionPolicy.rememberMeDuration : sessionPolicy.rememberMeDuration}
                    onChange={(e) => tempSessionPolicy && setTempSessionPolicy({ ...tempSessionPolicy, rememberMeDuration: parseInt(e.target.value) || 30 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Duration for "Remember Me" sessions
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require-reauth"
                    disabled={!isEditingSessionPolicy}
                    checked={isEditingSessionPolicy && tempSessionPolicy ? tempSessionPolicy.requireReauthForSensitiveActions : sessionPolicy.requireReauthForSensitiveActions}
                    onCheckedChange={(checked) => tempSessionPolicy && setTempSessionPolicy({ ...tempSessionPolicy, requireReauthForSensitiveActions: checked as boolean })}
                  />
                  <Label htmlFor="require-reauth" className={`cursor-pointer ${!isEditingSessionPolicy ? 'cursor-default' : ''}`}>
                    Require re-authentication for sensitive actions
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <CardTitle>System Actions Log</CardTitle>
              </div>
              <CardDescription>
                View and filter all system actions and user activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search actions, users, or details..."
                    value={auditLogsSearch}
                    onChange={(e) => setAuditLogsSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={auditLogsFilter} onValueChange={(value) => setAuditLogsFilter(value as typeof auditLogsFilter)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="user_management">User Management</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="system_config">System Config</SelectItem>
                    <SelectItem value="permission">Permission</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={auditLogsStatusFilter} onValueChange={(value) => setAuditLogsStatusFilter(value as typeof auditLogsStatusFilter)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtered Logs */}
              {(() => {
                const filteredLogs = auditLogs.filter(log => {
                  const matchesSearch = !auditLogsSearch || 
                    log.action.toLowerCase().includes(auditLogsSearch.toLowerCase()) ||
                    log.userName.toLowerCase().includes(auditLogsSearch.toLowerCase()) ||
                    log.userEmail.toLowerCase().includes(auditLogsSearch.toLowerCase()) ||
                    (log.details && log.details.toLowerCase().includes(auditLogsSearch.toLowerCase()))
                  const matchesCategory = auditLogsFilter === 'all' || log.category === auditLogsFilter
                  const matchesStatus = auditLogsStatusFilter === 'all' || log.status === auditLogsStatusFilter
                  return matchesSearch && matchesCategory && matchesStatus
                })

                return filteredLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">No audit logs found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {auditLogsSearch || auditLogsFilter !== 'all' || auditLogsStatusFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'System actions will appear here'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {log.category.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{log.userName}</p>
                                <p className="text-xs text-muted-foreground">{log.userEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize">
                                {log.userRole}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {log.status === 'success' && (
                                <Badge variant="default" className="bg-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Success
                                </Badge>
                              )}
                              {log.status === 'failure' && (
                                <Badge variant="destructive">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Failure
                                </Badge>
                              )}
                              {log.status === 'warning' && (
                                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Warning
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {log.ipAddress || 'N/A'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                              {log.details || log.resourceType ? (
                                <span title={log.details || `${log.resourceType}: ${log.resourceId}`}>
                                  {log.details || `${log.resourceType}: ${log.resourceId}`}
                                </span>
                              ) : (
                                '—'
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Operating Unit Modal */}
      <Dialog open={isOperatingUnitModalOpen} onOpenChange={setIsOperatingUnitModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOperatingUnit ? 'Edit Operating Unit' : 'Create New Operating Unit'}
            </DialogTitle>
            <DialogDescription>
              Define the operating unit's name, responsibility, and scope of work
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="ou-name">Operating Unit Name *</Label>
              <Input
                id="ou-name"
                placeholder="e.g., EPDSD, PPMD, SEPD, RAED"
                value={operatingUnitFormData.name}
                onChange={(e) => setOperatingUnitFormData({ ...operatingUnitFormData, name: e.target.value })}
              />
            </div>

            {/* Responsibility */}
            <div className="space-y-2">
              <Label htmlFor="ou-responsibility">Responsibility *</Label>
              <Textarea
                id="ou-responsibility"
                placeholder="Describe the main responsibilities of this operating unit..."
                value={operatingUnitFormData.responsibility}
                onChange={(e) => setOperatingUnitFormData({ ...operatingUnitFormData, responsibility: e.target.value })}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Explain what this operating unit is responsible for
              </p>
            </div>

            {/* Scope */}
            <div className="space-y-2">
              <Label htmlFor="ou-scope">Scope *</Label>
              <Textarea
                id="ou-scope"
                placeholder="Describe the scope of work and coverage of this operating unit..."
                value={operatingUnitFormData.scope}
                onChange={(e) => setOperatingUnitFormData({ ...operatingUnitFormData, scope: e.target.value })}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Define the scope of work, coverage, and areas of operation
              </p>
            </div>

            {/* Roles */}
            <div className="space-y-3">
              <Label>Roles</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select the roles associated with this operating unit
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {AVAILABLE_ROLES.map((role) => (
                  <div
                    key={role}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRoleToggle(role)}
                  >
                    <Checkbox
                      checked={operatingUnitFormData.roles.includes(role)}
                      onCheckedChange={() => handleRoleToggle(role)}
                    />
                    <Label className="text-sm font-normal cursor-pointer capitalize">
                      {role}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <Label>Permissions</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select the permissions granted to this operating unit
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => handlePermissionToggle(permission)}
                  >
                    <Checkbox
                      checked={operatingUnitFormData.permissions.includes(permission)}
                      onCheckedChange={() => handlePermissionToggle(permission)}
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseOperatingUnitModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmitOperatingUnit} className="gap-2">
              <Send className="h-4 w-4" />
              {editingOperatingUnit ? 'Update Operating Unit' : 'Create Operating Unit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Operating Unit Confirmation Dialog */}
      <Dialog open={isOperatingUnitDeleteDialogOpen} onOpenChange={setIsOperatingUnitDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Operating Unit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this operating unit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {operatingUnitToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="font-medium text-sm text-gray-500 mb-1">Operating Unit</p>
                <p className="text-base font-semibold">{operatingUnitToDelete.name}</p>
                <p className="text-sm text-gray-600 mt-2">{operatingUnitToDelete.responsibility}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOperatingUnitDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteOperatingUnitConfirm}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Announcement Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </DialogTitle>
            <DialogDescription>
              Configure your announcement details, delivery methods, and target audience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter announcement title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Enter announcement message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Delivery Methods */}
            <div className="space-y-3">
              <Label>Delivery Methods *</Label>
              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.deliveryMethods.includes('sms')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDeliveryMethodToggle('sms')}
                >
                  <Checkbox
                    checked={formData.deliveryMethods.includes('sms')}
                    onCheckedChange={() => handleDeliveryMethodToggle('sms')}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">SMS</div>
                      <div className="text-xs text-muted-foreground">Mobile Text</div>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.deliveryMethods.includes('email')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDeliveryMethodToggle('email')}
                >
                  <Checkbox
                    checked={formData.deliveryMethods.includes('email')}
                    onCheckedChange={() => handleDeliveryMethodToggle('email')}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-xs text-muted-foreground">Email Notification</div>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.deliveryMethods.includes('in-app')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDeliveryMethodToggle('in-app')}
                >
                  <Checkbox
                    checked={formData.deliveryMethods.includes('in-app')}
                    onCheckedChange={() => handleDeliveryMethodToggle('in-app')}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">In-App</div>
                      <div className="text-xs text-muted-foreground">App Notification</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-3">
              <Label>Target Audience *</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => setFormData({ ...formData, targetAudience: value as TargetAudience })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-operating-units">All Operating Units</SelectItem>
                  <SelectItem value="specific-operating-unit">Specific Operating Unit</SelectItem>
                  <SelectItem value="all-raed">All RAED</SelectItem>
                  <SelectItem value="specific-raed">Specific RAED</SelectItem>
                  <SelectItem value="evaluator">Evaluator</SelectItem>
                </SelectContent>
              </Select>

              {formData.targetAudience === 'specific-operating-unit' && (
                <Select
                  value={formData.specificOperatingUnit}
                  onValueChange={(value) => setFormData({ ...formData, specificOperatingUnit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operating unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperatingUnitNames().map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {formData.targetAudience === 'specific-raed' && (
                <Select
                  value={formData.specificRAED}
                  onValueChange={(value) => setFormData({ ...formData, specificRAED: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select RAED region" />
                  </SelectTrigger>
                  <SelectContent>
                    {RAED_REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Frequency */}
            <div className="space-y-3">
              <Label>Frequency *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value as Frequency })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">One-time (Send once)</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select how often this announcement should be sent. For recurring announcements, the first send will be based on the scheduled date/time.
              </p>
            </div>

            {/* Scheduling */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isScheduled"
                  checked={formData.isScheduled}
                  onCheckedChange={(checked) => setFormData({ ...formData, isScheduled: checked as boolean })}
                />
                <Label htmlFor="isScheduled" className="cursor-pointer">
                  Schedule this announcement
                </Label>
              </div>

              {formData.isScheduled && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Date *</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Time *</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Activate this announcement immediately
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Announcement Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Announcement Preview</DialogTitle>
            <DialogDescription>
              Preview how this announcement will appear to recipients
            </DialogDescription>
          </DialogHeader>
          
          {previewingAnnouncement && (
            <div className="space-y-6 py-4">
              {/* Delivery Method Selector */}
              {previewingAnnouncement.deliveryMethods.length > 1 && (
                <div className="flex gap-2 border-b pb-4">
                  {previewingAnnouncement.deliveryMethods.map((method) => {
                    const Icon = getDeliveryMethodIcon(method)
                    return (
                      <Button
                        key={method}
                        variant={previewMode === method ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode(method as 'sms' | 'email' | 'in-app')}
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {method === 'sms' ? 'SMS' : method === 'email' ? 'Email' : 'In-App'}
                      </Button>
                    )
                  })}
                </div>
              )}

              {/* SMS Preview */}
              {previewMode === 'sms' && previewingAnnouncement.deliveryMethods.includes('sms') && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">SMS Preview</h3>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
                    <div className="bg-white rounded-xl shadow-md p-4 max-w-sm mx-auto">
                      {/* Phone Header */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">AB</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">ABEMIS System</p>
                            <p className="text-xs text-gray-500">+63 900 000 0000</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">Now</div>
                      </div>
                      
                      {/* Message Bubble */}
                      <div className="space-y-2">
                        <div className="bg-blue-600 text-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                          <p className="text-sm font-semibold mb-1">{previewingAnnouncement.title}</p>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {previewingAnnouncement.message}
                          </p>
                        </div>
                        {previewingAnnouncement.isScheduled && (
                          <div className="text-xs text-gray-500 text-center mt-2">
                            Scheduled: {formatDateTime(previewingAnnouncement.scheduledDate, previewingAnnouncement.scheduledTime)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Preview */}
              {previewMode === 'email' && previewingAnnouncement.deliveryMethods.includes('email') && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Email Preview</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      {/* Email Header */}
                      <div className="border-b border-gray-200 p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">From: ABEMIS System &lt;noreply@abemis.gov.ph&gt;</p>
                            <p className="text-xs text-gray-600 mt-1">
                              To: {previewingAnnouncement.specificOperatingUnit 
                                ? `${previewingAnnouncement.specificOperatingUnit} Users`
                                : previewingAnnouncement.specificRAED
                                ? `${previewingAnnouncement.specificRAED} Users`
                                : getTargetAudienceLabel(previewingAnnouncement.targetAudience)}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {previewingAnnouncement.isScheduled 
                              ? formatDateTime(previewingAnnouncement.scheduledDate, previewingAnnouncement.scheduledTime)
                              : 'Now'}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="font-semibold text-base">{previewingAnnouncement.title}</p>
                        </div>
                      </div>
                      
                      {/* Email Body */}
                      <div className="p-6">
                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                            {previewingAnnouncement.message}
                          </p>
                          
                          {/* Email Footer */}
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">
                              This is an automated message from the ABEMIS System.
                            </p>
                            {previewingAnnouncement.frequency && previewingAnnouncement.frequency !== 'none' && (
                              <p className="text-xs text-gray-500">
                                Frequency: {getFrequencyLabel(previewingAnnouncement.frequency)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* In-App Notification Preview */}
              {previewMode === 'in-app' && previewingAnnouncement.deliveryMethods.includes('in-app') && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">In-App Notification Preview</h3>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200">
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
                      {/* Notification Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm text-gray-900">System Announcement</p>
                            <span className="text-xs text-gray-500">
                              {previewingAnnouncement.isScheduled 
                                ? formatDateTime(previewingAnnouncement.scheduledDate, previewingAnnouncement.scheduledTime)
                                : 'Just now'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {previewingAnnouncement.specificOperatingUnit 
                              ? `${previewingAnnouncement.specificOperatingUnit}`
                              : previewingAnnouncement.specificRAED
                              ? `${previewingAnnouncement.specificRAED}`
                              : getTargetAudienceLabel(previewingAnnouncement.targetAudience)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Notification Content */}
                      <div className="border-t border-gray-200 pt-3">
                        <h4 className="font-semibold text-base text-gray-900 mb-2">
                          {previewingAnnouncement.title}
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
                          {previewingAnnouncement.message}
                        </p>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {previewingAnnouncement.frequency && previewingAnnouncement.frequency !== 'none' && (
                            <Badge variant="secondary" className="text-xs">
                              {getFrequencyLabel(previewingAnnouncement.frequency)}
                            </Badge>
                          )}
                          {previewingAnnouncement.isActive ? (
                            <Badge variant="default" className="text-xs bg-green-600">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        
                        {/* Action Button */}
                        <Button className="w-full mt-2" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">Delivery Information</p>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p><strong>Target Audience:</strong> {previewingAnnouncement.specificOperatingUnit 
                        ? previewingAnnouncement.specificOperatingUnit
                        : previewingAnnouncement.specificRAED
                        ? previewingAnnouncement.specificRAED
                        : getTargetAudienceLabel(previewingAnnouncement.targetAudience)}</p>
                      <p><strong>Delivery Methods:</strong> {previewingAnnouncement.deliveryMethods.map(m => m.toUpperCase()).join(', ')}</p>
                      {previewingAnnouncement.frequency && previewingAnnouncement.frequency !== 'none' && (
                        <p><strong>Frequency:</strong> {getFrequencyLabel(previewingAnnouncement.frequency)}</p>
                      )}
                      {previewingAnnouncement.isScheduled && (
                        <p><strong>Scheduled:</strong> {formatDateTime(previewingAnnouncement.scheduledDate, previewingAnnouncement.scheduledTime)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {announcementToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="font-medium text-sm text-gray-500 mb-1">Title</p>
                <p className="text-base">{announcementToDelete.title}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
