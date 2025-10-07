export type Role = 'admin' | 'engineer' | 'stakeholder' | 'read' | 'manager' | 'supervisor' | 'superadmin' | 'RAED' | 'EPDSD' | 'PPMD' | 'SEPD'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  avatar?: string
  firstName?: string
  middleName?: string
  lastName?: string
  regionAssigned?: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin?: string
  createdAt: string
}

export interface Session {
  user: User
  token: string
  expiresAt: number
}

export interface Project {
  id: string
  title: string
  type: 'FMR' | 'Infrastructure' | 'Machinery'
  province: string
  region?: string
  status: 'Proposal' | 'Procurement' | 'Implementation' | 'Completed'
  description: string
  budget: number
  startDate: string
  endDate?: string
  updatedAt: string
  assignedTo?: string
  // Procurement fields
  budgetYear?: string
  bidOpeningDate?: string
  noticeOfAwardDate?: string
  noticeToProceedDate?: string
  procurementDocuments?: {
    bidOpening?: string
    noticeOfAward?: string
    noticeToProceed?: string
  }
}

export interface Document {
  id: string
  name: string
  linkedProject: string
  uploadedBy: string
  date: string
  status: 'Validated' | 'For Review' | 'Missing'
  type: string
  size: string
  url?: string
}

export interface Activity {
  id: string
  type: 'project_created' | 'document_uploaded' | 'status_changed' | 'comment_added'
  title: string
  description: string
  timestamp: string
  user: string
  projectId?: string
}

export interface StatCard {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: string
}

export interface NavItem {
  title: string
  href: string
  icon: string
  roles: Role[]
}

export interface InviteUserData {
  email: string
  role: Role
  region?: string
}

export interface AddUserData {
  firstName: string
  middleName: string
  lastName: string
  email: string
  regionAssigned: string
  role: Role
  password: string
  repeatPassword: string
}
