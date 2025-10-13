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
  status: 'Draft' | 'Proposal' | 'Procurement' | 'Implementation' | 'Completed' | 'Inventory' | 'For Delivery' | 'Delivered'
  description: string
  budget: number
  startDate: string
  endDate?: string
  updatedAt: string
  assignedTo?: string
  evaluator?: string
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
  // Completed stage fields for RAED
  dateCompleted?: string
  dateTurnedOver?: string
  asBuiltPlans?: {
    cad?: string
    pdf?: string
  }
  postGeotaggedPhotos?: string[]
  // Infrastructure project specific fields
  projectClassification?: string
  projectType?: string
  implementationDays?: string
  prexcProgram?: string
  prexcSubProgram?: string
  budgetProcess?: string
  proposedFundSource?: string
  sourceAgency?: string
  bannerProgram?: string
  fundingYear?: string
  municipality?: string
  district?: string
  barangay?: string
  documents?: Array<{
    file: File
    label: string
    id: string
  }>
  // Machinery-specific fields
  deliveryDate?: string
  inspectionDate?: string
  inspectorName?: string
  machineBrand?: string
  engineType?: string
  engineSerialNumber?: string
  chasisSerialNumber?: string
  ratedPower?: string
  capacity?: string
  remarks?: string
  // Delivered stage fields
  dateTurnover?: string
  representativeBeneficiary?: string
  beneficiaryNumber?: string
  geotagPhotos?: string[]
  proofOfTurnover?: string[]
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
