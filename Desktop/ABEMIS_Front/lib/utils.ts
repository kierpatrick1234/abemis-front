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
    case 'Delivered':
    case 'Validated':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Implementation':
    case 'For Delivery':
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
  const breadcrumbs: Array<{ label: string; href: string }> = []

  // Handle protected routes
  if (segments.includes('protected')) {
    const protectedIndex = segments.indexOf('protected')
    const remainingSegments = segments.slice(protectedIndex + 1)
    
    if (remainingSegments.length > 0) {
      const currentPage = remainingSegments[remainingSegments.length - 1]
      
      // Map specific routes to better labels
      const routeLabels: Record<string, string> = {
        'dashboard': 'Dashboard',
        'projects': 'Projects',
        'documents': 'Documents',
        'document-manager': 'Document Manager',
        'analytics': 'Analytics',
        'notifications': 'Notifications',
        'profile': 'Profile',
        'settings': 'Settings',
        'users': 'Users',
        'raed-projects': 'RAED Projects',
        'ppmd-projects': 'PPMD Projects',
        'sepd-projects': 'SEPD Projects',
        'epdsd-projects': 'EPDSD Projects'
      }
      
      const label = routeLabels[currentPage] || currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
      
      // Only add current page if it's not dashboard (to avoid "Dashboard > Dashboard")
      if (currentPage !== 'dashboard') {
        breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' })
        breadcrumbs.push({ label, href: pathname })
      } else {
        breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' })
      }
    } else {
      // If we're at /protected, show just Dashboard
      breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' })
    }
  } else if (segments.length > 0) {
    // Handle other routes
    const currentPage = segments[segments.length - 1]
    const capitalized = currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
    breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' })
    breadcrumbs.push({ label: capitalized, href: pathname })
  } else {
    // Root path
    breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' })
  }

  return breadcrumbs
}

/**
 * Maps region assignment names (e.g., "Region 1", "Region 2") to PSGC region names
 * This helps find the matching PSGC region code for RAED users
 */
export function findPSGCRegionCode(regionAssigned: string, psgcRegions: Array<{ code: string; name: string }>): string | null {
  if (!regionAssigned || !psgcRegions || psgcRegions.length === 0) {
    return null
  }

  // Normalize the region assignment (e.g., "Region 1" -> "Region I", "Region 2" -> "Region II")
  const regionNumber = regionAssigned.match(/\d+/)?.[0]
  const regionName = regionAssigned.toLowerCase()

  // Map region numbers to Roman numerals
  const romanNumerals: Record<string, string> = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
    '5': 'V',
    '6': 'VI',
    '7': 'VII',
    '8': 'VIII',
    '9': 'IX',
    '10': 'X',
    '11': 'XI',
    '12': 'XII',
    '13': 'XIII'
  }

  // Try to find matching region
  for (const region of psgcRegions) {
    const regionNameLower = region.name.toLowerCase()
    
    // Check for exact match (e.g., "Region 1" matches "Region I - Ilocos Region")
    if (regionNumber && romanNumerals[regionNumber]) {
      const romanNumeral = romanNumerals[regionNumber]
      if (regionNameLower.includes(`region ${romanNumeral.toLowerCase()}`) || 
          regionNameLower.includes(`region ${regionNumber}`)) {
        return region.code
      }
    }
    
    // Check for special cases
    if (regionName.includes('4b') || regionName.includes('4-b')) {
      if (regionNameLower.includes('mimaropa') || regionNameLower.includes('iv-b')) {
        return region.code
      }
    }
    
    if (regionName.includes('nir') || regionName.includes('negros island')) {
      if (regionNameLower.includes('negros island') || regionNameLower.includes('nir')) {
        return region.code
      }
    }
    
    if (regionName.includes('car') || regionName.includes('cordillera')) {
      if (regionNameLower.includes('cordillera') || regionNameLower.includes('car')) {
        return region.code
      }
    }
  }

  return null
}