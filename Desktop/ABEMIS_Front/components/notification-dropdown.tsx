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
import { Bell, CheckCircle2 } from 'lucide-react'

interface NotificationDropdownProps {
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
    },
    {
      id: '5',
      message: 'SEPD has approved your Proposal "Ilocos Sur Coastal Road"',
      type: 'approval' as const,
      timestamp: '3 hours ago'
    },
    {
      id: '6',
      message: 'PPMD has put some remarks to your proposal "Pangasinan Bridge Project"',
      type: 'remark' as const,
      timestamp: '5 hours ago'
    },
    {
      id: '7',
      message: 'EPDSD monitors your "La Union Port Development" with current issues',
      type: 'monitoring' as const,
      timestamp: '2 days ago'
    },
    {
      id: '8',
      message: 'SEPD has updated the status of "Ilocos Norte Airport Road"',
      type: 'update' as const,
      timestamp: '3 days ago'
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
    },
    {
      id: '5',
      message: 'EPDSD has approved your Proposal "Cagayan River Bridge"',
      type: 'approval' as const,
      timestamp: '2 hours ago'
    },
    {
      id: '6',
      message: 'PPMD has put some remarks to your proposal "Isabela Irrigation System"',
      type: 'remark' as const,
      timestamp: '4 hours ago'
    },
    {
      id: '7',
      message: 'SEPD monitors your "Nueva Vizcaya Mountain Road" with current issues',
      type: 'monitoring' as const,
      timestamp: '1 day ago'
    },
    {
      id: '8',
      message: 'EPDSD has updated the status of "Quirino Forest Road"',
      type: 'update' as const,
      timestamp: '2 days ago'
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
    },
    {
      id: '5',
      message: 'SEPD has approved your Proposal "Tarlac Bypass Road"',
      type: 'approval' as const,
      timestamp: '1 hour ago'
    },
    {
      id: '6',
      message: 'EPDSD has put some remarks to your proposal "Zambales Coastal Road"',
      type: 'remark' as const,
      timestamp: '3 hours ago'
    },
    {
      id: '7',
      message: 'PPMD monitors your "Aurora Mountain Road" with current issues',
      type: 'monitoring' as const,
      timestamp: '6 hours ago'
    },
    {
      id: '8',
      message: 'SEPD has updated the status of "Bataan Port Access"',
      type: 'update' as const,
      timestamp: '2 days ago'
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
    },
    {
      id: '5',
      message: 'SEPD has approved your Proposal "Rizal Mountain Road"',
      type: 'approval' as const,
      timestamp: '1 hour ago'
    },
    {
      id: '6',
      message: 'PPMD has put some remarks to your proposal "Quezon Provincial Road"',
      type: 'remark' as const,
      timestamp: '3 hours ago'
    },
    {
      id: '7',
      message: 'EPDSD monitors your "Laguna Industrial Complex" with current issues',
      type: 'monitoring' as const,
      timestamp: '5 hours ago'
    },
    {
      id: '8',
      message: 'SEPD has updated the status of "Cavite Airport Road"',
      type: 'update' as const,
      timestamp: '2 days ago'
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
    },
    {
      id: '5',
      message: 'EPDSD has approved your Proposal "Camarines Sur Bridge"',
      type: 'approval' as const,
      timestamp: '2 hours ago'
    },
    {
      id: '6',
      message: 'PPMD has put some remarks to your proposal "Albay Mountain Road"',
      type: 'remark' as const,
      timestamp: '4 hours ago'
    },
    {
      id: '7',
      message: 'SEPD monitors your "Catanduanes Island Road" with current issues',
      type: 'monitoring' as const,
      timestamp: '1 day ago'
    },
    {
      id: '8',
      message: 'EPDSD has updated the status of "Masbate Port Access"',
      type: 'update' as const,
      timestamp: '2 days ago'
    }
  ]
}

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

export function NotificationDropdown({ raedRegion, userRole }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Record<string, unknown>[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let selectedNotifications = []
    
    // Show admin notifications for superadmin users
    if (userRole === 'superadmin' || userRole === 'admin') {
      selectedNotifications = adminNotifications
    } else {
      // Get notifications for the specific region or use default
      const regionNotifications = notificationTemplates[raedRegion as keyof typeof notificationTemplates] || defaultNotifications
      
      // Shuffle notifications to make them random for each RAED account
      const shuffledNotifications = [...regionNotifications].sort(() => Math.random() - 0.5)
      
      // Take only 5 random notifications
      selectedNotifications = shuffledNotifications.slice(0, 5)
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

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
    setUnreadCount(0)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
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
            {raedRegion} region updates
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
                  message={notification.message}
                  timestamp={notification.timestamp}
                  type={notification.type}
                  isRead={notification.isRead}
                  onClick={() => handleNotificationClick(notification.id)}
                />
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
