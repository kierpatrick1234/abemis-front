import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Role } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateForDisplay(date: string | Date): string {
  const dateObj = new Date(date)
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  return `${month}-${day}-${year}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)
}

export function getRoleColor(role: Role): string {
  switch (role) {
    case 'admin':
      return 'bg-primary text-primary-foreground'
    case 'engineer':
      return 'bg-secondary text-secondary-foreground'
    case 'stakeholder':
      return 'bg-muted text-muted-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Completed':
    case 'Validated':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Implementation':
    case 'For Review':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Procurement':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Proposal':
    case 'Missing':
      return 'bg-destructive text-destructive-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function generateBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ label: 'Dashboard', href: '/dashboard' }]

  if (segments.length > 1) {
    const currentPage = segments[segments.length - 1]
    const capitalized = currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
    breadcrumbs.push({ label: capitalized, href: pathname })
  }

  return breadcrumbs
}
