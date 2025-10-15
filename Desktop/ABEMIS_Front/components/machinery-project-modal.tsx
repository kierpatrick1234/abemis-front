'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Wrench, Upload, Save, X } from 'lucide-react'
import { SuccessToast } from './success-toast'

interface MachineryProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: Record<string, unknown>) => void
  editingDraft?: any // Project being edited
  showCloseButton?: boolean // Show X button for package projects
  onBudgetChange?: (budget: number) => void // Callback for budget changes
}

// Mock data for dropdowns
const projectClassifications = [
  'Agricultural Machinery',
  'Farm Equipment',
  'Processing Machinery',
  'Transport Equipment',
  'Irrigation Equipment'
]

const projectTypes = [
  'Tractor',
  'Harvester',
  'Thresher',
  'Rice Mill',
  'Corn Mill',
  'Irrigation Pump',
  'Truck',
  'Tiller'
]

const prexcPrograms = [
  'AMEFIP',
  'Rice Program',
  'Corn Program',
  'Livestock Program',
  'Fisheries Program'
]

const prexcSubPrograms = [
  'AMEFIP Sub-Program 1',
  'Rice Sub-Program 1',
  'Corn Sub-Program 1',
  'Livestock Sub-Program 1',
  'Fisheries Sub-Program 1'
]

const budgetProcesses = [
  'Regular Budget',
  'Special Budget',
  'Emergency Budget',
  'Supplementary Budget'
]

const fundSources = [
  'Fund Source Test 1',
  'Fund Source Test 2',
  'Fund Source Test 3',
  'National Budget',
  'Local Budget'
]

const sourceAgencies = [
  'DA-OSEC',
  'DA-BAR',
  'DA-BAI',
  'DA-BFAR',
  'DA-BSWM'
]

const bannerPrograms = [
  'Livestock and Fisheries',
  'Coconut Farm and Industry',
  'Bayanihan',
  'Plant, Plant, Plant',
  'Kadiwa'
]

const fundingYears = ['2024', '2025', '2026', '2027']

// Philippine location data
const regions = [
  'National Capital Region (NCR)',
  'Region I - Ilocos Region',
  'Region II - Cagayan Valley',
  'Region III - Central Luzon',
  'Region IV-A - CALABARZON',
  'Region IV-B - MIMAROPA',
  'Region V - Bicol Region',
  'Region VI - Western Visayas',
  'Region VII - Central Visayas',
  'Region VIII - Eastern Visayas',
  'Region IX - Zamboanga Peninsula',
  'Region X - Northern Mindanao',
  'Region XI - Davao Region',
  'Region XII - SOCCSKSARGEN',
  'Region XIII - Caraga',
  'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
  'Cordillera Administrative Region (CAR)'
]

const provinces = [
  'Metro Manila',
  'Ilocos Norte',
  'Ilocos Sur',
  'La Union',
  'Pangasinan',
  'Batanes',
  'Cagayan',
  'Isabela',
  'Nueva Vizcaya',
  'Quirino',
  'Aurora',
  'Bataan',
  'Bulacan',
  'Nueva Ecija',
  'Pampanga',
  'Tarlac',
  'Zambales',
  'Batangas',
  'Cavite',
  'Laguna',
  'Quezon',
  'Rizal',
  'Marinduque',
  'Occidental Mindoro',
  'Oriental Mindoro',
  'Palawan',
  'Romblon',
  'Albay',
  'Camarines Norte',
  'Camarines Sur',
  'Catanduanes',
  'Masbate',
  'Sorsogon',
  'Aklan',
  'Antique',
  'Capiz',
  'Guimaras',
  'Iloilo',
  'Negros Occidental',
  'Bohol',
  'Cebu',
  'Negros Oriental',
  'Siquijor',
  'Biliran',
  'Eastern Samar',
  'Leyte',
  'Northern Samar',
  'Samar',
  'Southern Leyte',
  'Zamboanga del Norte',
  'Zamboanga del Sur',
  'Zamboanga Sibugay',
  'Bukidnon',
  'Camiguin',
  'Lanao del Norte',
  'Misamis Occidental',
  'Misamis Oriental',
  'Davao del Norte',
  'Davao del Sur',
  'Davao Occidental',
  'Davao Oriental',
  'Compostela Valley',
  'North Cotabato',
  'Sarangani',
  'South Cotabato',
  'Sultan Kudarat',
  'Agusan del Norte',
  'Agusan del Sur',
  'Dinagat Islands',
  'Surigao del Norte',
  'Surigao del Sur',
  'Basilan',
  'Lanao del Sur',
  'Maguindanao',
  'Sulu',
  'Tawi-Tawi',
  'Abra',
  'Apayao',
  'Benguet',
  'Ifugao',
  'Kalinga',
  'Mountain Province'
]

const municipalities = [
  'Manila',
  'Quezon City',
  'Caloocan',
  'Las Piñas',
  'Makati',
  'Malabon',
  'Mandaluyong',
  'Marikina',
  'Muntinlupa',
  'Navotas',
  'Parañaque',
  'Pasay',
  'Pasig',
  'Pateros',
  'San Juan',
  'Taguig',
  'Valenzuela',
  'Laoag',
  'Vigan',
  'San Fernando',
  'Urdaneta',
  'Basco',
  'Tuguegarao',
  'Ilagan',
  'Bayombong',
  'Cabarroguis',
  'Baler',
  'Balanga',
  'Malolos',
  'San Jose del Monte',
  'Cabanatuan',
  'San Fernando',
  'Tarlac City',
  'Olongapo',
  'Batangas City',
  'Cavite City',
  'Dasmariñas',
  'Imus',
  'Tagaytay',
  'Trece Martires',
  'Biñan',
  'Cabuyao',
  'Calamba',
  'San Pablo',
  'Santa Rosa',
  'Lucena',
  'Antipolo',
  'Boac',
  'Calapan',
  'Puerto Princesa',
  'Romblon',
  'Legazpi',
  'Daet',
  'Naga',
  'Virac',
  'Masbate City',
  'Sorsogon City',
  'Kalibo',
  'San Jose',
  'Roxas',
  'Jordan',
  'Iloilo City',
  'Bacolod',
  'Tagbilaran',
  'Cebu City',
  'Dumaguete',
  'Siquijor',
  'Naval',
  'Borongan',
  'Tacloban',
  'Catarman',
  'Catbalogan',
  'Maasin',
  'Dipolog',
  'Pagadian',
  'Ipil',
  'Malaybalay',
  'Mambajao',
  'Iligan',
  'Oroquieta',
  'Cagayan de Oro',
  'Tagum',
  'Digos',
  'Mati',
  'Kidapawan',
  'General Santos',
  'Koronadal',
  'Isulan',
  'Butuan',
  'Prosperidad',
  'San Jose',
  'Surigao',
  'Tandag',
  'Isabela',
  'Marawi',
  'Shariff Aguak',
  'Jolo',
  'Bongao',
  'Bangued',
  'Kabugao',
  'Baguio',
  'Lagawe',
  'Tabuk',
  'Bontoc'
]

const districts = [
  'District 1',
  'District 2',
  'District 3',
  'District 4',
  'District 5',
  'District 6',
  'District 7',
  'District 8',
  'District 9',
  'District 10'
]

const barangays = [
  'Barangay 1',
  'Barangay 2',
  'Barangay 3',
  'Barangay 4',
  'Barangay 5',
  'Barangay 6',
  'Barangay 7',
  'Barangay 8',
  'Barangay 9',
  'Barangay 10',
  'Barangay 11',
  'Barangay 12',
  'Barangay 13',
  'Barangay 14',
  'Barangay 15',
  'Barangay 16',
  'Barangay 17',
  'Barangay 18',
  'Barangay 19',
  'Barangay 20'
]

// Required documents for machinery projects (from proposal stage)
const requiredDocuments = [
  {
    id: 'DOC-001',
    name: 'Letter/Resolution',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-002', 
    name: 'UTILIZATION PROPOSAL (BUSINESS PLAN)',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-003',
    name: 'VALIDATION REPORT',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-004',
    name: 'FS/EFA',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-005',
    name: 'TECHNICAL SPECIFICATIONS',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-006',
    name: 'MARKET ANALYSIS',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-007',
    name: 'Others',
    type: 'PDF',
    required: false
  }
]

export function MachineryProjectModal({ isOpen, onClose, onProjectCreate, editingDraft, showCloseButton = false, onBudgetChange }: MachineryProjectModalProps) {
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [formData, setFormData] = useState({
    title: editingDraft?.title || '',
    projectClassification: editingDraft?.projectClassification || '',
    projectType: editingDraft?.projectType || '',
    prexcProgram: editingDraft?.prexcProgram || '',
    prexcSubProgram: editingDraft?.prexcSubProgram || '',
    budgetProcess: editingDraft?.budgetProcess || '',
    proposedFundSource: editingDraft?.proposedFundSource || '',
    sourceAgency: editingDraft?.sourceAgency || '',
    bannerProgram: editingDraft?.bannerProgram || '',
    fundingYear: editingDraft?.fundingYear || '',
    region: editingDraft?.region || '',
    province: editingDraft?.province || '',
    municipality: editingDraft?.municipality || '',
    district: editingDraft?.district || '',
    barangay: editingDraft?.barangay || '',
    budget: editingDraft?.budget || '',
    description: editingDraft?.description || '',
    startDate: editingDraft?.startDate || '',
    endDate: editingDraft?.endDate || ''
  })

  const [documents, setDocuments] = useState<Array<{ file: File; label: string; id: string }>>([])

  // Call budget change callback when budget changes
  React.useEffect(() => {
    if (onBudgetChange && formData.budget) {
      const budget = parseFloat(formData.budget) || 0
      onBudgetChange(budget)
    }
  }, [formData.budget, onBudgetChange])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (documentId: string, file: File) => {
    const document = requiredDocuments.find(doc => doc.id === documentId)
    if (document) {
      const newDocument = {
        file,
        label: document.name,
        id: documentId
      }
      setDocuments(prev => {
        const filtered = prev.filter(doc => doc.id !== documentId)
        return [...filtered, newDocument]
      })
    }
  }

  const handleSubmit = () => {
    const projectData = {
      ...formData,
      type: 'Machinery',
      status: 'Proposal',
      documents: documents,
      budget: parseFloat(formData.budget) || 0,
      updatedAt: new Date().toISOString()
    }

    onProjectCreate(projectData)
    setShowSuccessToast(true)
    
    // For package projects, close modal after success to return to package view
    if (showCloseButton) {
      // Package project - show success then close to return to package view
      setTimeout(() => {
        setShowSuccessToast(false)
        onClose()
      }, 2000)
    } else {
      // Regular project - close modal after success
      setTimeout(() => {
        setShowSuccessToast(false)
        onClose()
      }, 2000)
    }
  }

  const isFormValid = () => {
    return formData.title.trim() !== '' &&
           formData.projectClassification !== '' &&
           formData.projectType !== '' &&
           formData.budget !== '' &&
           formData.description.trim() !== ''
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Create Machinery Project
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for your machinery project proposal
                </DialogDescription>
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter project title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectClassification">Project Classification *</Label>
                  <select
                    id="projectClassification"
                    value={formData.projectClassification}
                    onChange={(e) => handleInputChange('projectClassification', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select classification</option>
                    {projectClassifications.map((classification) => (
                      <option key={classification} value={classification}>
                        {classification}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type *</Label>
                  <select
                    id="projectType"
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (PHP) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="Enter budget amount"
                  />
                </div>
              </div>
            </div>

            {/* Program Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Program Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prexcProgram">PREXC Program</Label>
                  <select
                    id="prexcProgram"
                    value={formData.prexcProgram}
                    onChange={(e) => handleInputChange('prexcProgram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select program</option>
                    {prexcPrograms.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prexcSubProgram">PREXC Sub-Program</Label>
                  <select
                    id="prexcSubProgram"
                    value={formData.prexcSubProgram}
                    onChange={(e) => handleInputChange('prexcSubProgram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select sub-program</option>
                    {prexcSubPrograms.map((subProgram) => (
                      <option key={subProgram} value={subProgram}>
                        {subProgram}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetProcess">Budget Process</Label>
                  <select
                    id="budgetProcess"
                    value={formData.budgetProcess}
                    onChange={(e) => handleInputChange('budgetProcess', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select process</option>
                    {budgetProcesses.map((process) => (
                      <option key={process} value={process}>
                        {process}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposedFundSource">Proposed Fund Source</Label>
                  <select
                    id="proposedFundSource"
                    value={formData.proposedFundSource}
                    onChange={(e) => handleInputChange('proposedFundSource', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select fund source</option>
                    {fundSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sourceAgency">Source Agency</Label>
                  <select
                    id="sourceAgency"
                    value={formData.sourceAgency}
                    onChange={(e) => handleInputChange('sourceAgency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select agency</option>
                    {sourceAgencies.map((agency) => (
                      <option key={agency} value={agency}>
                        {agency}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bannerProgram">Banner Program</Label>
                  <select
                    id="bannerProgram"
                    value={formData.bannerProgram}
                    onChange={(e) => handleInputChange('bannerProgram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select program</option>
                    {bannerPrograms.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundingYear">Funding Year</Label>
                  <select
                    id="fundingYear"
                    value={formData.fundingYear}
                    onChange={(e) => handleInputChange('fundingYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select year</option>
                    {fundingYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <select
                    id="region"
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <select
                    id="province"
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipality">Municipality</Label>
                  <select
                    id="municipality"
                    value={formData.municipality}
                    onChange={(e) => handleInputChange('municipality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select municipality</option>
                    {municipalities.map((municipality) => (
                      <option key={municipality} value={municipality}>
                        {municipality}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <select
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select district</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barangay">Barangay</Label>
                  <select
                    id="barangay"
                    value={formData.barangay}
                    onChange={(e) => handleInputChange('barangay', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select barangay</option>
                    {barangays.map((barangay) => (
                      <option key={barangay} value={barangay}>
                        {barangay}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter project description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
            </div>

            {/* Required Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Required Documents</h3>
              <div className="space-y-3">
                {requiredDocuments.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{document.name}</span>
                        {document.required && <span className="text-red-500">*</span>}
                      </div>
                      <span className="text-sm text-gray-500">({document.type})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(document.id, file)
                          }
                        }}
                        className="hidden"
                        id={`file-${document.id}`}
                      />
                      <label
                        htmlFor={`file-${document.id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 text-sm"
                      >
                        <Upload className="h-4 w-4 inline mr-1" />
                        Upload
                      </label>
                      {documents.find(doc => doc.id === document.id) && (
                        <span className="text-green-600 text-sm">✓ Uploaded</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isFormValid()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showSuccessToast && (
        <SuccessToast 
          message="Machinery project created successfully!" 
          isVisible={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          countdown={3}
        />
      )}
    </>
  )
}
