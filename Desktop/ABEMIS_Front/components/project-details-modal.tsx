'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/data-table'
import { ProjectStepper } from '@/components/project-stepper'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Project } from '@/lib/types'
import { useAuth } from '@/lib/contexts/auth-context'
import { MapPin, User, CheckCircle2, AlertCircle, Eye, MessageSquare } from 'lucide-react'

interface ProjectDetailsModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  const { user } = useAuth()
  const [notificationHighlight, setNotificationHighlight] = useState<{
    projectId: string
    highlightType: string
    evaluator?: string
    remarks?: string
    monitoringIssues?: string
    projectName?: string
  } | null>(null)

  useEffect(() => {
    if (isOpen && project) {
      // Check for notification highlight data
      const notificationData = sessionStorage.getItem('notificationHighlight')
      if (notificationData) {
        try {
          const data = JSON.parse(notificationData)
          if (data.projectId === project.id) {
            setNotificationHighlight(data)
          }
        } catch (e) {
          console.error('Error parsing notification data:', e)
        }
      }
    } else {
      setNotificationHighlight(null)
    }
  }, [isOpen, project])

  if (!project) return null

  const getHighlightCard = () => {
    if (!notificationHighlight) return null

    const { highlightType, evaluator, remarks, monitoringIssues } = notificationHighlight

    let icon, title, content, bgColor, borderColor, textColor

    switch (highlightType) {
      case 'approval':
        icon = CheckCircle2
        title = 'Project Approved'
        content = remarks || 'Project has been approved by the evaluator.'
        bgColor = 'bg-green-50'
        borderColor = 'border-green-200'
        textColor = 'text-green-800'
        break
      case 'remark':
        icon = MessageSquare
        title = 'Remarks from Evaluator'
        content = remarks || 'The evaluator has provided remarks on this project.'
        bgColor = 'bg-orange-50'
        borderColor = 'border-orange-200'
        textColor = 'text-orange-800'
        break
      case 'monitoring':
        icon = Eye
        title = 'Monitoring Issues'
        content = monitoringIssues || 'There are monitoring issues that need attention.'
        bgColor = 'bg-blue-50'
        borderColor = 'border-blue-200'
        textColor = 'text-blue-800'
        break
      case 'update':
        icon = AlertCircle
        title = 'Status Update'
        content = remarks || 'Project status has been updated.'
        bgColor = 'bg-purple-50'
        borderColor = 'border-purple-200'
        textColor = 'text-purple-800'
        break
      default:
        return null
    }

    const IconComponent = icon

    return (
      <Card className={`${bgColor} ${borderColor} border-2`}>
        <CardHeader>
          <CardTitle className={`${textColor} flex items-center gap-2`}>
            <IconComponent className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {evaluator && (
            <div className="mb-3">
              <p className="text-sm font-medium text-muted-foreground">Evaluator:</p>
              <p className="text-sm font-semibold">{evaluator}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Details:</p>
            <p className={`text-sm ${textColor}`}>{content}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {project.province}, {project.region}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notification Highlight Card */}
          {getHighlightCard()}
          {/* Project Information - Merged Overview & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Top Row - Status and Key Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={project.type === 'FMR' ? 'secondary' : 'outline'}>
                    {project.type}
                  </Badge>
                  <StatusBadge status={project.status} />
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    <span className="font-medium">₱{project.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Main Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Project Tracking Reference</h4>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{project.id}</p>
                </div>
                {project.assignedTo && (
                  <div className="space-y-2 text-right">
                    <h4 className="font-medium text-sm text-muted-foreground">Created by:</h4>
                    <div className="flex items-center justify-end gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{project.assignedTo}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Project Progress Stepper */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectStepper 
                currentStatus={project.status} 
                onStepClick={(step) => console.log('Step clicked:', step)}
                projectType={project.type}
                project={project}
              />
            </CardContent>
          </Card>


        </div>
      </DialogContent>
    </Dialog>
  )
}
