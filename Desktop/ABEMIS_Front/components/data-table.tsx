import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Pagination } from '@/components/pagination'

interface Column<T = unknown> {
  key: string
  label: string
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T = unknown> {
  columns: Column<T>[]
  data: T[]
  className?: string
  onRowClick?: (row: T) => void
  enablePagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
}

export function DataTable<T = unknown>({ 
  columns, 
  data, 
  className, 
  onRowClick, 
  enablePagination = false,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100]
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [currentPageSize, setCurrentPageSize] = React.useState(pageSize)

  // Update page size when prop changes
  React.useEffect(() => {
    setCurrentPageSize(pageSize)
  }, [pageSize])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / currentPageSize)
  
  // Ensure current page is valid when data changes
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])



  // Load sidebar state from localStorage and listen for changes
  React.useEffect(() => {
    const loadSidebarState = () => {
      const savedState = localStorage.getItem('sidebar-collapsed')
      if (savedState !== null) {
        try {
          setIsSidebarCollapsed(JSON.parse(savedState))
        } catch (error) {
          console.error('Error parsing sidebar state:', error)
        }
      }
    }

    // Load initial state
    loadSidebarState()

    // Listen for storage changes (when sidebar is toggled from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebar-collapsed') {
        loadSidebarState()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom events (for same-tab updates)
    const handleSidebarToggle = () => {
      loadSidebarState()
    }

    window.addEventListener('sidebar-toggle', handleSidebarToggle)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebar-toggle', handleSidebarToggle)
    }
  }, [])

  const startIndex = (currentPage - 1) * currentPageSize
  const endIndex = startIndex + currentPageSize
  const paginatedData = enablePagination ? data.slice(startIndex, endIndex) : data






  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setCurrentPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  return (
    <div className={cn('flex flex-col h-full relative', className)}>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow 
                key={index}
                className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? column.render((row as any)[column.key], row) : (row as any)[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {enablePagination && (
        <div 
          className="fixed bottom-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-10 transition-all duration-300 ease-in-out"
          style={{ 
            left: isSidebarCollapsed ? '4rem' : '16rem' 
          }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={currentPageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={pageSizeOptions}
            className="shadow-none border-t-0"
          />
        </div>
      )}
    </div>
  )
}

// Helper function to render status badges
export function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Validated':
      case 'Delivered':
      case 'Inventory':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Implementation':
      case 'For Review':
      case 'For Delivery':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Procurement':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Proposal':
      case 'Missing':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  )
}

// Helper function to render action buttons
export const ActionButton = React.memo(({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      {children}
    </Button>
  )
})
ActionButton.displayName = 'ActionButton'

// Action menu component with three dots
export const ActionMenu = React.memo(({ 
  actions, 
  onActionClick 
}: { 
  actions: Array<{ label: string; onClick: () => void; variant?: 'default' | 'destructive' }>
  onActionClick?: (action: string) => void
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation()
              action.onClick()
              onActionClick?.(action.label)
            }}
            className={action.variant === 'destructive' ? 'text-red-600 focus:text-red-600' : ''}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
ActionMenu.displayName = 'ActionMenu'
