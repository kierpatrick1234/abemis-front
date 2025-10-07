'use client'

import { useState } from 'react'
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
import { Building2 } from 'lucide-react'
import { SuccessToast } from './success-toast'

interface InfraProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: any) => void
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

export function InfraProjectModal({ isOpen, onClose, onProjectCreate }: InfraProjectModalProps) {
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
  const [documentLabel, setDocumentLabel] = useState('')

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newDocument = {
        file,
        label: documentLabel || file.name,
        id: Date.now().toString()
      }
      setDocuments(prev => [...prev, newDocument])
      setDocumentLabel('')
      // Reset the file input
      event.target.value = ''
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
      documents
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

  const handleClose = () => {
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
    setDocumentLabel('')
    onClose()
  }

  const isStep1Valid = projectClassification && projectType && projectTitle && projectDescription
  const isStep2Valid = implementationDays && prexcProgram && prexcSubProgram && budgetProcess && 
                      proposedFundSource && sourceAgency && bannerProgram && fundingYear && allocatedAmount
  const isStep3Valid = region && province && municipality && district && barangay

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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create Infrastructure Project
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of 4: {
              currentStep === 1 ? 'Project Description' :
              currentStep === 2 ? 'Budget Source' : 
              currentStep === 3 ? 'Location' : 'Document Upload'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 py-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-8 h-0.5 ${
                  step < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="py-6">
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
                <Label htmlFor="documentLabel">Document Label</Label>
                <Input
                  id="documentLabel"
                  value={documentLabel}
                  onChange={(e) => setDocumentLabel(e.target.value)}
                  placeholder="Enter document label (e.g., Project Proposal, Technical Specifications)"
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Document</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="documentUpload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="documentUpload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-600">Click to upload document</span>
                    <span className="text-xs text-gray-400">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX</span>
                  </label>
                </div>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents</Label>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-medium">{doc.label || doc.file.name}</span>
                          <span className="text-xs text-gray-500">({(doc.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {currentStep < 4 ? (
            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !isStep1Valid) ||
                (currentStep === 2 && !isStep2Valid) ||
                (currentStep === 3 && !isStep3Valid)
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
