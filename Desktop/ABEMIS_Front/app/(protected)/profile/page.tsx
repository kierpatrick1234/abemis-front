'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
// Modal components will be implemented inline
import { 
  User, 
  Shield, 
  Bell, 
  Mail, 
  Phone, 
  MapPin, 
  Key, 
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Edit,
  Save,
  Pencil,
  Camera,
  VolumeX,
  Volume2,
  Settings,
  Calendar
} from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [showProfileSuccess, setShowProfileSuccess] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    repeatPassword: '',
    general: ''
  })
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    middleName: user?.name?.split(' ')[1] || '',
    lastName: user?.name?.split(' ')[2] || '',
    email: user?.email || '',
    region: user?.regionAssigned || 'Central Province',
    specificRoles: 'Project Management, Budget Oversight'
  })

  // Original profile data for cancel functionality
  const [originalProfileData, setOriginalProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    middleName: user?.name?.split(' ')[1] || '',
    lastName: user?.name?.split(' ')[2] || '',
    email: user?.email || '',
    region: user?.regionAssigned || 'Central Province',
    specificRoles: 'Project Management, Budget Oversight'
  })

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    passwordLastChanged: '3 months ago'
  })

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    repeatPassword: ''
  })

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    sms: false,
    muteAll: false,
    frequency: 'daily' as 'daily' | 'weekly' | 'system-alerts',
    defaultNotification: true
  })

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit mode - revert to original data
      setProfileData(originalProfileData)
    }
    setIsEditMode(!isEditMode)
  }

  const handleSaveProfile = () => {
    // Here you would typically make an API call to save the profile
    console.log('Saving profile:', profileData)
    
    // Update original data
    setOriginalProfileData(profileData)
    
    // Show success message
    setShowProfileSuccess(true)
    setIsEditMode(false)
    
    // Auto-hide success message
    setTimeout(() => {
      setShowProfileSuccess(false)
    }, 3000)
  }

  const handleAvatarChange = (newAvatarUrl: string) => {
    // Here you would typically make an API call to update the avatar
    console.log('Changing avatar to:', newAvatarUrl)
    
    // Update user avatar (in a real app, this would update the user context)
    // For now, we'll just show success
    setShowProfileSuccess(true)
    setIsAvatarModalOpen(false)
    
    // Auto-hide success message
    setTimeout(() => {
      setShowProfileSuccess(false)
    }, 3000)
  }

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleFrequencyChange = (frequency: 'daily' | 'weekly' | 'system-alerts') => {
    setNotifications(prev => ({
      ...prev,
      frequency
    }))
  }

  const handleMuteAllToggle = () => {
    setNotifications(prev => ({
      ...prev,
      muteAll: !prev.muteAll,
      // When muting all, disable other notification types
      email: prev.muteAll ? prev.email : false,
      inApp: prev.muteAll ? prev.inApp : false,
      sms: prev.muteAll ? prev.sms : false
    }))
  }

  const handleDefaultNotificationSetup = () => {
    setNotifications(prev => ({
      ...prev,
      muteAll: false,
      email: true,
      inApp: true,
      sms: false,
      frequency: 'daily',
      defaultNotification: true
    }))
  }

  const handleTwoFactorToggle = () => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }))
  }

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear errors when user starts typing
    setPasswordErrors(prev => ({
      ...prev,
      [field]: '',
      general: ''
    }))
  }

  const handlePasswordSubmit = () => {
    // Clear previous errors
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
      general: ''
    })
    
    let hasErrors = false
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
      general: ''
    }
    
    // Validate current password
    if (!passwordForm.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required'
      hasErrors = true
    }
    
    // Validate new password
    if (!passwordForm.newPassword.trim()) {
      newErrors.newPassword = 'New password is required'
      hasErrors = true
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters long'
      hasErrors = true
    }
    
    // Validate repeat password
    if (!passwordForm.repeatPassword.trim()) {
      newErrors.repeatPassword = 'Please confirm your new password'
      hasErrors = true
    } else if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match'
      hasErrors = true
    }
    
    // If there are errors, show them and return
    if (hasErrors) {
      setPasswordErrors(newErrors)
      return
    }
    
    // Here you would typically make an API call to change the password
    console.log('Changing password...', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    // Show success indicator
    setShowPasswordSuccess(true)
    
    // Update last changed date
    setSecuritySettings(prev => ({
      ...prev,
      passwordLastChanged: 'Just now'
    }))
    
    // Auto-close modal after 2 seconds
    setTimeout(() => {
      setShowPasswordSuccess(false)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
      })
      setPasswordErrors({
        currentPassword: '',
        newPassword: '',
        repeatPassword: '',
        general: ''
      })
      setIsPasswordModalOpen(false)
    }, 2000)
  }

  const handlePasswordCancel = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      repeatPassword: ''
    })
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
      general: ''
    })
    setShowPasswordSuccess(false)
    setIsPasswordModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                <Button
                  variant={isEditMode ? "outline" : "default"}
                  onClick={handleEditToggle}
                  className="flex items-center gap-2"
                >
                  {isEditMode ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                    onClick={() => setIsAvatarModalOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  {user?.role && <Badge variant="secondary" className="mt-1">{user.role}</Badge>}
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    disabled={!isEditMode}
                    className={!isEditMode ? 'bg-muted' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={profileData.middleName}
                    onChange={(e) => handleProfileUpdate('middleName', e.target.value)}
                    placeholder="Enter your middle name"
                    disabled={!isEditMode}
                    className={!isEditMode ? 'bg-muted' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    disabled={!isEditMode}
                    className={!isEditMode ? 'bg-muted' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    placeholder="Enter your email"
                    disabled={!isEditMode}
                    className={!isEditMode ? 'bg-muted' : ''}
                  />
                </div>
              </div>

              <Separator />

              {/* Non-editable fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-muted">
                    <Badge variant="secondary">{user?.role}</Badge>
                    <span className="text-sm text-muted-foreground">(Not editable)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Region Assigned</Label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-muted">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.region}</span>
                    <span className="text-sm text-muted-foreground">(Not editable)</span>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Specific Roles</Label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-muted">
                    <span>{profileData.specificRoles}</span>
                    <span className="text-sm text-muted-foreground">(Not editable)</span>
                  </div>
                </div>
              </div>

              {isEditMode && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of protection to your account
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    {securitySettings.twoFactorEnabled ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Enabled</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-600">Disabled</span>
                      </>
                    )}
                  </div>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={handleTwoFactorToggle}
                />
              </div>

              <Separator />

              {/* Password Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Last changed {securitySettings.passwordLastChanged}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mute All Notifications */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {notifications.muteAll ? (
                      <VolumeX className="h-4 w-4 text-red-600" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-green-600" />
                    )}
                    <h3 className="font-medium">Mute All Notifications</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notifications.muteAll 
                      ? "All notifications are currently muted" 
                      : "Turn off all notification types at once"
                    }
                  </p>
                </div>
                <Switch
                  checked={notifications.muteAll}
                  onCheckedChange={handleMuteAllToggle}
                />
              </div>

              <Separator />

              {/* Notification Frequency */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Notification Frequency</Label>
                  <p className="text-sm text-muted-foreground">
                    How often you want to receive notifications
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="daily"
                      name="frequency"
                      value="daily"
                      checked={notifications.frequency === 'daily'}
                      onChange={() => handleFrequencyChange('daily')}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="daily" className="flex items-center gap-2 cursor-pointer">
                      <Clock className="h-4 w-4" />
                      <span>Daily</span>
                      <span className="text-sm text-muted-foreground">- Receive notifications every day</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="weekly"
                      name="frequency"
                      value="weekly"
                      checked={notifications.frequency === 'weekly'}
                      onChange={() => handleFrequencyChange('weekly')}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="weekly" className="flex items-center gap-2 cursor-pointer">
                      <Calendar className="h-4 w-4" />
                      <span>Weekly</span>
                      <span className="text-sm text-muted-foreground">- Receive a weekly summary</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="system-alerts"
                      name="frequency"
                      value="system-alerts"
                      checked={notifications.frequency === 'system-alerts'}
                      onChange={() => handleFrequencyChange('system-alerts')}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="system-alerts" className="flex items-center gap-2 cursor-pointer">
                      <AlertTriangle className="h-4 w-4" />
                      <span>System Alerts Only</span>
                      <span className="text-sm text-muted-foreground">- Only critical system notifications</span>
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Individual Notification Types */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <h3 className="font-medium">Email Notifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationToggle('email')}
                    disabled={notifications.muteAll}
                  />
                </div>

                {/* In-App Notifications */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <h3 className="font-medium">In-App Notifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications within the application
                    </p>
                  </div>
                  <Switch
                    checked={notifications.inApp}
                    onCheckedChange={() => handleNotificationToggle('inApp')}
                    disabled={notifications.muteAll}
                  />
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <h3 className="font-medium">SMS Notifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={() => handleNotificationToggle('sms')}
                    disabled={notifications.muteAll}
                  />
                </div>
              </div>

              <Separator />

              {/* Default Notification Setup */}
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Quick Setup</h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    Apply recommended notification settings with one click
                  </p>
                  <Button 
                    onClick={handleDefaultNotificationSetup}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Apply Default Settings
                  </Button>
                  <div className="text-xs text-blue-600">
                    This will enable: Daily frequency, Email & In-App notifications, Mute all OFF
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsPasswordModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-md mx-4 bg-background border rounded-lg shadow-lg">
            <div className="p-6">
              {!showPasswordSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Change Password</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter your current password and choose a new password for your account.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                        placeholder="Enter your current password"
                        className={passwordErrors.currentPassword ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                        placeholder="Enter your new password"
                        className={passwordErrors.newPassword ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repeatPassword">Repeat New Password</Label>
                      <Input
                        id="repeatPassword"
                        type="password"
                        value={passwordForm.repeatPassword}
                        onChange={(e) => handlePasswordFormChange('repeatPassword', e.target.value)}
                        placeholder="Confirm your new password"
                        className={passwordErrors.repeatPassword ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      {passwordErrors.repeatPassword && (
                        <p className="text-sm text-red-600">{passwordErrors.repeatPassword}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={handlePasswordCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handlePasswordSubmit}>
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-green-600 mb-2">
                      Password Changed Successfully!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Your password has been updated. This modal will close automatically.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Avatar Change Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsAvatarModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-md mx-4 bg-background border rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Change Avatar</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Choose a new avatar for your profile. You can upload an image or select from presets.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input
                    id="avatar-url"
                    type="url"
                    placeholder="Enter image URL"
                    className="mb-4"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Or select from presets:</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=user4'
                    ].map((url, index) => (
                      <button
                        key={index}
                        onClick={() => handleAvatarChange(url)}
                        className="p-2 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <img src={url} alt={`Avatar ${index + 1}`} className="w-8 h-8 rounded" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAvatarModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  const urlInput = document.getElementById('avatar-url') as HTMLInputElement
                  if (urlInput?.value) {
                    handleAvatarChange(urlInput.value)
                  }
                }}>
                  <Camera className="h-4 w-4 mr-2" />
                  Update Avatar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showProfileSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Profile updated successfully!
        </div>
      )}
    </div>
  )
}
