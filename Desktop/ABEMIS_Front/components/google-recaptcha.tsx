'use client'

import { useEffect, useRef, useState } from 'react'
import { Label } from '@/components/ui/label'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (container: string | HTMLElement, parameters: {
        sitekey: string
        callback?: (token: string) => void
        'expired-callback'?: () => void
        'error-callback'?: () => void
        theme?: 'light' | 'dark'
        size?: 'normal' | 'compact' | 'invisible'
      }) => number
      reset: (widgetId?: number) => void
      getResponse: (widgetId?: number) => string
    }
  }
}

interface GoogleRecaptchaProps {
  onVerify: (token: string | null) => void
  onExpired?: () => void
  onError?: () => void
  siteKey?: string
  error?: string
  className?: string
  theme?: 'light' | 'dark'
  size?: 'normal' | 'compact'
}

export function GoogleRecaptcha({ 
  onVerify, 
  onExpired,
  onError,
  siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", // Test site key fallback
  error,
  className,
  theme = 'light',
  size = 'normal'
}: GoogleRecaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    // Check if reCAPTCHA script is already loaded
    if (window.grecaptcha) {
      setIsLoaded(true)
      return
    }

    // Load reCAPTCHA script
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.defer = true
    
    script.onload = () => {
      setIsLoaded(true)
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  useEffect(() => {
    if (isLoaded && window.grecaptcha && recaptchaRef.current) {
      window.grecaptcha.ready(() => {
        if (recaptchaRef.current && widgetIdRef.current === null) {
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              setIsVerified(true)
              onVerify(token)
            },
            'expired-callback': () => {
              setIsVerified(false)
              onVerify(null)
              onExpired?.()
            },
            'error-callback': () => {
              setIsVerified(false)
              onVerify(null)
              onError?.()
            },
            theme,
            size
          })
        }
      })
    }
  }, [isLoaded, siteKey, onVerify, onExpired, onError, theme, size])

  const resetCaptcha = () => {
    if (window.grecaptcha && widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current)
      setIsVerified(false)
      onVerify(null)
    }
  }

  // Expose reset function to parent components
  useEffect(() => {
    // Store reset function on the element for external access
    if (recaptchaRef.current) {
      (recaptchaRef.current as any).resetCaptcha = resetCaptcha
    }
  }, [])

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>Security Verification *</Label>
      <div 
        ref={recaptchaRef}
        className="flex justify-start"
      />
      {!isLoaded && (
        <div className="flex items-center justify-center p-4 border rounded-md bg-muted">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
          <span className="text-sm text-muted-foreground">Loading reCAPTCHA...</span>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <p className="text-xs text-muted-foreground">
        Please complete the reCAPTCHA verification to continue
      </p>
    </div>
  )
}

// Utility function to get current reCAPTCHA response
export const getCurrentRecaptchaResponse = () => {
  if (window.grecaptcha) {
    return window.grecaptcha.getResponse()
  }
  return null
}

// Utility function to reset reCAPTCHA
export const resetRecaptcha = (element?: HTMLElement) => {
  if (element && (element as any).resetCaptcha) {
    (element as any).resetCaptcha()
  } else if (window.grecaptcha) {
    window.grecaptcha.reset()
  }
}
