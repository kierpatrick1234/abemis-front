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
import { Building2, Wrench, FileText } from 'lucide-react'
import { InfraProjectModal } from './infra-project-modal'
import { MachineryProjectModal } from './machinery-project-modal'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: {
    title: string
    type: string
    description: string
  }) => void
  editingDraft?: any // Project being edited
}

const projectTypes = [
  {
    id: 'infra',
    name: 'Infra project',
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
    name: 'FMR project',
    description: 'Farm-to-Market Road projects',
    icon: FileText,
    color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
  }
]

export function NewProjectModal({ isOpen, onClose, onProjectCreate, editingDraft }: NewProjectModalProps) {
  const [selectedType, setSelectedType] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [step, setStep] = useState<'type' | 'details'>('type')
  const [showInfraModal, setShowInfraModal] = useState(false)

  // Auto-open InfraProjectModal if editing any draft project
  React.useEffect(() => {
    if (editingDraft && isOpen) {
      setShowInfraModal(true)
    }
  }, [editingDraft, isOpen])

  const [showMachineryModal, setShowMachineryModal] = useState(false)

  const handleTypeSelect = (typeId: string) => {
    if (typeId === 'infra') {
      setShowInfraModal(true)
      onClose() // Close the modal when selecting Infrastructure
      return
    }
    if (typeId === 'machinery') {
      setShowMachineryModal(true)
      onClose() // Close the modal when selecting Machinery
      return
    }
    setSelectedType(typeId)
    setStep('details')
  }

  const handleBack = () => {
    setStep('type')
    setSelectedType('')
  }

  const handleSubmit = () => {
    if (!selectedType || !title.trim()) return

    const projectData = {
      title: title.trim(),
      type: projectTypes.find(p => p.id === selectedType)?.name || '',
      description: description.trim()
    }

    onProjectCreate(projectData)
    
    // Reset form
    setSelectedType('')
    setTitle('')
    setDescription('')
    setStep('type')
    onClose()
  }

  const handleClose = () => {
    // Reset form when closing
    setSelectedType('')
    setTitle('')
    setDescription('')
    setStep('type')
    setShowInfraModal(false)
    onClose()
  }

  const handleInfraProjectCreate = (projectData: Record<string, unknown>) => {
    // Extract required fields from projectData
    const extractedData = {
      title: (projectData.title as string) || 'New Infrastructure Project',
      type: (projectData.type as string) || 'Infrastructure',
      description: (projectData.description as string) || 'New project description'
    }
    onProjectCreate(extractedData)
    setShowInfraModal(false)
    onClose()
  }

  const handleMachineryProjectCreate = (projectData: Record<string, unknown>) => {
    // Extract required fields from projectData
    const extractedData = {
      title: (projectData.title as string) || 'New Machinery Project',
      type: (projectData.type as string) || 'Machinery',
      description: (projectData.description as string) || 'New project description'
    }
    onProjectCreate(extractedData)
    setShowMachineryModal(false)
    onClose()
  }

  const selectedProjectType = projectTypes.find(p => p.id === selectedType)

  return (
    <>
      <Dialog open={isOpen && !showInfraModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              {step === 'type' 
                ? 'Select the type of project you want to create'
                : 'Provide project details'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {step === 'type' ? (
              <div className="space-y-4">
                {projectTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Card 
                      key={type.id}
                      className={`cursor-pointer transition-all duration-200 border-2 ${type.color} ${
                        selectedType === type.id ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => handleTypeSelect(type.id)}
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
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  {selectedProjectType && (
                    <>
                      <selectedProjectType.icon className="h-5 w-5" />
                      <span className="font-medium">{selectedProjectType.name}</span>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <textarea
                    id="description"
                    placeholder="Enter project description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            {step === 'details' && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {step === 'details' && (
              <Button 
                onClick={handleSubmit}
                disabled={!title.trim()}
              >
                Create Project
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
          // Also close the main modal if needed
          if (!editingDraft) {
            onClose()
          }
        }}
        onProjectCreate={handleInfraProjectCreate}
        editingDraft={editingDraft}
      />

      {/* Machinery Project Modal */}
      <MachineryProjectModal
        isOpen={showMachineryModal}
        onClose={() => {
          setShowMachineryModal(false)
          // Also close the main modal if needed
          if (!editingDraft) {
            onClose()
          }
        }}
        onProjectCreate={handleMachineryProjectCreate}
        editingDraft={editingDraft}
      />
    </>
  )
}