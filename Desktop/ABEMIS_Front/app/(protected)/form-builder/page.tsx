'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { 
  Building2, 
  Truck, 
  Package, 
  Wrench, 
  Settings, 
  Users, 
  Cog,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'

const formCategories = [
  {
    id: 'project-configuration',
    title: 'Project Configuration',
    description: 'Manage project types, stages, and registration forms',
    icon: Building2,
    color: 'bg-blue-500',
    subcategories: [
      {
        id: 'project-types',
        title: 'Project Types',
        description: 'Add, edit, or remove project types (Infrastructure, Machinery, FMR, etc.)',
        icon: Package,
        color: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'project-stages',
        title: 'Project Stages',
        description: 'Configure stages and workflow for each project type',
        icon: Wrench,
        color: 'bg-green-100 text-green-700'
      },
      {
        id: 'registration-forms',
        title: 'Registration Forms',
        description: 'Customize registration forms for each project type',
        icon: Edit,
        color: 'bg-purple-100 text-purple-700'
      },
      {
        id: 'required-documents',
        title: 'Required Documents',
        description: 'Configure necessary documents for each project stage',
        icon: Package,
        color: 'bg-orange-100 text-orange-700'
      }
    ]
  },
  {
    id: 'user-configuration',
    title: 'User Configuration',
    description: 'Manage user roles, permissions, and access control',
    icon: Users,
    color: 'bg-green-500',
    subcategories: [
      {
        id: 'user-roles',
        title: 'User Roles',
        description: 'Create and manage user roles (Admin, Manager, Engineer, etc.)',
        icon: Users,
        color: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'permissions',
        title: 'Permissions',
        description: 'Configure permissions for each role and feature',
        icon: Settings,
        color: 'bg-red-100 text-red-700'
      },
      {
        id: 'access-control',
        title: 'Access Control',
        description: 'Set up access rules and restrictions',
        icon: Cog,
        color: 'bg-yellow-100 text-yellow-700'
      }
    ]
  },
  {
    id: 'system-configuration',
    title: 'System Configuration',
    description: 'Configure system-wide settings and notifications',
    icon: Cog,
    color: 'bg-purple-500',
    subcategories: [
      {
        id: 'notifications',
        title: 'Notifications',
        description: 'Configure notification settings and templates',
        icon: Settings,
        color: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'announcements',
        title: 'Announcements',
        description: 'Manage system announcements and popups',
        icon: Edit,
        color: 'bg-green-100 text-green-700'
      },
      {
        id: 'system-settings',
        title: 'System Settings',
        description: 'Configure general system preferences',
        icon: Cog,
        color: 'bg-gray-100 text-gray-700'
      }
    ]
  }
]

export default function FormBuilderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    router.push('/dashboard')
    return null
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory(null)
  }

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)
    // Navigate to the specific configuration page
    router.push(`/form-builder/${selectedCategory}/${subcategoryId}`)
  }

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null)
    } else if (selectedCategory) {
      setSelectedCategory(null)
    }
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Form Builder', href: '/form-builder' }
    ]
    
    if (selectedCategory) {
      const category = formCategories.find(c => c.id === selectedCategory)
      if (category) {
        breadcrumbs.push({ label: category.title, href: null })
      }
    }
    
    if (selectedSubcategory && selectedCategory) {
      const category = formCategories.find(c => c.id === selectedCategory)
      const subcategory = category?.subcategories.find(s => s.id === selectedSubcategory)
      if (subcategory) {
        breadcrumbs.push({ label: subcategory.title, href: null })
      }
    }
    
    return breadcrumbs
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Form Builder</h1>
        <p className="text-muted-foreground">
          Configure and customize system settings, project types, and user management.
        </p>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={getBreadcrumbs()} />

      {/* Main Content */}
      {!selectedCategory ? (
        // Category Selection
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group">
                    <span>Configure</span>
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : !selectedSubcategory ? (
        // Subcategory Selection
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              ← Back to Categories
            </Button>
            <Badge variant="secondary" className="text-sm">
              {formCategories.find(c => c.id === selectedCategory)?.title}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formCategories
              .find(c => c.id === selectedCategory)
              ?.subcategories.map((subcategory) => {
                const Icon = subcategory.icon
                return (
                  <Card 
                    key={subcategory.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => handleSubcategorySelect(subcategory.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${subcategory.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{subcategory.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {subcategory.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      ) : (
        // Subcategory Details (This would be handled by the dynamic route)
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              ← Back to Subcategories
            </Button>
            <Badge variant="secondary" className="text-sm">
              {formCategories
                .find(c => c.id === selectedCategory)
                ?.subcategories.find(s => s.id === selectedSubcategory)?.title}
            </Badge>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuration Panel</CardTitle>
              <CardDescription>
                This area will be handled by the dynamic route component.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Redirecting to configuration page...
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
