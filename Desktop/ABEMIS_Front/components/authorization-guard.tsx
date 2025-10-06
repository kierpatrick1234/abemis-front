'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { Role } from '@/lib/types'
import { Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface AuthorizationGuardProps {
  children: React.ReactNode
  allowedRoles: Role[]
  fallback?: React.ReactNode
}

export function AuthorizationGuard({ 
  children, 
  allowedRoles, 
  fallback 
}: AuthorizationGuardProps) {
  const { user } = useAuth()
  const router = useRouter()

  // Check if user has required role
  const hasPermission = user && allowedRoles.includes(user.role)

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-lg text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Unauthorized Access</span>
            </div>
            <p className="text-red-700 text-sm mt-2">
              This page is restricted to users with the following roles: <strong>{allowedRoles.join(', ')}</strong>
            </p>
            <p className="text-red-700 text-sm">
              Your current role: <strong>{user?.role || 'Unknown'}</strong>
            </p>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
            >
              Go Back
            </Button>
            <Button 
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Convenience component for superadmin-only pages
export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthorizationGuard allowedRoles={['superadmin']}>
      {children}
    </AuthorizationGuard>
  )
}
