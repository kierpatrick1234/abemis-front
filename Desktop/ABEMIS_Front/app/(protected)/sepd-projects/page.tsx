'use client'

import { useState, useCallback } from 'react'
import { DataTable, StatusBadge, ActionMenu } from '@/components/data-table'
import { ProjectDetailsModal } from '@/components/project-details-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Search, CheckCircle, XCircle, MapPin, FileText, Upload, Eye, Download, MessageSquare } from 'lucide-react'
import { mockProjects } from '@/lib/mock/data'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Project } from '@/lib/types'

// Required documents for FMR projects
const requiredDocuments = [
  {
    id: 'DOC-FMR-001',
    name: 'FMR Project Proposal',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-FMR-002',
    name: 'Road Design Plans',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-FMR-003',
    name: 'Traffic Impact Assessment',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-FMR-004',
    name: 'Community Consultation Report',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-FMR-005',
    name: 'Environmental Clearance',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-FMR-006',
    name: 'Right-of-Way Documentation',
    type: 'PDF',
    required: true
  }
]

export default function SEPDProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, any>>({})

  // Mock function to get document status
  const getDocumentStatus = useCallback((docId: string) => {
    // For FMR projects in Proposal stage, show all documents as needing revision (red)
    if (selectedProject?.status === 'Proposal') {
      return {
        uploaded: true,
        epdsdApproved: false,
        comments: 'Please revise this document according to SEPD requirements.'
      }
    }
    
    // If project is approved or in other stages, show all documents as approved (green)
    return {
      uploaded: true,
      epdsdApproved: true,
      comments: ''
    }
  }, [selectedProject])

  // Mock function to get uploaded document info
  const getUploadedDocument = useCallback((docId: string) => {
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
  }, [getDocumentStatus])

  const handleFileUpload = useCallback((docId: string, file: File) => {
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
  }, [])
  // Filter projects for SEPD - only FMR projects in Proposal stage
  const sepdProjects = mockProjects.filter(project => 
    project.type === 'FMR' && project.status === 'Proposal'
  )


  const handleValidateProject = useCallback((projectId: string) => {
    console.log('Validating FMR project:', projectId)
    // In a real app, this would validate the FMR project requirements
    alert('FMR project validated and approved to proceed to next stage!')
  }, [])

  const handleRejectProject = useCallback((projectId: string) => {
    console.log('Rejecting FMR project:', projectId)
    alert('FMR project rejected. Please provide feedback to the submitting region.')
  }, [])

  const handleEditProject = useCallback((projectId: string) => {
    console.log('Edit project', projectId)
    // TODO: Implement edit functionality
  }, [])


  const handleDuplicateProject = useCallback((projectId: string) => {
    console.log('Duplicate project', projectId)
    // TODO: Implement duplicate functionality
  }, [])

  const handleRowClick = useCallback((project: Project) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }, [])

  const filteredProjects = sepdProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.province.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const columns = [
    {
      key: 'title',
      label: 'FMR Project Title',
      render: (value: unknown, row: Project) => (
        <div>
          <div className="font-medium">{row.title}</div>
          <div className="text-sm text-muted-foreground flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {row.province}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown, row: Project) => <StatusBadge status={row.status} />
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value: unknown, row: Project) => formatDate(row.updatedAt)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: unknown, row: Project) => (
        <ActionMenu
          actions={[
            {
              label: 'View Details',
              onClick: () => handleRowClick(row)
            },
            {
              label: 'Validate',
              onClick: () => handleValidateProject(row.id)
            },
            {
              label: 'Reject',
              onClick: () => handleRejectProject(row.id),
              variant: 'destructive'
            },
            {
              label: 'Edit',
              onClick: () => handleEditProject(row.id)
            },
            {
              label: 'Duplicate',
              onClick: () => handleDuplicateProject(row.id)
            }
          ]}
        />
      )
    }
  ]

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEPD FMR Project Evaluation</h1>
        <p className="text-muted-foreground">
          Evaluate Farm-to-Market Road (FMR) projects in proposal stage
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>FMR Project Filters</CardTitle>
          <CardDescription>Filter FMR projects for evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search FMR projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                FMR Projects Only
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>FMR Projects Pending Evaluation ({filteredProjects.length})</CardTitle>
          <CardDescription>
            Farm-to-Market Road projects requiring SEPD evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          <DataTable
            data={filteredProjects}
            columns={columns}
            onRowClick={handleRowClick}
            enablePagination={true}
            pageSize={5}
            pageSizeOptions={[5, 10, 25, 50, 100]}
          />
        </CardContent>
      </Card>

      {/* Evaluation Modal */}
      {showEvaluationModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                FMR Project Evaluation - {selectedProject.title}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Review FMR project requirements and validate to proceed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">FMR Project Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> <Badge variant="secondary">FMR</Badge></div>
                    <div><strong>Province:</strong> {selectedProject.province}</div>
                    <div><strong>Budget:</strong> {formatCurrency(selectedProject.budget)}</div>
                    <div><strong>Status:</strong> <StatusBadge status={selectedProject.status} /></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Start Date:</strong> {formatDate(selectedProject.startDate)}</div>
                    <div><strong>End Date:</strong> {selectedProject.endDate ? formatDate(selectedProject.endDate) : 'Not set'}</div>
                    <div><strong>Updated:</strong> {formatDate(selectedProject.updatedAt)}</div>
                  </div>
                </div>
              </div>

              {/* FMR Specific Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Required Documents
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Upload required documents for SEPD evaluation
                  </p>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {requiredDocuments.map((doc) => {
                      const status = getDocumentStatus(doc.id)
                      const uploadedDoc = getUploadedDocument(doc.id)
                      
                      return (
                        <AccordionItem key={doc.id} value={doc.id} className="border rounded-lg mb-2">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  status.uploaded 
                                    ? status.epdsdApproved 
                                      ? 'bg-green-100 text-green-600' 
                                      : selectedProject?.status === 'Proposal' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
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
                                        ? 'Approved by SEPD' 
                                        : selectedProject?.status === 'Proposal' ? 'Needs revision' : 'Under review'
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
                                      : selectedProject?.status === 'Proposal' ? 'destructive' : 'secondary'
                                    : 'secondary'
                                }>
                                  {status.uploaded 
                                    ? status.epdsdApproved 
                                      ? 'Approved' 
                                      : selectedProject?.status === 'Proposal' ? 'Needs Revision' : 'Review'
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
                                      <Button variant="outline" size="sm">
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                      </Button>
                                      <Button variant="outline" size="sm">
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

                              {/* SEPD Comments */}
                              {status.comments && (
                                <div className={`border rounded-lg p-4 ${
                                  selectedProject?.status === 'Proposal' 
                                    ? 'bg-red-50 border-red-200' 
                                    : 'bg-yellow-50 border-yellow-200'
                                }`}>
                                  <div className={`flex items-center gap-2 mb-2 ${
                                    selectedProject?.status === 'Proposal' 
                                      ? 'text-red-800' 
                                      : 'text-yellow-800'
                                  }`}>
                                    <MessageSquare className={`h-4 w-4 ${
                                      selectedProject?.status === 'Proposal' 
                                        ? 'text-red-600' 
                                        : 'text-yellow-600'
                                    }`} />
                                    <h4 className="font-medium text-sm">SEPD Comments</h4>
                                  </div>
                                  <p className={`text-sm ${
                                    selectedProject?.status === 'Proposal' 
                                      ? 'text-red-700' 
                                      : 'text-yellow-700'
                                  }`}>{status.comments}</p>
                                </div>
                              )}

                              {/* Upload Section */}
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                                    <div className="text-sm text-gray-600">
                                      {uploadedDoc ? 'Replace document' : 'Upload document'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      PDF, DOC, DOCX up to 10MB
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                      <span>Choose File</span>
                                    </Button>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Project Description */}
              <div>
                <h4 className="font-medium mb-2">FMR Project Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.description}
                </p>
              </div>

              {/* FMR Specific Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Road Specifications</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Road Length: To be determined</div>
                    <div>• Road Width: Standard FMR width</div>
                    <div>• Surface Type: Concrete/Asphalt</div>
                    <div>• Drainage: Included</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Community Impact</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Beneficiary Communities: Multiple</div>
                    <div>• Agricultural Access: Improved</div>
                    <div>• Market Connectivity: Enhanced</div>
                    <div>• Economic Impact: Positive</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleRejectProject(selectedProject.id)
                    setShowEvaluationModal(false)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleValidateProject(selectedProject.id)
                    setShowEvaluationModal(false)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validate Requirements & Proceed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false)
          setSelectedProject(null)
        }}
      />
    </div>
  )
}
