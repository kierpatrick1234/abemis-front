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
                    <h4 className="font-medium text-sm text-muted-foreground">Assigned To</h4>
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
