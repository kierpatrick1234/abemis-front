'use client'

import { NotificationTemplate } from '@/components/notification-template'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, MapPin } from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'

export default function NotificationsPage() {
  const { user } = useAuth()
  const raedRegions = [
    'Region I - Ilocos Region',
    'Region II - Cagayan Valley', 
    'Region III - Central Luzon',
    'Region IV-A - CALABARZON',
    'Region V - Bicol Region'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          {user?.role === 'VIEWER' 
            ? 'National summary and reporting notifications' 
            : 'Department notifications for RAED accounts'}
        </p>
      </div>

      {user?.role === 'VIEWER' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              National Summary Notifications
            </CardTitle>
            <CardDescription>
              Updates on national project summaries, reports, and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationTemplate raedRegion="National" userRole={user?.role} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {raedRegions.map((region) => (
            <Card key={region} className="w-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {region}
                </CardTitle>
                <CardDescription>
                  RAED notifications for this region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationTemplate raedRegion={region} userRole={user?.role} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Features
          </CardTitle>
          <CardDescription>
            Key features of the notification system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Department Notifications</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong className="text-blue-700">EPDSD</strong> - Engineering and Planning</li>
                <li>• <strong className="text-blue-700">SEPD</strong> - Special Engineering Projects</li>
                <li>• <strong className="text-blue-700">PPMD</strong> - Project Planning and Monitoring</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Notification Types</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <Badge variant="outline" className="text-green-600">APPROVAL</Badge> - Project approvals</li>
                <li>• <Badge variant="outline" className="text-orange-600">REMARK</Badge> - Comments and remarks</li>
                <li>• <Badge variant="outline" className="text-blue-600">MONITORING</Badge> - Project monitoring</li>
                <li>• <Badge variant="outline" className="text-purple-600">UPDATE</Badge> - Status updates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
