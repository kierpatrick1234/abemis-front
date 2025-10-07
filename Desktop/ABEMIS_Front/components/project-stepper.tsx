'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, FileText, ShoppingCart, Wrench, CheckCircle, Package, X, Upload, Plus, Eye, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Project {
  title?: string
  [key: string]: unknown
}

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
  const [activeStep, setActiveStep] = useState(currentStatus)

  const getStepIndex = (step: string) => {
    // Map project statuses to stepper steps
    const statusToStepMap: { [key: string]: string } = {
      'Proposal': 'proposal',
      'Procurement': 'procurement', 
      'Implementation': 'implementation',
      'Completed': 'completed'
    }
    
    const mappedStep = statusToStepMap[step] || step
    const index = steps.findIndex(s => s.key === mappedStep)
    return index >= 0 ? index : 0
  }

  const currentStepIndex = getStepIndex(currentStatus)
  

  const isStepAccessible = (stepIndex: number) => {
    // Can only click on steps up to and including the current status
    // If current status is "completed" (index 3), can click on steps 0,1,2,3
    // If current status is "implementation" (index 2), can click on steps 0,1,2
    // If current status is "procurement" (index 1), can click on steps 0,1
    // If current status is "proposal" (index 0), can click on step 0
    return stepIndex <= currentStepIndex
  }

  const handleStepClick = (step: string, stepIndex: number) => {
    if (isStepAccessible(stepIndex)) {
      setActiveStep(step)
      onStepClick(step)
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
                "flex flex-col items-center flex-1 min-w-0 p-2 rounded-lg transition-all duration-200",
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
                      "bg-primary text-primary-foreground border-primary": stepStatus === 'completed' || stepStatus === 'current',
                      "bg-muted text-muted-foreground border-muted": stepStatus === 'upcoming',
                      "cursor-pointer hover:scale-105 hover:bg-primary/10": isAccessible,
                      "cursor-not-allowed opacity-50": !isAccessible,
                      "ring-2 ring-primary ring-offset-2": isActive
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
                      "bg-primary": stepStatus === 'completed',
                      "bg-muted": stepStatus === 'upcoming'
                    }
                  )} />
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center w-full px-1">
                <p className={cn(
                  "text-sm font-medium truncate",
                  {
                    "text-primary": stepStatus === 'completed' || stepStatus === 'current',
                    "text-muted-foreground": stepStatus === 'upcoming',
                    "hover:text-primary": isAccessible && stepStatus !== 'completed' && stepStatus !== 'current'
                  }
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-tight break-words">
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
            {activeStep === currentStatus && (
              <Badge variant="secondary" className="ml-2">Current</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeStep === 'proposal' && (
            <ProposalStepContent projectType={projectType} currentStatus={currentStatus} project={project} />
          )}
          {activeStep === 'procurement' && (
            <ProcurementStepContent currentStatus={currentStatus} />
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
  const evaluator = projectType === 'FMR' ? 'SEPD' : 'EPDSD'
  const isBeyondProposal = currentStatus && ['Procurement', 'Implementation', 'Completed'].includes(currentStatus)
  const [uploadingDocuments, setUploadingDocuments] = useState<Set<string>>(new Set())
  const [previewDocument, setPreviewDocument] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [hoveredDocument, setHoveredDocument] = useState<string | null>(null)
  
  const handleDocumentUpload = (documentType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadingDocuments(prev => new Set(prev).add(documentType))
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

  const handleDocumentPreview = (documentType: string) => {
    setPreviewDocument(documentType)
    setShowPreview(true)
  }

  const mockDocumentContent = (documentType: string) => {
    const contents = {
      'letter-of-intent': {
        title: 'Letter of Intent',
        content: 'This is a mock Letter of Intent document. It contains the formal expression of intent to proceed with the project proposal...',
        preview: 'Formal expression of intent to proceed with the project proposal. Contains project objectives, scope, and commitment details.'
      },
      'validation-report': {
        title: 'Validation Report',
        content: 'This is a mock Validation Report document. It contains the validation findings and recommendations for the project...',
        preview: 'Validation findings and recommendations for the project. Includes technical assessment and compliance verification.'
      },
      'fs-efa': {
        title: 'Feasibility Study/Environmental Impact Assessment',
        content: 'This is a mock FS/EFA document. It contains the feasibility study results and environmental impact assessment...',
        preview: 'Feasibility study results and environmental impact assessment. Contains technical analysis and environmental compliance.'
      },
      'ded': {
        title: 'Detailed Engineering Design',
        content: 'This is a mock DED document. It contains the detailed engineering specifications and design plans...',
        preview: 'Detailed engineering specifications and design plans. Includes technical drawings, specifications, and implementation details.'
      },
      'pow': {
        title: 'Program of Work',
        content: 'This is a mock POW document. It contains the detailed program of work and implementation schedule...',
        preview: 'Detailed program of work and implementation schedule. Contains project timeline, milestones, and resource allocation.'
      },
      'right-of-way': {
        title: 'Right of Way Documents',
        content: 'This is a mock Right of Way document. It contains the legal documents and agreements for land access...',
        preview: 'Legal documents and agreements for land access. Contains property rights, easements, and land use permissions.'
      },
      'others': {
        title: 'Other Supporting Documents',
        content: 'This is a mock document containing other supporting materials and additional requirements...',
        preview: 'Other supporting materials and additional requirements. Contains supplementary documentation and compliance materials.'
      }
    }
    return contents[documentType as keyof typeof contents] || { title: 'Document', content: 'Mock document content...', preview: 'Document preview...' }
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Evaluator</h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{evaluator}</Badge>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Status</h4>
          <Badge variant={isBeyondProposal ? "default" : "secondary"}>
            {isBeyondProposal ? "All Documents Reviewed" : "Under Review"}
          </Badge>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Required Documents</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6 text-green-600" />
              <span className="text-sm">Letter of Intent</span>
            </div>
            <div className="relative">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDocumentPreview('letter-of-intent')}
                className="cursor-pointer hover:bg-muted"
                onMouseEnter={() => setHoveredDocument('letter-of-intent')}
                onMouseLeave={() => setHoveredDocument(null)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              
              {/* PDF Document Preview */}
              {hoveredDocument === 'letter-of-intent' && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  {/* PDF Header */}
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-sm">Letter of Intent.pdf</span>
                      <span className="text-xs text-gray-500 ml-auto">2.4 MB</span>
                    </div>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="p-4 max-h-80 overflow-y-auto bg-white">
                    <div className="text-xs leading-relaxed text-gray-800">
                      <h3 className="font-bold text-sm mb-3 text-center">LETTER OF INTENT</h3>
                      <p className="mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                      <p className="mb-2">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p className="mb-2">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                      <p className="mb-2">
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                      </p>
                      <p className="mb-2">
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                      </p>
                    </div>
                  </div>
                  
                  {/* PDF Footer */}
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Page 1 of 3</span>
                      <span>✅ Approved</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6 text-green-600" />
              <span className="text-sm">Validation Report</span>
            </div>
            <div className="relative">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDocumentPreview('validation-report')}
                className="cursor-pointer hover:bg-muted"
                onMouseEnter={() => setHoveredDocument('validation-report')}
                onMouseLeave={() => setHoveredDocument(null)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              
              {/* PDF Document Preview */}
              {hoveredDocument === 'validation-report' && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  {/* PDF Header */}
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-sm">Validation Report.pdf</span>
                      <span className="text-xs text-gray-500 ml-auto">1.8 MB</span>
                    </div>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="p-4 max-h-80 overflow-y-auto bg-white">
                    <div className="text-xs leading-relaxed text-gray-800">
                      <h3 className="font-bold text-sm mb-3 text-center">PROJECT VALIDATION REPORT</h3>
                      <p className="mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                      <p className="mb-2">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p className="mb-2">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                    </div>
                  </div>
                  
                  {/* PDF Footer */}
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Page 1 of 2</span>
                      <span>✅ Approved</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6 text-green-600" />
              <span className="text-sm">FS/EFA (Feasibility Study/Environmental Impact Assessment)</span>
            </div>
            <div className="relative">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDocumentPreview('fs-efa')}
                className="cursor-pointer hover:bg-muted"
                onMouseEnter={() => setHoveredDocument('fs-efa')}
                onMouseLeave={() => setHoveredDocument(null)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              
              {/* PDF Document Preview */}
              {hoveredDocument === 'fs-efa' && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  {/* PDF Header */}
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-sm">FS-EFA Report.pdf</span>
                      <span className="text-xs text-gray-500 ml-auto">3.2 MB</span>
                    </div>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="p-4 max-h-80 overflow-y-auto bg-white">
                    <div className="text-xs leading-relaxed text-gray-800">
                      <h3 className="font-bold text-sm mb-3 text-center">FEASIBILITY STUDY & ENVIRONMENTAL IMPACT ASSESSMENT</h3>
                      <p className="mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                      <p className="mb-2">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p className="mb-2">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                    </div>
                  </div>
                  
                  {/* PDF Footer */}
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Page 1 of 4</span>
                      <span>✅ Approved</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6 text-green-600" />
              <span className="text-sm">DED (Detailed Engineering Design)</span>
            </div>
            <div className="relative">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDocumentPreview('ded')}
                className="cursor-pointer hover:bg-muted"
                onMouseEnter={() => setHoveredDocument('ded')}
                onMouseLeave={() => setHoveredDocument(null)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              
              {/* PDF Document Preview */}
              {hoveredDocument === 'ded' && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  {/* PDF Header */}
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-sm">DED Plans.pdf</span>
                      <span className="text-xs text-gray-500 ml-auto">4.1 MB</span>
                    </div>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="p-4 max-h-80 overflow-y-auto bg-white">
                    <div className="text-xs leading-relaxed text-gray-800">
                      <h3 className="font-bold text-sm mb-3 text-center">DETAILED ENGINEERING DESIGN</h3>
                      <p className="mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                      <p className="mb-2">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p className="mb-2">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                    </div>
                  </div>
                  
                  {/* PDF Footer */}
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Page 1 of 5</span>
                      <span>✅ Approved</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6 text-green-600" />
              <span className="text-sm">POW (Program of Work)</span>
            </div>
            <div className="relative">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDocumentPreview('pow')}
                className="cursor-pointer hover:bg-muted"
                onMouseEnter={() => setHoveredDocument('pow')}
                onMouseLeave={() => setHoveredDocument(null)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              
              {/* PDF Document Preview */}
              {hoveredDocument === 'pow' && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  {/* PDF Header */}
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-sm">Program of Work.pdf</span>
                      <span className="text-xs text-gray-500 ml-auto">2.7 MB</span>
                    </div>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="p-4 max-h-80 overflow-y-auto bg-white">
                    <div className="text-xs leading-relaxed text-gray-800">
                      <h3 className="font-bold text-sm mb-3 text-center">PROGRAM OF WORK</h3>
                      <p className="mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                      <p className="mb-2">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p className="mb-2">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                    </div>
                  </div>
                  
                  {/* PDF Footer */}
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Page 1 of 3</span>
                      <span>✅ Approved</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between p-3 border rounded-lg relative group hover:bg-muted/50 transition-colors cursor-pointer"
            onMouseEnter={() => setHoveredDocument('right-of-way')}
            onMouseLeave={() => setHoveredDocument(null)}
          >
            <div className="flex items-center gap-3">
              {isBeyondProposal ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <X className="h-6 w-6 text-red-600" />
              )}
              <span className="text-sm">Right of Way Documents</span>
            </div>
            {isBeyondProposal ? (
              <div className="relative">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDocumentPreview('right-of-way')}
                  className="cursor-pointer hover:bg-muted"
                  onMouseEnter={() => setHoveredDocument('right-of-way')}
                  onMouseLeave={() => setHoveredDocument(null)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ) : (
          <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleDocumentUpload('right-of-way', e)}
                  className="hidden"
                  id="right-of-way-upload"
                  disabled={uploadingDocuments.has('right-of-way')}
                />
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={() => document.getElementById('right-of-way-upload')?.click()}
                  disabled={uploadingDocuments.has('right-of-way')}
                >
                  {uploadingDocuments.has('right-of-way') ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
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
            )}
            
            {/* PDF Document Preview */}
            {hoveredDocument === 'right-of-way' && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                {/* PDF Header */}
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-sm">Right of Way Documents.pdf</span>
                    <span className="text-xs text-gray-500 ml-auto">{isBeyondProposal ? '3.5 MB' : 'Not uploaded'}</span>
                  </div>
                </div>
                
                {/* PDF Content */}
                <div className="p-4 max-h-80 overflow-y-auto bg-white">
                  <div className="text-xs leading-relaxed text-gray-800">
                    <h3 className="font-bold text-sm mb-3 text-center">RIGHT OF WAY DOCUMENTS</h3>
                    {isBeyondProposal ? (
                      <>
                        <p className="mb-2">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>
                        <p className="mb-2">
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p className="mb-2">
                          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <X className="h-12 w-12 mx-auto mb-2 text-red-400" />
                        <p className="text-sm">Document not uploaded</p>
                        <p className="text-xs">Click Upload to add this document</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* PDF Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 rounded-b-lg">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{isBeyondProposal ? 'Page 1 of 2' : 'No pages'}</span>
                    <span>{isBeyondProposal ? '✅ Approved' : '❌ Missing'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div 
            className="flex items-center justify-between p-3 border rounded-lg relative group hover:bg-muted/50 transition-colors cursor-pointer"
            onMouseEnter={() => setHoveredDocument('others')}
            onMouseLeave={() => setHoveredDocument(null)}
          >
            <div className="flex items-center gap-3">
              {isBeyondProposal ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <X className="h-6 w-6 text-red-600" />
              )}
              <span className="text-sm">Others</span>
            </div>
            {isBeyondProposal ? (
              <div className="relative">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDocumentPreview('others')}
                  className="cursor-pointer hover:bg-muted"
                  onMouseEnter={() => setHoveredDocument('others')}
                  onMouseLeave={() => setHoveredDocument(null)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ) : (
          <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleDocumentUpload('others', e)}
                  className="hidden"
                  id="others-upload"
                  disabled={uploadingDocuments.has('others')}
                />
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={() => document.getElementById('others-upload')?.click()}
                  disabled={uploadingDocuments.has('others')}
                >
                  {uploadingDocuments.has('others') ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
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
            )}
            
            {/* PDF Document Preview */}
            {hoveredDocument === 'others' && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                {/* PDF Header */}
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-sm">Other Documents.pdf</span>
                    <span className="text-xs text-gray-500 ml-auto">{isBeyondProposal ? '2.9 MB' : 'Not uploaded'}</span>
                  </div>
                </div>
                
                {/* PDF Content */}
                <div className="p-4 max-h-80 overflow-y-auto bg-white">
                  <div className="text-xs leading-relaxed text-gray-800">
                    <h3 className="font-bold text-sm mb-3 text-center">OTHER SUPPORTING DOCUMENTS</h3>
                    {isBeyondProposal ? (
                      <>
                        <p className="mb-2">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>
                        <p className="mb-2">
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p className="mb-2">
                          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <X className="h-12 w-12 mx-auto mb-2 text-red-400" />
                        <p className="text-sm">Document not uploaded</p>
                        <p className="text-xs">Click Upload to add this document</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* PDF Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 rounded-b-lg">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{isBeyondProposal ? 'Page 1 of 2' : 'No pages'}</span>
                    <span>{isBeyondProposal ? '✅ Approved' : '❌ Missing'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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

      <div>
        <h4 className="font-medium mb-2">Comments</h4>
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {isBeyondProposal 
              ? "All necessary documents are complete and the proposal has been successfully forwarded to the next stage."
              : "Please provide the Right of Way Documents and other supporting documents to proceed with the evaluation."
            }
          </p>
        </div>
      </div>

      {/* Document Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <File className="h-5 w-5 text-red-600" />
              {previewDocument && mockDocumentContent(previewDocument).title}
            </DialogTitle>
          </DialogHeader>
          
          {/* PDF Document Viewer */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {/* PDF Header */}
            <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-red-600" />
                  <span className="font-medium">
                    {previewDocument === 'letter-of-intent' && 'Letter of Intent.pdf'}
                    {previewDocument === 'validation-report' && 'Validation Report.pdf'}
                    {previewDocument === 'fs-efa' && 'FS-EFA Report.pdf'}
                    {previewDocument === 'ded' && 'DED Plans.pdf'}
                    {previewDocument === 'pow' && 'Program of Work.pdf'}
                    {previewDocument === 'right-of-way' && 'Right of Way Documents.pdf'}
                    {previewDocument === 'others' && 'Other Documents.pdf'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {previewDocument === 'letter-of-intent' && '2.4 MB'}
                    {previewDocument === 'validation-report' && '1.8 MB'}
                    {previewDocument === 'fs-efa' && '3.2 MB'}
                    {previewDocument === 'ded' && '4.1 MB'}
                    {previewDocument === 'pow' && '2.7 MB'}
                    {previewDocument === 'right-of-way' && '3.5 MB'}
                    {previewDocument === 'others' && '2.9 MB'}
                  </span>
                  <span>✅ Approved</span>
                </div>
              </div>
            </div>
            
            {/* PDF Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto bg-white">
              <div className="text-sm leading-relaxed text-gray-800">
                {previewDocument === 'letter-of-intent' && (
                  <>
                    <h3 className="font-bold text-lg mb-2 text-center">LETTER OF INTENT</h3>
                    <h4 className="font-semibold text-base mb-4 text-center text-blue-700">
                      {project?.title || 'Project Title'}
                    </h4>
                    <p className="mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="mb-3">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="mb-3">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                    <p className="mb-3">
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </p>
                    <p className="mb-3">
                      Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                    </p>
                  </>
                )}
                
                {previewDocument === 'validation-report' && (
                  <>
                    <h3 className="font-bold text-lg mb-2 text-center">PROJECT VALIDATION REPORT</h3>
                    <h4 className="font-semibold text-base mb-4 text-center text-blue-700">
                      {project?.title || 'Project Title'}
                    </h4>
                    <p className="mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="mb-3">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="mb-3">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </>
                )}
                
                {previewDocument === 'fs-efa' && (
                  <>
                    <h3 className="font-bold text-lg mb-2 text-center">FEASIBILITY STUDY & ENVIRONMENTAL IMPACT ASSESSMENT</h3>
                    <h4 className="font-semibold text-base mb-4 text-center text-blue-700">
                      {project?.title || 'Project Title'}
                    </h4>
                    <p className="mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="mb-3">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="mb-3">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </>
                )}
                
                {previewDocument === 'ded' && (
                  <>
                    <h3 className="font-bold text-lg mb-2 text-center">DETAILED ENGINEERING DESIGN</h3>
                    <h4 className="font-semibold text-base mb-4 text-center text-blue-700">
                      {project?.title || 'Project Title'}
                    </h4>
                    <p className="mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="mb-3">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="mb-3">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </>
                )}
                
                {previewDocument === 'pow' && (
                  <>
                    <h3 className="font-bold text-lg mb-2 text-center">PROGRAM OF WORK</h3>
                    <h4 className="font-semibold text-base mb-4 text-center text-blue-700">
                      {project?.title || 'Project Title'}
                    </h4>
                    <p className="mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="mb-3">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="mb-3">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </>
                )}
                
                {previewDocument === 'right-of-way' && (
                  <>
                    <h3 className="font-bold text-lg mb-2 text-center">RIGHT OF WAY DOCUMENTS</h3>
                    <h4 className="font-semibold text-base mb-4 text-center text-blue-700">
                      {project?.title || 'Project Title'}
                    </h4>
                    <p className="mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="mb-3">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="mb-3">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </>
                )}
                
                {previewDocument === 'others' && (
                  <>
                    <h3 className="font-bold text-lg mb-2 text-center">OTHER SUPPORTING DOCUMENTS</h3>
                    <h4 className="font-semibold text-base mb-4 text-center text-blue-700">
                      {project?.title || 'Project Title'}
                    </h4>
                    <p className="mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="mb-3">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="mb-3">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {/* PDF Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {previewDocument === 'letter-of-intent' && 'Page 1 of 3'}
                  {previewDocument === 'validation-report' && 'Page 1 of 2'}
                  {previewDocument === 'fs-efa' && 'Page 1 of 4'}
                  {previewDocument === 'ded' && 'Page 1 of 5'}
                  {previewDocument === 'pow' && 'Page 1 of 3'}
                  {previewDocument === 'right-of-way' && 'Page 1 of 2'}
                  {previewDocument === 'others' && 'Page 1 of 2'}
                </span>
                <div className="flex items-center gap-4">
                  <span>✅ Approved</span>
                  <span>📅 {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button variant="default">
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProcurementStepContent({ currentStatus }: { currentStatus?: string }) {
  const isBeyondProcurement = currentStatus && ['Implementation', 'Completed'].includes(currentStatus)
  
  return (
    <div className="space-y-4">
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
      
      {!isBeyondProcurement && (
      <div>
        <h4 className="font-medium mb-2">Procurement Timeline</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Bid Opening</span>
            <span className="text-muted-foreground">Dec 15, 2024</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Award Notice</span>
            <span className="text-muted-foreground">Dec 20, 2024</span>
          </div>
        </div>
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
