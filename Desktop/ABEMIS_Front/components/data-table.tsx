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
}

export function DataTable<T = unknown>({ columns, data, className, onRowClick }: DataTableProps<T>) {
  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={index}
              className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Helper function to render status badges
export function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
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
