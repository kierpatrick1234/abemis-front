import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItemProps {
  title: string
  href: string
  icon: LucideIcon
  isActive?: boolean
  isCollapsed?: boolean
  className?: string
}

export function NavItem({ title, href, icon: Icon, isActive, isCollapsed = false, className }: NavItemProps) {
  const pathname = usePathname()
  const active = isActive ?? pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground',
        isCollapsed ? 'justify-center px-2' : 'space-x-3',
        active && 'bg-primary text-primary-foreground shadow-sm',
        className
      )}
      title={isCollapsed ? title : undefined}
    >
      <Icon className={cn(
        'h-5 w-5 flex-shrink-0',
        isCollapsed && 'h-6 w-6'
      )} />
      {!isCollapsed && <span>{title}</span>}
    </Link>
  )
}
