'use client'

import { useState, useCallback } from 'react'
import { DataTable, StatusBadge, ActionButton } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockDocuments } from '@/lib/mock/data'
import { formatDate } from '@/lib/utils'
import { Search, Filter, Upload, FileText, Download } from 'lucide-react'
import { Document } from '@/lib/types'

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const handlePreviewDocument = useCallback((documentId: string) => {
    console.log('Preview document', documentId)
  }, [])

  const handleDownloadDocument = useCallback((documentId: string) => {
    console.log('Download document', documentId)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setStatusFilter('all')
    setTypeFilter('all')
  }, [])

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.linkedProject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    const matchesType = typeFilter === 'all' || doc.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const columns = [
    {
      key: 'name',
      label: 'Document Name',
      render: (value: string, row: Document) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.size}</div>
          </div>
        </div>
      )
    },
    {
      key: 'linkedProject',
      label: 'Linked Project',
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      render: (value: string) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => formatDate(value)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage project documents and files
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter documents by status, type, or search terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
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
              <label className="text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="Validated">Validated</option>
                <option value="For Review">For Review</option>
                <option value="Missing">Missing</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
                <option value="DWG">DWG</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
          <CardDescription>
            Project documents and file management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredDocuments} />
        </CardContent>
      </Card>
    </div>
  )
}
