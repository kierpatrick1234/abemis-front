'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'

export default function FormBuilderDetailPage() {
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
    router.push('/dashboard')
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Form Builder Detail</h1>
        <p className="text-muted-foreground">
          Form builder detail content will be added here.
        </p>
      </div>
      
      {/* Empty content area for future development */}
      <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Form Builder Detail Content</p>
          <p className="text-gray-400 text-sm">Content will be added here</p>
        </div>
      </div>
    </div>
  )
}