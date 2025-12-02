'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'

export default function FormBuilderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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
    // Redirect VIEWER users to summary, others to dashboard
    const redirectPath = user?.role === 'VIEWER' ? '/summary' : '/dashboard'
    router.push(redirectPath)
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Form Builder</h1>
        <p className="text-muted-foreground">
          Configure project types, stages, and build custom forms for your projects.
        </p>
      </div>
      
      {/* Form Builder content will be added here */}
    </div>
  )
}