'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, FileText, ShoppingCart, Wrench, CheckCircle, Package, Upload, XCircle, Eye, Download, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DocumentPreviewModal } from '@/components/document-preview-modal'
import { Project } from '@/lib/types'
import { formatDate } from '@/lib/utils'

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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Contractor</h4>
          <span className="text-sm">ABC Construction Corp.</span>
        </div>
        <div>
          <h4 className="font-medium mb-2">Progress</h4>
          <Badge variant="secondary">65% Complete</Badge>
        </div>
      </div>
      
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
