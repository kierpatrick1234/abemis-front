'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Package, CheckCircle, Building2, Wrench, Plus, X } from 'lucide-react'
import { InventoryInfraProjectModal } from './inventory-infra-project-modal'
import { InventoryMachineryProjectModal } from './inventory-machinery-project-modal'

interface InventoryPackageProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: Record<string, unknown>) => void
}

interface ProjectForm {
  id: string
  type: 'Infrastructure' | 'Machinery'
  title: string
  description: string
  data?: Record<string, unknown>
}

export function InventoryPackageProjectModal({ isOpen, onClose, onProjectCreate }: InventoryPackageProjectModalProps) {
  const [packageTitle, setPackageTitle] = useState('')
  const [packageDescription, setPackageDescription] = useState('')
  const [currentStep, setCurrentStep] = useState<'package' | 'projects'>('package')
  const [projects, setProjects] = useState<ProjectForm[]>([])
  const [showInfraModal, setShowInfraModal] = useState(false)
  const [showMachineryModal, setShowMachineryModal] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectForm | null>(null)

  const handleNext = () => {
    if (currentStep === 'package') {
      setCurrentStep('projects')
    }
  }

  const handleBack = () => {
    if (currentStep === 'projects') {
      setCurrentStep('package')
    }
  }

  const handleAddProject = (type: 'Infrastructure' | 'Machinery') => {
    const newProject: ProjectForm = {
      id: `project-${Date.now()}`,
      type,
      title: '',
      description: '',
      data: {}
    }
    setProjects(prev => [...prev, newProject])
    setEditingProject(newProject)
    
    // Open appropriate modal
    if (type === 'Infrastructure') {
      setShowInfraModal(true)
    } else if (type === 'Machinery') {
      setShowMachineryModal(true)
    }
  }

  const handleEditProject = (project: ProjectForm) => {
    setEditingProject(project)
    
    // Open appropriate modal
    if (project.type === 'Infrastructure') {
      setShowInfraModal(true)
    } else if (project.type === 'Machinery') {
      setShowMachineryModal(true)
    }
  }

  const handleRemoveProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  const handleProjectFormSubmit = (projectData: Record<string, unknown>) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => 
        p.id === editingProject.id 
          ? { ...p, title: projectData.projectTitle as string || '', description: projectData.projectDescription as string || '', data: projectData }
          : p
      ))
    }
    setEditingProject(null)
    setShowInfraModal(false)
    setShowMachineryModal(false)
  }

  const handleSubmit = () => {
    if (!packageTitle.trim() || projects.length === 0) return

    const projectData = {
      title: packageTitle.trim(),
      type: 'Project Package',
      description: packageDescription.trim(),
      isInventory: true,
      status: 'Inventory',
      packageProjects: {
        infrastructure: projects.filter(p => p.type === 'Infrastructure').length,
        machinery: projects.filter(p => p.type === 'Machinery').length
      },
      individualProjects: projects.map(project => ({
        ...project.data,
        type: project.type,
        title: project.title,
        description: project.description,
        status: 'Inventory',
        isInventory: true
      }))
    }

    onProjectCreate(projectData)
    
    // Reset form
    setPackageTitle('')
    setPackageDescription('')
    setProjects([])
    setCurrentStep('package')
    onClose()
  }

  const handleClose = () => {
    // Reset form when closing
    setPackageTitle('')
    setPackageDescription('')
    setProjects([])
    setCurrentStep('package')
    setEditingProject(null)
    onClose()
  }

  const isPackageStepValid = packageTitle.trim()
  const isProjectsStepValid = projects.length > 0

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'Infrastructure': return <Building2 className="h-4 w-4" />
      case 'Machinery': return <Wrench className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'Infrastructure': return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'Machinery': return 'bg-green-50 border-green-200 text-green-700'
      default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  return (
    <>
      <Dialog open={isOpen && !showInfraModal && !showMachineryModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Add Package Project to Inventory
            </DialogTitle>
            <DialogDescription>
              {currentStep === 'package' 
                ? 'Provide package details and add individual projects'
                : 'Configure individual projects in this package'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-6">
            {currentStep === 'package' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="packageTitle">Package Title *</Label>
                  <Input
                    id="packageTitle"
                    placeholder="Enter package title"
                    value={packageTitle}
                    onChange={(e) => setPackageTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packageDescription">Package Description (Optional)</Label>
                  <textarea
                    id="packageDescription"
                    placeholder="Enter package description"
                    value={packageDescription}
                    onChange={(e) => setPackageDescription(e.target.value)}
                    className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> After creating the package, you'll be able to add individual projects with detailed information.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Individual Projects</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddProject('Infrastructure')}
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      Add Infrastructure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddProject('Machinery')}
                      className="flex items-center gap-2"
                    >
                      <Wrench className="h-4 w-4" />
                      Add Machinery
                    </Button>
                  </div>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No projects added yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add individual projects to this package using the buttons above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <Card key={project.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${getProjectTypeColor(project.type)}`}>
                                {getProjectTypeIcon(project.type)}
                              </div>
                              <div>
                                <h4 className="font-medium">{project.title || `New ${project.type} Project`}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {project.description || 'No description provided'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProject(project)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveProject(project.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {projects.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Package Summary:</strong> {projects.length} project{projects.length > 1 ? 's' : ''} 
                      ({projects.filter(p => p.type === 'Infrastructure').length} Infrastructure, 
                      {projects.filter(p => p.type === 'Machinery').length} Machinery)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            {currentStep === 'projects' && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep === 'package' ? (
              <Button 
                onClick={handleNext}
                disabled={!isPackageStepValid}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!isProjectsStepValid}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Add Package to Inventory
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Individual Project Modals */}
      <InventoryInfraProjectModal
        isOpen={showInfraModal}
        onClose={() => {
          setShowInfraModal(false)
          setEditingProject(null)
        }}
        onProjectCreate={handleProjectFormSubmit}
        editingDraft={editingProject?.data}
      />

      <InventoryMachineryProjectModal
        isOpen={showMachineryModal}
        onClose={() => {
          setShowMachineryModal(false)
          setEditingProject(null)
        }}
        onProjectCreate={handleProjectFormSubmit}
        editingDraft={editingProject?.data}
      />

    </>
  )
}
