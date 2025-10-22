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
import { Building2, Wrench, FileText, CheckCircle } from 'lucide-react'
import { InventoryInfraProjectModal } from './inventory-infra-project-modal'
import { InventoryMachineryProjectModal } from './inventory-machinery-project-modal'
import { InventoryFMRProjectModal } from './inventory-fmr-project-modal'

interface InventorySingleProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: Record<string, unknown>) => void
}

const inventoryProjectTypes = [
  {
    id: 'infra',
    name: 'Infrastructure Project',
    description: 'Add completed infrastructure project to inventory',
    icon: Building2,
    color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
  },
  {
    id: 'machinery',
    name: 'Machinery Project',
    description: 'Add completed machinery project to inventory',
    icon: Wrench,
    color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
  },
  {
    id: 'fmr',
    name: 'FMR Project',
    description: 'Add completed Farm-to-Market Road project to inventory',
    icon: FileText,
    color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
  }
]

export function InventorySingleProjectModal({ isOpen, onClose, onProjectCreate }: InventorySingleProjectModalProps) {
  const [selectedType, setSelectedType] = useState<string>('')
  const [showInfraModal, setShowInfraModal] = useState(false)
  const [showMachineryModal, setShowMachineryModal] = useState(false)
  const [showFMRModal, setShowFMRModal] = useState(false)

  const handleTypeSelect = (typeId: string) => {
    if (typeId === 'infra') {
      setShowInfraModal(true)
      onClose() // Close the main modal when selecting Infrastructure
      return
    }
    if (typeId === 'machinery') {
      setShowMachineryModal(true)
      onClose() // Close the main modal when selecting Machinery
      return
    }
    if (typeId === 'fmr') {
      setShowFMRModal(true)
      onClose() // Close the main modal when selecting FMR
      return
    }
  }

  const handleClose = () => {
    setSelectedType('')
    onClose()
  }

  const handleInfraProjectCreate = (projectData: Record<string, unknown>) => {
    // Extract required fields from projectData and add inventory flag
    const extractedData = {
      ...projectData,
      isInventory: true,
      status: 'Inventory' // Set status to Inventory for completed projects
    }
    onProjectCreate(extractedData)
    setShowInfraModal(false)
    onClose()
  }

  const handleMachineryProjectCreate = (projectData: Record<string, unknown>) => {
    // Extract required fields from projectData and add inventory flag
    const extractedData = {
      ...projectData,
      isInventory: true,
      status: 'Inventory' // Set status to Inventory for completed projects
    }
    onProjectCreate(extractedData)
    setShowMachineryModal(false)
    onClose()
  }

  const handleFMRProjectCreate = (projectData: Record<string, unknown>) => {
    // Extract required fields from projectData and add inventory flag
    const extractedData = {
      ...projectData,
      isInventory: true,
      status: 'Inventory' // Set status to Inventory for completed projects
    }
    onProjectCreate(extractedData)
    setShowFMRModal(false)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen && !showInfraModal && !showMachineryModal && !showFMRModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Single Project to Inventory</DialogTitle>
            <DialogDescription>
              Select the type of completed project you want to add to inventory
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="space-y-4">
              {inventoryProjectTypes.map((type) => {
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
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Infrastructure Project Inventory Modal */}
      <InventoryInfraProjectModal
        isOpen={showInfraModal}
        onClose={() => setShowInfraModal(false)}
        onProjectCreate={handleInfraProjectCreate}
      />

      {/* Machinery Project Inventory Modal */}
      <InventoryMachineryProjectModal
        isOpen={showMachineryModal}
        onClose={() => setShowMachineryModal(false)}
        onProjectCreate={handleMachineryProjectCreate}
      />

      {/* FMR Project Inventory Modal */}
      <InventoryFMRProjectModal
        isOpen={showFMRModal}
        onClose={() => setShowFMRModal(false)}
        onProjectCreate={handleFMRProjectCreate}
      />
    </>
  )
}
