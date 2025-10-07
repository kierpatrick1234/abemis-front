'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, AlertCircle, Eye, UserPlus, Database, Wrench, FileText, Upload, CheckSquare } from 'lucide-react'

interface NotificationItemProps {
  id: string
  message: string
  timestamp: string
  type: 'approval' | 'remark' | 'monitoring' | 'update' | 'user_registration' | 'system' | 'maintenance' | 'compliance' | 'submission' | 'upload'
  isRead: boolean
  onClick: () => void
}

const notificationIcons = {
  approval: CheckCircle,
  remark: AlertCircle,
  monitoring: Eye,
  update: Clock,
  user_registration: UserPlus,
  system: Database,
  maintenance: Wrench,
  compliance: CheckSquare,
  submission: FileText,
  upload: Upload
}

const notificationColors = {
  approval: 'text-green-600',
  remark: 'text-orange-600',
  monitoring: 'text-blue-600',
  update: 'text-purple-600',
  user_registration: 'text-blue-600',
  system: 'text-green-600',
  maintenance: 'text-yellow-600',
  compliance: 'text-green-600',
  submission: 'text-blue-600',
  upload: 'text-purple-600'
}

export function NotificationItem({ 
  // id, 
  message, 
  timestamp, 
  type, 
  isRead, 
  onClick 
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = notificationIcons[type]
  const colorClass = notificationColors[type]

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isRead ? 'opacity-60' : 'border-l-4 border-l-blue-500'
      } ${isHovered ? 'bg-blue-50' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Icon className={`h-5 w-5 mt-0.5 ${colorClass}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Badge 
                variant={isRead ? "secondary" : "default"}
                className="text-xs"
              >
                {type.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">{timestamp}</span>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              {message.split(/(EPDSD|SEPD|PPMD|RAED \d+|"[^"]*")/).map((part, index) => {
                if (part === 'EPDSD' || part === 'SEPD' || part === 'PPMD') {
                  return <strong key={index} className="font-bold text-blue-700">{part}</strong>
                } else if (part.match(/^RAED \d+$/)) {
                  return <strong key={index} className="font-bold text-blue-700">{part}</strong>
                } else if (part.startsWith('"') && part.endsWith('"')) {
                  return <strong key={index} className="font-bold text-green-700">{part}</strong>
                }
                return <span key={index}>{part}</span>
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
