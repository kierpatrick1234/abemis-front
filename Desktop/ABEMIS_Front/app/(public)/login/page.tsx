'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, UserPlus, ChevronDown, ChevronUp, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { AbemisLogo } from '@/components/abemis-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/lib/contexts/auth-context'
import { mockUsers } from '@/lib/mock/auth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

const signUpSchema = z.object({
  region: z.string().min(1, 'Please select a region'),
  operatingUnit: z.string().min(1, 'Please enter operating unit'),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  sex: z.enum(['m', 'f'], { required_error: 'Please select sex' }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 
      'Password must contain letters, numbers, and special characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type LoginForm = z.infer<typeof loginSchema>
type SignUpForm = z.infer<typeof signUpSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [signUpEmailValidationStatus, setSignUpEmailValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'exists'>('idle')
  const [pendingUsers, setPendingUsers] = useState<Array<{
    id: string
    email: string
    role: string
    region?: string
    tempPassword: string
    invitedAt: string
    invitedBy: string
  }>>([])
  
  // Rate limiting state
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('')
  
  const { user, loading, signIn } = useAuth()
  const router = useRouter()

  console.log('LoginPage rendered, loading:', loading, 'user:', user)

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

  // Rate limiting is session-only (no localStorage persistence)
  // State resets on page refresh

  // Timer for lockout countdown
  useEffect(() => {
    if (isLockedOut && lockoutEndTime) {
      const timer = setInterval(() => {
        const now = Date.now()
        const remaining = Math.max(0, lockoutEndTime - now)
        setTimeRemaining(remaining)
        
        if (remaining === 0) {
          setIsLockedOut(false)
          setLockoutEndTime(null)
          setFailedAttempts(0)
          clearInterval(timer)
        }
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [isLockedOut, lockoutEndTime])

  // Helper function to format remaining time
  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Forgot password functionality
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordMessage('Please enter your email address')
      return
    }

    if (!validateEmail(forgotPasswordEmail)) {
      setForgotPasswordMessage('Please enter a valid email address')
      return
    }

    setForgotPasswordLoading(true)
    setForgotPasswordMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if email exists in the system
      const emailExists = checkEmailExists(forgotPasswordEmail)
      
      if (emailExists) {
        setForgotPasswordMessage('Password reset instructions have been sent to your email address.')
        setForgotPasswordEmail('')
        setTimeout(() => {
          setShowForgotPassword(false)
          setForgotPasswordMessage('')
        }, 3000)
      } else {
        setForgotPasswordMessage('No account found with this email address.')
      }
    } catch (error) {
      setForgotPasswordMessage('An error occurred. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  // Email validation functions
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

  const handleSignUpEmailChange = (email: string) => {
    // Real-time validation
    if (email.trim() === '') {
      setSignUpEmailValidationStatus('idle')
    } else if (!validateEmail(email)) {
      setSignUpEmailValidationStatus('invalid')
    } else if (checkEmailExists(email)) {
      setSignUpEmailValidationStatus('exists')
    } else {
      setSignUpEmailValidationStatus('valid')
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
    reset: resetSignUp,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  })

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const onSubmit = async (data: LoginForm) => {
    console.log('Form submitted with data:', data)
    
    // Check if user is locked out
    if (isLockedOut) {
      setError(`Account is temporarily locked due to too many failed attempts. Please try again in ${Math.ceil(timeRemaining / 60000)} minutes.`)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Calling signIn with:', data.email, data.password)
      const result = await signIn(data.email, data.password)
      console.log('SignIn result:', result)
      
      if (result.success) {
        console.log('Login successful, redirecting to dashboard')
        // Reset failed attempts on successful login
        setFailedAttempts(0)
        router.push('/dashboard')
      } else {
        console.log('Login failed:', result.error)
        
        // Increment failed attempts
        const newFailedAttempts = failedAttempts + 1
        setFailedAttempts(newFailedAttempts)
        
        if (newFailedAttempts >= 5) {
          // Lock out for 2 minutes
          const lockoutEndTime = Date.now() + (2 * 60 * 1000) // 2 minutes
          setIsLockedOut(true)
          setLockoutEndTime(lockoutEndTime)
          setError('Too many failed attempts. Account is locked for 2 minutes.')
        } else {
          setError(result.error || `Login failed. ${5 - newFailedAttempts} attempts remaining.`)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUpSubmit = async (data: SignUpForm) => {
    console.log('Sign up form submitted with data:', data)
    setIsLoading(true)
    setError(null)
    
    try {
      // Check if email already exists
      if (checkEmailExists(data.email)) {
        setError('This email is already registered. Please use a different email address.')
        setIsLoading(false)
        return
      }
      
      // In a real app, this would call a sign-up API
      console.log('Creating new account for:', data.email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create new user with pending status
      const newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`.trim(),
        firstName: data.firstName,
        middleName: data.middleName || '',
        lastName: data.lastName,
        role: 'RAED' as const, // Default role for self-registered users
        regionAssigned: data.region,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`
      }
      
      // Store pending user in localStorage for admin approval
      const existingPendingUsers = JSON.parse(localStorage.getItem('abemis-pending-registrations') || '[]')
      existingPendingUsers.push(newUser)
      localStorage.setItem('abemis-pending-registrations', JSON.stringify(existingPendingUsers))
      
      // Remove from pending users if they were invited
      const updatedPendingUsers = pendingUsers.filter(user => user.email.toLowerCase() !== data.email.toLowerCase())
      setPendingUsers(updatedPendingUsers)
      localStorage.setItem('abemis-pending-users', JSON.stringify(updatedPendingUsers))
      
      // Redirect to email verification page with user data
      const params = new URLSearchParams({
        email: data.email,
        name: `${data.firstName} ${data.lastName}`.trim()
      })
      
      router.push(`/verify-email?${params.toString()}`)
    } catch (error) {
      console.error('Sign up error:', error)
      setError('An unexpected error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  const regions = [
    'Region I - Ilocos Region',
    'Region II - Cagayan Valley',
    'Region III - Central Luzon',
    'Region IV-A - CALABARZON',
    'Region IV-B - MIMAROPA',
    'Region V - Bicol Region',
    'Region VI - Western Visayas',
    'Region VII - Central Visayas',
    'Region VIII - Eastern Visayas',
    'Region IX - Zamboanga Peninsula',
    'Region X - Northern Mindanao',
    'Region XI - Davao Region',
    'Region XII - SOCCSKSARGEN',
    'Region XIII - Caraga',
    'BARMM - Bangsamoro Autonomous Region in Muslim Mindanao',
    'NCR - National Capital Region'
  ]

  const testCredentials = [
    { email: 'admin@abemis.com', password: 'admin123', role: 'Admin', description: 'Full system access' },
    { email: 'engineer@abemis.com', password: 'eng123', role: 'Engineer', description: 'Project and document management' },
    { email: 'stakeholder@abemis.com', password: 'stake123', role: 'Stakeholder', description: 'View projects and documents' },
    { email: 'read@abemis.com', password: 'read123', role: 'Read Only', description: 'View-only access' },
    { email: 'manager@abemis.com', password: 'mgr123', role: 'Manager', description: 'Project oversight and analytics' },
    { email: 'supervisor@abemis.com', password: 'sup123', role: 'Supervisor', description: 'Field supervision and reporting' },
    // RAED Users - Region 1 to Region 12
    { email: 'raed-1@abemis.com', password: 'raed123', role: 'RAED-1', description: 'Region 1 - Dashboard, Projects, Settings only' },
    { email: 'raed-2@abemis.com', password: 'raed123', role: 'RAED-2', description: 'Region 2 - Dashboard, Projects, Settings only' },
    { email: 'raed-3@abemis.com', password: 'raed123', role: 'RAED-3', description: 'Region 3 - Dashboard, Projects, Settings only' },
    { email: 'raed-4@abemis.com', password: 'raed123', role: 'RAED-4', description: 'Region 4 - Dashboard, Projects, Settings only' },
    { email: 'raed-4b@abemis.com', password: 'raed123', role: 'RAED-4B', description: 'Region 4B - Dashboard, Projects, Settings only' },
    { email: 'raed-5@abemis.com', password: 'raed123', role: 'RAED-5', description: 'Region 5 - Dashboard, Projects, Settings only' },
    { email: 'raed-6@abemis.com', password: 'raed123', role: 'RAED-6', description: 'Region 6 - Dashboard, Projects, Settings only' },
    { email: 'raed-7@abemis.com', password: 'raed123', role: 'RAED-7', description: 'Region 7 - Dashboard, Projects, Settings only' },
    { email: 'raed-8@abemis.com', password: 'raed123', role: 'RAED-8', description: 'Region 8 - Dashboard, Projects, Settings only' },
    { email: 'raed-9@abemis.com', password: 'raed123', role: 'RAED-9', description: 'Region 9 - Dashboard, Projects, Settings only' },
    { email: 'raed-10@abemis.com', password: 'raed123', role: 'RAED-10', description: 'Region 10 - Dashboard, Projects, Settings only' },
    { email: 'raed-11@abemis.com', password: 'raed123', role: 'RAED-11', description: 'Region 11 - Dashboard, Projects, Settings only' },
    { email: 'raed-12@abemis.com', password: 'raed123', role: 'RAED-12', description: 'Region 12 - Dashboard, Projects, Settings only' },
    { email: 'raed-13@abemis.com', password: 'raed123', role: 'RAED-13', description: 'Region 13 - Dashboard, Projects, Settings only' },
    // Department Users
    { email: 'epdsd@abemis.com', password: 'epdsd123', role: 'EPDSD', description: 'Engineering Planning & Design Services Division - Evaluate infra/machinery proposals' },
    { email: 'sepd@abemis.com', password: 'sepd123', role: 'SEPD', description: 'Special Engineering Projects Division - Evaluate FMR proposals' },
    { email: 'ppmd@abemis.com', password: 'ppmd123', role: 'PPMD', description: 'Project Planning & Monitoring Division - Monitor completed projects' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/landing')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Landing Page
            </Button>
            <AbemisLogo size="md" textSize="sm" showText={true} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20">
        <div className={`w-full space-y-8 ${isSignUp ? 'max-w-4xl' : 'max-w-md'}`}>

        <div className="text-center">
          <div className="mx-auto mb-6 flex justify-center pb-10">
            <div className="scale-[5]">
              <AbemisLogo size="lg" showText={false} />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-foreground">
            ABEMIS 3.0
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Agricultural & Biosystems Engineering Management Information System
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isSignUp ? (
                <>
                  <UserPlus className="h-5 w-5" />
                  Create your account
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign in to your account
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Fill in your information to create an account'
                : 'Enter your credentials to access the system'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSignUp ? (
              <form onSubmit={handleSignUpSubmit(onSignUpSubmit)} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
                  
                  {/* Name Fields */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        {...registerSignUp('firstName')}
                      />
                      {signUpErrors.firstName && (
                        <p className="text-sm text-red-600">{signUpErrors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        placeholder="Enter middle name"
                        {...registerSignUp('middleName')}
                      />
                      {signUpErrors.middleName && (
                        <p className="text-sm text-red-600">{signUpErrors.middleName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        {...registerSignUp('lastName')}
                      />
                      {signUpErrors.lastName && (
                        <p className="text-sm text-red-600">{signUpErrors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email and Sex */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address *</Label>
                      <div className="relative">
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          {...registerSignUp('email')}
                          onChange={(e) => {
                            registerSignUp('email').onChange(e)
                            handleSignUpEmailChange(e.target.value)
                          }}
                          className={`pr-8 ${signUpErrors.email || signUpEmailValidationStatus === 'exists' ? 'border-red-500' : signUpEmailValidationStatus === 'valid' ? 'border-green-500' : ''}`}
                        />
                        {signUpEmailValidationStatus === 'valid' && (
                          <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {signUpEmailValidationStatus === 'exists' && (
                          <XCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                        {signUpEmailValidationStatus === 'invalid' && (
                          <XCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {signUpErrors.email && (
                        <p className="text-sm text-red-600">{signUpErrors.email.message}</p>
                      )}
                      {signUpEmailValidationStatus === 'valid' && !signUpErrors.email && (
                        <p className="text-green-500 text-sm">✓ Email is available</p>
                      )}
                      {signUpEmailValidationStatus === 'exists' && !signUpErrors.email && (
                        <p className="text-red-500 text-sm">⚠ This email is already registered</p>
                      )}
                      {signUpEmailValidationStatus === 'invalid' && !signUpErrors.email && (
                        <p className="text-red-500 text-sm">Please enter a valid email address</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sex">Sex *</Label>
                      <select
                        id="sex"
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        {...registerSignUp('sex')}
                      >
                        <option value="">Select sex</option>
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                      </select>
                      {signUpErrors.sex && (
                        <p className="text-sm text-red-600">{signUpErrors.sex.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Organization Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Organization Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region">Region/Operating Unit *</Label>
                    <select
                      id="region"
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                      {...registerSignUp('region')}
                    >
                      <option value="">Select your region</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {signUpErrors.region && (
                      <p className="text-sm text-red-600">{signUpErrors.region.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operatingUnit">Operating Unit *</Label>
                    <Input
                      id="operatingUnit"
                      placeholder="Enter your operating unit"
                      {...registerSignUp('operatingUnit')}
                    />
                    {signUpErrors.operatingUnit && (
                      <p className="text-sm text-red-600">{signUpErrors.operatingUnit.message}</p>
                    )}
                  </div>
                </div>

                {/* Account Security Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Account Security</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        {...registerSignUp('password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters with letters, numbers, and special characters
                    </p>
                    {signUpErrors.password && (
                      <p className="text-sm text-red-600">{signUpErrors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      {...registerSignUp('confirmPassword')}
                    />
                    {signUpErrors.confirmPassword && (
                      <p className="text-sm text-red-600">{signUpErrors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsSignUp(false)
                      resetSignUp()
                      setError(null)
                      setSignUpEmailValidationStatus('idle')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isLoading || signUpEmailValidationStatus === 'invalid' || signUpEmailValidationStatus === 'exists'}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" {...register('remember')} />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </Button>
                </div>

                {error && (
                  <div className={`p-3 text-sm rounded-md ${
                    error.includes('pending approval') 
                      ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                      : 'text-destructive bg-destructive/10 border border-destructive/20'
                  }`}>
                    {error}
                    {isLockedOut && timeRemaining > 0 && (
                      <div className="mt-2 text-xs">
                        Time remaining: {formatTimeRemaining(timeRemaining)}
                      </div>
                    )}
                    {error.includes('pending approval') && (
                      <div className="mt-2 text-xs text-blue-600">
                        💡 Your registration is being reviewed by an administrator. You will be notified once approved.
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  type="button" 
                  className="w-full"
                  disabled={isLoading || isLockedOut}
                  onClick={() => {
                    const formData = new FormData(document.querySelector('form') as HTMLFormElement)
                    const email = formData.get('email') as string
                    const password = formData.get('password') as string
                    onSubmit({ email, password, remember: false })
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <Button
                      variant="link"
                      onClick={() => {
                        setIsSignUp(false)
                        resetSignUp()
                        setError(null)
                        setSignUpEmailValidationStatus('idle')
                      }}
                      className="p-0 h-auto font-normal"
                    >
                      Sign in here
                    </Button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{' '}
                    <Button
                      variant="link"
                      onClick={() => {
                        setIsSignUp(true)
                        setSignUpEmailValidationStatus('idle')
                      }}
                      className="p-0 h-auto font-normal"
                    >
                      Sign up here
                    </Button>
                  </>
                )}
              </p>
            </div>

            {/* Test Credentials Section - Only show on login form */}
            {!isSignUp && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {showCredentials ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Hide Test Credentials
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show Test Credentials
                    </>
                  )}
                </Button>
                
                {showCredentials && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="text-sm font-medium mb-3">Test Credentials for Different Roles:</h4>
                    <div className="space-y-2">
                      {testCredentials.map((cred, index) => (
                        <div 
                          key={index} 
                          className="text-xs space-y-1 p-2 bg-background rounded border cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => {
                            // Auto-fill the form
                            const emailInput = document.getElementById('email') as HTMLInputElement
                            const passwordInput = document.getElementById('password') as HTMLInputElement
                            if (emailInput) emailInput.value = cred.email
                            if (passwordInput) passwordInput.value = cred.password
                            // Trigger form validation
                            emailInput?.dispatchEvent(new Event('input', { bubbles: true }))
                            passwordInput?.dispatchEvent(new Event('input', { bubbles: true }))
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{cred.role}</span>
                            <span className="text-muted-foreground">{cred.description}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Email:</span>
                              <span className="ml-1 font-mono">{cred.email}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Password:</span>
                              <span className="ml-1 font-mono">{cred.password}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Click on any credential to auto-fill the login form
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forgot Password Dialog */}
        <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email Address</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
              </div>
              
              {forgotPasswordMessage && (
                <div className={`p-3 text-sm rounded-md ${
                  forgotPasswordMessage.includes('sent') 
                    ? 'text-green-600 bg-green-50 border border-green-200' 
                    : 'text-red-600 bg-red-50 border border-red-200'
                }`}>
                  {forgotPasswordMessage}
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setForgotPasswordEmail('')
                    setForgotPasswordMessage('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleForgotPassword}
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  )
}
