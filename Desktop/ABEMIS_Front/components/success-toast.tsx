'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { Toast } from '@/components/ui/toast'
import { CheckCircle } from 'lucide-react'

interface SuccessToastProps {
  isVisible: boolean
  onClose: () => void
  countdown: number
  message?: string
}

export function SuccessToast({ isVisible, onClose, countdown, message = 'Project Created Successfully!' }: SuccessToastProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Auto-close when countdown reaches 0
  React.useEffect(() => {
    if (countdown <= 0 && isVisible) {
      onClose()
    }
  }, [countdown, onClose, isVisible])

  const handleClose = React.useCallback(() => {
    onClose()
  }, [onClose])

  if (!isVisible || !mounted) return null

  const toastContent = (
    <div className="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" 
        onClick={handleClose}
      ></div>
      
      {/* Toast content */}
      <div 
        className="relative bg-white border-2 border-green-300 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 cursor-pointer transform transition-all hover:scale-105 pointer-events-auto" 
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClose()
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Close toast notification"
      >
        <div className="flex items-start space-x-4">
          <CheckCircle className="h-12 w-12 text-green-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-green-800 mb-2">{message}</h4>
            <p className="text-base text-green-700 mb-3 leading-relaxed">
              {message.includes('draft') ? 'Your project has been saved as draft.' : 'Your infrastructure project has been added to the list.'}
            </p>
            <p className="text-sm text-green-600 font-medium">
              {countdown > 0 ? `Auto-closes in ${countdown} seconds (click to close)` : 'Click to close'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // Render in portal to ensure it's outside any dialog stacking context
  return createPortal(toastContent, document.body)
}
