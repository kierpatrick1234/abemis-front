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
import { InventorySingleProjectModal } from './inventory-single-project-modal'
import { InventoryPackageProjectModal } from './inventory-package-project-modal'

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
  const [showSingleModal, setShowSingleModal] = useState(false)
  const [showPackageModal, setShowPackageModal] = useState(false)

  const handleTypeSelect = (typeId: string) => {
    if (typeId === 'single') {
      setShowSingleModal(true)
      onClose() // Close the main modal when selecting single project
      return
    }
    if (typeId === 'package') {
      setShowPackageModal(true)
      onClose() // Close the main modal when selecting package project
      return
    }
  }

  const handleClose = () => {
    setSelectedType('')
    onClose()
  }

  const handleSingleProjectCreate = (projectData: Record<string, unknown>) => {
    // Extract required fields from projectData and add inventory flag
    const extractedData = {
      title: (projectData.title as string) || 'New Inventory Project',
      type: (projectData.type as string) || 'Infrastructure',
      description: (projectData.description as string) || 'New inventory project description',
      isInventory: true
    }
    onProjectCreate(extractedData)
    setShowSingleModal(false)
    onClose()
  }

  const handlePackageProjectCreate = (projectData: Record<string, unknown>) => {
    // Extract required fields from projectData and add inventory flag
    const extractedData = {
      title: (projectData.title as string) || 'New Inventory Package',
      type: (projectData.type as string) || 'Project Package',
      description: (projectData.description as string) || 'New inventory package description',
      isInventory: true
    }
    onProjectCreate(extractedData)
    setShowPackageModal(false)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen && !showSingleModal && !showPackageModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Inventory Project</DialogTitle>
            <DialogDescription>
              Select the type of inventory project you want to add
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
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
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Project Inventory Modal */}
      <InventorySingleProjectModal
        isOpen={showSingleModal}
        onClose={() => setShowSingleModal(false)}
        onProjectCreate={handleSingleProjectCreate}
      />

      {/* Package Project Inventory Modal */}
      <InventoryPackageProjectModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        onProjectCreate={handlePackageProjectCreate}
      />
    </>
  )
}
