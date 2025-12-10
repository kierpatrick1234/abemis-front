'use client'

import { useState, useEffect } from 'react'
import { NotificationItem } from './notification-item'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProjectDetailsModal } from './project-details-modal'
import { Bell, CheckCircle2 } from 'lucide-react'
import { mockProjects } from '@/lib/mock/data'
import { Project } from '@/lib/types'

interface Notification {
  id: string
  message: string
  type: 'approval' | 'remark' | 'monitoring' | 'update' | 'user_registration' | 'system' | 'maintenance' | 'compliance' | 'upload' | 'submission' | 'report' | 'milestone' | 'summary' | 'budget'
  timestamp: string
  isRead?: boolean
  projectId?: string
  projectName?: string
  highlightType?: 'approval' | 'remark' | 'monitoring' | 'update'
  evaluator?: string
  remarks?: string
  monitoringIssues?: string
}

interface NotificationDropdownProps {
  raedRegion: string
  userRole?: string
}

// Helper function to map region names (Region I -> Region 1, etc.)
function mapRegionName(region: string): string {
  const regionMap: Record<string, string> = {
    'Region I': 'Region 1',
    'Region II': 'Region 2',
    'Region III': 'Region 3',
    'Region IV-A': 'Region 4',
    'Region V': 'Region 5',
    'Region VI': 'Region 6',
    'Region VII': 'Region 7',
    'Region VIII': 'Region 8',
    'Region IX': 'Region 9',
    'Region X': 'Region 10',
    'Region XI': 'Region 11',
    'Region XII': 'Region 12',
    'Region XIII': 'Region 13',
  }
  return regionMap[region] || region
}

// Generate notifications from actual projects in the project pool
function generateNotificationsFromProjects(region: string, userRole?: string): Notification[] {
  const mappedRegion = mapRegionName(region)
  
  // Filter projects for this specific region
  const regionProjects = mockProjects.filter(p => 
    p.region === mappedRegion || p.region === region
  )
  
  if (regionProjects.length === 0) {
    return []
  }
  
  // Select 5-8 random projects for notifications
  const shuffledProjects = [...regionProjects].sort(() => Math.random() - 0.5)
  const selectedProjects = shuffledProjects.slice(0, Math.min(8, shuffledProjects.length))
  
  const notifications: Notification[] = []
  const evaluators = [
    'EPDSD - Mark Gomez',
    'EPDSD - Sarah Rodriguez',
    'SEPD - Maria Santos',
    'SEPD - Carlos Martinez',
    'PPMD - Juan Dela Cruz',
    'PPMD - Ana Garcia',
    'EPDSD - Roberto Lopez',
    'SEPD - Lisa Fernandez'
  ]
  
  const notificationTypes: Array<'approval' | 'remark' | 'monitoring' | 'update'> = [
    'approval', 'remark', 'monitoring', 'update'
  ]
  
  const timestamps = [
    '30 minutes ago',
    '1 hour ago',
    '2 hours ago',
    '3 hours ago',
    '4 hours ago',
    '5 hours ago',
    '6 hours ago',
    '1 day ago',
    '2 days ago',
    '3 days ago'
  ]
  
  selectedProjects.forEach((project, index) => {
    const notificationType = notificationTypes[index % notificationTypes.length]
    const evaluator = evaluators[index % evaluators.length]
    const timestamp = timestamps[index % timestamps.length]
    
    let message = ''
    let remarks = ''
    let monitoringIssues = ''
    
    switch (notificationType) {
      case 'approval':
        message = `${evaluator.split(' - ')[0]} has approved your Proposal`
        remarks = 'Project approved. All requirements met. Proceed to procurement stage.'
        break
      case 'remark':
        message = `${evaluator.split(' - ')[0]} has put some remarks to your proposal`
        remarks = 'Please provide additional documentation for review. Budget allocation needs clarification.'
        break
      case 'monitoring':
        message = `${evaluator.split(' - ')[0]} monitors your project with current issues`
        monitoringIssues = 'Construction progress is behind schedule. Site inspection revealed material quality concerns. Please address immediately.'
        break
      case 'update':
        message = `${evaluator.split(' - ')[0]} has updated the status of your project`
        remarks = 'Status updated. Project moving to next phase.'
        break
    }
    
    notifications.push({
      id: `notif-${region}-${project.id}-${index}`,
      message,
      type: notificationType,
      timestamp,
      projectId: project.id,
      projectName: project.title,
      highlightType: notificationType,
      evaluator,
      remarks: notificationType !== 'monitoring' ? remarks : undefined,
      monitoringIssues: notificationType === 'monitoring' ? monitoringIssues : undefined
    })
  })
  
  return notifications
}

// Notification templates for different RAED regions - will be generated dynamically
const notificationTemplates: Record<string, Notification[]> = {}

// EPDSD-specific notifications
const epdsdNotifications: Notification[] = [
  {
    id: 'epdsd-1',
    message: 'RAED 7 - complied the Letter of Intent',
    type: 'compliance' as const,
    timestamp: '2 hours ago'
  },
  {
    id: 'epdsd-2',
    message: 'RAED 5 - Submitted a new document',
    type: 'submission' as const,
    timestamp: '4 hours ago'
  },
  {
    id: 'epdsd-3',
    message: 'RAED 2 - Uploaded a new document',
    type: 'upload' as const,
    timestamp: '1 day ago'
  },
  {
    id: 'epdsd-4',
    message: 'RAED 3 - complied the Letter of Intent',
    type: 'compliance' as const,
    timestamp: '2 days ago'
  },
  {
    id: 'epdsd-5',
    message: 'RAED 1 - Submitted a new document',
    type: 'submission' as const,
    timestamp: '3 hours ago'
  },
  {
    id: 'epdsd-6',
    message: 'RAED 6 - Uploaded a new document',
    type: 'upload' as const,
    timestamp: '5 hours ago'
  },
  {
    id: 'epdsd-7',
    message: 'RAED 4 - complied the Letter of Intent',
    type: 'compliance' as const,
    timestamp: '2 days ago'
  },
  {
    id: 'epdsd-8',
    message: 'RAED 8 - Submitted a new document',
    type: 'submission' as const,
    timestamp: '3 days ago'
  }
]

// System Admin notifications
const adminNotifications = [
  {
    id: 'admin-1',
    message: 'A new user has been registered',
    type: 'user_registration' as const,
    timestamp: '3 mins ago'
  },
  {
    id: 'admin-2',
    message: 'System backup completed successfully',
    type: 'system' as const,
    timestamp: '1 hour ago'
  },
  {
    id: 'admin-3',
    message: 'Database maintenance scheduled for tonight',
    type: 'maintenance' as const,
    timestamp: '2 hours ago'
  }
]

// VIEWER-specific notifications (National Summary & Reports)
const viewerNotifications = [
  {
    id: 'viewer-1',
    message: 'National project summary updated: 245 projects across all regions',
    type: 'summary' as const,
    timestamp: '15 mins ago'
  },
  {
    id: 'viewer-2',
    message: 'Region 3 achieved 75% completion rate - Top performing region this month',
    type: 'milestone' as const,
    timestamp: '1 hour ago'
  },
  {
    id: 'viewer-3',
    message: 'Budget utilization report: 68.5% of national budget utilized',
    type: 'budget' as const,
    timestamp: '2 hours ago'
  },
  {
    id: 'viewer-4',
    message: 'Q4 2025 summary report available for review',
    type: 'report' as const,
    timestamp: '3 hours ago'
  },
  {
    id: 'viewer-5',
    message: '15 new projects added across 5 regions this week',
    type: 'update' as const,
    timestamp: '5 hours ago'
  },
  {
    id: 'viewer-6',
    message: 'Infrastructure projects: 45 completed nationwide this month',
    type: 'milestone' as const,
    timestamp: '1 day ago'
  },
  {
    id: 'viewer-7',
    message: 'Regional performance comparison report generated',
    type: 'report' as const,
    timestamp: '1 day ago'
  },
  {
    id: 'viewer-8',
    message: 'Budget allocation: Infrastructure leads with 42% of total budget',
    type: 'budget' as const,
    timestamp: '2 days ago'
  },
  {
    id: 'viewer-9',
    message: 'Year-end 2024 summary: 198 projects completed nationwide',
    type: 'summary' as const,
    timestamp: '3 days ago'
  },
  {
    id: 'viewer-10',
    message: 'Region 7 and Region 11 reached 100% completion milestone',
    type: 'milestone' as const,
    timestamp: '4 days ago'
  }
]

// Default notifications for regions not specified (fallback only)
const defaultNotifications: Notification[] = []

export function NotificationDropdown({ raedRegion, userRole }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [notificationHighlight, setNotificationHighlight] = useState<{
    projectId: string
    highlightType: string
    evaluator?: string
    remarks?: string
    monitoringIssues?: string
    projectName?: string
  } | null>(null)

  useEffect(() => {
    let selectedNotifications = []
    
    // Show admin notifications for superadmin users
    if (userRole === 'superadmin' || userRole === 'admin') {
      selectedNotifications = adminNotifications
    } else if (userRole === 'VIEWER') {
      // Show VIEWER-specific national summary notifications
      selectedNotifications = viewerNotifications
    } else if (userRole === 'EPDSD') {
      // Show EPDSD-specific RAED format notifications
      selectedNotifications = epdsdNotifications
    } else {
      // Generate notifications from actual projects in the region's project pool
      const regionNotifications = generateNotificationsFromProjects(raedRegion, userRole)
      
      if (regionNotifications.length > 0) {
        // Shuffle notifications to make them random for each RAED account
        const shuffledNotifications = [...regionNotifications].sort(() => Math.random() - 0.5)
        
        // Take only 5-7 random notifications
        selectedNotifications = shuffledNotifications.slice(0, Math.min(7, shuffledNotifications.length))
      } else {
        // Fallback to default notifications if no projects found
        selectedNotifications = defaultNotifications
      }
    }
    
    // Randomly assign read/unread status (2-4 unread notifications)
    const unreadCount = Math.floor(Math.random() * 3) + 2 // 2-4 unread
    const initialNotifications = selectedNotifications.map((notification, index) => ({
      ...notification,
      isRead: index >= unreadCount
    }))
    
    setNotifications(initialNotifications)
    setUnreadCount(unreadCount)
  }, [raedRegion, userRole])

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id 
          ? { ...n, isRead: true }
          : n
      )
    )
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1))

    // For RAED accounts, open modal with project details if projectId exists
    if ((userRole === 'RAED' || !userRole || userRole === 'engineer') && notification.projectId && notification.projectName) {
      // Try to find the project by ID first
      let project = mockProjects.find(p => p.id === notification.projectId)
      
      // If not found by ID, try to find by project name
      if (!project) {
        project = mockProjects.find(p => 
          p.title.toLowerCase().includes(notification.projectName!.toLowerCase()) ||
          notification.projectName!.toLowerCase().includes(p.title.toLowerCase())
        )
      }
      
      // If still not found, create a mock project for display
      if (!project && notification.projectName) {
        project = {
          id: notification.projectId,
          title: notification.projectName,
          type: 'Infrastructure' as const,
          province: raedRegion.includes('Region') ? raedRegion.split(' ')[1] || 'Unknown' : raedRegion,
          region: raedRegion,
          status: 'Proposal' as const,
          description: `${notification.projectName} project in ${raedRegion}`,
          budget: 5000000,
          startDate: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString(),
          assignedTo: `RAED ${raedRegion}`
        }
      }
      
      if (project) {
        // Store notification highlight data
        if (notification.highlightType) {
          setNotificationHighlight({
            projectId: notification.projectId,
            highlightType: notification.highlightType,
            evaluator: notification.evaluator,
            remarks: notification.remarks,
            monitoringIssues: notification.monitoringIssues,
            projectName: notification.projectName
          })
          
          // Store in sessionStorage for the modal to access
          sessionStorage.setItem('notificationHighlight', JSON.stringify({
            projectId: notification.projectId,
            highlightType: notification.highlightType,
            evaluator: notification.evaluator,
            remarks: notification.remarks,
            monitoringIssues: notification.monitoringIssues,
            projectName: notification.projectName
          }))
        }
        
        setSelectedProject(project)
        setShowProjectModal(true)
      }
    }
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
    setUnreadCount(0)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-6 px-2"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {userRole === 'VIEWER' ? 'National summary updates' : `${raedRegion} region updates`}
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="border-b border-border last:border-b-0">
                <NotificationItem
                  id={notification.id}
                  message={notification.projectName ? `${notification.message} "${notification.projectName}"` : notification.message}
                  timestamp={notification.timestamp}
                  type={notification.type}
                  isRead={notification.isRead || false}
                  onClick={() => handleNotificationClick(notification)}
                />
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Project Details Modal */}
    {selectedProject && (
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false)
          setSelectedProject(null)
          setNotificationHighlight(null)
          sessionStorage.removeItem('notificationHighlight')
        }}
      />
    )}
    </>
  )
}
