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
import { 
  Building2, 
  Upload, 
  Save, 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Users, 
  Settings,
  Clock,
  Target,
  Banknote,
  Cog,
  CheckCircle
} from 'lucide-react'
import { useLocationData } from '@/lib/hooks/use-location-data'
import { useAuth } from '@/lib/contexts/auth-context'
import { findPSGCRegionCode } from '@/lib/utils'

interface InventoryInfraProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: Record<string, unknown>) => void
  showCloseButton?: boolean
  onBudgetChange?: (budget: number) => void
}

// Mock data for dropdowns
const projectClassifications = [
  'Road Construction',
  'Bridge Construction',
  'Irrigation System',
  'Water System',
  'School Building',
  'Health Center',
  'Market Building',
  'Other Infrastructure'
]

const projectTypes = [
  'Concrete Road',
  'Gravel Road',
  'Asphalt Road',
  'Footbridge',
  'Vehicle Bridge',
  'Irrigation Canal',
  'Water Tank',
  'School Classroom',
  'Health Center Building',
  'Market Stall'
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

// Required documents for infrastructure projects (from proposal stage)
const requiredDocuments = [
  {
    id: 'DOC-001',
    name: 'Letter of Intent',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-002', 
    name: 'Validation Report',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-003',
    name: 'FS/EFA (Feasibility Study/Environmental Impact Assessment)',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-004',
    name: 'DED (Detailed Engineering Design)',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-005',
    name: 'POW (Program of Work)',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-006',
    name: 'Right of Way Documents',
    type: 'PDF',
    required: true
  },
  {
    id: 'DOC-007',
    name: 'Other Documents',
    type: 'PDF',
    required: false
  }
]

export function InventoryInfraProjectModal({ isOpen, onClose, onProjectCreate, showCloseButton = false, onBudgetChange }: InventoryInfraProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  
  // Step 1: Project Description
  const [projectClassification, setProjectClassification] = useState('')
  const [projectType, setProjectType] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  
  // Step 2: Budget Source
  const [implementationDays, setImplementationDays] = useState('')
  const [prexcProgram, setPrexcProgram] = useState('')
  const [prexcSubProgram, setPrexcSubProgram] = useState('')
  const [budgetProcess, setBudgetProcess] = useState('')
  const [proposedFundSource, setProposedFundSource] = useState('')
  const [sourceAgency, setSourceAgency] = useState('')
  const [bannerProgram, setBannerProgram] = useState('')
  const [fundingYear, setFundingYear] = useState('')
  const [allocatedAmount, setAllocatedAmount] = useState('')
  
  // Call budget change callback when allocated amount changes
  React.useEffect(() => {
    if (onBudgetChange && allocatedAmount) {
      const budget = parseFloat(allocatedAmount) || 0
      onBudgetChange(budget)
    }
  }, [allocatedAmount, onBudgetChange])
  
  // Step 3: Location - Using PSGC API
  const {
    locationData,
    selection,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange
  } = useLocationData()
  
  // Get current user for RAED region locking
  const { user } = useAuth()
  const isRAEDUser = user?.role === 'RAED' && !!user?.regionAssigned
  const lockedRegionCode = isRAEDUser && locationData.regions.length > 0 && user?.regionAssigned
    ? findPSGCRegionCode(user.regionAssigned, locationData.regions)
    : null
  
  // Legacy location state for backward compatibility
  const [district, setDistrict] = useState('')
  
  // Step 4: Document Upload
  const [documents, setDocuments] = useState<Array<{file: File, label: string, id: string}>>([])
  
  // Project Status - Always set to Inventory for completed projects
  const [projectStatus] = useState<'Inventory'>('Inventory')
  
  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false)
  
  // Auto-select and lock region for RAED users when modal opens
  // This also automatically loads provinces for the locked region
  React.useEffect(() => {
    if (isOpen && isRAEDUser && lockedRegionCode && !selection.region && locationData.regions.length > 0 && !locationData.loading.regions) {
      const matchedRegion = locationData.regions.find(r => r.code === lockedRegionCode)
      if (matchedRegion) {
        // handleRegionChange will automatically load provinces for this region
        handleRegionChange(matchedRegion.code, matchedRegion.name)
      }
    }
  }, [isOpen, isRAEDUser, lockedRegionCode, locationData.regions, locationData.loading.regions, selection.region, handleRegionChange])

  // Track form changes to detect unsaved changes
  React.useEffect(() => {
    if (isOpen) {
      const hasChanges = !!(projectTitle || projectDescription || projectClassification || 
                        projectType || implementationDays || prexcProgram || 
                        prexcSubProgram || selection.region || selection.province || selection.city || 
                        district || selection.barangay || allocatedAmount || documents.length > 0)
      setHasUnsavedChanges(hasChanges)
    }
  }, [projectTitle, projectDescription, projectClassification, projectType, 
      implementationDays, prexcProgram, prexcSubProgram, selection.region, selection.province, 
      selection.city, district, selection.barangay, allocatedAmount, documents, isOpen])

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const handleSubmit = () => {
    const projectData = {
      // Step 1
      projectClassification,
      projectType,
      projectTitle,
      projectDescription,
      // Step 2
      implementationDays,
      prexcProgram,
      prexcSubProgram,
      budgetProcess,
      proposedFundSource,
      sourceAgency,
      bannerProgram,
      fundingYear,
      allocatedAmount,
      budget: parseFloat(allocatedAmount) || 0,
      // Step 3 - Location data from PSGC API
      region: locationData.regions.find(r => r.code === selection.region)?.name || '',
      province: locationData.provinces.find(p => p.code === selection.province)?.name || '',
      municipality: locationData.cities.find(c => c.code === selection.city)?.name || '',
      district,
      barangay: locationData.barangays.find(b => b.code === selection.barangay)?.name || '',
      // PSGC codes for reference
      regionCode: selection.region,
      provinceCode: selection.province,
      cityCode: selection.city,
      barangayCode: selection.barangay,
      // Step 4
      documents,
      // Status
      status: 'Inventory', // Always create as Inventory for completed projects
      type: 'Infrastructure',
      isInventory: true
    }

    onProjectCreate(projectData)
    setHasUnsavedChanges(false)
    performClose()
  }

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true)
    } else {
      performClose()
    }
  }

  const performClose = () => {
    // Reset all form data
    setCurrentStep(1)
    setProjectClassification('')
    setProjectType('')
    setProjectTitle('')
    setProjectDescription('')
    setImplementationDays('')
    setPrexcProgram('')
    setPrexcSubProgram('')
    setBudgetProcess('')
    setProposedFundSource('')
    setSourceAgency('')
    setBannerProgram('')
    setFundingYear('')
    setAllocatedAmount('')
    setDistrict('')
    setDocuments([])
    setHasUnsavedChanges(false)
    setShowUnsavedChangesDialog(false)
    onClose()
  }

  const handleSaveAndClose = () => {
    handleSubmit()
    setShowUnsavedChangesDialog(false)
  }

  const handleDiscardChanges = () => {
    setShowUnsavedChangesDialog(false)
    performClose()
  }

  const isStep1Valid = projectClassification && projectType && projectTitle && projectDescription
  const isStep2Valid = implementationDays && prexcProgram && prexcSubProgram && budgetProcess && 
                      proposedFundSource && sourceAgency && bannerProgram && fundingYear && allocatedAmount
  const isStep3Valid = selection.region && selection.province && selection.city && selection.barangay
  const isStep4Valid = true // Documents are optional for inventory projects

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto p-0">
        {/* Fixed Header and Progress Indicator */}
        <div className="sticky top-0 z-50 bg-background border-b p-6">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Add Infrastructure Project to Inventory
                </DialogTitle>
                <DialogDescription>
                  Step {currentStep} of 5: {
                    currentStep === 1 ? 'Project Description' :
                    currentStep === 2 ? 'Budget Source' : 
                    currentStep === 3 ? 'Location' : 
                    currentStep === 4 ? 'Document Upload' : 'Summary'
                  }
                </DialogDescription>
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>
          
          {/* Enhanced Progress Indicator */}
          <div className="pb-4">
            <div className="flex items-start justify-center w-full">
            {[
              { step: 1, label: 'Project Description', icon: FileText },
              { step: 2, label: 'Budget Source', icon: DollarSign },
              { step: 3, label: 'Location', icon: MapPin },
              { step: 4, label: 'Document Upload', icon: Upload },
              { step: 5, label: 'Summary', icon: Target }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex flex-col items-center flex-1 min-w-0">
                <div className="flex items-center w-full justify-center mb-3">
                  <button
                    onClick={() => {
                      if (step === currentStep) {
                        setCurrentStep(step)
                      }
                    }}
                    disabled={step !== currentStep}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 flex-shrink-0 shadow-sm ${
                      step === currentStep
                        ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer ring-2 ring-blue-300 shadow-md'
                        : step < currentStep
                        ? 'bg-green-600 text-white cursor-default shadow-md'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {step < currentStep ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </button>
                  {index < 4 && (
                    <div className={`flex-1 h-1 mx-3 rounded-full transition-colors duration-300 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                <span className={`text-xs text-center px-1 leading-tight font-medium transition-colors duration-200 ${
                  step === currentStep
                    ? 'text-blue-600'
                    : step < currentStep
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="classification" className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-600" />
                  Project Classification *
                </Label>
                <select
                  id="classification"
                  value={projectClassification}
                  onChange={(e) => setProjectClassification(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Classification</option>
                  {projectClassifications.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-600" />
                  Project Type *
                </Label>
                <select
                  id="type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  {projectTypes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  Project Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  Project Description *
                </Label>
                <textarea
                  id="description"
                  placeholder="Enter project description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="days">Implementation Schedule (Calendar Days) *</Label>
                <Input
                  id="days"
                  type="number"
                  placeholder="Enter number of days"
                  value={implementationDays}
                  onChange={(e) => setImplementationDays(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prexc">PREXC Program *</Label>
                  <select
                    id="prexc"
                    value={prexcProgram}
                    onChange={(e) => setPrexcProgram(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select Program</option>
                    {prexcPrograms.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prexcSub">PREXC Sub Program *</Label>
                  <select
                    id="prexcSub"
                    value={prexcSubProgram}
                    onChange={(e) => setPrexcSubProgram(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select Sub Program</option>
                    {prexcSubPrograms.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Process *</Label>
                  <select
                    id="budget"
                    value={budgetProcess}
                    onChange={(e) => setBudgetProcess(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select Process</option>
                    {budgetProcesses.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundSource">Proposed Fund Source *</Label>
                  <select
                    id="fundSource"
                    value={proposedFundSource}
                    onChange={(e) => setProposedFundSource(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select Fund Source</option>
                    {fundSources.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agency">Source Agency *</Label>
                  <select
                    id="agency"
                    value={sourceAgency}
                    onChange={(e) => setSourceAgency(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select Agency</option>
                    {sourceAgencies.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner">Banner Program *</Label>
                  <select
                    id="banner"
                    value={bannerProgram}
                    onChange={(e) => setBannerProgram(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select Program</option>
                    {bannerPrograms.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Funding Year *</Label>
                  <select
                    id="year"
                    value={fundingYear}
                    onChange={(e) => setFundingYear(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select Year</option>
                    {fundingYears.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Proposed Allocated Amount (PHP) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount in PHP"
                    value={allocatedAmount}
                    onChange={(e) => setAllocatedAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              {locationData.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{locationData.error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="region" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  Region *
                </Label>
                <select
                  id="region"
                  value={selection.region || lockedRegionCode || ''}
                  onChange={(e) => {
                    const selectedRegion = locationData.regions.find(r => r.code === e.target.value)
                    if (selectedRegion) {
                      handleRegionChange(selectedRegion.code, selectedRegion.name)
                    }
                  }}
                  disabled={locationData.loading.regions || isRAEDUser}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50"
                >
                  <option value="">{locationData.loading.regions ? 'Loading regions...' : 'Select Region'}</option>
                  {locationData.regions.map((region) => (
                    <option key={region.code} value={region.code}>{region.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="province" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  Province *
                </Label>
                <select
                  id="province"
                  value={selection.province}
                  onChange={(e) => {
                    const selectedProvince = locationData.provinces.find(p => p.code === e.target.value)
                    if (selectedProvince) {
                      handleProvinceChange(selectedProvince.code, selectedProvince.name)
                    }
                  }}
                  disabled={(!selection.region && !lockedRegionCode) || locationData.loading.provinces}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    {(!selection.region && !lockedRegionCode)
                      ? 'Select a region first' 
                      : locationData.loading.provinces 
                        ? 'Loading provinces...' 
                        : 'Select Province'
                    }
                  </option>
                  {locationData.provinces.map((province) => (
                    <option key={province.code} value={province.code}>{province.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipality" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  Municipality/City *
                </Label>
                <select
                  id="municipality"
                  value={selection.city}
                  onChange={(e) => {
                    const selectedCity = locationData.cities.find(c => c.code === e.target.value)
                    if (selectedCity) {
                      handleCityChange(selectedCity.code, selectedCity.name, selectedCity.type)
                    }
                  }}
                  disabled={!selection.province || locationData.loading.cities}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    {!selection.province 
                      ? 'Select a province first' 
                      : locationData.loading.cities 
                        ? 'Loading cities...' 
                        : 'Select Municipality/City'
                    }
                  </option>
                  {locationData.cities.map((city) => (
                    <option key={city.code} value={city.code}>
                      {city.name} {city.type ? `(${city.type})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District (Optional)</Label>
                <Input
                  id="district"
                  placeholder="Enter district (optional)"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barangay" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  Barangay *
                </Label>
                <select
                  id="barangay"
                  value={selection.barangay}
                  onChange={(e) => {
                    const selectedBarangay = locationData.barangays.find(b => b.code === e.target.value)
                    if (selectedBarangay) {
                      handleBarangayChange(selectedBarangay.code, selectedBarangay.name)
                    }
                  }}
                  disabled={!selection.city || locationData.loading.barangays}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    {!selection.city 
                      ? 'Select a municipality/city first' 
                      : locationData.loading.barangays 
                        ? 'Loading barangays...' 
                        : 'Select Barangay'
                    }
                  </option>
                  {locationData.barangays.map((barangay) => (
                    <option key={barangay.code} value={barangay.code}>{barangay.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Document Upload</Label>
                <p className="text-sm text-muted-foreground">
                  Upload documents from the completed project. Documents are optional for inventory projects.
                </p>
              </div>

              <div className="space-y-3">
                {requiredDocuments.map((doc) => {
                  const uploadedDoc = documents.find(d => d.label === doc.name || d.id === doc.id)
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          uploadedDoc 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {uploadedDoc ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{doc.name}</span>
                            {doc.required && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Recommended</span>
                            )}
                          </div>
                          {uploadedDoc && (
                            <div className="text-sm text-muted-foreground">
                              {uploadedDoc.file.name} • {(uploadedDoc.file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {uploadedDoc && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveDocument(uploadedDoc.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                        <input
                          type="file"
                          id={`upload-${doc.id}`}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const newDocument = {
                                file,
                                label: doc.name,
                                id: doc.id
                              }
                              setDocuments(prev => prev.filter(d => d.id !== doc.id))
                              setDocuments(prev => [...prev, newDocument])
                              e.target.value = ''
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant={uploadedDoc ? "outline" : "secondary"}
                          size="sm"
                          className={uploadedDoc ? "" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-800"}
                          onClick={() => document.getElementById(`upload-${doc.id}`)?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadedDoc ? 'Replace' : 'Upload'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Project Summary</h3>
                <p className="text-sm text-muted-foreground">Review all information before adding to inventory</p>
              </div>

              {/* Step 1: Project Description Summary */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-primary">1. Project Description</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Classification:</span>
                    <p className="text-muted-foreground">{projectClassification || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <p className="text-muted-foreground">{projectType || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Title:</span>
                    <p className="text-muted-foreground">{projectTitle || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Description:</span>
                    <p className="text-muted-foreground">{projectDescription || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Budget Source Summary */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-primary">2. Budget Source</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Implementation Days:</span>
                    <p className="text-muted-foreground">{implementationDays || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">PREXC Program:</span>
                    <p className="text-muted-foreground">{prexcProgram || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">PREXC Sub Program:</span>
                    <p className="text-muted-foreground">{prexcSubProgram || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Budget Process:</span>
                    <p className="text-muted-foreground">{budgetProcess || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Fund Source:</span>
                    <p className="text-muted-foreground">{proposedFundSource || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Source Agency:</span>
                    <p className="text-muted-foreground">{sourceAgency || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Banner Program:</span>
                    <p className="text-muted-foreground">{bannerProgram || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Funding Year:</span>
                    <p className="text-muted-foreground">{fundingYear || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Allocated Amount:</span>
                    <p className="text-muted-foreground">{allocatedAmount ? `₱${parseFloat(allocatedAmount).toLocaleString()}` : 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Location Summary */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-primary">3. Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Region:</span>
                    <p className="text-muted-foreground">{locationData.regions.find(r => r.code === selection.region)?.name || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Province:</span>
                    <p className="text-muted-foreground">{locationData.provinces.find(p => p.code === selection.province)?.name || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Municipality/City:</span>
                    <p className="text-muted-foreground">
                      {(() => {
                        const selectedCity = locationData.cities.find(c => c.code === selection.city)
                        if (!selectedCity) return 'Not specified'
                        return `${selectedCity.name} ${selectedCity.type ? `(${selectedCity.type})` : ''}`
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">District:</span>
                    <p className="text-muted-foreground">{district || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Barangay:</span>
                    <p className="text-muted-foreground">{locationData.barangays.find(b => b.code === selection.barangay)?.name || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Step 4: Document Upload Summary */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-primary">4. Document Upload</h4>
                <div className="text-sm">
                  <span className="font-medium">Uploaded Documents:</span>
                  {documents.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-background rounded border">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="font-medium">{doc.label || doc.file.name}</span>
                            <span className="text-xs text-muted-foreground">({(doc.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-2">No documents uploaded</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center px-6 pb-6 pt-4">
          {/* Right side - Navigation buttons */}
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep < 5 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid) ||
                  (currentStep === 3 && !isStep3Valid) ||
                  (currentStep === 4 && !isStep4Valid)
                }
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Add to Inventory
              </Button>
            )}
          </div>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation Dialog */}
      <Dialog open={showUnsavedChangesDialog} onOpenChange={setShowUnsavedChangesDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Do you want to save them before closing?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleDiscardChanges}>
              Discard Changes
            </Button>
            <Button onClick={handleSaveAndClose}>
              Save and Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
