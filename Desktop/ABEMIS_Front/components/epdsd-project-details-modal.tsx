'use client'

import { useState, useCallback, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { StatusBadge } from '@/components/data-table'
import { ProjectStepper } from '@/components/project-stepper'
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
    isSatisfied: false,
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
    isSatisfied: false,
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
    isSatisfied: false,
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
    isSatisfied: false,
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
    isSatisfied: false,
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
    isSatisfied: false,
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
    isSatisfied: false,
    comments: '',
    required: true
  }
]

// Mock timeline data for EPDSD evaluation
const mockTimelineData = [
  {
    id: 'TIMELINE-001',
    title: 'Project Submitted',
    description: 'Project proposal submitted by proponent',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Project Proponent',
    status: 'completed',
    type: 'submission'
  },
  {
    id: 'TIMELINE-002',
    title: 'Letter of Intent Submitted',
    description: 'Letter of Intent document uploaded by proponent',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Project Proponent',
    status: 'completed',
    type: 'document_upload'
  },
  {
    id: 'TIMELINE-003',
    title: 'Validation Report Submitted',
    description: 'Validation Report document uploaded by proponent',
    timestamp: '2024-01-16T14:20:00Z',
    user: 'Project Proponent',
    status: 'completed',
    type: 'document_upload'
  },
  {
    id: 'TIMELINE-004',
    title: 'FS/EFA Documents Submitted',
    description: 'Feasibility Study and Environmental Impact Assessment documents uploaded',
    timestamp: '2024-01-17T09:15:00Z',
    user: 'Project Proponent',
    status: 'completed',
    type: 'document_upload'
  },
  {
    id: 'TIMELINE-005',
    title: 'DED Documents Submitted',
    description: 'Detailed Engineering Design documents uploaded',
    timestamp: '2024-01-18T11:45:00Z',
    user: 'Project Proponent',
    status: 'completed',
    type: 'document_upload'
  },
  {
    id: 'TIMELINE-006',
    title: 'POW Documents Submitted',
    description: 'Program of Work documents uploaded',
    timestamp: '2024-01-19T16:30:00Z',
    user: 'Project Proponent',
    status: 'completed',
    type: 'document_upload'
  },
  {
    id: 'TIMELINE-007',
    title: 'Right of Way Documents Submitted',
    description: 'Right of Way documents uploaded',
    timestamp: '2024-01-20T08:45:00Z',
    user: 'Project Proponent',
    status: 'completed',
    type: 'document_upload'
  },
  {
    id: 'TIMELINE-008',
    title: 'Other Documents Submitted',
    description: 'Additional supporting documents uploaded',
    timestamp: '2024-01-21T10:15:00Z',
    user: 'Project Proponent',
    status: 'completed',
    type: 'document_upload'
  },
  {
    id: 'TIMELINE-009',
    title: 'Under EPDSD Review',
    description: 'All required documents under evaluation by EPDSD',
    timestamp: '2024-01-22T09:00:00Z',
    user: 'EPDSD Reviewer',
    status: 'in_progress',
    type: 'review'
  }
]

interface EPDSDProjectDetailsModalProps {
  project: unknown | null
  isOpen: boolean
  onClose: () => void
}

export function EPDSDProjectDetailsModal({ project, isOpen, onClose }: EPDSDProjectDetailsModalProps) {
  // Initialize document evaluations per project
  const [documentEvaluations, setDocumentEvaluations] = useState<Record<string, Record<string, {isSatisfied: boolean, comments: string}>>>({})
  const [generalComments, setGeneralComments] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showRejectMessage, setShowRejectMessage] = useState(false)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<any>(null)
  
  const handleDocumentEvaluationChange = useCallback((docId: string, field: 'isSatisfied' | 'comments', value: boolean | string) => {
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
    
    const allDocumentsSatisfied = mockProposalDocuments.every(doc => 
      projectEvaluations[doc.id]?.isSatisfied === true
    )
    
    if (allDocumentsSatisfied) {
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
        onClose()
      }, 2000)
    } else {
      alert('Please evaluate all documents before submitting.')
    }
  }, [documentEvaluations, project, onClose])

  const handleMoveToNextStage = useCallback(() => {
    if (!project) return
    
    const projectId = (project as { id: string }).id
    const projectEvaluations = documentEvaluations[projectId] || {}
    
    const allDocumentsSatisfied = mockProposalDocuments.every(doc => 
      projectEvaluations[doc.id]?.isSatisfied === true
    )
    
    if (allDocumentsSatisfied) {
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
        onClose()
      }, 2000)
    } else {
      alert('All documents must be satisfied before moving to next stage.')
    }
  }, [documentEvaluations, project, onClose])

  const handleRejectProject = useCallback(() => {
    setShowRejectMessage(true)
    setTimeout(() => {
      setShowRejectMessage(false)
      onClose()
    }, 2000)
  }, [onClose])

  const handleViewDocument = useCallback((doc: any) => {
    setSelectedDocument(doc)
    setShowDocumentViewer(true)
  }, [])

  const handleCloseDocumentViewer = useCallback(() => {
    setShowDocumentViewer(false)
    setSelectedDocument(null)
    // Reset any cached content
    setTimeout(() => {
      setShowDocumentViewer(false)
      setSelectedDocument(null)
    }, 100)
  }, [])

  // Handle ESC key to close document viewer
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDocumentViewer) {
        handleCloseDocumentViewer()
      }
    }

    if (showDocumentViewer) {
      document.addEventListener('keydown', handleEscKey)
      return () => document.removeEventListener('keydown', handleEscKey)
    }
  }, [showDocumentViewer, handleCloseDocumentViewer])

  const handleMouseEnterView = useCallback((doc: any) => {
    setPreviewDocument(doc)
    setShowDocumentPreview(true)
  }, [])

  const handleMouseLeaveView = useCallback(() => {
    setShowDocumentPreview(false)
    setPreviewDocument(null)
  }, [])

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
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {project.title}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {project.province}, {project.region}
          </div>
        </DialogHeader>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Document Evaluation</TabsTrigger>
            <TabsTrigger value="timeline">Project Timeline</TabsTrigger>
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-6">
            {/* Document Evaluation Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Required Documents Evaluation</h3>
              <div className="space-y-4">
                {mockProposalDocuments.map((doc) => {
                  const projectId = (project as { id: string }).id
                  const projectEvaluations = documentEvaluations[projectId] || {}
                  const isSatisfied = projectEvaluations[doc.id]?.isSatisfied || false
                  return (
                    <Card key={doc.id} className={`p-4 transition-all duration-200 hover:shadow-md ${
                      isSatisfied ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className={`h-5 w-5 ${isSatisfied ? 'text-green-600' : 'text-blue-600'}`} />
                          <div>
                            <h4 className="font-medium">{doc.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{doc.type} • {doc.size}</span>
                              <span>Uploaded by {doc.uploadedBy}</span>
                              <span>{formatDate(doc.uploadedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDocument(doc)}
                            onMouseEnter={() => handleMouseEnterView(doc)}
                            onMouseLeave={handleMouseLeaveView}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-green-50 hover:border-green-300"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`satisfied-${doc.id}`}
                            checked={isSatisfied}
                            onCheckedChange={(checked) => 
                              handleDocumentEvaluationChange(doc.id, 'isSatisfied', checked as boolean)
                            }
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                          <label htmlFor={`satisfied-${doc.id}`} className={`text-sm font-medium ${
                            isSatisfied ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            I am satisfied with this document
                          </label>
                          {isSatisfied && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor={`comments-${doc.id}`} className="text-sm font-medium">
                            Comments/Remarks:
                          </label>
                          <textarea
                            id={`comments-${doc.id}`}
                            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
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
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <h3 className="text-lg font-semibold">Project Timeline</h3>
            <Accordion type="single" collapsible className="w-full">
              {mockTimelineData.map((item, index) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' : 
                        item.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                      <div className="text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(item.timestamp)} • {item.user}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-6 pb-2">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="overview" className="space-y-4">
            <h3 className="text-lg font-semibold">Project Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Project Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Type:</strong> {project.type}</div>
                  <div><strong>Province:</strong> {project.province}</div>
                  <div><strong>Budget:</strong> {formatCurrency(project.budget)}</div>
                  <div><strong>Status:</strong> <StatusBadge status={project.status} /></div>
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-3">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Start Date:</strong> {formatDate(project.startDate || '')}</div>
                  <div><strong>End Date:</strong> {formatDate(project.endDate || '')}</div>
                  <div><strong>Updated:</strong> {formatDate(project.updatedAt)}</div>
                </div>
              </Card>
            </div>
            
            <Card className="p-4">
              <h4 className="font-medium mb-2">Project Description</h4>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </Card>

            {/* Project Progress Stepper */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectStepper 
                  currentStatus={project.status} 
                  onStepClick={(step) => console.log('Step clicked:', step)}
                  projectType={project.type}
                  project={project}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600 mb-4">
              Project has been successfully processed and moved to the next stage.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Message */}
      {showRejectMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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

      {/* Document Preview on Hover */}
      {showDocumentPreview && previewDocument && (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-md z-[60]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">{previewDocument.name}</h4>
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xs text-gray-600 space-y-1 mb-3">
            <div>Type: {previewDocument.type}</div>
            <div>Size: {previewDocument.size}</div>
            <div>Uploaded: {formatDate(previewDocument.uploadedAt)}</div>
          </div>
          
          {/* Quick Preview Content */}
          <div className="border border-gray-300 rounded bg-white shadow-inner max-h-80 overflow-y-auto">
            <div className="p-3 text-xs">
              {/* PDF Header */}
              <div className="bg-red-600 text-white text-center py-1 mb-2 rounded-t">
                <div className="font-bold">GOVERNMENT OF THE PHILIPPINES</div>
                <div className="text-xs">DEPARTMENT OF AGRICULTURE</div>
              </div>
              
              {/* Document Title */}
              <div className="text-center mb-3">
                <div className="font-bold text-sm mb-1">{previewDocument.name}</div>
                <div className="text-xs text-gray-600">Project Proposal Document</div>
              </div>
              
              {/* Quick Preview */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold">Quick Preview:</div>
                <div className="pl-2">
                  <div>• Document Type: {previewDocument.name}</div>
                  <div>• Status: {previewDocument.status}</div>
                  <div>• Uploaded by: {previewDocument.uploadedBy}</div>
                  <div>• File size: {previewDocument.size}</div>
                </div>
                
                <div className="font-semibold">Click "View" for full document</div>
                <div className="text-xs text-gray-500 text-center mt-2">
                  Hover over "View" button to see this preview
                </div>
              </div>
              
              {/* PDF Footer */}
              <div className="mt-4 pt-2 border-t border-gray-300 text-center">
                <div className="text-xs text-gray-500">
                  Quick Preview • Document ID: {previewDocument.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Document Viewer Modal - Inside main dialog */}
        {showDocumentViewer && selectedDocument && (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[150] p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseDocumentViewer()
          }
        }}
      >
        <div 
          key={selectedDocument.id} 
          className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedDocument.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>Type: {selectedDocument.type}</span>
                  <span>Size: {selectedDocument.size}</span>
                  <span>Uploaded: {formatDate(selectedDocument.uploadedAt)}</span>
                  <span>By: {selectedDocument.uploadedBy}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('X button clicked!')
                  handleCloseDocumentViewer()
                }}
                className="hover:bg-gray-200 relative z-10 cursor-pointer"
                style={{ pointerEvents: 'auto', zIndex: 9999 }}
                type="button"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Document Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Full PDF Content */}
              <div key={`content-${selectedDocument.id}`} className="border border-gray-300 rounded bg-white shadow-inner max-h-full overflow-y-auto">
                <div className="p-8 text-sm leading-relaxed">
                  {/* PDF Header */}
                  <div className="bg-red-600 text-white text-center py-3 mb-6 rounded-t">
                    <div className="font-bold text-xl">GOVERNMENT OF THE PHILIPPINES</div>
                    <div className="text-base">DEPARTMENT OF AGRICULTURE</div>
                    <div className="text-sm mt-1">EPDSD PROJECT EVALUATION SYSTEM</div>
                  </div>
                  
                  {/* Document Title */}
                  <div className="text-center mb-6">
                    <div className="font-bold text-xl mb-2">{selectedDocument.name}</div>
                    <div className="text-sm text-gray-600">Project Proposal Document</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Document ID: {selectedDocument.id} | Uploaded: {formatDate(selectedDocument.uploadedAt)}
                    </div>
                  </div>
                  
                  {/* Full Document Content */}
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-bold text-lg text-blue-800 border-b border-blue-200 pb-2 mb-3">I. EXECUTIVE SUMMARY</div>
                      <div className="space-y-3 text-gray-700">
                        <p>This document presents a comprehensive proposal for the development of rural infrastructure projects under the Department of Agriculture's EPDSD program. The project aims to improve agricultural productivity and rural development through strategic infrastructure investments.</p>
                        <p>The proposed project includes detailed technical specifications, implementation timeline, budget allocation, and environmental impact assessment to ensure sustainable development and community benefit.</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-bold text-lg text-green-800 border-b border-green-200 pb-2 mb-3">II. PROJECT OVERVIEW</div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-800">Project Title:</div>
                          <div className="text-gray-700 bg-white p-2 rounded border">{selectedDocument.name}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-800">Project Type:</div>
                          <div className="text-gray-700 bg-white p-2 rounded border">{selectedDocument.name.includes('Water') ? 'Water Supply System' : selectedDocument.name.includes('Road') ? 'Road Construction' : 'Infrastructure Development'}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-800">Total Budget:</div>
                          <div className="text-gray-700 bg-white p-2 rounded border font-mono">₱{selectedDocument.name.includes('Machinery') ? '25,000,000' : '15,000,000'}.00</div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-800">Duration:</div>
                          <div className="text-gray-700 bg-white p-2 rounded border">12 months</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="font-semibold text-base border-b pb-1">III. TECHNICAL SPECIFICATIONS</div>
                    <div className="pl-4 space-y-2">
                      {selectedDocument.name.includes('Water') ? (
                        <>
                          <div>• Water supply system with 50,000L storage capacity</div>
                          <div>• Distribution network: 5km pipeline system</div>
                          <div>• Pump station with backup power supply</div>
                          <div>• Water quality testing and treatment facility</div>
                          <div>• Community tap stands at strategic locations</div>
                          <div>• Pressure regulation and control systems</div>
                        </>
                      ) : selectedDocument.name.includes('Road') ? (
                        <>
                          <div>• Farm-to-market road: 3km concrete pavement</div>
                          <div>• Road width: 6 meters with 1-meter shoulders</div>
                          <div>• Drainage system with culverts and ditches</div>
                          <div>• Road signage and safety barriers</div>
                          <div>• Maintenance access points</div>
                          <div>• Environmental protection measures</div>
                        </>
                      ) : (
                        <>
                          <div>• Modern agricultural machinery and equipment</div>
                          <div>• Irrigation system with automated controls</div>
                          <div>• Storage facilities for agricultural products</div>
                          <div>• Processing equipment and tools</div>
                          <div>• Maintenance and repair facilities</div>
                          <div>• Training center for farmers</div>
                        </>
                      )}
                    </div>
                    
                    <div className="font-semibold text-base border-b pb-1">IV. IMPLEMENTATION TIMELINE</div>
                    <div className="pl-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium mb-2">Phase 1: Planning & Preparation (Months 1-2)</div>
                          <div className="text-sm space-y-1">
                            <div>• Site survey and assessment</div>
                            <div>• Permit acquisition</div>
                            <div>• Contractor selection</div>
                            <div>• Material procurement</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-2">Phase 2: Construction (Months 3-8)</div>
                          <div className="text-sm space-y-1">
                            <div>• Site preparation</div>
                            <div>• Foundation work</div>
                            <div>• Main construction</div>
                            <div>• Quality control</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-2">Phase 3: Testing & Commissioning (Months 9-10)</div>
                          <div className="text-sm space-y-1">
                            <div>• System testing</div>
                            <div>• Performance evaluation</div>
                            <div>• Safety inspections</div>
                            <div>• Final adjustments</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-2">Phase 4: Turnover (Months 11-12)</div>
                          <div className="text-sm space-y-1">
                            <div>• Documentation completion</div>
                            <div>• Training of operators</div>
                            <div>• Project turnover</div>
                            <div>• Post-implementation monitoring</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="font-semibold text-base border-b pb-1">V. BUDGET BREAKDOWN</div>
                    <div className="pl-4">
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Materials & Equipment</div>
                            <div>₱{selectedDocument.name.includes('Machinery') ? '15,000,000' : '8,500,000'} (60%)</div>
                          </div>
                          <div>
                            <div className="font-medium">Labor & Services</div>
                            <div>₱{selectedDocument.name.includes('Machinery') ? '6,500,000' : '4,200,000'} (26%)</div>
                          </div>
                          <div>
                            <div className="font-medium">Administrative</div>
                            <div>₱{selectedDocument.name.includes('Machinery') ? '2,000,000' : '1,800,000'} (8%)</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Contingency</div>
                            <div>₱{selectedDocument.name.includes('Machinery') ? '1,000,000' : '500,000'} (4%)</div>
                          </div>
                          <div>
                            <div className="font-medium">Monitoring & Evaluation</div>
                            <div>₱{selectedDocument.name.includes('Machinery') ? '500,000' : '1,000,000'} (2%)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="font-semibold text-base border-b pb-1">VI. ENVIRONMENTAL IMPACT ASSESSMENT</div>
                    <div className="pl-4 space-y-2">
                      <div>• Minimal environmental impact with proper mitigation measures</div>
                      <div>• Erosion control and sediment management plan</div>
                      <div>• Waste management and disposal procedures</div>
                      <div>• Community consultation and stakeholder engagement</div>
                      <div>• Biodiversity protection measures</div>
                      <div>• Water quality monitoring and protection</div>
                    </div>
                    
                    <div className="font-semibold text-base border-b pb-1">VII. SUSTAINABILITY AND MAINTENANCE</div>
                    <div className="pl-4 space-y-2">
                      <div>• Community-based maintenance program</div>
                      <div>• Training for local operators and technicians</div>
                      <div>• Spare parts inventory and supply chain</div>
                      <div>• Regular inspection and monitoring schedule</div>
                      <div>• Revenue generation for sustainability</div>
                    </div>
                  </div>
                  
                  {/* PDF Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-300 text-center">
                    <div className="text-xs text-gray-500">
                      Page 1 of 8 • Generated: {formatDate(selectedDocument.uploadedAt)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Document ID: {selectedDocument.id} • File Size: {selectedDocument.size}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Uploaded by: {selectedDocument.uploadedBy} • Status: {selectedDocument.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
              <div className="text-sm text-gray-600">
                Document Status: <span className="font-medium text-green-600">{selectedDocument.status}</span>
              </div>
              <div className="flex space-x-3 relative z-10">
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Close button clicked!')
                    handleCloseDocumentViewer()
                  }}
                  className="relative z-10 cursor-pointer"
                  style={{ pointerEvents: 'auto', zIndex: 9999 }}
                  type="button"
                >
                  Close
                </Button>
                <Button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Download button clicked!')
                    handleDownloadDocument(selectedDocument)
                  }}
                  className="relative z-10 cursor-pointer"
                  style={{ pointerEvents: 'auto', zIndex: 9999 }}
                  type="button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
        )}
      </Dialog>
    </>
  )
}
