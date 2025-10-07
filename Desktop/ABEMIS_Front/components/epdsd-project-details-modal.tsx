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
            {project.title}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {project.province}, {project.region}
          </div>
        </DialogHeader>

        <Tabs defaultValue="documents" className="w-full flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Document Evaluation</TabsTrigger>
            <TabsTrigger value="timeline">Project Timeline</TabsTrigger>
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-6 flex-1 overflow-y-auto overflow-x-hidden">
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
                            className="hover:bg-blue-50 hover:border-blue-300 relative group"
                            title={`Preview: ${doc.name}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
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
                            className="hover:bg-green-50 hover:border-green-300 relative group"
                            title={`Download: ${doc.name}`}
                          >
                            <Download className="h-4 w-4 mr-1" />
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
                            rows={2}
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
          
          <TabsContent value="timeline" className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden">
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
          
          <TabsContent value="overview" className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden">
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

      </Dialog>
    </>
  )
}
