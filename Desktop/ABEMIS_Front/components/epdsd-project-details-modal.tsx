'use client'

import { useState, useCallback, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge } from '@/components/data-table'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Calendar, MapPin, DollarSign, User, Clock, FileText, CheckCircle, XCircle, MessageSquare, Download, Eye } from 'lucide-react'

// Mock data for EPDSD proposal stage documents
const mockProposalDocuments = [
  {
    id: 'DOC-PROP-001',
    name: 'Letter of Intent',
    type: 'PDF',
    size: '1.2 MB',
    uploadedBy: 'Project Proponent',
    uploadedAt: '2024-01-15T10:30:00Z',
    status: 'For Review',
    evaluation: null,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-002',
    name: 'Validation Report',
    type: 'PDF',
    size: '2.8 MB',
    uploadedBy: 'Project Proponent',
    uploadedAt: '2024-01-16T14:20:00Z',
    status: 'For Review',
    evaluation: null,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-003',
    name: 'FS/EFA (Feasibility Study/Environmental Impact Assessment)',
    type: 'PDF',
    size: '4.5 MB',
    uploadedBy: 'Project Proponent',
    uploadedAt: '2024-01-17T09:15:00Z',
    status: 'For Review',
    evaluation: null,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-004',
    name: 'DED (Detailed Engineering Design)',
    type: 'PDF',
    size: '6.2 MB',
    uploadedBy: 'Project Proponent',
    uploadedAt: '2024-01-18T11:45:00Z',
    status: 'For Review',
    evaluation: null,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-005',
    name: 'POW (Program of Work)',
    type: 'PDF',
    size: '2.1 MB',
    uploadedBy: 'Project Proponent',
    uploadedAt: '2024-01-19T16:30:00Z',
    status: 'For Review',
    evaluation: null,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-006',
    name: 'Right of Way Documents',
    type: 'PDF',
    size: '3.4 MB',
    uploadedBy: 'Project Proponent',
    uploadedAt: '2024-01-20T08:45:00Z',
    status: 'For Review',
    evaluation: null,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-007',
    name: 'Other Documents',
    type: 'PDF',
    size: '2.3 MB',
    uploadedBy: 'Project Proponent',
    uploadedAt: '2024-01-21T10:15:00Z',
    status: 'For Review',
    evaluation: null,
    comments: '',
    required: false
  }
]


interface EPDSDProjectDetailsModalProps {
  project: unknown | null
  isOpen: boolean
  onClose: () => void
}

export function EPDSDProjectDetailsModal({ project, isOpen, onClose }: EPDSDProjectDetailsModalProps) {
  // Initialize document evaluations per project
  const [documentEvaluations, setDocumentEvaluations] = useState<Record<string, Record<string, {evaluation: 'satisfied' | 'not_satisfied' | null, comments: string}>>>({})
  const [generalComments, setGeneralComments] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showRejectMessage, setShowRejectMessage] = useState(false)
  
  // Clear success message when project changes or modal closes
  useEffect(() => {
    if (!isOpen || !project) {
      setShowSuccessMessage(false)
    }
  }, [isOpen, project])
  
  const handleDocumentEvaluationChange = useCallback((docId: string, field: 'evaluation' | 'comments', value: 'satisfied' | null | string) => {
    if (!project) return
    
    const projectId = (project as { id: string }).id
    setDocumentEvaluations(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
      [docId]: {
          ...prev[projectId]?.[docId],
        [field]: value
        }
      }
    }))
  }, [project])

  const handleSubmitEvaluation = useCallback(() => {
    if (!project) return
    
    const projectId = (project as { id: string }).id
    const projectEvaluations = documentEvaluations[projectId] || {}
    
    const requiredDocuments = mockProposalDocuments.filter(doc => doc.required)
    const allDocumentsEvaluated = requiredDocuments.every(doc => 
      projectEvaluations[doc.id]?.evaluation !== null && projectEvaluations[doc.id]?.evaluation !== undefined
    )
    
    if (allDocumentsEvaluated) {
      const satisfiedDocuments = requiredDocuments.filter(doc => 
        projectEvaluations[doc.id]?.evaluation === 'satisfied'
      )
      
      if (satisfiedDocuments.length === requiredDocuments.length) {
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
          onClose()
        }, 5000)
      } else {
        alert('All required documents must be marked as satisfied before submitting.')
      }
    } else {
      alert('Please evaluate all required documents before submitting.')
    }
  }, [documentEvaluations, project, onClose])

  const handleMoveToNextStage = useCallback(() => {
    if (!project) return
    
    const projectId = (project as { id: string }).id
    const projectEvaluations = documentEvaluations[projectId] || {}
    
    const requiredDocuments = mockProposalDocuments.filter(doc => doc.required)
    const allDocumentsEvaluated = requiredDocuments.every(doc => 
      projectEvaluations[doc.id]?.evaluation !== null && projectEvaluations[doc.id]?.evaluation !== undefined
    )
    
    if (allDocumentsEvaluated) {
      const satisfiedDocuments = requiredDocuments.filter(doc => 
        projectEvaluations[doc.id]?.evaluation === 'satisfied'
      )
      
      if (satisfiedDocuments.length === requiredDocuments.length) {
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
          onClose()
        }, 5000)
      } else {
        // Show which documents are not satisfied
        const notSatisfiedDocs = requiredDocuments.filter(doc => 
          projectEvaluations[doc.id]?.evaluation !== 'satisfied'
        )
        alert(`The following required documents must be marked as satisfied before proceeding:\n\n${notSatisfiedDocs.map(doc => `• ${doc.name}`).join('\n')}`)
      }
    } else {
      // Show which documents are not evaluated
      const unevaluatedDocs = requiredDocuments.filter(doc => 
        !projectEvaluations[doc.id]?.evaluation
      )
      alert(`Please evaluate the following documents before proceeding:\n\n${unevaluatedDocs.map(doc => `• ${doc.name}`).join('\n')}`)
    }
  }, [documentEvaluations, project, onClose])

  const handleRejectProject = useCallback(() => {
    setShowRejectMessage(true)
    setTimeout(() => {
      setShowRejectMessage(false)
      onClose()
    }, 2000)
  }, [onClose])

  // Helper function to get document validation status
  const getDocumentValidationStatus = useCallback((docId: string) => {
    if (!project) return 'unevaluated'
    
    const projectId = (project as { id: string }).id
    const projectEvaluations = documentEvaluations[projectId] || {}
    const evaluation = projectEvaluations[docId]?.evaluation
    
    if (!evaluation) return 'unevaluated'
    return evaluation
  }, [documentEvaluations, project])



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
  
  if (!project) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {(project as { title: string }).title}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {(project as { province: string }).province}, {(project as { region: string }).region}
          </div>
        </DialogHeader>

        <div className="w-full flex-1 flex flex-col overflow-hidden">
          <div className="space-y-6 flex-1 overflow-y-auto overflow-x-hidden">
            {/* Document Evaluation Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Document Evaluation</h3>
                <div className="text-sm text-muted-foreground">
                  {(() => {
                    if (!project) return '0/0 documents satisfied'
                    const projectId = (project as { id: string }).id
                    const projectEvaluations = documentEvaluations[projectId] || {}
                    const requiredDocuments = mockProposalDocuments.filter(doc => doc.required)
                    const satisfiedCount = requiredDocuments.filter(doc => 
                      projectEvaluations[doc.id]?.evaluation === 'satisfied'
                    ).length
                    return `${satisfiedCount}/${requiredDocuments.length} documents satisfied`
                  })()}
                </div>
              </div>
              
              {/* Sticky Progress Bar */}
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-base font-medium text-gray-700">Progress:</span>
                    <span className="text-base text-gray-600">
                      {(() => {
                        if (!project) return '0/0'
                        const projectId = (project as { id: string }).id
                        const projectEvaluations = documentEvaluations[projectId] || {}
                        const requiredDocuments = mockProposalDocuments.filter(doc => doc.required)
                        const satisfiedCount = requiredDocuments.filter(doc => 
                          projectEvaluations[doc.id]?.evaluation === 'satisfied'
                        ).length
                        return `${satisfiedCount}/${requiredDocuments.length}`
                      })()}
                    </span>
                    <span className="font-bold text-lg text-blue-600">
                      {(() => {
                        if (!project) return '0%'
                        const projectId = (project as { id: string }).id
                        const projectEvaluations = documentEvaluations[projectId] || {}
                        const requiredDocuments = mockProposalDocuments.filter(doc => doc.required)
                        const satisfiedCount = requiredDocuments.filter(doc => 
                          projectEvaluations[doc.id]?.evaluation === 'satisfied'
                        ).length
                        const percentage = requiredDocuments.length > 0 ? Math.round((satisfiedCount / requiredDocuments.length) * 100) : 0
                        return `${percentage}%`
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
                        style={{
                          width: (() => {
                            if (!project) return '0%'
                            const projectId = (project as { id: string }).id
                            const projectEvaluations = documentEvaluations[projectId] || {}
                            const requiredDocuments = mockProposalDocuments.filter(doc => doc.required)
                            const satisfiedCount = requiredDocuments.filter(doc => 
                              projectEvaluations[doc.id]?.evaluation === 'satisfied'
                            ).length
                            const percentage = requiredDocuments.length > 0 ? (satisfiedCount / requiredDocuments.length) * 100 : 0
                            return `${percentage}%`
                          })()
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {mockProposalDocuments.map((doc) => {
                  const projectId = (project as { id: string }).id
                  const projectEvaluations = documentEvaluations[projectId] || {}
                  const evaluation = projectEvaluations[doc.id]?.evaluation || null
                  const isSatisfied = evaluation === 'satisfied'
                  
                  return (
                    <Card key={doc.id} className={`p-6 border rounded-lg transition-all duration-200 ${
                      isSatisfied ? 'border-green-500 bg-green-50/50 shadow-green-100' : ''
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`p-2 rounded-md transition-colors duration-200 ${
                            isSatisfied ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h4 className="text-lg font-semibold text-foreground">{doc.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy} • {formatDate(doc.uploadedAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="relative group"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                            
                            {/* PDF Preview Screen - Full Overlay */}
                            <div className="fixed inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999]"
                                 style={{
                                   zIndex: 9999
                                 }}>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-300 rounded-lg shadow-2xl w-[800px] h-[600px] overflow-hidden relative">
                                {/* Close Button */}
                                <button className="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-900">
                                  ×
                                </button>
                                
                                {/* PDF Header */}
                                <div className="bg-red-600 text-white text-center py-3 px-4">
                                  <div className="font-bold text-base">GOVERNMENT OF THE PHILIPPINES</div>
                                  <div className="text-sm">DEPARTMENT OF AGRICULTURE</div>
                                  <div className="text-sm mt-1">EPDSD PROJECT EVALUATION SYSTEM</div>
                                </div>
                                
                                {/* Document Title */}
                                <div className="text-center py-4 px-6 border-b border-gray-200">
                                  <div className="font-bold text-lg text-gray-900">{doc.name}</div>
                                  <div className="text-sm text-gray-600 mt-2">Project Proposal Document</div>
                                  <div className="text-sm text-gray-500 mt-2">
                                    Document ID: {doc.id} | Uploaded: {formatDate(doc.uploadedAt)}
                                  </div>
                                </div>
                                
                                {/* PDF Content Preview */}
                                <div className="p-6 text-sm leading-relaxed overflow-y-auto h-96">
                                  <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                      <div className="font-bold text-base text-blue-800 border-b border-blue-200 pb-2 mb-3">I. EXECUTIVE SUMMARY</div>
                                      <div className="text-gray-700 leading-relaxed">
                                        This document presents a comprehensive proposal for the development of rural infrastructure projects under the Department of Agriculture's EPDSD program. The project aims to improve agricultural productivity and rural development through strategic infrastructure investments.
                                        <br/><br/>
                                        The proposed project includes detailed technical specifications, implementation timeline, budget allocation, and environmental impact assessment to ensure sustainable development and community benefit.
                                      </div>
                                    </div>
                                    
                                    <div className="bg-green-50 p-4 rounded-lg">
                                      <div className="font-bold text-base text-green-800 border-b border-green-200 pb-2 mb-3">II. PROJECT OVERVIEW</div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <div className="font-semibold text-gray-800 mb-2">Project Title:</div>
                                          <div className="bg-white p-3 rounded border text-sm font-medium">{doc.name}</div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800 mb-2">Project Type:</div>
                                          <div className="bg-white p-3 rounded border text-sm">
                                            {doc.name.includes('Water') ? 'Water Supply System' : 
                                             doc.name.includes('Road') ? 'Road Construction' : 
                                             doc.name.includes('Machinery') ? 'Agricultural Machinery' : 'Infrastructure Development'}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800 mb-2">Total Budget:</div>
                                          <div className="bg-white p-3 rounded border text-sm font-mono">
                                            ₱{doc.name.includes('Machinery') ? '25,000,000' : '15,000,000'}.00
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
                                      {doc.name.includes('Water') ? (
                                        <>
                                          <div>• Water supply system with 50,000L storage capacity</div>
                                          <div>• Distribution network: 5km pipeline system</div>
                                          <div>• Pump station with backup power supply</div>
                                          <div>• Water quality testing and treatment facility</div>
                                          <div>• Community tap stands at strategic locations</div>
                                        </>
                                      ) : doc.name.includes('Road') ? (
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
                                    Page 1 of 8 • Generated: {formatDate(doc.uploadedAt)}
                                  </div>
                                  <div className="text-sm text-gray-400 mt-1">
                                    File Size: {doc.size} • Status: {doc.status}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                            
                            {/* Hover Preview Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-green-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                              <div className="font-semibold">Download {doc.name}</div>
                              <div className="text-xs text-green-300 mt-1">
                                Click to download {doc.type} file
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-green-900"></div>
                            </div>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mt-6 pt-4 border-t border-border">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`satisfied-${doc.id}`}
                            checked={isSatisfied}
                            onCheckedChange={(checked) => 
                              handleDocumentEvaluationChange(doc.id, 'evaluation', checked ? 'satisfied' : null)
                            }
                            className={`data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white`}
                          />
                          <label htmlFor={`satisfied-${doc.id}`} className={`text-sm font-medium cursor-pointer ${
                            isSatisfied ? 'text-green-700' : ''
                          }`}>
                            I am satisfied with this document
                          </label>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor={`comments-${doc.id}`} className="text-sm font-semibold text-foreground">
                            Comments/Remarks:
                          </label>
                          <input
                            id={`comments-${doc.id}`}
                            type="text"
                            className="w-full p-3 border border-input rounded-md text-sm bg-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                            placeholder="Add your comments or remarks about this document..."
                            value={projectEvaluations[doc.id]?.comments || ''}
                            onChange={(e) => 
                              handleDocumentEvaluationChange(doc.id, 'comments', e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
              
              {/* General Comments */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">General Comments</h4>
                <textarea
                  className="w-full p-3 border rounded-md"
                  rows={4}
                  placeholder="Add general comments about the project proposal..."
                  value={generalComments}
                  onChange={(e) => setGeneralComments(e.target.value)}
                />
              </Card>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectProject}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Project
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleSubmitEvaluation}
              variant="outline"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Remarks
            </Button>
            <Button
              onClick={handleMoveToNextStage}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Move to Next Stage
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Success Message */}
      {showSuccessMessage && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          onClick={() => {
            setShowSuccessMessage(false)
            onClose()
          }}
        >
          <div 
            className="bg-white rounded-xl p-8 max-w-lg mx-4 text-center shadow-2xl border border-green-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full animate-pulse">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Project Proposal Approved</h3>
            <p className="text-gray-600 mb-2 text-lg">
              <strong>{(project as { title: string }).title}</strong>
            </p>
            <p className="text-gray-600 mb-6">
              All documents have been evaluated and satisfied. The project has been successfully moved to the next stage.
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              <span className="text-sm font-medium">Processing...</span>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              This dialog will close automatically in 5 seconds or click outside to close
            </div>
          </div>
        </div>
      )}

      {/* Reject Message */}
      {showRejectMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Rejected</h3>
            <p className="text-gray-600 mb-4">
              The project has been rejected and will be returned to the proponent for revision.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            </div>
          </div>
        </div>
      )}

      </Dialog>
    </>
  )
}
