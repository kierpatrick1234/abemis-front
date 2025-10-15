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
import { Building2, Upload, Save, X } from 'lucide-react'
import { SuccessToast } from './success-toast'

interface InfraProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: Record<string, unknown>) => void
  editingDraft?: any // Project being edited
  showCloseButton?: boolean // Show X button for package projects
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

export function InfraProjectModal({ isOpen, onClose, onProjectCreate, editingDraft, showCloseButton = false }: InfraProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(10)
  
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
  
  // Step 3: Location
  const [region, setRegion] = useState('')
  const [province, setProvince] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [district, setDistrict] = useState('')
  const [barangay, setBarangay] = useState('')
  
  // Step 4: Document Upload
  const [documents, setDocuments] = useState<Array<{file: File, label: string, id: string}>>([])
  
  // Project Status
  const [projectStatus, setProjectStatus] = useState<'Draft' | 'Proposal'>('Draft')
  
  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false)

  // Pre-populate form when editing a draft
  React.useEffect(() => {
    if (editingDraft && isOpen) {
      setProjectTitle(editingDraft.title || '')
      setProjectDescription(editingDraft.description || '')
      setProjectStatus('Draft') // Always set to Draft for editing
      setRegion(editingDraft.region || '')
      setProvince(editingDraft.province || '')
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
                        prexcSubProgram || region || province || municipality || 
                        district || barangay || allocatedAmount || documents.length > 0)
      setHasUnsavedChanges(hasChanges)
    } else if (isOpen && editingDraft) {
      // For editing drafts, compare with original values
      const hasChanges = !!(
        projectTitle !== (editingDraft.title || '') ||
        projectDescription !== (editingDraft.description || '') ||
        region !== (editingDraft.region || '') ||
        province !== (editingDraft.province || '') ||
        allocatedAmount !== (editingDraft.budget ? editingDraft.budget.toString() : '') ||
        documents.length > 0
      )
      setHasUnsavedChanges(hasChanges)
    }
  }, [projectTitle, projectDescription, projectClassification, projectType, 
      implementationDays, prexcProgram, prexcSubProgram, region, province, 
      municipality, district, barangay, allocatedAmount, documents, isOpen, editingDraft])

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
      // Step 3
      region,
      province,
      municipality,
      district,
      barangay,
      // Step 4
      documents,
      // Status
      status: 'Proposal' // Always create as Proposal when using Create Project
    }

    onProjectCreate(projectData)
    setIsSuccess(true)
    setCountdown(10)
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)
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
      // Step 3
      region,
      province,
      municipality,
      district,
      barangay,
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
    setIsSuccess(false)
    setCountdown(10)
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
    setRegion('')
    setProvince('')
    setMunicipality('')
    setDistrict('')
    setBarangay('')
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
  const isStep3Valid = region && province && municipality && district && barangay
  const isStep4Valid = true // Documents are optional during registration

  if (isSuccess) {
    return (
      <>
        <SuccessToast 
          isVisible={isSuccess}
          onClose={handleClose}
          countdown={countdown}
        />
      </>
    )
  }

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
          
          {/* Progress Indicator */}
          <div className="pb-4">
            <div className="flex items-start justify-center w-full">
            {[
              { step: 1, label: 'Project Description' },
              { step: 2, label: 'Budget Source' },
              { step: 3, label: 'Location' },
              { step: 4, label: 'Document Upload' },
              { step: 5, label: 'Summary' }
            ].map(({ step, label }, index) => (
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
                      step === currentStep
                        ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer ring-2 ring-green-300'
                        : step < currentStep
                        ? 'bg-black text-white cursor-default'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {step}
                  </button>
                  {index < 4 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full ${
                      step < currentStep ? 'bg-black' : 'bg-muted'
                    }`} />
                  )}
                </div>
                <span className={`text-xs text-center px-1 leading-tight font-medium ${
                  step === currentStep
                    ? 'text-green-600'
                    : step < currentStep
                    ? 'text-black'
                    : 'text-muted-foreground'
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
                <Label htmlFor="classification">Project Classification *</Label>
                <select
                  id="classification"
                  value={projectClassification}
                  onChange={(e) => setProjectClassification(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select Classification</option>
                  {projectClassifications.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Project Type *</Label>
                <select
                  id="type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select Type</option>
                  {projectTypes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <textarea
                  id="description"
                  placeholder="Enter project description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
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
              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select Region</option>
                  {regions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <select
                  id="province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select Province</option>
                  {provinces.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipality">Municipality *</Label>
                <select
                  id="municipality"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select District</option>
                  {districts.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barangay">Barangay *</Label>
                <select
                  id="barangay"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((item) => (
                    <option key={item} value={item}>{item}</option>
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
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Project Summary</h3>
                <p className="text-sm text-muted-foreground">Review all information before submitting your project</p>
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
                    <p className="text-muted-foreground">{region || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Province:</span>
                    <p className="text-muted-foreground">{province || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Municipality:</span>
                    <p className="text-muted-foreground">{municipality || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">District:</span>
                    <p className="text-muted-foreground">{district || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Barangay:</span>
                    <p className="text-muted-foreground">{barangay || 'Not specified'}</p>
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
