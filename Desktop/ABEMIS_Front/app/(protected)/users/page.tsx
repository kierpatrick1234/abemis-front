'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockUsers } from '@/lib/mock/auth'
import { User, Role, InviteUserData, AddUserData } from '@/lib/types'
import { AuthorizationGuard } from '@/components/authorization-guard'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  Mail, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react'

function UsersPageContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')
  const [roleFilters, setRoleFilters] = useState<Role[]>([])
  const [regionFilters, setRegionFilters] = useState<string[]>([])
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [editUserData, setEditUserData] = useState<AddUserData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    regionAssigned: '',
    role: 'RAED',
    password: '',
    repeatPassword: ''
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isInviteSuccess, setIsInviteSuccess] = useState(false)
  const [isAddUserSuccess, setIsAddUserSuccess] = useState(false)
  const [emailValidationStatus, setEmailValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'exists'>('idle')
  const [addUserEmailValidationStatus, setAddUserEmailValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'exists'>('idle')
  const [pendingUsers, setPendingUsers] = useState<Array<{
    id: string
    email: string
    role: Role
    region?: string
    tempPassword: string
    invitedAt: string
    invitedBy: string
  }>>([])
  const [pendingRegistrations, setPendingRegistrations] = useState<User[]>([])
  const [inviteData, setInviteData] = useState<InviteUserData>({
    email: '',
    role: 'RAED',
    region: ''
  })
  const [addUserData, setAddUserData] = useState<AddUserData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    regionAssigned: '',
    role: 'RAED',
    password: '',
    repeatPassword: ''
  })
  const [deletedUserIds, setDeletedUserIds] = useState<Set<string>>(new Set())

  // Load pending users from localStorage on component mount
  useEffect(() => {
    const storedPendingUsers = localStorage.getItem('abemis-pending-users')
    if (storedPendingUsers) {
      try {
        setPendingUsers(JSON.parse(storedPendingUsers))
      } catch (error) {
        console.error('Error parsing stored pending users:', error)
      }
    }
  }, [])

  // Load pending registrations from localStorage on component mount
  useEffect(() => {
    const storedPendingRegistrations = localStorage.getItem('abemis-pending-registrations')
    if (storedPendingRegistrations) {
      try {
        setPendingRegistrations(JSON.parse(storedPendingRegistrations))
      } catch (error) {
        console.error('Error parsing stored pending registrations:', error)
      }
    }
  }, [])

  const availableRoles: Role[] = ['superadmin', 'RAED', 'EPDSD', 'PPMD', 'SEPD']
  const regions = [
    'NCR', 'BARMM', 'Region 1', 'Region 2', 'Region 3', 'Region 4A', 'Region 4B', 
    'Region 5', 'Region 6', 'Region 7', 'Region 8', 'Region 9', 'Region 10', 
    'Region 11', 'Region 12', 'Region 13'
  ]

  const filteredUsers = useMemo(() => {
    // Combine regular users, pending users, and pending registrations
    const allUsers = [
      ...mockUsers.map(user => ({ ...user, isPending: false, isRegistration: false })),
      ...pendingUsers.map(pendingUser => ({
        id: pendingUser.id,
        email: pendingUser.email,
        name: 'Pending User',
        role: pendingUser.role,
        avatar: '/avatars/pending.jpg',
        status: 'pending' as const,
        lastLogin: null,
        createdAt: pendingUser.invitedAt,
        regionAssigned: pendingUser.region || 'TBD',
        isPending: true,
        isRegistration: false,
        tempPassword: pendingUser.tempPassword,
        invitedAt: pendingUser.invitedAt,
        invitedBy: pendingUser.invitedBy
      })),
      ...pendingRegistrations.map(registration => ({
        ...registration,
        isPending: false,
        isRegistration: true
      }))
    ]
    
    return allUsers.filter(user => {
      // Exclude deleted users
      if (deletedUserIds.has(user.id)) {
        return false
      }
      
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.regionAssigned?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesRole = roleFilters.length === 0 || roleFilters.includes(user.role)
      const matchesRegion = regionFilters.length === 0 || (user.regionAssigned && regionFilters.includes(user.regionAssigned))
      
      return matchesSearch && matchesStatus && matchesRole && matchesRegion
    })
  }, [searchQuery, statusFilter, roleFilters, regionFilters, deletedUserIds, pendingUsers])


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const checkEmailExists = (email: string) => {
    // Check against registered users
    const existsInRegistered = mockUsers.some(user => user.email.toLowerCase() === email.toLowerCase())
    
    // Check against pending users (temporarily added)
    const existsInPending = pendingUsers.some(user => user.email.toLowerCase() === email.toLowerCase())
    
    return existsInRegistered || existsInPending
  }

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleEmailChange = (email: string) => {
    setInviteData(prev => ({ ...prev, email }))
    
    // Clear previous validation errors
    if (validationErrors.email) {
      setValidationErrors({})
    }
    
    // Real-time validation
    if (email.trim() === '') {
      setEmailValidationStatus('idle')
    } else if (!validateEmail(email)) {
      setEmailValidationStatus('invalid')
    } else if (checkEmailExists(email)) {
      setEmailValidationStatus('exists')
    } else {
      setEmailValidationStatus('valid')
    }
  }

  const handleAddUserEmailChange = (email: string) => {
    setAddUserData(prev => ({ ...prev, email }))
    
    // Clear previous validation errors
    if (validationErrors.email) {
      setValidationErrors({})
    }
    
    // Real-time validation
    if (email.trim() === '') {
      setAddUserEmailValidationStatus('idle')
    } else if (!validateEmail(email)) {
      setAddUserEmailValidationStatus('invalid')
    } else if (checkEmailExists(email)) {
      setAddUserEmailValidationStatus('exists')
    } else {
      setAddUserEmailValidationStatus('valid')
    }
  }

  const validateAddUserForm = () => {
    const errors: Record<string, string> = {}
    
    if (!addUserData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    if (!addUserData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    if (!addUserData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(addUserData.email)) {
      errors.email = 'Please enter a valid email address'
    } else if (checkEmailExists(addUserData.email)) {
      errors.email = 'This email is already registered'
    }
    if (!addUserData.regionAssigned) {
      errors.regionAssigned = 'Region assignment is required'
    }
    if (!addUserData.password) {
      errors.password = 'Password is required'
    } else if (addUserData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (addUserData.password !== addUserData.repeatPassword) {
      errors.repeatPassword = 'Passwords do not match'
    }
    
    return errors
  }

  const handleInviteSubmit = () => {
    if (!validateEmail(inviteData.email)) {
      setValidationErrors({ email: 'Please enter a valid email address' })
      setEmailValidationStatus('invalid')
      return
    }
    
    if (checkEmailExists(inviteData.email)) {
      setValidationErrors({ email: 'This email is already registered' })
      setEmailValidationStatus('exists')
      return
    }
    
    // Validate region for RAED role
    if (inviteData.role === 'RAED' && !inviteData.region) {
      setValidationErrors({ region: 'Region is required for RAED role' })
      return
    }
    
    // Generate temporary password
    const tempPassword = generateTempPassword()
    const newPendingUser = {
      id: `pending-${Date.now()}`,
      email: inviteData.email,
      role: inviteData.role,
      region: inviteData.region,
      tempPassword: tempPassword,
      invitedAt: new Date().toISOString(),
      invitedBy: 'System Administrator' // In a real app, this would be the current user
    }
    
    // Add to pending users list
    const updatedPendingUsers = [...pendingUsers, newPendingUser]
    setPendingUsers(updatedPendingUsers)
    
    // Store in localStorage for cross-page access
    localStorage.setItem('abemis-pending-users', JSON.stringify(updatedPendingUsers))
    
    console.log('Inviting user:', inviteData)
    console.log('Temporary password:', tempPassword)
    setIsInviteSuccess(true)
    setValidationErrors({})
    setEmailValidationStatus('idle')
    setInviteData({ email: '', role: 'RAED', region: '' })
    setTimeout(() => {
      setIsInviteSuccess(false)
      setIsInviteModalOpen(false)
    }, 5000) // Increased timeout to give user time to copy password
  }

  const handleAddUserSubmit = () => {
    const errors = validateAddUserForm()
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    console.log('Adding user:', addUserData)
    setIsAddUserSuccess(true)
    setAddUserData({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      regionAssigned: '',
      role: 'RAED',
      password: '',
      repeatPassword: ''
    })
    setValidationErrors({})
    setTimeout(() => {
      setIsAddUserSuccess(false)
      setIsAddUserModalOpen(false)
    }, 2000)
  }

  const handleEditUserSubmit = () => {
    console.log('Editing user:', editUserData)
    setShowSuccessMessage(true)
    setSuccessMessage('User updated successfully!')
    setIsEditModalOpen(false)
    setSelectedUser(null)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleDeleteUserSubmit = () => {
    if (deleteEmail === selectedUser?.email) {
      if (selectedUser) {
        setDeletedUserIds(prev => {
          const newSet = new Set<string>()
          prev.forEach(id => newSet.add(id))
          newSet.add(selectedUser.id)
          return newSet
        })
        setShowSuccessMessage(true)
        setSuccessMessage(`User ${selectedUser.name} has been temporarily deleted. Refresh the page to restore.`)
        setIsDeleteModalOpen(false)
        setSelectedUser(null)
        setDeleteEmail('')
        setTimeout(() => setShowSuccessMessage(false), 5000)
      }
    } else {
      alert('Email does not match. Please enter the correct email address.')
    }
  }

  const handleEditUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setEditUserData({
        firstName: user.name.split(' ')[0] || '',
        middleName: user.name.split(' ')[1] || '',
        lastName: user.name.split(' ').slice(2).join(' ') || '',
        email: user.email,
        regionAssigned: user.regionAssigned || '',
        role: user.role,
        password: '',
        repeatPassword: ''
      })
      setIsEditModalOpen(true)
    }
  }

  const handleDeleteUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId)
    const pendingUser = pendingUsers.find(u => u.id === userId)
    
    if (user) {
      setSelectedUser(user)
      setDeleteEmail('')
      setIsDeleteModalOpen(true)
    } else if (pendingUser) {
      // Handle pending user deletion
      const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId)
      setPendingUsers(updatedPendingUsers)
      
      // Update localStorage
      localStorage.setItem('abemis-pending-users', JSON.stringify(updatedPendingUsers))
      
      setShowSuccessMessage(true)
      setSuccessMessage(`Invitation for ${pendingUser.email} has been cancelled.`)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }
  }

  const getStatusBadge = (status: 'active' | 'inactive' | 'pending') => {
    if (status === 'active') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    } else if (status === 'inactive') {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    }
  }

  const getRoleBadge = (role: Role) => {
    const colors = {
      superadmin: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      RAED: 'bg-blue-100 text-blue-800',
      EPDSD: 'bg-green-100 text-green-800',
      PPMD: 'bg-orange-100 text-orange-800',
      SEPD: 'bg-pink-100 text-pink-800',
      engineer: 'bg-cyan-100 text-cyan-800',
      stakeholder: 'bg-yellow-100 text-yellow-800',
      read: 'bg-gray-100 text-gray-800',
      manager: 'bg-indigo-100 text-indigo-800',
      supervisor: 'bg-teal-100 text-teal-800'
    }
    
    return (
      <Badge variant="secondary" className={colors[role] || 'bg-gray-100 text-gray-800'}>
        {role}
      </Badge>
    )
  }

  // Approval functions for pending registrations
  const handleApproveUser = (userId: string) => {
    const registration = pendingRegistrations.find(r => r.id === userId)
    if (registration) {
      // Move user from pending registrations to approved users
      const approvedUser = {
        ...registration,
        status: 'active' as const,
        lastLogin: undefined
      }
      
      // Add to mockUsers (in a real app, this would be a database operation)
      mockUsers.push(approvedUser)
      
      // Remove from pending registrations
      const updatedPendingRegistrations = pendingRegistrations.filter(r => r.id !== userId)
      setPendingRegistrations(updatedPendingRegistrations)
      localStorage.setItem('abemis-pending-registrations', JSON.stringify(updatedPendingRegistrations))
      
      setShowSuccessMessage(true)
      setSuccessMessage('User approved successfully!')
    }
  }

  const handleRejectUser = (userId: string) => {
    const registration = pendingRegistrations.find(r => r.id === userId)
    if (registration) {
      // Remove from pending registrations
      const updatedPendingRegistrations = pendingRegistrations.filter(r => r.id !== userId)
      setPendingRegistrations(updatedPendingRegistrations)
      localStorage.setItem('abemis-pending-registrations', JSON.stringify(updatedPendingRegistrations))
      
      setShowSuccessMessage(true)
      setSuccessMessage('User registration rejected.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsInviteModalOpen(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Invite User
          </Button>
          <Button onClick={() => setIsAddUserModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          {deletedUserIds.size > 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                setDeletedUserIds(new Set())
                setShowSuccessMessage(true)
                setSuccessMessage('All deleted users have been restored!')
                setTimeout(() => setShowSuccessMessage(false), 3000)
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Restore All ({deletedUserIds.size})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'pending')}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                value={roleFilters.length > 0 ? roleFilters[0] : 'all'}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === 'all') {
                    setRoleFilters([])
                  } else {
                    setRoleFilters([value as Role])
                  }
                }}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Roles</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Region</Label>
              <select
                value={regionFilters.length > 0 ? regionFilters[0] : 'all'}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === 'all') {
                    setRegionFilters([])
                  } else {
                    setRegionFilters([value])
                  }
                }}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setRoleFilters([])
                  setRegionFilters([])
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Manage user accounts and permissions
            {deletedUserIds.size > 0 && (
              <span className="text-amber-600 ml-2">
                • {deletedUserIds.size} user(s) temporarily deleted (refresh to restore)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Region</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Last Login</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                          {user.isPending && (
                            <div className="text-xs text-yellow-600">
                              Invited by Admin
                            </div>
                          )}
                          {user.isRegistration && (
                            <div className="text-xs text-blue-600">
                              Self-registered - Pending Approval
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{user.email}</div>
                      {user.isPending && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            Temp: temp123
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {user.regionAssigned}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {user.isPending ? (
                          <span>Invited {new Date(user.createdAt).toLocaleDateString()}</span>
                        ) : (
                          <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.isPending ? (
                            <>
                              <DropdownMenuItem 
                                onClick={() => {
                                  navigator.clipboard.writeText('temp123')
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Copy Temp Password
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel Invitation
                              </DropdownMenuItem>
                            </>
                          ) : user.isRegistration ? (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleApproveUser(user.id)}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve User
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleRejectUser(user.id)}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Registration
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsInviteModalOpen(false)} />
          <div className="relative z-50 w-full max-w-md mx-4 bg-background border rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Invite User</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                {isInviteSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="text-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-800 mb-1">Invitation Sent Successfully!</h3>
                      <p className="text-green-700 text-sm">
                        An invitation has been sent to {inviteData.email}
                      </p>
                    </div>
                    
                    <div className="bg-white border border-green-300 rounded-md p-3 mb-3">
                      <h4 className="font-medium text-gray-800 mb-2">Temporary Login Credentials:</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Email:</span>
                          <p className="text-sm font-mono bg-gray-100 p-2 rounded">{inviteData.email}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Temporary Password:</span>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-mono bg-gray-100 p-2 rounded flex-1" id="temp-password">
                              {pendingUsers[pendingUsers.length - 1] ? 'temp123' : 'Generating...'}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const passwordElement = document.getElementById('temp-password')
                                if (passwordElement) {
                                  navigator.clipboard.writeText(passwordElement.textContent || '')
                                }
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        ⚠️ Please share these credentials securely with the invited user. They should change their password upon first login.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="invite-email">Email</Label>
                      <div className="relative">
                        <Input
                          id="invite-email"
                          type="email"
                          value={inviteData.email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          placeholder="Enter email address"
                          className={`pr-8 ${validationErrors.email || emailValidationStatus === 'exists' ? 'border-red-500' : emailValidationStatus === 'valid' ? 'border-green-500' : ''}`}
                        />
                        {emailValidationStatus === 'valid' && (
                          <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {emailValidationStatus === 'exists' && (
                          <XCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                        {emailValidationStatus === 'invalid' && inviteData.email.trim() !== '' && (
                          <XCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm">{validationErrors.email}</p>
                      )}
                      {emailValidationStatus === 'valid' && !validationErrors.email && (
                        <p className="text-green-500 text-sm">✓ Email is available</p>
                      )}
                      {emailValidationStatus === 'exists' && !validationErrors.email && (
                        <p className="text-red-500 text-sm">⚠ This email is already registered</p>
                      )}
                      {emailValidationStatus === 'invalid' && inviteData.email.trim() !== '' && !validationErrors.email && (
                        <p className="text-red-500 text-sm">Please enter a valid email address</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invite-role">Role</Label>
                      <select
                        id="invite-role"
                        value={inviteData.role}
                        onChange={(e) => {
                          const selectedRole = e.target.value as Role
                          setInviteData(prev => ({ 
                            ...prev, 
                            role: selectedRole,
                            region: selectedRole === 'RAED' ? prev.region : '' // Clear region if not RAED
                          }))
                        }}
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    {inviteData.role === 'RAED' && (
                      <div className="space-y-2">
                        <Label htmlFor="invite-region">Region *</Label>
                        <select
                          id="invite-region"
                          value={inviteData.region || ''}
                          onChange={(e) => setInviteData(prev => ({ ...prev, region: e.target.value }))}
                          className={`w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm ${validationErrors.region ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select region</option>
                          {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                        {validationErrors.region && (
                          <p className="text-red-500 text-sm">{validationErrors.region}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {!isInviteSuccess && (
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => {
                    setIsInviteModalOpen(false)
                    setValidationErrors({})
                    setEmailValidationStatus('idle')
                    setInviteData({ email: '', role: 'RAED', region: '' })
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleInviteSubmit}
                    disabled={
                      !inviteData.email.trim() || 
                      emailValidationStatus === 'invalid' || 
                      emailValidationStatus === 'exists' ||
                      (inviteData.role === 'RAED' && !inviteData.region)
                    }
                  >
                    Send Invite
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddUserModalOpen(false)} />
          <div className="relative z-50 w-full max-w-lg mx-4 bg-background border rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Add User</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                {isAddUserSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-800 mb-1">User Created Successfully!</h3>
                    <p className="text-green-700 text-sm">
                      The user has been added to the system
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="add-firstName">First Name *</Label>
                        <Input
                          id="add-firstName"
                          value={addUserData.firstName}
                          onChange={(e) => setAddUserData(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="First name"
                          className={validationErrors.firstName ? 'border-red-500' : ''}
                        />
                        {validationErrors.firstName && (
                          <p className="text-red-500 text-sm">{validationErrors.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-middleName">Middle Name</Label>
                        <Input
                          id="add-middleName"
                          value={addUserData.middleName}
                          onChange={(e) => setAddUserData(prev => ({ ...prev, middleName: e.target.value }))}
                          placeholder="Middle name"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {!isAddUserSuccess && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="add-lastName">Last Name *</Label>
                      <Input
                        id="add-lastName"
                        value={addUserData.lastName}
                        onChange={(e) => setAddUserData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Last name"
                        className={validationErrors.lastName ? 'border-red-500' : ''}
                      />
                      {validationErrors.lastName && (
                        <p className="text-red-500 text-sm">{validationErrors.lastName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="add-email">Email *</Label>
                      <div className="relative">
                        <Input
                          id="add-email"
                          type="email"
                          value={addUserData.email}
                          onChange={(e) => handleAddUserEmailChange(e.target.value)}
                          placeholder="Email address"
                          className={`pr-8 ${validationErrors.email || addUserEmailValidationStatus === 'exists' ? 'border-red-500' : addUserEmailValidationStatus === 'valid' ? 'border-green-500' : ''}`}
                        />
                        {addUserEmailValidationStatus === 'valid' && (
                          <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {addUserEmailValidationStatus === 'exists' && (
                          <XCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                        {addUserEmailValidationStatus === 'invalid' && addUserData.email.trim() !== '' && (
                          <XCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm">{validationErrors.email}</p>
                      )}
                      {addUserEmailValidationStatus === 'valid' && !validationErrors.email && (
                        <p className="text-green-500 text-sm">✓ Email is available</p>
                      )}
                      {addUserEmailValidationStatus === 'exists' && !validationErrors.email && (
                        <p className="text-red-500 text-sm">⚠ This email is already registered</p>
                      )}
                      {addUserEmailValidationStatus === 'invalid' && addUserData.email.trim() !== '' && !validationErrors.email && (
                        <p className="text-red-500 text-sm">Please enter a valid email address</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="add-region">Region Assigned *</Label>
                      <select
                        id="add-region"
                        value={addUserData.regionAssigned}
                        onChange={(e) => setAddUserData(prev => ({ ...prev, regionAssigned: e.target.value }))}
                        className={`w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm ${validationErrors.regionAssigned ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select region</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      {validationErrors.regionAssigned && (
                        <p className="text-red-500 text-sm">{validationErrors.regionAssigned}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="add-role">Role</Label>
                      <select
                        id="add-role"
                        value={addUserData.role}
                        onChange={(e) => setAddUserData(prev => ({ ...prev, role: e.target.value as Role }))}
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="add-password">Password *</Label>
                      <Input
                        id="add-password"
                        type="password"
                        value={addUserData.password}
                        onChange={(e) => setAddUserData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Password"
                        className={validationErrors.password ? 'border-red-500' : ''}
                      />
                      {validationErrors.password && (
                        <p className="text-red-500 text-sm">{validationErrors.password}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="add-repeatPassword">Repeat Password *</Label>
                      <Input
                        id="add-repeatPassword"
                        type="password"
                        value={addUserData.repeatPassword}
                        onChange={(e) => setAddUserData(prev => ({ ...prev, repeatPassword: e.target.value }))}
                        placeholder="Confirm password"
                        className={validationErrors.repeatPassword ? 'border-red-500' : ''}
                      />
                      {validationErrors.repeatPassword && (
                        <p className="text-red-500 text-sm">{validationErrors.repeatPassword}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {!isAddUserSuccess && (
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => {
                    setIsAddUserModalOpen(false)
                    setAddUserEmailValidationStatus('idle')
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddUserSubmit}
                    disabled={!addUserData.email.trim() || addUserEmailValidationStatus === 'invalid' || addUserEmailValidationStatus === 'exists'}
                  >
                    Add User
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative z-50 w-full max-w-lg mx-4 bg-background border rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Edit User</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-firstName">First Name</Label>
                    <Input
                      id="edit-firstName"
                      value={editUserData.firstName}
                      onChange={(e) => setEditUserData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-middleName">Middle Name</Label>
                    <Input
                      id="edit-middleName"
                      value={editUserData.middleName}
                      onChange={(e) => setEditUserData(prev => ({ ...prev, middleName: e.target.value }))}
                      placeholder="Middle name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    value={editUserData.lastName}
                    onChange={(e) => setEditUserData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Last name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editUserData.email}
                    onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-region">Region Assigned</Label>
                  <select
                    id="edit-region"
                    value={editUserData.regionAssigned}
                    onChange={(e) => setEditUserData(prev => ({ ...prev, regionAssigned: e.target.value }))}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select region</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <select
                    id="edit-role"
                    value={editUserData.role}
                    onChange={(e) => setEditUserData(prev => ({ ...prev, role: e.target.value as Role }))}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-password">New Password (Optional)</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={editUserData.password}
                    onChange={(e) => setEditUserData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                
                {editUserData.password && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-repeatPassword">Confirm New Password</Label>
                    <Input
                      id="edit-repeatPassword"
                      type="password"
                      value={editUserData.repeatPassword}
                      onChange={(e) => setEditUserData(prev => ({ ...prev, repeatPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditUserSubmit}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative z-50 w-full max-w-md mx-4 bg-background border rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-red-600">Delete User</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="font-semibold text-red-800">Warning: This action cannot be undone!</h3>
                  </div>
                  <p className="text-red-700 text-sm">
                    You are about to permanently delete the user <strong>{selectedUser.name}</strong>. 
                    This will remove all their data and access to the system.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delete-email">Confirm by typing the user's email</Label>
                  <Input
                    id="delete-email"
                    type="email"
                    value={deleteEmail}
                    onChange={(e) => setDeleteEmail(e.target.value)}
                    placeholder={`Type "${selectedUser.email}" to confirm`}
                    className="border-red-300 focus:border-red-500"
                  />
                  <p className="text-sm text-muted-foreground">
                    Type <strong>{selectedUser.email}</strong> to confirm deletion
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteUserSubmit}
                  disabled={deleteEmail !== selectedUser.email}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function UsersPage() {
  return (
    <AuthorizationGuard allowedRoles={['admin']}>
      <UsersPageContent />
    </AuthorizationGuard>
  )
}
