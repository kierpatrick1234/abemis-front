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
import { Building2, Wrench, FileText, Package, CheckCircle } from 'lucide-react'

interface InventoryProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: {
    title: string
    type: string
    description: string
    isInventory: boolean
  }) => void
}

const inventoryTypes = [
  {
    id: 'single',
    name: 'Single Project Inventory',
    description: 'Add a single completed project to inventory',
    icon: CheckCircle,
    color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
  },
  {
    id: 'package',
    name: 'Package Project Inventory',
    description: 'Add a package of completed projects to inventory',
    icon: Package,
    color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
  }
]

export function InventoryProjectModal({ isOpen, onClose, onProjectCreate }: InventoryProjectModalProps) {
  const [selectedType, setSelectedType] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [step, setStep] = useState<'type' | 'details'>('type')

  const handleTypeSelect = (typeId: string) => {
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
      type: inventoryTypes.find(p => p.id === selectedType)?.name || '',
      description: description.trim(),
      isInventory: true
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
    onClose()
  }

  const selectedInventoryType = inventoryTypes.find(p => p.id === selectedType)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Project</DialogTitle>
          <DialogDescription>
            {step === 'type' 
              ? 'Select the type of inventory project you want to add'
              : 'Provide project details'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step === 'type' ? (
            <div className="space-y-4">
              {inventoryTypes.map((type) => {
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
                {selectedInventoryType && (
                  <>
                    <selectedInventoryType.icon className="h-5 w-5" />
                    <span className="font-medium">{selectedInventoryType.name}</span>
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
              Add to Inventory
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
