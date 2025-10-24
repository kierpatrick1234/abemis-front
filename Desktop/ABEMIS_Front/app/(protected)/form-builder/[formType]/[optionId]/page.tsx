'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Eye, Save, Plus } from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'
import { FormBuilderInterface } from '@/components/form-builder-interface'
import { FormPreview } from '@/components/form-preview'

interface FormField {
  id: string
  type: 'text' | 'email' | 'number' | 'date' | 'file' | 'select' | 'textarea' | 'checkbox' | 'radio'
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

interface FormConfig {
  id: string
  title: string
  description: string
  fields: FormField[]
}

export default function FormBuilderDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { formType, optionId } = params

  const [formConfig, setFormConfig] = useState<FormConfig>({
    id: `${formType}-${optionId}`,
    title: '',
    description: '',
    fields: []
  })
  const [activeTab, setActiveTab] = useState('builder')
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Redirect if user doesn't have form builder access
  const allowedRoles = ['admin', 'manager', 'engineer']
  if (!user || !allowedRoles.includes(user.role)) {
    router.push('/dashboard')
    return null
  }

  useEffect(() => {
    // Load existing form configuration if available
    const savedConfig = localStorage.getItem(`form-config-${formType}-${optionId}`)
    if (savedConfig) {
      setFormConfig(JSON.parse(savedConfig))
    } else {
      // Initialize with default configuration
      setFormConfig({
        id: `${formType}-${optionId}`,
        title: getDefaultTitle(formType as string, optionId as string),
        description: getDefaultDescription(formType as string, optionId as string),
        fields: getDefaultFields(formType as string, optionId as string)
      })
    }
  }, [formType, optionId])

  const getDefaultTitle = (formType: string, optionId: string) => {
    const typeMap: Record<string, Record<string, string>> = {
      infrastructure: {
        'infra-registration': 'Infrastructure Registration Form',
        'infra-stages': 'Infrastructure Project Stages'
      },
      machinery: {
        'machinery-registration': 'Machinery Registration Form',
        'machinery-stages': 'Machinery Project Stages'
      },
      fmr: {
        'fmr-registration': 'FMR Registration Form',
        'fmr-stages': 'FMR Project Stages'
      },
      'package-project': {
        'package-registration': 'Package Project Registration Form',
        'package-stages': 'Package Project Stages'
      }
    }
    return typeMap[formType]?.[optionId] || 'Custom Form'
  }

  const getDefaultDescription = (formType: string, optionId: string) => {
    return `Configure the form fields and validation rules for ${getDefaultTitle(formType, optionId).toLowerCase()}`
  }

  const getDefaultFields = (formType: string, optionId: string): FormField[] => {
    // Return default fields based on form type and option
    const commonFields: FormField[] = [
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
      }
    ]

    if (optionId?.includes('stages')) {
      return [
        ...commonFields,
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
          id: 'stage-documents',
          type: 'file',
          label: 'Required Documents',
          required: false
        }
      ]
    }

    return commonFields
  }

  const handleFormConfigChange = (newConfig: FormConfig) => {
    setFormConfig(newConfig)
    // Auto-save to localStorage
    localStorage.setItem(`form-config-${formType}-${optionId}`, JSON.stringify(newConfig))
  }

  const handleSave = () => {
    // Save form configuration
    localStorage.setItem(`form-config-${formType}-${optionId}`, JSON.stringify(formConfig))
    // Here you would typically save to a backend API
    console.log('Form configuration saved:', formConfig)
  }

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode)
    setActiveTab(isPreviewMode ? 'builder' : 'preview')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/form-builder')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form Builder
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{formConfig.title}</h1>
            <p className="text-muted-foreground">{formConfig.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {formType} - {optionId}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Form Configuration</CardTitle>
                  <CardDescription>
                    Drag and drop form elements to build your form. Click on elements to configure them.
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FormBuilderInterface
                formConfig={formConfig}
                onFormConfigChange={handleFormConfigChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Form Preview</CardTitle>
                  <CardDescription>
                    This is how your form will appear to users.
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handlePreview}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Builder
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <FormPreview formConfig={formConfig} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
