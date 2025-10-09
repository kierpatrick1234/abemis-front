'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Eye, Download, FileText, CheckCircle, User, Calendar, File } from 'lucide-react'

interface DocumentPreviewModalProps {
  document: {
    id: string
    name: string
    type: string
    size: string
    uploadedBy: string
    uploadedAt: string
    status: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export function DocumentPreviewModal({ document, isOpen, onClose }: DocumentPreviewModalProps) {
  if (!document) return null

  const handleDownload = () => {
    // Mock download functionality
    const content = `Document: ${document.name}
Type: ${document.type}
Size: ${document.size}
Uploaded by: ${document.uploadedBy}
Uploaded: ${formatDate(document.uploadedAt)}
Status: ${document.status}

This is a mock download. In a real application, this would download the actual PDF file.

Document Content:
- Project Proposal Details
- Technical Specifications  
- Budget Breakdown
- Implementation Timeline
- Environmental Impact Assessment
- Community Consultation Report
- Right of Way Documentation

All documents have been reviewed and approved by the evaluator.`

    const element = document.createElement('a')
    const file = new Blob([content], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `${document.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    // Clean up the object URL
    setTimeout(() => URL.revokeObjectURL(element.href), 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Preview: {document.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Header */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <File className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{document.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{document.type}</Badge>
                    <Badge variant={document.status === 'Approved' ? 'default' : 'secondary'}>
                      {document.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-700">Uploaded by</div>
                  <div className="text-gray-600">{document.uploadedBy}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-700">Upload Date</div>
                  <div className="text-gray-600">{formatDate(document.uploadedAt)}</div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700">File Size</div>
                <div className="text-gray-600">{document.size}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Document ID</div>
                <div className="text-gray-600 font-mono text-xs">{document.id}</div>
              </div>
            </div>
          </div>

          {/* Document Content Preview */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Document Content</h4>
            
            {/* Mock PDF Content */}
            <div className="border rounded-lg overflow-hidden">
              {/* PDF Header */}
              <div className="bg-red-600 text-white text-center py-3 px-4">
                <div className="font-bold text-base">GOVERNMENT OF THE PHILIPPINES</div>
                <div className="text-sm">DEPARTMENT OF AGRICULTURE</div>
                <div className="text-sm mt-1">PROJECT EVALUATION SYSTEM</div>
              </div>
              
              {/* Document Title */}
              <div className="text-center py-4 px-6 border-b border-gray-200">
                <div className="font-bold text-lg text-gray-900">{document.name}</div>
                <div className="text-sm text-gray-600 mt-2">Project Proposal Document</div>
                <div className="text-sm text-gray-500 mt-2">
                  Document ID: {document.id} | Uploaded: {formatDate(document.uploadedAt)}
                </div>
              </div>
              
              {/* PDF Content Preview */}
              <div className="p-6 text-sm leading-relaxed">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-bold text-base text-blue-800 border-b border-blue-200 pb-2 mb-3">I. EXECUTIVE SUMMARY</div>
                    <div className="text-gray-700 leading-relaxed">
                      This document presents a comprehensive proposal for the development of rural infrastructure projects under the Department of Agriculture's program. The project aims to improve agricultural productivity and rural development through strategic infrastructure investments.
                      <br/><br/>
                      The proposed project includes detailed technical specifications, implementation timeline, budget allocation, and environmental impact assessment to ensure sustainable development and community benefit.
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-base text-green-800 border-b border-green-200 pb-2 mb-3">II. PROJECT OVERVIEW</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-gray-800 mb-2">Project Title:</div>
                        <div className="bg-white p-3 rounded border text-sm font-medium">{document.name}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 mb-2">Project Type:</div>
                        <div className="bg-white p-3 rounded border text-sm">
                          {document.name.includes('Water') ? 'Water Supply System' : 
                           document.name.includes('Road') ? 'Road Construction' : 
                           document.name.includes('Machinery') ? 'Agricultural Machinery' : 'Infrastructure Development'}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 mb-2">Total Budget:</div>
                        <div className="bg-white p-3 rounded border text-sm font-mono">
                          ₱{document.name.includes('Machinery') ? '25,000,000' : '15,000,000'}.00
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 mb-2">Project Duration:</div>
                        <div className="bg-white p-3 rounded border text-sm">12 months</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2">III. TECHNICAL SPECIFICATIONS</div>
                  <div className="pl-4 space-y-2 text-sm">
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
                  
                  <div className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2">IV. IMPLEMENTATION TIMELINE</div>
                  <div className="pl-4 text-sm space-y-2">
                    <div>• Phase 1: Planning & Preparation (Months 1-2)</div>
                    <div>• Phase 2: Construction (Months 3-8)</div>
                    <div>• Phase 3: Testing & Commissioning (Months 9-10)</div>
                    <div>• Phase 4: Turnover (Months 11-12)</div>
                  </div>
                  
                  <div className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2">V. BUDGET BREAKDOWN</div>
                  <div className="pl-4 text-sm space-y-2">
                    <div>• Materials & Equipment: 60% of total budget</div>
                    <div>• Labor & Services: 26% of total budget</div>
                    <div>• Administrative: 8% of total budget</div>
                    <div>• Contingency: 4% of total budget</div>
                    <div>• Monitoring & Evaluation: 2% of total budget</div>
                  </div>
                </div>
              </div>
              
              {/* PDF Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center">
                <div className="text-sm text-gray-500">
                  Page 1 of 8 • Generated: {formatDate(document.uploadedAt)}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  File Size: {document.size} • Status: {document.status}
                </div>
              </div>
            </div>
          </div>

          {/* Approval Status */}
          {document.status === 'Approved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">Document Approved</h4>
                  <p className="text-sm text-green-700">
                    This document has been reviewed and approved by the evaluator. No further action required.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
