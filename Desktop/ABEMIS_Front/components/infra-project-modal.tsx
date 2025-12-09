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
  Banknote
} from 'lucide-react'
import { SuccessToast } from './success-toast'
import { useLocationData } from '@/lib/hooks/use-location-data'
import { useAuth } from '@/lib/contexts/auth-context'
import { findPSGCRegionCode } from '@/lib/utils'

interface InfraProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: Record<string, unknown>) => void
  editingDraft?: any // Project being edited
  showCloseButton?: boolean // Show X button for package projects
  onBudgetChange?: (budget: number) => void // Callback for budget changes
}

// Mock data for dropdowns
const projectClassifications = [
  'Commodity Transport Infrastructure',
  'Irrigation Facilities',
  'Production Facilities (Crops)',
  'Production Facilities (Livestock)',
  'Post-harvest and Production Facilities (Fisheries)'
]

const projectTypes = [
  'Road Construction',
  'Bridge Construction',
  'Irrigation System',
  'Warehouse Construction',
  'Processing Facility',
  'Storage Facility'
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
  'Cagayan',
  'Isabela',
  'Nueva Vizcaya',
  'Quirino',
  'Bataan',
  'Bulacan',
  'Nueva Ecija',
  'Pampanga',
  'Tarlac',
  'Zambales',
  'Aurora',
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
  'Davao de Oro',
  'Cotabato',
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
  'Baguio City',
  'Laoag City',
  'Vigan City',
  'San Fernando City',
  'Dagupan City',
  'Tuguegarao City',
  'Isabela City',
  'Bambang',
  'Bayombong',
  'Cabanatuan City',
  'Gapan City',
  'Muñoz City',
  'Palayan City',
  'San Jose City',
  'San Leonardo',
  'Santa Rosa',
  'Santo Domingo',
  'Talavera',
  'Tayug',
  'Balanga City',
  'Malolos City',
  'Meycauayan City',
  'San Jose del Monte City',
  'Angeles City',
  'Mabalacat City',
  'San Fernando City',
  'Tarlac City',
  'Olongapo City',
  'Baler',
  'Batangas City',
  'Lipa City',
  'Tanauan City',
  'Cavite City',
  'Dasmariñas City',
  'Imus City',
  'Tagaytay City',
  'Trece Martires City',
  'Biñan City',
  'Cabuyao City',
  'Calamba City',
  'San Pablo City',
  'Santa Rosa City',
  'Lucena City',
  'Antipolo City',
  'Taytay',
  'Cainta',
  'Rodriguez',
  'San Mateo',
  'Boac',
  'Gasan',
  'Mogpog',
  'Santa Cruz',
  'Torrijos',
  'Calapan City',
  'Puerto Princesa City',
  'Legazpi City',
  'Ligao City',
  'Tabaco City',
  'Daet',
  'Iriga City',
  'Naga City',
  'Virac',
  'Masbate City',
  'Sorsogon City',
  'Kalibo',
  'San Jose',
  'Roxas City',
  'Iloilo City',
  'Passi City',
  'Bacolod City',
  'Bago City',
  'Cadiz City',
  'Escalante City',
  'Himamaylan City',
  'Kabankalan City',
  'La Carlota City',
  'Sagay City',
  'San Carlos City',
  'Silay City',
  'Sipalay City',
  'Talisay City',
  'Victorias City',
  'Tagbilaran City',
  'Cebu City',
  'Lapu-Lapu City',
  'Mandaue City',
  'Toledo City',
  'Dumaguete City',
  'Siquijor',
  'Naval',
  'Borongan City',
  'Tacloban City',
  'Ormoc City',
  'Calbayog City',
  'Catbalogan City',
  'Maasin City',
  'Dipolog City',
  'Dapitan City',
  'Pagadian City',
  'Zamboanga City',
  'Iligan City',
  'Cagayan de Oro City',
  'Ozamiz City',
  'Tangub City',
  'Gingoog City',
  'El Salvador City',
  'Oroquieta City',
  'Davao City',
  'Digos City',
  'Mati City',
  'Tagum City',
  'Panabo City',
  'Samal City',
  'Kidapawan City',
  'General Santos City',
  'Koronadal City',
  'Tacurong City',
  'Cotabato City',
  'Butuan City',
  'Surigao City',
  'Tandag City',
  'Marawi City',
  'Baguio City',
  'Bangued',
  'Boliney',
  'Bucay',
  'Bucloc',
  'Daguioman',
  'Danglas',
  'Dolores',
  'La Paz',
  'Lacub',
  'Lagangilang',
  'Lagayan',
  'Langiden',
  'Licuan-Baay',
  'Luba',
  'Malibcong',
  'Manabo',
  'Peñarrubia',
  'Pidigan',
  'Pilar',
  'Sallapadan',
  'San Isidro',
  'San Juan',
  'San Quintin',
  'Tayum',
  'Tineg',
  'Tubo',
  'Villaviciosa'
]

const districts = [
  'District 1',
  'District 2', 
  'District 3',
  'District 4',
  'District 5',
  'District 6',
  'District 7',
  'District 8'
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

export function InfraProjectModal({ isOpen, onClose, onProjectCreate, editingDraft, showCloseButton = false, onBudgetChange }: InfraProjectModalProps) {
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
    handleDistrictChange,
    handleCityChange,
    handleBarangayChange
  } = useLocationData()
  
  // Get current user for RAED region locking
  const { user } = useAuth()
  const isRAEDUser = user?.role === 'RAED' && !!user?.regionAssigned
  const lockedRegionCode = isRAEDUser && locationData.regions.length > 0 && user?.regionAssigned
    ? findPSGCRegionCode(user.regionAssigned, locationData.regions)
    : null
  
  // Step 4: Document Upload
  const [documents, setDocuments] = useState<Array<{file: File, label: string, id: string}>>([])
  
  // Project Status
  const [projectStatus, setProjectStatus] = useState<'Draft' | 'Proposal'>('Draft')
  
  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false)
  
  // Auto-select and lock region for RAED users when modal opens
  // This also automatically loads provinces for the locked region
  React.useEffect(() => {
    if (isOpen && isRAEDUser && lockedRegionCode && !editingDraft && !selection.region && locationData.regions.length > 0 && !locationData.loading.regions) {
      const matchedRegion = locationData.regions.find(r => r.code === lockedRegionCode)
      if (matchedRegion) {
        // handleRegionChange will automatically load provinces for this region
        handleRegionChange(matchedRegion.code, matchedRegion.name)
      }
    }
  }, [isOpen, isRAEDUser, lockedRegionCode, locationData.regions, locationData.loading.regions, editingDraft, selection.region, handleRegionChange])

  // Pre-populate form when editing a draft
  React.useEffect(() => {
    if (editingDraft && isOpen) {
      setProjectTitle(editingDraft.title || '')
      setProjectDescription(editingDraft.description || '')
      setProjectStatus('Draft') // Always set to Draft for editing
      // Set other fields based on available data
      if (editingDraft.budget) {
        setAllocatedAmount(editingDraft.budget.toString())
      }
      
      // Generate random current step (1-5) when editing a draft
      const randomStep = Math.floor(Math.random() * 5) + 1
      setCurrentStep(randomStep)
      setHasUnsavedChanges(false) // Reset unsaved changes when opening existing draft
    } else if (!editingDraft && isOpen) {
      // Reset to step 1 for new projects
      setCurrentStep(1)
      setHasUnsavedChanges(false) // Reset unsaved changes for new projects
    }
  }, [editingDraft, isOpen])

  // Track form changes to detect unsaved changes
  React.useEffect(() => {
    if (isOpen && !editingDraft) {
      // For new projects, any change indicates unsaved changes
      const hasChanges = !!(projectTitle || projectDescription || projectClassification || 
                        projectType || implementationDays || prexcProgram || 
                        prexcSubProgram || selection.region || selection.province || selection.district || selection.city || 
                        selection.barangay || allocatedAmount || documents.length > 0)
      setHasUnsavedChanges(hasChanges)
    } else if (isOpen && editingDraft) {
      // For editing drafts, compare with original values
      const hasChanges = !!(
        projectTitle !== (editingDraft.title || '') ||
        projectDescription !== (editingDraft.description || '') ||
        selection.region !== (editingDraft.regionCode || '') ||
        selection.province !== (editingDraft.provinceCode || '') ||
        allocatedAmount !== (editingDraft.budget ? editingDraft.budget.toString() : '') ||
        documents.length > 0
      )
      setHasUnsavedChanges(hasChanges)
    }
  }, [projectTitle, projectDescription, projectClassification, projectType, 
      implementationDays, prexcProgram, prexcSubProgram, selection.region, selection.province, 
      selection.district, selection.city, selection.barangay, allocatedAmount, documents, isOpen, editingDraft])

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
      district: locationData.congressionalDistricts.find(d => d.code === selection.district)?.name || '',
      municipality: locationData.cities.find(c => c.code === selection.city)?.name || '',
      barangay: locationData.barangays.find(b => b.code === selection.barangay)?.name || '',
      // PSGC codes for reference
      regionCode: selection.region,
      provinceCode: selection.province,
      districtCode: selection.district,
      cityCode: selection.city,
      barangayCode: selection.barangay,
      // Step 4
      documents,
      // Status
      status: 'Proposal' // Always create as Proposal when using Create Project
    }

    onProjectCreate(projectData)
    // Reset unsaved changes flag before closing to prevent unsaved changes dialog
    setHasUnsavedChanges(false)
    performClose() // Close the modal immediately after project creation
  }

  const handleSaveAsDraft = () => {
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
      // Step 3 - Location data from PSGC API
      region: locationData.regions.find(r => r.code === selection.region)?.name || '',
      province: locationData.provinces.find(p => p.code === selection.province)?.name || '',
      district: locationData.congressionalDistricts.find(d => d.code === selection.district)?.name || '',
      municipality: locationData.cities.find(c => c.code === selection.city)?.name || '',
      barangay: locationData.barangays.find(b => b.code === selection.barangay)?.name || '',
      // PSGC codes for reference
      regionCode: selection.region,
      provinceCode: selection.province,
      districtCode: selection.district,
      cityCode: selection.city,
      barangayCode: selection.barangay,
      // Step 4
      documents,
      // Status
      status: 'Draft', // Always save as Draft when using Save as Draft
      isDraftSave: true // Flag to indicate this is a draft save
    }

    onProjectCreate(projectData)
    // Don't show success toast here - let the parent component handle it
    performClose() // Close immediately after saving
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
    setDocuments([])
    setProjectStatus('Draft')
    setHasUnsavedChanges(false)
    setShowUnsavedChangesDialog(false)
    onClose()
  }

  const handleSaveAndClose = () => {
    // Auto-save as draft and close
    handleSaveAsDraft()
    setShowUnsavedChangesDialog(false)
  }

  const handleDiscardChanges = () => {
    // Close without saving
    setShowUnsavedChangesDialog(false)
    performClose()
  }

  const isStep1Valid = projectClassification && projectType && projectTitle && projectDescription
  const isStep2Valid = implementationDays && prexcProgram && prexcSubProgram && budgetProcess && 
                      proposedFundSource && sourceAgency && bannerProgram && fundingYear && allocatedAmount
  const isStep3Valid = selection.region && selection.province && selection.district && selection.city && selection.barangay
  const isStep4Valid = true // Documents are optional during registration


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
                  Create Infrastructure Project
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
                      // Locked stepper - only allow navigation to current step
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
                <Label htmlFor="days" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  Implementation Schedule (Calendar Days) *
                </Label>
                <Input
                  id="days"
                  type="number"
                  placeholder="Enter number of days"
                  value={implementationDays}
                  onChange={(e) => setImplementationDays(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prexc" className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-600" />
                    PREXC Program *
                  </Label>
                  <select
                    id="prexc"
                    value={prexcProgram}
                    onChange={(e) => setPrexcProgram(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Program</option>
                    {prexcPrograms.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prexcSub" className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-600" />
                    PREXC Sub Program *
                  </Label>
                  <select
                    id="prexcSub"
                    value={prexcSubProgram}
                    onChange={(e) => setPrexcSubProgram(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <Label htmlFor="budget" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    Budget Process *
                  </Label>
                  <select
                    id="budget"
                    value={budgetProcess}
                    onChange={(e) => setBudgetProcess(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Process</option>
                    {budgetProcesses.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundSource" className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-gray-600" />
                    Proposed Fund Source *
                  </Label>
                  <select
                    id="fundSource"
                    value={proposedFundSource}
                    onChange={(e) => setProposedFundSource(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <Label htmlFor="district" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  District *
                </Label>
                <select
                  id="district"
                  value={selection.district}
                  onChange={(e) => {
                    const selectedDistrict = locationData.congressionalDistricts.find(d => d.code === e.target.value)
                    if (selectedDistrict) {
                      handleDistrictChange(selectedDistrict.code, selectedDistrict.name)
                    }
                  }}
                  disabled={!selection.province || locationData.loading.congressionalDistricts}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    {!selection.province 
                      ? 'Select a province first' 
                      : locationData.loading.congressionalDistricts 
                        ? 'Loading districts...' 
                        : 'Select District'
                    }
                  </option>
                  {locationData.congressionalDistricts.map((district) => (
                    <option key={district.code} value={district.code}>{district.name}</option>
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
                  disabled={!selection.district || locationData.loading.cities}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    {!selection.district 
                      ? 'Select a district first' 
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
                  Upload documents from the proposal stage. Documents are optional during registration and can be uploaded later.
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
                              // Remove existing document with same id if any
                              setDocuments(prev => prev.filter(d => d.id !== doc.id))
                              setDocuments(prev => [...prev, newDocument])
                              // Reset the file input
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
            <div className="space-y-8">
              {/* Enhanced Header */}
              <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center justify-center mb-3">
                  <Building2 className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-bold text-primary">Infrastructure Project Summary</h3>
                </div>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Review all information before submitting your infrastructure project
                </p>
              </div>

              {/* Step 1: Project Description Summary */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-primary">1. Project Description</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Classification:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{projectClassification || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Type:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{projectType || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Title:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{projectTitle || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Description:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground leading-relaxed">{projectDescription || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Budget Source Summary */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-primary">2. Budget & Funding Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Implementation Days:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{implementationDays || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">PREXC Program:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{prexcProgram || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Settings className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">PREXC Sub Program:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{prexcSubProgram || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Budget Process:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{budgetProcess || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Fund Source:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{proposedFundSource || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Source Agency:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{sourceAgency || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Banner Program:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{bannerProgram || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Funding Year:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{fundingYear || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-foreground">Allocated Amount:</span>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <p className="text-sm font-bold text-green-700">
                        {allocatedAmount ? `₱${parseFloat(allocatedAmount).toLocaleString()}` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Location Summary */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-primary">3. Project Location</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Region:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{locationData.regions.find(r => r.code === selection.region)?.name || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Province:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{locationData.provinces.find(p => p.code === selection.province)?.name || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">District:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{locationData.congressionalDistricts.find(d => d.code === selection.district)?.name || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Municipality/City:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">
                        {(() => {
                          const selectedCity = locationData.cities.find(c => c.code === selection.city)
                          if (!selectedCity) return 'Not specified'
                          return `${selectedCity.name} ${selectedCity.type ? `(${selectedCity.type})` : ''}`
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Barangay:</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground font-medium">{locationData.barangays.find(b => b.code === selection.barangay)?.name || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Document Upload Summary */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <Upload className="h-4 w-4 text-orange-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-primary">4. Document Upload</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Uploaded Documents:</span>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                      {documents.length} file{documents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">{doc.label || doc.file.name}</p>
                              <p className="text-xs text-muted-foreground">{(doc.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center px-6 pb-6 pt-4">
          {/* Left side - Save as Draft button (full left) */}
          <Button 
            variant="outline" 
            onClick={handleSaveAsDraft}
            className="text-sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          
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
              >
                Create Project
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
              You have unsaved changes. Do you want to save them as a draft before closing?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleDiscardChanges}>
              Discard Changes
            </Button>
            <Button onClick={handleSaveAndClose}>
              Save as Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
