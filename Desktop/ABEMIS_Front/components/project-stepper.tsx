'use client'

import React, { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  Check,
  FileText,
  ShoppingCart,
  Wrench,
  CheckCircle,
  Package,
  Upload,
  XCircle,
  Eye,
  Download,
  MessageSquare,
  Calendar,
  Clock,
  Plus,
  FileCheck,
  ArrowRight,
  Edit2,
  Trash2,
  Image,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DocumentPreviewModal } from '@/components/document-preview-modal'
import { Project } from '@/lib/types'
import { formatDate, formatDateForDisplay } from '@/lib/utils'
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
    description: 'Project proposal submitted',
  },
  {
    key: 'procurement',
    label: 'Procurement',
    icon: ShoppingCart,
    description: 'Procurement process',
  },
  {
    key: 'implementation',
    label: 'Implementation',
    icon: Wrench,
    description: 'Project implementation',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle,
    description: 'Project completed',
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: Package,
    description: 'Inventory management',
  },
]

// Machinery-specific steps
const machinerySteps = [
  {
    key: 'proposal',
    label: 'Proposal',
    icon: FileText,
    description: 'Project proposal submitted',
  },
  {
    key: 'procurement',
    label: 'Procurement',
    icon: ShoppingCart,
    description: 'Procurement process',
  },
  {
    key: 'for-delivery',
    label: 'For Delivery',
    icon: Upload,
    description: 'Ready for delivery',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    icon: CheckCircle,
    description: 'Project delivered',
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: Package,
    description: 'Inventory management',
  },
]

export function ProjectStepper({
  currentStatus,
  onStepClick,
  projectType,
  project,
}: ProjectStepperProps) {
  // Determine which steps to use based on project type
  const currentSteps = projectType === 'Machinery' ? machinerySteps : steps

  // Map currentStatus to the correct step key
  const statusToStepMap: { [key: string]: string } =
    projectType === 'Machinery'
      ? {
          Proposal: 'proposal',
          Procurement: 'procurement',
          'For Delivery': 'for-delivery',
          Delivered: 'delivered',
          Inventory: 'inventory',
        }
      : {
          Proposal: 'proposal',
          Procurement: 'procurement',
          Implementation: 'implementation',
          Completed: 'completed',
          Inventory: 'inventory',
        }

  const mappedCurrentStatus = statusToStepMap[currentStatus] || 'proposal'
  const [activeStep, setActiveStep] = useState(mappedCurrentStatus)
  const [currentStepStatus, setCurrentStepStatus] = useState(
    currentStatus || 'Proposal'
  )

  const getStepIndex = (step: string) => {
    const mappedStep = statusToStepMap[step] || step
    const index = currentSteps.findIndex((s) => s.key === mappedStep)
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
      const stepToStatusMap: { [key: string]: string } =
        projectType === 'Machinery'
          ? {
              proposal: 'Proposal',
              procurement: 'Procurement',
              'for-delivery': 'For Delivery',
              delivered: 'Delivered',
              inventory: 'Inventory',
            }
          : {
              proposal: 'Proposal',
              procurement: 'Procurement',
              implementation: 'Implementation',
              completed: 'Completed',
              inventory: 'Inventory',
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
    const stepIndex = currentSteps.findIndex((s) => s.key === nextStep)
    if (stepIndex >= 0) {
      setActiveStep(nextStep)
      // Update the current step status to reflect the progression
      const stepToStatusMap: { [key: string]: string } =
        projectType === 'Machinery'
          ? {
              proposal: 'Proposal',
              procurement: 'Procurement',
              'for-delivery': 'For Delivery',
              delivered: 'Delivered',
              inventory: 'Inventory',
            }
          : {
              proposal: 'Proposal',
              procurement: 'Procurement',
              implementation: 'Implementation',
              completed: 'Completed',
              inventory: 'Inventory',
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
      <div className="mb-8 flex items-center justify-center px-4">
        {currentSteps.map((step, index) => {
          const Icon = step.icon
          const stepStatus = getStepStatus(index)
          const isAccessible = isStepAccessible(index)
          const isActive = activeStep === step.key

          return (
            <div
              key={step.key}
              onClick={() => isAccessible && handleStepClick(step.key, index)}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center rounded-lg p-2 text-center transition-all duration-200',
                {
                  'hover:bg-muted/50': isAccessible,
                  'cursor-pointer': isAccessible,
                  'cursor-not-allowed': !isAccessible,
                }
              )}
            >
              <div className="flex w-full items-center justify-center">
                {/* Step Circle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStepClick(step.key, index)
                  }}
                  disabled={!isAccessible}
                  className={cn(
                    'relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                    {
                      'border-green-500 bg-green-500 text-white':
                        stepStatus === 'current',
                      'border-black bg-black text-white':
                        stepStatus === 'completed',
                      'border-muted bg-muted text-muted-foreground':
                        stepStatus === 'upcoming',
                      'cursor-pointer hover:scale-105 hover:bg-primary/10':
                        isAccessible,
                      'cursor-not-allowed opacity-50': !isAccessible,
                      'ring-2 ring-green-500 ring-offset-2': isActive,
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
                  <div
                    className={cn('mx-2 h-0.5 flex-1', {
                      'bg-black': stepStatus === 'completed',
                      'bg-green-500': stepStatus === 'current',
                      'bg-muted': stepStatus === 'upcoming',
                    })}
                  />
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 w-full px-1 text-center">
                <p
                  className={cn(
                    'flex min-h-[20px] items-center justify-center text-center text-sm font-medium',
                    {
                      'text-green-600': stepStatus === 'current',
                      'text-black': stepStatus === 'completed',
                      'text-muted-foreground': stepStatus === 'upcoming',
                      'hover:text-green-600':
                        isAccessible && stepStatus === 'upcoming',
                    }
                  )}
                >
                  {step.label}
                </p>
                <p
                  className={cn(
                    'mt-1 flex min-h-[32px] items-center justify-center text-center text-xs leading-tight',
                    {
                      'text-green-600': stepStatus === 'current',
                      'text-black': stepStatus === 'completed',
                      'text-muted-foreground': stepStatus === 'upcoming',
                    }
                  )}
                >
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
            {currentSteps.find((s) => s.key === activeStep)?.icon &&
              React.createElement(
                currentSteps.find((s) => s.key === activeStep)!.icon,
                { className: 'h-5 w-5' }
              )}
            {projectType === 'Machinery' ? (
              <>
                {activeStep === 'proposal' && 'Step 1: Proposal Details'}
                {activeStep === 'procurement' && 'Step 2: Procurement Details'}
                {activeStep === 'for-delivery' &&
                  'Step 3: For Delivery Details'}
                {activeStep === 'delivered' && 'Step 4: Delivered Details'}
                {activeStep === 'inventory' && 'Step 5: Inventory Details'}
              </>
            ) : (
              `${currentSteps.find((s) => s.key === activeStep)?.label} Details`
            )}
            {activeStep === mappedCurrentStatus && (
              <Badge variant="secondary" className="ml-2">
                Current
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeStep === 'proposal' && (
            <ProposalStepContent
              projectType={projectType}
              currentStatus={currentStatus}
              project={project}
            />
          )}
          {activeStep === 'procurement' && (
            <ProcurementStepContent
              currentStatus={currentStatus}
              project={project}
              onStepClick={onStepClick}
              onStageProgression={handleStageProgression}
            />
          )}
          {activeStep === 'implementation' && <ImplementationStepContent />}
          {activeStep === 'completed' && (
            <CompletedStepContent project={project} onStepClick={onStepClick} />
          )}
          {activeStep === 'inventory' && (
            <InventoryStepContent project={project} />
          )}
          {activeStep === 'for-delivery' && (
            <ForDeliveryStepContent
              project={project}
              onStepClick={onStepClick}
            />
          )}
          {activeStep === 'delivered' && (
            <DeliveredStepContent project={project} onStepClick={onStepClick} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Step Content Components
function ProposalStepContent({
  projectType,
  currentStatus,
  project,
}: {
  projectType?: string
  currentStatus?: string
  project?: Project
}) {
  const evaluator: string =
    projectType === 'FMR'
      ? 'SEPD'
      : project?.evaluator
        ? String(project.evaluator)
        : 'EPDSD'
  const isBeyondProposal =
    currentStatus &&
    ['Procurement', 'Implementation', 'Completed'].includes(currentStatus)
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Record<string, any>
  >({})
  const [previewDocument, setPreviewDocument] = useState<any>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  // Required documents based on project type
  const requiredDocuments =
    projectType === 'Machinery'
      ? [
          {
            id: 'DOC-001',
            name: 'Letter/Resolution',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-002',
            name: 'UTILIZATION PROPOSAL (BUSINESS PLAN)',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-003',
            name: 'VALIDATION REPORT',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-004',
            name: 'FS/EFA',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-005',
            name: 'TECHNICAL SPECIFICATIONS',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-006',
            name: 'MARKET ANALYSIS',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-007',
            name: 'Others',
            type: 'PDF',
            required: false,
          },
        ]
      : [
          {
            id: 'DOC-001',
            name: 'Letter of Intent',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-002',
            name: 'Validation Report',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-003',
            name: 'FS/EFA (Feasibility Study/Environmental Impact Assessment)',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-004',
            name: 'DED (Detailed Engineering Design)',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-005',
            name: 'POW (Program of Work)',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-006',
            name: 'Right of Way Documents',
            type: 'PDF',
            required: true,
          },
          {
            id: 'DOC-007',
            name: 'Other Documents',
            type: 'PDF',
            required: false,
          },
        ]

  // Mock function to get document status
  const getDocumentStatus = (docId: string) => {
    // If project is beyond proposal stage, show all documents as approved (green)
    if (isBeyondProposal) {
      return {
        uploaded: true,
        epdsdApproved: true,
        comments: '',
      }
    }

    // If project is in Proposal stage, show random mix of green and red
    // Use docId to create consistent "random" results
    const hash = docId.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    const isApproved = Math.abs(hash) % 2 === 0 // 50/50 chance based on docId

    return {
      uploaded: true,
      epdsdApproved: isApproved,
      comments: isApproved
        ? ''
        : 'Please revise this document according to requirements.',
    }
  }

  // Mock function to get uploaded document info
  const getUploadedDocument = (docId: string) => {
    const status = getDocumentStatus(docId)
    if (!status.uploaded) return null

    return {
      id: docId,
      name:
        requiredDocuments.find((doc) => doc.id === docId)?.name || 'Document',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'RAED User',
      uploadedAt: new Date().toISOString(),
      status: status.epdsdApproved ? 'Approved' : 'Under Review',
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
      status: 'Under Review',
    }

    setUploadedDocuments((prev) => ({
      ...prev,
      [docId]: uploadedDoc,
    }))

    alert(`Document uploaded successfully: ${file.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Step Number for Machinery Projects */}
      {/* {projectType === 'Machinery' && (
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-blue-600">Proposal</h3>
        </div>
      )} */}

      {/* Proposal Details Section */}
      <div className="grid grid-cols-1 gap-8 rounded-lg bg-muted/30 p-6 md:grid-cols-2">
        <div>
          <h4 className="mb-3 font-medium">Evaluator</h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{evaluator}</Badge>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-medium">Status</h4>
          <Badge variant={isBeyondProposal ? 'default' : 'secondary'}>
            {isBeyondProposal ? 'All Documents Reviewed' : 'Under Review'}
          </Badge>
        </div>
      </div>

      {/* Required Documents Section */}
      <div>
        <h4 className="mb-4 font-medium">Required Documents</h4>
        <Accordion type="single" collapsible className="w-full">
          {requiredDocuments.map((doc) => {
            const status = getDocumentStatus(doc.id)
            const uploadedDoc = getUploadedDocument(doc.id)

            return (
              <AccordionItem
                key={doc.id}
                value={doc.id}
                className="mb-2 cursor-pointer rounded-lg border transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          status.uploaded
                            ? status.epdsdApproved
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
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
                            : 'Not uploaded'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          status.uploaded
                            ? status.epdsdApproved
                              ? 'default'
                              : 'destructive'
                            : 'secondary'
                        }
                        className={
                          status.uploaded && status.epdsdApproved
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : ''
                        }
                      >
                        {status.uploaded
                          ? status.epdsdApproved
                            ? 'Approved'
                            : 'Needs Revision'
                          : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {/* Uploaded Document Info */}
                    {uploadedDoc && (
                      <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            Uploaded Document
                          </h4>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPreviewDocument(uploadedDoc)
                                setShowPreviewModal(true)
                              }}
                            >
                              <Eye className="mr-1 h-3 w-3" />
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
                                const file = new Blob([content], {
                                  type: 'text/plain',
                                })
                                element.href = URL.createObjectURL(file)
                                element.download = `${uploadedDoc.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
                                document.body.appendChild(element)
                                element.click()
                                document.body.removeChild(element)

                                // Clean up the object URL
                                setTimeout(
                                  () => URL.revokeObjectURL(element.href),
                                  100
                                )
                              }}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">File:</span>{' '}
                            {uploadedDoc.name}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span>{' '}
                            {uploadedDoc.size}
                          </div>
                          <div>
                            <span className="font-medium">Uploaded by:</span>{' '}
                            {uploadedDoc.uploadedBy}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>{' '}
                            {formatDate(uploadedDoc.uploadedAt)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* EPDSD Comments */}
                    {status.comments && (
                      <div
                        className={`rounded-lg border p-4 ${
                          !isBeyondProposal && !status.epdsdApproved
                            ? 'border-red-200 bg-red-50'
                            : 'border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        <div
                          className={`mb-2 flex items-center gap-2 ${
                            !isBeyondProposal && !status.epdsdApproved
                              ? 'text-red-800'
                              : 'text-yellow-800'
                          }`}
                        >
                          <MessageSquare
                            className={`h-4 w-4 ${
                              !isBeyondProposal && !status.epdsdApproved
                                ? 'text-red-600'
                                : 'text-yellow-600'
                            }`}
                          />
                          <h4 className="text-sm font-medium">
                            EPDSD Comments
                          </h4>
                        </div>
                        <p
                          className={`text-sm ${
                            !isBeyondProposal && !status.epdsdApproved
                              ? 'text-red-700'
                              : 'text-yellow-700'
                          }`}
                        >
                          {status.comments}
                        </p>
                      </div>
                    )}

                    {/* Upload Section - Only show for Proposal status and documents that are not approved */}
                    {!isBeyondProposal && !status.epdsdApproved && (
                      <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
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
                        <label
                          htmlFor={`upload-${doc.id}`}
                          className="cursor-pointer"
                        >
                          <div className="space-y-2">
                            <Upload className="mx-auto h-6 w-6 text-gray-400" />
                            <div className="text-xs text-gray-600">
                              {uploadedDoc
                                ? 'Replace document'
                                : 'Upload document'}
                            </div>
                            <div className="text-xs text-gray-500">
                              PDF, DOC, DOCX up to 10MB
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-3 py-1 text-xs"
                              asChild
                            >
                              <span>Choose File</span>
                            </Button>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* Approved Document Section - Show for Proposal status when document is approved */}
                    {!isBeyondProposal &&
                      status.epdsdApproved &&
                      uploadedDoc && (
                        <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-green-800">
                              Document Approved
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-green-700">
                                File:
                              </span>
                              <span className="ml-1 text-green-600">
                                {uploadedDoc.name}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-green-700">
                                Size:
                              </span>
                              <span className="ml-1 text-green-600">
                                {uploadedDoc.size}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-green-700">
                                Uploaded by:
                              </span>
                              <span className="ml-1 text-green-600">
                                {uploadedDoc.uploadedBy}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-green-700">
                                Date:
                              </span>
                              <span className="ml-1 text-green-600">
                                {formatDate(uploadedDoc.uploadedAt)}
                              </span>
                            </div>
                          </div>
                          <div className="rounded border border-green-300 bg-green-100 p-3">
                            <div className="mb-1 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Document Approved
                              </span>
                            </div>
                            <p className="text-xs text-green-700">
                              This document has been reviewed and approved by
                              the evaluator. No further action required.
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Document Viewing Section - Show for non-Proposal status */}
                    {isBeyondProposal && uploadedDoc && (
                      <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-green-800">
                            Final Approved Document
                          </h4>
                          <div className="flex gap-2">
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPreviewDocument(uploadedDoc)
                                setShowPreviewModal(true)
                              }}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View Document
                            </Button> */}
                            {/* <Button
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
                                const file = new Blob([content], {
                                  type: 'text/plain',
                                })
                                element.href = URL.createObjectURL(file)
                                element.download = `${uploadedDoc.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
                                document.body.appendChild(element)
                                element.click()
                                document.body.removeChild(element)

                                // Clean up the object URL
                                setTimeout(
                                  () => URL.revokeObjectURL(element.href),
                                  100
                                )
                              }}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button> */}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-green-700">
                              File:
                            </span>
                            <span className="ml-1 text-green-600">
                              {uploadedDoc.name}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">
                              Size:
                            </span>
                            <span className="ml-1 text-green-600">
                              {uploadedDoc.size}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">
                              Uploaded by:
                            </span>
                            <span className="ml-1 text-green-600">
                              {uploadedDoc.uploadedBy}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">
                              Date:
                            </span>
                            <span className="ml-1 text-green-600">
                              {formatDate(uploadedDoc.uploadedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="rounded border border-green-300 bg-green-100 p-3">
                          <div className="mb-1 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Document Approved
                            </span>
                          </div>
                          <p className="text-xs text-green-700">
                            This document has been reviewed and approved by the
                            evaluator. No further action required.
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
          <h4 className="mb-2 font-medium">Forwarding Logs</h4>
          <div className="space-y-2">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Proposal Forwarded to Procurement
                </span>
              </div>
              <p className="text-xs text-green-700">
                {evaluator} forwarded the proposal to procurement department
              </p>
              <p className="mt-1 text-xs text-green-600">
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

function ProcurementStepContent({
  currentStatus,
  project,
  onStepClick,
  onStageProgression,
}: {
  currentStatus?: string
  project?: Project
  onStepClick?: (step: string) => void
  onStageProgression?: (step: string) => void
}) {
  const isBeyondProcurement =
    currentStatus && ['Implementation', 'Completed'].includes(currentStatus)
  const [budgetYear, setBudgetYear] = useState<string>(
    () => (project?.budgetYear || '') as string
  )
  const [bidOpeningDate, setBidOpeningDate] = useState<string>(
    () => (project?.bidOpeningDate || '') as string
  )
  const [noticeOfAwardDate, setNoticeOfAwardDate] = useState<string>(
    () => (project?.noticeOfAwardDate || '') as string
  )
  const [noticeToProceedDate, setNoticeToProceedDate] = useState<string>(
    () => (project?.noticeToProceedDate || '') as string
  )
  const [procurementMethod, setProcurementMethod] = useState<string>(
    () => ((project as any)?.procurementMethod || 'Public Bidding') as string
  )
  const [uploadingDocuments, setUploadingDocuments] = useState<Set<string>>(
    new Set()
  )
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File | null
  }>({
    bidOpening: null,
    noticeOfAward: null,
    noticeToProceed: null,
  })
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean
  }>({})
  const [remarks, setRemarks] = useState<string>('')
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)
  const [isProceeding, setIsProceeding] = useState<boolean>(false)

  const handleFileUpload = (
    documentType: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadingDocuments((prev) => new Set(prev).add(documentType))
      setUploadedFiles((prev) => ({ ...prev, [documentType]: file }))

      // Clear validation error for this document type
      const errorKey = `${documentType}Doc`
      if (validationErrors[errorKey]) {
        setValidationErrors((prev) => ({ ...prev, [errorKey]: false }))
      }

      // Simulate upload process
      setTimeout(() => {
        setUploadingDocuments((prev) => {
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
      {/* Step Number for Machinery Projects */}
      {/* <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-blue-600">Procurement</h3>
      </div> */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-medium">Procurement Method</h4>
          <select
            value={procurementMethod || 'Public Bidding'}
            onChange={(e) => setProcurementMethod(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Public Bidding">Public Bidding</option>
            <option value="Shopping">Shopping</option>
            <option value="Direct Contracting">Direct Contracting</option>
            <option value="Repeat Order">Repeat Order</option>
            <option value="Small Value Procurement">
              Small Value Procurement
            </option>
            <option value="Negotiated Procurement">
              Negotiated Procurement
            </option>
            <option value="Two-Stage Bidding">Two-Stage Bidding</option>
            <option value="Alternative Methods">Alternative Methods</option>
          </select>
        </div>
        <div>
          <h4 className="mb-2 font-medium">Status</h4>
          <Badge variant={isBeyondProcurement ? 'default' : 'secondary'}>
            {isBeyondProcurement ? 'Completed' : 'In Progress'}
          </Badge>
        </div>
      </div>

      {/* Procurement Fields for RAED */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Procurement Information</h4>

        {/* Budget Year Dropdown */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Budget Year
            </label>
            <select
              value={budgetYear || ''}
              onChange={(e) => {
                setBudgetYear(e.target.value)
                if (validationErrors.budgetYear) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    budgetYear: false,
                  }))
                }
              }}
              className={`w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.budgetYear
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            >
              <option value="">Select Budget Year</option>
              {budgetYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Bid Opening Conducted
            </label>
            <input
              type="date"
              value={bidOpeningDate || ''}
              onChange={(e) => {
                setBidOpeningDate(e.target.value)
                if (validationErrors.bidOpeningDate) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    bidOpeningDate: false,
                  }))
                }
              }}
              className={`w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.bidOpeningDate
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Issuance of Notice of Awards
            </label>
            <input
              type="date"
              value={noticeOfAwardDate || ''}
              onChange={(e) => {
                setNoticeOfAwardDate(e.target.value)
                if (validationErrors.noticeOfAwardDate) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    noticeOfAwardDate: false,
                  }))
                }
              }}
              className={`w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.noticeOfAwardDate
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Notice to Proceed Issue
            </label>
            <input
              type="date"
              value={noticeToProceedDate || ''}
              onChange={(e) => {
                setNoticeToProceedDate(e.target.value)
                if (validationErrors.noticeToProceedDate) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    noticeToProceedDate: false,
                  }))
                }
              }}
              className={`w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.noticeToProceedDate
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Procurement Documents</h4>

        <div className="space-y-4">
          {/* Bid Opening Document */}
          <div
            className={`flex items-center justify-between rounded-lg border p-4 ${
              validationErrors.bidOpeningDoc
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Bid Opening Document</p>
                <p className="text-xs text-muted-foreground">
                  Upload document for bid opening conducted
                </p>
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
                onClick={() =>
                  document.getElementById('bid-opening-upload')?.click()
                }
                disabled={uploadingDocuments.has('bidOpening')}
              >
                {uploadingDocuments.has('bidOpening') ? (
                  <>
                    <div className="mr-1 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-1 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Notice of Award Document */}
          <div
            className={`flex items-center justify-between rounded-lg border p-4 ${
              validationErrors.noticeOfAwardDoc
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Notice of Award Document</p>
                <p className="text-xs text-muted-foreground">
                  Upload document for notice of award issuance
                </p>
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
                onClick={() =>
                  document.getElementById('notice-of-award-upload')?.click()
                }
                disabled={uploadingDocuments.has('noticeOfAward')}
              >
                {uploadingDocuments.has('noticeOfAward') ? (
                  <>
                    <div className="mr-1 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-1 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Notice to Proceed Document */}
          <div
            className={`flex items-center justify-between rounded-lg border p-4 ${
              validationErrors.noticeToProceedDoc
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">
                  Notice to Proceed Document
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload document for notice to proceed issuance
                </p>
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
                onClick={() =>
                  document.getElementById('notice-to-proceed-upload')?.click()
                }
                disabled={uploadingDocuments.has('noticeToProceed')}
              >
                {uploadingDocuments.has('noticeToProceed') ? (
                  <>
                    <div className="mr-1 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-1 h-4 w-4" />
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
            <h4 className="mb-2 font-medium">Contractor Information</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <h4 className="mb-2 font-medium">Procurement Milestones</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">
                    Effectivity of the GAA (Budget Year)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Completed on Jan 1, 2025
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Bid Opening Conducted</p>
                  <p className="text-xs text-muted-foreground">
                    Completed on Jan 15, 2025
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">
                    Issuance of Notice of Award Approved
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Completed on Jan 20, 2025
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">
                    Notice to Proceed Issued
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Completed on Jan 25, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Remarks Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Remarks</h4>
        <div>
          <label className="mb-2 block text-sm font-medium">
            Additional Notes
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any additional notes or remarks about the procurement process..."
            className="w-full resize-none rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 duration-300 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-800">
                Procurement Completed Successfully!
              </h4>
              <p className="mt-1 text-sm text-green-700">
                All procurement requirements have been fulfilled. Proceeding to
                Implementation stage...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save and Proceed Buttons */}
      {!isBeyondProcurement && (
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => {
              // Save current data
              console.log('Saving procurement data:', {
                budgetYear,
                bidOpeningDate,
                noticeOfAwardDate,
                noticeToProceedDate,
                uploadedFiles,
                remarks,
              })
              // In a real app, this would save to the backend
              alert('Procurement data saved successfully!')
            }}
          >
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
              const areDocumentsUploaded =
                uploadedFiles.bidOpening &&
                uploadedFiles.noticeOfAward &&
                uploadedFiles.noticeToProceed

              const missingFields = []
              if (!isBudgetYearFilled) missingFields.push('Budget Year')
              if (!isBidOpeningFilled) missingFields.push('Bid Opening Date')
              if (!isNoticeOfAwardFilled)
                missingFields.push('Notice of Award Date')
              if (!isNoticeToProceedFilled)
                missingFields.push('Notice to Proceed Date')
              if (!uploadedFiles.bidOpening)
                missingFields.push('Bid Opening Document')
              if (!uploadedFiles.noticeOfAward)
                missingFields.push('Notice of Award Document')
              if (!uploadedFiles.noticeToProceed)
                missingFields.push('Notice to Proceed Document')

              if (missingFields.length > 0) {
                // Set validation errors for missing fields
                const errors: { [key: string]: boolean } = {}
                if (!isBudgetYearFilled) errors.budgetYear = true
                if (!isBidOpeningFilled) errors.bidOpeningDate = true
                if (!isNoticeOfAwardFilled) errors.noticeOfAwardDate = true
                if (!isNoticeToProceedFilled) errors.noticeToProceedDate = true
                if (!uploadedFiles.bidOpening) errors.bidOpeningDoc = true
                if (!uploadedFiles.noticeOfAward) errors.noticeOfAwardDoc = true
                if (!uploadedFiles.noticeToProceed)
                  errors.noticeToProceedDoc = true

                setValidationErrors(errors)
                alert(
                  `Please complete the following fields before proceeding:\n\n${missingFields.join('\n')}`
                )
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
            disabled={
              !budgetYear ||
              !bidOpeningDate ||
              !noticeOfAwardDate ||
              !noticeToProceedDate ||
              !uploadedFiles.bidOpening ||
              !uploadedFiles.noticeOfAward ||
              !uploadedFiles.noticeToProceed ||
              isProceeding
            }
          >
            {isProceeding ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
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
  const [initialTargetCompletionDate, setInitialTargetCompletionDate] =
    useState('') // Set when RAED first inputs target date
  const [showExtensionModal, setShowExtensionModal] = useState(false)
  const [newTargetDate, setNewTargetDate] = useState('')
  const [extensionReason, setExtensionReason] = useState('')
  const [extensionHistory, setExtensionHistory] = useState<
    Array<{
      id: string
      previousDate: string
      newDate: string
      reason: string
      dateRequested: string
    }>
  >([])

  // State for validation errors
  const [contractValidationErrors, setContractValidationErrors] = useState<{
    [key: string]: boolean
  }>({})

  // State for save functionality
  const [isContractSaved, setIsContractSaved] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isInitialSave, setIsInitialSave] = useState(false)

  // State for accomplishments and progress
  const [accomplishments, setAccomplishments] = useState<
    Array<{
      id: string
      date: string
      description: string
      progress: number
      documents: File[]
    }>
  >([])
  const [showAccomplishmentModal, setShowAccomplishmentModal] = useState(false)
  const [editingAccomplishment, setEditingAccomplishment] = useState<
    string | null
  >(null)
  const [newAccomplishment, setNewAccomplishment] = useState({
    date: '',
    description: '',
    progress: 0,
  })

  // State for accomplishment validation
  const [accomplishmentValidationErrors, setAccomplishmentValidationErrors] =
    useState<{ [key: string]: string }>({})

  // State for toast notifications
  const [toastMessage, setToastMessage] = useState<{
    title: string
    description: string
    variant: 'default' | 'success' | 'error'
  } | null>(null)

  // Toast notification function
  const showToast = (
    title: string,
    description: string,
    variant: 'default' | 'success' | 'error' = 'default'
  ) => {
    setToastMessage({ title, description, variant })
    // Auto-hide toast after 3 seconds
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Save contract and timeline information
  const handleSaveContractInfo = () => {
    // Validate required fields before saving
    const validationErrors: { [key: string]: boolean } = {}
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
      alert(
        `Please complete the following fields before saving:\n\n${missingFields.join('\n')}`
      )
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
      initialTargetCompletionDate,
    })

    // Different toast messages based on whether it's initial save or saving changes
    if (wasInitialSave) {
      showToast(
        'Contract Information Saved',
        'Contract and timeline information has been saved successfully. Click Edit to modify.',
        'success'
      )
    } else {
      showToast(
        'Changes Saved',
        'Contract and timeline information has been updated successfully.',
        'success'
      )
    }
  }

  // Toggle edit mode
  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode)
    if (!isEditMode) {
      showToast(
        'Edit Mode',
        'Contract information is now editable. Make your changes and save.',
        'default'
      )
    } else {
      showToast(
        'View Mode',
        'Contract information is now in view mode.',
        'default'
      )
    }
  }

  // Calculate overall project progress based on accomplishments
  const calculateOverallProgress = () => {
    if (accomplishments.length === 0) {
      return 0 // Start at 0% when no accomplishments in implementation stage
    }

    // Sum up all accomplishment progress percentages
    const totalProgress = accomplishments.reduce(
      (sum, acc) => sum + acc.progress,
      0
    )

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
    const overdueAccomplishments = accomplishments.filter((acc) => {
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
      const daysOverdue = Math.ceil(
        (furthestOverdueDate.getTime() - currentTargetDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )

      return {
        percentage: slippagePercentage,
        daysOverdue: daysOverdue,
        isOverdue: true,
        reason:
          overdueAccomplishments.length === 1
            ? 'Accomplishment date is beyond current target completion date'
            : `${overdueAccomplishments.length} accomplishments are beyond current target completion date`,
        overdueCount: overdueAccomplishments.length,
        hasExtension: extensionHistory.length > 0,
        isProgressComplete: isProgressComplete,
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
        dateRequested: new Date().toISOString(),
      }

      // Add to extension history
      setExtensionHistory((prev) => [...prev, extensionRecord])

      // Update target completion date
      setTargetCompletionDate(newTargetDate)

      // Close modal and reset form
      setShowExtensionModal(false)
      setNewTargetDate('')
      setExtensionReason('')

      // Show success toast
      showToast(
        'Extension Applied',
        `Target completion date extended to ${formatDateForDisplay(newTargetDate)}.`,
        'success'
      )
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

    const validationErrors: { [key: string]: string } = {}

    // Validate required fields
    if (!newAccomplishment.date) {
      validationErrors.date = 'Date is required'
    } else {
      // Validate date range
      const dateValidationError = validateAccomplishmentDate(
        newAccomplishment.date
      )
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
      setAccomplishments((prev) =>
        prev.map((acc) =>
          acc.id === editingAccomplishment
            ? { ...acc, ...newAccomplishment }
            : acc
        )
      )
      setEditingAccomplishment(null)
      // Calculate new total progress after update
      const updatedAccomplishments = accomplishments.map((acc) =>
        acc.id === editingAccomplishment
          ? { ...acc, ...newAccomplishment }
          : acc
      )
      const newTotalProgress = Math.min(
        updatedAccomplishments.reduce((sum, acc) => sum + acc.progress, 0),
        100
      )
      showToast(
        'Accomplishment Updated',
        `Project progress updated to ${newTotalProgress}%.`,
        'success'
      )
    } else {
      // Add new accomplishment
      const accomplishment = {
        id: Date.now().toString(),
        ...newAccomplishment,
        documents: [],
      }
      setAccomplishments((prev) => [...prev, accomplishment])
      // Calculate new total progress after adding
      const newTotalProgress = Math.min(
        [...accomplishments, accomplishment].reduce(
          (sum, acc) => sum + acc.progress,
          0
        ),
        100
      )
      showToast(
        'Accomplishment Added',
        `Project progress updated to ${newTotalProgress}%.`,
        'success'
      )
    }

    setShowAccomplishmentModal(false)
    setNewAccomplishment({ date: '', description: '', progress: 0 })
  }

  const handleEditAccomplishment = (accomplishmentId: string) => {
    const accomplishment = accomplishments.find(
      (acc) => acc.id === accomplishmentId
    )
    if (accomplishment) {
      setNewAccomplishment({
        date: accomplishment.date,
        description: accomplishment.description,
        progress: accomplishment.progress,
      })
      setEditingAccomplishment(accomplishmentId)
      setShowAccomplishmentModal(true)
    }
  }

  const handleDeleteAccomplishment = (accomplishmentId: string) => {
    if (confirm('Are you sure you want to delete this accomplishment?')) {
      const accomplishmentToDelete = accomplishments.find(
        (acc) => acc.id === accomplishmentId
      )
      setAccomplishments((prev) =>
        prev.filter((acc) => acc.id !== accomplishmentId)
      )

      // Calculate new total progress after deletion
      const remainingAccomplishments = accomplishments.filter(
        (acc) => acc.id !== accomplishmentId
      )
      const newTotalProgress =
        remainingAccomplishments.length > 0
          ? Math.min(
              remainingAccomplishments.reduce(
                (sum, acc) => sum + acc.progress,
                0
              ),
              100
            )
          : 0

      showToast(
        'Accomplishment Deleted',
        `Project progress updated to ${newTotalProgress}%.`,
        'success'
      )
    }
  }

  const handleMoveToNextStage = () => {
    // Validate contract and timeline information before moving to completed stage
    const validationErrors: { [key: string]: boolean } = {}
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
      alert(
        `Please complete the following contract and timeline information before moving to the completed stage:\n\n${missingFields.join('\n')}`
      )
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
        <h4 className="text-lg font-medium">Implementation Details</h4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium">Contractor</h4>
            <span className="text-sm">ABC Construction Corp.</span>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Progress</h4>
            <div className="flex items-center gap-2">
              <Badge variant={isProgressComplete ? 'default' : 'secondary'}>
                {currentProgress}% Complete
              </Badge>
              {slippageInfo && slippageInfo.isOverdue && (
                <Badge
                  variant="destructive"
                  className="animate-pulse bg-red-500 text-white hover:bg-red-600"
                >
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
                  {accomplishments.length} accomplishment
                  {accomplishments.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200">
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
              <span
                className={`font-medium ${
                  isProgressComplete ? 'text-green-600' : 'text-blue-600'
                }`}
              >
                Target: 100%
              </span>
            </div>
          </div>

          {/* Slippage Information */}
          {slippageInfo && slippageInfo.isOverdue && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                <h5 className="text-sm font-medium text-red-800">
                  Project Slippage Detected
                </h5>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-700">Days Overdue:</span>
                  <span className="font-medium text-red-800">
                    {slippageInfo.daysOverdue} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Progress Slippage:</span>
                  <span className="font-medium text-red-800">
                    {slippageInfo.percentage}% behind target
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Current Progress:</span>
                  <span className="font-medium text-red-800">
                    {currentProgress}% of 100%
                  </span>
                </div>
                <div className="mt-2 rounded border border-red-300 bg-red-100 p-2">
                  <p className="text-xs text-red-800">
                    <strong>Note:</strong> {slippageInfo.reason}.
                    {slippageInfo.overdueCount === 1
                      ? ` Accomplishment was ${slippageInfo.daysOverdue} days beyond target completion date`
                      : ` Furthest accomplishment was ${slippageInfo.daysOverdue} days beyond target completion date`}
                    {slippageInfo.isProgressComplete ? (
                      <span className="mt-1 block">
                        Although project is 100% complete, extension is required
                        due to late completion.
                      </span>
                    ) : (
                      <span>
                        {' '}
                        with {slippageInfo.percentage}% work remaining to reach
                        100% completion.
                      </span>
                    )}
                    {slippageInfo.hasExtension && (
                      <span className="mt-1 block text-orange-700">
                        <strong>Extension Applied:</strong> Target completion
                        date has been extended. Apply for another extension if
                        needed.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Move to Next Stage Button - RAED Only when progress is 100% */}
          {isRAED && isProgressComplete && (
            <div
              className={`mt-4 rounded-lg border p-4 ${
                slippageInfo && slippageInfo.isOverdue
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {slippageInfo && slippageInfo.isOverdue ? (
                    <XCircle className="h-5 w-5 text-orange-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <div>
                    <h5
                      className={`font-medium ${
                        slippageInfo && slippageInfo.isOverdue
                          ? 'text-orange-800'
                          : 'text-green-800'
                      }`}
                    >
                      {slippageInfo && slippageInfo.isOverdue
                        ? 'Project Cannot Proceed - Slippage Detected'
                        : 'Project Ready for Completion'}
                    </h5>
                    <p
                      className={`text-sm ${
                        slippageInfo && slippageInfo.isOverdue
                          ? 'text-orange-700'
                          : 'text-green-700'
                      }`}
                    >
                      {slippageInfo && slippageInfo.isOverdue
                        ? slippageInfo.isProgressComplete
                          ? 'Project is 100% complete but has slippage. Apply for extension to update target completion date before proceeding.'
                          : 'Project has slippage. Apply for extension to update target completion date before proceeding.'
                        : 'All implementation work has been completed. You can move this project to the Completed stage.'}
                    </p>
                    {(!contractEffectivity ||
                      !contractExpiry ||
                      !actualStartDate ||
                      !targetCompletionDate) && (
                      <p className="mt-1 text-xs text-orange-600">
                        ℹ️ Contract and timeline information will be validated
                        when moving to the completed stage
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
                      <Clock className="mr-2 h-4 w-4" />
                      Request Extension
                    </Button>
                  )}
                  <Button
                    onClick={handleMoveToNextStage}
                    className={`${
                      slippageInfo && slippageInfo.isOverdue
                        ? 'cursor-not-allowed bg-gray-400 hover:bg-gray-500'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                    disabled={!!(slippageInfo && slippageInfo.isOverdue)}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Move to Completed
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contract and Timeline Information - RAED Only */}
        {isRAED && (
          <div
            className={`space-y-4 rounded-lg border p-4 ${
              isContractSaved
                ? 'border-green-200 bg-green-50'
                : 'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar
                  className={`h-5 w-5 ${isContractSaved ? 'text-green-600' : 'text-blue-600'}`}
                />
                <h5
                  className={`font-medium ${isContractSaved ? 'text-green-800' : 'text-blue-800'}`}
                >
                  Contract & Timeline Information
                </h5>
                <Badge
                  variant="outline"
                  className={`${isContractSaved ? 'border-green-300 text-green-600' : 'border-blue-300 text-blue-600'}`}
                >
                  RAED Only
                </Badge>
                {isContractSaved && (
                  <Badge
                    variant="default"
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Saved
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {!isContractSaved && (
                  <Button
                    onClick={handleSaveContractInfo}
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save Contract Info
                  </Button>
                )}
                {isContractSaved && (
                  <>
                    <Button
                      onClick={handleToggleEditMode}
                      variant={isEditMode ? 'default' : 'outline'}
                      size="sm"
                      className={
                        isEditMode
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : ''
                      }
                    >
                      {isEditMode ? 'Cancel Edit' : 'Edit'}
                    </Button>
                    {isEditMode && (
                      <Button
                        onClick={handleSaveContractInfo}
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700"
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
              <div className="mb-4 rounded-lg border border-green-300 bg-green-100 p-3 duration-300 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {isInitialSave
                      ? 'Contract and timeline information saved successfully!'
                      : 'Changes saved successfully!'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-green-700">
                  {isInitialSave
                    ? 'Contract information saved. Click Edit to modify fields.'
                    : 'Fields are now locked. Click Edit to modify again.'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contract Effectivity *
                </label>
                {isContractSaved && !isEditMode ? (
                  <div className="w-full cursor-not-allowed rounded-md border border-green-300 bg-green-50 p-2 text-green-800">
                    {formatDateForDisplay(contractEffectivity)}
                  </div>
                ) : (
                  <input
                    type="date"
                    value={contractEffectivity}
                    onChange={(e) => {
                      setContractEffectivity(e.target.value)
                      if (contractValidationErrors.contractEffectivity) {
                        setContractValidationErrors((prev) => ({
                          ...prev,
                          contractEffectivity: false,
                        }))
                      }
                    }}
                    className={`w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      contractValidationErrors.contractEffectivity
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                )}
                {contractValidationErrors.contractEffectivity && (
                  <p className="mt-1 text-xs text-red-600">
                    Contract effectivity date is required
                  </p>
                )}
                {isContractSaved && !isEditMode && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ Locked - Saved on {formatDateForDisplay(new Date())}
                  </p>
                )}
                {isContractSaved && isEditMode && (
                  <p className="mt-1 text-xs text-orange-600">
                    ✏️ Edit mode - Make your changes and save
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contract Expiry *
                </label>
                {isContractSaved && !isEditMode ? (
                  <div className="w-full cursor-not-allowed rounded-md border border-green-300 bg-green-50 p-2 text-green-800">
                    {formatDateForDisplay(contractExpiry)}
                  </div>
                ) : (
                  <input
                    type="date"
                    value={contractExpiry}
                    onChange={(e) => {
                      setContractExpiry(e.target.value)
                      if (contractValidationErrors.contractExpiry) {
                        setContractValidationErrors((prev) => ({
                          ...prev,
                          contractExpiry: false,
                        }))
                      }
                    }}
                    className={`w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      contractValidationErrors.contractExpiry
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                )}
                {contractValidationErrors.contractExpiry && (
                  <p className="mt-1 text-xs text-red-600">
                    Contract expiry date is required
                  </p>
                )}
                {isContractSaved && !isEditMode && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ Locked - Saved on {formatDateForDisplay(new Date())}
                  </p>
                )}
                {isContractSaved && isEditMode && (
                  <p className="mt-1 text-xs text-orange-600">
                    ✏️ Edit mode - Make your changes and save
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Actual Start Date *
                </label>
                {isContractSaved && !isEditMode ? (
                  <div className="w-full cursor-not-allowed rounded-md border border-green-300 bg-green-50 p-2 text-green-800">
                    {formatDateForDisplay(actualStartDate)}
                  </div>
                ) : (
                  <input
                    type="date"
                    value={actualStartDate}
                    onChange={(e) => {
                      setActualStartDate(e.target.value)
                      if (contractValidationErrors.actualStartDate) {
                        setContractValidationErrors((prev) => ({
                          ...prev,
                          actualStartDate: false,
                        }))
                      }
                    }}
                    className={`w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      contractValidationErrors.actualStartDate
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                )}
                {contractValidationErrors.actualStartDate && (
                  <p className="mt-1 text-xs text-red-600">
                    Actual start date is required
                  </p>
                )}
                {isContractSaved && !isEditMode && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ Locked - Saved on {formatDateForDisplay(new Date())}
                  </p>
                )}
                {isContractSaved && isEditMode && (
                  <p className="mt-1 text-xs text-orange-600">
                    ✏️ Edit mode - Make your changes and save
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Target Completion Date *
                </label>
                <div className="flex gap-2">
                  {isContractSaved && !isEditMode ? (
                    <div className="flex-1 cursor-not-allowed rounded-md border border-green-300 bg-green-50 p-2 text-green-800">
                      {formatDateForDisplay(targetCompletionDate)}
                    </div>
                  ) : (
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
                          setContractValidationErrors((prev) => ({
                            ...prev,
                            targetCompletionDate: false,
                          }))
                        }
                      }}
                      className={`flex-1 rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                        contractValidationErrors.targetCompletionDate
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    />
                  )}
                  {(!isContractSaved || isEditMode) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExtensionModal(true)}
                      className="px-3"
                    >
                      <Clock className="mr-1 h-4 w-4" />
                      Extension
                    </Button>
                  )}
                </div>
                {contractValidationErrors.targetCompletionDate && (
                  <p className="mt-1 text-xs text-red-600">
                    Target completion date is required
                  </p>
                )}
                {initialTargetCompletionDate && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Initial target:{' '}
                    {formatDateForDisplay(initialTargetCompletionDate)}
                  </p>
                )}
                {isContractSaved && !isEditMode && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ Locked - Saved on {formatDateForDisplay(new Date())}
                  </p>
                )}
                {isContractSaved && isEditMode && (
                  <p className="mt-1 text-xs text-orange-600">
                    ✏️ Edit mode - Make your changes and save
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contract Extension Modal - Always available */}
        <Dialog open={showExtensionModal} onOpenChange={setShowExtensionModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Contract Extension</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Apply for an extension to update the target completion date.
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Initial Target Completion Date
                </label>
                <div className="rounded-md border bg-gray-50 p-2 text-sm">
                  {initialTargetCompletionDate
                    ? formatDateForDisplay(initialTargetCompletionDate)
                    : 'Not set yet'}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Current Target Completion Date
                </label>
                <div className="rounded-md border border-blue-200 bg-blue-50 p-2 text-sm">
                  {formatDateForDisplay(targetCompletionDate)}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  New Extended Target Completion Date *
                </label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  min={targetCompletionDate} // New date must be after current target date
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be after current target date:{' '}
                  {formatDateForDisplay(targetCompletionDate)}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Reason for Extension *
                </label>
                <textarea
                  value={extensionReason}
                  onChange={(e) => setExtensionReason(e.target.value)}
                  placeholder="Please provide a detailed reason for the contract extension..."
                  className="w-full resize-none rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {/* Extension History */}
              {extensionHistory.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Previous Extensions
                  </label>
                  <div className="max-h-32 space-y-2 overflow-y-auto">
                    {extensionHistory.map((extension, index) => (
                      <div
                        key={extension.id}
                        className="rounded-md border border-yellow-200 bg-yellow-50 p-2 text-xs"
                      >
                        <div className="font-medium">
                          Extension #{index + 1}
                        </div>
                        <div>
                          From: {formatDateForDisplay(extension.previousDate)}
                        </div>
                        <div>To: {formatDateForDisplay(extension.newDate)}</div>
                        <div className="mt-1 text-gray-600">
                          {extension.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowExtensionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyExtension}
                  disabled={
                    !newTargetDate ||
                    !extensionReason ||
                    new Date(newTargetDate) <= new Date(targetCompletionDate)
                  }
                >
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
                    Total:{' '}
                    {accomplishments.reduce(
                      (sum, acc) => sum + acc.progress,
                      0
                    )}
                    % ({accomplishments.length} items)
                  </p>
                )}
              </div>
              <Badge
                variant="outline"
                className="border-green-300 text-xs text-green-600"
              >
                RAED Only
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAccomplishmentModal(true)}
              className="h-10 border-2 border-blue-300 px-4 py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Accomplishment
            </Button>
          </div>

          {accomplishments.length > 0 ? (
            <div className="space-y-3">
              {accomplishments
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((accomplishment) => (
                  <div
                    key={accomplishment.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0 text-gray-500" />
                          <span className="text-sm font-medium">
                            {formatDateForDisplay(accomplishment.date)}
                          </span>
                          <Badge
                            variant={
                              accomplishment.progress >= 100
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {accomplishment.progress}%
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700">
                          {accomplishment.description}
                        </p>
                        {accomplishment.documents.length > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            <FileText className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-blue-600">
                              {accomplishment.documents.length} doc
                              {accomplishment.documents.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleEditAccomplishment(accomplishment.id)
                          }
                          className="h-6 w-6 p-0 hover:bg-blue-100"
                        >
                          <Edit2 className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteAccomplishment(accomplishment.id)
                          }
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
            <div className="py-6 text-center text-gray-500">
              <FileCheck className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm">No accomplishments recorded yet</p>
              <p className="text-xs text-gray-400">
                Click "Add Accomplishment" to start tracking progress
              </p>
            </div>
          )}

          {/* Add/Edit Accomplishment Modal */}
          <Dialog
            open={showAccomplishmentModal}
            onOpenChange={(open) => {
              setShowAccomplishmentModal(open)
              if (!open) {
                setEditingAccomplishment(null)
                setNewAccomplishment({ date: '', description: '', progress: 0 })
                setAccomplishmentValidationErrors({})
              }
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAccomplishment
                    ? 'Edit Project Accomplishment'
                    : 'Add Project Accomplishment'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newAccomplishment.date}
                    onChange={(e) => {
                      setNewAccomplishment((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                      if (accomplishmentValidationErrors.date) {
                        setAccomplishmentValidationErrors((prev) => ({
                          ...prev,
                          date: '',
                        }))
                      }
                    }}
                    className={`w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      accomplishmentValidationErrors.date
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {accomplishmentValidationErrors.date && (
                    <p className="mt-1 text-xs text-red-600">
                      {accomplishmentValidationErrors.date}
                    </p>
                  )}
                  {actualStartDate && targetCompletionDate && (
                    <p className="mt-1 text-xs text-gray-500">
                      Must be on or after{' '}
                      {formatDateForDisplay(actualStartDate)}. Dates beyond{' '}
                      {formatDateForDisplay(targetCompletionDate)} will show
                      slippage.
                    </p>
                  )}
                  {actualStartDate && !targetCompletionDate && (
                    <p className="mt-1 text-xs text-gray-500">
                      Must be on or after{' '}
                      {formatDateForDisplay(actualStartDate)}. Set target
                      completion date first to enable slippage detection.
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Progress Percentage *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAccomplishment.progress}
                    onChange={(e) => {
                      setNewAccomplishment((prev) => ({
                        ...prev,
                        progress: parseInt(e.target.value) || 0,
                      }))
                      if (accomplishmentValidationErrors.progress) {
                        setAccomplishmentValidationErrors((prev) => ({
                          ...prev,
                          progress: '',
                        }))
                      }
                    }}
                    className={`w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      accomplishmentValidationErrors.progress
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {accomplishmentValidationErrors.progress && (
                    <p className="mt-1 text-xs text-red-600">
                      {accomplishmentValidationErrors.progress}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Accomplishment Description *
                  </label>
                  <textarea
                    value={newAccomplishment.description}
                    onChange={(e) => {
                      setNewAccomplishment((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                      if (accomplishmentValidationErrors.description) {
                        setAccomplishmentValidationErrors((prev) => ({
                          ...prev,
                          description: '',
                        }))
                      }
                    }}
                    placeholder="Describe what was accomplished on this date..."
                    className={`w-full resize-none rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      accomplishmentValidationErrors.description
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    rows={3}
                  />
                  {accomplishmentValidationErrors.description && (
                    <p className="mt-1 text-xs text-red-600">
                      {accomplishmentValidationErrors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Supporting Documents (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload photos, reports, or other supporting documents
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAccomplishmentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddAccomplishment}
                    disabled={
                      !newAccomplishment.date || !newAccomplishment.description
                    }
                  >
                    {editingAccomplishment
                      ? 'Update Accomplishment'
                      : 'Add Accomplishment'}
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
          <h4 className="mb-2 font-medium">Implementation Timeline</h4>
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
        <div className="fixed right-4 top-4 z-50 duration-300 animate-in slide-in-from-right-full">
          <div
            className={`max-w-sm rounded-lg border p-4 shadow-lg ${
              toastMessage.variant === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : toastMessage.variant === 'error'
                  ? 'border-red-200 bg-red-50 text-red-800'
                  : 'border-gray-200 bg-white text-gray-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                  toastMessage.variant === 'success'
                    ? 'bg-green-500 text-white'
                    : toastMessage.variant === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                }`}
              >
                {toastMessage.variant === 'success' ? (
                  <Check className="h-3 w-3" />
                ) : toastMessage.variant === 'error' ? (
                  <XCircle className="h-3 w-3" />
                ) : (
                  <CheckCircle className="h-3 w-3" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium">{toastMessage.title}</h4>
                <p className="mt-1 text-xs opacity-90">
                  {toastMessage.description}
                </p>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-black/5"
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

function CompletedStepContent({
  project,
  onStepClick,
}: {
  project?: Project
  onStepClick?: (step: string) => void
}) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProject, setEditedProject] = useState<Project | null>(null)

  // File upload refs
  const cadFileRef = useRef<HTMLInputElement>(null)
  const pdfFileRef = useRef<HTMLInputElement>(null)
  const photoFileRef = useRef<HTMLInputElement>(null)

  const currentProject = editedProject || project

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProject({ ...project } as Project)
  }

  const handleSave = () => {
    // In a real app, this would update the project in the backend
    console.log('Project updated:', editedProject)

    // Temporarily update the project to show the changes
    if (editedProject) {
      // Update the project object with the edited data
      Object.assign(project as Project, editedProject)
    }

    setIsEditing(false)
    setEditedProject(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProject(null)
  }

  const handleDateChange = (
    field: 'dateCompleted' | 'dateTurnedOver',
    value: string
  ) => {
    if (editedProject) {
      setEditedProject({
        ...editedProject,
        [field]: value,
      })
    }
  }

  const handleFileUpload = (type: 'cad' | 'pdf' | 'photo') => {
    const ref =
      type === 'cad' ? cadFileRef : type === 'pdf' ? pdfFileRef : photoFileRef
    ref.current?.click()
  }

  const handleFileSelect = (
    type: 'cad' | 'pdf' | 'photo',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file || !editedProject) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const fileUrl = e.target?.result as string

      if (type === 'cad' || type === 'pdf') {
        setEditedProject({
          ...editedProject,
          asBuiltPlans: {
            ...editedProject.asBuiltPlans,
            [type]: fileUrl,
          },
        })
      } else if (type === 'photo') {
        setEditedProject({
          ...editedProject,
          postGeotaggedPhotos: [
            ...(editedProject.postGeotaggedPhotos || []),
            fileUrl,
          ],
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const removeFile = (type: 'cad' | 'pdf' | 'photo', index?: number) => {
    if (!editedProject) return

    if (type === 'cad' || type === 'pdf') {
      setEditedProject({
        ...editedProject,
        asBuiltPlans: {
          ...editedProject.asBuiltPlans,
          [type]: undefined,
        },
      })
    } else if (type === 'photo' && index !== undefined) {
      setEditedProject({
        ...editedProject,
        postGeotaggedPhotos: editedProject.postGeotaggedPhotos?.filter(
          (_, i) => i !== index
        ),
      })
    }
  }

  const canMoveToInventory = () => {
    return (
      currentProject?.asBuiltPlans?.cad &&
      currentProject?.asBuiltPlans?.pdf &&
      currentProject?.postGeotaggedPhotos &&
      currentProject.postGeotaggedPhotos.length > 0
    )
  }

  const handleMoveToInventory = () => {
    if (!editedProject) return

    const updatedProject = {
      ...editedProject,
      status: 'Inventory' as const,
      updatedAt: new Date().toISOString(),
    }

    // In a real app, this would update the project status in the backend
    console.log('Moving project to inventory:', updatedProject)

    // Call the step click handler to update the UI
    if (onStepClick) {
      onStepClick('inventory')
    }

    alert('Project has been successfully moved to the Inventory stage!')
  }

  const hasRequiredUploads = canMoveToInventory()
  const isRAED = user?.role === 'RAED'

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">
              Project Completion Details
            </h4>
            <p className="text-sm text-muted-foreground">
              Manage completion documentation and inventory transfer
            </p>
          </div>
        </div>
        {isRAED && !isEditing && (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        )}
        {isEditing && (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Date Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Date Completed
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Input
                type="date"
                value={currentProject?.dateCompleted || ''}
                onChange={(e) =>
                  handleDateChange('dateCompleted', e.target.value)
                }
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {currentProject?.dateCompleted
                    ? formatDate(currentProject.dateCompleted)
                    : 'Not specified'}
                </span>
                {!currentProject?.dateCompleted && (
                  <Badge variant="secondary" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Date Turned Over
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Input
                type="date"
                value={currentProject?.dateTurnedOver || ''}
                onChange={(e) =>
                  handleDateChange('dateTurnedOver', e.target.value)
                }
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {currentProject?.dateTurnedOver
                    ? formatDate(currentProject.dateTurnedOver)
                    : 'Not specified'}
                </span>
                {!currentProject?.dateTurnedOver && (
                  <Badge variant="secondary" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* As-Built Plans Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <CardTitle>As-Built Plans</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload CAD and PDF files of the completed project
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* CAD File Upload */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  CAD
                </Badge>
                <Label className="text-sm font-medium">CAD Files</Label>
              </div>
              {currentProject?.asBuiltPlans?.cad ? (
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">CAD file uploaded</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        window.open(currentProject.asBuiltPlans?.cad, '_blank')
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        window.open(currentProject.asBuiltPlans?.cad, '_blank')
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile('cad')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${isEditing ? 'border-primary/50 hover:border-primary hover:bg-muted/50' : 'cursor-not-allowed border-muted bg-muted/30'}`}
                  onClick={() => isEditing && handleFileUpload('cad')}
                >
                  <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm font-medium">Upload CAD File</p>
                  <p className="text-xs text-muted-foreground">
                    .dwg, .dxf, .cad files
                  </p>
                  {!isEditing && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Edit mode required
                    </Badge>
                  )}
                </div>
              )}
              <input
                ref={cadFileRef}
                type="file"
                accept=".dwg,.dxf,.cad"
                className="hidden"
                onChange={(e) => handleFileSelect('cad', e)}
              />
            </div>

            {/* PDF File Upload */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  PDF
                </Badge>
                <Label className="text-sm font-medium">PDF Files</Label>
              </div>
              {currentProject?.asBuiltPlans?.pdf ? (
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">PDF file uploaded</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        window.open(currentProject.asBuiltPlans?.pdf, '_blank')
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        window.open(currentProject.asBuiltPlans?.pdf, '_blank')
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile('pdf')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${isEditing ? 'border-primary/50 hover:border-primary hover:bg-muted/50' : 'cursor-not-allowed border-muted bg-muted/30'}`}
                  onClick={() => isEditing && handleFileUpload('pdf')}
                >
                  <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm font-medium">Upload PDF File</p>
                  <p className="text-xs text-muted-foreground">.pdf files</p>
                  {!isEditing && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Edit mode required
                    </Badge>
                  )}
                </div>
              )}
              <input
                ref={pdfFileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileSelect('pdf', e)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post-Geotagged Photos Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <CardTitle>Post-Geotagged Photos</CardTitle>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFileUpload('photo')}
              >
                <Image className="mr-2 h-4 w-4" />
                Add Photos
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Upload photos with GPS location data
          </p>
        </CardHeader>
        <CardContent>
          <input
            ref={photoFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect('photo', e)}
          />

          {/* Photo Grid */}
          {currentProject?.postGeotaggedPhotos &&
          currentProject.postGeotaggedPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
              {currentProject.postGeotaggedPhotos.map((photo, index) => (
                <div key={index} className="group relative aspect-square">
                  <img
                    src={photo}
                    alt={`Post-geotagged photo ${index + 1}`}
                    className="h-full w-full rounded-lg border object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/50">
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 w-7 p-0"
                        onClick={() => window.open(photo, '_blank')}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 w-7 p-0"
                          onClick={() => removeFile('photo', index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-xs text-white">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isEditing ? 'border-primary/50 hover:border-primary hover:bg-muted/50' : 'cursor-not-allowed border-muted bg-muted/30'}`}
              onClick={() => isEditing && handleFileUpload('photo')}
            >
              <Image className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="mb-1 text-sm font-medium">No photos uploaded yet</p>
              <p className="mb-3 text-xs text-muted-foreground">
                Upload photos with GPS location data
              </p>
              {!isEditing && (
                <Badge variant="secondary" className="text-xs">
                  Edit mode required
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Move to Inventory Section - RAED Only */}
      {isRAED && (
        <Card
          className={
            hasRequiredUploads
              ? 'border-green-200 bg-green-50/50'
              : 'border-orange-200 bg-orange-50/50'
          }
        >
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${hasRequiredUploads ? 'bg-green-100' : 'bg-orange-100'}`}
                >
                  <Package
                    className={`h-5 w-5 ${hasRequiredUploads ? 'text-green-600' : 'text-orange-600'}`}
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Move to Inventory Stage</h4>
                  <p className="text-sm text-muted-foreground">
                    Transfer project to inventory management
                  </p>
                </div>
              </div>
              <Button
                onClick={handleMoveToInventory}
                disabled={!hasRequiredUploads}
                className={
                  hasRequiredUploads ? '' : 'cursor-not-allowed opacity-50'
                }
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Move to Inventory
              </Button>
            </div>

            {/* Validation Status */}
            {!hasRequiredUploads && (
              <div className="rounded-lg border border-orange-200 bg-orange-100 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
                  <div>
                    <p className="mb-1 text-sm font-medium text-orange-800">
                      Requirements Not Met
                    </p>
                    <div className="text-xs text-orange-700">
                      <p className="mb-1">
                        To proceed to inventory stage, please ensure:
                      </p>
                      <ul className="ml-2 list-inside list-disc space-y-0.5">
                        <li>CAD as-built plan is uploaded</li>
                        <li>PDF as-built plan is uploaded</li>
                        <li>At least one post-geotagged photo is uploaded</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasRequiredUploads && (
              <div className="rounded-lg border border-green-200 bg-green-100 p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      All Requirements Met
                    </p>
                    <p className="text-xs text-green-700">
                      Project is ready to be moved to inventory stage.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InventoryStepContent({ project }: { project?: Project }) {
  // State for machine usage monitoring
  const [machineUsageData, setMachineUsageData] = useState<
    Array<{
      id: string
      machineName: string
      machineType: string
      serialNumber: string
      isUsed: boolean
      usageDate?: string
      usageDuration?: number
      operator?: string
      location?: string
      notes?: string
    }>
  >([
    {
      id: '1',
      machineName: 'Tractor Model A',
      machineType: 'Agricultural Tractor',
      serialNumber: 'TR-001-2024',
      isUsed: false,
    },
    {
      id: '2',
      machineName: 'Harvester Model B',
      machineType: 'Grain Harvester',
      serialNumber: 'HV-002-2024',
      isUsed: true,
      usageDate: '2024-01-15',
      usageDuration: 8,
      operator: 'Juan Dela Cruz',
      location: 'Farm Field 1',
      notes: 'Used for rice harvesting',
    },
  ])

  // New state for infrastructure monitoring features
  const [questionnaireScores, setQuestionnaireScores] = useState<
    Record<string, number>
  >({})
  const [infrastructureCondition, setInfrastructureCondition] =
    useState<string>('')
  const [machineryCondition, setMachineryCondition] = useState<string>('')
  const [inspectionNotes, setInspectionNotes] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Get project type from project data
  const projectType = project?.type || 'Infrastructure'

  // Infrastructure-specific questionnaire
  const infrastructureQuestionnaire = [
    {
      id: 'q1',
      question:
        'How satisfied are you with the overall infrastructure implementation?',
      category: 'General Satisfaction',
      weight: 1.0,
    },
    {
      id: 'q2',
      question:
        'Rate the quality of construction materials used in the infrastructure',
      category: 'Quality Assessment',
      weight: 0.9,
    },
    {
      id: 'q3',
      question:
        'How well was the infrastructure project completed within the specified timeline?',
      category: 'Timeline Performance',
      weight: 0.8,
    },
    {
      id: 'q4',
      question:
        'Rate the effectiveness of the infrastructure in meeting its intended purpose',
      category: 'Objective Achievement',
      weight: 1.0,
    },
    {
      id: 'q5',
      question:
        "How satisfied are you with the contractor's construction performance?",
      category: 'Contractor Performance',
      weight: 0.9,
    },
    {
      id: 'q6',
      question:
        'Rate the level of community involvement in the infrastructure project',
      category: 'Community Engagement',
      weight: 0.7,
    },
    {
      id: 'q7',
      question:
        'How well does the infrastructure address the identified community needs?',
      category: 'Need Fulfillment',
      weight: 1.0,
    },
    {
      id: 'q8',
      question:
        'Rate the structural integrity and long-term durability of the infrastructure',
      category: 'Structural Assessment',
      weight: 0.9,
    },
    {
      id: 'q9',
      question:
        'How satisfied are you with the infrastructure documentation and as-built plans?',
      category: 'Documentation',
      weight: 0.6,
    },
    {
      id: 'q10',
      question:
        'Rate the overall value for money of this infrastructure project',
      category: 'Value Assessment',
      weight: 0.8,
    },
    {
      id: 'q11',
      question:
        'How well does the infrastructure integrate with existing systems and facilities?',
      category: 'Integration',
      weight: 0.7,
    },
    {
      id: 'q12',
      question:
        'Rate the accessibility and usability of the completed infrastructure',
      category: 'Accessibility',
      weight: 0.8,
    },
  ]

  // Machinery-specific questionnaire
  const machineryQuestionnaire = [
    {
      id: 'q1',
      question:
        'How satisfied are you with the overall machinery delivery and setup?',
      category: 'General Satisfaction',
      weight: 1.0,
    },
    {
      id: 'q2',
      question: 'Rate the quality and condition of the delivered machinery',
      category: 'Quality Assessment',
      weight: 0.9,
    },
    {
      id: 'q3',
      question:
        'How well was the machinery delivered within the specified timeline?',
      category: 'Timeline Performance',
      weight: 0.8,
    },
    {
      id: 'q4',
      question:
        'Rate the effectiveness of the machinery in meeting its operational objectives',
      category: 'Objective Achievement',
      weight: 1.0,
    },
    {
      id: 'q5',
      question:
        "How satisfied are you with the supplier's delivery and installation performance?",
      category: 'Supplier Performance',
      weight: 0.9,
    },
    {
      id: 'q6',
      question:
        'Rate the level of community involvement in the machinery project',
      category: 'Community Engagement',
      weight: 0.7,
    },
    {
      id: 'q7',
      question:
        'How well does the machinery address the identified operational needs?',
      category: 'Need Fulfillment',
      weight: 1.0,
    },
    {
      id: 'q8',
      question:
        'Rate the operational efficiency and long-term reliability of the machinery',
      category: 'Operational Assessment',
      weight: 0.9,
    },
    {
      id: 'q9',
      question:
        'How satisfied are you with the machinery documentation and manuals?',
      category: 'Documentation',
      weight: 0.6,
    },
    {
      id: 'q10',
      question: 'Rate the overall value for money of this machinery project',
      category: 'Value Assessment',
      weight: 0.8,
    },
    {
      id: 'q11',
      question:
        'How well does the machinery integrate with existing equipment and systems?',
      category: 'Integration',
      weight: 0.7,
    },
    {
      id: 'q12',
      question: 'Rate the ease of operation and maintenance of the machinery',
      category: 'Usability',
      weight: 0.8,
    },
  ]

  // Select questionnaire based on project type
  const questionnaireItems =
    projectType === 'Infrastructure'
      ? infrastructureQuestionnaire
      : machineryQuestionnaire

  // Infrastructure condition options
  const infrastructureConditions = [
    {
      value: 'usable',
      label: 'Usable',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: 'damaged',
      label: 'Damaged',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      value: 'needs_repair',
      label: 'Needs Repair',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      value: 'under_maintenance',
      label: 'Under Maintenance',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      value: 'out_of_service',
      label: 'Out of Service',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ]

  // Machinery condition options
  const machineryConditions = [
    {
      value: 'working',
      label: 'Working',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: 'usable',
      label: 'Usable',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: 'damaged',
      label: 'Damaged',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      value: 'needs_maintenance',
      label: 'Needs Maintenance',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      value: 'out_of_order',
      label: 'Out of Order',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      value: 'under_repair',
      label: 'Under Repair',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ]

  // Mock inspection timeline data
  const mockInspectionTimeline = [
    {
      id: 'ins-001',
      date: '2024-01-15T09:00:00Z',
      type: 'Initial Inspection',
      inspector: 'RAED Inspector - Juan Santos',
      status: 'completed',
      findings:
        'Project completed according to specifications. All systems functioning properly.',
      score: 4.2,
      condition: 'usable',
    },
    {
      id: 'ins-002',
      date: '2024-07-15T10:30:00Z',
      type: '6-Month Review',
      inspector: 'RAED Inspector - Maria Rodriguez',
      status: 'completed',
      findings:
        'Infrastructure showing normal wear. Minor maintenance recommended.',
      score: 4.0,
      condition: 'usable',
    },
    {
      id: 'ins-003',
      date: '2025-01-15T08:45:00Z',
      type: 'Annual Inspection',
      inspector: 'RAED Inspector - Carlos Mendez',
      status: 'scheduled',
      findings: '',
      score: null,
      condition: null,
    },
  ]

  // Calculate overall satisfaction score
  const calculateOverallScore = () => {
    const scores = Object.values(questionnaireScores).filter(
      (score) => score > 0
    )
    if (scores.length === 0) return 0

    const totalScore = scores.reduce((sum, score) => sum + score, 0)
    return (totalScore / scores.length).toFixed(1)
  }

  // Get satisfaction level based on score
  const getSatisfactionLevel = (score: number) => {
    if (score >= 4.5)
      return {
        level: 'Excellent',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      }
    if (score >= 3.5)
      return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    if (score >= 2.5)
      return {
        level: 'Fair',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      }
    if (score >= 1.5)
      return {
        level: 'Poor',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      }
    return { level: 'Very Poor', color: 'text-red-600', bgColor: 'bg-red-50' }
  }

  const handleScoreChange = (questionId: string, score: number) => {
    setQuestionnaireScores((prev) => ({
      ...prev,
      [questionId]: score,
    }))
  }

  const handleSaveAssessment = () => {
    setShowSuccessMessage(true)
    setIsEditing(false)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const handleSaveProject = () => {
    // Save all project data
    const projectData = {
      questionnaireScores,
      infrastructureCondition,
      machineryCondition,
      inspectionNotes,
      overallScore: Number(calculateOverallScore()) || 0,
      satisfaction: getSatisfactionLevel(Number(calculateOverallScore()) || 0),
    }

    console.log('Project updated:', projectData)

    // Add save action to inspection timeline
    const saveLogEntry = {
      id: `save-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'Project Update',
      inspector: 'RAED User - Current Session',
      status: 'completed',
      findings: `Project assessment saved with overall score: ${Number(calculateOverallScore()) || 0}/5 (${getSatisfactionLevel(Number(calculateOverallScore()) || 0)})`,
      score: Number(calculateOverallScore()) || 0,
      condition:
        projectType === 'Infrastructure'
          ? infrastructureCondition
          : machineryCondition,
    }

    // Add to the beginning of the timeline
    mockInspectionTimeline.unshift(saveLogEntry)

    // Show toast notification
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const handleAddInspection = () => {
    const newInspection = {
      id: `ins-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'Routine Inspection',
      inspector: 'RAED Inspector - Current User',
      status: 'completed',
      findings: inspectionNotes,
      score: Number(calculateOverallScore()) || 0,
      condition: infrastructureCondition || machineryCondition,
    }

    console.log('New inspection added:', newInspection)
    setInspectionNotes('')
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const [showUsageForm, setShowUsageForm] = useState<boolean>(false)
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
  const [usageFormData, setUsageFormData] = useState({
    usageDate: '',
    usageDuration: '',
    operator: '',
    location: '',
    notes: '',
  })

  const handleUsageToggle = (machineId: string, isUsed: boolean) => {
    setMachineUsageData((prev) =>
      prev.map((machine) =>
        machine.id === machineId
          ? {
              ...machine,
              isUsed,
              usageDate: isUsed
                ? new Date().toISOString().split('T')[0]
                : undefined,
            }
          : machine
      )
    )
  }

  const handleUsageFormSubmit = (machineId: string) => {
    setMachineUsageData((prev) =>
      prev.map((machine) =>
        machine.id === machineId
          ? {
              ...machine,
              ...usageFormData,
              usageDuration: parseInt(usageFormData.usageDuration) || 0,
            }
          : machine
      )
    )
    setShowUsageForm(false)
    setSelectedMachine(null)
    setUsageFormData({
      usageDate: '',
      usageDuration: '',
      operator: '',
      location: '',
      notes: '',
    })
  }

  const openUsageForm = (machineId: string) => {
    const machine = machineUsageData.find((m) => m.id === machineId)
    if (machine) {
      setSelectedMachine(machineId)
      setUsageFormData({
        usageDate: machine.usageDate || '',
        usageDuration: machine.usageDuration?.toString() || '',
        operator: machine.operator || '',
        location: machine.location || '',
        notes: machine.notes || '',
      })
      setShowUsageForm(true)
    }
  }

  const getUsageIndicator = (machine: any) => {
    if (machine.isUsed) {
      return (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
          <span className="font-medium text-green-600">In Use</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gray-400"></div>
          <span className="font-medium text-gray-600">Not Used</span>
        </div>
      )
    }
  }

  const overallScore = Number(calculateOverallScore()) || 0
  const satisfaction = getSatisfactionLevel(overallScore)

  return (
    <div className="space-y-6">
      {/* Step Number for Machinery Projects */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-blue-600">Inventory</h3>
      </div>

      {/* DA-BAFE-PPMD Monitoring Section */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <CardTitle className="text-lg text-blue-900">
              Monitored by: DA-BAFE-PPMD
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-800">
                  Project Status
                </span>
              </div>
              <div className="text-xl font-bold text-green-900">Completed</div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-blue-800">
                  Last Inspection
                </span>
              </div>
              <div className="text-sm text-blue-900">
                {formatDate(
                  mockInspectionTimeline[1]?.date || new Date().toISOString()
                )}
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium text-purple-800">
                  Overall Score
                </span>
              </div>
              <div className="text-xl font-bold text-purple-900">
                {overallScore > 0 ? overallScore : 'N/A'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Accordion */}
      <div className="rounded-lg border bg-white transition-shadow duration-200 hover:shadow-md">
        <div className="border-b p-4">
          <h4 className="flex items-center gap-2 text-lg font-semibold">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            Project Assessment & Scoring
          </h4>
        </div>
        <div className="p-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="questionnaire"
              className="rounded-lg border transition-colors duration-200 hover:bg-muted/50"
            >
              <AccordionTrigger className="rounded-lg transition-colors duration-200 hover:bg-muted/30 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="font-semibold">
                    Satisfaction Questionnaire
                  </span>
                  <Badge variant="outline" className="ml-2">
                    {Object.keys(questionnaireScores).length}/
                    {questionnaireItems.length} completed
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {/* Overall Score Display */}
                  {overallScore > 0 && (
                    <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold">
                            Overall Satisfaction Score
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Based on completed assessments
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-3xl font-bold ${satisfaction.color}`}
                          >
                            {overallScore}/5.0
                          </div>
                          <div
                            className={`text-sm font-medium ${satisfaction.color}`}
                          >
                            {satisfaction.level}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Questionnaire Items */}
                  <div className="space-y-4">
                    {questionnaireItems.map((item) => (
                      <div key={item.id} className="rounded-lg border p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="mb-1 text-sm font-medium text-gray-900">
                                {item.question}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Weight: {item.weight}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Rating:</span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    onClick={() =>
                                      handleScoreChange(item.id, rating)
                                    }
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-200 ${
                                      questionnaireScores[item.id] === rating
                                        ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                        : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
                                    }`}
                                  >
                                    {rating}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Infrastructure/Machinery Condition Assessment */}
      <div className="rounded-lg border bg-white transition-shadow duration-200 hover:shadow-md">
        <div className="border-b p-4">
          <h4 className="flex items-center gap-2 text-lg font-semibold">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            {projectType === 'Infrastructure'
              ? 'Infrastructure'
              : 'Machinery'}{' '}
            Condition Assessment
          </h4>
        </div>
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Condition:</Label>
              <select
                value={
                  projectType === 'Infrastructure'
                    ? infrastructureCondition
                    : machineryCondition
                }
                onChange={(e) => {
                  if (projectType === 'Infrastructure') {
                    setInfrastructureCondition(e.target.value)
                  } else {
                    setMachineryCondition(e.target.value)
                  }
                }}
                className="w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select condition</option>
                {(projectType === 'Infrastructure'
                  ? infrastructureConditions
                  : machineryConditions
                ).map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Assessment Notes:</Label>
              <input
                placeholder="Add assessment notes..."
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                className="w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Current Condition Display */}
          {((projectType === 'Infrastructure' && infrastructureCondition) ||
            (projectType === 'Machinery' && machineryCondition)) && (
            <div className="rounded-lg border bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Current Status:</span>
                {(() => {
                  const condition =
                    projectType === 'Infrastructure'
                      ? infrastructureCondition
                      : machineryCondition
                  const conditionData = (
                    projectType === 'Infrastructure'
                      ? infrastructureConditions
                      : machineryConditions
                  ).find((c) => c.value === condition)
                  return (
                    <Badge
                      className={`${conditionData?.bgColor} ${conditionData?.color} border-0`}
                    >
                      {conditionData?.label}
                    </Badge>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveProject}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-md transition-colors duration-200 hover:bg-primary/90 hover:shadow-lg"
        >
          Save Project Updates
        </button>
      </div>

      {/* Inspection Timeline Accordion */}
      <div className="rounded-lg border bg-white transition-shadow duration-200 hover:shadow-md">
        <div className="border-b p-4">
          <h4 className="flex items-center gap-2 text-lg font-semibold">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            Inspection Timeline & Logs
          </h4>
        </div>
        <div className="p-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="timeline"
              className="rounded-lg border transition-colors duration-200 hover:bg-muted/50"
            >
              <AccordionTrigger className="rounded-lg transition-colors duration-200 hover:bg-muted/30 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="font-semibold">Inspection History</span>
                  <Badge variant="outline" className="ml-2">
                    {
                      mockInspectionTimeline.filter(
                        (i) => i.status === 'completed'
                      ).length
                    }{' '}
                    completed
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {/* Timeline */}
                  <div className="space-y-3">
                    {mockInspectionTimeline.map((inspection, index) => (
                      <div
                        key={inspection.id}
                        className="flex items-start gap-4 rounded-lg border p-4"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`mt-2 h-3 w-3 rounded-full ${
                              inspection.status === 'completed'
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{inspection.type}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(inspection.date)} •{' '}
                                {inspection.inspector}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {inspection.status === 'completed' && (
                                <>
                                  {inspection.score && (
                                    <Badge
                                      variant="outline"
                                      className="border-green-200 text-green-600"
                                    >
                                      Score: {inspection.score}/5
                                    </Badge>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className="border-blue-200 text-blue-600"
                                  >
                                    {inspection.condition}
                                  </Badge>
                                </>
                              )}
                              {inspection.status === 'scheduled' && (
                                <Badge
                                  variant="outline"
                                  className="border-yellow-200 text-yellow-600"
                                >
                                  Scheduled
                                </Badge>
                              )}
                            </div>
                          </div>
                          {inspection.findings && (
                            <p className="rounded bg-gray-50 p-2 text-sm text-gray-600">
                              {inspection.findings}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Inspection */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h4 className="mb-2 font-medium text-blue-900">
                      Add New Inspection
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Inspection Notes:</Label>
                        <input
                          placeholder="Record inspection findings..."
                          value={inspectionNotes}
                          onChange={(e) => setInspectionNotes(e.target.value)}
                          className="w-full rounded-md border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={handleAddInspection}
                        className="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                      >
                        Add Inspection Record
                      </button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Success Message Modal */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-lg rounded-xl border bg-card p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-emerald-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-foreground">
              Assessment Saved
            </h3>
            <p className="mb-6 text-muted-foreground">
              Your project assessment has been successfully saved and recorded.
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-green-600"></div>
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed right-4 top-4 z-[9999] duration-300 animate-in slide-in-from-right">
          <div className="max-w-sm rounded-lg border bg-card p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  Project Updated
                </h4>
                <p className="text-xs text-muted-foreground">
                  Your project has been successfully updated and saved.
                </p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Machinery-specific stage components
function ForDeliveryStepContent({
  project,
  onStepClick,
}: {
  project?: Project
  onStepClick: (step: string) => void
}) {
  const [formData, setFormData] = useState({
    deliveryDate: project?.deliveryDate || '',
    inspectionDate: project?.inspectionDate || '',
    inspectorName: project?.inspectorName || '',
    machineBrand: project?.machineBrand || '',
    engineType: project?.engineType || '',
    engineSerialNumber: project?.engineSerialNumber || '',
    chasisSerialNumber: project?.chasisSerialNumber || '',
    ratedPower: project?.ratedPower || '',
    capacity: project?.capacity || '',
    remarks: project?.remarks || '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNextStage = () => {
    // Here you would typically save the form data to the project
    console.log('For Delivery data:', formData)
    onStepClick('delivered')
  }

  const isFormValid = () => {
    return (
      formData.deliveryDate &&
      formData.inspectionDate &&
      formData.inspectorName &&
      formData.machineBrand &&
      formData.engineType &&
      formData.engineSerialNumber &&
      formData.chasisSerialNumber &&
      formData.ratedPower &&
      formData.capacity
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium">Step 3: For Delivery - RAED Upload</h4>
        <p className="mb-4 text-sm text-muted-foreground">
          Please fill in the delivery and inspection details for the machinery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="deliveryDate">Delivery Date *</Label>
          <Input
            id="deliveryDate"
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inspectionDate">Inspection Date *</Label>
          <Input
            id="inspectionDate"
            type="date"
            value={formData.inspectionDate}
            onChange={(e) =>
              handleInputChange('inspectionDate', e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inspectorName">Name of Inspector *</Label>
          <Input
            id="inspectorName"
            value={formData.inspectorName}
            onChange={(e) => handleInputChange('inspectorName', e.target.value)}
            placeholder="Enter inspector name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="machineBrand">Machine Brand *</Label>
          <Input
            id="machineBrand"
            value={formData.machineBrand}
            onChange={(e) => handleInputChange('machineBrand', e.target.value)}
            placeholder="Enter machine brand"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="engineType">Engine Type *</Label>
          <Input
            id="engineType"
            value={formData.engineType}
            onChange={(e) => handleInputChange('engineType', e.target.value)}
            placeholder="Enter engine type"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="engineSerialNumber">Engine Serial Number *</Label>
          <Input
            id="engineSerialNumber"
            value={formData.engineSerialNumber}
            onChange={(e) =>
              handleInputChange('engineSerialNumber', e.target.value)
            }
            placeholder="Enter engine serial number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chasisSerialNumber">Chasis Serial Number *</Label>
          <Input
            id="chasisSerialNumber"
            value={formData.chasisSerialNumber}
            onChange={(e) =>
              handleInputChange('chasisSerialNumber', e.target.value)
            }
            placeholder="Enter chasis serial number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ratedPower">Rated Power *</Label>
          <Input
            id="ratedPower"
            value={formData.ratedPower}
            onChange={(e) => handleInputChange('ratedPower', e.target.value)}
            placeholder="Enter rated power"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            placeholder="Enter capacity"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            placeholder="Enter any additional remarks"
            className="h-20 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNextStage}
          disabled={!isFormValid()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Next Stage
        </Button>
      </div>
    </div>
  )
}

function DeliveredStepContent({
  project,
  onStepClick,
}: {
  project?: Project
  onStepClick: (step: string) => void
}) {
  const [formData, setFormData] = useState({
    dateTurnover: project?.dateTurnover || '',
    representativeBeneficiary: project?.representativeBeneficiary || '',
    beneficiaryNumber: project?.beneficiaryNumber || '',
    geotagPhotos: project?.geotagPhotos || [],
    proofOfTurnover: project?.proofOfTurnover || [],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUpload = (
    field: 'geotagPhotos' | 'proofOfTurnover',
    files: FileList | null
  ) => {
    if (files) {
      const fileArray = Array.from(files)
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], ...fileArray.map((f) => f.name)],
      }))
    }
  }

  const handleNextStage = () => {
    // Here you would typically save the form data to the project
    console.log('Delivered data:', formData)
    onStepClick('inventory')
  }

  const isFormValid = () => {
    return (
      formData.dateTurnover &&
      formData.representativeBeneficiary &&
      formData.beneficiaryNumber &&
      formData.geotagPhotos.length > 0 &&
      formData.proofOfTurnover.length > 0
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium">
          Step 4: Delivered - Turnover Details
        </h4>
        <p className="mb-4 text-sm text-muted-foreground">
          Please complete all turnover details to proceed to inventory stage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dateTurnover">Date Turnover *</Label>
          <Input
            id="dateTurnover"
            type="date"
            value={formData.dateTurnover}
            onChange={(e) => handleInputChange('dateTurnover', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="representativeBeneficiary">
            Representative/Beneficiary *
          </Label>
          <Input
            id="representativeBeneficiary"
            value={formData.representativeBeneficiary}
            onChange={(e) =>
              handleInputChange('representativeBeneficiary', e.target.value)
            }
            placeholder="Enter representative/beneficiary name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beneficiaryNumber">Beneficiary Number *</Label>
          <Input
            id="beneficiaryNumber"
            value={formData.beneficiaryNumber}
            onChange={(e) =>
              handleInputChange('beneficiaryNumber', e.target.value)
            }
            placeholder="Enter beneficiary number"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="geotagPhotos">Geotag Photos *</Label>
          <input
            type="file"
            id="geotagPhotos"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload('geotagPhotos', e.target.files)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.geotagPhotos.length > 0 && (
            <div className="text-sm text-green-600">
              {formData.geotagPhotos.length} photo(s) uploaded
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="proofOfTurnover">Proof of Turnover (Photo) *</Label>
          <input
            type="file"
            id="proofOfTurnover"
            multiple
            accept="image/*"
            onChange={(e) =>
              handleFileUpload('proofOfTurnover', e.target.files)
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.proofOfTurnover.length > 0 && (
            <div className="text-sm text-green-600">
              {formData.proofOfTurnover.length} photo(s) uploaded
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNextStage}
          disabled={!isFormValid()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Next Stage
        </Button>
      </div>
    </div>
  )
}
