'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { raedSpecificProjects } from '@/lib/mock/raed-specific-projects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  Clock,
  Upload,
  Archive
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

// Mock document data with project references
const generateMockDocuments = (projects: any[]) => {
  const documentTypes = [
    'Project Proposal',
    'Technical Specifications',
    'Budget Allocation',
    'Progress Report',
    'Completion Certificate',
    'As-Built Plans',
    'Geotagged Photos',
    'Procurement Documents',
    'Bid Opening Report',
    'Notice of Award',
    'Notice to Proceed',
    'Environmental Clearance',
    'Permits and Licenses',
    'Quality Assurance Report',
    'Safety Inspection Report'
  ]

  const statuses = ['Validated', 'For Review', 'Missing', 'Draft', 'Approved']
  const fileTypes = ['PDF', 'DOC', 'XLS', 'JPG', 'PNG', 'DWG', 'ZIP']

  return projects.flatMap(project => {
    const documentCount = Math.floor(Math.random() * 8) + 3 // 3-10 documents per project
    const documents = []
    
    for (let i = 0; i < documentCount; i++) {
      const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)]
      const size = Math.floor(Math.random() * 5000) + 100 // 100KB to 5MB
      
      documents.push({
        id: `DOC-${project.id}-${i + 1}`,
        name: `${docType} - ${project.title}`,
        projectId: project.id,
        projectTitle: project.title,
        projectType: project.type,
        projectStatus: project.status,
        documentType: docType,
        status: status,
        fileType: fileType,
        size: size,
        uploadedBy: 'RAED User',
        uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
        version: Math.floor(Math.random() * 5) + 1,
        url: `/documents/${project.id}/${docType.toLowerCase().replace(/\s+/g, '-')}.${fileType.toLowerCase()}`
      })
    }
    
    return documents
  })
}

export default function DocumentManagerPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('uploadedAt')

  // Get user's assigned region
  const userRegion = user?.regionAssigned || 'Region 1'

  // Filter projects to only show the user's assigned region
  const regionProjects = useMemo(() => {
    return raedSpecificProjects.filter(project => project.region === userRegion)
  }, [userRegion])

  // Generate documents for region projects
  const allDocuments = useMemo(() => {
    return generateMockDocuments(regionProjects)
  }, [regionProjects])

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesProject = selectedProject === 'all' || doc.projectId === selectedProject
      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus
      const matchesType = selectedType === 'all' || doc.documentType === selectedType
      
      return matchesSearch && matchesProject && matchesStatus && matchesType
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'uploadedAt':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        case 'projectTitle':
          return a.projectTitle.localeCompare(b.projectTitle)
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })
  }, [allDocuments, searchQuery, selectedProject, selectedStatus, selectedType, sortBy])

  // Get unique values for filters
  const uniqueProjects = Array.from(new Set(allDocuments.map(doc => ({ id: doc.projectId, title: doc.projectTitle }))))
  const uniqueStatuses = Array.from(new Set(allDocuments.map(doc => doc.status)))
  const uniqueTypes = Array.from(new Set(allDocuments.map(doc => doc.documentType)))

  // Statistics
  const totalDocuments = allDocuments.length
  const validatedDocuments = allDocuments.filter(doc => doc.status === 'Validated').length
  const pendingDocuments = allDocuments.filter(doc => doc.status === 'For Review').length
  const missingDocuments = allDocuments.filter(doc => doc.status === 'Missing').length

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Manager</h1>
        <p className="text-muted-foreground">
          Manage all documents for projects in {userRegion}
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
              Across {regionProjects.length} projects
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Document Filters
          </CardTitle>
          <CardDescription>
            Filter and search documents by project, status, and type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {uniqueProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title.length > 30 ? `${project.title.substring(0, 30)}...` : project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Document Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uploadedAt">Upload Date</SelectItem>
                  <SelectItem value="name">Document Name</SelectItem>
                  <SelectItem value="projectTitle">Project</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {filteredDocuments.length} of {totalDocuments} documents
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedProject('all')
                setSelectedStatus('all')
                setSelectedType('all')
                setSortBy('uploadedAt')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Documents ({filteredDocuments.length})
          </CardTitle>
          <CardDescription>
            All documents with project references and status information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {doc.documentType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {doc.projectType}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No documents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
