'use client'

import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { mockProjects } from '@/lib/mock/data'
import { Project } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, usePagination } from '@/components/pagination'
import { formatDate, formatDateTime } from '@/lib/utils'
import { 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  User,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  Clock,
  List,
  Grid3X3,
  MapPin,
  X,
  ArrowLeft,
  Building2,
  Wrench,
  Package,
  ChevronRight,
  FileDown,
  FileUp,
  History,
  ChevronDown
} from 'lucide-react'

// Map document types to project stages
const getDocumentStage = (docType: string, projectStatus: string, projectType?: string): string => {
  // Map document types to stages based on typical project lifecycle
  if (docType === 'Letter of Intent' || docType === 'Validation Report' || docType === 'FS/EFA') {
    return 'Proposal'
  }
  if (docType === 'DED' || docType === 'POW' || docType === 'ROW') {
    return 'Proposal'
  }
  if (docType === 'Bid Opening Document' || docType === 'Notice of Award Document' || docType === 'Notice to Proceed Document') {
    return 'Procurement'
  }
  
  // For Machinery projects, use "For Delivery" and "Delivered" instead of "Implementation" and "Completed"
  if (projectType === 'Machinery') {
    if (docType === 'As Built Plans (CAD or PDF)' || docType === 'Geotag Photos') {
      return 'For Delivery'
    }
    if (docType === 'Post Geotag Photos') {
      return 'Delivered'
    }
  } else {
    // For Infrastructure and other project types
    if (docType === 'As Built Plans (CAD or PDF)' || docType === 'Geotag Photos') {
      return 'Implementation'
    }
    if (docType === 'Post Geotag Photos') {
      return 'Completed'
    }
  }
  
  // Default to current project status
  return projectStatus
}

// Generate version history for a document
const generateVersionHistory = (baseDocument: any, versionCount: number) => {
  const versions = []
  for (let i = versionCount; i >= 1; i--) {
    const daysAgo = (versionCount - i) * 7 + Math.floor(Math.random() * 5) // Each version roughly a week apart
    versions.push({
      version: i,
      uploadedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: i === versionCount ? baseDocument.uploadedBy : ['Admin User', 'Engineer User', 'RAED User'][Math.floor(Math.random() * 3)],
      size: baseDocument.size + Math.floor(Math.random() * 200) - 100, // Slight size variation
      changes: i === versionCount ? 'Current version' : `Version ${i} - Previous revision`,
      url: `${baseDocument.url}?v=${i}`
    })
  }
  return versions
}

// Generate mock documents for projects (similar to documents page)
const generateMockDocuments = (projects: Project[]) => {
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
      const versionCount = Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 2 : 1 // 40% chance of having multiple versions
      
      const baseDoc = {
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
        uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        version: versionCount,
        url: `/documents/${project.id}/${docType.toLowerCase().replace(/\s+/g, '-')}.${fileType.toLowerCase()}`,
        source: getDocumentStage(docType, project.status, project.type),
        hasVersions: versionCount > 1,
        versions: versionCount > 1 ? generateVersionHistory({
          uploadedBy: 'Admin User',
          size: size,
          url: `/documents/${project.id}/${docType.toLowerCase().replace(/\s+/g, '-')}.${fileType.toLowerCase()}`
        }, versionCount) : []
      }
      
      documents.push(baseDoc)
    })
    
    return documents
  })
}

interface DocumentVersion {
  version: number
  uploadedAt: string
  uploadedBy: string
  size: number
  changes: string
  url: string
}

interface Document {
  id: string
  name: string
  projectId: string
  projectTitle: string
  projectType: string
  projectStatus: string
  projectRegion?: string
  documentType: string
  status: string
  fileType: string
  size: number
  uploadedBy: string
  uploadedAt: string
  lastModified: string
  version: number
  url: string
  source: string
  hasVersions: boolean
  versions: DocumentVersion[]
}

export default function DocumentTestPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false)
  const [selectedDocumentForVersions, setSelectedDocumentForVersions] = useState<Document | null>(null)
  const [projectViewMode, setProjectViewMode] = useState<'list' | 'grid'>('list')
  const [documentStageFilter, setDocumentStageFilter] = useState<string>('all')
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all')

  // Filter projects by RAED region, type, and search query
  const filteredProjects = useMemo(() => {
    let projects = mockProjects
    
    // Filter by RAED region if user is RAED
    if (user?.role === 'RAED' && user?.regionAssigned) {
      projects = projects.filter(p => p.region === user.regionAssigned)
    }
    
    // Filter by project type
    if (projectTypeFilter !== 'all') {
      projects = projects.filter(p => p.type === projectTypeFilter)
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.province.toLowerCase().includes(query) ||
        (p.municipality && p.municipality.toLowerCase().includes(query))
      )
    }
    
    return projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [user, searchQuery, projectTypeFilter])

  // Generate all documents for filtered projects
  const allDocuments = useMemo(() => {
    return generateMockDocuments(filteredProjects)
  }, [filteredProjects])

  // Filter documents by search query (for file search)
  const searchDocuments = useMemo(() => {
    if (!searchQuery) return []
    
    const query = searchQuery.toLowerCase()
    return allDocuments.filter(doc => 
      doc.name.toLowerCase().includes(query) ||
      doc.documentType.toLowerCase().includes(query) ||
      doc.projectTitle.toLowerCase().includes(query)
    )
  }, [allDocuments, searchQuery])

  // Get documents for selected project
  const projectDocuments = useMemo(() => {
    if (!selectedProject) return []
    return allDocuments.filter(doc => doc.projectId === selectedProject.id)
  }, [selectedProject, allDocuments])

  // Filter documents by stage
  const filteredProjectDocuments = useMemo(() => {
    if (documentStageFilter === 'all') {
      return projectDocuments
    }
    return projectDocuments.filter(doc => doc.source === documentStageFilter)
  }, [projectDocuments, documentStageFilter])

  // Pagination for projects
  const projectPagination = usePagination(filteredProjects, 12, 1)
  
  // Pagination for documents
  const documentPagination = usePagination(projectDocuments, 12, 1)
  
  // Pagination for search results
  const searchPagination = usePagination(searchDocuments, 12, 1)

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project)
    setIsProjectModalOpen(true)
    setSearchQuery('') // Clear search when selecting a project
    setDocumentStageFilter('all') // Reset filter when opening modal
  }, [])

  const handleCloseProjectModal = useCallback(() => {
    setIsProjectModalOpen(false)
    setSelectedProject(null)
  }, [])

  const handleViewDocument = useCallback((document: Document) => {
    setSelectedDocument(document)
    setIsDocumentModalOpen(true)
  }, [])

  const handleDownloadDocument = useCallback((document: Document) => {
    console.log('Download document', document.id, document.url)
    // In a real app, this would trigger a download
    // For now, we'll just log it
  }, [])

  const handleViewVersions = useCallback((document: Document) => {
    setSelectedDocumentForVersions(document)
    setIsVersionModalOpen(true)
  }, [])

  const getStatusColor = (status: string) => {
    // Match StatusBadge colors from /projects page
    switch (status) {
      case 'Completed':
      case 'Validated':
      case 'Delivered':
      case 'Inventory':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Implementation':
      case 'For Review':
      case 'For Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Procurement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Proposal':
      case 'Missing':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Draft':
      case 'Approved':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStageColor = (source: string, projectType?: string) => {
    // Apply color coding for infrastructure projects (as specified: Proposal red, Procurement yellow, Implementation yellow, Completed green)
    if (projectType === 'Infrastructure') {
      switch (source) {
        case 'Proposal':
          return 'bg-red-100 text-red-800 border-red-200'
        case 'Procurement':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'Implementation':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'Completed':
          return 'bg-green-100 text-green-800 border-green-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }
    // Apply color coding for machinery projects (matching StatusBadge colors)
    if (projectType === 'Machinery') {
      switch (source) {
        case 'Proposal':
          return 'bg-red-100 text-red-800 border-red-200'
        case 'Procurement':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'For Delivery':
          return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'Delivered':
          return 'bg-green-100 text-green-800 border-green-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }
    // Default color matching StatusBadge for other project types
    switch (source) {
      case 'Proposal':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Procurement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Implementation':
      case 'For Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Completed':
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'Infrastructure':
        return <Building2 className="h-4 w-4" />
      case 'Machinery':
        return <Wrench className="h-4 w-4" />
      case 'FMR':
        return <FileText className="h-4 w-4" />
      case 'Project Package':
        return <Package className="h-4 w-4" />
      default:
        return <FolderOpen className="h-4 w-4" />
    }
  }

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'FMR':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Infrastructure':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Machinery':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Project Package':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Show search results if there's a search query
  const showSearchResults = searchQuery && searchDocuments.length > 0

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Test</h1>
          <p className="text-muted-foreground">
            Browse projects and their associated documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <div className="flex border rounded-lg">
            <Button
              variant={projectViewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setProjectViewMode('list')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={projectViewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setProjectViewMode('grid')}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects or files (shows which project files are attached to)..."
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Project Type:</span>
              </div>
              <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Machinery">Machinery</SelectItem>
                  <SelectItem value="FMR">FMR</SelectItem>
                </SelectContent>
              </Select>
              {projectTypeFilter !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProjectTypeFilter('all')}
                  className="h-8 px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filter
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {showSearchResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Results ({searchDocuments.length})
            </CardTitle>
            <CardDescription>
              Files matching "{searchQuery}" and the projects they belong to
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectViewMode === 'list' ? (
              <div className="space-y-3">
                {searchPagination.paginatedData.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      const project = filteredProjects.find(p => p.id === doc.projectId)
                      if (project) {
                        handleProjectClick(project)
                      }
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
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          <span className="font-medium">Project:</span>
                          <span className="truncate max-w-[200px]">{doc.projectTitle}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{doc.documentType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(doc.uploadedAt)}</span>
                        </div>
                        <span>{formatFileSize(doc.size)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {searchPagination.paginatedData.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => {
                      const project = filteredProjects.find(p => p.id === doc.projectId)
                      if (project) {
                        handleProjectClick(project)
                      }
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl group-hover:bg-muted/80 transition-colors">
                          {getFileTypeIcon(doc.fileType)}
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{doc.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <FolderOpen className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{doc.projectTitle}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {doc.documentType}
                        </Badge>
                      </div>
                      <div className="mt-auto pt-3 border-t space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(doc.uploadedAt)}</span>
                        </div>
                        <div>{formatFileSize(doc.size)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {searchPagination.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={searchPagination.currentPage}
                  totalPages={searchPagination.totalPages}
                  pageSize={searchPagination.pageSize}
                  totalItems={searchPagination.totalItems}
                  onPageChange={searchPagination.handlePageChange}
                  onPageSizeChange={searchPagination.handlePageSizeChange}
                  pageSizeOptions={[12, 24, 48]}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      {!showSearchResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Projects ({filteredProjects.length})</CardTitle>
                <CardDescription>
                  Click on a project to view its documents
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {projectViewMode === 'list' ? (
              <div className="space-y-2">
                {projectPagination.paginatedData.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        {getProjectTypeIcon(project.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-sm font-semibold truncate">{project.title}</h3>
                          <Badge className={`text-xs ${getProjectTypeColor(project.type)}`}>
                            {project.type}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{project.province}</span>
                          </div>
                          {project.region && (
                            <>
                              <span>•</span>
                              <span>{project.region}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between lg:justify-end gap-4">
                        <div className="flex flex-col items-end text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(project.updatedAt)}</span>
                          </div>
                          {project.budget > 0 && (
                            <div className="mt-1 font-medium text-foreground">
                              ₱{(project.budget / 1000000).toFixed(1)}M
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {projectPagination.paginatedData.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                          {getProjectTypeIcon(project.type)}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={`text-xs ${getProjectTypeColor(project.type)}`}>
                            {project.type}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{project.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{project.province}</span>
                      </div>
                      {project.region && (
                        <div className="text-xs text-muted-foreground mb-2">
                          {project.region}
                        </div>
                      )}
                      <div className="mt-auto pt-3 border-t space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(project.updatedAt)}</span>
                          </div>
                          {project.budget > 0 && (
                            <div className="font-semibold text-foreground">
                              ₱{(project.budget / 1000000).toFixed(1)}M
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {projectPagination.paginatedData.length === 0 && (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search criteria' : 'No projects available'}
                </p>
              </div>
            )}
            {projectPagination.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={projectPagination.currentPage}
                  totalPages={projectPagination.totalPages}
                  pageSize={projectPagination.pageSize}
                  totalItems={projectPagination.totalItems}
                  onPageChange={projectPagination.handlePageChange}
                  onPageSizeChange={projectPagination.handlePageSizeChange}
                  pageSizeOptions={[12, 24, 48]}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Project Documents Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProject && getProjectTypeIcon(selectedProject.type)}
              {selectedProject?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedProject?.type} • {selectedProject?.status} • {filteredProjectDocuments.length} of {projectDocuments.length} documents
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-4">
              {/* Project Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Province</label>
                    <p className="font-medium">{selectedProject.province}</p>
                  </div>
                  {selectedProject.region && (
                    <div>
                      <label className="text-muted-foreground">Region</label>
                      <p className="font-medium">{selectedProject.region}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-muted-foreground">Status</label>
                    <p className="font-medium">{selectedProject.status}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Budget</label>
                    <p className="font-medium">₱{selectedProject.budget.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Stage Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Filter by Stage:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={documentStageFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDocumentStageFilter('all')}
                    className="text-xs"
                  >
                    All ({projectDocuments.length})
                  </Button>
                  <Button
                    variant={documentStageFilter === 'Proposal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDocumentStageFilter('Proposal')}
                    className="text-xs"
                  >
                    Proposal ({projectDocuments.filter(d => d.source === 'Proposal').length})
                  </Button>
                  <Button
                    variant={documentStageFilter === 'Procurement' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDocumentStageFilter('Procurement')}
                    className="text-xs"
                  >
                    Procurement ({projectDocuments.filter(d => d.source === 'Procurement').length})
                  </Button>
                  {selectedProject.type === 'Machinery' ? (
                    <>
                      <Button
                        variant={documentStageFilter === 'For Delivery' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDocumentStageFilter('For Delivery')}
                        className="text-xs"
                      >
                        For Delivery ({projectDocuments.filter(d => d.source === 'For Delivery').length})
                      </Button>
                      <Button
                        variant={documentStageFilter === 'Delivered' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDocumentStageFilter('Delivered')}
                        className="text-xs"
                      >
                        Delivered ({projectDocuments.filter(d => d.source === 'Delivered').length})
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant={documentStageFilter === 'Implementation' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDocumentStageFilter('Implementation')}
                        className="text-xs"
                      >
                        Implementation ({projectDocuments.filter(d => d.source === 'Implementation').length})
                      </Button>
                      <Button
                        variant={documentStageFilter === 'Completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDocumentStageFilter('Completed')}
                        className="text-xs"
                      >
                        Completed ({projectDocuments.filter(d => d.source === 'Completed').length})
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">
                  Documents 
                  {documentStageFilter !== 'all' && (
                    <span className="text-muted-foreground font-normal">
                      {' '}({filteredProjectDocuments.length} {documentStageFilter.toLowerCase()})
                    </span>
                  )}
                </h3>
                {filteredProjectDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProjectDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                            {getFileTypeIcon(doc.fileType)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-medium truncate">{doc.name}</h3>
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                            {doc.hasVersions && (
                              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent" onClick={() => handleViewVersions(doc)}>
                                <History className="h-3 w-3 mr-1" />
                                v{doc.version}
                              </Badge>
                            )}
                            {!doc.hasVersions && (
                              <Badge variant="outline" className="text-xs">
                                v{doc.version}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{doc.documentType}</span>
                            <span>•</span>
                            <span>{formatFileSize(doc.size)}</span>
                            <span>•</span>
                            <span>{formatDate(doc.uploadedAt)}</span>
                            <Badge className={`text-xs ml-auto ${getStageColor(doc.source, selectedProject.type)}`}>
                              {doc.source}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="default"
                            onClick={() => handleViewDocument(doc)}
                            title="View document"
                            className="h-10 w-10 p-0"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                            title="Download document"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No documents found</h3>
                    <p className="text-muted-foreground">
                      {documentStageFilter !== 'all' 
                        ? `No ${documentStageFilter.toLowerCase()} documents found for this project`
                        : 'This project has no documents yet'}
                    </p>
                    {documentStageFilter !== 'all' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDocumentStageFilter('all')}
                        className="mt-4"
                      >
                        Show All Documents
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                  {selectedDocument && getFileTypeIcon(selectedDocument.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{selectedDocument?.name}</div>
                  <div className="text-sm font-normal text-muted-foreground mt-1">
                    {selectedDocument?.documentType} • {selectedDocument?.projectTitle}
                  </div>
                </div>
              </DialogTitle>
              <div className="flex items-center gap-2">
                {selectedDocument?.hasVersions && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsDocumentModalOpen(false)
                      handleViewVersions(selectedDocument)
                    }}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Versions
                  </Button>
                )}
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            {/* Document Metadata - Compact */}
            {selectedDocument && (
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t">
                <Badge className={getStatusColor(selectedDocument.status)}>
                  {selectedDocument.status}
                </Badge>
                <Badge className={`text-xs ${getStageColor(selectedDocument.source, selectedDocument.projectType)}`}>
                  {selectedDocument.source}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{formatFileSize(selectedDocument.size)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(selectedDocument.uploadedAt)}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  v{selectedDocument.version}
                </Badge>
              </div>
            )}
          </DialogHeader>
          
          {selectedDocument && (
            <div className="flex-1 overflow-y-auto mt-4">
              {/* Document Content Viewer */}
              <div className="border rounded-lg bg-background min-h-[500px]">
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="prose max-w-none">
                      <h2 className="text-2xl font-bold mb-4">{selectedDocument.name}</h2>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h3 className="font-semibold mb-2">Document Information</h3>
                          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                            <div>
                              <span className="text-muted-foreground">Project:</span>
                              <p className="font-medium">{selectedDocument.projectTitle}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Document Type:</span>
                              <p className="font-medium">{selectedDocument.documentType}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <p className="font-medium">{selectedDocument.status}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Stage:</span>
                              <p className="font-medium">{selectedDocument.source}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Uploaded By:</span>
                              <p className="font-medium">{selectedDocument.uploadedBy}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Upload Date:</span>
                              <p className="font-medium">{formatDateTime(selectedDocument.uploadedAt)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <h3 className="font-semibold mb-2">Document Content</h3>
                          <div className="p-6 bg-muted/20 rounded-lg border">
                            <p className="text-muted-foreground mb-4">
                              This is a preview of the document content. The full document would be displayed here in a production environment.
                            </p>
                            <div className="space-y-2 text-sm">
                              <p><strong>Document Name:</strong> {selectedDocument.name}</p>
                              <p><strong>File Type:</strong> {selectedDocument.fileType}</p>
                              <p><strong>File Size:</strong> {formatFileSize(selectedDocument.size)}</p>
                              <p><strong>Version:</strong> {selectedDocument.version}</p>
                              <p className="mt-4">
                                In a production environment, this area would display the actual document content 
                                (PDF viewer, image viewer, text content, etc.) based on the file type.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Version History Modal */}
      <Dialog open={isVersionModalOpen} onOpenChange={setIsVersionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              {selectedDocumentForVersions?.name} • {selectedDocumentForVersions?.versions.length} versions
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocumentForVersions && selectedDocumentForVersions.versions.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {selectedDocumentForVersions.versions.map((version, index) => (
                  <div
                    key={version.version}
                    className={`p-4 border rounded-lg ${
                      index === 0 ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={index === 0 ? 'default' : 'outline'} className="text-xs">
                            Version {version.version}
                            {index === 0 && ' (Current)'}
                          </Badge>
                          {index === 0 && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Latest
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{version.changes}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <label className="text-muted-foreground">Uploaded By</label>
                            <p className="font-medium">{version.uploadedBy}</p>
                          </div>
                          <div>
                            <label className="text-muted-foreground">Upload Date</label>
                            <p className="font-medium">{formatDateTime(version.uploadedAt)}</p>
                          </div>
                          <div>
                            <label className="text-muted-foreground">Size</label>
                            <p className="font-medium">{formatFileSize(version.size)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            console.log('View version', version.version, version.url)
                          }}
                          title="View this version"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            console.log('Download version', version.version, version.url)
                          }}
                          title="Download this version"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <Button variant="outline" onClick={() => setIsVersionModalOpen(false)} className="w-full">
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

