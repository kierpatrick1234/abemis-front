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
      case 'FMR': return <FileText className="h-5 w-5" />
      default: return <Package className="h-5 w-5" />
    }
  }

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'Infrastructure': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200'
      case 'Machinery': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200'
      case 'FMR': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200'
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

        <div className="flex-1 overflow-y-auto space-y-6 px-1">
          {/* Package Overview */}
          <Card className="border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                {projectPackage.title}
              </CardTitle>
              <CardDescription className="text-base">
                {projectPackage.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{projectPackage.province}</p>
                    <p className="text-xs text-muted-foreground">{projectPackage.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{formatDate(projectPackage.startDate)}</p>
                    <p className="text-xs text-muted-foreground">Start Date</p>
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
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getStatusIcon(projectPackage.status)}
                  {projectPackage.status}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Package
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Package Summary */}
          {packageProjects && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Package Summary</CardTitle>
                <CardDescription>
                  Number of projects by type in this package
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{packageProjects.infrastructure}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Infrastructure</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <Wrench className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{packageProjects.machinery}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Machinery</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg border border-orange-200 dark:border-orange-800">
                    <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">{packageProjects.fmr}</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">FMR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Stage Summary */}
          {individualProjects && individualProjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Stage Summary</CardTitle>
                <CardDescription>
                  Current stage distribution of individual projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Proposal', 'Implementation', 'Completed', 'Delivered'].map((stage) => {
                    const count = individualProjects.filter(p => p.status === stage).length
                    const getStageIcon = () => {
                      switch (stage) {
                        case 'Proposal': return <AlertTriangle className="h-5 w-5 text-orange-600" />
                        case 'Implementation': return <Clock className="h-5 w-5 text-blue-600" />
                        case 'Completed': return <CheckCircle className="h-5 w-5 text-green-600" />
                        case 'Delivered': return <CheckCircle className="h-5 w-5 text-green-600" />
                        default: return <Clock className="h-5 w-5 text-gray-600" />
                      }
                    }
                    const getStageColor = () => {
                      switch (stage) {
                        case 'Proposal': return 'bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800'
                        case 'Implementation': return 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'
                        case 'Completed': return 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                        case 'Delivered': return 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                        default: return 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                      }
                    }
                    
                    return (
                      <div key={stage} className={`text-center p-4 rounded-lg border ${getStageColor()}`}>
                        {getStageIcon()}
                        <p className="text-2xl font-bold mt-2">{count}</p>
                        <p className="text-sm text-muted-foreground">{stage}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Individual Projects - Categorized Accordion */}
          {individualProjects && individualProjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Individual Projects</CardTitle>
                <CardDescription>
                  Detailed view of each project categorized by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full space-y-2">
                  {/* Infrastructure Projects */}
                  {individualProjects.filter(p => p.type === 'Infrastructure').length > 0 && (
                    <AccordionItem value="infrastructure" className="border rounded-lg">
                      <AccordionTrigger className="hover:no-underline p-4 bg-blue-50/50 dark:bg-blue-950/20 border-b">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <div className="text-left">
                              <h4 className="font-semibold text-lg">Infrastructure Projects</h4>
                              <p className="text-sm text-muted-foreground">
                                {individualProjects.filter(p => p.type === 'Infrastructure').length} project{individualProjects.filter(p => p.type === 'Infrastructure').length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2 max-h-[400px] overflow-y-auto">
                          {individualProjects.filter(p => p.type === 'Infrastructure').map((project, index) => (
                            <Card key={project.id} className="border-l-4 border-l-blue-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      {getProjectTypeIcon(project.type)}
                                      <Badge className={`${getProjectTypeColor(project.type)} flex items-center gap-1`}>
                                        {project.type}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">{project.title}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {project.province}, {project.region}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge className={`${getStatusBadgeColor(project.status)} flex items-center gap-1`}>
                                          {getStatusIcon(project.status)}
                                          {project.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => onViewProject?.(project)}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      View Project
                                    </Button>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(project.budget)}</p>
                                    <p className="text-xs text-muted-foreground">Budget</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">{formatDate(project.startDate)}</p>
                                    <p className="text-xs text-muted-foreground">Start Date</p>
                                  </div>
                                  {project.endDate && (
                                    <div>
                                      <p className="font-medium">{formatDate(project.endDate)}</p>
                                      <p className="text-xs text-muted-foreground">End Date</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{formatDate(project.updatedAt)}</p>
                                    <p className="text-xs text-muted-foreground">Last Updated</p>
                                  </div>
                                </div>
                                
                                {project.assignedTo && (
                                  <div className="mt-3 pt-3 border-t">
                                    <p className="text-xs text-muted-foreground">Assigned to: {project.assignedTo}</p>
                                  </div>
                                )}
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
                      <AccordionTrigger className="hover:no-underline p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Wrench className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            <div className="text-left">
                              <h4 className="font-semibold text-lg">Machinery Projects</h4>
                              <p className="text-sm text-muted-foreground">
                                {individualProjects.filter(p => p.type === 'Machinery').length} project{individualProjects.filter(p => p.type === 'Machinery').length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2 max-h-[400px] overflow-y-auto">
                          {individualProjects.filter(p => p.type === 'Machinery').map((project, index) => (
                            <Card key={project.id} className="border-l-4 border-l-emerald-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      {getProjectTypeIcon(project.type)}
                                      <Badge className={`${getProjectTypeColor(project.type)} flex items-center gap-1`}>
                                        {project.type}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">{project.title}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {project.province}, {project.region}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge className={`${getStatusBadgeColor(project.status)} flex items-center gap-1`}>
                                          {getStatusIcon(project.status)}
                                          {project.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => onViewProject?.(project)}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      View Project
                                    </Button>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(project.budget)}</p>
                                    <p className="text-xs text-muted-foreground">Budget</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">{formatDate(project.startDate)}</p>
                                    <p className="text-xs text-muted-foreground">Start Date</p>
                                  </div>
                                  {project.endDate && (
                                    <div>
                                      <p className="font-medium">{formatDate(project.endDate)}</p>
                                      <p className="text-xs text-muted-foreground">End Date</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{formatDate(project.updatedAt)}</p>
                                    <p className="text-xs text-muted-foreground">Last Updated</p>
                                  </div>
                                </div>
                                
                                {project.assignedTo && (
                                  <div className="mt-3 pt-3 border-t">
                                    <p className="text-xs text-muted-foreground">Assigned to: {project.assignedTo}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* FMR Projects */}
                  {individualProjects.filter(p => p.type === 'FMR').length > 0 && (
                    <AccordionItem value="fmr" className="border rounded-lg">
                      <AccordionTrigger className="hover:no-underline p-4 bg-orange-50/50 dark:bg-orange-950/20 border-b">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            <div className="text-left">
                              <h4 className="font-semibold text-lg">FMR Projects</h4>
                              <p className="text-sm text-muted-foreground">
                                {individualProjects.filter(p => p.type === 'FMR').length} project{individualProjects.filter(p => p.type === 'FMR').length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2 max-h-[400px] overflow-y-auto">
                          {individualProjects.filter(p => p.type === 'FMR').map((project, index) => (
                            <Card key={project.id} className="border-l-4 border-l-orange-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      {getProjectTypeIcon(project.type)}
                                      <Badge className={`${getProjectTypeColor(project.type)} flex items-center gap-1`}>
                                        {project.type}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">{project.title}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {project.province}, {project.region}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge className={`${getStatusBadgeColor(project.status)} flex items-center gap-1`}>
                                          {getStatusIcon(project.status)}
                                          {project.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => onViewProject?.(project)}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      View Project
                                    </Button>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(project.budget)}</p>
                                    <p className="text-xs text-muted-foreground">Budget</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">{formatDate(project.startDate)}</p>
                                    <p className="text-xs text-muted-foreground">Start Date</p>
                                  </div>
                                  {project.endDate && (
                                    <div>
                                      <p className="font-medium">{formatDate(project.endDate)}</p>
                                      <p className="text-xs text-muted-foreground">End Date</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{formatDate(project.updatedAt)}</p>
                                    <p className="text-xs text-muted-foreground">Last Updated</p>
                                  </div>
                                </div>
                                
                                {project.assignedTo && (
                                  <div className="mt-3 pt-3 border-t">
                                    <p className="text-xs text-muted-foreground">Assigned to: {project.assignedTo}</p>
                                  </div>
                                )}
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
