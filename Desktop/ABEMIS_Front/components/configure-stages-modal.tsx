'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Loader2 } from 'lucide-react'

interface ConfigureStagesModalProps {
  isOpen: boolean
  onClose: () => void
  typeId: string | null
  projectTypeName?: string
}

export function ConfigureStagesModal({ isOpen, onClose, typeId, projectTypeName }: ConfigureStagesModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen && typeId) {
      // Don't show loading state - let iframe load in background
      setIsLoading(false)
      // Force iframe to reload by changing key
      setIframeKey(prev => prev + 1)
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    } else if (!isOpen) {
      // Reset when modal closes
      setIsLoading(false)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [isOpen, typeId])

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
        <div className="flex-1 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          )}
          {typeId && isOpen && (
            <iframe
              key={`configure-${typeId}-${iframeKey}`}
              ref={iframeRef}
              src={`/form-builder/projects/configure/${typeId}?modal=true`}
              className="w-full h-full border-0"
              title="Configure Project Stages"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              onLoad={() => {
                // Ensure loading is hidden when iframe loads
                setIsLoading(false)
                if (loadingTimeoutRef.current) {
                  clearTimeout(loadingTimeoutRef.current)
                  loadingTimeoutRef.current = null
                }
              }}
              onError={() => {
                // Hide loading on error
                setIsLoading(false)
                if (loadingTimeoutRef.current) {
                  clearTimeout(loadingTimeoutRef.current)
                  loadingTimeoutRef.current = null
                }
                console.error('Error loading configure stages iframe')
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
