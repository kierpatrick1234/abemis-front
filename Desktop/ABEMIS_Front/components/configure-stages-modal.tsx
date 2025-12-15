'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ConfigureStagesModalProps {
  isOpen: boolean
  onClose: () => void
  typeId: string | null
  projectTypeName?: string
}

export function ConfigureStagesModal({ isOpen, onClose, typeId, projectTypeName }: ConfigureStagesModalProps) {
  const router = useRouter()

  if (!typeId) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Configure Project Stages</DialogTitle>
              <DialogDescription className="mt-1">
                Manage project stages for <strong>{projectTypeName || 'this project type'}</strong>
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={`/form-builder/projects/configure/${typeId}?modal=true`}
            className="w-full h-full border-0"
            title="Configure Project Stages"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
