'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Plus, Trash2, Save, X, ArrowUp, ArrowDown, GripVertical, Type, Mail, Hash, Calendar, List, CheckSquare, Radio, Eye, Heading, Move, Send, FileText, Settings2, History, RotateCcw, MousePointerClick, Edit2, Users, MapPin } from 'lucide-react'
import { SuccessToast } from '@/components/success-toast'
import { cn } from '@/lib/utils'

interface FormField {
  id: string
  type: 'text' | 'email' | 'number' | 'date' | 'file' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'label' | 'button'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

interface RegistrationStep {
  id: string
  name: string
  order: number
  fields: FormField[]
}

interface ProjectType {
  id: string
  name: string
  description?: string
  stages: any[]
  createdAt: string
  updatedAt: string
  registrationForm?: FormField[]
  registrationSteps?: RegistrationStep[]
}

interface FormVersion {
  id: string
  version: number
  formFields: FormField[]
  publishedAt: string
  publishedBy?: string
  isActive: boolean
  stepId?: string
  stepName?: string
}

// Default registration steps with clustered fields
const getDefaultRegistrationSteps = (): RegistrationStep[] => {
  return [
    {
      id: 'step-1',
      name: 'Project Information',
      order: 1,
      fields: [
        { id: 'field-project-classification', type: 'select', label: 'Project Classification', placeholder: 'Select project classification', required: true, options: ['Commodity Transport Infrastructure', 'Irrigation Facilities', 'Production Facilities (Crops)', 'Production Facilities (Livestock)', 'Post-harvest and Production Facilities (Fisheries)'] },
        { id: 'field-project-type', type: 'select', label: 'Project Type', placeholder: 'Select project type', required: true, options: ['Road Construction', 'Bridge Construction', 'Irrigation System', 'Warehouse Construction', 'Processing Facility', 'Storage Facility'] },
        { id: 'field-project-title', type: 'text', label: 'Project Title', placeholder: 'Enter project title', required: true },
        { id: 'field-project-description', type: 'textarea', label: 'Project Description', placeholder: 'Enter project description', required: true },
      ]
    },
    {
      id: 'step-2',
      name: 'Budget Source',
      order: 2,
      fields: [
        { id: 'field-calendar-days', type: 'number', label: 'Calendar Days', placeholder: 'Enter number of days', required: true },
        { id: 'field-prexc-program', type: 'select', label: 'Prexc Program', placeholder: 'Select Prexc program', required: true, options: ['AMEFIP', 'Rice Program', 'Corn Program', 'Livestock Program', 'Fisheries Program'] },
        { id: 'field-prexc-sub-program', type: 'select', label: 'Prexc Sub Program', placeholder: 'Select Prexc sub program', required: true, options: ['AMEFIP Sub-Program 1', 'Rice Sub-Program 1', 'Corn Sub-Program 1', 'Livestock Sub-Program 1', 'Fisheries Sub-Program 1'] },
        { id: 'field-budget-process', type: 'select', label: 'Budget Process', placeholder: 'Select budget process', required: true, options: ['Regular Budget', 'Special Budget', 'Emergency Budget', 'Supplementary Budget'] },
        { id: 'field-proposed-fund-source', type: 'select', label: 'Proposed Fund Source', placeholder: 'Select proposed fund source', required: true, options: ['Fund Source Test 1', 'Fund Source Test 2', 'Fund Source Test 3', 'National Budget', 'Local Budget'] },
        { id: 'field-source-agency', type: 'select', label: 'Source Agency', placeholder: 'Select source agency', required: true, options: ['DA-OSEC', 'DA-BAR', 'DA-BAI', 'DA-BFAR', 'DA-BSWM'] },
        { id: 'field-banner-program', type: 'select', label: 'Banner Program', placeholder: 'Select banner program', required: true, options: ['Livestock and Fisheries', 'Coconut Farm and Industry', 'Bayanihan', 'Plant, Plant, Plant', 'Kadiwa'] },
        { id: 'field-funding-year', type: 'select', label: 'Funding Year', placeholder: 'Select funding year', required: true, options: ['2024', '2025', '2026', '2027'] },
        { id: 'field-amount', type: 'number', label: 'Amount', placeholder: 'Enter amount', required: true },
      ]
    },
    {
      id: 'step-3',
      name: 'Location',
      order: 3,
      fields: [
        { id: 'field-location', type: 'select', label: 'Location', placeholder: 'Select location (PSGC API)', required: true, options: [] },
      ]
    },
    {
      id: 'step-4',
      name: 'Document Upload',
      order: 4,
      fields: [
        { id: 'field-letter-of-intent', type: 'file', label: 'Letter of Intent', placeholder: 'Upload letter of intent', required: true },
        { id: 'field-validation-report', type: 'file', label: 'Validation Report', placeholder: 'Upload validation report', required: true },
        { id: 'field-fs', type: 'file', label: 'FS (Feasibility Study)', placeholder: 'Upload FS document', required: true },
        { id: 'field-ded', type: 'file', label: 'DED (Detailed Engineering Design)', placeholder: 'Upload DED document', required: true },
        { id: 'field-program-of-work', type: 'file', label: 'Program of Work', placeholder: 'Upload program of work document', required: true },
        { id: 'field-right-of-way-docs', type: 'file', label: 'Right of Way Docs', placeholder: 'Upload right of way documents', required: false },
        { id: 'field-geotagged-photos', type: 'file', label: 'Geotagged Photos', placeholder: 'Upload geotagged photos', required: false },
        { id: 'field-other-documents', type: 'file', label: 'Other Documents', placeholder: 'Upload other documents', required: false },
      ]
    }
  ]
}

export default function RegistrationFormPage() {
  const router = useRouter()
  const params = useParams()
  const typeId = params.typeId as string
  const { user, loading: authLoading } = useAuth()

  const [projectType, setProjectType] = useState<ProjectType | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [registrationSteps, setRegistrationSteps] = useState<RegistrationStep[]>([])
  const [selectedStep, setSelectedStep] = useState<RegistrationStep | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null)
  const [dragOverFieldIndex, setDragOverFieldIndex] = useState<number | null>(null)
  const [draggedFormFieldId, setDraggedFormFieldId] = useState<string | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState<{ id: string; label: string } | null>(null)
  const [previewData, setPreviewData] = useState<{ [key: string]: any }>({})
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastCountdown, setToastCountdown] = useState(10)
  const [toastMessage, setToastMessage] = useState('Registration Form Updated Successfully!')
  const [draggedStepId, setDraggedStepId] = useState<string | null>(null)
  const [dragOverStepIndex, setDragOverStepIndex] = useState<number | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  const [previousOrder, setPreviousOrder] = useState<{ [key: string]: number }>({})
  const [selectedPreviewStep, setSelectedPreviewStep] = useState<string | null>(null)
  const [isConfigureDialogOpen, setIsConfigureDialogOpen] = useState(false)
  const [configuringFormFields, setConfiguringFormFields] = useState<FormField[]>([])
  const [showVersionsModal, setShowVersionsModal] = useState(false)
  const [highlightedFieldId, setHighlightedFieldId] = useState<string | null>(null)
  const [highlightedStepId, setHighlightedStepId] = useState<string | null>(null)
  const [configuringStepId, setConfiguringStepId] = useState<string | null>(null)
  const [isStepConfigureDialogOpen, setIsStepConfigureDialogOpen] = useState(false)
  const [configuringStepSelectedField, setConfiguringStepSelectedField] = useState<FormField | null>(null)
  const [configuringStepDraggedFormFieldId, setConfiguringStepDraggedFormFieldId] = useState<string | null>(null)
  const [configuringStepDragOverFieldIndex, setConfiguringStepDragOverFieldIndex] = useState<number | null>(null)
  const [stepToDelete, setStepToDelete] = useState<{ id: string; name: string } | null>(null)
  const [editingStepNameId, setEditingStepNameId] = useState<string | null>(null)
  const [editingStepName, setEditingStepName] = useState<string>('')
  const [showStepVersionsModal, setShowStepVersionsModal] = useState(false)
  const [showStepPreviewModal, setShowStepPreviewModal] = useState(false)
  const [stepPreviewData, setStepPreviewData] = useState<{ [key: string]: any }>({})
  const [stepVersionToRollback, setStepVersionToRollback] = useState<FormVersion | null>(null)

  const fieldTypes = [
    { id: 'text', label: 'Text Input', icon: Type, description: 'Single line text input' },
    { id: 'email', label: 'Email', icon: Mail, description: 'Email address input' },
    { id: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
    { id: 'date', label: 'Date Picker', icon: Calendar, description: 'Date selection' },
    { id: 'file', label: 'File Upload', icon: FileText, description: 'File upload field' },
    { id: 'select', label: 'Dropdown', icon: List, description: 'Select from options' },
    { id: 'textarea', label: 'Text Area', icon: FileText, description: 'Multi-line text input' },
    { id: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Checkbox input' },
    { id: 'radio', label: 'Radio Button', icon: Radio, description: 'Radio button group' },
    { id: 'label', label: 'Label', icon: Heading, description: 'Text label without input' },
    { id: 'button', label: 'Button', icon: MousePointerClick, description: 'Button for form submission' }
  ]

  // Load project type from localStorage
  useEffect(() => {
    setIsInitializing(true)
    const storedTypes = localStorage.getItem('projectTypes')
    let types: ProjectType[] = []

    if (storedTypes) {
      try {
        types = JSON.parse(storedTypes)
      } catch (e) {
        console.error('Error parsing project types:', e)
      }
    }

    // If no stored types, use defaults
    if (types.length === 0) {
      types = [
        { id: '1', name: 'FMR', description: 'Farm-to-Market Road', stages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', name: 'Infrastructure', description: 'Infrastructure Projects', stages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '3', name: 'Machinery', description: 'Machinery and Equipment', stages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ]
      localStorage.setItem('projectTypes', JSON.stringify(types))
    }

    const foundType = types.find(t => t.id === typeId)
    if (foundType) {
      // Always check if registration steps need initialization
      const needsInitialization = !foundType.registrationSteps || 
                                  foundType.registrationSteps.length === 0 ||
                                  !Array.isArray(foundType.registrationSteps)
      
      if (needsInitialization) {
        const defaultSteps = getDefaultRegistrationSteps()
        // Flatten steps to formFields for backward compatibility
        const allFields = defaultSteps.flatMap(step => step.fields)
        // Save the default steps to the project type
        const updatedType = {
          ...foundType,
          registrationSteps: defaultSteps,
          registrationForm: allFields, // Keep for backward compatibility
          updatedAt: new Date().toISOString()
        }
        // Save directly to localStorage first
        const updatedTypes = types.map(t => t.id === updatedType.id ? updatedType : t)
        localStorage.setItem('projectTypes', JSON.stringify(updatedTypes))
        // Then set state
        setProjectType(updatedType)
        setRegistrationSteps(defaultSteps)
        setFormFields(allFields)
        console.log('Initialized default registration steps:', defaultSteps)
      } else {
        // Normalize steps to ensure they always have a fields array
        const normalizedSteps = (foundType.registrationSteps || []).map(step => ({
          ...step,
          fields: step.fields || []
        }))
        setProjectType(foundType)
        setRegistrationSteps(normalizedSteps)
        // Flatten steps to formFields for backward compatibility
        const allFields = normalizedSteps.flatMap(step => step.fields || [])
        setFormFields(allFields)
        console.log('Loaded existing registration steps:', normalizedSteps)
      }
    } else {
      // Type not found, create a default type with default registration steps
      const defaultSteps = getDefaultRegistrationSteps()
      const allFields = defaultSteps.flatMap(step => step.fields)
      const defaultType: ProjectType = {
        id: typeId,
        name: `Project Type ${typeId}`,
        description: 'Default project type',
        stages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        registrationSteps: defaultSteps,
        registrationForm: allFields // Keep for backward compatibility
      }
      setProjectType(defaultType)
      setRegistrationSteps(defaultSteps)
      setFormFields(allFields)
      // Save to localStorage
      types.push(defaultType)
      localStorage.setItem('projectTypes', JSON.stringify(types))
      console.log('Created new project type with default steps:', defaultSteps)
    }
    setIsInitializing(false)
  }, [typeId])

  // Save project type to localStorage
  const saveProjectType = (updatedType: ProjectType) => {
    const storedTypes = localStorage.getItem('projectTypes')
    let types: ProjectType[] = []

    if (storedTypes) {
      try {
        types = JSON.parse(storedTypes)
      } catch (e) {
        console.error('Error parsing project types:', e)
      }
    }

    const updatedTypes = types.map(t => t.id === updatedType.id ? updatedType : t)
    localStorage.setItem('projectTypes', JSON.stringify(updatedTypes))
    setProjectType(updatedType)
  }

  // Versioning functions
  const publishForm = () => {
    if (!projectType || !isEditMode) return

    const versionsKey = `registrationFormVersions_${typeId}`
    const storedVersions = localStorage.getItem(versionsKey)
    let versions: FormVersion[] = []

    if (storedVersions) {
      try {
        versions = JSON.parse(storedVersions)
      } catch (e) {
        console.error('Error parsing form versions:', e)
      }
    }

    // Deactivate previous versions
    versions = versions.map(v => ({ ...v, isActive: false }))

    // Get the next version number
    const nextVersion = versions.length > 0 
      ? Math.max(...versions.map(v => v.version)) + 1 
      : 1

    const allFields = registrationSteps.flatMap(step => step.fields)
    const newVersion: FormVersion = {
      id: `version-${Date.now()}`,
      version: nextVersion,
      formFields: allFields,
      publishedAt: new Date().toISOString(),
      isActive: true
    }

    versions.push(newVersion)
    localStorage.setItem(versionsKey, JSON.stringify(versions))

    // Update project type with published form
    const updatedType = { 
      ...projectType, 
      registrationSteps: registrationSteps,
      registrationForm: allFields, 
      updatedAt: new Date().toISOString() 
    }
    saveProjectType(updatedType)
    setFormFields(allFields)

    setToastMessage(`Registration Form published as version ${nextVersion}!`)
    setShowSuccessToast(true)
    setToastCountdown(10)
  }

  const getFormVersions = (): FormVersion[] => {
    const versionsKey = `registrationFormVersions_${typeId}`
    const storedVersions = localStorage.getItem(versionsKey)
    if (!storedVersions) return []

    try {
      const versions: FormVersion[] = JSON.parse(storedVersions)
      return versions.sort((a, b) => b.version - a.version)
    } catch (e) {
      console.error('Error parsing form versions:', e)
      return []
    }
  }

  const rollbackToVersion = (version: FormVersion) => {
    if (!projectType) return

    // Update the configuring form fields with the version's form fields
    setConfiguringFormFields([...version.formFields])

    // Deactivate all versions
    const versionsKey = `registrationFormVersions_${typeId}`
    const storedVersions = localStorage.getItem(versionsKey)
    if (storedVersions) {
      try {
        let versions: FormVersion[] = JSON.parse(storedVersions)
        versions = versions.map(v => 
          ({ ...v, isActive: v.id === version.id })
        )
        localStorage.setItem(versionsKey, JSON.stringify(versions))
      } catch (e) {
        console.error('Error updating versions:', e)
      }
    }

    setShowVersionsModal(false)
    setToastMessage(`Rolled back to version ${version.version}`)
    setShowSuccessToast(true)
    setToastCountdown(10)
  }

  // Step-specific versioning functions
  const publishStepForm = () => {
    if (!configuringStepId || !projectType) return

    const step = registrationSteps.find(s => s.id === configuringStepId)
    if (!step) return

    const versionsKey = `stepFormVersions_${typeId}_${configuringStepId}`
    const storedVersions = localStorage.getItem(versionsKey)
    let versions: FormVersion[] = []

    if (storedVersions) {
      try {
        versions = JSON.parse(storedVersions)
      } catch (e) {
        console.error('Error parsing step form versions:', e)
      }
    }

    // Deactivate previous versions for this step
    versions = versions.map(v => ({ ...v, isActive: false }))

    // Get the next version number for this step
    const nextVersion = versions.length > 0 
      ? Math.max(...versions.map(v => v.version)) + 1 
      : 1

    const newVersion: FormVersion = {
      id: `version-${Date.now()}`,
      version: nextVersion,
      stepId: configuringStepId,
      stepName: step.name,
      formFields: [...(step.fields || [])],
      publishedAt: new Date().toISOString(),
      isActive: true
    }

    versions.push(newVersion)
    localStorage.setItem(versionsKey, JSON.stringify(versions))

    // Update project type with published step
    const updatedSteps = registrationSteps.map(s =>
      s.id === configuringStepId
        ? { ...s, fields: [...(step.fields || [])] }
        : s
    )
    const updatedType = { 
      ...projectType, 
      registrationSteps: updatedSteps,
      updatedAt: new Date().toISOString() 
    }
    saveProjectType(updatedType)
    setRegistrationSteps(updatedSteps)

    setToastMessage(`Step form published as version ${nextVersion}!`)
    setShowSuccessToast(true)
    setToastCountdown(10)
    
    // Clear selected field to hide configuration panel
    setConfiguringStepSelectedField(null)
    
    // Highlight the published step
    setHighlightedStepId(configuringStepId)
    setTimeout(() => {
      const element = document.getElementById(`step-${configuringStepId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setTimeout(() => {
        setHighlightedStepId(null)
      }, 2000)
    }, 500)
  }

  const getStepFormVersions = (stepId: string): FormVersion[] => {
    const versionsKey = `stepFormVersions_${typeId}_${stepId}`
    const storedVersions = localStorage.getItem(versionsKey)
    if (!storedVersions) return []

    try {
      const versions: FormVersion[] = JSON.parse(storedVersions)
      return versions.sort((a, b) => b.version - a.version)
    } catch (e) {
      console.error('Error parsing step form versions:', e)
      return []
    }
  }

  const rollbackToStepVersion = (version: FormVersion) => {
    if (!projectType || !configuringStepId || !version.stepId) return

    const step = registrationSteps.find(s => s.id === configuringStepId)
    if (!step) return

    // Update the step with the version's form fields
    const updatedStep = { ...step, fields: [...version.formFields] }
    const updatedSteps = registrationSteps.map(s =>
      s.id === configuringStepId ? updatedStep : s
    )
    setRegistrationSteps(updatedSteps)

    // Deactivate all versions for this step
    const versionsKey = `stepFormVersions_${typeId}_${configuringStepId}`
    const storedVersions = localStorage.getItem(versionsKey)
    if (storedVersions) {
      try {
        let versions: FormVersion[] = JSON.parse(storedVersions)
        versions = versions.map(v => 
          ({ ...v, isActive: v.id === version.id })
        )
        localStorage.setItem(versionsKey, JSON.stringify(versions))
      } catch (e) {
        console.error('Error updating step versions:', e)
      }
    }

    setShowStepVersionsModal(false)
    setToastMessage(`Rolled back to version ${version.version}`)
    setShowSuccessToast(true)
    setToastCountdown(10)
  }

  const handleConfigureForm = () => {
    if (!isEditMode) return
    // Open configure dialog - we'll work with steps directly
    setIsConfigureDialogOpen(true)
    setSelectedField(null)
    setSelectedStep(null)
  }

  // Step management functions
  const addStep = () => {
    if (!isEditMode) return
    const newStep: RegistrationStep = {
      id: `step-${Date.now()}`,
      name: `Step ${registrationSteps.length + 1}`,
      order: registrationSteps.length + 1,
      fields: []
    }
    setRegistrationSteps([...registrationSteps, newStep])
    
    // Highlight the newly added step
    setHighlightedStepId(newStep.id)
    setTimeout(() => {
      const element = document.getElementById(`step-${newStep.id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setTimeout(() => {
        setHighlightedStepId(null)
      }, 2000)
    }, 100)
  }

  const updateStep = (stepId: string, updates: Partial<RegistrationStep>) => {
    const updatedSteps = registrationSteps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    )
    setRegistrationSteps(updatedSteps)
    // Update formFields for backward compatibility
    const allFields = updatedSteps.flatMap(step => step.fields)
    setFormFields(allFields)
  }

  const deleteStep = (stepId: string) => {
    const updatedSteps = registrationSteps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index + 1 }))
    setRegistrationSteps(updatedSteps)
    // Update formFields for backward compatibility
    const allFields = updatedSteps.flatMap(step => step.fields)
    setFormFields(allFields)
  }

  const addFieldToStep = (stepId: string, fieldType: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType as FormField['type'],
      label: fieldType === 'label' ? 'New Label' : fieldType === 'button' ? 'Submit' : `New ${fieldType} Field`,
      placeholder: fieldType === 'label' || fieldType === 'button' ? undefined : `Enter ${fieldType}`,
      required: fieldType === 'label' || fieldType === 'button' ? false : false,
      options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1', 'Option 2'] : undefined
    }

    const updatedSteps = registrationSteps.map(step =>
      step.id === stepId
        ? { ...step, fields: [...step.fields, newField] }
        : step
    )
    setRegistrationSteps(updatedSteps)
    // Update formFields for backward compatibility
    const allFields = updatedSteps.flatMap(step => step.fields)
    setFormFields(allFields)
    setSelectedField(newField)
    
    // Highlight the newly added field
    setHighlightedFieldId(newField.id)
    setTimeout(() => {
      const element = document.getElementById(`field-${newField.id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setTimeout(() => {
        setHighlightedFieldId(null)
      }, 2000)
    }, 100)
  }

  const updateFieldInStep = (stepId: string, fieldId: string, updates: Partial<FormField>) => {
    const updatedSteps = registrationSteps.map(step =>
      step.id === stepId
        ? {
            ...step,
            fields: step.fields.map(field =>
              field.id === fieldId ? { ...field, ...updates } : field
            )
          }
        : step
    )
    setRegistrationSteps(updatedSteps)
    // Update formFields for backward compatibility
    const allFields = updatedSteps.flatMap(step => step.fields)
    setFormFields(allFields)
    
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const deleteFieldFromStep = (stepId: string, fieldId: string) => {
    const updatedSteps = registrationSteps.map(step =>
      step.id === stepId
        ? { ...step, fields: step.fields.filter(field => field.id !== fieldId) }
        : step
    )
    setRegistrationSteps(updatedSteps)
    // Update formFields for backward compatibility
    const allFields = updatedSteps.flatMap(step => step.fields)
    setFormFields(allFields)
    
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
    setFieldToDelete(null)
  }

  const addFormField = (fieldType: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType as FormField['type'],
      label: fieldType === 'label' ? 'New Label' : fieldType === 'button' ? 'Submit' : `New ${fieldType} Field`,
      placeholder: fieldType === 'label' || fieldType === 'button' ? undefined : `Enter ${fieldType}`,
      required: fieldType === 'label' || fieldType === 'button' ? false : false,
      options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1', 'Option 2'] : undefined
    }

    if (isConfigureDialogOpen) {
      setConfiguringFormFields([...configuringFormFields, newField])
      setSelectedField(newField)
    } else {
      setFormFields([...formFields, newField])
      setSelectedField(newField)
    }
  }

  const updateFormField = (fieldId: string, updates: Partial<FormField>) => {
    if (isConfigureDialogOpen) {
      const updatedFields = configuringFormFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
      setConfiguringFormFields(updatedFields)
      
      if (selectedField?.id === fieldId) {
        setSelectedField({ ...selectedField, ...updates })
      }
    } else {
      // Update field in the step that contains it
      const updatedSteps = registrationSteps.map(step => ({
        ...step,
        fields: step.fields.map(field =>
          field.id === fieldId ? { ...field, ...updates } : field
        )
      }))
      setRegistrationSteps(updatedSteps)
      // Update formFields for backward compatibility
      const allFields = updatedSteps.flatMap(step => step.fields)
      setFormFields(allFields)
      
      if (selectedField?.id === fieldId) {
        setSelectedField({ ...selectedField, ...updates })
      }
    }
  }

  const deleteFormField = (fieldId: string) => {
    if (isConfigureDialogOpen) {
      const updatedFields = configuringFormFields.filter(field => field.id !== fieldId)
      setConfiguringFormFields(updatedFields)
    } else {
      // Delete field from the step that contains it
      const updatedSteps = registrationSteps.map(step => ({
        ...step,
        fields: step.fields.filter(field => field.id !== fieldId)
      }))
      setRegistrationSteps(updatedSteps)
      // Update formFields for backward compatibility
      const allFields = updatedSteps.flatMap(step => step.fields)
      setFormFields(allFields)
    }
    
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
    setFieldToDelete(null)
  }

  const handleDeleteFieldClick = (fieldId: string, fieldLabel: string) => {
    setFieldToDelete({ id: fieldId, label: fieldLabel })
  }

  const handleDeleteFieldConfirm = () => {
    if (!fieldToDelete) return
    deleteFormField(fieldToDelete.id)
  }

  const handleSave = () => {
    if (!projectType || !isEditMode) return

    const updatedType = {
      ...projectType,
      registrationSteps: registrationSteps,
      registrationForm: formFields, // Keep for backward compatibility
      updatedAt: new Date().toISOString()
    }
    saveProjectType(updatedType)

    setToastMessage('Registration Form Saved Successfully!')
    setShowSuccessToast(true)
    setToastCountdown(10)
    
    const timer = setInterval(() => {
      setToastCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowSuccessToast(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Drag and drop handlers
  const handleFormFieldDragStart = (e: React.DragEvent, fieldType: string) => {
    setDraggedFieldType(fieldType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleFormFieldDragOver = (e: React.DragEvent, index?: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    if (index !== undefined) {
      setDragOverFieldIndex(index)
    }
  }

  const handleFormFieldDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverFieldIndex(null)
    if (draggedFieldType) {
      addFormField(draggedFieldType)
      setDraggedFieldType(null)
    }
  }

  const handleSaveConfiguration = () => {
    if (!projectType || !isEditMode) return

    // Save the steps structure
    const allFields = registrationSteps.flatMap(step => step.fields)
    const updatedType = {
      ...projectType,
      registrationSteps: registrationSteps,
      registrationForm: allFields, // Keep for backward compatibility
      updatedAt: new Date().toISOString()
    }
    saveProjectType(updatedType)
    setFormFields(allFields)
    setIsConfigureDialogOpen(false)
    setSelectedField(null)
    setSelectedStep(null)
    setToastMessage('Registration Form Configuration Saved Successfully!')
    setShowSuccessToast(true)
    setToastCountdown(10)
    
    const timer = setInterval(() => {
      setToastCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowSuccessToast(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleFormFieldDragLeave = () => {
    setDragOverFieldIndex(null)
  }

  const handleFormFieldItemDragStart = (e: React.DragEvent, fieldId: string) => {
    if (!isEditMode) {
      e.preventDefault()
      return
    }
    setDraggedFormFieldId(fieldId)
    e.dataTransfer.effectAllowed = 'move'
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleFormFieldItemDragOver = (e: React.DragEvent, index: number) => {
    if (!isEditMode || !draggedFormFieldId) return
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    
    const fields = isConfigureDialogOpen ? configuringFormFields : formFields
    const dragIndex = fields.findIndex(f => f.id === draggedFormFieldId)
    
    if (dragIndex === index) {
      setDragOverFieldIndex(null)
      return
    }
    
    setDragOverFieldIndex(index)
  }

  const handleFormFieldItemDragLeave = () => {
    // Don't clear here
  }

  const handleFormFieldItemDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!isEditMode || !draggedFormFieldId) return
    
    e.preventDefault()
    e.stopPropagation()
    setDragOverFieldIndex(null)

    if (isConfigureDialogOpen) {
      const fields = [...configuringFormFields]
      const dragIndex = fields.findIndex(f => f.id === draggedFormFieldId)
      
      if (dragIndex === -1 || dragIndex === dropIndex) {
        setDraggedFormFieldId(null)
        return
      }

      const [draggedItem] = fields.splice(dragIndex, 1)
      fields.splice(dropIndex, 0, draggedItem)

      setConfiguringFormFields(fields)
    } else {
      const fields = [...formFields]
      const dragIndex = fields.findIndex(f => f.id === draggedFormFieldId)
      
      if (dragIndex === -1 || dragIndex === dropIndex) {
        setDraggedFormFieldId(null)
        return
      }

      const [draggedItem] = fields.splice(dragIndex, 1)
      fields.splice(dropIndex, 0, draggedItem)

      setFormFields(fields)
    }
    setDraggedFormFieldId(null)
  }

  const handleFormFieldItemDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
    }
    setDraggedFormFieldId(null)
    setDragOverFieldIndex(null)
  }

  // Drag and drop handlers for step reordering
  const handleStepDragStart = (e: React.DragEvent, stepId: string) => {
    if (!isEditMode) {
      e.preventDefault()
      return
    }
    setDraggedStepId(stepId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', stepId)
  }

  const handleStepDragOver = (e: React.DragEvent, index: number) => {
    if (!isEditMode || !draggedStepId) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStepIndex(index)
  }

  const handleStepDragLeave = () => {
    setDragOverStepIndex(null)
  }

  const handleStepDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!isEditMode || !draggedStepId) return
    e.preventDefault()
    setDragOverStepIndex(null)

    const steps = [...registrationSteps]
    const dragIndex = steps.findIndex(s => s.id === draggedStepId)

    if (dragIndex === -1 || dragIndex === dropIndex) {
      setDraggedStepId(null)
      return
    }

    // Store previous order for animation
    const oldOrder: { [key: string]: number } = {}
    steps.forEach((s, i) => {
      oldOrder[s.id] = i
    })
    setPreviousOrder(oldOrder)

    // Remove dragged item and insert at new position
    const [draggedItem] = steps.splice(dragIndex, 1)
    steps.splice(dropIndex, 0, draggedItem)

    // Update order numbers
    const reorderedSteps = steps.map((s, i) => ({ ...s, order: i + 1 }))

    // Trigger animation
    setIsReordering(true)
    setRegistrationSteps(reorderedSteps)
    // Update formFields for backward compatibility
    const allFields = reorderedSteps.flatMap(step => step.fields)
    setFormFields(allFields)
    setDraggedStepId(null)

    // Reset reordering animation after animation completes
    setTimeout(() => {
      setIsReordering(false)
      setPreviousOrder({})
    }, 800)
  }

  const handleStepDragEnd = () => {
    setDraggedStepId(null)
    setDragOverStepIndex(null)
  }

  // Get icon for step name
  const getStepIcon = (stepName: string) => {
    const name = stepName.toLowerCase()
    if (name.includes('project') || name.includes('information')) return FileText
    if (name.includes('beneficiary')) return Users
    if (name.includes('location')) return MapPin
    if (name.includes('documentary') || name.includes('document')) return FileText
    return FileText
  }

  // Get icon for form field type
  const getFieldIcon = (fieldType: string) => {
    const fieldTypeObj = fieldTypes.find(ft => ft.id === fieldType)
    return fieldTypeObj?.icon || Type
  }

  // NEVER wait for auth - only wait for projectType to load
  // This prevents any redirects in Vercel where auth loading can cause issues
  // The layout already handles allowing this route, so we don't need to check auth here
  if (!projectType || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration form configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/form-builder/projects')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registration Form Configuration</h1>
          <p className="text-muted-foreground">
            Configure the initial registration form for <strong>{projectType.name}</strong>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{projectType.name} - Registration Form</CardTitle>
              {projectType.description && (
                <CardDescription className="mt-1">
                  {projectType.description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPreviewModal(true)
                  // Auto-select first step if available
                  if (registrationSteps.length > 0 && !selectedPreviewStep) {
                    setSelectedPreviewStep(registrationSteps.sort((a, b) => a.order - b.order)[0].id)
                  }
                }}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview All Steps
              </Button>
              <div className="flex items-center gap-2">
                {!isEditMode ? (
                  <>
                    <Button
                      onClick={() => setIsEditMode(true)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={addStep}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Step
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={addStep}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Step
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditMode(false)
                        // Reset to saved steps
                        if (projectType.registrationSteps) {
                          setRegistrationSteps(projectType.registrationSteps)
                          const allFields = projectType.registrationSteps.flatMap(step => step.fields)
                          setFormFields(allFields)
                        } else {
                          setFormFields(projectType.registrationForm || [])
                        }
                        setSelectedField(null)
                        setSelectedStep(null)
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {registrationSteps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No registration steps configured</p>
              <p className="text-sm text-muted-foreground mt-2">
                {isEditMode 
                  ? 'Click "Configure" to set up the registration form steps'
                  : 'Click "Edit" to start configuring the registration form'}
              </p>
            </div>
          ) : (
            <>
              {/* Stepper Visualization */}
              <div className="pb-6 border-b">
                <Label className="text-sm font-medium mb-4 block">Step Order Preview</Label>
                <div className="flex items-center justify-center px-4 relative" style={{ minHeight: '120px' }}>
                  {registrationSteps
                    .sort((a, b) => a.order - b.order)
                    .map((step, newIndex) => {
                      const StepIcon = getStepIcon(step.name)
                      const oldIndex = previousOrder[step.id] !== undefined ? previousOrder[step.id] : newIndex
                      const isSwapping = isReordering && oldIndex !== newIndex
                      
                      // Calculate positions - each step takes equal width
                      const totalSteps = registrationSteps.length
                      const stepWidth = 100 / totalSteps
                      const oldPosition = (oldIndex / totalSteps) * 100
                      const newPosition = (newIndex / totalSteps) * 100
                      
                      return (
                        <div 
                          key={step.id} 
                          className="absolute flex flex-col items-center"
                          style={{
                            left: isReordering ? `${oldPosition}%` : `${newPosition}%`,
                            width: `${stepWidth}%`,
                            transform: isSwapping 
                              ? `translateX(${newPosition - oldPosition}%)` 
                              : 'translateX(0)',
                            transition: isReordering 
                              ? 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' 
                              : 'none',
                            zIndex: isSwapping ? 30 : 10,
                          }}
                        >
                          {/* Step Circle with Icon */}
                          <div 
                            className={cn(
                              "relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground",
                              {
                                "ring-4 ring-primary/50 shadow-2xl": isSwapping,
                              }
                            )}
                            style={{
                              transform: isSwapping ? 'scale(1.2) rotate(180deg)' : 'scale(1) rotate(0deg)',
                              transition: isReordering 
                                ? 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' 
                                : 'none',
                            }}
                          >
                            <StepIcon className="h-6 w-6" />
                          </div>
                          {/* Step Label */}
                          <div className="mt-3 w-full px-1 text-center">
                            <p className={cn(
                              "text-xs font-medium text-foreground truncate",
                              {
                                "font-bold text-primary": isSwapping,
                              }
                            )}
                              style={{
                                transform: isSwapping ? 'scale(1.15)' : 'scale(1)',
                                transition: isReordering 
                                  ? 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' 
                                  : 'none',
                              }}>
                              {step.name}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {step.fields?.length || 0} field{(step.fields?.length || 0) !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  {/* Connector Lines - centered between icons */}
                  <div className="absolute inset-0 pointer-events-none" style={{ top: '48px', height: '2px' }}>
                    {registrationSteps
                      .sort((a, b) => a.order - b.order)
                      .slice(0, -1)
                      .map((step, index) => {
                        const totalSteps = registrationSteps.length
                        const connectorCenter = ((index + 1) / totalSteps) * 100
                        const connectorWidth = (100 / totalSteps) * 0.6
                        
                        return (
                          <div
                            key={`connector-${step.id}`}
                            className="absolute h-0.5 bg-primary"
                            style={{
                              left: `${connectorCenter - connectorWidth / 2}%`,
                              width: `${connectorWidth}%`,
                              top: '0',
                              opacity: isReordering ? 0.4 : 1,
                              transition: 'opacity 0.3s ease',
                            }}
                          />
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* Draggable Steps List */}
              <div>
                <Label className="text-sm font-medium mb-4 block">Drag to Reorder Steps</Label>
                <div className="space-y-2">
                  {registrationSteps
                    .sort((a, b) => a.order - b.order)
                    .map((step, index) => {
                      const StepIcon = getStepIcon(step.name)
                      const isDragged = draggedStepId === step.id
                      const isDropTarget = dragOverStepIndex === index && !isDragged && draggedStepId
                      
                      return (
                        <div
                          key={step.id}
                          id={`step-${step.id}`}
                          draggable={isEditMode}
                          onDragStart={(e) => isEditMode && handleStepDragStart(e, step.id)}
                          onDragOver={(e) => isEditMode && handleStepDragOver(e, index)}
                          onDragLeave={handleStepDragLeave}
                          onDrop={(e) => isEditMode && handleStepDrop(e, index)}
                          onDragEnd={handleStepDragEnd}
                          className={cn(
                            'flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ease-in-out',
                            {
                              'ring-4 ring-green-500 ring-offset-2 shadow-lg scale-105 bg-green-50 border-green-500': highlightedStepId === step.id,
                            },
                            {
                              'opacity-50 bg-muted': isDragged,
                              'border-primary bg-primary/5 scale-[1.02]': isDropTarget,
                              'bg-card hover:bg-muted/50 hover:shadow-md': !isDragged && !isDropTarget,
                              'cursor-default': !isEditMode,
                              'cursor-move': isEditMode,
                            }
                          )}
                        >
                          <GripVertical className={cn(
                            "h-5 w-5 text-muted-foreground flex-shrink-0",
                            isEditMode ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed opacity-50"
                          )} />
                          <Badge variant="outline" className="text-sm font-semibold min-w-[3rem] justify-center">
                            {step.order}
                          </Badge>
                          <StepIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            {editingStepNameId === step.id ? (
                              <Input
                                value={editingStepName}
                                onChange={(e) => setEditingStepName(e.target.value)}
                                onBlur={() => {
                                  if (editingStepName.trim()) {
                                    updateStep(step.id, { name: editingStepName.trim() })
                                  }
                                  setEditingStepNameId(null)
                                  setEditingStepName('')
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    if (editingStepName.trim()) {
                                      updateStep(step.id, { name: editingStepName.trim() })
                                    }
                                    setEditingStepNameId(null)
                                    setEditingStepName('')
                                  } else if (e.key === 'Escape') {
                                    setEditingStepNameId(null)
                                    setEditingStepName('')
                                  }
                                }}
                                className="h-8 text-base font-medium"
                                autoFocus
                              />
                            ) : (
                              <p 
                                className={cn(
                                  "text-base font-medium",
                                  isEditMode && "cursor-pointer hover:text-primary"
                                )}
                                onClick={() => {
                                  if (isEditMode) {
                                    setEditingStepNameId(step.id)
                                    setEditingStepName(step.name)
                                  }
                                }}
                                title={isEditMode ? "Click to edit step name" : ""}
                              >
                                {step.name}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">{step.fields?.length || 0} field{(step.fields?.length || 0) !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (index > 0) {
                                  const sortedSteps: RegistrationStep[] = [...registrationSteps].sort((a: RegistrationStep, b: RegistrationStep) => a.order - b.order)
                                  const temp: RegistrationStep = sortedSteps[index - 1]
                                  sortedSteps[index - 1] = sortedSteps[index]
                                  sortedSteps[index] = temp
                                  const reorderedSteps: RegistrationStep[] = sortedSteps.map((s: RegistrationStep, i: number) => ({ ...s, order: i + 1 }))
                                  setRegistrationSteps(reorderedSteps)
                                  const allFields: FormField[] = reorderedSteps.flatMap((s: RegistrationStep) => s.fields || [])
                                  setFormFields(allFields)
                                }
                              }}
                              disabled={!isEditMode || index === 0}
                              className="h-8 w-8 p-0"
                              title="Move up"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (index < registrationSteps.length - 1) {
                                  const sortedSteps: RegistrationStep[] = [...registrationSteps].sort((a: RegistrationStep, b: RegistrationStep) => a.order - b.order)
                                  const temp: RegistrationStep = sortedSteps[index]
                                  sortedSteps[index] = sortedSteps[index + 1]
                                  sortedSteps[index + 1] = temp
                                  const reorderedSteps: RegistrationStep[] = sortedSteps.map((s: RegistrationStep, i: number) => ({ ...s, order: i + 1 }))
                                  setRegistrationSteps(reorderedSteps)
                                  const allFields: FormField[] = reorderedSteps.flatMap((s: RegistrationStep) => s.fields || [])
                                  setFormFields(allFields)
                                }
                              }}
                              disabled={!isEditMode || index === registrationSteps.length - 1}
                              className="h-8 w-8 p-0"
                              title="Move down"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            {isEditMode && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setConfiguringStepId(step.id)
                                    setIsStepConfigureDialogOpen(true)
                                  }}
                                  className="h-8 w-8 p-0"
                                  title="Configure step fields"
                                >
                                  <Settings2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setStepToDelete({ id: step.id, name: step.name })
                                  }}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  title="Delete step"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* Step Fields Display */}
              {selectedStep && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-sm font-medium">Fields in "{selectedStep.name}"</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStep(null)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(selectedStep.fields || []).map((field, index) => {
                    const FieldIcon = fieldTypes.find(ft => ft.id === field.type)?.icon || Type
                    const isDragged = draggedFormFieldId === field.id
                    const isDropTarget = dragOverFieldIndex === index && !isDragged && draggedFormFieldId
                    
                    return (
                      <div key={field.id} className="relative">
                        {isDropTarget && dragOverFieldIndex !== null && (
                          <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full z-10" />
                        )}
                        
                        <div
                          draggable={isEditMode}
                          onDragStart={(e) => handleFormFieldItemDragStart(e, field.id)}
                          onDragOver={(e) => handleFormFieldItemDragOver(e, index)}
                          onDragLeave={handleFormFieldItemDragLeave}
                          onDrop={(e) => handleFormFieldItemDrop(e, index)}
                          onDragEnd={handleFormFieldItemDragEnd}
                          className={cn(
                            "p-4 border rounded-lg transition-all relative",
                            {
                              "border-primary bg-primary/5 ring-2 ring-primary": selectedField?.id === field.id && !isDragged,
                              "border-border hover:border-primary/50": selectedField?.id !== field.id && !isDragged && !isDropTarget,
                              "border-primary bg-primary/20 ring-2 ring-primary ring-offset-2": isDropTarget,
                              "opacity-50 cursor-grabbing": isDragged,
                              "cursor-grab": !isDragged && isEditMode,
                              "cursor-pointer": !isDragged && !isDropTarget && isEditMode,
                              "cursor-default": !isEditMode,
                            }
                          )}
                          onClick={() => !isDragged && isEditMode && setSelectedField(field)}
                          id={`field-${field.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <GripVertical className={cn(
                              "h-5 w-5 text-muted-foreground mt-1 flex-shrink-0",
                              isEditMode ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed opacity-50"
                            )} />
                            <FieldIcon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              {field.type === 'label' ? (
                                <div className="py-2">
                                  <p className="text-base font-medium text-foreground">{field.label}</p>
                                  <div className="text-xs text-muted-foreground mt-1">Label (no input)</div>
                                </div>
                              ) : field.type === 'button' ? (
                                <div className="py-2">
                                  <Button variant="default" disabled className="pointer-events-none">
                                    {field.label || 'Submit'}
                                  </Button>
                                  <div className="text-xs text-muted-foreground mt-1">Button</div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Label className="font-medium">{field.label}</Label>
                                    {field.required && (
                                      <Badge variant="secondary" className="text-xs">Required</Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {field.type} {field.placeholder && `• ${field.placeholder}`}
                                  </div>
                                </>
                              )}
                            </div>
                            {isEditMode && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteFieldClick(field.id, field.label)
                                }}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
          )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Registration Form Configuration Dialog - Full Screen Form Builder */}
      <Dialog open={isConfigureDialogOpen} onOpenChange={setIsConfigureDialogOpen}>
        <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  {projectType?.name} &gt; Configure Registration Form
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Build the registration form by dragging form elements from the right panel.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const versions = getFormVersions()
                    if (versions.length > 0) {
                      setShowVersionsModal(true)
                    } else {
                      alert('No versions available. Publish a form first.')
                    }
                  }}
                  className="gap-2"
                  title="View version history"
                >
                  <History className="h-4 w-4" />
                  Versions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPreviewModal(true)
                    if (registrationSteps.length > 0 && !selectedPreviewStep) {
                      const firstStep = registrationSteps.sort((a, b) => a.order - b.order)[0]
                      setSelectedPreviewStep(firstStep.id)
                    }
                  }}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Show Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={publishForm}
                  disabled={!isEditMode || !registrationSteps || registrationSteps.length === 0}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Publish
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Form Builder Area */}
            <div className="flex-1 flex flex-col overflow-hidden border-r">
              <div className="p-4 border-b bg-muted/30">
                <Label className="text-sm font-medium">Registration Form Builder - Steps</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure steps and their fields. Click on a step to edit its fields.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {registrationSteps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg">
                    <FileText className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No steps configured yet</p>
                    <p className="text-sm text-center max-w-md">
                      Steps will be initialized with default values when you save
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    {registrationSteps
                      .sort((a, b) => a.order - b.order)
                      .map((step) => {
                        const StepIcon = getStepIcon(step.name)
                        const isStepSelected = selectedStep?.id === step.id
                        
                        return (
                          <Card key={step.id} className={isStepSelected ? 'border-primary ring-2 ring-primary' : ''}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-primary/10">
                                    <StepIcon className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <CardTitle className="flex items-center gap-2">
                                      {step.name}
                                      <Badge variant="outline">Step {step.order}</Badge>
                                    </CardTitle>
                                    <CardDescription>
                                      {step.fields?.length || 0} field{(step.fields?.length || 0) !== 1 ? 's' : ''}
                                    </CardDescription>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            {false && isStepSelected && (
                              <CardContent className="space-y-4 pt-4 border-t">
                                <div 
                                  className="space-y-4"
                                  onDragOver={handleFormFieldDragOver}
                                  onDrop={(e) => {
                                    e.preventDefault()
                                    if (draggedFieldType) {
                                      addFieldToStep(step.id, draggedFieldType)
                                      setDraggedFieldType(null)
                                    }
                                  }}
                                  onDragLeave={handleFormFieldDragLeave}
                                >
                                  {(step.fields?.length || 0) === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                      <Type className="h-12 w-12 mb-2 opacity-50" />
                                      <p className="text-sm">No fields in this step</p>
                                      <p className="text-xs mt-1">Drag fields from the right panel or click + to add</p>
                                    </div>
                                  ) : (
                                    (step.fields || []).map((field, fieldIndex) => {
                                      const FieldIcon = fieldTypes.find(ft => ft.id === field.type)?.icon || Type
                                      const isDragged = draggedFormFieldId === field.id
                                      const isDropTarget = dragOverFieldIndex === fieldIndex && !isDragged && draggedFormFieldId
                                      const fields = step.fields || []
                                      const dragIndex = draggedFormFieldId ? fields.findIndex(f => f.id === draggedFormFieldId) : -1
                                      const showDropIndicatorAbove = isDropTarget && dragIndex > fieldIndex
                                      const showDropIndicatorBelow = isDropTarget && dragIndex < fieldIndex
                                      
                                      return (
                                        <div key={field.id} className="relative">
                                          {/* Drop indicator above */}
                                          {showDropIndicatorAbove && (
                                            <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full z-10" />
                                          )}
                                          
                                          <div
                                            draggable={isEditMode}
                                            onDragStart={(e) => handleFormFieldItemDragStart(e, field.id)}
                                            onDragOver={(e) => {
                                              e.preventDefault()
                                              e.stopPropagation()
                                              if (isEditMode && draggedFormFieldId) {
                                                const fields = step.fields
                                                const dragIndex = fields.findIndex(f => f.id === draggedFormFieldId)
                                                if (dragIndex !== fieldIndex) {
                                                  setDragOverFieldIndex(fieldIndex)
                                                }
                                              }
                                            }}
                                            onDragLeave={handleFormFieldItemDragLeave}
                                            onDrop={(e) => {
                                              e.preventDefault()
                                              e.stopPropagation()
                                              if (isEditMode && draggedFormFieldId) {
                                                const fields = [...step.fields]
                                                const dragIndex = fields.findIndex(f => f.id === draggedFormFieldId)
                                                if (dragIndex !== -1 && dragIndex !== fieldIndex) {
                                                  const [draggedItem] = fields.splice(dragIndex, 1)
                                                  fields.splice(fieldIndex, 0, draggedItem)
                                                  const updatedSteps = registrationSteps.map(s =>
                                                    s.id === step.id ? { ...s, fields } : s
                                                  )
                                                  setRegistrationSteps(updatedSteps)
                                                  const allFields = updatedSteps.flatMap(s => s.fields)
                                                  setFormFields(allFields)
                                                  setDraggedFormFieldId(null)
                                                  setDragOverFieldIndex(null)
                                                }
                                              }
                                            }}
                                            onDragEnd={handleFormFieldItemDragEnd}
                                            className={cn(
                                              "p-4 border rounded-lg transition-all relative",
                                              {
                                                "border-primary bg-primary/5 ring-2 ring-primary": selectedField?.id === field.id && !isDragged,
                                                "border-border hover:border-primary/50": selectedField?.id !== field.id && !isDragged && !isDropTarget,
                                                "border-primary bg-primary/20 ring-2 ring-primary ring-offset-2": isDropTarget,
                                                "opacity-50 cursor-grabbing": isDragged,
                                                "cursor-grab": !isDragged && isEditMode,
                                                "cursor-pointer": !isDragged && !isDropTarget && isEditMode,
                                                "cursor-default": !isEditMode,
                                              }
                                            )}
                                            onClick={() => !isDragged && setSelectedField(field)}
                                          >
                                            <div className="flex items-start gap-3">
                                              <GripVertical className={cn(
                                                "h-5 w-5 text-muted-foreground mt-1 flex-shrink-0",
                                                isEditMode ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed opacity-50"
                                              )} />
                                              <FieldIcon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                                              <div className="flex-1">
                                                {field.type === 'label' ? (
                                                  <div className="py-2">
                                                    <p className="text-base font-medium text-foreground">{field.label}</p>
                                                    <div className="text-xs text-muted-foreground mt-1">Label (no input)</div>
                                                  </div>
                                                ) : field.type === 'button' ? (
                                                  <div className="py-2">
                                                    <Button variant="default" disabled className="pointer-events-none">
                                                      {field.label || 'Submit'}
                                                    </Button>
                                                    <div className="text-xs text-muted-foreground mt-1">Button</div>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <div className="flex items-center gap-2 mb-2">
                                                      <Label className="font-medium">{field.label}</Label>
                                                      {field.required && (
                                                        <Badge variant="secondary" className="text-xs">Required</Badge>
                                                      )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                      {field.type} {field.placeholder && `• ${field.placeholder}`}
                                                    </div>
                                                  </>
                                                )}
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleDeleteFieldClick(field.id, field.label)
                                                }}
                                                disabled={!isEditMode}
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                          
                                          {/* Drop indicator below */}
                                          {showDropIndicatorBelow && (
                                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full z-10" />
                                          )}
                                        </div>
                                      )
                                    })
                                  )}
                                </div>
                                {isEditMode && (
                                  <Button
                                    variant="outline"
                                    onClick={() => addFieldToStep(step.id, 'text')}
                                    className="w-full mt-4"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Field to {step.name}
                                  </Button>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Form Elements Palette */}
            <div className="w-80 flex flex-col border-l bg-muted/20">
              <div className="p-4 border-b bg-muted/30">
                <Label className="text-sm font-medium">Form Elements</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag to add or click to insert
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {fieldTypes.map((fieldType) => {
                  const Icon = fieldType.icon
                  return (
                    <div
                      key={fieldType.id}
                      draggable
                      onDragStart={(e) => handleFormFieldDragStart(e, fieldType.id)}
                      className="flex items-center gap-2 p-2.5 border rounded-lg cursor-move hover:bg-accent transition-colors bg-card group"
                    >
                      <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Move className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{fieldType.label}</div>
                        <div className="text-xs text-muted-foreground truncate">{fieldType.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          addFormField(fieldType.id)
                        }}
                        className="h-7 w-7 p-0 flex-shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Field Configuration Panel */}
          {selectedField && (
            <div className="border-t p-2.5 bg-muted/30">
              <div className="max-w-4xl mx-auto">
                <Label className="text-xs font-medium mb-2 block">Field Configuration</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="field-label" className="text-xs">Field Label</Label>
                    <Input
                      id="field-label"
                      value={selectedField.label}
                      onChange={(e) => {
                        if (isConfigureDialogOpen) {
                          updateFormField(selectedField.id, { label: e.target.value })
                        } else {
                          // Find which step contains this field and update it
                          const stepContainingField = registrationSteps.find(step => 
                            step.fields?.some(f => f.id === selectedField.id)
                          )
                          if (stepContainingField) {
                            updateFieldInStep(stepContainingField.id, selectedField.id, { label: e.target.value })
                          }
                        }
                      }}
                      placeholder="Enter field label"
                      className="h-8 text-sm"
                    />
                  </div>
                  {selectedField.type !== 'label' && selectedField.type !== 'button' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="field-placeholder" className="text-xs">Placeholder</Label>
                      <Input
                        id="field-placeholder"
                        value={selectedField.placeholder || ''}
                        onChange={(e) => {
                          if (isConfigureDialogOpen) {
                            updateFormField(selectedField.id, { placeholder: e.target.value })
                          } else {
                            const stepContainingField = registrationSteps.find(step => 
                              step.fields.some(f => f.id === selectedField.id)
                            )
                            if (stepContainingField) {
                              updateFieldInStep(stepContainingField.id, selectedField.id, { placeholder: e.target.value })
                            }
                          }
                        }}
                        placeholder="Enter placeholder text"
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                </div>
                {selectedField.type !== 'label' && selectedField.type !== 'button' && (
                  <div className="flex items-center space-x-2 mt-2.5">
                    <Switch
                      id="field-required"
                      checked={selectedField.required}
                      onCheckedChange={(checked) => {
                        if (isConfigureDialogOpen) {
                          updateFormField(selectedField.id, { required: checked })
                        } else {
                          const stepContainingField = registrationSteps.find(step => 
                            step.fields?.some(f => f.id === selectedField.id)
                          )
                          if (stepContainingField) {
                            updateFieldInStep(stepContainingField.id, selectedField.id, { required: checked })
                          }
                        }
                      }}
                      className="h-4 w-7"
                    />
                    <Label htmlFor="field-required" className="cursor-pointer text-xs">Required field</Label>
                  </div>
                )}
                {(selectedField.type === 'select' || selectedField.type === 'radio') && (
                  <div className="space-y-1.5 mt-2.5">
                    <Label className="text-xs">Options</Label>
                    <div className="space-y-1.5">
                      {selectedField.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(selectedField.options || [])]
                              newOptions[index] = e.target.value
                              if (isConfigureDialogOpen) {
                                updateFormField(selectedField.id, { options: newOptions })
                              } else {
                                const stepContainingField = registrationSteps.find(step => 
                                  step.fields.some(f => f.id === selectedField.id)
                                )
                                if (stepContainingField) {
                                  updateFieldInStep(stepContainingField.id, selectedField.id, { options: newOptions })
                                }
                              }
                            }}
                            placeholder={`Option ${index + 1}`}
                            className="h-8 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newOptions = selectedField.options?.filter((_, i) => i !== index) || []
                              if (isConfigureDialogOpen) {
                                updateFormField(selectedField.id, { options: newOptions })
                              } else {
                                const stepContainingField = registrationSteps.find(step => 
                                  step.fields.some(f => f.id === selectedField.id)
                                )
                                if (stepContainingField) {
                                  updateFieldInStep(stepContainingField.id, selectedField.id, { options: newOptions })
                                }
                              }
                            }}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`]
                          if (isConfigureDialogOpen) {
                            updateFormField(selectedField.id, { options: newOptions })
                          } else {
                            const stepContainingField = registrationSteps.find(step => 
                              step.fields.some(f => f.id === selectedField.id)
                            )
                            if (stepContainingField) {
                              updateFieldInStep(stepContainingField.id, selectedField.id, { options: newOptions })
                            }
                          }
                        }}
                        className="w-full h-8 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsConfigureDialogOpen(false)
              setSelectedField(null)
              setSelectedStep(null)
            }}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveConfiguration} disabled={!isEditMode}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Versions Modal */}
      <Dialog open={showVersionsModal} onOpenChange={setShowVersionsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Form Version History</DialogTitle>
            <DialogDescription>
              View and rollback to previous versions of the registration form
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {(() => {
              const versions = getFormVersions()
              return versions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <History className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No versions available</p>
                  <p className="text-sm">Publish a form to create the first version</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {versions.map((version) => (
                    <Card key={version.id} className={version.isActive ? 'border-primary bg-primary/5' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={version.isActive ? 'default' : 'secondary'}>
                                Version {version.version} {version.isActive && '(Active)'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(version.publishedAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {version.formFields.length} field{version.formFields.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          {!version.isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Rollback to version ${version.version}? This will replace the current form.`)) {
                                  rollbackToVersion(version)
                                }
                              }}
                              className="gap-2"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Rollback
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Field Configuration Panel */}
      {selectedField && isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>Field Configuration</CardTitle>
            <CardDescription>
              Configure the selected form field
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field-label">Field Label</Label>
                <Input
                  id="field-label"
                  value={selectedField.label}
                  onChange={(e) => updateFormField(selectedField.id, { label: e.target.value })}
                  placeholder="Enter field label"
                />
              </div>
              {selectedField.type !== 'label' && selectedField.type !== 'button' && (
                <div className="space-y-2">
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => updateFormField(selectedField.id, { placeholder: e.target.value })}
                    placeholder="Enter placeholder text"
                  />
                </div>
              )}
            </div>
            {selectedField.type !== 'label' && selectedField.type !== 'button' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="field-required"
                  checked={selectedField.required}
                  onCheckedChange={(checked) => updateFormField(selectedField.id, { required: checked })}
                />
                <Label htmlFor="field-required" className="cursor-pointer">Required field</Label>
              </div>
            )}
            {(selectedField.type === 'select' || selectedField.type === 'radio') && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedField.options || [])]
                          newOptions[index] = e.target.value
                          updateFormField(selectedField.id, { options: newOptions })
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = selectedField.options?.filter((_, i) => i !== index) || []
                          updateFormField(selectedField.id, { options: newOptions })
                        }}
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`]
                      updateFormField(selectedField.id, { options: newOptions })
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Form Preview - Registration Form</DialogTitle>
            <DialogDescription>
              Click on any step in the stepper to preview its form field
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Stepper */}
            <div className="border-b pb-6 mb-6">
              <div className="flex items-center justify-between px-8 relative" style={{ minHeight: '140px' }}>
                {registrationSteps
                  .sort((a, b) => a.order - b.order)
                  .map((step, index) => {
                    const StepIcon = getStepIcon(step.name)
                    const isSelected = selectedPreviewStep === step.id
                    
                    const totalSteps = registrationSteps.length
                    const stepAreaWidth = 100 / totalSteps
                    const stepCenter = (index + 0.5) * stepAreaWidth
                    
                    return (
                      <div 
                        key={step.id} 
                        className="absolute flex flex-col items-center cursor-pointer group"
                        style={{
                          left: `${stepCenter}%`,
                          transform: 'translateX(-50%)',
                          width: `${stepAreaWidth}%`,
                          minWidth: '120px',
                        }}
                        onClick={() => setSelectedPreviewStep(step.id)}
                      >
                        {/* Step Circle with Icon */}
                        <div 
                          className={cn(
                            "relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                            {
                              "border-primary bg-primary text-primary-foreground shadow-lg scale-110 ring-4 ring-primary/20": isSelected,
                              "border-primary/30 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/20": !isSelected,
                            }
                          )}
                        >
                          <StepIcon className="h-7 w-7" />
                        </div>
                        {/* Step Label */}
                        <div className="mt-3 w-full px-2 text-center space-y-1.5">
                          <p className={cn(
                            "text-sm font-medium truncate transition-colors",
                            {
                              "font-bold text-primary": isSelected,
                              "text-foreground group-hover:text-primary": !isSelected,
                            }
                          )}>
                            {step.name}
                          </p>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs transition-colors",
                              {
                                "border-primary text-primary": isSelected,
                                "group-hover:border-primary/50": !isSelected,
                              }
                            )}
                          >
                            Step {step.order}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                {/* Connector Lines */}
                <div className="absolute inset-0 pointer-events-none" style={{ top: '64px', height: '2px' }}>
                  {registrationSteps
                    .sort((a, b) => a.order - b.order)
                    .slice(0, -1)
                    .map((step, index) => {
                      const totalSteps = registrationSteps.length
                      const stepAreaWidth = 100 / totalSteps
                      const currentStepCenter = (index + 0.5) * stepAreaWidth
                      const nextStepCenter = (index + 1.5) * stepAreaWidth
                      const connectorStart = currentStepCenter + (stepAreaWidth * 0.15)
                      const connectorEnd = nextStepCenter - (stepAreaWidth * 0.15)
                      const connectorWidth = connectorEnd - connectorStart
                      const connectorLeft = connectorStart
                      
                      return (
                        <div
                          key={`connector-${step.id}`}
                          className="absolute h-0.5 bg-primary/30"
                          style={{
                            left: `${connectorLeft}%`,
                            width: `${connectorWidth}%`,
                            top: '0',
                          }}
                        />
                      )
                    })}
                </div>
              </div>
            </div>

            {/* Selected Step Form Preview */}
            <div className="flex-1 overflow-y-auto p-6">
              {(() => {
                if (registrationSteps.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                      <FileText className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No registration steps configured</p>
                      <p className="text-sm">Add steps to see the preview</p>
                    </div>
                  )
                }
                
                if (!selectedPreviewStep) {
                  return (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Select a step to preview</p>
                      <p className="text-sm">Click on any step in the stepper above to see its form fields</p>
                    </div>
                  )
                }
                
                const selectedStep = registrationSteps.find(s => s.id === selectedPreviewStep)
                if (!selectedStep) {
                  return (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Step not found</p>
                    </div>
                  )
                }
                
                const StepIcon = getStepIcon(selectedStep.name)
                const stepIndex = registrationSteps.sort((a, b) => a.order - b.order).findIndex(s => s.id === selectedStep.id)
                
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <StepIcon className="h-5 w-5" />
                        {selectedStep.name}
                        <Badge variant="outline">
                          Step {selectedStep.order} of {registrationSteps.length}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Preview of {selectedStep.fields?.length || 0} field{(selectedStep.fields?.length || 0) !== 1 ? 's' : ''} in this step
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!selectedStep.fields || selectedStep.fields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                          <FileText className="h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm">No fields in this step</p>
                        </div>
                      ) : (
                        (selectedStep.fields || []).map((field) => {
                          const FieldIcon = fieldTypes.find(ft => ft.id === field.type)?.icon || Type
                          return (
                            <div key={field.id} className="space-y-2">
                              {field.type !== 'label' && (
                                <Label htmlFor={`preview-${field.id}`} className="flex items-center gap-2">
                                  <FieldIcon className="h-4 w-4 text-muted-foreground" />
                                  {field.label}
                                  {field.required && (
                                    <span className="text-destructive">*</span>
                                  )}
                                </Label>
                              )}
                              {field.type === 'text' && (
                                <Input
                                  id={`preview-${field.id}`}
                                  placeholder={field.placeholder}
                                  value={previewData[field.id] || ''}
                                  onChange={(e) => setPreviewData({ ...previewData, [field.id]: e.target.value })}
                                />
                              )}
                              {field.type === 'email' && (
                                <Input
                                  id={`preview-${field.id}`}
                                  type="email"
                                  placeholder={field.placeholder}
                                  value={previewData[field.id] || ''}
                                  onChange={(e) => setPreviewData({ ...previewData, [field.id]: e.target.value })}
                                />
                              )}
                              {field.type === 'number' && (
                                <Input
                                  id={`preview-${field.id}`}
                                  type="number"
                                  placeholder={field.placeholder}
                                  value={previewData[field.id] || ''}
                                  onChange={(e) => setPreviewData({ ...previewData, [field.id]: e.target.value })}
                                  min={field.validation?.min}
                                  max={field.validation?.max}
                                />
                              )}
                              {field.type === 'date' && (
                                <Input
                                  id={`preview-${field.id}`}
                                  type="date"
                                  value={previewData[field.id] || ''}
                                  onChange={(e) => setPreviewData({ ...previewData, [field.id]: e.target.value })}
                                />
                              )}
                              {field.type === 'textarea' && (
                                <textarea
                                  id={`preview-${field.id}`}
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder={field.placeholder}
                                  value={previewData[field.id] || ''}
                                  onChange={(e) => setPreviewData({ ...previewData, [field.id]: e.target.value })}
                                />
                              )}
                              {field.type === 'select' && (
                                <Select
                                  value={previewData[field.id] || ''}
                                  onValueChange={(value) => setPreviewData({ ...previewData, [field.id]: value })}
                                >
                                  <SelectTrigger id={`preview-${field.id}`}>
                                    <SelectValue placeholder={field.placeholder || 'Select an option'} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((option, index) => (
                                      <SelectItem key={index} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              {field.type === 'radio' && (
                                <div className="space-y-2">
                                  {field.options?.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <input
                                        type="radio"
                                        id={`preview-${field.id}-${index}`}
                                        name={`preview-${field.id}`}
                                        value={option}
                                        checked={previewData[field.id] === option}
                                        onChange={(e) => setPreviewData({ ...previewData, [field.id]: e.target.value })}
                                        className="h-4 w-4 text-primary"
                                      />
                                      <Label htmlFor={`preview-${field.id}-${index}`} className="font-normal cursor-pointer">
                                        {option}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {field.type === 'checkbox' && (
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`preview-${field.id}`}
                                    checked={previewData[field.id] || false}
                                    onCheckedChange={(checked) => setPreviewData({ ...previewData, [field.id]: checked })}
                                  />
                                  <Label htmlFor={`preview-${field.id}`} className="font-normal cursor-pointer">
                                    {field.placeholder || 'Check this option'}
                                  </Label>
                                </div>
                              )}
                              {field.type === 'file' && (
                                <div className="space-y-2">
                                  <Input
                                    id={`preview-${field.id}`}
                                    type="file"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        setPreviewData({ ...previewData, [field.id]: file.name })
                                      }
                                    }}
                                  />
                                  {previewData[field.id] && (
                                    <p className="text-xs text-muted-foreground">
                                      Selected: {previewData[field.id]}
                                    </p>
                                  )}
                                </div>
                              )}
                              {field.type === 'label' && (
                                <div className="py-2">
                                  <p className="text-base font-medium text-foreground">{field.label}</p>
                                </div>
                              )}
                              {field.type === 'button' && (
                                <Button 
                                  onClick={() => {
                                    console.log('Form Data:', previewData)
                                    alert('Form submitted! Check console for data.')
                                  }}
                                  className="w-full"
                                >
                                  {field.label || 'Submit'}
                                </Button>
                              )}
                            </div>
                          )
                        })
                      )}
                    </CardContent>
                  </Card>
                )
              })()}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                // Auto-select first step if none selected
                if (!selectedPreviewStep && registrationSteps.length > 0) {
                  const firstStep = registrationSteps.sort((a, b) => a.order - b.order)[0]
                  setSelectedPreviewStep(firstStep.id)
                } else {
                  setShowPreviewModal(false)
                  setSelectedPreviewStep(null)
                }
              }}
            >
              {!selectedPreviewStep ? 'View First Step' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Configure Dialog - Full Screen Form Builder */}
      <Dialog open={isStepConfigureDialogOpen} onOpenChange={setIsStepConfigureDialogOpen}>
        <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  {projectType?.name} &gt; Configure Step &gt; {configuringStepId ? registrationSteps.find(s => s.id === configuringStepId)?.name : ''}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Build the form for this step by dragging form elements from the right panel.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowStepVersionsModal(true)
                  }}
                  className="gap-2"
                  title="View version history"
                >
                  <History className="h-4 w-4" />
                  Versions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStepPreviewModal(true)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Show Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={publishStepForm}
                  disabled={!configuringStepId || !registrationSteps.find(s => s.id === configuringStepId)?.fields || registrationSteps.find(s => s.id === configuringStepId)?.fields?.length === 0}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Publish
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Form Builder Area */}
            <div className="flex-1 flex flex-col overflow-hidden border-r">
              <div className="p-4 border-b bg-muted/30">
                <Label className="text-sm font-medium">Step Form Builder</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag form elements here or click to add them
                </p>
              </div>
              <div 
                className="flex-1 overflow-y-auto p-6"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'copy'
                  if (draggedFieldType) {
                    setConfiguringStepDragOverFieldIndex(null)
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggedFieldType && configuringStepId) {
                    addFieldToStep(configuringStepId, draggedFieldType)
                    setDraggedFieldType(null)
                  }
                  setConfiguringStepDragOverFieldIndex(null)
                }}
                onDragLeave={() => setConfiguringStepDragOverFieldIndex(null)}
              >
                {configuringStepId && (() => {
                  const step = registrationSteps.find(s => s.id === configuringStepId)
                  if (!step) return null
                  
                  return (
                    <>
                      {(!step.fields || step.fields.length === 0) ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg">
                          <Type className="h-16 w-16 mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">No form fields added yet</p>
                          <p className="text-sm text-center max-w-md">
                            Drag form elements from the right panel or click the + button to add fields
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-w-2xl mx-auto">
                          {(step.fields || []).map((field, index) => {
                            const FieldIcon = fieldTypes.find(ft => ft.id === field.type)?.icon || Type
                            const isDragged = configuringStepDraggedFormFieldId === field.id
                            const isDropTarget = configuringStepDragOverFieldIndex === index && !isDragged && configuringStepDraggedFormFieldId
                            const fields = step.fields || []
                            const dragIndex = configuringStepDraggedFormFieldId ? fields.findIndex(f => f.id === configuringStepDraggedFormFieldId) : -1
                            const showDropIndicatorAbove = isDropTarget && dragIndex > index
                            const showDropIndicatorBelow = isDropTarget && dragIndex < index
                            
                            return (
                              <div key={field.id} className="relative">
                                {/* Drop indicator above */}
                                {showDropIndicatorAbove && (
                                  <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full z-10" />
                                )}
                                
                                <div
                                  id={`field-${field.id}`}
                                  draggable
                                  onDragStart={(e) => {
                                    setConfiguringStepDraggedFormFieldId(field.id)
                                    e.dataTransfer.effectAllowed = 'move'
                                    if (e.currentTarget instanceof HTMLElement) {
                                      e.currentTarget.style.opacity = '0.5'
                                    }
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.dataTransfer.dropEffect = 'move'
                                    if (configuringStepDraggedFormFieldId) {
                                      const fields = step.fields || []
                                      const dragIndex = fields.findIndex(f => f.id === configuringStepDraggedFormFieldId)
                                      if (dragIndex !== index) {
                                        setConfiguringStepDragOverFieldIndex(index)
                                      }
                                    }
                                  }}
                                  onDragLeave={() => {
                                    // Don't clear here, let it handle in the drop zone
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setConfiguringStepDragOverFieldIndex(null)
                                    
                                    if (configuringStepDraggedFormFieldId && configuringStepId) {
                                      const fields = [...(step.fields || [])]
                                      const dragIndex = fields.findIndex(f => f.id === configuringStepDraggedFormFieldId)
                                      
                                      if (dragIndex !== -1 && dragIndex !== index) {
                                        const [draggedItem] = fields.splice(dragIndex, 1)
                                        fields.splice(index, 0, draggedItem)
                                        
                                        const updatedSteps = registrationSteps.map(s =>
                                          s.id === configuringStepId ? { ...s, fields } : s
                                        )
                                        setRegistrationSteps(updatedSteps)
                                        const allFields = updatedSteps.flatMap(s => s.fields || [])
                                        setFormFields(allFields)
                                      }
                                    }
                                    setConfiguringStepDraggedFormFieldId(null)
                                  }}
                                  onDragEnd={(e) => {
                                    if (e.currentTarget instanceof HTMLElement) {
                                      e.currentTarget.style.opacity = '1'
                                    }
                                    setConfiguringStepDraggedFormFieldId(null)
                                    setConfiguringStepDragOverFieldIndex(null)
                                  }}
                                  className={cn(
                                    "p-4 border rounded-lg transition-all relative",
                                    {
                                      "ring-4 ring-green-500 ring-offset-2 shadow-lg scale-105 bg-green-50 border-green-500": highlightedFieldId === field.id && !isDragged,
                                      "border-primary bg-primary/5 ring-2 ring-primary": configuringStepSelectedField?.id === field.id && !isDragged && highlightedFieldId !== field.id,
                                      "border-border hover:border-primary/50": configuringStepSelectedField?.id !== field.id && !isDragged && !isDropTarget && highlightedFieldId !== field.id,
                                      "border-primary bg-primary/20 ring-2 ring-primary ring-offset-2": isDropTarget,
                                      "opacity-50 cursor-grabbing": isDragged,
                                      "cursor-grab": !isDragged,
                                      "cursor-pointer": !isDragged && !isDropTarget,
                                    }
                                  )}
                                  onClick={() => !isDragged && setConfiguringStepSelectedField(field)}
                                >
                                  <div className="flex items-start gap-3">
                                    <GripVertical className={cn(
                                      "h-5 w-5 text-muted-foreground mt-1 flex-shrink-0",
                                      "cursor-grab active:cursor-grabbing"
                                    )} />
                                    <FieldIcon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                                    <div className="flex-1">
                                      {field.type === 'label' ? (
                                        <div className="py-2">
                                          <p className="text-base font-medium text-foreground">{field.label}</p>
                                          <div className="text-xs text-muted-foreground mt-1">Label (no input)</div>
                                        </div>
                                      ) : field.type === 'button' ? (
                                        <div className="py-2">
                                          <Button variant="default" disabled className="pointer-events-none">
                                            {field.label || 'Submit'}
                                          </Button>
                                          <div className="text-xs text-muted-foreground mt-1">Button</div>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="flex items-center gap-2 mb-2">
                                            <Label className="font-medium">{field.label}</Label>
                                            {field.required && (
                                              <Badge variant="secondary" className="text-xs">Required</Badge>
                                            )}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {field.type} {field.placeholder && `• ${field.placeholder}`}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteFieldClick(field.id, field.label)
                                      }}
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Drop indicator below */}
                                {showDropIndicatorBelow && (
                                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full z-10" />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Right Panel - Form Elements Palette */}
            <div className="w-80 flex flex-col border-l bg-muted/20">
              <div className="p-4 border-b bg-muted/30">
                <Label className="text-sm font-medium">Form Elements</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag to add or click to insert
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {fieldTypes.map((fieldType) => {
                  const Icon = fieldType.icon
                  return (
                    <div
                      key={fieldType.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedFieldType(fieldType.id)
                        e.dataTransfer.effectAllowed = 'copy'
                      }}
                      className="flex items-center gap-2 p-2.5 border rounded-lg cursor-move hover:bg-accent transition-colors bg-card group"
                    >
                      <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Move className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{fieldType.label}</div>
                        <div className="text-xs text-muted-foreground truncate">{fieldType.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (configuringStepId) {
                            addFieldToStep(configuringStepId, fieldType.id)
                          }
                        }}
                        className="h-7 w-7 p-0 flex-shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Field Configuration Panel */}
          {configuringStepSelectedField && (
            <div className="border-t p-2.5 bg-muted/30">
              <div className="max-w-4xl mx-auto">
                <Label className="text-xs font-medium mb-2 block">Field Configuration</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="step-field-label" className="text-xs">Field Label</Label>
                    <Input
                      id="step-field-label"
                      value={configuringStepSelectedField.label}
                      onChange={(e) => {
                        if (configuringStepId) {
                          updateFieldInStep(configuringStepId, configuringStepSelectedField.id, { label: e.target.value })
                          setConfiguringStepSelectedField({ ...configuringStepSelectedField, label: e.target.value })
                        }
                      }}
                      placeholder="Enter field label"
                      className="h-8 text-sm"
                    />
                  </div>
                  {configuringStepSelectedField.type !== 'label' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="step-field-placeholder" className="text-xs">Placeholder</Label>
                      <Input
                        id="step-field-placeholder"
                        value={configuringStepSelectedField.placeholder || ''}
                        onChange={(e) => {
                          if (configuringStepId) {
                            updateFieldInStep(configuringStepId, configuringStepSelectedField.id, { placeholder: e.target.value })
                            setConfiguringStepSelectedField({ ...configuringStepSelectedField, placeholder: e.target.value })
                          }
                        }}
                        placeholder="Enter placeholder text"
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                </div>
                {configuringStepSelectedField.type !== 'label' && configuringStepSelectedField.type !== 'button' && (
                  <div className="flex items-center space-x-2 mt-2.5">
                    <Switch
                      id="step-field-required"
                      checked={configuringStepSelectedField.required}
                      onCheckedChange={(checked) => {
                        if (configuringStepId) {
                          updateFieldInStep(configuringStepId, configuringStepSelectedField.id, { required: checked })
                          setConfiguringStepSelectedField({ ...configuringStepSelectedField, required: checked })
                        }
                      }}
                      className="h-4 w-7"
                    />
                    <Label htmlFor="step-field-required" className="cursor-pointer text-xs">Required field</Label>
                  </div>
                )}
                {(configuringStepSelectedField.type === 'select' || configuringStepSelectedField.type === 'radio') && (
                  <div className="space-y-1.5 mt-2.5">
                    <Label className="text-xs">Options</Label>
                    <div className="space-y-1.5">
                      {configuringStepSelectedField.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              if (configuringStepId) {
                                const newOptions = [...(configuringStepSelectedField.options || [])]
                                newOptions[index] = e.target.value
                                updateFieldInStep(configuringStepId, configuringStepSelectedField.id, { options: newOptions })
                                setConfiguringStepSelectedField({ ...configuringStepSelectedField, options: newOptions })
                              }
                            }}
                            placeholder={`Option ${index + 1}`}
                            className="h-8 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (configuringStepId) {
                                const newOptions = configuringStepSelectedField.options?.filter((_, i) => i !== index) || []
                                updateFieldInStep(configuringStepId, configuringStepSelectedField.id, { options: newOptions })
                                setConfiguringStepSelectedField({ ...configuringStepSelectedField, options: newOptions })
                              }
                            }}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (configuringStepId) {
                            const newOptions = [...(configuringStepSelectedField.options || []), `Option ${(configuringStepSelectedField.options?.length || 0) + 1}`]
                            updateFieldInStep(configuringStepId, configuringStepSelectedField.id, { options: newOptions })
                            setConfiguringStepSelectedField({ ...configuringStepSelectedField, options: newOptions })
                          }
                        }}
                        className="w-full h-8 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsStepConfigureDialogOpen(false)
              setConfiguringStepId(null)
              setConfiguringStepSelectedField(null)
            }}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => {
              if (configuringStepId && projectType) {
                const step = registrationSteps.find(s => s.id === configuringStepId)
                if (step) {
                  const updatedSteps = registrationSteps.map(s =>
                    s.id === configuringStepId ? step : s
                  )
                  const updatedType = {
                    ...projectType,
                    registrationSteps: updatedSteps,
                    updatedAt: new Date().toISOString()
                  }
                  saveProjectType(updatedType)
                  setProjectType(updatedType)
                  setIsStepConfigureDialogOpen(false)
                  setConfiguringStepId(null)
                  setConfiguringStepSelectedField(null)
                  setToastMessage('Step Configuration Saved Successfully!')
                  setShowSuccessToast(true)
                  setToastCountdown(10)
                  
                  // Highlight the saved step
                  setHighlightedStepId(configuringStepId)
                  setTimeout(() => {
                    const element = document.getElementById(`step-${configuringStepId}`)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                    setTimeout(() => {
                      setHighlightedStepId(null)
                    }, 2000)
                  }, 500)
                  
                  const timer = setInterval(() => {
                    setToastCountdown((prev) => {
                      if (prev <= 1) {
                        clearInterval(timer)
                        setShowSuccessToast(false)
                        return 0
                      }
                      return prev - 1
                    })
                  }, 1000)
                }
              }
            }}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Preview Modal */}
      <Dialog open={showStepPreviewModal} onOpenChange={setShowStepPreviewModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Form Preview - {configuringStepId ? registrationSteps.find(s => s.id === configuringStepId)?.name : ''}</DialogTitle>
            <DialogDescription>
              Preview how the form will look to users
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {configuringStepId && (() => {
              const step = registrationSteps.find(s => s.id === configuringStepId)
              if (!step || !step.fields || step.fields.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No form fields to preview</p>
                    <p className="text-sm">Add form fields to see the preview</p>
                  </div>
                )
              }
              
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>{step.name} Form</CardTitle>
                    <CardDescription>
                      Test the form fields below
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {step.fields.map((field) => {
                      const FieldIcon = fieldTypes.find(ft => ft.id === field.type)?.icon || Type
                      return (
                        <div key={field.id} className="space-y-2">
                          {field.type !== 'label' && (
                            <Label htmlFor={`step-preview-${field.id}`} className="flex items-center gap-2">
                              <FieldIcon className="h-4 w-4 text-muted-foreground" />
                              {field.label}
                              {field.required && (
                                <span className="text-destructive">*</span>
                              )}
                            </Label>
                          )}
                          {field.type === 'text' && (
                            <Input
                              id={`step-preview-${field.id}`}
                              placeholder={field.placeholder}
                              value={stepPreviewData[field.id] || ''}
                              onChange={(e) => setStepPreviewData({ ...stepPreviewData, [field.id]: e.target.value })}
                            />
                          )}
                          {field.type === 'email' && (
                            <Input
                              id={`step-preview-${field.id}`}
                              type="email"
                              placeholder={field.placeholder}
                              value={stepPreviewData[field.id] || ''}
                              onChange={(e) => setStepPreviewData({ ...stepPreviewData, [field.id]: e.target.value })}
                            />
                          )}
                          {field.type === 'number' && (
                            <Input
                              id={`step-preview-${field.id}`}
                              type="number"
                              placeholder={field.placeholder}
                              value={stepPreviewData[field.id] || ''}
                              onChange={(e) => setStepPreviewData({ ...stepPreviewData, [field.id]: e.target.value })}
                              min={field.validation?.min}
                              max={field.validation?.max}
                            />
                          )}
                          {field.type === 'date' && (
                            <Input
                              id={`step-preview-${field.id}`}
                              type="date"
                              value={stepPreviewData[field.id] || ''}
                              onChange={(e) => setStepPreviewData({ ...stepPreviewData, [field.id]: e.target.value })}
                            />
                          )}
                          {field.type === 'textarea' && (
                            <textarea
                              id={`step-preview-${field.id}`}
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder={field.placeholder}
                              value={stepPreviewData[field.id] || ''}
                              onChange={(e) => setStepPreviewData({ ...stepPreviewData, [field.id]: e.target.value })}
                            />
                          )}
                          {field.type === 'select' && (
                            <Select
                              value={stepPreviewData[field.id] || ''}
                              onValueChange={(value) => setStepPreviewData({ ...stepPreviewData, [field.id]: value })}
                            >
                              <SelectTrigger id={`step-preview-${field.id}`}>
                                <SelectValue placeholder={field.placeholder || 'Select an option'} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((option, index) => (
                                  <SelectItem key={index} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {field.type === 'radio' && (
                            <div className="space-y-2">
                              {field.options?.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id={`step-preview-${field.id}-${index}`}
                                    name={`step-preview-${field.id}`}
                                    value={option}
                                    checked={stepPreviewData[field.id] === option}
                                    onChange={(e) => setStepPreviewData({ ...stepPreviewData, [field.id]: e.target.value })}
                                    className="h-4 w-4 text-primary"
                                  />
                                  <Label htmlFor={`step-preview-${field.id}-${index}`} className="font-normal cursor-pointer">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                          {field.type === 'checkbox' && (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`step-preview-${field.id}`}
                                checked={stepPreviewData[field.id] || false}
                                onCheckedChange={(checked) => setStepPreviewData({ ...stepPreviewData, [field.id]: checked })}
                              />
                              <Label htmlFor={`step-preview-${field.id}`} className="font-normal cursor-pointer">
                                {field.placeholder || 'Check this option'}
                              </Label>
                            </div>
                          )}
                          {field.type === 'file' && (
                            <div className="space-y-2">
                              <Input
                                id={`step-preview-${field.id}`}
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    setStepPreviewData({ ...stepPreviewData, [field.id]: file.name })
                                  }
                                }}
                              />
                              {stepPreviewData[field.id] && (
                                <p className="text-xs text-muted-foreground">
                                  Selected: {stepPreviewData[field.id]}
                                </p>
                              )}
                            </div>
                          )}
                          {field.type === 'label' && (
                            <div className="py-2">
                              <p className="text-base font-medium text-foreground">{field.label}</p>
                            </div>
                          )}
                          {field.type === 'button' && (
                            <Button 
                              onClick={() => {
                                console.log('Form Data:', stepPreviewData)
                                setToastMessage('Form submitted! Check console for data.')
                                setShowSuccessToast(true)
                                setToastCountdown(5)
                              }}
                              className="w-full"
                            >
                              {field.label || 'Submit'}
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStepPreviewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Versions Modal */}
      <Dialog open={showStepVersionsModal} onOpenChange={setShowStepVersionsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Form Version History</DialogTitle>
            <DialogDescription>
              View and rollback to previous versions of {configuringStepId ? registrationSteps.find(s => s.id === configuringStepId)?.name : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {configuringStepId ? (
              (() => {
                const versions = getStepFormVersions(configuringStepId)
                return versions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <History className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No versions available</p>
                    <p className="text-sm">Publish a form to create the first version</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {versions.map((version) => (
                      <Card key={version.id} className={version.isActive ? 'border-primary bg-primary/5' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={version.isActive ? 'default' : 'secondary'}>
                                  Version {version.version} {version.isActive && '(Active)'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(version.publishedAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {version.formFields.length} field{version.formFields.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            {!version.isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setStepVersionToRollback(version)
                                }}
                                className="gap-2"
                              >
                                <RotateCcw className="h-4 w-4" />
                                Rollback
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              })()
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No step selected</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStepVersionsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Field Confirmation Dialog */}
      <Dialog open={!!fieldToDelete} onOpenChange={(open) => !open && setFieldToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{fieldToDelete?.label}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFieldToDelete(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteFieldConfirm}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Rollback Confirmation Dialog */}
      <Dialog open={!!stepVersionToRollback} onOpenChange={(open) => !open && setStepVersionToRollback(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Rollback to Version
            </DialogTitle>
            <DialogDescription className="mt-2">
              Are you sure you want to rollback to <strong>Version {stepVersionToRollback?.version}</strong>?
              <br />
              <span className="text-destructive font-medium">This will replace the current form fields with the version's fields.</span>
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStepVersionToRollback(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={() => {
                if (stepVersionToRollback) {
                  rollbackToStepVersion(stepVersionToRollback)
                  setStepVersionToRollback(null)
                }
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Rollback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Step Confirmation Dialog */}
      <Dialog open={!!stepToDelete} onOpenChange={(open) => !open && setStepToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Step
            </DialogTitle>
            <DialogDescription className="mt-2">
              Are you sure you want to delete the step <strong>"{stepToDelete?.name}"</strong>?
              <br />
              <span className="text-destructive font-medium">This will also remove all fields in this step.</span>
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStepToDelete(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (stepToDelete) {
                  deleteStep(stepToDelete.id)
                  setStepToDelete(null)
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        countdown={toastCountdown}
        message={toastMessage}
      />
    </div>
  )
}
