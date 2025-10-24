'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Truck, Package, Wrench } from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'

const formTypes = [
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    description: 'Build and customize infrastructure project forms',
    icon: Building2,
    color: 'bg-blue-500',
    options: [
      { id: 'infra-registration', title: 'Infra Registration Form', description: 'Customize the infrastructure registration form' },
      { id: 'infra-stages', title: 'Infra Stages', description: 'Configure infrastructure project stages and workflow' }
    ]
  },
  {
    id: 'machinery',
    title: 'Machinery',
    description: 'Build and customize machinery project forms',
    icon: Truck,
    color: 'bg-green-500',
    options: [
      { id: 'machinery-registration', title: 'Machinery Registration Form', description: 'Customize the machinery registration form' },
      { id: 'machinery-stages', title: 'Machinery Stages', description: 'Configure machinery project stages and workflow' }
    ]
  },
  {
    id: 'fmr',
    title: 'FMR',
    description: 'Build and customize FMR project forms',
    icon: Wrench,
    color: 'bg-orange-500',
    options: [
      { id: 'fmr-registration', title: 'FMR Registration Form', description: 'Customize the FMR registration form' },
      { id: 'fmr-stages', title: 'FMR Stages', description: 'Configure FMR project stages and workflow' }
    ]
  },
  {
    id: 'package-project',
    title: 'Package Project',
    description: 'Build and customize package project forms',
    icon: Package,
    color: 'bg-purple-500',
    options: [
      { id: 'package-registration', title: 'Package Registration Form', description: 'Customize the package project registration form' },
      { id: 'package-stages', title: 'Package Stages', description: 'Configure package project stages and workflow' }
    ]
  }
]

export default function FormBuilderPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null)

  // Redirect if user doesn't have form builder access
  const allowedRoles = ['admin', 'manager', 'engineer']
  if (!user || !allowedRoles.includes(user.role)) {
    router.push('/dashboard')
    return null
  }

  const handleFormTypeSelect = (formType: string) => {
    setSelectedFormType(formType)
  }

  const handleOptionSelect = (formType: string, optionId: string) => {
    // Navigate to the specific form builder
    router.push(`/form-builder/${formType}/${optionId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Form Builder</h1>
        <p className="text-muted-foreground">
          Create and customize forms for different project types. Select a project type to get started.
        </p>
      </div>

      {!selectedFormType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formTypes.map((formType) => {
            const Icon = formType.icon
            return (
              <Card 
                key={formType.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleFormTypeSelect(formType.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${formType.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{formType.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {formType.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Select Form Type
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedFormType(null)}
              className="flex items-center space-x-2"
            >
              ← Back to Form Types
            </Button>
            <Badge variant="secondary" className="text-sm">
              {formTypes.find(ft => ft.id === selectedFormType)?.title}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formTypes
              .find(ft => ft.id === selectedFormType)
              ?.options.map((option) => (
                <Card 
                  key={option.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleOptionSelect(selectedFormType, option.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Configure Form
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
