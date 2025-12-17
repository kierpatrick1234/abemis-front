'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { Topbar } from '@/components/topbar'
import { AnnouncementPopup } from '@/components/announcement-popup'
import { useAuth } from '@/lib/contexts/auth-context'
import { EvaluationProvider } from '@/lib/contexts/evaluation-context'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [isInIframe, setIsInIframe] = useState(false)

  // CRITICAL: Check for allowed routes - must be computed on every render
  // Use both pathname and window.location for Vercel compatibility
  // This ensures the check is always accurate even when pathname updates
  const isAllowedRoute = typeof window !== 'undefined' && (
    (pathname?.includes('/form-builder/projects/configure') || 
     pathname?.includes('/form-builder/projects/registration')) ||
    (window.location.pathname.includes('/form-builder/projects/configure') || 
     window.location.pathname.includes('/form-builder/projects/registration'))
  )

  useEffect(() => {
    // NEVER redirect for configure or registration routes - they are always allowed
    // In Vercel, pathname might not be set immediately, so we check window.location as fallback
    // Use the synchronous check from the top level (isAllowedRoute)
    
    // Only redirect to login for non-allowed routes when auth is loaded and user is not logged in
    // Never redirect during loading or for allowed routes
    // isAllowedRoute is checked synchronously at the top level, so it's always accurate
    if (!loading && !user && !isAllowedRoute) {
      // Double-check with window.location to be safe (for Vercel compatibility)
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
      const isNavigatingToAllowedRoute = currentPath.includes('/form-builder/projects/configure') || 
                                         currentPath.includes('/form-builder/projects/registration')
      
      if (!isNavigatingToAllowedRoute) {
        router.push('/login')
      }
    }
    // Explicitly prevent any redirects for allowed routes - they are always accessible
  }, [user, loading, router, isAllowedRoute])

  // Redirect VIEWER users away from dashboard to summary
  useEffect(() => {
    if (user && user.role === 'VIEWER' && pathname === '/dashboard') {
      router.push('/summary')
    }
  }, [user, router, pathname])

  useEffect(() => {
    // Show announcement for RAED users on every login
    if (user && user.role === 'RAED') {
      // Small delay to ensure smooth user experience after login
      const timer = setTimeout(() => {
        setShowAnnouncement(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [user])

  useEffect(() => {
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      const parsedState = JSON.parse(savedState)
      setIsSidebarCollapsed(parsedState)
    }
    
    // Check if page is in an iframe (modal mode)
    setIsInIframe(window.self !== window.top)
  }, [])

  const toggleSidebar = useCallback(() => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
    
    // Dispatch custom event for immediate updates in same tab
    window.dispatchEvent(new CustomEvent('sidebar-toggle'))
  }, [isSidebarCollapsed])

  const handleCloseAnnouncement = () => {
    setShowAnnouncement(false)
    // Don't store the "seen" status - we want it to show every login
  }

  // For allowed routes, ALWAYS render immediately - don't wait for auth or anything else
  // This check happens synchronously at the top level to prevent any redirects
  // This is critical for Vercel where timing can cause redirects
  // These routes handle their own loading states and auth checks
  if (isAllowedRoute) {
    return (
      <EvaluationProvider>
        <div className="flex h-screen bg-background">
          {!isInIframe && (
            <AppSidebar 
              isCollapsed={isSidebarCollapsed} 
              onToggle={toggleSidebar}
            />
          )}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!isInIframe && <Topbar />}
            <main className={`flex-1 overflow-auto ${isInIframe ? 'p-0' : 'p-6'}`}>
              {children}
            </main>
          </div>
        </div>
      </EvaluationProvider>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // For non-allowed routes, check auth
  if (!user) {
    return null
  }

  return (
    <EvaluationProvider>
      <div className="flex h-screen bg-background">
        {!isInIframe && (
          <AppSidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={toggleSidebar}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isInIframe && <Topbar />}
          <main className={`flex-1 overflow-auto ${isInIframe ? 'p-0' : 'p-6'}`}>
            {children}
          </main>
        </div>
      </div>
      
      {/* Announcement Popup for RAED users */}
      {user && user.role === 'RAED' && (
        <AnnouncementPopup
          isOpen={showAnnouncement}
          onClose={handleCloseAnnouncement}
          userRole={user.role}
        />
      )}
    </EvaluationProvider>
  )
}
