'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { raedSpecificProjects } from '@/lib/mock/raed-specific-projects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pagination, usePagination } from '@/components/pagination'
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  User,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  Clock,
  Archive,
  X
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

// Mock document data with project references
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
        uploadedBy: 'RAED User',
        uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
        version: Math.floor(Math.random() * 5) + 1,
        url: `/documents/${project.id}/${docType.toLowerCase().replace(/\s+/g, '-')}.${fileType.toLowerCase()}`
      })
    })
    
    return documents
  })
}

export default function DocumentManagerPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  // Filter documents based on search
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesSearch
    }).sort((a, b) => {
      // Default sort by upload date (newest first)
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })
  }, [allDocuments, searchQuery])

  // Pagination logic
  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    handlePageChange,
    handlePageSizeChange
  } = usePagination(filteredDocuments, 10, 1)


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

      case 'FS/EFA':
        content.content = `
          FEASIBILITY STUDY / ENVIRONMENTAL IMPACT ASSESSMENT
        
          Project: ${document.projectTitle}
          Study Period: ${new Date().getFullYear()}
          
          EXECUTIVE SUMMARY
          This document presents the feasibility study and environmental impact assessment for the proposed project.
          
          FEASIBILITY ANALYSIS:
          - Technical Feasibility: HIGH
          - Economic Feasibility: HIGH
          - Social Acceptability: HIGH
          - Environmental Impact: LOW
          
          ENVIRONMENTAL IMPACT ASSESSMENT:
          - Air Quality: No significant impact expected
          - Water Resources: Minimal impact with proper mitigation
          - Biodiversity: No threatened species affected
          - Soil Quality: Improved through proper management
          
          RECOMMENDATIONS:
          - Project is feasible and recommended for implementation
          - Environmental monitoring required during construction
          - Community consultation completed successfully
        `
        break

      case 'DED':
        content.content = `
          DETAILED ENGINEERING DESIGN
        
          Project: ${document.projectTitle}
          Design Date: ${new Date().toLocaleDateString()}
          Engineer: Licensed Civil Engineer
        
          DESIGN SPECIFICATIONS:
          - Structural Design: Reinforced concrete
          - Foundation Type: Spread footing
          - Load Capacity: As per building code requirements
          - Materials: Standard construction materials
          
          TECHNICAL DRAWINGS:
          - Site Plan
          - Floor Plans
          - Elevations
          - Structural Details
          - Electrical Layout
          - Plumbing Layout
          
          CALCULATIONS:
          - Load calculations
          - Structural analysis
          - Material quantities
          - Cost estimates
          
          STATUS: ${document.status}
        `
        break

      case 'POW':
        content.content = `
          PROGRAM OF WORK
        
          Project: ${document.projectTitle}
          Implementation Period: ${new Date().getFullYear()}
          
          WORK BREAKDOWN STRUCTURE:
          
          1. PRE-CONSTRUCTION PHASE
             - Site preparation
             - Permit acquisition
             - Material procurement
             Duration: 30 days
          
          2. CONSTRUCTION PHASE
             - Foundation work
             - Structural construction
             - Utilities installation
             Duration: 180 days
          
          3. POST-CONSTRUCTION PHASE
             - Quality inspection
             - Documentation
             - Turnover
             Duration: 30 days
          
          RESOURCE REQUIREMENTS:
          - Labor: 15 skilled workers
          - Equipment: Standard construction equipment
          - Materials: As per specifications
          
          MILESTONES:
          - Site preparation completion: Month 1
          - Foundation completion: Month 2
          - Structure completion: Month 6
          - Project completion: Month 8
        `
        break

      case 'ROW':
        content.content = `
          RIGHT OF WAY DOCUMENTATION
        
          Project: ${document.projectTitle}
          Document Date: ${new Date().toLocaleDateString()}
          
          PROPERTY INFORMATION:
          - Location: Project site area
          - Land Area: As per survey
          - Ownership: Public/Private (as applicable)
          - Zoning: Agricultural/Infrastructure
          
          LEGAL DOCUMENTS:
          - Deed of Sale/Donation
          - Tax Declaration
          - Survey Plan
          - Zoning Clearance
          - Environmental Clearance
          
          STAKEHOLDER AGREEMENTS:
          - Community consent
          - Landowner agreements
          - Government approvals
          - Environmental permits
          
          STATUS: ${document.status}
          
          This document confirms the legal right to use the property for project implementation.
        `
        break

      case 'Bid Opening Document':
        content.content = `
          BID OPENING DOCUMENTATION
        
          Project: ${document.projectTitle}
          Bid Opening Date: ${new Date().toLocaleDateString()}
          Location: Regional Office
        
          BIDDING PARTICIPANTS:
          1. Company A - Bid Amount: ₱2,500,000
          2. Company B - Bid Amount: ₱2,450,000
          3. Company C - Bid Amount: ₱2,600,000
        
          BID EVALUATION:
          - Technical Evaluation: Completed
          - Financial Evaluation: Completed
          - Post-Qualification: In Progress
        
          RESULTS:
          - Lowest Responsive Bid: Company B
          - Bid Amount: ₱2,450,000
          - Status: Under evaluation
        
          DOCUMENTS SUBMITTED:
          ✓ Bid Security
          ✓ Technical Specifications
          ✓ Financial Proposal
          ✓ Company Credentials
        
          NEXT STEPS:
          - Post-qualification review
          - Notice of Award preparation
        `
        break

      case 'Notice of Award Document':
        content.content = `
          NOTICE OF AWARD
        
          To: [Winning Contractor]
          From: Department of Agriculture - Regional Office
          Date: ${new Date().toLocaleDateString()}
          
          Subject: Notice of Award - ${document.projectTitle}
          
          We are pleased to inform you that your bid has been accepted for the above-mentioned project.
          
          AWARD DETAILS:
          - Contract Amount: ₱2,450,000
          - Contract Duration: 240 calendar days
          - Performance Security: ₱122,500 (5% of contract amount)
          - Warranty Period: 1 year from completion
        
          CONDITIONS:
          1. Execute contract within 7 days from receipt of this notice
          2. Submit performance security as required
          3. Commence work within 15 days after notice to proceed
          
          Please contact our office to arrange contract signing and project kickoff meeting.
          
          Congratulations on your successful bid!
          
          Regional Director
          Department of Agriculture
        `
        break

      case 'Notice to Proceed Document':
        content.content = `
          NOTICE TO PROCEED
        
          To: [Contractor Name]
          From: Department of Agriculture - Regional Office
          Date: ${new Date().toLocaleDateString()}
          
          Subject: Notice to Proceed - ${document.projectTitle}
          
          You are hereby authorized to commence work on the above-mentioned project.
          
          PROJECT DETAILS:
          - Contract Amount: ₱2,450,000
          - Project Duration: 240 calendar days
          - Start Date: ${new Date().toLocaleDateString()}
          - Expected Completion: ${new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          
          REQUIREMENTS:
          1. Mobilize equipment and personnel within 7 days
          2. Submit work schedule and safety plan
          3. Conduct site coordination meeting
          4. Begin site preparation activities
          
          PROJECT MANAGER: [Name]
          CONTACT: [Phone/Email]
          
          Please confirm receipt and provide your mobilization schedule.
          
          Regional Director
          Department of Agriculture
        `
        break

      case 'As Built Plans (CAD or PDF)':
        content.content = `
          AS-BUILT PLANS
        
          Project: ${document.projectTitle}
          Completion Date: ${new Date().toLocaleDateString()}
          Drawing Scale: 1:100
        
          DRAWING SET INCLUDES:
          - Site Plan (As-Built)
          - Floor Plans (As-Built)
          - Elevations (As-Built)
          - Sections (As-Built)
          - Details (As-Built)
          - Utility Plans (As-Built)
        
          CHANGES FROM ORIGINAL DESIGN:
          - Minor adjustments to accommodate site conditions
          - Utility routing optimized for efficiency
          - Material substitutions approved by engineer
        
          CERTIFICATION:
          This as-built drawing set accurately represents the completed construction.
          All measurements verified by licensed surveyor.
          
          Prepared by: Licensed Civil Engineer
          Date: ${new Date().toLocaleDateString()}
          Drawing No.: AB-${document.projectId}-001
        `
        break

      case 'Geotag Photos':
        content.content = `
          GEOTAGGED PHOTOS
        
          Project: ${document.projectTitle}
          Photo Session Date: ${new Date().toLocaleDateString()}
          Location: Project Site
          GPS Coordinates: [Latitude, Longitude]
        
          PHOTO DOCUMENTATION:
          - Site overview (4 photos)
          - Existing conditions (8 photos)
          - Access points (3 photos)
          - Environmental features (5 photos)
          - Utility connections (2 photos)
          
          TECHNICAL DETAILS:
          - Camera: GPS-enabled digital camera
          - Resolution: High resolution (4K)
          - GPS Accuracy: ±3 meters
          - Weather: Clear conditions
          
          PHOTO INDEX:
          1. Site entrance and access road
          2. Main construction area
          3. Existing utilities
          4. Environmental features
          5. Adjacent properties
          
          STATUS: ${document.status}
          
          Note: All photos include embedded GPS coordinates for accurate location reference.
        `
        break

      case 'Post Geotag Photos':
        content.content = `
          POST-COMPLETION GEOTAGGED PHOTOS
        
          Project: ${document.projectTitle}
          Completion Date: ${new Date().toLocaleDateString()}
          Photo Session Date: ${new Date().toLocaleDateString()}
          Location: Completed Project Site
          GPS Coordinates: [Latitude, Longitude]
        
          COMPLETED WORK DOCUMENTATION:
          - Overall project view (6 photos)
          - Structural completion (10 photos)
          - Finishing details (8 photos)
          - Utilities installation (4 photos)
          - Landscaping and cleanup (3 photos)
          
          QUALITY VERIFICATION:
          ✓ All work completed as per specifications
          ✓ Quality standards met
          ✓ Safety requirements satisfied
          ✓ Environmental compliance verified
          
          COMPARISON WITH ORIGINAL:
          - Before photos: Available in project files
          - After photos: Current documentation
          - Changes implemented: As per approved plans
          
          HANDOVER STATUS:
          - Project completed on time
          - All deliverables provided
          - Documentation complete
          - Ready for turnover
          
          STATUS: ${document.status}
          
          Note: Post-completion photos serve as final documentation for project closure.
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

  return (
    <div className="space-y-6 pb-20">
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

      {/* Search Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Documents
          </CardTitle>
          <CardDescription>
            Find documents quickly by searching document names, projects, or types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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

            {/* Results and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{paginatedData.length}</span> of <span className="font-medium text-foreground">{filteredDocuments.length}</span> documents
                </span>
                {searchQuery && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Search: {searchQuery}
                    </Badge>
                  </div>
                )}
              </div>
              
              {searchQuery && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Search
                </Button>
              )}
            </div>
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
            
            {paginatedData.length === 0 && (
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
