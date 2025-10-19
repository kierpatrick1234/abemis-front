'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <EvaluationProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto p-6">
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
