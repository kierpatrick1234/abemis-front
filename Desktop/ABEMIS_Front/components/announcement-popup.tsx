'use client'

import { useState, useEffect } from 'react'
import { X, Megaphone, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AnnouncementPopupProps {
  isOpen: boolean
  onClose: () => void
  userRole: string
}

export function AnnouncementPopup({ isOpen, onClose, userRole }: AnnouncementPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth animation
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Popup */}
      <Card 
        className={`relative w-full max-w-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-2xl transform transition-all duration-300 ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Announcement</h2>
                  <p className="text-blue-100 text-sm">Important Notice for RAED Users</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Main Message */}
            <div className="bg-white rounded-lg p-6 border border-blue-100">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    All valid accomplishment for the <span className="font-semibold text-blue-600">3rd Quarter</span> is already uploaded to the IMS, kindly provide justifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                Next Steps
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-semibold">1</span>
                  </div>
                  <span className="text-gray-700">Review your uploaded accomplishments</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-semibold">2</span>
                  </div>
                  <span className="text-gray-700">Prepare and submit required justifications</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-semibold">3</span>
                  </div>
                  <span className="text-gray-700">Ensure all documentation is complete</span>
                </li>
              </ul>
            </div>

            {/* Timeline */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Timeline</h3>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Q3 2024
                </Badge>
                <span>•</span>
                <span>Accomplishments uploaded</span>
                <span>•</span>
                <span className="font-medium text-blue-600">Justifications pending</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={onClose}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              >
                Got it, thanks!
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 font-medium py-3"
              >
                View Accomplishments
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
