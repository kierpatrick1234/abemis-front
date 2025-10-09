'use client'

import { useState, useCallback } from 'react'
import { DataTable, StatusBadge, ActionMenu } from '@/components/data-table'
import { ProjectDetailsModal } from '@/components/project-details-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, BarChart3, CheckCircle, AlertTriangle, Calendar } from 'lucide-react'
import { mockProjects } from '@/lib/mock/data'
import { formatDate, formatCurrency } from '@/lib/utils'

interface Project {
  id: string
  title: string
  type: string
  province: string
  budget: number
  status: string
  startDate?: string
  endDate?: string
  updatedAt: string
}

export default function PPMDProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showMonitoringModal, setShowMonitoringModal] = useState(false)
  // Filter projects for PPMD - only completed projects
  const ppmdProjects = mockProjects.filter(project => 
    project.status === 'Completed'
  )


  const handleRowClick = useCallback((project: Project) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }, [])

  const handleEditProject = useCallback((projectId: string) => {
    console.log('Edit project', projectId)
    // TODO: Implement edit functionality
  }, [])


  const handleDuplicateProject = useCallback((projectId: string) => {
    console.log('Duplicate project', projectId)
    // TODO: Implement duplicate functionality
  }, [])

  const filteredProjects = ppmdProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.province.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const columns = [
    {
      key: 'title',
      label: 'Project Title',
      render: (value: unknown, row: Project) => (
        <div>
          <div className="font-medium">{row.title}</div>
          <div className="text-sm text-muted-foreground">{row.province}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: unknown, row: Project) => (
        <Badge variant={(row as { type: string }).type === 'FMR' ? 'default' : (row as { type: string }).type === 'Infrastructure' ? 'secondary' : 'outline'}>
          {(row as { type: string }).type}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown, row: unknown) => <StatusBadge status={(row as { status: string }).status} />
    },
    {
      key: 'completionDate',
      label: 'Completed',
      render: (value: unknown, row: unknown) => formatDate((row as { endDate?: string; updatedAt: string }).endDate || (row as { updatedAt: string }).updatedAt)
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
              label: 'Edit',
              onClick: () => handleEditProject((row as { id: string }).id)
            },
            {
              label: 'Duplicate',
              onClick: () => handleDuplicateProject((row as { id: string }).id)
            },
          ]}
        />
      )
    }
  ]

  // Calculate monitoring statistics
  const totalCompleted = ppmdProjects.length
  const totalBudget = ppmdProjects.reduce((sum, project) => sum + project.budget, 0)
  const avgCompletionTime = 45 // Mock data - average days to completion

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PPMD Project Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor and track completed projects across all regions
        </p>
      </div>

      {/* Monitoring Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Completed</p>
                <p className="text-2xl font-bold">{totalCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg. Completion</p>
                <p className="text-2xl font-bold">{avgCompletionTime} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Project Filters</CardTitle>
          <CardDescription>Filter completed projects for monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search completed projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All Projects
              </Button>
              <Button
                variant={statusFilter === 'Completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('Completed')}
                size="sm"
              >
                Completed Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Completed Projects ({filteredProjects.length})</CardTitle>
          <CardDescription>
            Monitor and track performance of completed projects
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

      {/* Monitoring Modal */}
      {showMonitoringModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Project Monitoring - {selectedProject.title}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMonitoringModal(false)}
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Monitor project performance and impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Project Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {selectedProject.type}</div>
                    <div><strong>Province:</strong> {selectedProject.province}</div>
                    <div><strong>Final Budget:</strong> {formatCurrency(selectedProject.budget)}</div>
                    <div><strong>Status:</strong> <StatusBadge status={selectedProject.status} /></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Completion Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Start Date:</strong> {selectedProject.startDate ? formatDate(selectedProject.startDate) : 'N/A'}</div>
                    <div><strong>End Date:</strong> {selectedProject.endDate ? formatDate(selectedProject.endDate) : 'N/A'}</div>
                    <div><strong>Duration:</strong> 45 days</div>
                    <div><strong>Last Updated:</strong> {formatDate(selectedProject.updatedAt)}</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-medium mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">95%</div>
                        <div className="text-sm text-muted-foreground">Quality Score</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">On Time</div>
                        <div className="text-sm text-muted-foreground">Delivery Status</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">₱2.1M</div>
                        <div className="text-sm text-muted-foreground">Cost Savings</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Impact Assessment */}
              <div>
                <h4 className="font-medium mb-4">Community Impact Assessment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Economic Impact</h5>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• Jobs Created: 25</div>
                      <div>• Local Business Growth: +15%</div>
                      <div>• Agricultural Productivity: +30%</div>
                      <div>• Market Access: Improved</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Social Impact</h5>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• Beneficiaries: 500+ families</div>
                      <div>• Travel Time Reduction: 40%</div>
                      <div>• Safety Improvement: High</div>
                      <div>• Community Satisfaction: 92%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitoring Recommendations */}
              <div>
                <h4 className="font-medium mb-4">Monitoring Recommendations</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Continue regular maintenance schedule</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Monitor usage patterns for optimization</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Schedule follow-up impact assessment in 6 months</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowMonitoringModal(false)}
                >
                  Close
                </Button>
                <Button>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
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
