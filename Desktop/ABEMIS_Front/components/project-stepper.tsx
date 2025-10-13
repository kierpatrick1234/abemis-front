'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, FileText, ShoppingCart, Wrench, CheckCircle, Package, Upload, XCircle, Eye, Download, MessageSquare, Calendar, Clock, Plus, FileCheck, ArrowRight, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DocumentPreviewModal } from '@/components/document-preview-modal'
import { Project } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/contexts/auth-context'

interface ProjectStepperProps {
  currentStatus: string
  onStepClick: (step: string) => void
  projectType?: string
  project?: Project
}

const steps = [
  {
    key: 'proposal',
    label: 'Proposal',
    icon: FileText,
    description: 'Project proposal submitted'
  },
  {
    key: 'procurement',
    label: 'Procurement',
    icon: ShoppingCart,
    description: 'Procurement process'
  },
  {
    key: 'implementation',
    label: 'Implementation',
    icon: Wrench,
    description: 'Project implementation'
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle,
    description: 'Project completed'
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: Package,
    description: 'Inventory management'
  }
]

export function ProjectStepper({ currentStatus, onStepClick, projectType, project }: ProjectStepperProps) {
  // Map currentStatus to the correct step key
  const statusToStepMap: { [key: string]: string } = {
    'Proposal': 'proposal',
    'Procurement': 'procurement', 
    'Implementation': 'implementation',
    'Completed': 'completed'
  }
  
  const mappedCurrentStatus = statusToStepMap[currentStatus] || 'proposal'
  const [activeStep, setActiveStep] = useState(mappedCurrentStatus)
  const [currentStepStatus, setCurrentStepStatus] = useState(currentStatus || 'Proposal')

  const getStepIndex = (step: string) => {
    const mappedStep = statusToStepMap[step] || step
    const index = steps.findIndex(s => s.key === mappedStep)
    return index >= 0 ? index : 0
  }

  const currentStepIndex = getStepIndex(currentStepStatus)
  

  const isStepAccessible = (stepIndex: number) => {
    // Can click on steps up to and including the current status
    // Additionally, can always click on the current stage even after clicking previous stages
    // If current status is "completed" (index 3), can click on steps 0,1,2,3
    // If current status is "implementation" (index 2), can click on steps 0,1,2
    // If current status is "procurement" (index 1), can click on steps 0,1
    // If current status is "proposal" (index 0), can click on step 0
    return stepIndex <= currentStepIndex
  }

  const handleStepClick = (step: string, stepIndex: number) => {
    if (isStepAccessible(stepIndex)) {
      setActiveStep(step)
      // Only update the current step status when clicking on the current stage or forward
      // Don't update when clicking on previous stages to maintain accessibility
      const stepToStatusMap: { [key: string]: string } = {
        'proposal': 'Proposal',
        'procurement': 'Procurement',
        'implementation': 'Implementation',
        'completed': 'Completed'
      }
      // Only update currentStepStatus if clicking on current stage or forward
      if (stepIndex >= currentStepIndex) {
        setCurrentStepStatus(stepToStatusMap[step] || step)
      }
      onStepClick(step)
    }
  }

  // Handle stage progression from procurement to implementation
  const handleStageProgression = (nextStep: string) => {
    const stepIndex = steps.findIndex(s => s.key === nextStep)
    if (stepIndex >= 0) {
      setActiveStep(nextStep)
      // Update the current step status to reflect the progression
      const stepToStatusMap: { [key: string]: string } = {
        'proposal': 'Proposal',
        'procurement': 'Procurement',
        'implementation': 'Implementation',
        'completed': 'Completed'
      }
      setCurrentStepStatus(stepToStatusMap[nextStep] || nextStep)
      onStepClick(nextStep)
    }
  }

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed'
    if (stepIndex === currentStepIndex) return 'current'
    return 'upcoming'
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-8 px-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const stepStatus = getStepStatus(index)
          const isAccessible = isStepAccessible(index)
          const isActive = activeStep === step.key
          

          return (
            <div 
              key={step.key} 
              onClick={() => isAccessible && handleStepClick(step.key, index)}
              className={cn(
                "flex flex-col items-center flex-1 min-w-0 p-2 rounded-lg transition-all duration-200 text-center",
                {
                  "hover:bg-muted/50": isAccessible,
                  "cursor-pointer": isAccessible,
                  "cursor-not-allowed": !isAccessible
                }
              )}
            >
              <div className="flex items-center w-full justify-center">
                {/* Step Circle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStepClick(step.key, index)
                  }}
                  disabled={!isAccessible}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 z-10 relative flex-shrink-0",
                    {
                      "bg-green-500 text-white border-green-500": stepStatus === 'current',
                      "bg-black text-white border-black": stepStatus === 'completed',
                      "bg-muted text-muted-foreground border-muted": stepStatus === 'upcoming',
                      "cursor-pointer hover:scale-105 hover:bg-primary/10": isAccessible,
                      "cursor-not-allowed opacity-50": !isAccessible,
                      "ring-2 ring-green-500 ring-offset-2": isActive
                    }
                  )}
                >
                  {stepStatus === 'completed' ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-2",
                    {
                      "bg-black": stepStatus === 'completed',
                      "bg-green-500": stepStatus === 'current',
                      "bg-muted": stepStatus === 'upcoming'
                    }
                  )} />
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center w-full px-1">
                <p className={cn(
                  "text-sm font-medium text-center min-h-[20px] flex items-center justify-center",
                  {
                    "text-green-600": stepStatus === 'current',
                    "text-black": stepStatus === 'completed',
                    "text-muted-foreground": stepStatus === 'upcoming',
                    "hover:text-green-600": isAccessible && stepStatus === 'upcoming'
                  }
                )}>
                  {step.label}
                </p>
                <p className={cn(
                  "text-xs mt-1 leading-tight text-center min-h-[32px] flex items-center justify-center",
                  {
                    "text-green-600": stepStatus === 'current',
                    "text-black": stepStatus === 'completed',
                    "text-muted-foreground": stepStatus === 'upcoming'
                  }
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {steps.find(s => s.key === activeStep)?.icon && (
              React.createElement(steps.find(s => s.key === activeStep)!.icon, { className: "h-5 w-5" })
            )}
            {steps.find(s => s.key === activeStep)?.label} Details
            {activeStep === mappedCurrentStatus && (
              <Badge variant="secondary" className="ml-2">Current</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeStep === 'proposal' && (
            <ProposalStepContent projectType={projectType} currentStatus={currentStatus} project={project} />
          )}
          {activeStep === 'procurement' && (
            <ProcurementStepContent currentStatus={currentStatus} project={project} onStepClick={onStepClick} onStageProgression={handleStageProgression} />
          )}
          {activeStep === 'implementation' && (
            <ImplementationStepContent />
          )}
          {activeStep === 'completed' && (
            <CompletedStepContent />
          )}
          {activeStep === 'inventory' && (
            <InventoryStepContent />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Step Content Components
function ProposalStepContent({ projectType, currentStatus, project }: { projectType?: string, currentStatus?: string, project?: Project }) {
  const evaluator: string = projectType === 'FMR' ? 'SEPD' : (project?.evaluator ? String(project.evaluator) : 'EPDSD')
  const isBeyondProposal = currentStatus && ['Procurement', 'Implementation', 'Completed'].includes(currentStatus)
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, any>>({})
  const [previewDocument, setPreviewDocument] = useState<any>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  
  // Required documents for EPDSD evaluation
  const requiredDocuments = [
    {
      id: 'DOC-001',
      name: 'Letter of Intent',
      type: 'PDF',
      required: true
    },
    {
      id: 'DOC-002', 
      name: 'Validation Report',
      type: 'PDF',
      required: true
    },
    {
      id: 'DOC-003',
      name: 'FS/EFA (Feasibility Study/Environmental Impact Assessment)',
      type: 'PDF',
      required: true
    },
    {
      id: 'DOC-004',
      name: 'DED (Detailed Engineering Design)',
      type: 'PDF',
      required: true
    },
    {
      id: 'DOC-005',
      name: 'POW (Program of Work)',
      type: 'PDF',
      required: true
    },
    {
      id: 'DOC-006',
      name: 'Right of Way Documents',
      type: 'PDF',
      required: true
    },
    {
      id: 'DOC-007',
      name: 'Other Documents',
      type: 'PDF',
      required: false
    }
  ]

  // Mock function to get document status
  const getDocumentStatus = (docId: string) => {
    // If project is beyond proposal stage, show all documents as approved (green)
    if (isBeyondProposal) {
      return {
        uploaded: true,
        epdsdApproved: true,
        comments: ''
      }
    }
    
    // If project is in Proposal stage, show random mix of green and red
    // Use docId to create consistent "random" results
    const hash = docId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    const isApproved = Math.abs(hash) % 2 === 0 // 50/50 chance based on docId
    
    return {
      uploaded: true,
      epdsdApproved: isApproved,
      comments: isApproved ? '' : 'Please revise this document according to requirements.'
    }
  }

  // Mock function to get uploaded document info
  const getUploadedDocument = (docId: string) => {
    const status = getDocumentStatus(docId)
    if (!status.uploaded) return null
    
    return {
      id: docId,
      name: requiredDocuments.find(doc => doc.id === docId)?.name || 'Document',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'RAED User',
      uploadedAt: new Date().toISOString(),
      status: status.epdsdApproved ? 'Approved' : 'Under Review'
    }
  }

  const handleFileUpload = (docId: string, file: File) => {
    // Mock upload functionality
    console.log('Uploading file for document:', docId, file.name)
    
    // Simulate successful upload
    const uploadedDoc = {
      id: docId,
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedBy: 'RAED User',
      uploadedAt: new Date().toISOString(),
      status: 'Under Review'
    }
    
    setUploadedDocuments(prev => ({
      ...prev,
      [docId]: uploadedDoc
    }))
    
    alert(`Document uploaded successfully: ${file.name}`)
  }
  
  return (
    <div className="space-y-6">
      {/* Proposal Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-muted/30 rounded-lg">
        <div>
          <h4 className="font-medium mb-3">Evaluator</h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{evaluator}</Badge>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Status</h4>
          <Badge variant={isBeyondProposal ? "default" : "secondary"}>
            {isBeyondProposal ? "All Documents Reviewed" : "Under Review"}
          </Badge>
        </div>
      </div>

      {/* Required Documents Section */}
      <div>
        <h4 className="font-medium mb-4">Required Documents</h4>
        <Accordion type="single" collapsible className="w-full">
          {requiredDocuments.map((doc) => {
            const status = getDocumentStatus(doc.id)
            const uploadedDoc = getUploadedDocument(doc.id)
            
            return (
              <AccordionItem key={doc.id} value={doc.id} className="border rounded-lg mb-2 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        status.uploaded 
                          ? status.epdsdApproved 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {status.uploaded ? (
                          status.epdsdApproved ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {status.uploaded 
                            ? status.epdsdApproved 
                              ? 'Approved by EPDSD' 
                              : 'Needs revision'
                            : 'Not uploaded'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        status.uploaded 
                          ? status.epdsdApproved 
                            ? 'default' 
                            : 'destructive'
                          : 'secondary'
                      } className={
                        status.uploaded && status.epdsdApproved 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : ''
                      }>
                        {status.uploaded 
                          ? status.epdsdApproved 
                            ? 'Approved' 
                            : 'Needs Revision'
                          : 'Pending'
                        }
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {/* Uploaded Document Info */}
                    {uploadedDoc && (
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Uploaded Document</h4>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setPreviewDocument(uploadedDoc)
                                setShowPreviewModal(true)
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Document
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Mock download functionality
                                const content = `Document: ${uploadedDoc.name}
Type: ${uploadedDoc.type}
Size: ${uploadedDoc.size}
Uploaded by: ${uploadedDoc.uploadedBy}
Uploaded: ${formatDate(uploadedDoc.uploadedAt)}
Status: ${uploadedDoc.status}

This is a mock download. In a real application, this would download the actual PDF file.`

                                const element = document.createElement('a')
                                const file = new Blob([content], {type: 'text/plain'})
                                element.href = URL.createObjectURL(file)
                                element.download = `${uploadedDoc.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
                                document.body.appendChild(element)
                                element.click()
                                document.body.removeChild(element)
                                
                                // Clean up the object URL
                                setTimeout(() => URL.revokeObjectURL(element.href), 100)
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">File:</span> {uploadedDoc.name}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span> {uploadedDoc.size}
                          </div>
                          <div>
                            <span className="font-medium">Uploaded by:</span> {uploadedDoc.uploadedBy}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {formatDate(uploadedDoc.uploadedAt)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* EPDSD Comments */}
                    {status.comments && (
                      <div className={`border rounded-lg p-4 ${
                        !isBeyondProposal && !status.epdsdApproved
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className={`flex items-center gap-2 mb-2 ${
                          !isBeyondProposal && !status.epdsdApproved
                            ? 'text-red-800' 
                            : 'text-yellow-800'
                        }`}>
                          <MessageSquare className={`h-4 w-4 ${
                            !isBeyondProposal && !status.epdsdApproved
                              ? 'text-red-600' 
                              : 'text-yellow-600'
                          }`} />
                          <h4 className="font-medium text-sm">EPDSD Comments</h4>
                        </div>
                        <p className={`text-sm ${
                          !isBeyondProposal && !status.epdsdApproved
                            ? 'text-red-700' 
                            : 'text-yellow-700'
                        }`}>{status.comments}</p>
                      </div>
                    )}

                    {/* Upload Section - Only show for Proposal status and documents that are not approved */}
                    {!isBeyondProposal && !status.epdsdApproved && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          id={`upload-${doc.id}`}
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(doc.id, file)
                            }
                          }}
                          className="hidden"
                        />
                        <label htmlFor={`upload-${doc.id}`} className="cursor-pointer">
                          <div className="space-y-2">
                            <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                            <div className="text-xs text-gray-600">
                              {uploadedDoc ? 'Replace document' : 'Upload document'}
                            </div>
                            <div className="text-xs text-gray-500">
                              PDF, DOC, DOCX up to 10MB
                            </div>
                            <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7" asChild>
                              <span>Choose File</span>
                            </Button>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* Approved Document Section - Show for Proposal status when document is approved */}
                    {!isBeyondProposal && status.epdsdApproved && uploadedDoc && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-green-800">Document Approved</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-green-700">File:</span> 
                            <span className="text-green-600 ml-1">{uploadedDoc.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Size:</span> 
                            <span className="text-green-600 ml-1">{uploadedDoc.size}</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Uploaded by:</span> 
                            <span className="text-green-600 ml-1">{uploadedDoc.uploadedBy}</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Date:</span> 
                            <span className="text-green-600 ml-1">{formatDate(uploadedDoc.uploadedAt)}</span>
                          </div>
                        </div>
                        <div className="bg-green-100 border border-green-300 rounded p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Document Approved</span>
                          </div>
                          <p className="text-xs text-green-700">
                            This document has been reviewed and approved by the evaluator. No further action required.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Document Viewing Section - Show for non-Proposal status */}
                    {isBeyondProposal && uploadedDoc && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-green-800">Final Approved Document</h4>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setPreviewDocument(uploadedDoc)
                                setShowPreviewModal(true)
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Document
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Mock download functionality
                                const content = `Document: ${uploadedDoc.name}
Type: ${uploadedDoc.type}
Size: ${uploadedDoc.size}
Uploaded by: ${uploadedDoc.uploadedBy}
Uploaded: ${formatDate(uploadedDoc.uploadedAt)}
Status: ${uploadedDoc.status}

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
                                element.download = `${uploadedDoc.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
                                document.body.appendChild(element)
                                element.click()
                                document.body.removeChild(element)
                                
                                // Clean up the object URL
                                setTimeout(() => URL.revokeObjectURL(element.href), 100)
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-green-700">File:</span> 
                            <span className="text-green-600 ml-1">{uploadedDoc.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Size:</span> 
                            <span className="text-green-600 ml-1">{uploadedDoc.size}</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Uploaded by:</span> 
                            <span className="text-green-600 ml-1">{uploadedDoc.uploadedBy}</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Date:</span> 
                            <span className="text-green-600 ml-1">{formatDate(uploadedDoc.uploadedAt)}</span>
                          </div>
                        </div>
                        <div className="bg-green-100 border border-green-300 rounded p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Document Approved</span>
                          </div>
                          <p className="text-xs text-green-700">
                            This document has been reviewed and approved by the evaluator. No further action required.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>

      {isBeyondProposal && (
        <div>
          <h4 className="font-medium mb-2">Forwarding Logs</h4>
          <div className="space-y-2">
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Proposal Forwarded to Procurement</span>
              </div>
              <p className="text-xs text-green-700">
                {evaluator} forwarded the proposal to procurement department
              </p>
              <p className="text-xs text-green-600 mt-1">
                Timestamp: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={previewDocument}
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false)
          setPreviewDocument(null)
        }}
      />
    </div>
  )
}

function ProcurementStepContent({ currentStatus, project, onStepClick, onStageProgression }: { currentStatus?: string, project?: Project, onStepClick?: (step: string) => void, onStageProgression?: (step: string) => void }) {
  const isBeyondProcurement = currentStatus && ['Implementation', 'Completed'].includes(currentStatus)
  const [budgetYear, setBudgetYear] = useState<string>(() => (project?.budgetYear || '') as string)
  const [bidOpeningDate, setBidOpeningDate] = useState<string>(() => (project?.bidOpeningDate || '') as string)
  const [noticeOfAwardDate, setNoticeOfAwardDate] = useState<string>(() => (project?.noticeOfAwardDate || '') as string)
  const [noticeToProceedDate, setNoticeToProceedDate] = useState<string>(() => (project?.noticeToProceedDate || '') as string)
  const [uploadingDocuments, setUploadingDocuments] = useState<Set<string>>(new Set())
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({
    bidOpening: null,
    noticeOfAward: null,
    noticeToProceed: null
  })
  const [validationErrors, setValidationErrors] = useState<{[key: string]: boolean}>({})
  const [remarks, setRemarks] = useState<string>('')
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)
  const [isProceeding, setIsProceeding] = useState<boolean>(false)

  const handleFileUpload = (documentType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadingDocuments(prev => new Set(prev).add(documentType))
      setUploadedFiles(prev => ({ ...prev, [documentType]: file }))
      
      // Clear validation error for this document type
      const errorKey = `${documentType}Doc`
      if (validationErrors[errorKey]) {
        setValidationErrors(prev => ({ ...prev, [errorKey]: false }))
      }
      
      // Simulate upload process
      setTimeout(() => {
        setUploadingDocuments(prev => {
          const newSet = new Set(prev)
          newSet.delete(documentType)
          return newSet
        })
      }, 2000)
    }
  }

  const budgetYears = ['2026', '2025', '2024', '2023']
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Procurement Method</h4>
          <Badge variant="outline">Public Bidding</Badge>
        </div>
        <div>
          <h4 className="font-medium mb-2">Status</h4>
          <Badge variant={isBeyondProcurement ? "default" : "secondary"}>
            {isBeyondProcurement ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </div>

      {/* Procurement Fields for RAED */}
      <div className="space-y-4">
        <h4 className="font-medium text-lg">Procurement Information</h4>
        
        {/* Budget Year Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Budget Year</label>
            <select
              value={budgetYear || ''}
              onChange={(e) => {
                setBudgetYear(e.target.value)
                if (validationErrors.budgetYear) {
                  setValidationErrors(prev => ({ ...prev, budgetYear: false }))
                }
              }}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.budgetYear ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select Budget Year</option>
              {budgetYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bid Opening Conducted</label>
            <input
              type="date"
              value={bidOpeningDate || ''}
              onChange={(e) => {
                setBidOpeningDate(e.target.value)
                if (validationErrors.bidOpeningDate) {
                  setValidationErrors(prev => ({ ...prev, bidOpeningDate: false }))
                }
              }}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.bidOpeningDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Issuance of Notice of Awards</label>
            <input
              type="date"
              value={noticeOfAwardDate || ''}
              onChange={(e) => {
                setNoticeOfAwardDate(e.target.value)
                if (validationErrors.noticeOfAwardDate) {
                  setValidationErrors(prev => ({ ...prev, noticeOfAwardDate: false }))
                }
              }}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.noticeOfAwardDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notice to Proceed Issue</label>
            <input
              type="date"
              value={noticeToProceedDate || ''}
              onChange={(e) => {
                setNoticeToProceedDate(e.target.value)
                if (validationErrors.noticeToProceedDate) {
                  setValidationErrors(prev => ({ ...prev, noticeToProceedDate: false }))
                }
              }}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.noticeToProceedDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-lg">Procurement Documents</h4>
        
        <div className="space-y-4">
          {/* Bid Opening Document */}
          <div className={`flex items-center justify-between p-4 border rounded-lg ${
            validationErrors.bidOpeningDoc ? 'border-red-500 bg-red-50' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Bid Opening Document</p>
                <p className="text-xs text-muted-foreground">Upload document for bid opening conducted</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploadedFiles.bidOpening && (
                <span className="text-sm text-green-600">✓ Uploaded</span>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload('bidOpening', e)}
                className="hidden"
                id="bid-opening-upload"
                disabled={uploadingDocuments.has('bidOpening')}
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => document.getElementById('bid-opening-upload')?.click()}
                disabled={uploadingDocuments.has('bidOpening')}
              >
                {uploadingDocuments.has('bidOpening') ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Notice of Award Document */}
          <div className={`flex items-center justify-between p-4 border rounded-lg ${
            validationErrors.noticeOfAwardDoc ? 'border-red-500 bg-red-50' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Notice of Award Document</p>
                <p className="text-xs text-muted-foreground">Upload document for notice of award issuance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploadedFiles.noticeOfAward && (
                <span className="text-sm text-green-600">✓ Uploaded</span>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload('noticeOfAward', e)}
                className="hidden"
                id="notice-of-award-upload"
                disabled={uploadingDocuments.has('noticeOfAward')}
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => document.getElementById('notice-of-award-upload')?.click()}
                disabled={uploadingDocuments.has('noticeOfAward')}
              >
                {uploadingDocuments.has('noticeOfAward') ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Notice to Proceed Document */}
          <div className={`flex items-center justify-between p-4 border rounded-lg ${
            validationErrors.noticeToProceedDoc ? 'border-red-500 bg-red-50' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Notice to Proceed Document</p>
                <p className="text-xs text-muted-foreground">Upload document for notice to proceed issuance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploadedFiles.noticeToProceed && (
                <span className="text-sm text-green-600">✓ Uploaded</span>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload('noticeToProceed', e)}
                className="hidden"
                id="notice-to-proceed-upload"
                disabled={uploadingDocuments.has('noticeToProceed')}
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => document.getElementById('notice-to-proceed-upload')?.click()}
                disabled={uploadingDocuments.has('noticeToProceed')}
              >
                {uploadingDocuments.has('noticeToProceed') ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {isBeyondProcurement && (
        <>
          <div>
            <h4 className="font-medium mb-2">Contractor Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contractor Name</p>
                <p className="font-medium">ABC Construction Corp.</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bidded Amount</p>
                <p className="font-medium">₱15,250,000.00</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Procurement Milestones</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Effectivity of the GAA (Budget Year)</p>
                  <p className="text-xs text-muted-foreground">Completed on Jan 1, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Bid Opening Conducted</p>
                  <p className="text-xs text-muted-foreground">Completed on Jan 15, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Issuance of Notice of Award Approved</p>
                  <p className="text-xs text-muted-foreground">Completed on Jan 20, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Notice to Proceed Issued</p>
                  <p className="text-xs text-muted-foreground">Completed on Jan 25, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Remarks Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-lg">Remarks</h4>
        <div>
          <label className="block text-sm font-medium mb-2">Additional Notes</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any additional notes or remarks about the procurement process..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
        </div>
      </div>
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-800">Procurement Completed Successfully!</h4>
              <p className="text-sm text-green-700 mt-1">All procurement requirements have been fulfilled. Proceeding to Implementation stage...</p>
            </div>
          </div>
        </div>
      )}

      {/* Save and Proceed Buttons */}
      {!isBeyondProcurement && (
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => {
            // Save current data
            console.log('Saving procurement data:', {
              budgetYear,
              bidOpeningDate,
              noticeOfAwardDate,
              noticeToProceedDate,
              uploadedFiles,
              remarks
            })
            // In a real app, this would save to the backend
            alert('Procurement data saved successfully!')
          }}>
            Save
          </Button>
          <Button 
            variant="default" 
            onClick={() => {
              // Validate all fields are filled
              const isBudgetYearFilled = budgetYear !== ''
              const isBidOpeningFilled = bidOpeningDate !== ''
              const isNoticeOfAwardFilled = noticeOfAwardDate !== ''
              const isNoticeToProceedFilled = noticeToProceedDate !== ''
              const areDocumentsUploaded = uploadedFiles.bidOpening && uploadedFiles.noticeOfAward && uploadedFiles.noticeToProceed

              const missingFields = []
              if (!isBudgetYearFilled) missingFields.push('Budget Year')
              if (!isBidOpeningFilled) missingFields.push('Bid Opening Date')
              if (!isNoticeOfAwardFilled) missingFields.push('Notice of Award Date')
              if (!isNoticeToProceedFilled) missingFields.push('Notice to Proceed Date')
              if (!uploadedFiles.bidOpening) missingFields.push('Bid Opening Document')
              if (!uploadedFiles.noticeOfAward) missingFields.push('Notice of Award Document')
              if (!uploadedFiles.noticeToProceed) missingFields.push('Notice to Proceed Document')

              if (missingFields.length > 0) {
                // Set validation errors for missing fields
                const errors: {[key: string]: boolean} = {}
                if (!isBudgetYearFilled) errors.budgetYear = true
                if (!isBidOpeningFilled) errors.bidOpeningDate = true
                if (!isNoticeOfAwardFilled) errors.noticeOfAwardDate = true
                if (!isNoticeToProceedFilled) errors.noticeToProceedDate = true
                if (!uploadedFiles.bidOpening) errors.bidOpeningDoc = true
                if (!uploadedFiles.noticeOfAward) errors.noticeOfAwardDoc = true
                if (!uploadedFiles.noticeToProceed) errors.noticeToProceedDoc = true
                
                setValidationErrors(errors)
                alert(`Please complete the following fields before proceeding:\n\n${missingFields.join('\n')}`)
                return
              }

              // Clear validation errors if all fields are filled
              setValidationErrors({})

              // Show success message and proceed to next stage
              setIsProceeding(true)
              setShowSuccessMessage(true)
              
              // Hide success message after 2 seconds and proceed to implementation
              setTimeout(() => {
                setShowSuccessMessage(false)
                setIsProceeding(false)
                
                // Update the project status and trigger stage progression
                // In a real app, this would update the backend and project status
                if (typeof onStageProgression === 'function') {
                  onStageProgression('implementation')
                } else if (typeof onStepClick === 'function') {
                  onStepClick('implementation')
                }
              }, 2000)
            }}
            disabled={!budgetYear || !bidOpeningDate || !noticeOfAwardDate || !noticeToProceedDate || !uploadedFiles.bidOpening || !uploadedFiles.noticeOfAward || !uploadedFiles.noticeToProceed || isProceeding}
          >
            {isProceeding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              'Proceed to Implementation'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

function ImplementationStepContent() {
  const { user } = useAuth()
  const isRAED = user?.role === 'RAED'
  
  // State for implementation details
  const [contractEffectivity, setContractEffectivity] = useState('')
  const [contractExpiry, setContractExpiry] = useState('')
  const [actualStartDate, setActualStartDate] = useState('')
  const [targetCompletionDate, setTargetCompletionDate] = useState('') // RAED must input this first
  const [initialTargetCompletionDate, setInitialTargetCompletionDate] = useState('') // Set when RAED first inputs target date
  const [showExtensionModal, setShowExtensionModal] = useState(false)
  const [newTargetDate, setNewTargetDate] = useState('')
  const [extensionReason, setExtensionReason] = useState('')
  const [extensionHistory, setExtensionHistory] = useState<Array<{
    id: string
    previousDate: string
    newDate: string
    reason: string
    dateRequested: string
  }>>([])
  
  // State for validation errors
  const [contractValidationErrors, setContractValidationErrors] = useState<{[key: string]: boolean}>({})
  
  // State for save functionality
  const [isContractSaved, setIsContractSaved] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isInitialSave, setIsInitialSave] = useState(false)
  
  // State for accomplishments and progress
  const [accomplishments, setAccomplishments] = useState<Array<{
    id: string
    date: string
    description: string
    progress: number
    documents: File[]
  }>>([])
  const [showAccomplishmentModal, setShowAccomplishmentModal] = useState(false)
  const [editingAccomplishment, setEditingAccomplishment] = useState<string | null>(null)
  const [newAccomplishment, setNewAccomplishment] = useState({
    date: '',
    description: '',
    progress: 0
  })
  
  // State for accomplishment validation
  const [accomplishmentValidationErrors, setAccomplishmentValidationErrors] = useState<{[key: string]: string}>({})
  
  // State for toast notifications
  const [toastMessage, setToastMessage] = useState<{title: string, description: string, variant: 'default' | 'success' | 'error'} | null>(null)
  
  // Toast notification function
  const showToast = (title: string, description: string, variant: 'default' | 'success' | 'error' = 'default') => {
    setToastMessage({ title, description, variant })
    // Auto-hide toast after 3 seconds
    setTimeout(() => setToastMessage(null), 3000)
  }
  
  // Save contract and timeline information
  const handleSaveContractInfo = () => {
    // Validate required fields before saving
    const validationErrors: {[key: string]: boolean} = {}
    const missingFields = []
    
    if (!contractEffectivity) {
      validationErrors.contractEffectivity = true
      missingFields.push('Contract Effectivity')
    }
    if (!contractExpiry) {
      validationErrors.contractExpiry = true
      missingFields.push('Contract Expiry')
    }
    if (!actualStartDate) {
      validationErrors.actualStartDate = true
      missingFields.push('Actual Start Date')
    }
    if (!targetCompletionDate) {
      validationErrors.targetCompletionDate = true
      missingFields.push('Target Completion Date')
    }
    
    if (missingFields.length > 0) {
      setContractValidationErrors(validationErrors)
      alert(`Please complete the following fields before saving:\n\n${missingFields.join('\n')}`)
      return
    }
    
    // Clear validation errors if all fields are filled
    setContractValidationErrors({})
    
    // Check if this is initial save or saving changes
    const wasInitialSave = !isContractSaved
    
    // Save the contract information
    setIsContractSaved(true)
    setIsEditMode(false) // Exit edit mode after saving
    setIsInitialSave(wasInitialSave) // Track if this was initial save
    setShowSaveSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSaveSuccess(false)
    }, 3000)
    
    // In a real app, this would save to the backend
    console.log('Contract and timeline information saved:', {
      contractEffectivity,
      contractExpiry,
      actualStartDate,
      targetCompletionDate,
      initialTargetCompletionDate
    })
    
    // Different toast messages based on whether it's initial save or saving changes
    if (wasInitialSave) {
      showToast("Contract Information Saved", "Contract and timeline information has been saved successfully. Click Edit to modify.", "success")
    } else {
      showToast("Changes Saved", "Contract and timeline information has been updated successfully.", "success")
    }
  }
  
  // Toggle edit mode
  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode)
    if (!isEditMode) {
      showToast("Edit Mode", "Contract information is now editable. Make your changes and save.", "default")
    } else {
      showToast("View Mode", "Contract information is now in view mode.", "default")
    }
  }
  
  // Calculate overall project progress based on accomplishments
  const calculateOverallProgress = () => {
    if (accomplishments.length === 0) {
      return 0 // Start at 0% when no accomplishments in implementation stage
    }
    
    // Sum up all accomplishment progress percentages
    const totalProgress = accomplishments.reduce((sum, acc) => sum + acc.progress, 0)
    
    // Cap at 100% maximum
    return Math.min(totalProgress, 100)
  }
  
  const currentProgress = calculateOverallProgress()
  const isProgressComplete = currentProgress >= 100
  
  // Calculate slippage when any accomplishment is beyond the current target completion date
  const calculateSlippage = () => {
    // Must have target completion date and accomplishments to check for slippage
    if (!targetCompletionDate || accomplishments.length === 0) {
      return null
    }
    
    const currentTargetDate = new Date(targetCompletionDate)
    const slippagePercentage = 100 - currentProgress
    
    // Check if any accomplishment is beyond the current target completion date
    const overdueAccomplishments = accomplishments.filter(acc => {
      const accDate = new Date(acc.date)
      return accDate > currentTargetDate
    })
    
    if (overdueAccomplishments.length > 0) {
      // Find the furthest overdue accomplishment
      const furthestOverdue = overdueAccomplishments.reduce((furthest, acc) => {
        const accDate = new Date(acc.date)
        const furthestDate = new Date(furthest.date)
        return accDate > furthestDate ? acc : furthest
      })
      
      const furthestOverdueDate = new Date(furthestOverdue.date)
      const daysOverdue = Math.ceil((furthestOverdueDate.getTime() - currentTargetDate.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        percentage: slippagePercentage,
        daysOverdue: daysOverdue,
        isOverdue: true,
        reason: overdueAccomplishments.length === 1 
          ? 'Accomplishment date is beyond current target completion date'
          : `${overdueAccomplishments.length} accomplishments are beyond current target completion date`,
        overdueCount: overdueAccomplishments.length,
        hasExtension: extensionHistory.length > 0,
        isProgressComplete: isProgressComplete
      }
    }
    
    return null
  }
  
  const slippageInfo = calculateSlippage()
  
  const handleApplyExtension = () => {
    if (newTargetDate && extensionReason) {
      // Create extension record
      const extensionRecord = {
        id: Date.now().toString(),
        previousDate: targetCompletionDate,
        newDate: newTargetDate,
        reason: extensionReason,
        dateRequested: new Date().toISOString()
      }
      
      // Add to extension history
      setExtensionHistory(prev => [...prev, extensionRecord])
      
      // Update target completion date
      setTargetCompletionDate(newTargetDate)
      
      // Close modal and reset form
      setShowExtensionModal(false)
      setNewTargetDate('')
      setExtensionReason('')
      
      // Show success toast
      showToast("Extension Applied", `Target completion date extended to ${new Date(newTargetDate).toLocaleDateString()}.`, "success")
    }
  }
  
  const validateAccomplishmentDate = (date: string) => {
    if (!actualStartDate) {
      return null // No validation if actual start date not set
    }
    
    const accomplishmentDate = new Date(date)
    const startDate = new Date(actualStartDate)
    
    // Only prevent dates before the actual start date
    if (accomplishmentDate < startDate) {
      return 'Date is before the actual start date'
    }
    
    return null
  }
  
  const handleAddAccomplishment = () => {
    // Clear previous validation errors
    setAccomplishmentValidationErrors({})
    
    const validationErrors: {[key: string]: string} = {}
    
    // Validate required fields
    if (!newAccomplishment.date) {
      validationErrors.date = 'Date is required'
    } else {
      // Validate date range
      const dateValidationError = validateAccomplishmentDate(newAccomplishment.date)
      if (dateValidationError) {
        validationErrors.date = dateValidationError
      }
    }
    
    if (!newAccomplishment.description.trim()) {
      validationErrors.description = 'Description is required'
    }
    
    if (newAccomplishment.progress < 0 || newAccomplishment.progress > 100) {
      validationErrors.progress = 'Progress must be between 0 and 100'
    }
    
    // If there are validation errors, show them and return
    if (Object.keys(validationErrors).length > 0) {
      setAccomplishmentValidationErrors(validationErrors)
      return
    }
    
    if (editingAccomplishment) {
      // Update existing accomplishment
      setAccomplishments(prev => prev.map(acc => 
        acc.id === editingAccomplishment 
          ? { ...acc, ...newAccomplishment }
          : acc
      ))
      setEditingAccomplishment(null)
      // Calculate new total progress after update
      const updatedAccomplishments = accomplishments.map(acc => 
        acc.id === editingAccomplishment 
          ? { ...acc, ...newAccomplishment }
          : acc
      )
      const newTotalProgress = Math.min(updatedAccomplishments.reduce((sum, acc) => sum + acc.progress, 0), 100)
      showToast("Accomplishment Updated", `Project progress updated to ${newTotalProgress}%.`, "success")
    } else {
      // Add new accomplishment
      const accomplishment = {
        id: Date.now().toString(),
        ...newAccomplishment,
        documents: []
      }
      setAccomplishments(prev => [...prev, accomplishment])
      // Calculate new total progress after adding
      const newTotalProgress = Math.min([...accomplishments, accomplishment].reduce((sum, acc) => sum + acc.progress, 0), 100)
      showToast("Accomplishment Added", `Project progress updated to ${newTotalProgress}%.`, "success")
    }
    
    setShowAccomplishmentModal(false)
    setNewAccomplishment({ date: '', description: '', progress: 0 })
  }
  
  const handleEditAccomplishment = (accomplishmentId: string) => {
    const accomplishment = accomplishments.find(acc => acc.id === accomplishmentId)
    if (accomplishment) {
      setNewAccomplishment({
        date: accomplishment.date,
        description: accomplishment.description,
        progress: accomplishment.progress
      })
      setEditingAccomplishment(accomplishmentId)
      setShowAccomplishmentModal(true)
    }
  }
  
  const handleDeleteAccomplishment = (accomplishmentId: string) => {
    if (confirm('Are you sure you want to delete this accomplishment?')) {
      const accomplishmentToDelete = accomplishments.find(acc => acc.id === accomplishmentId)
      setAccomplishments(prev => prev.filter(acc => acc.id !== accomplishmentId))
      
      // Calculate new total progress after deletion
      const remainingAccomplishments = accomplishments.filter(acc => acc.id !== accomplishmentId)
      const newTotalProgress = remainingAccomplishments.length > 0 
        ? Math.min(remainingAccomplishments.reduce((sum, acc) => sum + acc.progress, 0), 100)
        : 0
      
      showToast("Accomplishment Deleted", `Project progress updated to ${newTotalProgress}%.`, "success")
    }
  }
  
  const handleMoveToNextStage = () => {
    // Validate contract and timeline information before moving to completed stage
    const validationErrors: {[key: string]: boolean} = {}
    const missingFields = []
    
    if (!contractEffectivity) {
      validationErrors.contractEffectivity = true
      missingFields.push('Contract Effectivity')
    }
    if (!contractExpiry) {
      validationErrors.contractExpiry = true
      missingFields.push('Contract Expiry')
    }
    if (!actualStartDate) {
      validationErrors.actualStartDate = true
      missingFields.push('Actual Start Date')
    }
    if (!targetCompletionDate) {
      validationErrors.targetCompletionDate = true
      missingFields.push('Target Completion Date')
    }
    
    if (missingFields.length > 0) {
      setContractValidationErrors(validationErrors)
      alert(`Please complete the following contract and timeline information before moving to the completed stage:\n\n${missingFields.join('\n')}`)
      return
    }
    
    // Clear validation errors if all fields are filled
    setContractValidationErrors({})
    
    // In a real app, this would update the project status in the backend
    console.log('Moving project to completed stage')
    alert('Project has been successfully moved to the Completed stage!')
    // Here you would typically call an API to update the project status
    // For now, we'll just show a success message
  }

  return (
    <div className="space-y-6">
      {/* Implementation Details Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-lg">Implementation Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Contractor</h4>
            <span className="text-sm">ABC Construction Corp.</span>
          </div>
          <div>
            <h4 className="font-medium mb-2">Progress</h4>
            <div className="flex items-center gap-2">
              <Badge variant={isProgressComplete ? "default" : "secondary"}>
                {currentProgress}% Complete
              </Badge>
              {slippageInfo && slippageInfo.isOverdue && (
                <Badge variant="destructive" className="animate-pulse bg-red-500 hover:bg-red-600 text-white">
                  {slippageInfo.percentage}% Behind
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Project Progress</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentProgress}% of 100%
              </span>
              {accomplishments.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {accomplishments.length} accomplishment{accomplishments.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isProgressComplete 
                  ? 'bg-green-500' 
                  : currentProgress >= 80 
                    ? 'bg-yellow-500' 
                    : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(currentProgress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <div className="flex items-center gap-2">
              {accomplishments.length > 0 && (
                <span className="text-xs text-blue-600">
                  Sum of all accomplishments
                </span>
              )}
              <span className={`font-medium ${
                isProgressComplete ? 'text-green-600' : 'text-blue-600'
              }`}>
                Target: 100%
              </span>
            </div>
          </div>
          
          {/* Slippage Information */}
          {slippageInfo && slippageInfo.isOverdue && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <h5 className="font-medium text-red-800 text-sm">Project Slippage Detected</h5>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-700">Days Overdue:</span>
                  <span className="font-medium text-red-800">{slippageInfo.daysOverdue} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Progress Slippage:</span>
                  <span className="font-medium text-red-800">{slippageInfo.percentage}% behind target</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Current Progress:</span>
                  <span className="font-medium text-red-800">{currentProgress}% of 100%</span>
                </div>
                <div className="mt-2 p-2 bg-red-100 rounded border border-red-300">
                  <p className="text-xs text-red-800">
                    <strong>Note:</strong> {slippageInfo.reason}. 
                    {slippageInfo.overdueCount === 1 
                      ? ` Accomplishment was ${slippageInfo.daysOverdue} days beyond target completion date`
                      : ` Furthest accomplishment was ${slippageInfo.daysOverdue} days beyond target completion date`
                    }
                    {slippageInfo.isProgressComplete ? (
                      <span className="block mt-1">
                        Although project is 100% complete, extension is required due to late completion.
                      </span>
                    ) : (
                      <span> with {slippageInfo.percentage}% work remaining to reach 100% completion.</span>
                    )}
                    {slippageInfo.hasExtension && (
                      <span className="block mt-1 text-orange-700">
                        <strong>Extension Applied:</strong> Target completion date has been extended. Apply for another extension if needed.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Move to Next Stage Button - RAED Only when progress is 100% */}
          {isRAED && isProgressComplete && (
            <div className={`mt-4 p-4 border rounded-lg ${
              slippageInfo && slippageInfo.isOverdue 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {slippageInfo && slippageInfo.isOverdue ? (
                    <XCircle className="h-5 w-5 text-orange-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <div>
                    <h5 className={`font-medium ${
                      slippageInfo && slippageInfo.isOverdue ? 'text-orange-800' : 'text-green-800'
                    }`}>
                      {slippageInfo && slippageInfo.isOverdue 
                        ? 'Project Cannot Proceed - Slippage Detected' 
                        : 'Project Ready for Completion'
                      }
                    </h5>
                    <p className={`text-sm ${
                      slippageInfo && slippageInfo.isOverdue ? 'text-orange-700' : 'text-green-700'
                    }`}>
                      {slippageInfo && slippageInfo.isOverdue 
                        ? slippageInfo.isProgressComplete 
                          ? 'Project is 100% complete but has slippage. Apply for extension to update target completion date before proceeding.'
                          : 'Project has slippage. Apply for extension to update target completion date before proceeding.'
                        : 'All implementation work has been completed. You can move this project to the Completed stage.'
                      }
                    </p>
                    {(!contractEffectivity || !contractExpiry || !actualStartDate || !targetCompletionDate) && (
                      <p className="text-xs text-orange-600 mt-1">
                        ℹ️ Contract and timeline information will be validated when moving to the completed stage
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {slippageInfo && slippageInfo.isOverdue && (
                    <Button
                      onClick={() => setShowExtensionModal(true)}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Request Extension
                    </Button>
                  )}
                  <Button
                    onClick={handleMoveToNextStage}
                    className={`${
                      slippageInfo && slippageInfo.isOverdue 
                        ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                    disabled={!!(slippageInfo && slippageInfo.isOverdue)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Move to Completed
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contract and Timeline Information - RAED Only */}
        {isRAED && (
          <div className={`space-y-4 p-4 rounded-lg border ${
            isContractSaved 
              ? 'bg-green-50 border-green-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className={`h-5 w-5 ${isContractSaved ? 'text-green-600' : 'text-blue-600'}`} />
                <h5 className={`font-medium ${isContractSaved ? 'text-green-800' : 'text-blue-800'}`}>
                  Contract & Timeline Information
                </h5>
                <Badge variant="outline" className={`${isContractSaved ? 'text-green-600 border-green-300' : 'text-blue-600 border-blue-300'}`}>
                  RAED Only
                </Badge>
                {isContractSaved && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                    Saved
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {!isContractSaved && (
                  <Button
                    onClick={handleSaveContractInfo}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Contract Info
                  </Button>
                )}
                {isContractSaved && (
                  <>
                    <Button
                      onClick={handleToggleEditMode}
                      variant={isEditMode ? "default" : "outline"}
                      size="sm"
                      className={isEditMode ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
                    >
                      {isEditMode ? "Cancel Edit" : "Edit"}
                    </Button>
                    {isEditMode && (
                      <Button
                        onClick={handleSaveContractInfo}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save Changes
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Save Success Message */}
            {showSaveSuccess && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {isInitialSave 
                      ? "Contract and timeline information saved successfully!" 
                      : "Changes saved successfully!"
                    }
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {isInitialSave
                    ? "Contract information saved. Click Edit to modify fields."
                    : "Fields are now locked. Click Edit to modify again."
                  }
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contract Effectivity *</label>
                <input
                  type="date"
                  value={contractEffectivity}
                  onChange={(e) => {
                    setContractEffectivity(e.target.value)
                    if (contractValidationErrors.contractEffectivity) {
                      setContractValidationErrors(prev => ({ ...prev, contractEffectivity: false }))
                    }
                  }}
                  disabled={isContractSaved && !isEditMode}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    contractValidationErrors.contractEffectivity ? 'border-red-500 bg-red-50' : 
                    isContractSaved && !isEditMode ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-300'
                  } ${isContractSaved && !isEditMode ? 'cursor-not-allowed' : ''}`}
                />
                {contractValidationErrors.contractEffectivity && (
                  <p className="text-xs text-red-600 mt-1">Contract effectivity date is required</p>
                )}
                {isContractSaved && !isEditMode && (
                  <p className="text-xs text-green-600 mt-1">✓ Locked - Saved on {new Date().toLocaleDateString()}</p>
                )}
                {isContractSaved && isEditMode && (
                  <p className="text-xs text-orange-600 mt-1">✏️ Edit mode - Make your changes and save</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contract Expiry *</label>
                <input
                  type="date"
                  value={contractExpiry}
                  onChange={(e) => {
                    setContractExpiry(e.target.value)
                    if (contractValidationErrors.contractExpiry) {
                      setContractValidationErrors(prev => ({ ...prev, contractExpiry: false }))
                    }
                  }}
                  disabled={isContractSaved && !isEditMode}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    contractValidationErrors.contractExpiry ? 'border-red-500 bg-red-50' : 
                    isContractSaved && !isEditMode ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-300'
                  } ${isContractSaved && !isEditMode ? 'cursor-not-allowed' : ''}`}
                />
                {contractValidationErrors.contractExpiry && (
                  <p className="text-xs text-red-600 mt-1">Contract expiry date is required</p>
                )}
                {isContractSaved && !isEditMode && (
                  <p className="text-xs text-green-600 mt-1">✓ Locked - Saved on {new Date().toLocaleDateString()}</p>
                )}
                {isContractSaved && isEditMode && (
                  <p className="text-xs text-orange-600 mt-1">✏️ Edit mode - Make your changes and save</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Actual Start Date *</label>
                <input
                  type="date"
                  value={actualStartDate}
                  onChange={(e) => {
                    setActualStartDate(e.target.value)
                    if (contractValidationErrors.actualStartDate) {
                      setContractValidationErrors(prev => ({ ...prev, actualStartDate: false }))
                    }
                  }}
                  disabled={isContractSaved && !isEditMode}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    contractValidationErrors.actualStartDate ? 'border-red-500 bg-red-50' : 
                    isContractSaved && !isEditMode ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-300'
                  } ${isContractSaved && !isEditMode ? 'cursor-not-allowed' : ''}`}
                />
                {contractValidationErrors.actualStartDate && (
                  <p className="text-xs text-red-600 mt-1">Actual start date is required</p>
                )}
                {isContractSaved && !isEditMode && (
                  <p className="text-xs text-green-600 mt-1">✓ Locked - Saved on {new Date().toLocaleDateString()}</p>
                )}
                {isContractSaved && isEditMode && (
                  <p className="text-xs text-orange-600 mt-1">✏️ Edit mode - Make your changes and save</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Completion Date *</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={targetCompletionDate}
                    onChange={(e) => {
                      setTargetCompletionDate(e.target.value)
                      // Set initial target date if it's the first time RAED inputs it
                      if (!initialTargetCompletionDate && e.target.value) {
                        setInitialTargetCompletionDate(e.target.value)
                      }
                      if (contractValidationErrors.targetCompletionDate) {
                        setContractValidationErrors(prev => ({ ...prev, targetCompletionDate: false }))
                      }
                    }}
                    disabled={isContractSaved && !isEditMode}
                    className={`flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      contractValidationErrors.targetCompletionDate ? 'border-red-500 bg-red-50' : 
                      isContractSaved && !isEditMode ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-300'
                    } ${isContractSaved && !isEditMode ? 'cursor-not-allowed' : ''}`}
                  />
                  {(!isContractSaved || isEditMode) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExtensionModal(true)}
                      className="px-3"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Extension
                    </Button>
                  )}
                </div>
                {contractValidationErrors.targetCompletionDate && (
                  <p className="text-xs text-red-600 mt-1">Target completion date is required</p>
                )}
                {initialTargetCompletionDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Initial target: {new Date(initialTargetCompletionDate).toLocaleDateString()}
                  </p>
                )}
                {isContractSaved && !isEditMode && (
                  <p className="text-xs text-green-600 mt-1">✓ Locked - Saved on {new Date().toLocaleDateString()}</p>
                )}
                {isContractSaved && isEditMode && (
                  <p className="text-xs text-orange-600 mt-1">✏️ Edit mode - Make your changes and save</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contract Extension Modal - Available when not saved or in edit mode */}
        <Dialog open={showExtensionModal && (!isContractSaved || isEditMode)} onOpenChange={(open) => {
          if (!isContractSaved || isEditMode) {
            setShowExtensionModal(open)
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Contract Extension</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Note: Extensions can be applied when not saved or in edit mode.
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Initial Target Completion Date</label>
                <div className="p-2 bg-gray-50 border rounded-md text-sm">
                  {initialTargetCompletionDate 
                    ? new Date(initialTargetCompletionDate).toLocaleDateString()
                    : 'Not set yet'
                  }
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Target Completion Date</label>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
                  {new Date(targetCompletionDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Extended Target Completion Date *</label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  min={targetCompletionDate} // New date must be after current target date
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be after current target date: {new Date(targetCompletionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reason for Extension *</label>
                <textarea
                  value={extensionReason}
                  onChange={(e) => setExtensionReason(e.target.value)}
                  placeholder="Please provide a detailed reason for the contract extension..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
              
              {/* Extension History */}
              {extensionHistory.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Previous Extensions</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {extensionHistory.map((extension, index) => (
                      <div key={extension.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs">
                        <div className="font-medium">Extension #{index + 1}</div>
                        <div>From: {new Date(extension.previousDate).toLocaleDateString()}</div>
                        <div>To: {new Date(extension.newDate).toLocaleDateString()}</div>
                        <div className="text-gray-600 mt-1">{extension.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowExtensionModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApplyExtension} disabled={!newTargetDate || !extensionReason || new Date(newTargetDate) <= new Date(targetCompletionDate)}>
                  Apply Extension
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Accomplishments Section - RAED Only */}
      {isRAED && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-green-600" />
              <div>
                <h4 className="font-medium">Project Accomplishments</h4>
                {accomplishments.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Total: {accomplishments.reduce((sum, acc) => sum + acc.progress, 0)}% ({accomplishments.length} items)
                  </p>
                )}
              </div>
              <Badge variant="outline" className="text-green-600 border-green-300 text-xs">RAED Only</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAccomplishmentModal(true)}
              className="text-xs px-3 py-1 h-7"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>

          {accomplishments.length > 0 ? (
            <div className="space-y-3">
              {accomplishments.map((accomplishment) => (
                <div key={accomplishment.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {new Date(accomplishment.date).toLocaleDateString()}
                        </span>
                        <Badge variant={accomplishment.progress >= 100 ? "default" : "secondary"} className="text-xs">
                          {accomplishment.progress}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{accomplishment.description}</p>
                      {accomplishment.documents.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <FileText className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600">
                            {accomplishment.documents.length} doc{accomplishment.documents.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAccomplishment(accomplishment.id)}
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                      >
                        <Edit2 className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAccomplishment(accomplishment.id)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FileCheck className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No accomplishments recorded yet</p>
              <p className="text-xs text-gray-400">Click "Add Accomplishment" to start tracking progress</p>
            </div>
          )}

          {/* Add/Edit Accomplishment Modal */}
          <Dialog open={showAccomplishmentModal} onOpenChange={(open) => {
            setShowAccomplishmentModal(open)
            if (!open) {
              setEditingAccomplishment(null)
              setNewAccomplishment({ date: '', description: '', progress: 0 })
              setAccomplishmentValidationErrors({})
            }
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAccomplishment ? 'Edit Project Accomplishment' : 'Add Project Accomplishment'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={newAccomplishment.date}
                    onChange={(e) => {
                      setNewAccomplishment(prev => ({ ...prev, date: e.target.value }))
                      if (accomplishmentValidationErrors.date) {
                        setAccomplishmentValidationErrors(prev => ({ ...prev, date: '' }))
                      }
                    }}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      accomplishmentValidationErrors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {accomplishmentValidationErrors.date && (
                    <p className="text-xs text-red-600 mt-1">{accomplishmentValidationErrors.date}</p>
                  )}
                  {actualStartDate && targetCompletionDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Must be on or after {new Date(actualStartDate).toLocaleDateString()}. 
                      Dates beyond {new Date(targetCompletionDate).toLocaleDateString()} will show slippage.
                    </p>
                  )}
                  {actualStartDate && !targetCompletionDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Must be on or after {new Date(actualStartDate).toLocaleDateString()}. 
                      Set target completion date first to enable slippage detection.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Progress Percentage *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAccomplishment.progress}
                    onChange={(e) => {
                      setNewAccomplishment(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))
                      if (accomplishmentValidationErrors.progress) {
                        setAccomplishmentValidationErrors(prev => ({ ...prev, progress: '' }))
                      }
                    }}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      accomplishmentValidationErrors.progress ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {accomplishmentValidationErrors.progress && (
                    <p className="text-xs text-red-600 mt-1">{accomplishmentValidationErrors.progress}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accomplishment Description *</label>
                  <textarea
                    value={newAccomplishment.description}
                    onChange={(e) => {
                      setNewAccomplishment(prev => ({ ...prev, description: e.target.value }))
                      if (accomplishmentValidationErrors.description) {
                        setAccomplishmentValidationErrors(prev => ({ ...prev, description: '' }))
                      }
                    }}
                    placeholder="Describe what was accomplished on this date..."
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                      accomplishmentValidationErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    rows={3}
                  />
                  {accomplishmentValidationErrors.description && (
                    <p className="text-xs text-red-600 mt-1">{accomplishmentValidationErrors.description}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Supporting Documents (Optional)</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload photos, reports, or other supporting documents
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowAccomplishmentModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAccomplishment} disabled={!newAccomplishment.date || !newAccomplishment.description}>
                    {editingAccomplishment ? 'Update Accomplishment' : 'Add Accomplishment'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Implementation Timeline - Read Only for Non-RAED */}
      {!isRAED && (
        <div>
          <h4 className="font-medium mb-2">Implementation Timeline</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Start Date</span>
              <span className="text-muted-foreground">Jan 1, 2025</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Expected Completion</span>
              <span className="text-muted-foreground">Mar 31, 2025</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
          <div className={`p-4 rounded-lg shadow-lg border max-w-sm ${
            toastMessage.variant === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : toastMessage.variant === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                toastMessage.variant === 'success' 
                  ? 'bg-green-500 text-white' 
                  : toastMessage.variant === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {toastMessage.variant === 'success' ? (
                  <Check className="h-3 w-3" />
                ) : toastMessage.variant === 'error' ? (
                  <XCircle className="h-3 w-3" />
                ) : (
                  <CheckCircle className="h-3 w-3" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{toastMessage.title}</h4>
                <p className="text-xs mt-1 opacity-90">{toastMessage.description}</p>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <XCircle className="h-4 w-4 opacity-60" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CompletedStepContent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Completion Date</h4>
          <span className="text-sm">March 15, 2025</span>
        </div>
        <div>
          <h4 className="font-medium mb-2">Final Inspection</h4>
          <Badge variant="default">Passed</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Project Summary</h4>
        <p className="text-sm text-muted-foreground">
          Project completed successfully with all deliverables met according to specifications.
        </p>
      </div>
    </div>
  )
}

function InventoryStepContent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Inventory Status</h4>
          <Badge variant="outline">Pending</Badge>
        </div>
        <div>
          <h4 className="font-medium mb-2">Asset Count</h4>
          <span className="text-sm">0 items</span>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Monitoring Evaluator</h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline">PPMD</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Next Steps</h4>
        <p className="text-sm text-muted-foreground">
          Complete asset inventory and update the system with all project deliverables.
        </p>
      </div>
    </div>
  )
}
