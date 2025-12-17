'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if we're on an allowed route - never redirect from these routes
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const isAllowedRoute = currentPath.includes('/form-builder/projects/configure') || 
                          currentPath.includes('/form-builder/projects/registration')
    
    // Never redirect if we're on an allowed route
    if (isAllowedRoute) {
      return
    }
    
    // Add a small delay to ensure the auth context is properly initialized
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          // Redirect VIEWER users to summary page
          if (user.role === 'VIEWER') {
            router.push('/summary')
          } else {
            router.push('/dashboard')
          }
        } else {
          router.push('/landing')
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, loading, router])

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

  // Fallback content in case of any issues
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
