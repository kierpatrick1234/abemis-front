'use client'

import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { raedSpecificProjects } from '@/lib/mock/raed-specific-projects'
import { DataTable, StatusBadge, ActionButton } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pagination, usePagination } from '@/components/pagination'
import { mockDocuments } from '@/lib/mock/data'
import { formatDate, formatDateTime } from '@/lib/utils'
import { 
  Search, 
  Filter, 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  User,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  Clock,
  Archive,
  List,
  Grid3X3,
  MapPin,
  X,
  Tag,
  Shield
} from 'lucide-react'
import { Document } from '@/lib/types'

// Mock document data with project references (inherited from document manager)
const generateMockDocuments = (projects: any[]) => {
  const documentTypes = [
    'Letter of Intent',
    'Validation Report',
    'FS/EFA',
    'DED',
    'POW',
    'ROW',
    'Bid Opening Document',
    'Notice of Award Document',
    'Notice to Proceed Document',
    'As Built Plans (CAD or PDF)',
    'Geotag Photos',
    'Post Geotag Photos'
  ]

  const statuses = ['Validated', 'For Review', 'Missing', 'Draft', 'Approved']
  const fileTypes = ['PDF', 'DOC', 'XLS', 'JPG', 'PNG', 'DWG', 'ZIP']

  return projects.flatMap(project => {
    const documents = []
    
    // Generate applicable document types for each project
    // ROW is not applicable for Machinery projects
    const applicableDocumentTypes = project.type === 'Machinery' 
      ? documentTypes.filter(type => type !== 'ROW')
      : documentTypes
    
    applicableDocumentTypes.forEach((docType, index) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      // Determine appropriate file type based on document type
      let fileType = 'PDF' // default
      if (docType.includes('Photos') || docType.includes('Geotag')) {
        fileType = ['JPG', 'PNG'][Math.floor(Math.random() * 2)]
      } else if (docType.includes('CAD')) {
        fileType = 'DWG'
      } else if (docType.includes('FS/EFA') || docType.includes('DED') || docType.includes('POW') || docType.includes('ROW')) {
        fileType = ['PDF', 'DOC', 'XLS'][Math.floor(Math.random() * 3)]
      } else {
        fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)]
      }
      
      const size = Math.floor(Math.random() * 5000) + 100 // 100KB to 5MB
      
      documents.push({
        id: `DOC-${project.id}-${index + 1}`,
        name: `${docType} - ${project.title}`,
        projectId: project.id,
        projectTitle: project.title,
        projectType: project.type,
        projectStatus: project.status,
        projectRegion: project.region,
        documentType: docType,
        status: status,
        fileType: fileType,
        size: size,
        uploadedBy: 'Admin User',
        uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
        version: Math.floor(Math.random() * 5) + 1,
        url: `/documents/${project.id}/${docType.toLowerCase().replace(/\s+/g, '-')}.${fileType.toLowerCase()}`
      })
    })
    
    return documents
  })
}

export default function DocumentsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [uploadedByFilter, setUploadedByFilter] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Get all projects for admin view (admin can see all regions)
  const allProjects = useMemo(() => {
    console.log('RAED Projects count:', raedSpecificProjects.length)
    return raedSpecificProjects
  }, [])

  // Generate documents for all projects (admin view)
  const allDocuments = useMemo(() => {
    const docs = generateMockDocuments(allProjects)
    console.log('Generated documents count:', docs.length)
    return docs
  }, [allProjects])

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
      const matchesType = typeFilter === 'all' || doc.documentType === typeFilter
      const matchesRegion = regionFilter === 'all' || doc.projectRegion === regionFilter
      const matchesUploadedBy = uploadedByFilter === 'all' || doc.uploadedBy === uploadedByFilter
      
      return matchesSearch && matchesStatus && matchesType && matchesRegion && matchesUploadedBy
    }).sort((a, b) => {
      // Default sort by upload date (newest first)
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })
  }, [allDocuments, searchQuery, statusFilter, typeFilter, regionFilter, uploadedByFilter])

  // Implement pagination
  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    handlePageChange,
    handlePageSizeChange
  } = usePagination(filteredDocuments, 5, 1)


  // Statistics
  const totalDocuments = allDocuments.length
  const validatedDocuments = allDocuments.filter(doc => doc.status === 'Validated').length
  const pendingDocuments = allDocuments.filter(doc => doc.status === 'For Review').length
  const missingDocuments = allDocuments.filter(doc => doc.status === 'Missing').length

  const handlePreviewDocument = useCallback((documentId: string) => {
    const document = allDocuments.find(doc => doc.id === documentId)
    if (document) {
      setSelectedDocument(document)
      setIsModalOpen(true)
    }
  }, [allDocuments])

  const handleDownloadDocument = useCallback((documentId: string) => {
    console.log('Download document', documentId)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setStatusFilter('all')
    setTypeFilter('all')
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validated':
        return 'bg-green-100 text-green-800'
      case 'For Review':
        return 'bg-yellow-100 text-yellow-800'
      case 'Missing':
        return 'bg-red-100 text-red-800'
      case 'Draft':
        return 'bg-gray-100 text-gray-800'
      case 'Approved':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'xls':
      case 'xlsx':
        return '📊'
      case 'jpg':
      case 'png':
        return '🖼️'
      case 'dwg':
        return '📐'
      case 'zip':
        return '📦'
      default:
        return '📄'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const generateDummyDocumentContent = (document: any) => {
    const content = {
      title: document.name,
      project: document.projectTitle,
      documentType: document.documentType,
      status: document.status,
      fileType: document.fileType,
      size: formatFileSize(document.size),
      uploadedBy: document.uploadedBy,
      uploadedAt: formatDateTime(document.uploadedAt),
      lastModified: formatDateTime(document.lastModified),
      version: document.version,
      content: ''
    }

    // Generate specific content based on document type
    switch (document.documentType) {
      case 'Letter of Intent':
        content.content = `
          LETTER OF INTENT
        
          To: Department of Agriculture - Regional Field Office
          From: ${document.projectTitle}
          Date: ${new Date().toLocaleDateString()}
          
          Subject: Intent to Submit Project Proposal
          
          We hereby express our intent to submit a project proposal for the ${document.projectTitle} project. 
          This project aims to improve agricultural infrastructure and support local farming communities.
          
          The proposed project includes:
          - Infrastructure development
          - Equipment procurement
          - Community capacity building
          
          We look forward to your consideration and approval of this proposal.
          
          Respectfully yours,
          Project Coordinator
        `
        break

      case 'Validation Report':
        content.content = `
          VALIDATION REPORT
        
          Project: ${document.projectTitle}
          Validation Date: ${new Date().toLocaleDateString()}
          Validator: RAED Regional Office
        
          EXECUTIVE SUMMARY
          This report validates the technical specifications and requirements for the ${document.projectTitle} project.
          
          VALIDATION FINDINGS:
          ✓ Technical specifications are compliant with standards
          ✓ Budget allocation is appropriate for scope
          ✓ Timeline is realistic and achievable
          ✓ Environmental considerations are addressed
          
          RECOMMENDATIONS:
          - Proceed with implementation
          - Regular monitoring required
          - Quarterly progress reports needed
          
          Status: ${document.status}
        `
        break

      default:
        content.content = `
          DOCUMENT PREVIEW
        
          Project: ${document.projectTitle}
          Document Type: ${document.documentType}
          Status: ${document.status}
          Version: ${document.version}
          
          This document contains important information related to the project implementation.
          Please refer to the complete document for detailed information.
          
          Uploaded by: ${document.uploadedBy}
          Upload date: ${formatDateTime(document.uploadedAt)}
          Last modified: ${formatDateTime(document.lastModified)}
        `
    }

    return content
  }

  const columns = [
    {
      key: 'name',
      label: 'Document Name',
      render: (value: unknown, row: Document) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{value as string}</div>
            <div className="text-sm text-muted-foreground">{row.size}</div>
          </div>
        </div>
      )
    },
    {
      key: 'linkedProject',
      label: 'Linked Project',
      render: (value: unknown) => (
        <span className="font-mono text-sm">{value as string}</span>
      )
    },
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      render: (value: unknown) => (
        <span className="text-sm">{value as string}</span>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: unknown) => (
        <Badge variant="outline">{value as string}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={value as string} />
    },
    {
      key: 'date',
      label: 'Date',
      render: (value: unknown) => formatDate(value as string)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: unknown, row: Document) => (
        <div className="flex space-x-1">
          <ActionButton onClick={() => handlePreviewDocument(row.id)}>
            <FileText className="h-4 w-4" />
          </ActionButton>
          <ActionButton onClick={() => handleDownloadDocument(row.id)}>
            <Download className="h-4 w-4" />
          </ActionButton>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Manager</h1>
        <p className="text-muted-foreground">
          Manage all documents across all projects and regions
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Across {allProjects.length} projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validated</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{validatedDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((validatedDocuments / totalDocuments) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{missingDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Documents
          </CardTitle>
          <CardDescription>
            Find documents quickly with advanced search and filtering options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Search Documents</label>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by document name, project, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filters Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Filters</label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Status</label>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-ring"
                  >
                    <option value="all">All Status</option>
                    <option value="Validated">Validated</option>
                    <option value="For Review">For Review</option>
                    <option value="Missing">Missing</option>
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
                
                {/* Document Type Filter */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Document Type</label>
                  </div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-ring"
                  >
                    <option value="all">All Types</option>
                    <option value="Letter of Intent">Letter of Intent</option>
                    <option value="Validation Report">Validation Report</option>
                    <option value="FS/EFA">FS/EFA</option>
                    <option value="DED">DED</option>
                    <option value="POW">POW</option>
                    <option value="ROW">ROW</option>
                    <option value="Bid Opening Document">Bid Opening Document</option>
                    <option value="Notice of Award Document">Notice of Award Document</option>
                    <option value="Notice to Proceed Document">Notice to Proceed Document</option>
                    <option value="As Built Plans (CAD or PDF)">As Built Plans (CAD or PDF)</option>
                    <option value="Geotag Photos">Geotag Photos</option>
                    <option value="Post Geotag Photos">Post Geotag Photos</option>
                  </select>
                </div>
                
                {/* Region Filter */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Region</label>
                  </div>
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-ring"
                  >
                    <option value="all">All Regions</option>
                    <option value="Region 1">Region 1</option>
                    <option value="Region 2">Region 2</option>
                    <option value="Region 3">Region 3</option>
                    <option value="Region 4">Region 4</option>
                    <option value="Region 5">Region 5</option>
                    <option value="Region 6">Region 6</option>
                    <option value="Region 7">Region 7</option>
                    <option value="Region 8">Region 8</option>
                    <option value="Region 9">Region 9</option>
                    <option value="Region 10">Region 10</option>
                    <option value="Region 11">Region 11</option>
                    <option value="Region 12">Region 12</option>
                    <option value="NCR">NCR</option>
                    <option value="CAR">CAR</option>
                    <option value="BARMM">BARMM</option>
                  </select>
                </div>
                
                {/* Uploaded By Filter */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Uploaded By</label>
                  </div>
                  <select
                    value={uploadedByFilter}
                    onChange={(e) => setUploadedByFilter(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-ring"
                  >
                    <option value="all">All Users</option>
                    <option value="RAED User">RAED User</option>
                    <option value="Admin User">Admin User</option>
                    <option value="Engineer User">Engineer User</option>
                    <option value="Stakeholder User">Stakeholder User</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{paginatedData.length}</span> of <span className="font-medium text-foreground">{totalItems}</span> documents
                </span>
                {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || regionFilter !== 'all' || uploadedByFilter !== 'all') && (
                  <div className="flex flex-wrap items-center gap-2">
                    {searchQuery && (
                      <Badge variant="secondary" className="text-xs">
                        Search: {searchQuery}
                      </Badge>
                    )}
                    {statusFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        Status: {statusFilter}
                      </Badge>
                    )}
                    {typeFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        Type: {typeFilter}
                      </Badge>
                    )}
                    {regionFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        Region: {regionFilter}
                      </Badge>
                    )}
                    {uploadedByFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        User: {uploadedByFilter}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || regionFilter !== 'all' || uploadedByFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setTypeFilter('all')
                    setRegionFilter('all')
                    setUploadedByFilter('all')
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Documents ({totalItems})
              </CardTitle>
              <CardDescription>
                All documents with project references and status information
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            // List View
            <div className="space-y-4">
              {paginatedData.map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedDocument(doc)
                    setIsModalOpen(true)
                  }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                      {getFileTypeIcon(doc.fileType)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium truncate">{doc.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        v{doc.version}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FolderOpen className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{doc.projectTitle}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDateTime(doc.uploadedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{doc.uploadedBy}</span>
                      </div>
                      <span>{formatFileSize(doc.size)}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {doc.documentType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.projectType}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedDocument(doc)
                        setIsModalOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Download document', doc.id)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedData.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedDocument(doc)
                    setIsModalOpen(true)
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Document Icon and Type */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                        {getFileTypeIcon(doc.fileType)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        v{doc.version}
                      </Badge>
                    </div>
                    
                    {/* Document Name */}
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{doc.name}</h3>
                    
                    {/* Project Info */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <FolderOpen className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{doc.projectTitle}</span>
                    </div>
                    
                    {/* Document Type and Status */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {doc.documentType}
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                    
                    {/* Metadata */}
                    <div className="space-y-1 text-xs text-muted-foreground mb-3 flex-1">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{doc.uploadedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDateTime(doc.uploadedAt)}</span>
                      </div>
                      <div className="text-xs">
                        {formatFileSize(doc.size)}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDocument(doc)
                          setIsModalOpen(true)
                        }}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('Download document', doc.id)
                        }}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {paginatedData.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No documents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls - Sticky at bottom */}
      {filteredDocuments.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[5, 10, 25, 50, 100]}
            />
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg">
                {selectedDocument && getFileTypeIcon(selectedDocument.fileType)}
              </div>
              {selectedDocument?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedDocument?.documentType} • {selectedDocument?.projectTitle}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-6">
              {/* Document Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedDocument.status)}>
                      {selectedDocument.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">File Type</label>
                  <p className="text-sm mt-1">{selectedDocument.fileType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Size</label>
                  <p className="text-sm mt-1">{formatFileSize(selectedDocument.size)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Version</label>
                  <p className="text-sm mt-1">v{selectedDocument.version}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Uploaded By</label>
                  <p className="text-sm mt-1">{selectedDocument.uploadedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Upload Date</label>
                  <p className="text-sm mt-1">{formatDateTime(selectedDocument.uploadedAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                  <p className="text-sm mt-1">{formatDateTime(selectedDocument.lastModified)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project Type</label>
                  <p className="text-sm mt-1">{selectedDocument.projectType}</p>
                </div>
              </div>

              {/* Document Content */}
              <div className="border rounded-lg">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-semibold">Document Content Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a preview of the document content. Click download to get the full document.
                  </p>
                </div>
                <div className="p-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {generateDummyDocumentContent(selectedDocument).content}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Document
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
