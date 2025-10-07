'use client'

import React, { useState, useCallback } from 'react'
import { DataTable, StatusBadge, ActionMenu } from '@/components/data-table'
import { EPDSDProjectDetailsModal } from '@/components/epdsd-project-details-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Search, CheckCircle, XCircle, FileText, Clock, User, MessageSquare, Download, Eye, ChevronDown, ChevronRight } from 'lucide-react'
import { mockProjects } from '@/lib/mock/data'
import { formatDate, formatCurrency } from '@/lib/utils'

// Mock data for proposal stage documents
const mockProposalDocuments = [
  {
    id: 'DOC-PROP-001',
    name: 'Project Proposal Document',
    type: 'PDF',
    size: '2.4 MB',
    uploadedBy: 'John Engineer',
    uploadedAt: '2024-01-15T10:30:00Z',
    status: 'For Review',
    isSatisfied: false,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-002',
    name: 'Technical Specifications',
    type: 'PDF',
    size: '3.1 MB',
    uploadedBy: 'Jane Engineer',
    uploadedAt: '2024-01-16T14:20:00Z',
    status: 'For Review',
    isSatisfied: false,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-003',
    name: 'Budget Breakdown',
    type: 'XLSX',
    size: '1.8 MB',
    uploadedBy: 'Mike Engineer',
    uploadedAt: '2024-01-17T09:15:00Z',
    status: 'For Review',
    isSatisfied: false,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-004',
    name: 'Environmental Impact Assessment',
    type: 'PDF',
    size: '4.2 MB',
    uploadedBy: 'Sarah Engineer',
    uploadedAt: '2024-01-18T11:45:00Z',
    status: 'For Review',
    isSatisfied: false,
    comments: '',
    required: true
  },
  {
    id: 'DOC-PROP-005',
    name: 'Community Consultation Report',
    type: 'PDF',
    size: '2.7 MB',
    uploadedBy: 'David Engineer',
    uploadedAt: '2024-01-19T16:30:00Z',
    status: 'For Review',
    isSatisfied: false,
    comments: '',
    required: true
  }
]

// Mock timeline data
const mockTimelineData = [
  {
    id: 'TIMELINE-001',
    title: 'Project Submitted',
    description: 'Project proposal submitted by proponent',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'John Engineer',
    status: 'completed',
    type: 'submission'
  },
  {
    id: 'TIMELINE-002',
    title: 'Documents Uploaded',
    description: 'All required documents uploaded by proponent',
    timestamp: '2024-01-19T16:30:00Z',
    user: 'David Engineer',
    status: 'completed',
    type: 'document_upload'
  },
  {
    id: 'TIMELINE-003',
    title: 'Under EPDSD Review',
    description: 'Project documents under evaluation by EPDSD',
    timestamp: '2024-01-20T09:00:00Z',
    user: 'EPDSD Reviewer',
    status: 'in_progress',
    type: 'review'
  }
]

export default function EPDSDProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  const [documentEvaluations, setDocumentEvaluations] = useState<Record<string, Record<string, {isSatisfied: boolean, comments: string}>>>({})
  const [generalComments, setGeneralComments] = useState('')
  
  // Filter projects for EPDSD - only Infrastructure and Machinery in Proposal stage
  // Add some test projects with Proposal status for demonstration
  const testProposalProjects = [
    {
      id: 'PRJ-TEST-001',
      title: 'Rural Water Supply System - Test Region',
      type: 'Infrastructure',
      province: 'Test Province',
      region: 'Test Region',
      status: 'Proposal',
      description: 'A comprehensive water supply system for rural communities',
      budget: 15000000,
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      updatedAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 'PRJ-TEST-002',
      title: 'Agricultural Machinery Distribution - Test Region',
      type: 'Machinery',
      province: 'Test Province',
      region: 'Test Region',
      status: 'Proposal',
      description: 'Distribution of modern agricultural machinery to farmers',
      budget: 25000000,
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      updatedAt: '2024-01-22T14:20:00Z'
    },
    {
      id: 'PRJ-TEST-003',
      title: 'Road Construction Project - Test Region',
      type: 'Infrastructure',
      province: 'Test Province',
      region: 'Test Region',
      status: 'Proposal',
      description: 'Construction of farm-to-market roads',
      budget: 30000000,
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      updatedAt: '2024-01-25T09:15:00Z'
    }
  ]

  const epdsdProjects = [
    ...mockProjects.filter(project => 
    (project.type === 'Infrastructure' || project.type === 'Machinery') && 
    project.status === 'Proposal'
    ),
    ...testProposalProjects
  ]


  const handleApproveProject = useCallback((projectId: string) => {
    console.log('Approving project:', projectId)
    // In a real app, this would update the project status to 'Procurement'
    alert('Project approved and moved to procurement stage!')
  }, [])

  const handleRejectProject = useCallback((projectId: string) => {
    console.log('Rejecting project:', projectId)
    alert('Project rejected. Please provide feedback to the submitting region.')
  }, [])

  const handleEditProject = useCallback((projectId: string) => {
    console.log('Edit project', projectId)
    // TODO: Implement edit functionality
  }, [])

  const handleDuplicateProject = useCallback((projectId: string) => {
    console.log('Duplicate project', projectId)
    // TODO: Implement duplicate functionality
  }, [])

  const handleEvaluateProject = useCallback((project: unknown) => {
    setSelectedProject(project)
    setShowEvaluationModal(true)
  }, [])

  const handleDocumentEvaluationChange = useCallback((docId: string, field: 'isSatisfied' | 'comments', value: boolean | string) => {
    if (!selectedProject) return
    
    const projectId = (selectedProject as { id: string }).id
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
  }, [selectedProject])

  const handleSubmitEvaluation = useCallback(() => {
    if (!selectedProject) return
    
    const projectId = (selectedProject as { id: string }).id
    const projectEvaluations = documentEvaluations[projectId] || {}
    
    const allDocumentsSatisfied = mockProposalDocuments.every(doc => 
      projectEvaluations[doc.id]?.isSatisfied === true
    )
    
    if (allDocumentsSatisfied) {
      alert('All documents evaluated successfully! Project can proceed to next stage.')
      setShowEvaluationModal(false)
    } else {
      alert('Please evaluate all documents before submitting.')
    }
  }, [documentEvaluations, selectedProject])

  const handleMoveToNextStage = useCallback(() => {
    if (!selectedProject) return
    
    const projectId = (selectedProject as { id: string }).id
    const projectEvaluations = documentEvaluations[projectId] || {}
    
    const allDocumentsSatisfied = mockProposalDocuments.every(doc => 
      projectEvaluations[doc.id]?.isSatisfied === true
    )
    
    if (allDocumentsSatisfied) {
      alert('Project moved to procurement stage!')
      setShowEvaluationModal(false)
    } else {
      alert('All documents must be satisfied before moving to next stage.')
    }
  }, [documentEvaluations, selectedProject])

  const handleRowClick = useCallback((project: unknown) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }, [])

  const filteredProjects = epdsdProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.province.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || project.type === typeFilter
    return matchesSearch && matchesType
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const columns = [
    {
      key: 'title',
      label: 'Project Title',
      render: (value: unknown, row: unknown) => (
        <div>
          <div className="font-medium">{(row as { title: string }).title}</div>
          <div className="text-sm text-muted-foreground">{(row as { province: string }).province}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: unknown, row: unknown) => (
        <Badge variant={(row as { type: string }).type === 'Infrastructure' ? 'default' : 'secondary'}>
          {(row as { type: string }).type}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown, row: unknown) => (<StatusBadge status={(row as { status: string }).status} />)
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value: unknown, row: unknown) => (formatDate((row as { updatedAt: string }).updatedAt))
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: unknown, row: unknown) => (
        <ActionMenu
          actions={[
            {
              label: 'View Details',
              onClick: () => handleRowClick(row as Record<string, unknown>)
            },
            {
              label: 'Evaluate Documents',
              onClick: () => handleEvaluateProject(row as Record<string, unknown>)
            },
            {
              label: 'Approve',
              onClick: () => handleApproveProject((row as { id: string }).id)
            },
            {
              label: 'Reject',
              onClick: () => handleRejectProject((row as { id: string }).id),
              variant: 'destructive'
            },
            {
              label: 'Edit',
              onClick: () => handleEditProject((row as { id: string }).id)
            },
            {
              label: 'Duplicate',
              onClick: () => handleDuplicateProject((row as { id: string }).id)
            }
          ]}
        />
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">EPDSD Project Evaluation</h1>
        <p className="text-muted-foreground">
          Evaluate Infrastructure and Machinery projects in proposal stage
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Project Filters</CardTitle>
          <CardDescription>Filter projects for evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('all')}
                size="sm"
              >
                All Types
              </Button>
              <Button
                variant={typeFilter === 'Infrastructure' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('Infrastructure')}
                size="sm"
              >
                Infrastructure
              </Button>
              <Button
                variant={typeFilter === 'Machinery' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('Machinery')}
                size="sm"
              >
                Machinery
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects Pending Evaluation ({filteredProjects.length})</CardTitle>
          <CardDescription>
            Infrastructure and Machinery projects requiring EPDSD evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredProjects}
            columns={columns}
            onRowClick={(row) => handleRowClick(row as Record<string, unknown>)}
          />
        </CardContent>
      </Card>

      {/* Enhanced Document Evaluation Modal */}
      {showEvaluationModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Document Evaluation - {(selectedProject as { title: string }).title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Evaluate proposal stage documents and provide feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                        const projectId = (selectedProject as { id: string }).id
                        const projectEvaluations = documentEvaluations[projectId] || {}
                        const isSatisfied = projectEvaluations[doc.id]?.isSatisfied || false
                        return (
                        <Card key={doc.id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-blue-600" />
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
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
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
                              />
                              <label htmlFor={`satisfied-${doc.id}`} className="text-sm font-medium">
                                I am satisfied with this document
                              </label>
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor={`comments-${doc.id}`} className="text-sm font-medium">
                                Comments/Remarks:
                              </label>
                              <textarea
                                id={`comments-${doc.id}`}
                                className="w-full p-2 border rounded-md text-sm"
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
                        <div><strong>Type:</strong> {(selectedProject as { type: string }).type}</div>
                        <div><strong>Province:</strong> {(selectedProject as { province: string }).province}</div>
                        <div><strong>Budget:</strong> {formatCurrency((selectedProject as { budget: number }).budget)}</div>
                        <div><strong>Status:</strong> <StatusBadge status={(selectedProject as { status: string }).status} /></div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Start Date:</strong> {formatDate((selectedProject as { startDate?: string }).startDate || '')}</div>
                        <div><strong>End Date:</strong> {formatDate((selectedProject as { endDate?: string }).endDate || '')}</div>
                        <div><strong>Updated:</strong> {formatDate((selectedProject as { updatedAt: string }).updatedAt)}</div>
                      </div>
                    </Card>
              </div>

                  <Card className="p-4">
                <h4 className="font-medium mb-2">Project Description</h4>
                <p className="text-sm text-muted-foreground">
                      {(selectedProject as { description: string }).description}
                </p>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                      handleRejectProject((selectedProject as { id: string }).id)
                    setShowEvaluationModal(false)
                  }}
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
            </CardContent>
          </Card>
        </div>
      )}

      {/* EPDSD Project Details Modal */}
      <EPDSDProjectDetailsModal
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
