'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown, GripVertical, Check, FileText, ShoppingCart, Wrench, CheckCircle, Package, Upload, Settings2, Type, Mail, Hash, Calendar, List, CheckSquare, Radio, Eye, EyeOff, Lock, Heading, Move, Send, RotateCcw, History, MousePointerClick } from 'lucide-react'
import { SuccessToast } from '@/components/success-toast'
import { cn } from '@/lib/utils'

interface ProjectStage {
  id: string
  name: string
  order: number
  formFields?: FormField[]
}

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

interface ProjectType {
  id: string
  name: string
  description?: string
  stages: ProjectStage[]
  createdAt: string
  updatedAt: string
}

interface FormVersion {
  id: string
  version: number
  stageId: string
  stageName: string
  formFields: FormField[]
  publishedAt: string
  publishedBy?: string
  isActive: boolean
}

// Default stages for different project types
const getDefaultStages = (typeName: string): ProjectStage[] => {
  if (typeName.toLowerCase().includes('infrastructure') || typeName.toLowerCase() === 'fmr') {
    return [
      { id: '1', name: 'Proposal', order: 1 },
      { id: '2', name: 'Procurement', order: 2 },
      { id: '3', name: 'Implementation', order: 3 },
      { id: '4', name: 'Completed', order: 4 },
      { id: '5', name: 'Inventory', order: 5 },
    ]
  } else if (typeName.toLowerCase().includes('machinery')) {
    return [
      { id: '1', name: 'Proposal', order: 1 },
      { id: '2', name: 'Procurement', order: 2 },
      { id: '3', name: 'For Delivery', order: 3 },
      { id: '4', name: 'Delivered', order: 4 },
      { id: '5', name: 'Inventory', order: 5 },
    ]
  } else {
    return [
      { id: '1', name: 'Draft', order: 1 },
      { id: '2', name: 'Proposal', order: 2 },
      { id: '3', name: 'Procurement', order: 3 },
      { id: '4', name: 'Implementation', order: 4 },
      { id: '5', name: 'Completed', order: 5 },
    ]
  }
}

export default function ConfigureProjectTypePage() {
  const router = useRouter()
  const params = useParams()
  const typeId = params.typeId as string

  // Prevent any redirects - this page should always be accessible
  // No authentication/role checks that would cause redirects to dashboard

  const [projectType, setProjectType] = useState<ProjectType | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<ProjectStage | null>(null)
  const [stageFormData, setStageFormData] = useState({ name: '' })
  const [isConfigureDialogOpen, setIsConfigureDialogOpen] = useState(false)
  const [configuringStage, setConfiguringStage] = useState<ProjectStage | null>(null)
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null)
  const [dragOverFieldIndex, setDragOverFieldIndex] = useState<number | null>(null)
  const [draggedFormFieldId, setDraggedFormFieldId] = useState<string | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState<{ id: string; label: string } | null>(null)
  const [previewData, setPreviewData] = useState<{ [key: string]: any }>({})
  const [showVersionsModal, setShowVersionsModal] = useState(false)

  const fieldTypes = [
    { id: 'text', label: 'Text Input', icon: Type, description: 'Single line text input' },
    { id: 'email', label: 'Email', icon: Mail, description: 'Email address input' },
    { id: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
    { id: 'date', label: 'Date Picker', icon: Calendar, description: 'Date selection' },
    { id: 'file', label: 'File Upload', icon: Upload, description: 'File upload field' },
    { id: 'select', label: 'Dropdown', icon: List, description: 'Select from options' },
    { id: 'textarea', label: 'Text Area', icon: FileText, description: 'Multi-line text input' },
    { id: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Checkbox input' },
    { id: 'radio', label: 'Radio Button', icon: Radio, description: 'Radio button group' },
    { id: 'label', label: 'Label', icon: Heading, description: 'Text label without input' },
    { id: 'button', label: 'Button', icon: MousePointerClick, description: 'Button for form submission' }
  ]
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastCountdown, setToastCountdown] = useState(10)
  const [toastMessage, setToastMessage] = useState('Stage Updated Successfully!')
  const [highlightedStageId, setHighlightedStageId] = useState<string | null>(null)
  const [draggedStageId, setDraggedStageId] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  const [previousOrder, setPreviousOrder] = useState<{ [key: string]: number }>({})

  // Load project types from localStorage or use default
  useEffect(() => {
    // In a real app, this would come from an API
    // For now, we'll use localStorage or default data
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
        { id: '1', name: 'FMR', description: 'Farm-to-Market Road', stages: getDefaultStages('FMR'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', name: 'Infrastructure', description: 'Infrastructure Projects', stages: getDefaultStages('Infrastructure'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '3', name: 'Machinery', description: 'Machinery and Equipment', stages: getDefaultStages('Machinery'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '4', name: 'Project Package', description: 'Project Package', stages: getDefaultStages('Project Package'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ]
      // Save defaults to localStorage for future use
      localStorage.setItem('projectTypes', JSON.stringify(types))
    }

    const foundType = types.find(t => t.id === typeId)
    if (foundType) {
      setProjectType(foundType)
    } else {
      // Type not found, create a default type to prevent redirect
      // This allows the page to remain accessible without redirecting to dashboard
      const defaultType: ProjectType = {
        id: typeId,
        name: `Project Type ${typeId}`,
        description: 'Default project type',
        stages: getDefaultStages('Default'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setProjectType(defaultType)
    }
  }, [typeId])

  // Save project types to localStorage
  const saveProjectTypes = (updatedType: ProjectType) => {
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
    if (!configuringStage || !projectType) return

    const versionsKey = `formVersions_${typeId}`
    const storedVersions = localStorage.getItem(versionsKey)
    let versions: FormVersion[] = []

    if (storedVersions) {
      try {
        versions = JSON.parse(storedVersions)
      } catch (e) {
        console.error('Error parsing form versions:', e)
      }
    }

    // Deactivate previous versions for this stage
    versions = versions.map(v => 
      v.stageId === configuringStage.id ? { ...v, isActive: false } : v
    )

    // Get the next version number for this stage
    const stageVersions = versions.filter(v => v.stageId === configuringStage.id)
    const nextVersion = stageVersions.length > 0 
      ? Math.max(...stageVersions.map(v => v.version)) + 1 
      : 1

    const newVersion: FormVersion = {
      id: `version-${Date.now()}`,
      version: nextVersion,
      stageId: configuringStage.id,
      stageName: configuringStage.name,
      formFields: [...(configuringStage.formFields || [])],
      publishedAt: new Date().toISOString(),
      isActive: true
    }

    versions.push(newVersion)
    localStorage.setItem(versionsKey, JSON.stringify(versions))

    // Update project type with published form
    const updatedStages = projectType.stages.map(s =>
      s.id === configuringStage.id
        ? { ...s, formFields: [...(configuringStage.formFields || [])] }
        : s
    )
    const updatedType = { ...projectType, stages: updatedStages, updatedAt: new Date().toISOString() }
    saveProjectTypes(updatedType)

    setToastMessage(`Form published as version ${nextVersion}!`)
    setShowSuccessToast(true)
    setToastCountdown(10)
  }

  const getFormVersions = (stageId: string): FormVersion[] => {
    const versionsKey = `formVersions_${typeId}`
    const storedVersions = localStorage.getItem(versionsKey)
    if (!storedVersions) return []

    try {
      const versions: FormVersion[] = JSON.parse(storedVersions)
      return versions.filter(v => v.stageId === stageId).sort((a, b) => b.version - a.version)
    } catch (e) {
      console.error('Error parsing form versions:', e)
      return []
    }
  }

  const rollbackToVersion = (version: FormVersion) => {
    if (!projectType || !configuringStage) return

    // Update the configuring stage with the version's form fields
    const updatedStage = { ...configuringStage, formFields: [...version.formFields] }
    setConfiguringStage(updatedStage)

    // Deactivate all versions for this stage
    const versionsKey = `formVersions_${typeId}`
    const storedVersions = localStorage.getItem(versionsKey)
    if (storedVersions) {
      try {
        let versions: FormVersion[] = JSON.parse(storedVersions)
        versions = versions.map(v => 
          v.stageId === version.stageId 
            ? { ...v, isActive: v.id === version.id }
            : v
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

  if (!projectType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project type...</p>
        </div>
      </div>
    )
  }

  const handleAddStage = () => {
    if (!isEditMode) return
    setEditingStage(null)
    setStageFormData({ name: '' })
    setIsStageDialogOpen(true)
  }

  const handleEditStage = (stage: ProjectStage) => {
    if (!isEditMode) return
    setEditingStage(stage)
    setStageFormData({ name: stage.name })
    setIsStageDialogOpen(true)
  }

  const handleConfigureStage = (stage: ProjectStage) => {
    if (!isEditMode) return
    setConfiguringStage({ ...stage, formFields: stage.formFields || [] })
    setIsConfigureDialogOpen(true)
    setSelectedField(null)
  }

  const addFormField = (fieldType: string) => {
    if (!configuringStage) return

    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType as FormField['type'],
      label: fieldType === 'label' ? 'New Label' : fieldType === 'button' ? 'Submit' : `New ${fieldType} Field`,
      placeholder: fieldType === 'label' || fieldType === 'button' ? undefined : `Enter ${fieldType}`,
      required: fieldType === 'label' || fieldType === 'button' ? false : false,
      options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1', 'Option 2'] : undefined
    }

    const updatedStage = {
      ...configuringStage,
      formFields: [...(configuringStage.formFields || []), newField]
    }
    setConfiguringStage(updatedStage)
    setSelectedField(newField)
  }

  const updateFormField = (fieldId: string, updates: Partial<FormField>) => {
    if (!configuringStage) return

    const updatedFields = (configuringStage.formFields || []).map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    )
    const updatedStage = { ...configuringStage, formFields: updatedFields }
    setConfiguringStage(updatedStage)
    
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const deleteFormField = (fieldId: string) => {
    if (!configuringStage) return

    const updatedFields = (configuringStage.formFields || []).filter(field => field.id !== fieldId)
    const updatedStage = { ...configuringStage, formFields: updatedFields }
    setConfiguringStage(updatedStage)
    
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
    setFieldToDelete(null)
  }

  const handleDeleteFieldClick = (fieldId: string, fieldLabel: string) => {
    setFieldToDelete({ id: fieldId, label: fieldLabel })
  }

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

  const handleFormFieldDragLeave = () => {
    setDragOverFieldIndex(null)
  }

  // Drag and drop handlers for reordering form fields
  const handleFormFieldItemDragStart = (e: React.DragEvent, fieldId: string) => {
    if (!isEditMode) {
      e.preventDefault()
      return
    }
    setDraggedFormFieldId(fieldId)
    e.dataTransfer.effectAllowed = 'move'
    // Make the dragged element semi-transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleFormFieldItemDragOver = (e: React.DragEvent, index: number) => {
    if (!isEditMode || !configuringStage || !draggedFormFieldId) return
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    
    const fields = configuringStage.formFields || []
    const dragIndex = fields.findIndex(f => f.id === draggedFormFieldId)
    
    // Don't highlight if dragging over itself
    if (dragIndex === index) {
      setDragOverFieldIndex(null)
      return
    }
    
    // Determine if we should insert above or below based on mouse position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const mouseY = e.clientY
    const elementMiddle = rect.top + rect.height / 2
    const insertAbove = mouseY < elementMiddle
    
    // Set the drop index - we'll use this to show the indicator
    setDragOverFieldIndex(index)
  }

  const handleFormFieldItemDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the form builder area entirely
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!relatedTarget || !(e.currentTarget as HTMLElement).contains(relatedTarget)) {
      // Don't clear here, let it handle in the drop zone
    }
  }

  const handleFormFieldItemDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!isEditMode || !configuringStage || !draggedFormFieldId) return
    
    e.preventDefault()
    e.stopPropagation()
    setDragOverFieldIndex(null)

    const fields = [...(configuringStage.formFields || [])]
    const dragIndex = fields.findIndex(f => f.id === draggedFormFieldId)
    
    if (dragIndex === -1 || dragIndex === dropIndex) {
      setDraggedFormFieldId(null)
      return
    }

    // Determine insertion position based on mouse position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const mouseY = e.clientY
    const elementMiddle = rect.top + rect.height / 2
    const insertAbove = mouseY < elementMiddle

    // Reorder fields
    const [draggedItem] = fields.splice(dragIndex, 1)
    
    // Calculate final drop position
    let finalDropIndex = dropIndex
    if (dragIndex < dropIndex && insertAbove) {
      finalDropIndex = dropIndex - 1
    } else if (dragIndex > dropIndex && !insertAbove) {
      finalDropIndex = dropIndex + 1
    } else if (dragIndex < dropIndex && !insertAbove) {
      finalDropIndex = dropIndex
    } else if (dragIndex > dropIndex && insertAbove) {
      finalDropIndex = dropIndex
    }
    
    // Ensure valid index
    finalDropIndex = Math.max(0, Math.min(finalDropIndex, fields.length))
    
    fields.splice(finalDropIndex, 0, draggedItem)

    const updatedStage = { ...configuringStage, formFields: fields }
    setConfiguringStage(updatedStage)
    setDraggedFormFieldId(null)
  }

  const handleFormFieldItemDragEnd = (e: React.DragEvent) => {
    // Reset opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
    }
    setDraggedFormFieldId(null)
    setDragOverFieldIndex(null)
  }

  const handleSaveStage = () => {
    if (!stageFormData.name.trim() || !projectType || !isEditMode) return

    let updatedType: ProjectType
    let savedStageId: string

    if (editingStage) {
      // Update existing stage
      const updatedStages = projectType.stages.map(s =>
        s.id === editingStage.id
          ? { ...s, name: stageFormData.name.trim() }
          : s
      )
      updatedType = { ...projectType, stages: updatedStages, updatedAt: new Date().toISOString() }
      savedStageId = editingStage.id
      setToastMessage('Stage Updated Successfully!')
    } else {
      // Add new stage
      const newStage: ProjectStage = {
        id: Date.now().toString(),
        name: stageFormData.name.trim(),
        order: projectType.stages.length + 1
      }
      updatedType = { ...projectType, stages: [...projectType.stages, newStage], updatedAt: new Date().toISOString() }
      savedStageId = newStage.id
      setToastMessage('Stage Added Successfully!')
    }

    saveProjectTypes(updatedType)

    setIsStageDialogOpen(false)
    setStageFormData({ name: '' })
    setEditingStage(null)

    // Show success toast
    setShowSuccessToast(true)
    setToastCountdown(10)

    // Highlight the newly added/updated stage
    setTimeout(() => {
      setHighlightedStageId(savedStageId)
      const element = document.getElementById(`stage-${savedStageId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setTimeout(() => {
        setHighlightedStageId(null)
      }, 2000)
    }, 500)

    // Auto-hide toast after 10 seconds
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

  const handleDeleteStage = (stageId: string) => {
    if (!projectType || !isEditMode) return
    if (confirm('Are you sure you want to delete this project stage?')) {
      const updatedStages = projectType.stages
        .filter(s => s.id !== stageId)
        .map((s, index) => ({ ...s, order: index + 1 }))
      const updatedType = { ...projectType, stages: updatedStages, updatedAt: new Date().toISOString() }
      saveProjectTypes(updatedType)
    }
  }

  const handleMoveStage = (stageId: string, direction: 'up' | 'down') => {
    if (!projectType || !isEditMode) return

    const stages = [...projectType.stages]
    const index = stages.findIndex(s => s.id === stageId)
    if (index === -1) return

    if (direction === 'up' && index > 0) {
      [stages[index - 1], stages[index]] = [stages[index], stages[index - 1]]
    } else if (direction === 'down' && index < stages.length - 1) {
      [stages[index], stages[index + 1]] = [stages[index + 1], stages[index]]
    }

    const reorderedStages = stages.map((s, i) => ({ ...s, order: i + 1 }))
    const updatedType = { ...projectType, stages: reorderedStages, updatedAt: new Date().toISOString() }
    saveProjectTypes(updatedType)
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, stageId: string) => {
    setDraggedStageId(stageId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', stageId)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)

    if (!projectType || !draggedStageId) return

    const stages = [...projectType.stages].sort((a, b) => a.order - b.order)
    const dragIndex = stages.findIndex(s => s.id === draggedStageId)

    if (dragIndex === -1 || dragIndex === dropIndex) {
      setDraggedStageId(null)
      return
    }

    // Store previous order for animation
    const oldOrder: { [key: string]: number } = {}
    stages.forEach((s, i) => {
      oldOrder[s.id] = i
    })
    setPreviousOrder(oldOrder)

    // Remove dragged item and insert at new position
    const [draggedItem] = stages.splice(dragIndex, 1)
    stages.splice(dropIndex, 0, draggedItem)

    // Update order numbers
    const reorderedStages = stages.map((s, i) => ({ ...s, order: i + 1 }))
    const updatedType = { ...projectType, stages: reorderedStages, updatedAt: new Date().toISOString() }
    
    // Trigger animation
    setIsReordering(true)
    saveProjectTypes(updatedType)
    setDraggedStageId(null)
    
    // Reset reordering animation after animation completes
    setTimeout(() => {
      setIsReordering(false)
      setPreviousOrder({})
    }, 800)
  }

  const handleDragEnd = () => {
    setDraggedStageId(null)
    setDragOverIndex(null)
  }

  // Get icon for stage name
  const getStageIcon = (stageName: string) => {
    const name = stageName.toLowerCase()
    if (name.includes('proposal')) return FileText
    if (name.includes('procurement')) return ShoppingCart
    if (name.includes('implementation')) return Wrench
    if (name.includes('completed')) return CheckCircle
    if (name.includes('inventory')) return Package
    if (name.includes('for delivery') || name.includes('for-delivery')) return Upload
    if (name.includes('delivered')) return CheckCircle
    if (name.includes('draft')) return FileText
    return FileText // Default icon
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/form-builder')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configure Project Stages</h1>
          <p className="text-muted-foreground">
            Manage project stages for <strong>{projectType.name}</strong>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{projectType.name}</CardTitle>
              {projectType.description && (
                <CardDescription className="mt-1">
                  {projectType.description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isEditMode ? (
                <Button
                  onClick={() => setIsEditMode(true)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMode(false)}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleAddStage} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Stage
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {projectType.stages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <GripVertical className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No stages configured</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click "Add Stage" to create your first project stage
              </p>
            </div>
          ) : (
            <>
              {/* Stepper Visualization */}
              <div className="pb-6 border-b">
                <Label className="text-sm font-medium mb-4 block">Stage Order Preview</Label>
                <div className="flex items-center justify-center px-4 relative" style={{ minHeight: '120px' }}>
                  {projectType.stages
                    .sort((a, b) => a.order - b.order)
                    .map((stage, newIndex) => {
                      const StageIcon = getStageIcon(stage.name)
                      const oldIndex = previousOrder[stage.id] !== undefined ? previousOrder[stage.id] : newIndex
                      const isSwapping = isReordering && oldIndex !== newIndex
                      
                      // Calculate positions - each step takes equal width
                      const totalSteps = projectType.stages.length
                      const stepWidth = 100 / totalSteps
                      const oldPosition = (oldIndex / totalSteps) * 100
                      const newPosition = (newIndex / totalSteps) * 100
                      
                      return (
                        <div 
                          key={stage.id} 
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
                            <StageIcon className="h-6 w-6" />
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
                              {stage.name}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  {/* Connector Lines - centered between icons */}
                  <div className="absolute inset-0 pointer-events-none" style={{ top: '48px', height: '2px' }}>
                    {projectType.stages
                      .sort((a, b) => a.order - b.order)
                      .slice(0, -1)
                      .map((stage, index) => {
                        const totalSteps = projectType.stages.length
                        // Icon centers: index 0 at (0.5/totalSteps)*100%, index 1 at (1.5/totalSteps)*100%, etc.
                        // Connector center should be at midpoint: ((index + 0.5) + (index + 1.5)) / 2 / totalSteps * 100%
                        // Simplified: (index + 1) / totalSteps * 100%
                        const connectorCenter = ((index + 1) / totalSteps) * 100
                        // Connector width - spans most of the gap between icons
                        const connectorWidth = (100 / totalSteps) * 0.6
                        
                        return (
                          <div
                            key={`connector-${stage.id}`}
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

              {/* Draggable Stages List */}
              <div>
                <Label className="text-sm font-medium mb-4 block">Drag to Reorder Stages</Label>
                <div className="space-y-2">
                  {projectType.stages
                    .sort((a, b) => a.order - b.order)
                    .map((stage, index) => (
                      <div
                        key={stage.id}
                        id={`stage-${stage.id}`}
                        draggable={isEditMode}
                        onDragStart={(e) => isEditMode && handleDragStart(e, stage.id)}
                        onDragOver={(e) => isEditMode && handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => isEditMode && handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ease-in-out cursor-move',
                          {
                            'ring-4 ring-green-500 ring-offset-2 shadow-lg scale-105 bg-green-50 border-green-500': highlightedStageId === stage.id,
                            'opacity-50 bg-muted': draggedStageId === stage.id,
                            'border-primary bg-primary/5 scale-[1.02]': dragOverIndex === index,
                            'bg-card hover:bg-muted/50 hover:shadow-md': !highlightedStageId && draggedStageId !== stage.id && dragOverIndex !== index,
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
                          {stage.order}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium">{stage.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveStage(stage.id, 'up')}
                            disabled={!isEditMode || index === 0}
                            className="h-8 w-8 p-0"
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveStage(stage.id, 'down')}
                            disabled={!isEditMode || index === projectType.stages.length - 1}
                            className="h-8 w-8 p-0"
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfigureStage(stage)}
                            disabled={!isEditMode}
                            className="h-8 w-8 p-0"
                            title="Configure stage"
                          >
                            <Settings2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStage(stage)}
                            disabled={!isEditMode}
                            className="h-8 w-8 p-0"
                            title="Edit stage"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStage(stage.id)}
                            disabled={!isEditMode}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            title="Delete stage"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Stage Management Dialog */}
      <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStage ? 'Edit Project Stage' : 'Add New Project Stage'}
            </DialogTitle>
            <DialogDescription>
              {editingStage
                ? 'Update the project stage name below.'
                : 'Create a new project stage for this project type.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stage-name">Stage Name *</Label>
              <Input
                id="stage-name"
                placeholder="e.g., Draft, Proposal, Implementation"
                value={stageFormData.name}
                onChange={(e) => setStageFormData({ name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsStageDialogOpen(false)
              setStageFormData({ name: '' })
              setEditingStage(null)
            }}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveStage} disabled={!stageFormData.name.trim() || !isEditMode}>
              <Save className="h-4 w-4 mr-2" />
              {editingStage ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stage Configuration Dialog - Full Screen Form Builder */}
      <Dialog open={isConfigureDialogOpen} onOpenChange={setIsConfigureDialogOpen}>
        <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  {projectType?.name} &gt; Configure Stage &gt; {configuringStage?.name}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Build the form for this stage by dragging form elements from the right panel.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const versions = getFormVersions(configuringStage?.id || '')
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
                  onClick={() => setShowPreviewModal(true)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Show Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={publishForm}
                  disabled={!isEditMode || !configuringStage?.formFields || configuringStage.formFields.length === 0}
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
                <Label className="text-sm font-medium">Stage Form Builder</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag form elements here or click to add them
                </p>
              </div>
              <div 
                className="flex-1 overflow-y-auto p-6"
                onDragOver={handleFormFieldDragOver}
                onDrop={handleFormFieldDrop}
                onDragLeave={handleFormFieldDragLeave}
              >
                {(!configuringStage?.formFields || configuringStage.formFields.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg">
                    <Type className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No form fields added yet</p>
                    <p className="text-sm text-center max-w-md">
                      Drag form elements from the right panel or click the + button to add fields
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    {configuringStage.formFields.map((field, index) => {
                      const FieldIcon = fieldTypes.find(ft => ft.id === field.type)?.icon || Type
                      const isDragged = draggedFormFieldId === field.id
                      const isDropTarget = dragOverFieldIndex === index && !isDragged && draggedFormFieldId
                      const fields = configuringStage.formFields || []
                      const dragIndex = draggedFormFieldId ? fields.findIndex(f => f.id === draggedFormFieldId) : -1
                      // Show indicator above if dragging from below, or show below if dragging from above
                      const showDropIndicatorAbove = isDropTarget && dragIndex > index
                      const showDropIndicatorBelow = isDropTarget && dragIndex < index
                      
                      return (
                        <div key={field.id} className="relative">
                          {/* Drop indicator above */}
                          {showDropIndicatorAbove && (
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
                      onChange={(e) => updateFormField(selectedField.id, { label: e.target.value })}
                      placeholder="Enter field label"
                      className="h-8 text-sm"
                    />
                  </div>
                  {selectedField.type !== 'label' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="field-placeholder" className="text-xs">Placeholder</Label>
                      <Input
                        id="field-placeholder"
                        value={selectedField.placeholder || ''}
                        onChange={(e) => updateFormField(selectedField.id, { placeholder: e.target.value })}
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
                      onCheckedChange={(checked) => updateFormField(selectedField.id, { required: checked })}
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
                              updateFormField(selectedField.id, { options: newOptions })
                            }}
                            placeholder={`Option ${index + 1}`}
                            className="h-8 text-sm"
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
              setConfiguringStage(null)
              setSelectedField(null)
            }}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => {
              if (configuringStage && projectType && isEditMode) {
                const updatedStages = projectType.stages.map(s =>
                  s.id === configuringStage.id
                    ? { ...s, formFields: configuringStage.formFields }
                    : s
                )
                const updatedType = { ...projectType, stages: updatedStages, updatedAt: new Date().toISOString() }
                saveProjectTypes(updatedType)
                setProjectType(updatedType)
                setIsConfigureDialogOpen(false)
                setConfiguringStage(null)
                setSelectedField(null)
                setToastMessage('Stage Configuration Saved Successfully!')
                setShowSuccessToast(true)
                setToastCountdown(10)
                
                // Highlight the updated stage after toast
                setTimeout(() => {
                  setHighlightedStageId(configuringStage.id)
                  const element = document.getElementById(`stage-${configuringStage.id}`)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                  setTimeout(() => {
                    setHighlightedStageId(null)
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
            }} disabled={!isEditMode}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Form Preview - {configuringStage?.name}</DialogTitle>
            <DialogDescription>
              Preview how the form will look to users
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {(!configuringStage?.formFields || configuringStage.formFields.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <FileText className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No form fields to preview</p>
                <p className="text-sm">Add form fields to see the preview</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{configuringStage.name} Form</CardTitle>
                  <CardDescription>
                    Test the form fields below
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {configuringStage.formFields.map((field) => {
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
                  })}
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
              Close
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
              View and rollback to previous versions of {configuringStage?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {configuringStage ? (
              (() => {
                const versions = getFormVersions(configuringStage.id)
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
              })()
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No stage selected</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionsModal(false)}>
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
              onClick={() => fieldToDelete && deleteFormField(fieldToDelete.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
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
