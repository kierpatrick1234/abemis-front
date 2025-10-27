'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, UserPlus, ChevronDown, ChevronUp, CheckCircle, XCircle, ArrowLeft, Zap } from 'lucide-react'
import { AbemisLogo } from '@/components/abemis-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/lib/contexts/auth-context'
import { mockUsers } from '@/lib/mock/auth'
import { GoogleRecaptcha } from '@/components/google-recaptcha'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
  captcha: z.string().optional(),
})

const signUpSchema = z.object({
  region: z.string().min(1, 'Please select a region'),
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
  captcha: z.string().min(1, 'Please solve the captcha'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions to proceed',
  }),
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
  
  // reCAPTCHA state
  const [loginRecaptchaToken, setLoginRecaptchaToken] = useState<string | null>(null)
  const [signupRecaptchaToken, setSignupRecaptchaToken] = useState<string | null>(null)
  
  // Terms and conditions state
  const [showTermsModal, setShowTermsModal] = useState(false)
  
  // Individual field validation errors
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    region: '',
    sex: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
  })
  
  // Helper function to clear specific field error
  const clearFieldError = (fieldName: keyof typeof fieldErrors) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }
  
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
    // Email validation completed
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    // reset,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
    reset: resetSignUp,
    watch: watchSignUp,
    setValue: setValueSignUp,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      acceptTerms: false,
      region: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      sex: undefined,
      password: '',
      confirmPassword: '',
      captcha: ''
    }
  })

  // Watch the acceptTerms field
  const acceptedTerms = watchSignUp('acceptTerms')
  
  // Watch password fields for matching indicator
  const watchedPassword = watchSignUp('password')
  const watchedConfirmPassword = watchSignUp('confirmPassword')
  const passwordsMatch = watchedPassword && watchedConfirmPassword && watchedPassword === watchedConfirmPassword

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const onSubmit = async (data: LoginForm) => {
    console.log('🎯 FORM SUBMIT: onSubmit function called successfully!')
    console.log('Login data received:', { email: data.email, passwordLength: data.password?.length })
    
    // Check if user is locked out
    if (isLockedOut) {
      setError(`Account is temporarily locked due to too many failed attempts. Please try again in ${Math.ceil(timeRemaining / 60000)} minutes.`)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Calling signIn function...')
      const result = await signIn(data.email, data.password)
      console.log('📡 SignIn result received:', result)
      
      if (result.success) {
        console.log('✅ Login successful - redirecting to dashboard')
        // Reset failed attempts on successful login
        setFailedAttempts(0)
        
        // Try multiple redirect methods
        console.log('🔄 Attempting redirect...')
        
        // Method 1: Router push
        router.push('/dashboard')
        
        // Method 2: Force redirect after a small delay
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 100)
      } else {
        console.log('❌ Login failed with error:', result.error)
        
        // Increment failed attempts
        const newFailedAttempts = failedAttempts + 1
        setFailedAttempts(newFailedAttempts)
        
        if (newFailedAttempts >= 5) {
          // Lock out for 2 minutes
          const lockoutEndTime = Date.now() + (2 * 60 * 1000) // 2 minutes
          setIsLockedOut(true)
          setLockoutEndTime(lockoutEndTime)
          setError('Too many failed login attempts. Your account is temporarily locked for 2 minutes for security reasons.')
        } else {
          const attemptsRemaining = 5 - newFailedAttempts
          setError(`${result.error} (${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining before lockout)`)
        }
      }
    } catch (error) {
      console.error('❌ Unexpected login error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUpSubmit = async (data: SignUpForm) => {
    console.log('🚀 Creating account for:', data.email)
    
    // Captcha validation temporarily disabled for testing
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Check if email already exists
      if (checkEmailExists(data.email)) {
        setError('This email is already registered. Please use a different email address or try logging in instead.')
        setIsLoading(false)
        return
      }
      
      // In a real app, this would call a sign-up API
      console.log('Creating new account for:', data.email)
      
      // Simulate API call with progress indication
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
      
      console.log('Registration successful! Redirecting to email verification...')
      
      // Redirect to email verification page with user data
      const params = new URLSearchParams({
        email: data.email,
        name: `${data.firstName} ${data.lastName}`.trim()
      })
      
      router.push(`/verify-email?${params.toString()}`)
    } catch (error) {
      console.error('Sign up error:', error)
      setError('Registration failed. Please check your information and try again.')
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
      {/* Back to Landing Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/landing')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 shadow-sm border border-border/50 bg-background/80 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Landing Page
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className={`w-full space-y-8 ${isSignUp ? 'max-w-4xl' : 'max-w-md'}`}>

        <div className="text-center">
          <div className="mx-auto mb-6 flex justify-center pb-4 mt-4">
            <div className="scale-[3]">
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
              <form 
                onSubmit={async (e) => {
                  e.preventDefault()
                  console.log('📝 FORM SUBMISSION STARTED!')
                  
                  // Get form data directly
                  const formData = new FormData(e.currentTarget)
                  const data = {
                    region: (document.getElementById('region') as HTMLSelectElement)?.value || '',
                    firstName: (document.getElementById('firstName') as HTMLInputElement)?.value || '',
                    middleName: (document.getElementById('middleName') as HTMLInputElement)?.value || '',
                    lastName: (document.getElementById('lastName') as HTMLInputElement)?.value || '',
                    email: (document.getElementById('signup-email') as HTMLInputElement)?.value || '',
                    sex: (document.querySelector('input[name="sex"]:checked') as HTMLInputElement)?.value || '',
                    password: (document.getElementById('signup-password') as HTMLInputElement)?.value || '',
                    confirmPassword: (document.getElementById('confirmPassword') as HTMLInputElement)?.value || '',
                    captcha: '',
                    acceptTerms: acceptedTerms === true  // Use React state instead of DOM
                  }
                  
                  console.log('📊 Form data collected successfully')
                  
                  // Clear all previous errors
                  setError(null)
                  setFieldErrors({
                    firstName: '',
                    lastName: '',
                    email: '',
                    region: '',
                    sex: '',
                    password: '',
                    confirmPassword: '',
                    acceptTerms: ''
                  })
                  
                  // Individual field validation
                  const newFieldErrors = { ...fieldErrors }
                  let hasErrors = false
                  
                  if (!data.firstName) {
                    newFieldErrors.firstName = 'First name is required'
                    hasErrors = true
                  }
                  if (!data.lastName) {
                    newFieldErrors.lastName = 'Last name is required'
                    hasErrors = true
                  }
                  if (!data.email) {
                    newFieldErrors.email = 'Email address is required'
                    hasErrors = true
                  }
                  if (!data.region) {
                    newFieldErrors.region = 'Please select your region'
                    hasErrors = true
                  }
                  if (!data.sex) {
                    newFieldErrors.sex = 'Please select your sex'
                    hasErrors = true
                  }
                  if (!data.password) {
                    newFieldErrors.password = 'Password is required'
                    hasErrors = true
                  }
                  if (!data.confirmPassword) {
                    newFieldErrors.confirmPassword = 'Please confirm your password'
                    hasErrors = true
                  }
                  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
                    newFieldErrors.confirmPassword = 'Passwords do not match'
                    hasErrors = true
                  }
                  if (!data.acceptTerms) {
                    newFieldErrors.acceptTerms = 'You must accept the Terms and Conditions'
                    hasErrors = true
                  }
                  
                  if (hasErrors) {
                    setFieldErrors(newFieldErrors)
                    return
                  }
                  
                  console.log('📝 Validation passed, calling onSignUpSubmit...')
                  
                  try {
                    await onSignUpSubmit(data as any)
                  } catch (error) {
                    console.error('📝 Form submission error:', error)
                  }
                }} 
                className="space-y-6"
              >
                <input type="hidden" {...registerSignUp('captcha')} value={signupRecaptchaToken || ''} />
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
                        onChange={(e) => {
                          registerSignUp('firstName').onChange(e)
                          clearFieldError('firstName')
                        }}
                        className={fieldErrors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-sm text-red-600">{fieldErrors.firstName}</p>
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
                        onChange={(e) => {
                          registerSignUp('lastName').onChange(e)
                          clearFieldError('lastName')
                        }}
                        className={fieldErrors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-sm text-red-600">{fieldErrors.lastName}</p>
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
                            clearFieldError('email')
                          }}
                          className={`pr-8 ${fieldErrors.email || signUpErrors.email || signUpEmailValidationStatus === 'exists' ? 'border-red-500' : signUpEmailValidationStatus === 'valid' ? 'border-green-500' : ''}`}
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
                      {fieldErrors.email && (
                        <p className="text-sm text-red-600">{fieldErrors.email}</p>
                      )}
                      {signUpErrors.email && !fieldErrors.email && (
                        <p className="text-sm text-red-600">{signUpErrors.email.message}</p>
                      )}
                      {signUpEmailValidationStatus === 'valid' && !signUpErrors.email && !fieldErrors.email && (
                        <p className="text-green-500 text-sm">✓ Email is available</p>
                      )}
                      {signUpEmailValidationStatus === 'exists' && !signUpErrors.email && !fieldErrors.email && (
                        <p className="text-red-500 text-sm">⚠ This email is already registered</p>
                      )}
                      {signUpEmailValidationStatus === 'invalid' && !signUpErrors.email && !fieldErrors.email && (
                        <p className="text-red-500 text-sm">Please enter a valid email address</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Sex *</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="sex-male"
                            name="sex"
                            value="m"
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <Label htmlFor="sex-male" className="text-sm font-normal cursor-pointer">
                            Male
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="sex-female"
                            name="sex"
                            value="f"
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <Label htmlFor="sex-female" className="text-sm font-normal cursor-pointer">
                            Female
                          </Label>
                        </div>
                      </div>
                      {fieldErrors.sex && (
                        <p className="text-sm text-red-600">{fieldErrors.sex}</p>
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
                      className={`w-full h-10 px-3 py-2 border bg-background rounded-md text-sm ${
                        fieldErrors.region 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-input'
                      }`}
                      {...registerSignUp('region')}
                      onChange={(e) => {
                        registerSignUp('region').onChange(e)
                        clearFieldError('region')
                      }}
                    >
                      <option value="">Select your region</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.region && (
                      <p className="text-sm text-red-600">{fieldErrors.region}</p>
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
                        onChange={(e) => {
                          registerSignUp('password').onChange(e)
                          clearFieldError('password')
                        }}
                        className={`pr-16 ${fieldErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : passwordsMatch ? 'border-green-500' : ''}`}
                      />
                      {passwordsMatch && (
                        <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
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
                    {fieldErrors.password && (
                      <p className="text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        {...registerSignUp('confirmPassword')}
                        onChange={(e) => {
                          registerSignUp('confirmPassword').onChange(e)
                          clearFieldError('confirmPassword')
                        }}
                        className={`pr-8 ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : passwordsMatch ? 'border-green-500' : ''}`}
                      />
                      {passwordsMatch && (
                        <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                    {!fieldErrors.confirmPassword && passwordsMatch && !signUpErrors.confirmPassword && (
                      <p className="text-sm text-green-600">✓ Passwords match</p>
                    )}
                    {!fieldErrors.confirmPassword && signUpErrors.confirmPassword && (
                      <p className="text-sm text-red-600">{signUpErrors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Registration Captcha temporarily hidden for testing */}
                {false && (
                  <GoogleRecaptcha
                    onVerify={(token) => {
                      setSignupRecaptchaToken(token)
                      setValueSignUp('captcha', token || '')
                    }}
                    onExpired={() => {
                      setSignupRecaptchaToken(null)
                      setValueSignUp('captcha', '')
                      setError('reCAPTCHA expired. Please verify again.')
                    }}
                    onError={() => {
                      setSignupRecaptchaToken(null)
                      setValueSignUp('captcha', '')
                      setError('reCAPTCHA error. Please try again.')
                    }}
                    error={signUpErrors.captcha?.message}
                  />
                )}

                {/* Terms and Conditions */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="acceptTerms" 
                      {...registerSignUp('acceptTerms')}
                      checked={acceptedTerms === true}
                      onCheckedChange={(checked) => {
                        setValueSignUp('acceptTerms', checked === true)
                      }}
                      className="mt-1"
                    />
                    <Label htmlFor="acceptTerms" className="text-sm leading-5 cursor-pointer">
                      I accept the{' '}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-sm text-primary underline"
                        onClick={() => setShowTermsModal(true)}
                      >
                        Terms and Conditions
                      </Button>
                      {' '}for registering *
                    </Label>
                  </div>
                  {fieldErrors.acceptTerms && (
                    <p className="text-sm text-red-600 ml-6">{fieldErrors.acceptTerms}</p>
                  )}
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
                      setSignupRecaptchaToken(null)
                      setValue('captcha', '')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing registration...' : 'Create Account'}
                  </Button>
                </div>

              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault()
                console.log('🚀 Form submission - replicating test button logic')
                
                // Get values directly from DOM exactly like the test button
                const email = (document.getElementById('email') as HTMLInputElement)?.value
                const password = (document.getElementById('password') as HTMLInputElement)?.value
                console.log('Direct values from DOM:', { email, password })
                
                if (email && password) {
                  onSubmit({ email, password, remember: false, captcha: '' })
                } else {
                  console.log('❌ Missing email or password in DOM')
                  setError('Please enter both email and password')
                }
              }} className="space-y-4">
                <input type="hidden" {...register('captcha')} value={loginRecaptchaToken || ''} />
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className={errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
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
                      className={errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
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

                {/* Captcha temporarily hidden for testing */}
                {false && (
                  <GoogleRecaptcha
                    onVerify={(token) => {
                      setLoginRecaptchaToken(token)
                      setValue('captcha', token || '')
                    }}
                    onExpired={() => {
                      setLoginRecaptchaToken(null)
                      setValue('captcha', '')
                      setError('reCAPTCHA expired. Please verify again.')
                    }}
                    onError={() => {
                      setLoginRecaptchaToken(null)
                      setValue('captcha', '')
                      setError('reCAPTCHA error. Please try again.')
                    }}
                    error={errors.captcha?.message}
                  />
                )}

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
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || isLockedOut}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
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
                        setSignupRecaptchaToken(null)
                        setValue('captcha', '')
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
                        setLoginRecaptchaToken(null)
                        setValue('captcha', '')
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
                          onClick={async () => {
                            // Auto-login with test credentials
                            setIsLoading(true)
                            setError(null)
                            
                            try {
                              console.log('Auto-login with:', cred.email, cred.password)
                              const result = await signIn(cred.email, cred.password)
                              console.log('Auto-login result:', result)
                              
                              if (result.success) {
                                console.log('Auto-login successful, redirecting to dashboard')
                                // Reset failed attempts on successful login
                                setFailedAttempts(0)
                                router.push('/dashboard')
                              } else {
                                console.log('Auto-login failed:', result.error)
                                setError(result.error || 'Auto-login failed')
                                setIsLoading(false)
                              }
                            } catch (error) {
                              console.error('Auto-login error:', error)
                              setError('An unexpected error occurred during auto-login')
                              setIsLoading(false)
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground flex items-center gap-1">
                              <Zap className="h-3 w-3 text-yellow-500" />
                              {cred.role}
                            </span>
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
                      Click on any credential to automatically log in
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

        {/* Terms and Conditions Modal */}
        <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Terms and Conditions</DialogTitle>
              <DialogDescription>
                Please read and understand the terms and conditions before registering.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">1. Agreement to Terms</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <h3 className="text-base font-semibold text-foreground">2. User Registration</h3>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>

                <h3 className="text-base font-semibold text-foreground">3. Privacy Policy</h3>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                </p>
                <p>
                  Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
                </p>

                <h3 className="text-base font-semibold text-foreground">4. Data Usage</h3>
                <p>
                  Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
                </p>

                <h3 className="text-base font-semibold text-foreground">5. Account Responsibilities</h3>
                <p>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
                </p>
                <p>
                  Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.
                </p>

                <h3 className="text-base font-semibold text-foreground">6. Termination</h3>
                <p>
                  Cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowTermsModal(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={() => {
                  setValueSignUp('acceptTerms', true)
                  setShowTermsModal(false)
                }}
              >
                Accept Terms
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  )
}