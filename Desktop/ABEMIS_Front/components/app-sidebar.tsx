'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, ChevronLeft, ChevronRight, LayoutDashboard, FolderOpen, FileText, BarChart3, Users, Settings } from 'lucide-react'
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
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        {!isCollapsed && (
          <AbemisLogo size="md" textSize="md" className="text-card-foreground" />
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center w-full">
            <AbemisLogo size="md" showText={false} />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 hover:bg-accent"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
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
      <div className={cn(
        'hidden md:flex md:flex-col transition-all duration-300',
        isCollapsed ? 'md:w-16' : 'md:w-64',
        className
      )}>
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
