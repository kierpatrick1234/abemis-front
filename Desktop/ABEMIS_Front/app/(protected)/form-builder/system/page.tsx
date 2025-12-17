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
            <Shield className="h-4 w-4" />
            Roles and Permission
          </TabsTrigger>
          <TabsTrigger value="user-access-policy" className="gap-2">
            <Shield className="h-4 w-4" />
            User Access and Policy
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

        {/* Roles and Permission Tab */}
        <TabsContent value="operating-units" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Roles and Permission</h2>
              <p className="text-muted-foreground mt-1">
                Manage roles, permissions, and access controls for your organization
              </p>
            </div>
            <Button onClick={() => handleOpenOperatingUnitModal()} className="gap-2" size="lg">
              <Plus className="h-5 w-5" />
              Create New Role
            </Button>
          </div>

          {operatingUnits.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-blue-100 p-4 mb-4">
                  <Shield className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No roles configured</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Get started by creating your first role with custom permissions and access controls
                </p>
                <Button onClick={() => handleOpenOperatingUnitModal()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Role
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {operatingUnits.map((operatingUnit) => (
                <Card key={operatingUnit.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-sm">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold mb-1">{operatingUnit.name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2 mt-1">
                            {operatingUnit.responsibility}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenOperatingUnitModal(operatingUnit)}
                          className="h-8 w-8 p-0"
                          title="Edit role"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOperatingUnitClick(operatingUnit)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Scope */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">Scope</p>
                      <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                        {operatingUnit.scope}
                      </p>
                    </div>

                    {/* Roles */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Associated Roles</p>
                      {operatingUnit.roles && operatingUnit.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {operatingUnit.roles.slice(0, 4).map((role) => (
                            <Badge 
                              key={role} 
                              variant="secondary" 
                              className="text-xs font-medium px-2 py-0.5 capitalize bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {role}
                            </Badge>
                          ))}
                          {operatingUnit.roles.length > 4 && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              +{operatingUnit.roles.length - 4} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No roles assigned</p>
                      )}
                    </div>

                    {/* Permissions */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Permissions ({operatingUnit.permissions?.length || 0})
                      </p>
                      {operatingUnit.permissions && operatingUnit.permissions.length > 0 ? (
                        <div className="space-y-1.5">
                          {operatingUnit.permissions.slice(0, 3).map((permission) => (
                            <div key={permission} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                              <span className="text-xs text-gray-700 truncate">{permission}</span>
                            </div>
                          ))}
                          {operatingUnit.permissions.length > 3 && (
                            <p className="text-xs text-muted-foreground font-medium pt-1">
                              +{operatingUnit.permissions.length - 3} more permissions
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No permissions assigned</p>
                      )}
                    </div>

                    {/* Footer Info */}
                    <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {formatDate(operatingUnit.updatedAt)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* User Access and Policy Tab */}
        <TabsContent value="user-access-policy" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">User Access and Policy</h2>
              <p className="text-muted-foreground">
                Configure security policies and access controls
              </p>
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
        </TabsContent>
      </Tabs>

      {/* Create/Edit Role Modal */}
      <Dialog open={isOperatingUnitModalOpen} onOpenChange={setIsOperatingUnitModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  {editingOperatingUnit ? 'Edit Role' : 'Create New Role'}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Configure role details, assign permissions, and define access controls
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Settings className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-base">Basic Information</h3>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ou-name" className="text-sm font-semibold">Role Name *</Label>
                  <Input
                    id="ou-name"
                    placeholder="e.g., Project Manager, System Administrator, Data Analyst"
                    value={operatingUnitFormData.name}
                    onChange={(e) => setOperatingUnitFormData({ ...operatingUnitFormData, name: e.target.value })}
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a clear, descriptive name for this role
                  </p>
                </div>

                {/* Responsibility */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ou-responsibility" className="text-sm font-semibold">Responsibility *</Label>
                  <Textarea
                    id="ou-responsibility"
                    placeholder="Describe the main responsibilities and duties of this role..."
                    value={operatingUnitFormData.responsibility}
                    onChange={(e) => setOperatingUnitFormData({ ...operatingUnitFormData, responsibility: e.target.value })}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Explain what this role is responsible for within the organization
                  </p>
                </div>

                {/* Scope */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ou-scope" className="text-sm font-semibold">Scope *</Label>
                  <Textarea
                    id="ou-scope"
                    placeholder="Define the scope of work, coverage areas, and operational boundaries..."
                    value={operatingUnitFormData.scope}
                    onChange={(e) => setOperatingUnitFormData({ ...operatingUnitFormData, scope: e.target.value })}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Specify the scope of work, coverage, and areas of operation
                  </p>
                </div>
              </div>
            </div>

            {/* Roles Assignment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-base">Role Assignment</h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {operatingUnitFormData.roles.length} selected
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                Select the system roles that will be associated with this permission set
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-56 overflow-y-auto border rounded-lg p-4 bg-gray-50/50">
                {AVAILABLE_ROLES.map((role) => {
                  const isSelected = operatingUnitFormData.roles.includes(role)
                  return (
                    <div
                      key={role}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleRoleToggle(role)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleRoleToggle(role)}
                      />
                      <Label className="text-sm font-medium cursor-pointer capitalize flex-1">
                        {role}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Permissions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Lock className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-base">Permissions</h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {operatingUnitFormData.permissions.length} selected
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                Grant specific permissions to control what actions this role can perform
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto border rounded-lg p-4 bg-gray-50/50">
                {AVAILABLE_PERMISSIONS.map((permission) => {
                  const isSelected = operatingUnitFormData.permissions.includes(permission)
                  return (
                    <div
                      key={permission}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-green-50 border-green-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handlePermissionToggle(permission)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handlePermissionToggle(permission)}
                      />
                      <Label className="text-sm font-medium cursor-pointer flex-1">
                        {permission}
                      </Label>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 gap-2">
            <Button variant="outline" onClick={handleCloseOperatingUnitModal} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSubmitOperatingUnit} className="gap-2" size="lg">
              <Save className="h-4 w-4" />
              {editingOperatingUnit ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation Dialog */}
      <Dialog open={isOperatingUnitDeleteDialogOpen} onOpenChange={setIsOperatingUnitDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle className="text-xl">Delete Role</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              This action cannot be undone. The role and all its associated permissions will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          {operatingUnitToDelete && (
            <div className="py-4">
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2 flex-shrink-0">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base mb-1">{operatingUnitToDelete.name}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{operatingUnitToDelete.responsibility}</p>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-red-200">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Roles: </span>
                          <span className="font-medium">{operatingUnitToDelete.roles?.length || 0}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Permissions: </span>
                          <span className="font-medium">{operatingUnitToDelete.permissions?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOperatingUnitDeleteDialogOpen(false)} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteOperatingUnitConfirm}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Role
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
