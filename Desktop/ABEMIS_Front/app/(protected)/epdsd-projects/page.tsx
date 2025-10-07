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
  

  // Fixed EPDSD projects - 50 entries for consistent evaluation
  const fixedEPDSDProjects = [
    {
      id: 'PRJ-EPDSD-001',
      title: 'Rural Water Supply System - Region 1',
      type: 'Infrastructure',
      province: 'Ilocos Norte',
      region: 'Region 1',
      status: 'Proposal',
      description: 'A comprehensive water supply system for rural communities in Ilocos Norte',
      budget: 15000000,
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      updatedAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-002',
      title: 'Agricultural Machinery Distribution - Region 2',
      type: 'Machinery',
      province: 'Cagayan',
      region: 'Region 2',
      status: 'Proposal',
      description: 'Distribution of modern agricultural machinery to farmers in Cagayan',
      budget: 25000000,
      startDate: '2024-02-15',
      endDate: '2024-11-30',
      updatedAt: '2024-01-22T14:20:00Z'
    },
    {
      id: 'PRJ-EPDSD-003',
      title: 'Road Construction Project - Region 3',
      type: 'Infrastructure',
      province: 'Nueva Ecija',
      region: 'Region 3',
      status: 'Proposal',
      description: 'Construction of farm-to-market roads in Nueva Ecija',
      budget: 30000000,
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      updatedAt: '2024-01-25T09:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-004',
      title: 'Irrigation Infrastructure - Region 4',
      type: 'Infrastructure',
      province: 'Quezon',
      region: 'Region 4',
      status: 'Proposal',
      description: 'Modern irrigation system for agricultural lands in Quezon',
      budget: 22000000,
      startDate: '2024-03-15',
      endDate: '2025-01-31',
      updatedAt: '2024-01-28T11:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-005',
      title: 'Heavy Equipment Procurement - Region 5',
      type: 'Machinery',
      province: 'Camarines Sur',
      region: 'Region 5',
      status: 'Proposal',
      description: 'Procurement of heavy equipment for construction projects',
      budget: 35000000,
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      updatedAt: '2024-02-01T08:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-006',
      title: 'Rural Electrification Project - Region 6',
      type: 'Infrastructure',
      province: 'Iloilo',
      region: 'Region 6',
      status: 'Proposal',
      description: 'Rural electrification system for remote communities',
      budget: 28000000,
      startDate: '2024-04-15',
      endDate: '2025-02-15',
      updatedAt: '2024-02-05T13:20:00Z'
    },
    {
      id: 'PRJ-EPDSD-007',
      title: 'Agricultural Processing Machinery - Region 7',
      type: 'Machinery',
      province: 'Cebu',
      region: 'Region 7',
      status: 'Proposal',
      description: 'Processing equipment for agricultural products',
      budget: 18000000,
      startDate: '2024-05-01',
      endDate: '2024-12-31',
      updatedAt: '2024-02-10T15:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-008',
      title: 'Community Health Center - Region 8',
      type: 'Infrastructure',
      province: 'Leyte',
      region: 'Region 8',
      status: 'Proposal',
      description: 'Construction of community health center in Leyte',
      budget: 12000000,
      startDate: '2024-05-15',
      endDate: '2025-01-15',
      updatedAt: '2024-02-12T09:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-009',
      title: 'Construction Equipment Program - Region 9',
      type: 'Machinery',
      province: 'Zamboanga del Sur',
      region: 'Region 9',
      status: 'Proposal',
      description: 'Construction equipment for infrastructure projects',
      budget: 40000000,
      startDate: '2024-06-01',
      endDate: '2025-04-30',
      updatedAt: '2024-02-15T12:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-010',
      title: 'School Building Construction - Region 10',
      type: 'Infrastructure',
      province: 'Misamis Oriental',
      region: 'Region 10',
      status: 'Proposal',
      description: 'Construction of new school buildings in Misamis Oriental',
      budget: 16000000,
      startDate: '2024-06-15',
      endDate: '2025-02-28',
      updatedAt: '2024-02-18T14:00:00Z'
    },
    {
      id: 'PRJ-EPDSD-011',
      title: 'Bridge Construction Project - Region 1',
      type: 'Infrastructure',
      province: 'Ilocos Sur',
      region: 'Region 1',
      status: 'Proposal',
      description: 'Construction of concrete bridge connecting rural communities',
      budget: 42000000,
      startDate: '2024-07-01',
      endDate: '2025-05-31',
      updatedAt: '2024-02-20T16:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-012',
      title: 'Farm Equipment Distribution - Region 2',
      type: 'Machinery',
      province: 'Isabela',
      region: 'Region 2',
      status: 'Proposal',
      description: 'Distribution of modern farming equipment to agricultural cooperatives',
      budget: 32000000,
      startDate: '2024-07-15',
      endDate: '2025-04-15',
      updatedAt: '2024-02-22T11:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-013',
      title: 'Market Development Project - Region 3',
      type: 'Infrastructure',
      province: 'Pampanga',
      region: 'Region 3',
      status: 'Proposal',
      description: 'Development of modern public market facility',
      budget: 28000000,
      startDate: '2024-08-01',
      endDate: '2025-03-31',
      updatedAt: '2024-02-25T09:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-014',
      title: 'Industrial Machinery Installation - Region 4',
      type: 'Machinery',
      province: 'Laguna',
      region: 'Region 4',
      status: 'Proposal',
      description: 'Installation of industrial processing machinery',
      budget: 45000000,
      startDate: '2024-08-15',
      endDate: '2025-06-30',
      updatedAt: '2024-02-28T14:20:00Z'
    },
    {
      id: 'PRJ-EPDSD-015',
      title: 'Drainage System Improvement - Region 5',
      type: 'Infrastructure',
      province: 'Albay',
      region: 'Region 5',
      status: 'Proposal',
      description: 'Improvement of urban drainage system',
      budget: 19000000,
      startDate: '2024-09-01',
      endDate: '2025-01-31',
      updatedAt: '2024-03-02T10:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-016',
      title: 'Transportation Fleet Development - Region 6',
      type: 'Machinery',
      province: 'Negros Occidental',
      region: 'Region 6',
      status: 'Proposal',
      description: 'Development of public transportation fleet',
      budget: 38000000,
      startDate: '2024-09-15',
      endDate: '2025-05-15',
      updatedAt: '2024-03-05T13:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-017',
      title: 'Flood Control System - Region 7',
      type: 'Infrastructure',
      province: 'Bohol',
      region: 'Region 7',
      status: 'Proposal',
      description: 'Construction of flood control infrastructure',
      budget: 52000000,
      startDate: '2024-10-01',
      endDate: '2025-07-31',
      updatedAt: '2024-03-08T08:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-018',
      title: 'Equipment Rental Program - Region 8',
      type: 'Machinery',
      province: 'Samar',
      region: 'Region 8',
      status: 'Proposal',
      description: 'Establishment of equipment rental services',
      budget: 21000000,
      startDate: '2024-10-15',
      endDate: '2025-02-28',
      updatedAt: '2024-03-10T15:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-019',
      title: 'Public Transportation Hub - Region 9',
      type: 'Infrastructure',
      province: 'Zamboanga del Norte',
      region: 'Region 9',
      status: 'Proposal',
      description: 'Construction of modern transportation hub',
      budget: 34000000,
      startDate: '2024-11-01',
      endDate: '2025-04-30',
      updatedAt: '2024-03-12T12:00:00Z'
    },
    {
      id: 'PRJ-EPDSD-020',
      title: 'Specialized Machinery Training - Region 10',
      type: 'Machinery',
      province: 'Bukidnon',
      region: 'Region 10',
      status: 'Proposal',
      description: 'Training program for specialized machinery operation',
      budget: 14000000,
      startDate: '2024-11-15',
      endDate: '2025-01-15',
      updatedAt: '2024-03-15T11:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-021',
      title: 'Telecommunications Infrastructure - Region 11',
      type: 'Infrastructure',
      province: 'Davao del Sur',
      region: 'Region 11',
      status: 'Proposal',
      description: 'Development of telecommunications infrastructure',
      budget: 48000000,
      startDate: '2024-12-01',
      endDate: '2025-08-31',
      updatedAt: '2024-03-18T09:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-022',
      title: 'Machinery Repair Services - Region 12',
      type: 'Machinery',
      province: 'South Cotabato',
      region: 'Region 12',
      status: 'Proposal',
      description: 'Establishment of machinery repair and maintenance services',
      budget: 17000000,
      startDate: '2024-12-15',
      endDate: '2025-02-15',
      updatedAt: '2024-03-20T14:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-023',
      title: 'Waste Management Facility - Region 13',
      type: 'Infrastructure',
      province: 'Agusan del Norte',
      region: 'Region 13',
      status: 'Proposal',
      description: 'Construction of modern waste management facility',
      budget: 36000000,
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      updatedAt: '2024-03-22T10:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-024',
      title: 'Industrial Equipment Upgrade - Region 1',
      type: 'Machinery',
      province: 'La Union',
      region: 'Region 1',
      status: 'Proposal',
      description: 'Upgrading of industrial equipment systems',
      budget: 41000000,
      startDate: '2025-01-15',
      endDate: '2025-07-15',
      updatedAt: '2024-03-25T13:20:00Z'
    },
    {
      id: 'PRJ-EPDSD-025',
      title: 'Environmental Protection Project - Region 2',
      type: 'Infrastructure',
      province: 'Nueva Vizcaya',
      region: 'Region 2',
      status: 'Proposal',
      description: 'Environmental protection and conservation infrastructure',
      budget: 29000000,
      startDate: '2025-02-01',
      endDate: '2025-05-31',
      updatedAt: '2024-03-28T08:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-026',
      title: 'Agricultural Processing Machinery - Region 3',
      type: 'Machinery',
      province: 'Tarlac',
      region: 'Region 3',
      status: 'Proposal',
      description: 'Agricultural processing equipment for crop production',
      budget: 26000000,
      startDate: '2025-02-15',
      endDate: '2025-04-15',
      updatedAt: '2024-03-30T15:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-027',
      title: 'Disaster Risk Reduction Infrastructure - Region 4',
      type: 'Infrastructure',
      province: 'Rizal',
      region: 'Region 4',
      status: 'Proposal',
      description: 'Infrastructure for disaster risk reduction and mitigation',
      budget: 47000000,
      startDate: '2025-03-01',
      endDate: '2025-09-30',
      updatedAt: '2024-04-02T11:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-028',
      title: 'Storage Facilities Equipment - Region 5',
      type: 'Machinery',
      province: 'Sorsogon',
      region: 'Region 5',
      status: 'Proposal',
      description: 'Equipment for agricultural product storage facilities',
      budget: 23000000,
      startDate: '2025-03-15',
      endDate: '2025-05-15',
      updatedAt: '2024-04-05T12:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-029',
      title: 'Community Center Construction - Region 6',
      type: 'Infrastructure',
      province: 'Capiz',
      region: 'Region 6',
      status: 'Proposal',
      description: 'Construction of multi-purpose community center',
      budget: 31000000,
      startDate: '2025-04-01',
      endDate: '2025-08-31',
      updatedAt: '2024-04-08T09:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-030',
      title: 'Processing Equipment and Tools - Region 7',
      type: 'Machinery',
      province: 'Negros Oriental',
      region: 'Region 7',
      status: 'Proposal',
      description: 'Processing equipment and specialized tools for manufacturing',
      budget: 20000000,
      startDate: '2025-04-15',
      endDate: '2025-06-15',
      updatedAt: '2024-04-10T14:20:00Z'
    },
    {
      id: 'PRJ-EPDSD-031',
      title: 'Maintenance and Repair Facilities - Region 8',
      type: 'Infrastructure',
      province: 'Northern Samar',
      region: 'Region 8',
      status: 'Proposal',
      description: 'Construction of maintenance and repair facilities',
      budget: 27000000,
      startDate: '2025-05-01',
      endDate: '2025-07-31',
      updatedAt: '2024-04-12T16:00:00Z'
    },
    {
      id: 'PRJ-EPDSD-032',
      title: 'Agricultural Cooperative Support Equipment - Region 9',
      type: 'Machinery',
      province: 'Zamboanga Sibugay',
      region: 'Region 9',
      status: 'Proposal',
      description: 'Equipment support for agricultural cooperatives',
      budget: 18000000,
      startDate: '2025-05-15',
      endDate: '2025-07-15',
      updatedAt: '2024-04-15T10:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-033',
      title: 'Farm Business Development Center - Region 10',
      type: 'Infrastructure',
      province: 'Camiguin',
      region: 'Region 10',
      status: 'Proposal',
      description: 'Construction of farm business development center',
      budget: 25000000,
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      updatedAt: '2024-04-18T13:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-034',
      title: 'Agricultural Technology Transfer Equipment - Region 11',
      type: 'Machinery',
      province: 'Davao Oriental',
      region: 'Region 11',
      status: 'Proposal',
      description: 'Equipment for agricultural technology transfer programs',
      budget: 22000000,
      startDate: '2025-06-15',
      endDate: '2025-08-15',
      updatedAt: '2024-04-20T11:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-035',
      title: 'Crop Diversification Program Infrastructure - Region 12',
      type: 'Infrastructure',
      province: 'Cotabato',
      region: 'Region 12',
      status: 'Proposal',
      description: 'Infrastructure support for crop diversification programs',
      budget: 33000000,
      startDate: '2025-07-01',
      endDate: '2025-10-31',
      updatedAt: '2024-04-22T15:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-036',
      title: 'Agricultural Marketing Support Equipment - Region 13',
      type: 'Machinery',
      province: 'Surigao del Norte',
      region: 'Region 13',
      status: 'Proposal',
      description: 'Equipment for agricultural marketing support programs',
      budget: 19000000,
      startDate: '2025-07-15',
      endDate: '2025-09-15',
      updatedAt: '2024-04-25T12:00:00Z'
    },
    {
      id: 'PRJ-EPDSD-037',
      title: 'Farm Equipment Maintenance Center - Region 1',
      type: 'Infrastructure',
      province: 'Pangasinan',
      region: 'Region 1',
      status: 'Proposal',
      description: 'Construction of farm equipment maintenance center',
      budget: 24000000,
      startDate: '2025-08-01',
      endDate: '2025-10-31',
      updatedAt: '2024-04-28T09:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-038',
      title: 'Agricultural Extension Services Equipment - Region 2',
      type: 'Machinery',
      province: 'Quirino',
      region: 'Region 2',
      status: 'Proposal',
      description: 'Equipment for agricultural extension services',
      budget: 16000000,
      startDate: '2025-08-15',
      endDate: '2025-10-15',
      updatedAt: '2024-05-01T14:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-039',
      title: 'Modern Farming Equipment Distribution Center - Region 3',
      type: 'Infrastructure',
      province: 'Zambales',
      region: 'Region 3',
      status: 'Proposal',
      description: 'Construction of modern farming equipment distribution center',
      budget: 37000000,
      startDate: '2025-09-01',
      endDate: '2025-12-31',
      updatedAt: '2024-05-03T11:00:00Z'
    },
    {
      id: 'PRJ-EPDSD-040',
      title: 'Crop Production Enhancement Equipment - Region 4',
      type: 'Machinery',
      province: 'Batangas',
      region: 'Region 4',
      status: 'Proposal',
      description: 'Equipment for crop production enhancement programs',
      budget: 21000000,
      startDate: '2025-09-15',
      endDate: '2025-11-15',
      updatedAt: '2024-05-05T16:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-041',
      title: 'Agricultural Training Center - Region 5',
      type: 'Infrastructure',
      province: 'Camarines Norte',
      region: 'Region 5',
      status: 'Proposal',
      description: 'Construction of agricultural training center',
      budget: 28000000,
      startDate: '2025-10-01',
      endDate: '2026-01-31',
      updatedAt: '2024-05-08T13:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-042',
      title: 'Seed Production Facility Equipment - Region 6',
      type: 'Machinery',
      province: 'Guimaras',
      region: 'Region 6',
      status: 'Proposal',
      description: 'Equipment for seed production facility',
      budget: 25000000,
      startDate: '2025-10-15',
      endDate: '2025-12-15',
      updatedAt: '2024-05-10T10:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-043',
      title: 'Organic Farming Initiative Infrastructure - Region 7',
      type: 'Infrastructure',
      province: 'Siquijor',
      region: 'Region 7',
      status: 'Proposal',
      description: 'Infrastructure support for organic farming initiatives',
      budget: 20000000,
      startDate: '2025-11-01',
      endDate: '2026-01-31',
      updatedAt: '2024-05-12T15:20:00Z'
    },
    {
      id: 'PRJ-EPDSD-044',
      title: 'Farm-to-Market Road Development Equipment - Region 8',
      type: 'Machinery',
      province: 'Eastern Samar',
      region: 'Region 8',
      status: 'Proposal',
      description: 'Equipment for farm-to-market road development',
      budget: 39000000,
      startDate: '2025-11-15',
      endDate: '2026-02-15',
      updatedAt: '2024-05-15T12:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-045',
      title: 'Agricultural Research Station - Region 9',
      type: 'Infrastructure',
      province: 'Zamboanga del Norte',
      region: 'Region 9',
      status: 'Proposal',
      description: 'Construction of agricultural research station',
      budget: 35000000,
      startDate: '2025-12-01',
      endDate: '2026-03-31',
      updatedAt: '2024-05-18T09:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-046',
      title: 'Industrial Equipment Pool - Region 10',
      type: 'Machinery',
      province: 'Lanao del Norte',
      region: 'Region 10',
      status: 'Proposal',
      description: 'Establishment of industrial equipment pool',
      budget: 43000000,
      startDate: '2025-12-15',
      endDate: '2026-03-15',
      updatedAt: '2024-05-20T14:00:00Z'
    },
    {
      id: 'PRJ-EPDSD-047',
      title: 'Transportation Equipment Program - Region 11',
      type: 'Infrastructure',
      province: 'Davao Occidental',
      region: 'Region 11',
      status: 'Proposal',
      description: 'Infrastructure for transportation equipment program',
      budget: 32000000,
      startDate: '2026-01-01',
      endDate: '2026-04-30',
      updatedAt: '2024-05-22T11:15:00Z'
    },
    {
      id: 'PRJ-EPDSD-048',
      title: 'Specialized Industrial Equipment - Region 12',
      type: 'Machinery',
      province: 'Sarangani',
      region: 'Region 12',
      status: 'Proposal',
      description: 'Procurement of specialized industrial equipment',
      budget: 46000000,
      startDate: '2026-01-15',
      endDate: '2026-04-15',
      updatedAt: '2024-05-25T16:30:00Z'
    },
    {
      id: 'PRJ-EPDSD-049',
      title: 'Environmental Impact Assessment Center - Region 13',
      type: 'Infrastructure',
      province: 'Agusan del Sur',
      region: 'Region 13',
      status: 'Proposal',
      description: 'Construction of environmental impact assessment center',
      budget: 29000000,
      startDate: '2026-02-01',
      endDate: '2026-05-31',
      updatedAt: '2024-05-28T13:45:00Z'
    },
    {
      id: 'PRJ-EPDSD-050',
      title: 'Construction Equipment Pool - Region 4B',
      type: 'Machinery',
      province: 'Palawan',
      region: 'Region 4B',
      status: 'Proposal',
      description: 'Establishment of construction equipment pool',
      budget: 38000000,
      startDate: '2026-02-15',
      endDate: '2026-05-15',
      updatedAt: '2024-05-30T10:00:00Z'
    }
  ]

  const epdsdProjects = fixedEPDSDProjects


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
