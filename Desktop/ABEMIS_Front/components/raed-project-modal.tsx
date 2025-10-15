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
import { Building2, Wrench, FileText, Package, User, Plus, Minus } from 'lucide-react'
import { InfraProjectModal } from './infra-project-modal'
import { MachineryProjectModal } from './machinery-project-modal'
import { FMRProjectModal } from './fmr-project-modal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface RAEDProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: {
    title: string
    type: string
    description: string
    isPackage?: boolean
    packageProjects?: Array<{ type: string; count: number }>
  }) => void
  editingDraft?: any // Project being edited
}

const projectTypes = [
  {
    id: 'infra',
    name: 'Infrastructure Project',
    description: 'Infrastructure development projects',
    icon: Building2,
    color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
  },
  {
    id: 'machinery',
    name: 'Machinery Project',
    description: 'Machinery and equipment projects',
    icon: Wrench,
    color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
  },
  {
    id: 'fmr',
    name: 'FMR Project',
    description: 'Farm-to-Market Road projects',
    icon: FileText,
    color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
  }
]

const projectModes = [
  {
    id: 'solo',
    name: 'Single Proposal',
    description: 'Create a single project proposal',
    icon: User,
    color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
  },
  {
    id: 'package',
    name: 'Package Projects',
    description: 'Create multiple projects in a package',
    icon: Package,
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
  }
]

export function RAEDProjectModal({ isOpen, onClose, onProjectCreate, editingDraft }: RAEDProjectModalProps) {
  const [step, setStep] = useState<'mode' | 'solo-type' | 'package-setup' | 'package-details' | 'package-forms'>('mode')
  const [selectedMode, setSelectedMode] = useState<string>('')
  const [selectedSoloType, setSelectedSoloType] = useState<string>('')
  const [packageProjects, setPackageProjects] = useState<Array<{ type: string; count: number }>>([
    { type: 'infra', count: 0 },
    { type: 'machinery', count: 0 },
    { type: 'fmr', count: 0 }
  ])
  const [packageTitle, setPackageTitle] = useState('')
  const [packageDescription, setPackageDescription] = useState('')
  const [packageTotalBudget, setPackageTotalBudget] = useState('')
  
  // Budget tracking for each project type
  const [projectBudgets, setProjectBudgets] = useState<{
    infra: number[]
    machinery: number[]
    fmr: number[]
  }>({
    infra: [],
    machinery: [],
    fmr: []
  })
  
  // Modal states for individual project creation
  const [showInfraModal, setShowInfraModal] = useState(false)
  const [showMachineryModal, setShowMachineryModal] = useState(false)
  
  // State for tracking which project form is being edited
  const [editingProjectIndex, setEditingProjectIndex] = useState<{ type: string; index: number } | null>(null)
  
  // State for tracking temporary budget during configuration
  const [temporaryBudget, setTemporaryBudget] = useState<number | null>(null)
  
  // State for tracking completed projects
  const [completedProjects, setCompletedProjects] = useState<Set<string>>(new Set())

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId)
    if (modeId === 'solo') {
      setStep('solo-type')
    } else if (modeId === 'package') {
      setStep('package-setup')
    }
  }

  const handleSoloTypeSelect = (typeId: string) => {
    setSelectedSoloType(typeId)
    
    // Open the appropriate project creation modal
    if (typeId === 'infra') {
      setShowInfraModal(true)
      onClose()
      return
    }
    if (typeId === 'machinery') {
      setShowMachineryModal(true)
      onClose()
      return
    }
    if (typeId === 'fmr') {
      // For FMR, we'll create a simple project directly
      const projectData = {
        title: 'New FMR Project',
        type: 'FMR',
        description: 'Farm-to-Market Road project'
      }
      onProjectCreate(projectData)
      handleClose()
      return
    }
  }

  const handlePackageProjectCountChange = (type: string, increment: boolean) => {
    setPackageProjects(prev => 
      prev.map(p => {
        if (p.type === type) {
          const newCount = increment ? p.count + 1 : Math.max(0, p.count - 1)
          return { ...p, count: newCount }
        }
        return p
      })
    )
    
    // Update budget arrays when project count changes
    setProjectBudgets(prev => {
      const newBudgets = { ...prev }
      const projectType = type as keyof typeof prev
      const currentCount = prev[projectType].length
      
      if (increment) {
        // Add a new budget entry
        newBudgets[projectType] = [...prev[projectType], 0]
      } else {
        // Remove the last budget entry
        newBudgets[projectType] = prev[projectType].slice(0, -1)
      }
      
      return newBudgets
    })
  }

  const handlePackageProceed = () => {
    setStep('package-details')
  }

  const handlePackageCreate = () => {
    const totalProjects = packageProjects.reduce((sum, p) => sum + p.count, 0)
    
    if (totalProjects === 0) {
      alert('Please add at least one project to the package')
      return
    }

    // Move to the forms step instead of creating projects directly
    setStep('package-forms')
  }

  const handleBack = () => {
    if (step === 'solo-type') {
      setStep('mode')
    } else if (step === 'package-setup') {
      setStep('mode')
    } else if (step === 'package-details') {
      setStep('package-setup')
    } else if (step === 'package-forms') {
      setStep('package-details')
    }
  }

  const handleClose = () => {
    // Reset all states
    setStep('mode')
    setSelectedMode('')
    setSelectedSoloType('')
    setPackageProjects([
      { type: 'infra', count: 0 },
      { type: 'machinery', count: 0 },
      { type: 'fmr', count: 0 }
    ])
    setPackageTitle('')
    setPackageDescription('')
    setPackageTotalBudget('')
    setProjectBudgets({
      infra: [],
      machinery: [],
      fmr: []
    })
    setShowInfraModal(false)
    setShowMachineryModal(false)
    setEditingProjectIndex(null)
    setTemporaryBudget(null)
    setCompletedProjects(new Set())
    onClose()
  }

  const handleOpenProjectForm = (type: string, index: number) => {
    setEditingProjectIndex({ type, index })
    
    if (type === 'infra') {
      setShowInfraModal(true)
    } else if (type === 'machinery') {
      setShowMachineryModal(true)
    }
    // FMR projects will be handled differently since they don't have a complex form
  }

  const handleFMRProjectCreate = (type: string, index: number, budget: number = 0) => {
    const projectData = {
      title: `FMR Project ${index + 1} - ${packageTitle}`,
      type: 'FMR',
      description: `${packageDescription || 'New FMR project'} (Part of ${packageTitle})`,
      isPackage: true,
      packageIndex: index,
      budget: budget
    }
    
    // Update budget tracking for package projects
    setProjectBudgets(prev => ({
      ...prev,
      fmr: [...prev.fmr.slice(0, index), budget, ...prev.fmr.slice(index + 1)]
    }))
    
    onProjectCreate(projectData)
  }

  const handleInfraProjectCreate = (projectData: Record<string, unknown>) => {
    const extractedData = {
      title: (projectData.title as string) || 'New Infrastructure Project',
      type: (projectData.type as string) || 'Infrastructure',
      description: (projectData.description as string) || 'New project description',
      isPackage: step === 'package-forms',
      packageTitle: packageTitle,
      packageDescription: packageDescription,
      packageIndex: editingProjectIndex?.index,
      budget: projectData.budget || projectData.allocatedAmount || 0
    }
    
    // Update budget tracking for package projects
    if (step === 'package-forms' && editingProjectIndex) {
      setProjectBudgets(prev => ({
        ...prev,
        infra: [...prev.infra.slice(0, editingProjectIndex.index), 
               projectData.budget || projectData.allocatedAmount || 0, 
               ...prev.infra.slice(editingProjectIndex.index + 1)]
      }))
      
      // Clear temporary budget and editing state
      setTemporaryBudget(null)
      setEditingProjectIndex(null)
      
      // Mark project as completed
      const projectKey = `${editingProjectIndex.type}-${editingProjectIndex.index}`
      setCompletedProjects(prev => new Set([...prev, projectKey]))
    }
    
    onProjectCreate(extractedData)
    setShowInfraModal(false)
    
    if (step !== 'package-forms') {
      onClose()
    }
  }

  const handleMachineryProjectCreate = (projectData: Record<string, unknown>) => {
    const extractedData = {
      title: (projectData.title as string) || 'New Machinery Project',
      type: (projectData.type as string) || 'Machinery',
      description: (projectData.description as string) || 'New project description',
      isPackage: step === 'package-forms',
      packageTitle: packageTitle,
      packageDescription: packageDescription,
      packageIndex: editingProjectIndex?.index,
      budget: projectData.budget || projectData.allocatedAmount || 0
    }
    
    // Update budget tracking for package projects
    if (step === 'package-forms' && editingProjectIndex) {
      setProjectBudgets(prev => ({
        ...prev,
        machinery: [...prev.machinery.slice(0, editingProjectIndex.index), 
                   projectData.budget || projectData.allocatedAmount || 0, 
                   ...prev.machinery.slice(editingProjectIndex.index + 1)]
      }))
      
      // Clear temporary budget and editing state
      setTemporaryBudget(null)
      setEditingProjectIndex(null)
      
      // Mark project as completed
      const projectKey = `${editingProjectIndex.type}-${editingProjectIndex.index}`
      setCompletedProjects(prev => new Set([...prev, projectKey]))
    }
    
    onProjectCreate(extractedData)
    setShowMachineryModal(false)
    
    if (step !== 'package-forms') {
      onClose()
    }
  }

  const getTotalPackageProjects = () => {
    return packageProjects.reduce((sum, p) => sum + p.count, 0)
  }

  const getProjectTypeTotalBudget = (type: string) => {
    const baseBudget = projectBudgets[type as keyof typeof projectBudgets].reduce((sum, budget) => sum + budget, 0)
    
    // Add temporary budget if we're currently editing this project type
    if (editingProjectIndex?.type === type && temporaryBudget !== null) {
      // Replace the budget for the current editing index with temporary budget
      const currentBudgets = projectBudgets[type as keyof typeof projectBudgets]
      const tempBudgets = [...currentBudgets]
      tempBudgets[editingProjectIndex.index] = temporaryBudget
      return tempBudgets.reduce((sum, budget) => sum + budget, 0)
    }
    
    return baseBudget
  }

  const getTotalSubBudgets = () => {
    return Object.values(projectBudgets).flat().reduce((sum, budget) => sum + budget, 0)
  }

  const getBudgetStatus = () => {
    const totalBudget = parseFloat(packageTotalBudget) || 0
    const subTotal = getTotalSubBudgets()
    
    if (subTotal === 0) return { status: 'empty', message: 'No budgets set', color: 'text-gray-500' }
    if (totalBudget === 0) return { status: 'no-total', message: 'Total budget not set', color: 'text-yellow-600' }
    if (subTotal > totalBudget) return { status: 'over', message: `Over budget by ₱${(subTotal - totalBudget).toLocaleString()}`, color: 'text-red-600' }
    if (subTotal < totalBudget) return { status: 'under', message: `Under budget by ₱${(totalBudget - subTotal).toLocaleString()}`, color: 'text-green-600' }
    return { status: 'exact', message: 'Budget allocation is exact', color: 'text-blue-600' }
  }

  const selectedProjectMode = projectModes.find(p => p.id === selectedMode)
  const selectedProjectType = projectTypes.find(p => p.id === selectedSoloType)

  return (
    <>
      <Dialog open={isOpen && !showInfraModal && !showMachineryModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              {step === 'mode' && 'Choose your project creation mode'}
              {step === 'solo-type' && 'Select the type of project you want to create'}
              {step === 'package-setup' && 'Configure your project package'}
              {step === 'package-details' && 'Provide package details'}
              {step === 'package-forms' && 'Complete individual project forms'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 overflow-y-auto flex-1 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {step === 'mode' && (
              <div className="space-y-4">
                {projectModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <Card 
                      key={mode.id}
                      className={`cursor-pointer transition-all duration-200 border-2 ${mode.color} ${
                        selectedMode === mode.id ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => handleModeSelect(mode.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-6 w-6" />
                          <div>
                            <h3 className="font-semibold">{mode.name}</h3>
                            <p className="text-sm opacity-80">{mode.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {step === 'solo-type' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  {selectedProjectMode && (
                    <>
                      <selectedProjectMode.icon className="h-5 w-5" />
                      <span className="font-medium">{selectedProjectMode.name}</span>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  {projectTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <Card 
                        key={type.id}
                        className={`cursor-pointer transition-all duration-200 border-2 ${type.color} ${
                          selectedSoloType === type.id ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        onClick={() => handleSoloTypeSelect(type.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-6 w-6" />
                            <div>
                              <h3 className="font-semibold">{type.name}</h3>
                              <p className="text-sm opacity-80">{type.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 'package-setup' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  {selectedProjectMode && (
                    <>
                      <selectedProjectMode.icon className="h-5 w-5" />
                      <span className="font-medium">{selectedProjectMode.name}</span>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configure Project Package</h3>
                  <p className="text-sm text-muted-foreground">
                    Select the number of projects for each type you want to include in this package.
                  </p>

                  {projectTypes.map((type) => {
                    const Icon = type.icon
                    const projectCount = packageProjects.find(p => p.type === type.id)?.count || 0
                    
                    return (
                      <Card key={type.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Icon className="h-6 w-6" />
                              <div>
                                <h4 className="font-semibold">{type.name}</h4>
                                <p className="text-sm text-muted-foreground">{type.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePackageProjectCountChange(type.id, false)}
                                disabled={projectCount === 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{projectCount}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePackageProjectCountChange(type.id, true)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      Total Projects: {getTotalPackageProjects()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === 'package-details' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  {selectedProjectMode && (
                    <>
                      <selectedProjectMode.icon className="h-5 w-5" />
                      <span className="font-medium">{selectedProjectMode.name}</span>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Package Summary</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      {packageProjects.map(p => {
                        if (p.count > 0) {
                          const typeName = projectTypes.find(t => t.id === p.type)?.name || p.type
                          return (
                            <div key={p.type} className="flex justify-between">
                              <span>{typeName}:</span>
                              <span>{p.count} project{p.count > 1 ? 's' : ''}</span>
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="package-title">Package Title</Label>
                    <Input
                      id="package-title"
                      placeholder="Enter package title"
                      value={packageTitle}
                      onChange={(e) => setPackageTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="package-total-budget">Total Package Budget (PHP)</Label>
                    <Input
                      id="package-total-budget"
                      type="number"
                      placeholder="Enter total package budget"
                      value={packageTotalBudget}
                      onChange={(e) => setPackageTotalBudget(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      This will be used to track budget allocation across all projects in the package.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="package-description">Package Description (Optional)</Label>
                    <textarea
                      id="package-description"
                      placeholder="Enter package description"
                      value={packageDescription}
                      onChange={(e) => setPackageDescription(e.target.value)}
                      className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'package-forms' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  {selectedProjectMode && (
                    <>
                      <selectedProjectMode.icon className="h-5 w-5" />
                      <span className="font-medium">{selectedProjectMode.name}</span>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Package: {packageTitle}</h4>
                    <p className="text-sm text-blue-800">{packageDescription}</p>
                    {packageTotalBudget && (
                      <div className="mt-2 p-2 bg-blue-100 rounded border border-blue-300">
                        <p className="text-sm font-medium text-blue-900">
                          Total Package Budget: ₱{parseFloat(packageTotalBudget).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>


                  <Accordion type="multiple" className="w-full space-y-2">
                    {packageProjects.map((packageProject) => {
                      if (packageProject.count === 0) return null
                      
                      const projectType = projectTypes.find(t => t.id === packageProject.type)
                      const Icon = projectType?.icon || FileText
                      const typeBudget = getProjectTypeTotalBudget(packageProject.type)
                      
                      // Get highlight color based on project type
                      const getHighlightColor = (type: string) => {
                        switch (type) {
                          case 'infra': return 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                          case 'machinery': return 'bg-green-50 border-green-200 hover:bg-green-100'
                          case 'fmr': return 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                          default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }
                      }
                      
                      return (
                        <AccordionItem key={packageProject.type} value={packageProject.type} className="border-2 rounded-lg">
                          <AccordionTrigger className={`hover:no-underline p-4 rounded-lg transition-all duration-200 ${getHighlightColor(packageProject.type)}`}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center space-x-3">
                                <Icon className="h-6 w-6" />
                                <div className="text-left">
                                  <h4 className="font-semibold text-lg">{projectType?.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {packageProject.count} project{packageProject.count > 1 ? 's' : ''} to configure
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  Budget: ₱{typeBudget.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {typeBudget > 0 ? 'Configured' : 'Pending'}
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {Array.from({ length: packageProject.count }, (_, index) => {
                                const projectBudget = projectBudgets[packageProject.type as keyof typeof projectBudgets][index] || 0
                                const projectKey = `${packageProject.type}-${index}`
                                const isCompleted = completedProjects.has(projectKey)
                                const isConfigured = projectBudget > 0 || isCompleted
                                
                                return (
                                  <Card key={index} className={`border-2 transition-all duration-200 ${
                                    isConfigured 
                                      ? 'border-green-200 bg-green-50' 
                                      : 'border-gray-200 bg-gray-50'
                                  }`}>
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <Icon className={`h-5 w-5 ${isConfigured ? 'text-green-600' : 'text-muted-foreground'}`} />
                                          <div>
                                            <h5 className="font-medium">
                                              {projectType?.name} Project {index + 1}
                                            </h5>
                                            <p className="text-sm text-muted-foreground">
                                              {isCompleted ? 'Project completed - ready for registration' : 
                                               isConfigured ? 'Project configured' : 
                                               'Click to configure project details'}
                                            </p>
                                            {isConfigured && (
                                              <p className="text-sm font-medium text-green-600">
                                                Budget: ₱{projectBudget.toLocaleString()}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {isCompleted && (
                                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                              ✓ Completed
                                            </div>
                                          )}
                                          {isConfigured && !isCompleted && (
                                            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                              ✓ Configured
                                            </div>
                                          )}
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenProjectForm(packageProject.type, index)}
                                          >
                                            {packageProject.type === 'fmr' ? 'Create FMR' : 
                                             isCompleted ? 'Edit Project' : 
                                             isConfigured ? 'Edit' : 'Configure'}
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>

                  {/* Overall Budget Status */}
                  {getBudgetStatus().status !== 'empty' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-semibold text-gray-900">Overall Budget Status</h5>
                          <p className="text-sm text-muted-foreground">
                            Package Budget: ₱{packageTotalBudget ? parseFloat(packageTotalBudget).toLocaleString() : 'Not set'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ₱{getTotalSubBudgets().toLocaleString()}
                          </div>
                          <div className={`text-sm font-medium ${getBudgetStatus().color}`}>
                            {getBudgetStatus().message}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 flex-shrink-0">
            {step !== 'mode' && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {step === 'package-setup' && (
              <Button 
                onClick={handlePackageProceed}
                disabled={getTotalPackageProjects() === 0}
              >
                Proceed
              </Button>
            )}
            {step === 'package-details' && (
              <Button 
                onClick={handlePackageCreate}
                disabled={getTotalPackageProjects() === 0}
              >
                Proceed to Forms
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Infra Project Modal */}
      <InfraProjectModal
        isOpen={showInfraModal}
        onClose={() => {
          setShowInfraModal(false)
          setEditingProjectIndex(null)
          setTemporaryBudget(null)
        }}
        onProjectCreate={handleInfraProjectCreate}
        editingDraft={editingDraft}
        showCloseButton={step === 'package-forms'}
        onBudgetChange={(budget) => setTemporaryBudget(budget)}
      />

      {/* Machinery Project Modal */}
      <MachineryProjectModal
        isOpen={showMachineryModal}
        onClose={() => {
          setShowMachineryModal(false)
          setEditingProjectIndex(null)
          setTemporaryBudget(null)
        }}
        onProjectCreate={handleMachineryProjectCreate}
        editingDraft={editingDraft}
        showCloseButton={step === 'package-forms'}
        onBudgetChange={(budget) => setTemporaryBudget(budget)}
      />
    </>
  )
}
