'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DynamicFormRenderer } from '@/components/dynamic-form-renderer'
import { FormConfig } from '@/lib/types'
import { Building2, Settings, Eye } from 'lucide-react'

interface InfrastructureFormIntegrationProps {
  onFormSubmit?: (data: Record<string, any>) => void
  onFormCancel?: () => void
  formType?: 'infra-registration' | 'infra-stages'
}

export function InfrastructureFormIntegration({ 
  onFormSubmit, 
  onFormCancel,
  formType = 'infra-registration'
}: InfrastructureFormIntegrationProps) {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load form configuration from localStorage or API
    const loadFormConfig = () => {
      try {
        const savedConfig = localStorage.getItem(`form-config-infrastructure-${formType}`)
        if (savedConfig) {
          setFormConfig(JSON.parse(savedConfig))
        } else {
          // Use default configuration if no saved config exists
          setFormConfig(getDefaultFormConfig(formType))
        }
      } catch (err) {
        setError('Failed to load form configuration')
        console.error('Error loading form config:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFormConfig()
  }, [formType])

  const getDefaultFormConfig = (type: string): FormConfig => {
    const baseConfig: FormConfig = {
      id: `infrastructure-${type}`,
      title: type === 'infra-registration' ? 'Infrastructure Registration Form' : 'Infrastructure Project Stages',
      description: type === 'infra-registration' 
        ? 'Register a new infrastructure project' 
        : 'Configure infrastructure project stages and workflow',
      fields: []
    }

    if (type === 'infra-registration') {
      baseConfig.fields = [
        {
          id: 'project-title',
          type: 'text',
          label: 'Project Title',
          placeholder: 'Enter project title',
          required: true
        },
        {
          id: 'project-description',
          type: 'textarea',
          label: 'Project Description',
          placeholder: 'Enter project description',
          required: true
        },
        {
          id: 'project-classification',
          type: 'select',
          label: 'Project Classification',
          placeholder: 'Select classification',
          required: true,
          options: [
            'Commodity Transport Infrastructure',
            'Irrigation Facilities',
            'Production Facilities (Crops)',
            'Production Facilities (Livestock)',
            'Post-harvest and Production Facilities (Fisheries)'
          ]
        },
        {
          id: 'project-type',
          type: 'select',
          label: 'Project Type',
          placeholder: 'Select project type',
          required: true,
          options: [
            'Road Construction',
            'Bridge Construction',
            'Irrigation System',
            'Warehouse Construction',
            'Processing Facility',
            'Storage Facility'
          ]
        },
        {
          id: 'budget',
          type: 'number',
          label: 'Budget',
          placeholder: 'Enter budget amount',
          required: true,
          validation: {
            min: 0
          }
        },
        {
          id: 'start-date',
          type: 'date',
          label: 'Start Date',
          required: true
        },
        {
          id: 'implementation-days',
          type: 'number',
          label: 'Implementation Days',
          placeholder: 'Enter number of days',
          required: true,
          validation: {
            min: 1
          }
        }
      ]
    } else if (type === 'infra-stages') {
      baseConfig.fields = [
        {
          id: 'stage-name',
          type: 'text',
          label: 'Stage Name',
          placeholder: 'Enter stage name',
          required: true
        },
        {
          id: 'stage-description',
          type: 'textarea',
          label: 'Stage Description',
          placeholder: 'Enter stage description',
          required: true
        },
        {
          id: 'stage-duration',
          type: 'number',
          label: 'Duration (Days)',
          placeholder: 'Enter duration in days',
          required: true,
          validation: {
            min: 1
          }
        },
        {
          id: 'required-documents',
          type: 'file',
          label: 'Required Documents',
          required: false
        },
        {
          id: 'approval-required',
          type: 'checkbox',
          label: 'Approval Required',
          required: false
        }
      ]
    }

    return baseConfig
  }

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('Infrastructure form submitted:', data)
    onFormSubmit?.(data)
  }

  const handleFormCancel = () => {
    onFormCancel?.()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!formConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Form Configuration</CardTitle>
          <CardDescription>
            No form configuration found. Please configure the form in the Form Builder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.open('/form-builder', '_blank')}>
            <Settings className="h-4 w-4 mr-2" />
            Open Form Builder
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>{formConfig.title}</CardTitle>
                <CardDescription>{formConfig.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {formConfig.fields.length} fields
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/form-builder', '_blank')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Form
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DynamicFormRenderer
            formConfig={formConfig}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            submitButtonText="Submit Project"
            cancelButtonText="Cancel"
            showCancelButton={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}
