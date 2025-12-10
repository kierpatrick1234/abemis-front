'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, ChevronLeft, ChevronRight, LayoutDashboard, FolderOpen, FileText, BarChart3, Users, Settings, CheckCircle, Wrench, ChevronDown, ChevronUp } from 'lucide-react'
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
  Wrench,
}

interface AppSidebarProps {
  className?: string
  isCollapsed?: boolean
  onToggle?: () => void
}

export function AppSidebar({ className, isCollapsed = false, onToggle }: AppSidebarProps) {
  const [open, setOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavItems = navigationItems.filter(item => 
    user ? hasPermission(user.role, item.roles) : false
  )

  // Auto-expand items with active sub-items
  useEffect(() => {
    const itemsToExpand = new Set<string>()
    filteredNavItems.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        const hasActiveSubItem = item.subItems.some(subItem => pathname === subItem.href)
        if (hasActiveSubItem) {
          itemsToExpand.add(item.href)
        }
      }
    })
    if (itemsToExpand.size > 0) {
      setExpandedItems(prev => {
        const newSet = new Set(prev)
        itemsToExpand.forEach(href => newSet.add(href))
        return newSet
      })
    }
  }, [pathname, filteredNavItems.length])

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(href)) {
        newSet.delete(href)
      } else {
        newSet.add(href)
      }
      return newSet
    })
  }

  const isItemActive = (item: typeof navigationItems[0]) => {
    if (pathname === item.href) return true
    if (item.subItems) {
      return item.subItems.some(subItem => pathname === subItem.href)
    }
    return false
  }

  const isSubItemActive = (subItem: typeof navigationItems[0]) => {
    return pathname === subItem.href
  }

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
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap]
          const hasSubItems = item.subItems && item.subItems.length > 0
          const isExpanded = expandedItems.has(item.href)
          const isActive = isItemActive(item)

          return (
            <div key={item.href} className="space-y-1">
              {hasSubItems ? (
                <>
                  <button
                    onClick={() => !isCollapsed && toggleExpanded(item.href)}
                    className={cn(
                      'flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground w-full',
                      isCollapsed ? 'justify-center px-2' : 'space-x-3',
                      isActive && 'bg-primary text-primary-foreground shadow-sm',
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isCollapsed && 'h-6 w-6'
                    )} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 flex-shrink-0" />
                        )}
                      </>
                    )}
                  </button>
                  {!isCollapsed && isExpanded && hasSubItems && (
                    <div className="ml-4 space-y-1 border-l border-border pl-2">
                      {item.subItems!.map((subItem) => {
                        const SubIcon = iconMap[subItem.icon as keyof typeof iconMap] || Icon
                        const isSubActive = isSubItemActive(subItem)
                        return (
                          <NavItem
                            key={subItem.href}
                            title={subItem.title}
                            href={subItem.href}
                            icon={SubIcon}
                            isActive={isSubActive}
                            isCollapsed={false}
                            className="pl-4"
                          />
                        )
                      })}
                    </div>
                  )}
                </>
              ) : (
                <NavItem
                  title={item.title}
                  href={item.href}
                  icon={Icon}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                />
              )}
            </div>
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
