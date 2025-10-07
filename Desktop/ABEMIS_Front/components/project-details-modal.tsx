'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/data-table'
import { ProjectStepper } from '@/components/project-stepper'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Calendar, MapPin, DollarSign, User, Clock } from 'lucide-react'

interface ProjectDetailsModalProps {
  project: unknown | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  if (!project) return null

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
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={project.type === 'FMR' ? 'secondary' : 'outline'}>
                      {project.type}
                    </Badge>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Budget:</span>
                    <span>{formatCurrency(project.budget)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Start Date:</span>
                    <span>{formatDate(project.startDate)}</span>
                  </div>
                  {project.endDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">End Date:</span>
                      <span>{formatDate(project.endDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Project ID</h4>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{project.id}</p>
                </div>
                {project.assignedTo && (
                  <div>
                    <h4 className="font-medium mb-2">Assigned To</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{project.assignedTo}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
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

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Project Created</p>
                    <p className="text-xs text-muted-foreground">{formatDate(project.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">{formatDate(project.updatedAt)}</p>
                  </div>
                </div>
                {project.endDate && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Project Completed</p>
                      <p className="text-xs text-muted-foreground">{formatDate(project.endDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
