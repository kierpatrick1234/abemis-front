'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Project } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
  Package, 
  Building2, 
  Wrench, 
  FileText, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

interface ProjectPackageModalProps {
  isOpen: boolean
  onClose: () => void
  projectPackage: Project | null
  onViewProject?: (project: Project) => void
}

export function ProjectPackageModal({ isOpen, onClose, projectPackage, onViewProject }: ProjectPackageModalProps) {
  if (!projectPackage || projectPackage.type !== 'Project Package') {
    return null
  }

  const { packageProjects, individualProjects } = projectPackage

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'Infrastructure': return <Building2 className="h-5 w-5" />
      case 'Machinery': return <Wrench className="h-5 w-5" />
      default: return <Package className="h-5 w-5" />
    }
  }

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'Infrastructure': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200'
      case 'Machinery': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Delivered': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Implementation': return <Clock className="h-4 w-4 text-blue-600" />
      case 'For Delivery': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'Proposal': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600'
      case 'Delivered': return 'text-green-600'
      case 'Implementation': return 'text-blue-600'
      case 'For Delivery': return 'text-yellow-600'
      case 'Proposal': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200'
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200'
      case 'Implementation': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200'
      case 'For Delivery': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200'
      case 'Proposal': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200'
      case 'Procurement': return 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900 dark:text-violet-200'
      case 'Inventory': return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-purple-600" />
            Project Package Details
          </DialogTitle>
          <DialogDescription>
            Overview of individual projects within this package
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 px-1">
          {/* Package Overview */}
          <Card className="border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                {projectPackage.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {projectPackage.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{projectPackage.province}</p>
                    <p className="text-xs text-muted-foreground">{projectPackage.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(projectPackage.budget)}</p>
                    <p className="text-xs text-muted-foreground">Total Budget</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{projectPackage.assignedTo}</p>
                    <p className="text-xs text-muted-foreground">Assigned To</p>
                  </div>
                </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getStatusIcon(projectPackage.status)}
                  {projectPackage.status}
                </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Summary */}
            <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Package Summary</CardTitle>
              </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* Project Type Summary */}
              {packageProjects && (
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800 flex-1">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{packageProjects.infrastructure}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Infrastructure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800 flex-1">
                    <Wrench className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">{packageProjects.machinery}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Machinery</p>
                    </div>
                  </div>
                </div>
          )}

          {/* Project Stage Summary */}
          {individualProjects && individualProjects.length > 0 && (
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-medium">Project Stages:</h4>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      // Group projects by status and count them
                      const statusGroups = individualProjects.reduce((acc, project) => {
                        acc[project.status] = (acc[project.status] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)

                      return Object.entries(statusGroups).map(([status, count]) => (
                        <div key={status} className="relative inline-block">
                          <Badge 
                            className={`${getStatusBadgeColor(status)} flex items-center gap-1 pr-6`}
                          >
                            {getStatusIcon(status)}
                            {status}
                          </Badge>
                          {count > 1 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-gray-900">
                              {count}
                            </div>
                          )}
                        </div>
                      ))
                    })()}
                      </div>
                </div>
              )}
              </CardContent>
            </Card>

          {/* Individual Projects - Categorized Accordion */}
          {individualProjects && individualProjects.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Individual Projects</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Accordion type="multiple" className="w-full space-y-2">
                  {/* Infrastructure Projects */}
                  {individualProjects.filter(p => p.type === 'Infrastructure').length > 0 && (
                    <AccordionItem value="infrastructure" className="border rounded-lg">
                      <AccordionTrigger className="hover:no-underline p-3 bg-blue-50/50 dark:bg-blue-950/20 border-b">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div className="text-left">
                              <h4 className="font-semibold text-base">Infrastructure Projects</h4>
                              <p className="text-xs text-muted-foreground">
                                {individualProjects.filter(p => p.type === 'Infrastructure').length} project{individualProjects.filter(p => p.type === 'Infrastructure').length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2 max-h-[400px] overflow-y-auto">
                          {individualProjects.filter(p => p.type === 'Infrastructure').map((project, index) => (
                            <Card key={project.id} className="border-l-4 border-l-blue-500">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{project.title}</h4>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      {project.province}, {project.region}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      {(() => {
                                        // Count only infrastructure projects with the same status
                                        const infrastructureProjects = individualProjects.filter(p => p.type === 'Infrastructure')
                                        const sameStatusProjects = infrastructureProjects.filter(p => p.status === project.status)
                                        const count = sameStatusProjects.length
                                        return (
                                          <div className="relative inline-block">
                                            <Badge className={`${getStatusBadgeColor(project.status)} flex items-center gap-1 text-xs pr-6`}>
                                              {getStatusIcon(project.status)}
                                              {project.status}
                                            </Badge>
                                            {count > 1 && (
                                              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-gray-900">
                                                {count}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })()}
                                    </div>
                                  </div>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => onViewProject?.(project)}
                                    className="ml-2"
                                    >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                    </Button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(project.budget)}</p>
                                    <p className="text-muted-foreground">Budget</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">{formatDate(project.startDate)}</p>
                                    <p className="text-muted-foreground">Start</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">{formatDate(project.updatedAt)}</p>
                                    <p className="text-muted-foreground">Updated</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Machinery Projects */}
                  {individualProjects.filter(p => p.type === 'Machinery').length > 0 && (
                    <AccordionItem value="machinery" className="border rounded-lg">
                      <AccordionTrigger className="hover:no-underline p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-b">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Wrench className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <div className="text-left">
                              <h4 className="font-semibold text-base">Machinery Projects</h4>
                              <p className="text-xs text-muted-foreground">
                                {individualProjects.filter(p => p.type === 'Machinery').length} project{individualProjects.filter(p => p.type === 'Machinery').length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2 max-h-[400px] overflow-y-auto">
                          {individualProjects.filter(p => p.type === 'Machinery').map((project, index) => (
                            <Card key={project.id} className="border-l-4 border-l-emerald-500">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{project.title}</h4>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      {project.province}, {project.region}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      {(() => {
                                        // Count only machinery projects with the same status
                                        const machineryProjects = individualProjects.filter(p => p.type === 'Machinery')
                                        const sameStatusProjects = machineryProjects.filter(p => p.status === project.status)
                                        const count = sameStatusProjects.length
                                        return (
                                          <div className="relative inline-block">
                                            <Badge className={`${getStatusBadgeColor(project.status)} flex items-center gap-1 text-xs pr-6`}>
                                              {getStatusIcon(project.status)}
                                              {project.status}
                                            </Badge>
                                            {count > 1 && (
                                              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-gray-900">
                                                {count}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })()}
                                    </div>
                                  </div>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => onViewProject?.(project)}
                                    className="ml-2"
                                    >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                    </Button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(project.budget)}</p>
                                    <p className="text-muted-foreground">Budget</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">{formatDate(project.startDate)}</p>
                                    <p className="text-muted-foreground">Start</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">{formatDate(project.updatedAt)}</p>
                                    <p className="text-muted-foreground">Updated</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


