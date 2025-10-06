'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AbemisLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  textSize?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24'
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
}

export function AbemisLogo({ 
  className, 
  size = 'md', 
  showText = true, 
  textSize = 'md' 
}: AbemisLogoProps) {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {/* Official ABEMIS 3.0 Logo Image */}
      <div className={cn('relative', sizeClasses[size])}>
        <Image
          src="/abemis-logo.png"
          alt="ABEMIS 3.0 Official Logo"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            console.log('Logo image failed to load:', e);
            // Fallback to a simple div with initials
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="w-full h-full bg-primary rounded-full flex items-center justify-center"><span class="text-primary-foreground font-bold text-lg">A</span></div>';
            }
          }}
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold text-foreground', textSizeClasses[textSize])}>
            ABEMIS 3.0
          </span>
          <span className="text-xs text-muted-foreground">
            DA-BAFE Central Office
          </span>
        </div>
      )}
    </div>
  )
}
