'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { X, Download, FileText, Eye, CheckCircle, XCircle } from 'lucide-react'

interface DocumentSidebarProps {
  document: any | null
  isOpen: boolean
  onClose: () => void
}

export function DocumentSidebar({ document, isOpen, onClose }: DocumentSidebarProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClose = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      onClose()
      setIsAnimating(false)
    }, 200)
  }, [onClose])

  const handleDownloadDocument = useCallback((doc: any) => {
    try {
      // Create a mock download
      const content = `Document: ${doc.name}
Type: ${doc.type}
Size: ${doc.size}
Uploaded: ${doc.uploadedAt}
Uploaded by: ${doc.uploadedBy}
Status: ${doc.status}
Document ID: ${doc.id}

This is a mock download. In a real application, this would download the actual PDF file.

Document Content Preview:
- Project Overview
- Technical Specifications  
- Implementation Timeline
- Budget Breakdown
- Environmental Impact Assessment
- Sustainability Plans`

      const element = document.createElement('a')
      const file = new Blob([content], {type: 'text/plain'})
      element.href = URL.createObjectURL(file)
      element.download = `${doc.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      
      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(element.href), 100)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }, [])

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      return () => document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, handleClose])

  if (!document || !isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isAnimating ? 'translate-x-full' : ''}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{document.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>Type: {document.type}</span>
                  <span>Size: {document.size}</span>
                  <span>Uploaded: {formatDate(document.uploadedAt)}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Document Status */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Document Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {document.status}
                    </Badge>
                    <span className="text-sm text-gray-600">Uploaded by {document.uploadedBy}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(document.uploadedAt)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Content */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-300 rounded bg-white shadow-inner max-h-96 overflow-y-auto">
                  <div className="p-6 text-sm leading-relaxed">
                    {/* PDF Header */}
                    <div className="bg-red-600 text-white text-center py-3 mb-6 rounded-t">
                      <div className="font-bold text-lg">GOVERNMENT OF THE PHILIPPINES</div>
                      <div className="text-base">DEPARTMENT OF AGRICULTURE</div>
                      <div className="text-sm mt-1">EPDSD PROJECT EVALUATION SYSTEM</div>
                    </div>
                    
                    {/* Document Title */}
                    <div className="text-center mb-6">
                      <div className="font-bold text-lg mb-2">{document.name}</div>
                      <div className="text-sm text-gray-600">Project Proposal Document</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Document ID: {document.id} | Uploaded: {formatDate(document.uploadedAt)}
                      </div>
                    </div>
                    
                    {/* Document Content */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="font-bold text-base text-blue-800 border-b border-blue-200 pb-2 mb-3">I. EXECUTIVE SUMMARY</div>
                        <div className="space-y-2 text-gray-700">
                          <p>This document presents a comprehensive proposal for the development of rural infrastructure projects under the Department of Agriculture's EPDSD program. The project aims to improve agricultural productivity and rural development through strategic infrastructure investments.</p>
                          <p>The proposed project includes detailed technical specifications, implementation timeline, budget allocation, and environmental impact assessment to ensure sustainable development and community benefit.</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="font-bold text-base text-green-800 border-b border-green-200 pb-2 mb-3">II. PROJECT OVERVIEW</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="font-semibold text-gray-800">Project Title:</div>
                            <div className="text-gray-700 bg-white p-2 rounded border text-sm">{document.name}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-semibold text-gray-800">Project Type:</div>
                            <div className="text-gray-700 bg-white p-2 rounded border text-sm">
                              {document.name.includes('Water') ? 'Water Supply System' : 
                               document.name.includes('Road') ? 'Road Construction' : 
                               document.name.includes('Machinery') ? 'Agricultural Machinery' : 'Infrastructure Development'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-semibold text-gray-800">Total Budget:</div>
                            <div className="text-gray-700 bg-white p-2 rounded border text-sm font-mono">
                              ₱{document.name.includes('Machinery') ? '25,000,000' : '15,000,000'}.00
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-semibold text-gray-800">Duration:</div>
                            <div className="text-gray-700 bg-white p-2 rounded border text-sm">12 months</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="font-semibold text-base border-b pb-1">III. TECHNICAL SPECIFICATIONS</div>
                      <div className="pl-4 space-y-1 text-sm">
                        {document.name.includes('Water') ? (
                          <>
                            <div>• Water supply system with 50,000L storage capacity</div>
                            <div>• Distribution network: 5km pipeline system</div>
                            <div>• Pump station with backup power supply</div>
                            <div>• Water quality testing and treatment facility</div>
                            <div>• Community tap stands at strategic locations</div>
                          </>
                        ) : document.name.includes('Road') ? (
                          <>
                            <div>• Farm-to-market road: 3km concrete pavement</div>
                            <div>• Road width: 6 meters with 1-meter shoulders</div>
                            <div>• Drainage system with culverts and ditches</div>
                            <div>• Road signage and safety barriers</div>
                            <div>• Maintenance access points</div>
                          </>
                        ) : (
                          <>
                            <div>• Modern agricultural machinery and equipment</div>
                            <div>• Irrigation system with automated controls</div>
                            <div>• Storage facilities for agricultural products</div>
                            <div>• Processing equipment and tools</div>
                            <div>• Maintenance and repair facilities</div>
                          </>
                        )}
                      </div>
                      
                      <div className="font-semibold text-base border-b pb-1">IV. IMPLEMENTATION TIMELINE</div>
                      <div className="pl-4 text-sm space-y-1">
                        <div>• Phase 1: Planning & Preparation (Months 1-2)</div>
                        <div>• Phase 2: Construction (Months 3-8)</div>
                        <div>• Phase 3: Testing & Commissioning (Months 9-10)</div>
                        <div>• Phase 4: Turnover (Months 11-12)</div>
                      </div>
                      
                      <div className="font-semibold text-base border-b pb-1">V. BUDGET BREAKDOWN</div>
                      <div className="pl-4 text-sm space-y-1">
                        <div>• Materials & Equipment: 60% of total budget</div>
                        <div>• Labor & Services: 26% of total budget</div>
                        <div>• Administrative: 8% of total budget</div>
                        <div>• Contingency: 4% of total budget</div>
                        <div>• Monitoring & Evaluation: 2% of total budget</div>
                      </div>
                    </div>
                    
                    {/* PDF Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-300 text-center">
                      <div className="text-xs text-gray-500">
                        Page 1 of 8 • Generated: {formatDate(document.uploadedAt)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Document ID: {document.id} • File Size: {document.size}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
            <div className="text-sm text-gray-600">
              Document Status: <span className="font-medium text-green-600">{document.status}</span>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
              >
                Close
              </Button>
              <Button 
                onClick={() => handleDownloadDocument(document)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
