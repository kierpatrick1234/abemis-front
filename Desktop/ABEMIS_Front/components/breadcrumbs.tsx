import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  // If only one item and it's Dashboard, show just the home icon
  if (items.length === 1 && items[0].label === 'Dashboard') {
    return (
      <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
        <Link href="/dashboard" className="flex items-center hover:text-foreground">
          <Home className="h-4 w-4" />
          <span className="ml-2 text-foreground font-medium">Dashboard</span>
        </Link>
      </nav>
    )
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      <Link href="/dashboard" className="flex items-center hover:text-foreground">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
