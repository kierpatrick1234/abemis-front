'use client'

import React from 'react'
import { Toast } from '@/components/ui/toast'
import { CheckCircle } from 'lucide-react'

interface SuccessToastProps {
  isVisible: boolean
  onClose: () => void
  countdown: number
  message?: string
}

export function SuccessToast({ isVisible, onClose, countdown, message = 'Project Created Successfully!' }: SuccessToastProps) {
  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm cursor-pointer" onClick={onClose}>
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h4 className="font-semibold text-green-800">{message}</h4>
            <p className="text-sm text-green-700">
              {message.includes('draft') ? 'Your project has been saved as draft.' : 'Your infrastructure project has been added to the list.'}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Auto-closes in {countdown} seconds (click to close)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
