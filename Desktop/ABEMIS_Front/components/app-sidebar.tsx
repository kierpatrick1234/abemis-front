'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, ChevronLeft, ChevronRight, LayoutDashboard, FolderOpen, FileText, BarChart3, Users, Settings, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NavItem } from './nav-item'
import { AbemisLogo } from './abemis-logo'
import { navigationItems } from '@/lib/mock/data'
import { useAuth } from '@/lib/contexts/auth-context'
import { hasPermission } from '@/lib/mock/auth'
import { cn } from '@/lib/utils'

// Icon mapping for navigation items
const iconMap = {
  LayoutDashboard,
  FolderOpen,
  FileText,
  BarChart3,
  Users,
  Settings,
  CheckCircle,
}

interface AppSidebarProps {
  className?: string
  isCollapsed?: boolean
  onToggle?: () => void
}

export function AppSidebar({ className, isCollapsed = false, onToggle }: AppSidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavItems = navigationItems.filter(item => 
    user ? hasPermission(user.role, item.roles) : false
  )

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center border-b border-border px-6">
        {!isCollapsed ? (
          <>
            <div className="flex-1">
              <AbemisLogo size="md" textSize="md" className="text-card-foreground" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggle?.()
              }}
              className="h-8 w-8 hover:bg-accent flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-center w-full relative">
            <AbemisLogo size="md" showText={false} />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggle?.()
              }}
              className="absolute right-0 h-8 w-8 hover:bg-accent flex-shrink-0 z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {filteredNavItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap]
          return (
            <NavItem
              key={item.href}
              title={item.title}
              href={item.href}
              icon={Icon}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          'hidden md:flex md:flex-col transition-all duration-300 ease-in-out',
          className
        )}
        style={{
          width: isCollapsed ? '4rem' : '16rem'
        }}
        data-collapsed={isCollapsed}
      >
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}
