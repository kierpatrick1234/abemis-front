'use client'

import { useEffect, useState } from 'react'
import { Toast } from '@/components/ui/toast'
import { CheckCircle } from 'lucide-react'

interface SuccessToastProps {
  isVisible: boolean
  onClose: () => void
  countdown: number
}

export function SuccessToast({ isVisible, onClose, countdown }: SuccessToastProps) {
  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <Toast variant="success" onClose={onClose}>
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h4 className="font-semibold text-green-800">Project Created Successfully!</h4>
            <p className="text-sm text-green-700">
              Your infrastructure project has been added to the list.
            </p>
            <p className="text-xs text-green-600 mt-1">
              Auto-closes in {countdown} seconds
            </p>
          </div>
        </div>
      </Toast>
    </div>
  )
}
