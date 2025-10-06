import { Badge } from '@/components/ui/badge'
import { Role } from '@/lib/types'
import { getRoleColor } from '@/lib/utils'

interface RoleBadgeProps {
  role: Role
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge className={`${getRoleColor(role)} ${className}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  )
}
