import { User, Session, Role } from '../types'
import { getRAEDName } from './raed-assignments'

const SESSION_KEY = 'abemis_session'

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@abemis.com',
    name: 'System Administrator',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    status: 'active',
    lastLogin: '2025-08-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'engineer@abemis.com',
    name: 'John Engineer',
    role: 'engineer',
    avatar: '/avatars/engineer.jpg',
    status: 'active',
    lastLogin: '2025-09-22T14:20:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'stakeholder@abemis.com',
    name: 'Jane Stakeholder',
    role: 'stakeholder',
    avatar: '/avatars/stakeholder.jpg',
    status: 'active',
    lastLogin: '2025-07-28T16:45:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    email: 'read@abemis.com',
    name: 'Read Only User',
    role: 'read',
    avatar: '/avatars/read.jpg',
    status: 'active',
    lastLogin: '2025-10-02T11:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    email: 'manager@abemis.com',
    name: 'Project Manager',
    role: 'manager',
    avatar: '/avatars/manager.jpg',
    status: 'active',
    lastLogin: '2025-08-30T13:20:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    email: 'supervisor@abemis.com',
    name: 'Field Supervisor',
    role: 'supervisor',
    avatar: '/avatars/supervisor.jpg',
    status: 'active',
    lastLogin: '2025-09-15T08:10:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  // RAED Users - Region 1
  {
    id: 'raed-1',
    email: 'raed-1@abemis.com',
    name: getRAEDName('Region 1'),
    role: 'RAED',
    regionAssigned: 'Region 1',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed1',
  },
  // RAED Users - Region 2
  {
    id: 'raed-2',
    email: 'raed-2@abemis.com',
    name: getRAEDName('Region 2'),
    role: 'RAED',
    regionAssigned: 'Region 2',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed2',
  },
  // RAED Users - Region 3
  {
    id: 'raed-3',
    email: 'raed-3@abemis.com',
    name: getRAEDName('Region 3'),
    role: 'RAED',
    regionAssigned: 'Region 3',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed3',
  },
  // RAED Users - Region 4
  {
    id: 'raed-4',
    email: 'raed-4@abemis.com',
    name: getRAEDName('Region 4'),
    role: 'RAED',
    regionAssigned: 'Region 4',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed4',
  },
  // RAED Users - Region 4B
  {
    id: 'raed-4b',
    email: 'raed-4b@abemis.com',
    name: getRAEDName('Region 4B'),
    role: 'RAED',
    regionAssigned: 'Region 4B',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed4b',
  },
  // RAED Users - Region 5
  {
    id: 'raed-5',
    email: 'raed-5@abemis.com',
    name: getRAEDName('Region 5'),
    role: 'RAED',
    regionAssigned: 'Region 5',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed5',
  },
  // RAED Users - Region 6
  {
    id: 'raed-6',
    email: 'raed-6@abemis.com',
    name: getRAEDName('Region 6'),
    role: 'RAED',
    regionAssigned: 'Region 6',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed6',
  },
  // RAED Users - Region 7
  {
    id: 'raed-7',
    email: 'raed-7@abemis.com',
    name: getRAEDName('Region 7'),
    role: 'RAED',
    regionAssigned: 'Region 7',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed7',
  },
  // RAED Users - Region 8
  {
    id: 'raed-8',
    email: 'raed-8@abemis.com',
    name: getRAEDName('Region 8'),
    role: 'RAED',
    regionAssigned: 'Region 8',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed8',
  },
  // RAED Users - Region 9
  {
    id: 'raed-9',
    email: 'raed-9@abemis.com',
    name: getRAEDName('Region 9'),
    role: 'RAED',
    regionAssigned: 'Region 9',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed9',
  },
  // RAED Users - Region 10
  {
    id: 'raed-10',
    email: 'raed-10@abemis.com',
    name: getRAEDName('Region 10'),
    role: 'RAED',
    regionAssigned: 'Region 10',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed10',
  },
  // RAED Users - Region 11
  {
    id: 'raed-11',
    email: 'raed-11@abemis.com',
    name: getRAEDName('Region 11'),
    role: 'RAED',
    regionAssigned: 'Region 11',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed11',
  },
  // RAED Users - Region 12
  {
    id: 'raed-12',
    email: 'raed-12@abemis.com',
    name: getRAEDName('Region 12'),
    role: 'RAED',
    regionAssigned: 'Region 12',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed12',
  },
  // RAED Users - Region 13
  {
    id: 'raed-13',
    email: 'raed-13@abemis.com',
    name: getRAEDName('Region 13'),
    role: 'RAED',
    regionAssigned: 'Region 13',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raed13',
  },
  // RAED Users - NIR (Negros Island Region)
  {
    id: 'raed-nir',
    email: 'raed-nir@abemis.com',
    name: getRAEDName('NIR'),
    role: 'RAED',
    regionAssigned: 'NIR',
    status: 'active',
    lastLogin: '2025-08-20T09:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raednir',
  },
  // EPDSD User
  {
    id: 'epdsd-1',
    email: 'epdsd@abemis.com',
    name: 'Maria Santos',
    role: 'EPDSD',
    status: 'active',
    lastLogin: '2025-09-10T08:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=epdsd1',
  },
  // PPMD User
  {
    id: 'ppmd-1',
    email: 'ppmd@abemis.com',
    name: 'Jose Garcia',
    role: 'PPMD',
    status: 'active',
    lastLogin: '2025-07-15T07:45:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ppmd1',
  },
  // SEPD User
  {
    id: 'sepd-1',
    email: 'sepd@abemis.com',
    name: 'Ana Rodriguez',
    role: 'SEPD',
    status: 'active',
    lastLogin: '2025-10-05T09:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sepd1',
  },
  // VIEWER User (National Viewer)
  {
    id: 'viewer-1',
    email: 'viewer@abemis.com',
    name: 'National Viewer',
    role: 'VIEWER',
    status: 'active',
    lastLogin: '2025-10-10T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer1',
  },
]

// Credentials mapping for easy testing
export const mockCredentials = {
  'admin@abemis.com': { password: 'admin123', role: 'admin' },
  'engineer@abemis.com': { password: 'eng123', role: 'engineer' },
  'stakeholder@abemis.com': { password: 'stake123', role: 'stakeholder' },
  'read@abemis.com': { password: 'read123', role: 'read' },
  'manager@abemis.com': { password: 'mgr123', role: 'manager' },
  'supervisor@abemis.com': { password: 'sup123', role: 'supervisor' },
  // RAED Users - Region 1 to Region 13
  'raed-1@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-2@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-3@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-4@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-4b@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-5@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-6@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-7@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-8@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-9@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-10@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-11@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-12@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-13@abemis.com': { password: 'raed123', role: 'RAED' },
  'raed-nir@abemis.com': { password: 'raed123', role: 'RAED' },
  // New role users
  'epdsd@abemis.com': { password: 'epdsd123', role: 'EPDSD' },
  'ppmd@abemis.com': { password: 'ppmd123', role: 'PPMD' },
  'sepd@abemis.com': { password: 'sepd123', role: 'SEPD' },
  'viewer@abemis.com': { password: 'viewer123', role: 'VIEWER' },
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  
  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return null
    
    const session = JSON.parse(sessionData) as Session
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    
    return session
  } catch {
    return null
  }
}

export function signIn(email: string, password: string): { success: boolean; user?: User; error?: string } {
  console.log('🔐 signIn called with:', email, '(password length:', password?.length, ')')
  
  // Check if email exists in credentials
  const credentials = mockCredentials[email as keyof typeof mockCredentials]
  
  if (!credentials) {
    console.log('❌ Email not found in credentials')
    // Check if user exists in pending registrations
    if (typeof window !== 'undefined') {
      const pendingRegistrations = JSON.parse(localStorage.getItem('abemis-pending-registrations') || '[]')
      const pendingUser = pendingRegistrations.find((u: User) => u.email === email)
      
      if (pendingUser) {
        return { 
          success: false, 
          error: 'Your account is pending approval. Please wait for an administrator to approve your registration before you can log in.' 
        }
      }
    }
    
    return { success: false, error: 'Invalid email address. Please check your email and try again.' }
  }
  
  console.log('✅ Email found, checking password...')
  console.log('Expected password:', credentials.password)
  console.log('Provided password:', password)
  
  // Check if password matches
  if (credentials.password !== password) {
    console.log('❌ Password mismatch')
    return { success: false, error: 'Invalid password, please try again' }
  }
  
  console.log('✅ Password matches!')
  
  // Find user by email instead of role to get the specific user
  const user = mockUsers.find(u => u.email === email)
  
  if (!user) {
    return { success: false, error: 'User not found' }
  }
  
  // Check if user is approved (not pending)
  if (user.status === 'pending') {
    return { success: false, error: 'Your account is pending approval. Please contact an administrator.' }
  }
  
  // Check if user is active
  if (user.status === 'inactive') {
    return { success: false, error: 'Your account has been deactivated. Please contact an administrator.' }
  }
  
  return { success: true, user }
}

export function saveSession(user: User): void {
  if (typeof window === 'undefined') return
  
  const session: Session = {
    user,
    token: `mock_token_${user.id}_${Date.now()}`,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function signOut(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}

export function hasPermission(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole)
}
