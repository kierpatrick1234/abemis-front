'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Download,
  Filter,
  Calendar,
  User,
  Type,
} from 'lucide-react'
import { AuditLog } from '@/lib/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function SystemLogsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [isAuditLogsInitialized, setIsAuditLogsInitialized] = useState(false)
  const [auditLogsSearch, setAuditLogsSearch] = useState('')
  const [auditLogsFilter, setAuditLogsFilter] = useState<'all' | AuditLog['category']>('all')
  const [auditLogsStatusFilter, setAuditLogsStatusFilter] = useState<'all' | AuditLog['status']>('all')
  const [dateFilterStart, setDateFilterStart] = useState<string>('')
  const [dateFilterEnd, setDateFilterEnd] = useState<string>('')
  const [authorFilter, setAuthorFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Load audit logs from localStorage
  useEffect(() => {
    if (loading || isAuditLogsInitialized) return
    
    const stored = localStorage.getItem('abemis-audit-logs')
    let loadedLogs: AuditLog[] = []
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedLogs = parsed
        }
      } catch (error) {
        console.error('Error loading audit logs:', error)
      }
    }
    
    // If no logs or logs are insufficient, create comprehensive sample logs for each category
    // Always ensure we have at least 30+ logs with the new dummy data
    const hasNewLogs = loadedLogs.some(log => log.id?.startsWith('audit-project-approve') || log.id?.startsWith('audit-form-builder') || log.id?.startsWith('audit-project-proposal'))
    
    if (loadedLogs.length === 0 || !hasNewLogs) {
      const now = new Date()
      const baseLogs = loadedLogs.length > 0 ? loadedLogs : []
      const newLogs = [
        // Authentication Category (5+ examples)
        {
          id: 'audit-auth-1',
          action: 'User Login',
          category: 'authentication',
          userId: 'user-001',
          userName: 'John Engineer',
          userEmail: 'john.engineer@abemis.gov.ph',
          userRole: 'engineer',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success',
          timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'audit-auth-2',
          action: 'Password Changed',
          category: 'authentication',
          userId: 'user-002',
          userName: 'Jane Manager',
          userEmail: 'jane.manager@abemis.gov.ph',
          userRole: 'manager',
          ipAddress: '192.168.1.105',
          status: 'success',
          details: 'Password successfully updated',
          timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
        },
        {
          id: 'audit-auth-3',
          action: 'Failed Login Attempt',
          category: 'authentication',
          userId: 'unknown',
          userName: 'Unknown User',
          userEmail: 'attacker@example.com',
          userRole: 'admin',
          ipAddress: '203.0.113.45',
          status: 'failure',
          details: 'Invalid credentials provided',
          timestamp: new Date(now.getTime() - 10800000).toISOString(), // 3 hours ago
        },
        {
          id: 'audit-auth-4',
          action: 'Session Expired',
          category: 'authentication',
          userId: 'user-003',
          userName: 'Mike Supervisor',
          userEmail: 'mike.supervisor@abemis.gov.ph',
          userRole: 'supervisor',
          ipAddress: '192.168.1.110',
          status: 'warning',
          details: 'Session expired due to inactivity',
          timestamp: new Date(now.getTime() - 14400000).toISOString(), // 4 hours ago
        },
        {
          id: 'audit-auth-5',
          action: 'Account Locked',
          category: 'authentication',
          userId: 'user-004',
          userName: 'Sarah Engineer',
          userEmail: 'sarah.engineer@abemis.gov.ph',
          userRole: 'engineer',
          ipAddress: '192.168.1.115',
          status: 'warning',
          details: 'Account locked after 5 failed login attempts',
          timestamp: new Date(now.getTime() - 18000000).toISOString(), // 5 hours ago
        },
        {
          id: 'audit-auth-6',
          action: 'Password Reset Request',
          category: 'authentication',
          userId: 'user-005',
          userName: 'David RAED',
          userEmail: 'david.raed@abemis.gov.ph',
          userRole: 'RAED',
          ipAddress: '192.168.1.120',
          status: 'success',
          details: 'Password reset email sent',
          timestamp: new Date(now.getTime() - 21600000).toISOString(), // 6 hours ago
        },
        
        // User Management Category (5+ examples)
        {
          id: 'audit-user-1',
          action: 'User Created',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-010',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'New user created: alice.engineer@abemis.gov.ph with role engineer',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-user-2',
          action: 'User Updated',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-011',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'User role changed from engineer to manager',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-user-3',
          action: 'User Deactivated',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-012',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'User account deactivated',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        {
          id: 'audit-user-4',
          action: 'User Invited',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'invite-001',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Invitation sent to new.user@abemis.gov.ph',
          timestamp: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
        },
        {
          id: 'audit-user-5',
          action: 'Bulk User Import',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: '15 users imported from CSV file',
          timestamp: new Date(now.getTime() - 432000000).toISOString(), // 5 days ago
        },
        {
          id: 'audit-user-6',
          action: 'User Role Changed',
          category: 'user_management',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-013',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'User role updated from stakeholder to engineer',
          timestamp: new Date(now.getTime() - 518400000).toISOString(), // 6 days ago
        },
        
        // Project Category (5+ examples)
        {
          id: 'audit-project-1',
          action: 'Project Created',
          category: 'project',
          userId: 'user-020',
          userName: 'Robert Engineer',
          userEmail: 'robert.engineer@abemis.gov.ph',
          userRole: 'engineer',
          resourceType: 'project',
          resourceId: 'PRJ-001',
          ipAddress: '192.168.1.130',
          status: 'success',
          details: 'New FMR project created: Farm-to-Market Road - Northern Province',
          timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'audit-project-2',
          action: 'Project Status Updated',
          category: 'project',
          userId: 'user-021',
          userName: 'Lisa Manager',
          userEmail: 'lisa.manager@abemis.gov.ph',
          userRole: 'manager',
          resourceType: 'project',
          resourceId: 'PRJ-002',
          ipAddress: '192.168.1.135',
          status: 'success',
          details: 'Project status changed from Proposal to Procurement',
          timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
        },
        {
          id: 'audit-project-3',
          action: 'Project Deleted',
          category: 'project',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'project',
          resourceId: 'PRJ-003',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Project deleted: Cancelled Infrastructure Project',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-project-4',
          action: 'Project Budget Updated',
          category: 'project',
          userId: 'user-022',
          userName: 'Tom Supervisor',
          userEmail: 'tom.supervisor@abemis.gov.ph',
          userRole: 'supervisor',
          resourceType: 'project',
          resourceId: 'PRJ-004',
          ipAddress: '192.168.1.140',
          status: 'success',
          details: 'Budget updated from ₱5,000,000 to ₱5,500,000',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        {
          id: 'audit-project-5',
          action: 'Project Assigned',
          category: 'project',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'project',
          resourceId: 'PRJ-005',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Project assigned to John Engineer',
          timestamp: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
        },
        {
          id: 'audit-project-6',
          action: 'Project Evaluation Submitted',
          category: 'project',
          userId: 'user-023',
          userName: 'Emma EPDSD',
          userEmail: 'emma.epdsd@abemis.gov.ph',
          userRole: 'EPDSD',
          resourceType: 'project',
          resourceId: 'PRJ-006',
          ipAddress: '192.168.1.145',
          status: 'success',
          details: 'Project evaluation completed and submitted',
          timestamp: new Date(now.getTime() - 432000000).toISOString(), // 5 days ago
        },
        
        // Document Category (5+ examples)
        {
          id: 'audit-doc-1',
          action: 'Document Uploaded',
          category: 'document',
          userId: 'user-030',
          userName: 'Paul Engineer',
          userEmail: 'paul.engineer@abemis.gov.ph',
          userRole: 'engineer',
          resourceType: 'document',
          resourceId: 'DOC-001',
          ipAddress: '192.168.1.150',
          status: 'success',
          details: 'Document uploaded: Environmental Impact Assessment.pdf (2.4 MB)',
          timestamp: new Date(now.getTime() - 10800000).toISOString(), // 3 hours ago
        },
        {
          id: 'audit-doc-2',
          action: 'Document Validated',
          category: 'document',
          userId: 'user-031',
          userName: 'Nancy EPDSD',
          userEmail: 'nancy.epdsd@abemis.gov.ph',
          userRole: 'EPDSD',
          resourceType: 'document',
          resourceId: 'DOC-002',
          ipAddress: '192.168.1.155',
          status: 'success',
          details: 'Document validated: Feasibility Study.pdf',
          timestamp: new Date(now.getTime() - 14400000).toISOString(), // 4 hours ago
        },
        {
          id: 'audit-doc-3',
          action: 'Document Deleted',
          category: 'document',
          userId: 'user-032',
          userName: 'Oliver Manager',
          userEmail: 'oliver.manager@abemis.gov.ph',
          userRole: 'manager',
          resourceType: 'document',
          resourceId: 'DOC-003',
          ipAddress: '192.168.1.160',
          status: 'success',
          details: 'Document deleted: Outdated Report.pdf',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-doc-4',
          action: 'Document Download',
          category: 'document',
          userId: 'user-033',
          userName: 'Patricia RAED',
          userEmail: 'patricia.raed@abemis.gov.ph',
          userRole: 'RAED',
          resourceType: 'document',
          resourceId: 'DOC-004',
          ipAddress: '192.168.1.165',
          status: 'success',
          details: 'Document downloaded: Project Proposal.pdf',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-doc-5',
          action: 'Document Rejected',
          category: 'document',
          userId: 'user-034',
          userName: 'Quinn SEPD',
          userEmail: 'quinn.sepd@abemis.gov.ph',
          userRole: 'SEPD',
          resourceType: 'document',
          resourceId: 'DOC-005',
          ipAddress: '192.168.1.170',
          status: 'warning',
          details: 'Document rejected: Missing required information',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        {
          id: 'audit-doc-6',
          action: 'Bulk Document Upload',
          category: 'document',
          userId: 'user-035',
          userName: 'Ryan Engineer',
          userEmail: 'ryan.engineer@abemis.gov.ph',
          userRole: 'engineer',
          resourceType: 'document',
          resourceId: 'DOC-BULK-001',
          ipAddress: '192.168.1.175',
          status: 'success',
          details: '8 documents uploaded in bulk',
          timestamp: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
        },
        
        // System Config Category (5+ examples)
        {
          id: 'audit-config-1',
          action: 'Password Policy Updated',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Password policy updated: Minimum length changed to 10',
          timestamp: new Date(now.getTime() - 18000000).toISOString(), // 5 hours ago
        },
        {
          id: 'audit-config-2',
          action: 'Session Policy Updated',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Session timeout updated to 480 minutes',
          timestamp: new Date(now.getTime() - 21600000).toISOString(), // 6 hours ago
        },
        {
          id: 'audit-config-3',
          action: 'System Announcement Created',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'announcement',
          resourceId: 'ANN-001',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'New system announcement created and published',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-config-4',
          action: 'Operating Unit Created',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'operating_unit',
          resourceId: 'OU-005',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'New operating unit created: Regional Office',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-config-5',
          action: 'System Settings Backup',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'System configuration backup created',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        {
          id: 'audit-config-6',
          action: 'System Maintenance Mode Enabled',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'warning',
          details: 'System maintenance mode activated',
          timestamp: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
        },
        
        // Permission Category (5+ examples)
        {
          id: 'audit-perm-1',
          action: 'Role Permissions Updated',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'role',
          resourceId: 'role-engineer',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Engineer role permissions updated: Added "Approve Projects" permission',
          timestamp: new Date(now.getTime() - 25200000).toISOString(), // 7 hours ago
        },
        {
          id: 'audit-perm-2',
          action: 'User Permission Granted',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-040',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Special permission granted: Access to confidential projects',
          timestamp: new Date(now.getTime() - 28800000).toISOString(), // 8 hours ago
        },
        {
          id: 'audit-perm-3',
          action: 'Permission Denied',
          category: 'permission',
          userId: 'user-041',
          userName: 'Sam Stakeholder',
          userEmail: 'sam.stakeholder@abemis.gov.ph',
          userRole: 'stakeholder',
          resourceType: 'project',
          resourceId: 'PRJ-010',
          ipAddress: '192.168.1.180',
          status: 'failure',
          details: 'Access denied: Insufficient permissions to view project',
          timestamp: new Date(now.getTime() - 32400000).toISOString(), // 9 hours ago
        },
        {
          id: 'audit-perm-4',
          action: 'Role Created',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'role',
          resourceId: 'role-custom',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'New custom role created: Project Coordinator',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-perm-5',
          action: 'Bulk Permission Update',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Permissions updated for 12 users in bulk operation',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: 'audit-perm-6',
          action: 'Permission Revoked',
          category: 'permission',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'user',
          resourceId: 'user-042',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Admin permissions revoked from user',
          timestamp: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
        },
        
        // Other Category (5+ examples)
        {
          id: 'audit-other-1',
          action: 'Data Export',
          category: 'other',
          userId: 'user-050',
          userName: 'Tina Manager',
          userEmail: 'tina.manager@abemis.gov.ph',
          userRole: 'manager',
          ipAddress: '192.168.1.185',
          status: 'success',
          details: 'Project data exported to Excel format',
          timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'audit-other-2',
          action: 'Report Generated',
          category: 'other',
          userId: 'user-051',
          userName: 'Victor Supervisor',
          userEmail: 'victor.supervisor@abemis.gov.ph',
          userRole: 'supervisor',
          ipAddress: '192.168.1.190',
          status: 'success',
          details: 'Monthly project report generated',
          timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
        },
        {
          id: 'audit-other-3',
          action: 'API Access',
          category: 'other',
          userId: 'user-052',
          userName: 'Wendy Engineer',
          userEmail: 'wendy.engineer@abemis.gov.ph',
          userRole: 'engineer',
          ipAddress: '192.168.1.195',
          status: 'success',
          details: 'External API accessed: PSGC Location Service',
          timestamp: new Date(now.getTime() - 10800000).toISOString(), // 3 hours ago
        },
        {
          id: 'audit-other-4',
          action: 'System Error',
          category: 'other',
          userId: 'system',
          userName: 'System',
          userEmail: 'system@abemis.gov.ph',
          userRole: 'admin',
          ipAddress: '127.0.0.1',
          status: 'warning',
          details: 'Database connection timeout occurred',
          timestamp: new Date(now.getTime() - 14400000).toISOString(), // 4 hours ago
        },
        {
          id: 'audit-other-5',
          action: 'Bulk Operation',
          category: 'other',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Bulk project status update: 25 projects updated',
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'audit-other-6',
          action: 'System Health Check',
          category: 'other',
          userId: 'system',
          userName: 'System',
          userEmail: 'system@abemis.gov.ph',
          userRole: 'admin',
          ipAddress: '127.0.0.1',
          status: 'success',
          details: 'Automated system health check completed',
          timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        },
        
        // Additional logs for project approvals, form builder, proposals, etc.
        {
          id: 'audit-project-approve-1',
          action: 'Project Approved',
          category: 'project',
          userId: 'user-024',
          userName: 'Maria EPDSD',
          userEmail: 'maria.epdsd@abemis.gov.ph',
          userRole: 'EPDSD',
          resourceType: 'project',
          resourceId: 'PRJ-007',
          ipAddress: '192.168.1.200',
          status: 'success',
          details: 'FMR Project approved: Farm-to-Market Road - Central Province',
          timestamp: new Date(now.getTime() - 5400000).toISOString(), // 1.5 hours ago
        },
        {
          id: 'audit-project-approve-2',
          action: 'Project Approved',
          category: 'project',
          userId: 'user-025',
          userName: 'Carlos SEPD',
          userEmail: 'carlos.sepd@abemis.gov.ph',
          userRole: 'SEPD',
          resourceType: 'project',
          resourceId: 'PRJ-008',
          ipAddress: '192.168.1.205',
          status: 'success',
          details: 'Infrastructure Project approved: Irrigation System - Southern Region',
          timestamp: new Date(now.getTime() - 9000000).toISOString(), // 2.5 hours ago
        },
        {
          id: 'audit-project-approve-3',
          action: 'Project Proposal Rejected',
          category: 'project',
          userId: 'user-026',
          userName: 'Ana PPMD',
          userEmail: 'ana.ppmd@abemis.gov.ph',
          userRole: 'PPMD',
          resourceType: 'project',
          resourceId: 'PRJ-009',
          ipAddress: '192.168.1.210',
          status: 'failure',
          details: 'Project proposal rejected: Insufficient documentation',
          timestamp: new Date(now.getTime() - 12600000).toISOString(), // 3.5 hours ago
        },
        {
          id: 'audit-form-builder-1',
          action: 'Form Field Added',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-infrastructure',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Added new field "Budget Allocation" to Infrastructure Project Registration Form',
          timestamp: new Date(now.getTime() - 16200000).toISOString(), // 4.5 hours ago
        },
        {
          id: 'audit-form-builder-2',
          action: 'Form Field Added',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-fmr',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Added new field "Road Length (km)" to FMR Project Registration Form',
          timestamp: new Date(now.getTime() - 19800000).toISOString(), // 5.5 hours ago
        },
        {
          id: 'audit-form-builder-3',
          action: 'Form Field Modified',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-machinery',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Modified field "Equipment Type" to include dropdown options in Machinery Form',
          timestamp: new Date(now.getTime() - 23400000).toISOString(), // 6.5 hours ago
        },
        {
          id: 'audit-form-builder-4',
          action: 'Form Field Deleted',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-package',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Removed field "Old Reference Number" from Package Project Form',
          timestamp: new Date(now.getTime() - 27000000).toISOString(), // 7.5 hours ago
        },
        {
          id: 'audit-project-proposal-1',
          action: 'Project Proposal Submitted',
          category: 'project',
          userId: 'user-027',
          userName: 'Luis Engineer',
          userEmail: 'luis.engineer@abemis.gov.ph',
          userRole: 'engineer',
          resourceType: 'project',
          resourceId: 'PRJ-010',
          ipAddress: '192.168.1.215',
          status: 'success',
          details: 'New project proposal submitted: Solar-Powered Irrigation System',
          timestamp: new Date(now.getTime() - 30600000).toISOString(), // 8.5 hours ago
        },
        {
          id: 'audit-project-proposal-2',
          action: 'Project Proposal Submitted',
          category: 'project',
          userId: 'user-028',
          userName: 'Sofia RAED',
          userEmail: 'sofia.raed@abemis.gov.ph',
          userRole: 'RAED',
          resourceType: 'project',
          resourceId: 'PRJ-011',
          ipAddress: '192.168.1.220',
          status: 'success',
          details: 'New project proposal submitted: Community Farm-to-Market Road',
          timestamp: new Date(now.getTime() - 34200000).toISOString(), // 9.5 hours ago
        },
        {
          id: 'audit-project-proposal-3',
          action: 'Project Proposal Entry',
          category: 'project',
          userId: 'user-029',
          userName: 'Diego Manager',
          userEmail: 'diego.manager@abemis.gov.ph',
          userRole: 'manager',
          resourceType: 'project',
          resourceId: 'PRJ-012',
          ipAddress: '192.168.1.225',
          status: 'success',
          details: 'Project proposal entry created: Agricultural Machinery Distribution Program',
          timestamp: new Date(now.getTime() - 37800000).toISOString(), // 10.5 hours ago
        },
        {
          id: 'audit-project-proposal-4',
          action: 'Project Proposal Entry',
          category: 'project',
          userId: 'user-030',
          userName: 'Isabella Supervisor',
          userEmail: 'isabella.supervisor@abemis.gov.ph',
          userRole: 'supervisor',
          resourceType: 'project',
          resourceId: 'PRJ-013',
          ipAddress: '192.168.1.230',
          status: 'success',
          details: 'Project proposal entry created: Water Supply System for Rural Communities',
          timestamp: new Date(now.getTime() - 41400000).toISOString(), // 11.5 hours ago
        },
        {
          id: 'audit-project-approve-4',
          action: 'Project Approved',
          category: 'project',
          userId: 'user-031',
          userName: 'Fernando EPDSD',
          userEmail: 'fernando.epdsd@abemis.gov.ph',
          userRole: 'EPDSD',
          resourceType: 'project',
          resourceId: 'PRJ-014',
          ipAddress: '192.168.1.235',
          status: 'success',
          details: 'Machinery Project approved: Tractor Distribution Program',
          timestamp: new Date(now.getTime() - 45000000).toISOString(), // 12.5 hours ago
        },
        {
          id: 'audit-project-approve-5',
          action: 'Project Approved',
          category: 'project',
          userId: 'user-032',
          userName: 'Carmen SEPD',
          userEmail: 'carmen.sepd@abemis.gov.ph',
          userRole: 'SEPD',
          resourceType: 'project',
          resourceId: 'PRJ-015',
          ipAddress: '192.168.1.240',
          status: 'success',
          details: 'Infrastructure Project approved: Post-Harvest Facility Construction',
          timestamp: new Date(now.getTime() - 48600000).toISOString(), // 13.5 hours ago
        },
        {
          id: 'audit-form-builder-5',
          action: 'Form Configuration Updated',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-infrastructure',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Updated form validation rules for Infrastructure Project Registration',
          timestamp: new Date(now.getTime() - 52200000).toISOString(), // 14.5 hours ago
        },
        {
          id: 'audit-form-builder-6',
          action: 'Form Field Added',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-fmr',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Added new field "Environmental Impact Assessment Status" to FMR Form',
          timestamp: new Date(now.getTime() - 55800000).toISOString(), // 15.5 hours ago
        },
        {
          id: 'audit-project-proposal-5',
          action: 'Project Proposal Entry',
          category: 'project',
          userId: 'user-033',
          userName: 'Ricardo Engineer',
          userEmail: 'ricardo.engineer@abemis.gov.ph',
          userRole: 'engineer',
          resourceType: 'project',
          resourceId: 'PRJ-016',
          ipAddress: '192.168.1.245',
          status: 'success',
          details: 'Project proposal entry created: Greenhouse Construction Project',
          timestamp: new Date(now.getTime() - 59400000).toISOString(), // 16.5 hours ago
        },
        {
          id: 'audit-project-approve-6',
          action: 'Project Approved',
          category: 'project',
          userId: 'user-034',
          userName: 'Patricia PPMD',
          userEmail: 'patricia.ppmd@abemis.gov.ph',
          userRole: 'PPMD',
          resourceType: 'project',
          resourceId: 'PRJ-017',
          ipAddress: '192.168.1.250',
          status: 'success',
          details: 'Package Project approved: Integrated Agricultural Development Package',
          timestamp: new Date(now.getTime() - 63000000).toISOString(), // 17.5 hours ago
        },
        {
          id: 'audit-project-proposal-6',
          action: 'Project Proposal Submitted',
          category: 'project',
          userId: 'user-035',
          userName: 'Jose RAED',
          userEmail: 'jose.raed@abemis.gov.ph',
          userRole: 'RAED',
          resourceType: 'project',
          resourceId: 'PRJ-018',
          ipAddress: '192.168.1.255',
          status: 'success',
          details: 'New project proposal submitted: Cold Storage Facility',
          timestamp: new Date(now.getTime() - 66600000).toISOString(), // 18.5 hours ago
        },
        {
          id: 'audit-form-builder-7',
          action: 'Form Field Added',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-machinery',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Added new field "Warranty Period (months)" to Machinery Project Form',
          timestamp: new Date(now.getTime() - 70200000).toISOString(), // 19.5 hours ago
        },
        {
          id: 'audit-project-approve-7',
          action: 'Project Approved',
          category: 'project',
          userId: 'user-036',
          userName: 'Elena EPDSD',
          userEmail: 'elena.epdsd@abemis.gov.ph',
          userRole: 'EPDSD',
          resourceType: 'project',
          resourceId: 'PRJ-019',
          ipAddress: '192.168.1.260',
          status: 'success',
          details: 'FMR Project approved: Access Road to Agricultural Area',
          timestamp: new Date(now.getTime() - 73800000).toISOString(), // 20.5 hours ago
        },
        {
          id: 'audit-project-proposal-7',
          action: 'Project Proposal Entry',
          category: 'project',
          userId: 'user-037',
          userName: 'Miguel Manager',
          userEmail: 'miguel.manager@abemis.gov.ph',
          userRole: 'manager',
          resourceType: 'project',
          resourceId: 'PRJ-020',
          ipAddress: '192.168.1.265',
          status: 'success',
          details: 'Project proposal entry created: Agricultural Training Center',
          timestamp: new Date(now.getTime() - 77400000).toISOString(), // 21.5 hours ago
        },
        {
          id: 'audit-form-builder-8',
          action: 'Form Field Modified',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-package',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Modified field "Project Components" to support multiple selections',
          timestamp: new Date(now.getTime() - 81000000).toISOString(), // 22.5 hours ago
        },
        {
          id: 'audit-project-approve-8',
          action: 'Project Approved',
          category: 'project',
          userId: 'user-038',
          userName: 'Rosa SEPD',
          userEmail: 'rosa.sepd@abemis.gov.ph',
          userRole: 'SEPD',
          resourceType: 'project',
          resourceId: 'PRJ-021',
          ipAddress: '192.168.1.270',
          status: 'success',
          details: 'Infrastructure Project approved: Agricultural Research Laboratory',
          timestamp: new Date(now.getTime() - 84600000).toISOString(), // 23.5 hours ago
        },
        {
          id: 'audit-project-proposal-8',
          action: 'Project Proposal Submitted',
          category: 'project',
          userId: 'user-039',
          userName: 'Antonio Engineer',
          userEmail: 'antonio.engineer@abemis.gov.ph',
          userRole: 'engineer',
          resourceType: 'project',
          resourceId: 'PRJ-022',
          ipAddress: '192.168.1.275',
          status: 'success',
          details: 'New project proposal submitted: Organic Fertilizer Production Facility',
          timestamp: new Date(now.getTime() - 88200000).toISOString(), // 24.5 hours ago
        },
        {
          id: 'audit-form-builder-9',
          action: 'Form Field Added',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-infrastructure',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Added new field "Construction Timeline (months)" to Infrastructure Form',
          timestamp: new Date(now.getTime() - 91800000).toISOString(), // 25.5 hours ago
        },
        {
          id: 'audit-project-approve-9',
          action: 'Project Approved',
          category: 'project',
          userId: 'user-040',
          userName: 'Laura PPMD',
          userEmail: 'laura.ppmd@abemis.gov.ph',
          userRole: 'PPMD',
          resourceType: 'project',
          resourceId: 'PRJ-023',
          ipAddress: '192.168.1.280',
          status: 'success',
          details: 'Machinery Project approved: Combine Harvester Distribution',
          timestamp: new Date(now.getTime() - 95400000).toISOString(), // 26.5 hours ago
        },
        {
          id: 'audit-project-proposal-9',
          action: 'Project Proposal Entry',
          category: 'project',
          userId: 'user-041',
          userName: 'Roberto RAED',
          userEmail: 'roberto.raed@abemis.gov.ph',
          userRole: 'RAED',
          resourceType: 'project',
          resourceId: 'PRJ-024',
          ipAddress: '192.168.1.285',
          status: 'success',
          details: 'Project proposal entry created: Agricultural Processing Plant',
          timestamp: new Date(now.getTime() - 99000000).toISOString(), // 27.5 hours ago
        },
        {
          id: 'audit-form-builder-10',
          action: 'Form Configuration Updated',
          category: 'system_config',
          userId: user?.id || 'admin',
          userName: user?.name || 'Admin User',
          userEmail: user?.email || 'admin@abemis.gov.ph',
          userRole: user?.role || 'admin',
          resourceType: 'form',
          resourceId: 'form-fmr',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: 'Updated form layout and field ordering in FMR Project Registration Form',
          timestamp: new Date(now.getTime() - 102600000).toISOString(), // 28.5 hours ago
        },
        {
          id: 'audit-project-approve-10',
          action: 'Project Approved',
          category: 'project',
          userId: 'user-042',
          userName: 'Gabriela EPDSD',
          userEmail: 'gabriela.epdsd@abemis.gov.ph',
          userRole: 'EPDSD',
          resourceType: 'project',
          resourceId: 'PRJ-025',
          ipAddress: '192.168.1.290',
          status: 'success',
          details: 'Package Project approved: Comprehensive Agricultural Support Package',
          timestamp: new Date(now.getTime() - 106200000).toISOString(), // 29.5 hours ago
        },
        {
          id: 'audit-project-proposal-10',
          action: 'Project Proposal Entry',
          category: 'project',
          userId: 'user-043',
          userName: 'Francisco RAED',
          userEmail: 'francisco.raed@abemis.gov.ph',
          userRole: 'RAED',
          resourceType: 'project',
          resourceId: 'PRJ-026',
          ipAddress: '192.168.1.295',
          status: 'success',
          details: 'Project proposal entry created: Agricultural Extension Services Building',
          timestamp: new Date(now.getTime() - 109800000).toISOString(), // 30.5 hours ago
        },
      ]
      
      // Merge new logs with existing logs, avoiding duplicates
      const existingIds = new Set(baseLogs.map(log => log.id))
      const uniqueNewLogs = newLogs.filter(log => !existingIds.has(log.id))
      loadedLogs = [...baseLogs, ...uniqueNewLogs]
      
      localStorage.setItem('abemis-audit-logs', JSON.stringify(loadedLogs))
    }
    
    setAuditLogs(loadedLogs)
    setIsAuditLogsInitialized(true)
  }, [user?.id, loading, isAuditLogsInitialized])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not admin (only after loading is complete)
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      const redirectPath = user?.role === 'VIEWER' ? '/summary' : '/dashboard'
      router.push(redirectPath)
    }
  }, [loading, user, router])

  // Show loading or nothing while redirecting
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground">
          View and filter all system actions and user activities
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>System Actions Log</CardTitle>
                <CardDescription>
                  View and filter all system actions and user activities
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-4">
            {/* First Row: Search and Category/Status Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search actions, users, or details..."
                  value={auditLogsSearch}
                  onChange={(e) => setAuditLogsSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={auditLogsFilter} onValueChange={(value) => setAuditLogsFilter(value as typeof auditLogsFilter)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="user_management">User Management</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="system_config">System Config</SelectItem>
                  <SelectItem value="permission">Permission</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={auditLogsStatusFilter} onValueChange={(value) => setAuditLogsStatusFilter(value as typeof auditLogsStatusFilter)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Second Row: Date, Author, and Type Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={dateFilterStart}
                  onChange={(e) => setDateFilterStart(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={dateFilterEnd}
                  onChange={(e) => setDateFilterEnd(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={authorFilter} onValueChange={setAuthorFilter}>
                <SelectTrigger className="w-[200px]">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {(() => {
                    const uniqueAuthors = Array.from(new Set(auditLogs.map(log => log.userName))).sort()
                    return uniqueAuthors.map(author => (
                      <SelectItem key={author} value={author}>{author}</SelectItem>
                    ))
                  })()}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px]">
                  <Type className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {(() => {
                    const uniqueTypes = Array.from(new Set(auditLogs.map(log => log.action))).sort()
                    return uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))
                  })()}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtered Logs */}
          {(() => {
            const filteredLogs = auditLogs.filter(log => {
              const matchesSearch = !auditLogsSearch || 
                log.action.toLowerCase().includes(auditLogsSearch.toLowerCase()) ||
                log.userName.toLowerCase().includes(auditLogsSearch.toLowerCase()) ||
                log.userEmail.toLowerCase().includes(auditLogsSearch.toLowerCase()) ||
                (log.details && log.details.toLowerCase().includes(auditLogsSearch.toLowerCase()))
              const matchesCategory = auditLogsFilter === 'all' || log.category === auditLogsFilter
              const matchesStatus = auditLogsStatusFilter === 'all' || log.status === auditLogsStatusFilter
              
              // Date filter
              const logDate = new Date(log.timestamp)
              const startDate = dateFilterStart ? new Date(dateFilterStart) : null
              const endDate = dateFilterEnd ? new Date(dateFilterEnd + 'T23:59:59') : null
              const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate)
              
              // Author filter
              const matchesAuthor = authorFilter === 'all' || log.userName === authorFilter
              
              // Type filter (action type)
              const matchesType = typeFilter === 'all' || log.action === typeFilter
              
              return matchesSearch && matchesCategory && matchesStatus && matchesDate && matchesAuthor && matchesType
            })

            return filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No audit logs found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {auditLogsSearch || auditLogsFilter !== 'all' || auditLogsStatusFilter !== 'all' || dateFilterStart || dateFilterEnd || authorFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'System actions will appear here'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {log.category.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{log.userName}</p>
                            <p className="text-xs text-muted-foreground">{log.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {log.userRole}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.status === 'success' && (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Success
                            </Badge>
                          )}
                          {log.status === 'failure' && (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Failure
                            </Badge>
                          )}
                          {log.status === 'warning' && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Warning
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.ipAddress || 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {log.details || log.resourceType ? (
                            <span title={log.details || `${log.resourceType}: ${log.resourceId}`}>
                              {log.details || `${log.resourceType}: ${log.resourceId}`}
                            </span>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          })()}
        </CardContent>
      </Card>
    </div>
  )
}

