'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Type, 
  Mail, 
  Hash, 
  Calendar, 
  Upload, 
  List, 
  FileText, 
  CheckSquare, 
  Radio,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react'
import { FormField, FormConfig } from '@/lib/types'

interface FormBuilderInterfaceProps {
  formConfig: FormConfig
  onFormConfigChange: (config: FormConfig) => void
}

const fieldTypes = [
  { id: 'text', label: 'Text Input', icon: Type, description: 'Single line text input' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Email address input' },
  { id: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
  { id: 'date', label: 'Date Picker', icon: Calendar, description: 'Date selection' },
  { id: 'file', label: 'File Upload', icon: Upload, description: 'File upload field' },
  { id: 'select', label: 'Dropdown', icon: List, description: 'Select from options' },
  { id: 'textarea', label: 'Text Area', icon: FileText, description: 'Multi-line text input' },
  { id: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Checkbox input' },
  { id: 'radio', label: 'Radio Button', icon: Radio, description: 'Radio button group' }
]

export function FormBuilderInterface({ formConfig, onFormConfigChange }: FormBuilderInterfaceProps) {
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [draggedField, setDraggedField] = useState<string | null>(null)

  const addField = (fieldType: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType as FormField['type'],
      label: `New ${fieldType} Field`,
      placeholder: `Enter ${fieldType}`,
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1', 'Option 2'] : undefined
    }

    const updatedConfig = {
      ...formConfig,
      fields: [...formConfig.fields, newField]
    }
    onFormConfigChange(updatedConfig)
    setSelectedField(newField)
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = formConfig.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    )
    onFormConfigChange({ ...formConfig, fields: updatedFields })
    
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const deleteField = (fieldId: string) => {
    const updatedFields = formConfig.fields.filter(field => field.id !== fieldId)
    onFormConfigChange({ ...formConfig, fields: updatedFields })
    
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    const updatedFields = [...formConfig.fields]
    const [movedField] = updatedFields.splice(fromIndex, 1)
    updatedFields.splice(toIndex, 0, movedField)
    onFormConfigChange({ ...formConfig, fields: updatedFields })
  }

  const handleDragStart = (e: React.DragEvent, fieldType: string) => {
    setDraggedField(fieldType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedField) {
      addField(draggedField)
      setDraggedField(null)
    }
  }

  const renderFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.id === type)
    if (!fieldType) return <Type className="h-4 w-4" />
    const Icon = fieldType.icon
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Field Palette */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Form Elements</CardTitle>
            <CardDescription>
              Drag elements to the form area or click to add them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {fieldTypes.map((fieldType) => {
              const Icon = fieldType.icon
              return (
                <div
                  key={fieldType.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, fieldType.id)}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-move hover:bg-accent transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{fieldType.label}</div>
                    <div className="text-xs text-muted-foreground">{fieldType.description}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addField(fieldType.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Form Builder Area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Form Builder</CardTitle>
            <CardDescription>
              Build your form by adding and configuring fields
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="min-h-[400px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 space-y-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {formConfig.fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Type className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">No fields added yet</p>
                  <p className="text-sm">Drag elements from the left panel or click the + button to add fields</p>
                </div>
              ) : (
                formConfig.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedField?.id === field.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        {renderFieldIcon(field.type)}
                        <div>
                          <div className="font-medium">{field.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {field.type} {field.required && <Badge variant="secondary" className="ml-2">Required</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteField(field.id)
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Configuration Panel */}
      {selectedField && (
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Field Configuration</CardTitle>
              <CardDescription>
                Configure the selected field properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field-label">Field Label</Label>
                  <Input
                    id="field-label"
                    value={selectedField.label}
                    onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                    placeholder="Enter field label"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                    placeholder="Enter placeholder text"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="field-required"
                  checked={selectedField.required}
                  onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
                />
                <Label htmlFor="field-required">Required field</Label>
              </div>

              {(selectedField.type === 'select' || selectedField.type === 'radio') && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {selectedField.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(selectedField.options || [])]
                            newOptions[index] = e.target.value
                            updateField(selectedField.id, { options: newOptions })
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newOptions = selectedField.options?.filter((_, i) => i !== index) || []
                            updateField(selectedField.id, { options: newOptions })
                          }}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`]
                        updateField(selectedField.id, { options: newOptions })
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              {(selectedField.type === 'number') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="field-min">Minimum Value</Label>
                    <Input
                      id="field-min"
                      type="number"
                      value={selectedField.validation?.min || ''}
                      onChange={(e) => updateField(selectedField.id, { 
                        validation: { 
                          ...selectedField.validation, 
                          min: e.target.value ? Number(e.target.value) : undefined 
                        } 
                      })}
                      placeholder="Enter minimum value"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field-max">Maximum Value</Label>
                    <Input
                      id="field-max"
                      type="number"
                      value={selectedField.validation?.max || ''}
                      onChange={(e) => updateField(selectedField.id, { 
                        validation: { 
                          ...selectedField.validation, 
                          max: e.target.value ? Number(e.target.value) : undefined 
                        } 
                      })}
                      placeholder="Enter maximum value"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
