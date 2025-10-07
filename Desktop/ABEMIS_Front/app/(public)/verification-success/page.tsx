'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function VerificationSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const timer = setTimeout(() => {
      router.push('/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Email Verified!</h1>
          <p className="text-muted-foreground mt-2">
            Your account has been successfully activated
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Welcome!
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Account Successfully Activated</span>
                </div>
                <p className="text-sm text-green-700">
                  Your email has been verified and your account is now ready to use.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">✓</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Ready to get started</p>
                    <p className="text-sm text-muted-foreground">You can now access all features of ABEMIS 3.0</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">What you can do now:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sign in to your account</p>
                    <p className="text-xs text-muted-foreground">Use your email and password to log in</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Access the dashboard</p>
                    <p className="text-xs text-muted-foreground">View your projects and manage your work</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Start collaborating</p>
                    <p className="text-xs text-muted-foreground">Connect with your team and begin your projects</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  You will be automatically redirected to the login page in a few seconds.
                </p>
              </div>

              <Link href="/login">
                <Button className="w-full" size="lg">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue to Login
                </Button>
              </Link>
            </div>

            <Separator />

            <div className="text-center">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Welcome to ABEMIS 3.0!</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  You now have full access to all system features and can start managing your projects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
