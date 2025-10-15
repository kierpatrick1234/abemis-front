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
import { FileText, X } from 'lucide-react'

interface FMRProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: Record<string, unknown>) => void
  editingDraft?: any // Project being edited
  showCloseButton?: boolean // Show X button for package projects
  packageTitle?: string
  packageDescription?: string
}

export function FMRProjectModal({ 
  isOpen, 
  onClose, 
  onProjectCreate, 
  editingDraft, 
  showCloseButton = false,
  packageTitle,
  packageDescription
}: FMRProjectModalProps) {
  const [formData, setFormData] = useState({
    title: editingDraft?.title || '',
    description: editingDraft?.description || '',
    province: editingDraft?.province || '',
    municipality: editingDraft?.municipality || '',
    barangay: editingDraft?.barangay || '',
    budget: editingDraft?.budget || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectData = {
      title: formData.title || 'New FMR Project',
      type: 'FMR',
      description: formData.description || 'Farm-to-Market Road project',
      province: formData.province,
      municipality: formData.municipality,
      barangay: formData.barangay,
      budget: formData.budget ? parseFloat(formData.budget) : 0,
      ...(packageTitle && { packageTitle }),
      ...(packageDescription && { packageDescription })
    }

    onProjectCreate(projectData)
  }

  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      description: '',
      province: '',
      municipality: '',
      barangay: '',
      budget: ''
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Create FMR Project
              </DialogTitle>
              <DialogDescription>
                Fill in the details for your Farm-to-Market Road project
              </DialogDescription>
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="Enter FMR project title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  placeholder="Enter province"
                  value={formData.province}
                  onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipality">Municipality</Label>
                <Input
                  id="municipality"
                  placeholder="Enter municipality"
                  value={formData.municipality}
                  onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="barangay">Barangay</Label>
                <Input
                  id="barangay"
                  placeholder="Enter barangay"
                  value={formData.barangay}
                  onChange={(e) => setFormData(prev => ({ ...prev, barangay: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (PHP)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter budget amount"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create FMR Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
