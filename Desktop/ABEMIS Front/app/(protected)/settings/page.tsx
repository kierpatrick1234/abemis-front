'use client'

import { useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { RoleBadge } from '@/components/role-badge'
import { useAuth } from '@/lib/contexts/auth-context'
import { 
  User, 
  Settings as SettingsIcon, 
  Info, 
  Moon, 
  Sun,
  Save,
  Bell,
  Shield
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [email, setEmail] = useState(user?.email || '')
  const [name, setName] = useState(user?.name || '')

  const handleSave = useCallback(() => {
    // In a real app, this would save to the backend
    console.log('Settings saved')
  }, [])

  const handleThemeChange = useCallback((newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
  }, [setTheme])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center space-x-2">
                  {user?.role && <RoleBadge role={user.role} />}
                  <Badge variant="outline" className="text-xs">
                    Read-only
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your role is managed by system administrators
                </p>
              </div>

              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Account Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage your account security settings
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange('light')}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange('dark')}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Theme Preferences</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-blue-500"></div>
                      <div className="h-8 w-8 rounded-full bg-green-500 border"></div>
                      <div className="h-8 w-8 rounded-full bg-purple-500 border"></div>
                      <div className="h-8 w-8 rounded-full bg-orange-500 border"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Project Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when projects are updated
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Document Reviews</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about document review requests
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">System Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about system maintenance and alerts
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About ABEMIS 3.0</CardTitle>
              <CardDescription>
                System information and version details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Version</Label>
                  <p className="text-sm">3.0.0</p>
                </div>
                <div className="space-y-2">
                  <Label>Build</Label>
                  <p className="text-sm">2024.01.15</p>
                </div>
                <div className="space-y-2">
                  <Label>Environment</Label>
                  <p className="text-sm">Development</p>
                </div>
                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <p className="text-sm">January 15, 2024</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>System Information</Label>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Agricultural & Biosystems Engineering Management Information System</p>
                  <p>Built with Next.js, React, TypeScript, and Tailwind CSS</p>
                  <p>UI components powered by shadcn/ui</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Check for Updates
                </Button>
                <Button variant="outline" size="sm">
                  View Changelog
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
