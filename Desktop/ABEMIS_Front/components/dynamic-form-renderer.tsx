'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FormField, FormConfig } from '@/lib/types'

interface DynamicFormRendererProps {
  formConfig: FormConfig
  onSubmit?: (data: Record<string, any>) => void
  onCancel?: () => void
  submitButtonText?: string
  cancelButtonText?: string
  showCancelButton?: boolean
}

export function DynamicFormRenderer({ 
  formConfig, 
  onSubmit, 
  onCancel,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  showCancelButton = true
}: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    formConfig.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.id]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.id] = `${field.label} is required`
        }
      }
      
      // Additional validation for number fields
      if (field.type === 'number' && formData[field.id]) {
        const numValue = Number(formData[field.id])
        if (field.validation?.min !== undefined && numValue < field.validation.min) {
          newErrors[field.id] = `${field.label} must be at least ${field.validation.min}`
        }
        if (field.validation?.max !== undefined && numValue > field.validation.max) {
          newErrors[field.id] = `${field.label} must be at most ${field.validation.max}`
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit?.(formData)
    }
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
      required: field.required,
      value: formData[field.id] || '',
      onChange: (value: any) => handleInputChange(field.id, value)
    }

    const hasError = !!errors[field.id]

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type={field.type}
              min={field.validation?.min}
              max={field.validation?.max}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="date"
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              rows={4}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select onValueChange={(value) => handleInputChange(field.id, value)}>
              <SelectTrigger className={hasError ? 'border-destructive' : ''}>
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
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={formData[field.id] || false}
                onCheckedChange={(checked) => handleInputChange(field.id, checked)}
              />
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            </div>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}-${index}`}
                    name={field.id}
                    value={option}
                    checked={formData[field.id] === option}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
          </div>
        )

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                handleInputChange(field.id, file)
              }}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formConfig.title}</CardTitle>
        {formConfig.description && (
          <CardDescription>{formConfig.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formConfig.fields.map(renderField)}
          
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              {formConfig.fields.filter(f => f.required).length} required field(s)
            </div>
            <div className="flex space-x-2">
              {showCancelButton && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  {cancelButtonText}
                </Button>
              )}
              <Button type="submit">
                {submitButtonText}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
