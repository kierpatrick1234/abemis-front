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

  useEffect(() => {
    // Allow configure and registration routes to load even during auth initialization
    // This prevents redirects in Vercel where auth might load slower
    const isConfigureRoute = pathname?.includes('/form-builder/projects/configure')
    const isRegistrationRoute = pathname?.includes('/form-builder/projects/registration')
    const isAllowedRoute = isConfigureRoute || isRegistrationRoute
    
    // Never redirect for configure or registration routes - they handle their own auth
    if (!loading && !user && !isAllowedRoute) {
      router.push('/login')
    }
    // Explicitly prevent any redirects for allowed routes
  }, [user, loading, router, pathname])

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

  // Allow configure and registration routes to render during auth loading to prevent redirects in Vercel
  const isConfigureRoute = pathname?.includes('/form-builder/projects/configure')
  const isRegistrationRoute = pathname?.includes('/form-builder/projects/registration')
  const isAllowedRoute = isConfigureRoute || isRegistrationRoute

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Allow configure and registration routes to render even if user is not loaded yet
  // This prevents redirects in Vercel where auth might initialize slower
  if (!user && !isAllowedRoute) {
    return null
  }

  // For configure and registration routes, render the page even without user (it will handle its own loading)
  if (isAllowedRoute && !user) {
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
