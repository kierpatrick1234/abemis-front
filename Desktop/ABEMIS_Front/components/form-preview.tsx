'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DynamicFormRenderer } from '@/components/dynamic-form-renderer'
import { FormConfig } from '@/lib/types'

interface FormPreviewProps {
  formConfig: FormConfig
}

export function FormPreview({ formConfig }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleSubmit = (data: Record<string, any>) => {
    setFormData(data)
    console.log('Form submitted with data:', data)
    // Here you would typically submit the form data to your backend
  }

  return (
    <div className="max-w-2xl mx-auto">
      <DynamicFormRenderer
        formConfig={formConfig}
        onSubmit={handleSubmit}
        submitButtonText="Submit Form"
        cancelButtonText="Cancel"
        showCancelButton={true}
      />

      {/* Form Data Preview */}
      {Object.keys(formData).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Form Data Preview</CardTitle>
            <CardDescription>
              This shows the data that would be submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
