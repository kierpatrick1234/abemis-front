'use client'

import { useState, useEffect } from 'react'
import { NotificationItem } from './notification-item'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'

interface Notification {
  id: string
  message: string
  type: 'approval' | 'remark' | 'monitoring' | 'update' | 'user_registration' | 'system' | 'maintenance' | 'compliance' | 'upload' | 'submission' | 'report' | 'milestone' | 'summary' | 'budget'
  timestamp: string
  isRead?: boolean
}

interface NotificationTemplateProps {
  raedRegion: string
  userRole?: string
}

// Notification templates for different RAED regions
const notificationTemplates = {
  'Region I': [
    {
      id: '1',
      message: 'EPDSD has approved your Proposal "Ilocos Norte Road Development"',
      type: 'approval' as const,
      timestamp: '2 hours ago'
    },
    {
      id: '2', 
      message: 'SEPD has put some remarks to your proposal "Vigan Heritage Bridge"',
      type: 'remark' as const,
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      message: 'PPMD monitors your "La Union Irrigation System" with current issues',
      type: 'monitoring' as const,
      timestamp: '1 day ago'
    },
    {
      id: '4',
      message: 'EPDSD has updated the status of "Pangasinan Market Road"',
      type: 'update' as const,
      timestamp: '2 days ago'
    }
  ],
  'Region II': [
    {
      id: '1',
      message: 'SEPD has approved your Proposal "Cagayan Valley Highway"',
      type: 'approval' as const,
      timestamp: '1 hour ago'
    },
    {
      id: '2',
      message: 'PPMD has put some remarks to your proposal "Isabela Farm Road"',
      type: 'remark' as const,
      timestamp: '3 hours ago'
    },
    {
      id: '3',
      message: 'EPDSD monitors your "Nueva Vizcaya Bridge" with current issues',
      type: 'monitoring' as const,
      timestamp: '6 hours ago'
    },
    {
      id: '4',
      message: 'SEPD has updated the status of "Quirino Access Road"',
      type: 'update' as const,
      timestamp: '1 day ago'
    }
  ],
  'Region III': [
    {
      id: '1',
      message: 'PPMD has approved your Proposal "Central Luzon Expressway"',
      type: 'approval' as const,
      timestamp: '30 minutes ago'
    },
    {
      id: '2',
      message: 'EPDSD has put some remarks to your proposal "Bulacan Industrial Road"',
      type: 'remark' as const,
      timestamp: '2 hours ago'
    },
    {
      id: '3',
      message: 'SEPD monitors your "Nueva Ecija Irrigation" with current issues',
      type: 'monitoring' as const,
      timestamp: '5 hours ago'
    },
    {
      id: '4',
      message: 'PPMD has updated the status of "Pampanga Flood Control"',
      type: 'update' as const,
      timestamp: '1 day ago'
    }
  ],
  'Region IV-A': [
    {
      id: '1',
      message: 'EPDSD has approved your Proposal "CALABARZON Coastal Road"',
      type: 'approval' as const,
      timestamp: '45 minutes ago'
    },
    {
      id: '2',
      message: 'SEPD has put some remarks to your proposal "Batangas Port Access"',
      type: 'remark' as const,
      timestamp: '2 hours ago'
    },
    {
      id: '3',
      message: 'PPMD monitors your "Cavite Industrial Zone" with current issues',
      type: 'monitoring' as const,
      timestamp: '4 hours ago'
    },
    {
      id: '4',
      message: 'EPDSD has updated the status of "Laguna Lake Road"',
      type: 'update' as const,
      timestamp: '1 day ago'
    }
  ],
  'Region V': [
    {
      id: '1',
      message: 'SEPD has approved your Proposal "Bicol Regional Highway"',
      type: 'approval' as const,
      timestamp: '1 hour ago'
    },
    {
      id: '2',
      message: 'PPMD has put some remarks to your proposal "Legazpi Airport Road"',
      type: 'remark' as const,
      timestamp: '3 hours ago'
    },
    {
      id: '3',
      message: 'EPDSD monitors your "Naga City Bypass" with current issues',
      type: 'monitoring' as const,
      timestamp: '6 hours ago'
    },
    {
      id: '4',
      message: 'SEPD has updated the status of "Sorsogon Coastal Road"',
      type: 'update' as const,
      timestamp: '1 day ago'
    }
  ]
}

// EPDSD-specific notifications
const epdsdNotifications = [
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
  }
]

// Default notifications for regions not specified
const defaultNotifications = [
  {
    id: '1',
    message: 'EPDSD has approved your Proposal "Regional Development Project"',
    type: 'approval' as const,
    timestamp: '1 hour ago'
  },
  {
    id: '2',
    message: 'SEPD has put some remarks to your proposal "Infrastructure Development"',
    type: 'remark' as const,
    timestamp: '3 hours ago'
  },
  {
    id: '3',
    message: 'PPMD monitors your "Regional Road Project" with current issues',
    type: 'monitoring' as const,
    timestamp: '5 hours ago'
  },
  {
    id: '4',
    message: 'EPDSD has updated the status of "Regional Bridge Project"',
    type: 'update' as const,
    timestamp: '1 day ago'
  }
]

export function NotificationTemplate({ raedRegion, userRole }: NotificationTemplateProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let selectedNotifications = []
    
    // Show VIEWER-specific notifications for VIEWER users
    if (userRole === 'VIEWER') {
      selectedNotifications = viewerNotifications
    } else if (userRole === 'EPDSD') {
      // Show EPDSD-specific notifications for EPDSD users
      selectedNotifications = epdsdNotifications
    } else {
      // Get notifications for the specific region or use default
      selectedNotifications = notificationTemplates[raedRegion as keyof typeof notificationTemplates] || defaultNotifications
    }
    
    // Initialize with some unread notifications
    const initialNotifications = selectedNotifications.map((notification, index) => ({
      ...notification,
      isRead: index >= 2 // First 2 are unread
    }))
    
    setNotifications(initialNotifications)
    setUnreadCount(2)
  }, [raedRegion, userRole])

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {userRole === 'VIEWER' ? 'National summary and report updates' : `Updates for ${raedRegion} region`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            message={notification.message}
            timestamp={notification.timestamp}
            type={notification.type}
            isRead={notification.isRead || false}
            onClick={() => handleNotificationClick(notification.id)}
          />
        ))}
      </CardContent>
    </Card>
  )
}
