'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderOpen, Plus, Edit2, Trash2, Save, X, Settings2, Building2, Wrench, Package, Navigation, ListOrdered, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SuccessToast } from '@/components/success-toast'
import { ConfigureStagesModal } from '@/components/configure-stages-modal'

interface ProjectStage {
  id: string
  name: string
  order: number
}

interface ProjectType {
  id: string
  name: string
  description?: string
  stages: ProjectStage[]
  createdAt: string
  updatedAt: string
}

// Default stages for different project types
const getDefaultStages = (typeName: string): ProjectStage[] => {
  if (typeName.toLowerCase().includes('infrastructure') || typeName.toLowerCase() === 'fmr') {
    return [
      { id: '1', name: 'Proposal', order: 1 },
      { id: '2', name: 'Procurement', order: 2 },
      { id: '3', name: 'Implementation', order: 3 },
      { id: '4', name: 'Completed', order: 4 },
      { id: '5', name: 'Inventory', order: 5 },
    ]
  } else if (typeName.toLowerCase().includes('machinery')) {
    return [
      { id: '1', name: 'Proposal', order: 1 },
      { id: '2', name: 'Procurement', order: 2 },
      { id: '3', name: 'For Delivery', order: 3 },
      { id: '4', name: 'Delivered', order: 4 },
      { id: '5', name: 'Inventory', order: 5 },
    ]
  } else {
    // Default stages for other types
    return [
      { id: '1', name: 'Draft', order: 1 },
      { id: '2', name: 'Proposal', order: 2 },
      { id: '3', name: 'Procurement', order: 3 },
      { id: '4', name: 'Implementation', order: 4 },
      { id: '5', name: 'Completed', order: 5 },
    ]
  }
}

export default function ProjectsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([
    { id: '1', name: 'FMR', description: 'Farm-to-Market Road', stages: getDefaultStages('FMR'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'Infrastructure', description: 'Infrastructure Projects', stages: getDefaultStages('Infrastructure'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'Machinery', description: 'Machinery and Equipment', stages: getDefaultStages('Machinery'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<ProjectType | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastCountdown, setToastCountdown] = useState(10)
  const [toastMessage, setToastMessage] = useState('Project Type Added Successfully!')
  const [highlightedTypeId, setHighlightedTypeId] = useState<string | null>(null)
  const [showConfigureDialog, setShowConfigureDialog] = useState(false)
  const [selectedTypeForConfigure, setSelectedTypeForConfigure] = useState<string | null>(null)
  const [showConfigureStagesModal, setShowConfigureStagesModal] = useState(false)

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleAddProjectType = () => {
    setEditingType(null)
    setFormData({ name: '', description: '' })
    setIsDialogOpen(true)
  }

  const handleEditProjectType = (type: ProjectType) => {
    setEditingType(type)
    setFormData({ name: type.name, description: type.description || '' })
    setIsDialogOpen(true)
  }

  const handleSaveProjectType = () => {
    if (!formData.name.trim()) return

    let savedTypeId: string

    if (editingType) {
      savedTypeId = editingType.id
      const updatedTypes = projectTypes.map(type => 
        type.id === editingType.id 
          ? { ...type, name: formData.name, description: formData.description, updatedAt: new Date().toISOString() }
          : type
      )
      setProjectTypes(updatedTypes)
      saveProjectTypes(updatedTypes)
      setToastMessage('Project Type Updated Successfully!')
    } else {
      const newType: ProjectType = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        stages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      savedTypeId = newType.id
      const updatedTypes = [...projectTypes, newType]
      setProjectTypes(updatedTypes)
      saveProjectTypes(updatedTypes)
      setToastMessage('Project Type Added Successfully!')
    }

    setIsDialogOpen(false)
    setFormData({ name: '', description: '' })
    setEditingType(null)
    
    setShowSuccessToast(true)
    setToastCountdown(10)
    
    setTimeout(() => {
      setHighlightedTypeId(savedTypeId)
      const element = document.getElementById(`project-type-${savedTypeId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setTimeout(() => {
        setHighlightedTypeId(null)
      }, 2000)
    }, 500)
    
    const timer = setInterval(() => {
      setToastCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowSuccessToast(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleDeleteProjectType = (id: string) => {
    if (confirm('Are you sure you want to delete this project type?')) {
      const updatedTypes = projectTypes.filter(type => type.id !== id)
      setProjectTypes(updatedTypes)
      localStorage.setItem('projectTypes', JSON.stringify(updatedTypes))
    }
  }

  const getProjectTypeIcon = (typeName: string) => {
    const name = typeName.toLowerCase()
    if (name.includes('fmr') || name.includes('farm-to-market')) return Navigation
    if (name.includes('infrastructure') || name.includes('infra')) return Building2
    if (name.includes('machinery') || name.includes('machine')) return Wrench
    if (name.includes('package')) return Package
    return FolderOpen
  }

  const saveProjectTypes = (types: ProjectType[]) => {
    localStorage.setItem('projectTypes', JSON.stringify(types))
  }

  const loadProjectTypes = () => {
    const storedTypes = localStorage.getItem('projectTypes')
    if (storedTypes) {
      try {
        const parsed = JSON.parse(storedTypes)
        if (parsed.length > 0) {
          setProjectTypes(parsed)
        }
      } catch (e) {
        console.error('Error parsing project types:', e)
      }
    }
  }

  useEffect(() => {
    loadProjectTypes()
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadProjectTypes()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const [isInitialLoad, setIsInitialLoad] = useState(true)
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
      return
    }
    if (projectTypes.length > 0) {
      saveProjectTypes(projectTypes)
    }
  }, [projectTypes, isInitialLoad])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage project types that can be used throughout the system
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Types</CardTitle>
              <CardDescription>
                Manage project types that can be used throughout the system
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddProjectType} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Project Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingType ? 'Edit Project Type' : 'Add New Project Type'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingType 
                      ? 'Update the project type information below.'
                      : 'Create a new project type that can be used in the system.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Type Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Infrastructure, FMR, Machinery"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of the project type"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProjectType} disabled={!formData.name.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingType ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {projectTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No project types yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click "Add Project Type" to create your first project type
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projectTypes.map((type) => {
                const TypeIcon = getProjectTypeIcon(type.name)
                return (
                  <Card 
                    key={type.id} 
                    id={`project-type-${type.id}`}
                    className={`relative hover:shadow-md transition-all duration-300 ${
                      highlightedTypeId === type.id
                        ? 'ring-4 ring-green-500 ring-offset-2 shadow-lg scale-105 bg-green-50 border-green-500'
                        : 'transition-shadow'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                            <TypeIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg">{type.name}</CardTitle>
                            {type.description && (
                              <CardDescription className="mt-1">
                                {type.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-2 flex-shrink-0">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Project Stages</Label>
                          <Badge variant="secondary" className="text-xs">
                            {type.stages.length} {type.stages.length === 1 ? 'stage' : 'stages'}
                          </Badge>
                        </div>
                        {type.stages.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {type.stages
                              .sort((a, b) => a.order - b.order)
                              .slice(0, 3)
                              .map((stage) => (
                                <Badge key={stage.id} variant="outline" className="text-xs">
                                  {stage.name}
                                </Badge>
                              ))}
                            {type.stages.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{type.stages.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          Updated: {new Date(type.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setSelectedTypeForConfigure(type.id)
                              setShowConfigureDialog(true)
                            }}
                            className="gap-1.5"
                            type="button"
                          >
                            <Settings2 className="h-3.5 w-3.5" />
                            Configure
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProjectType(type)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProjectType(type.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configure Options Dialog */}
      <Dialog open={showConfigureDialog} onOpenChange={(open) => {
        setShowConfigureDialog(open)
        if (!open) {
          setSelectedTypeForConfigure(null)
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Configure Project Type
            </DialogTitle>
            <DialogDescription>
              Choose what you want to configure for this project type
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto p-6 hover:bg-primary/5 hover:border-primary transition-colors justify-start w-full"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (selectedTypeForConfigure) {
                  setShowConfigureStagesModal(true)
                }
                setShowConfigureDialog(false)
              }}
              type="button"
            >
              <div className="flex items-start gap-4 w-full">
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <ListOrdered className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0 overflow-hidden">
                  <div className="font-semibold text-base leading-tight mb-1.5 break-words">Project Stages Configuration</div>
                  <div className="text-sm text-muted-foreground leading-relaxed break-words">
                    Configure project stages and their form fields
                  </div>
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 hover:bg-primary/5 hover:border-primary transition-colors justify-start w-full"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (selectedTypeForConfigure) {
                  // Close dialog first, then navigate to prevent any redirect issues
                  setShowConfigureDialog(false)
                  // Use setTimeout to ensure dialog closes before navigation
                  setTimeout(() => {
                    router.push(`/form-builder/projects/registration/${selectedTypeForConfigure}`)
                  }, 100)
                } else {
                  setShowConfigureDialog(false)
                }
              }}
              type="button"
            >
              <div className="flex items-start gap-4 w-full">
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0 overflow-hidden">
                  <div className="font-semibold text-base leading-tight mb-1.5 break-words">Project Registration Form Configuration</div>
                  <div className="text-sm text-muted-foreground leading-relaxed break-words">
                    Configure the initial project registration form
                  </div>
                </div>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigureDialog(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Stages Modal */}
      <ConfigureStagesModal
        isOpen={showConfigureStagesModal}
        onClose={() => setShowConfigureStagesModal(false)}
        typeId={selectedTypeForConfigure}
        projectTypeName={projectTypes.find(t => t.id === selectedTypeForConfigure)?.name}
      />

      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        countdown={toastCountdown}
        message={toastMessage}
      />
    </div>
  )
}

