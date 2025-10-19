import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowRight, 
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Smartphone
} from 'lucide-react'

// Design 4: Clean Corporate Layout
export function Design4({ 
  handleLoginClick, 
  trackingCode, 
  setTrackingCode, 
  trackingResult, 
  handleTrackingSearch, 
  downloadReport, 
  features, 
  stats, 
  projectStats,
  availableProjects
}: any) {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center space-y-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Official DA-BAFE System
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                ABEMIS 3.0
                <span className="block text-2xl md:text-3xl font-normal text-primary mt-4">
                  Agricultural & Biosystems Engineering Management Information System
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Streamlining agricultural infrastructure project management across the Philippines through 
                comprehensive digital solutions for planning, implementation, and monitoring.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button 
                onClick={() => handleLoginClick('Access System')}
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                type="button"
              >
                Access System
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/20 text-primary hover:bg-primary/5 transition-all duration-300"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">System Overview</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive management of agricultural infrastructure projects nationwide
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat: any, index: number) => (
              <div key={index} className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl mx-auto">
                  <div className="text-primary-foreground">
                    {stat.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Tracking Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Project Status Tracker
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Monitor your agricultural infrastructure projects with real-time status updates and progress tracking.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 shadow-xl border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                  <Search className="h-6 w-6 text-primary" />
                  Track Project Status
                </CardTitle>
                <CardDescription className="text-base">
                  Enter your project code or select from available projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter project tracking reference"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="flex-1 border-primary/20 focus:border-primary"
                    />
                    <Button onClick={handleTrackingSearch} className="px-8 bg-primary hover:bg-primary/90">
                      <Search className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">Or select from available projects:</span>
                  </div>
                  <Select value={trackingCode} onValueChange={setTrackingCode}>
                    <SelectTrigger className="w-full border-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select a project to track" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProjects.map((project: any) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.id} - {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {trackingResult && (
                  <div className="space-y-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">{trackingResult.title}</h3>
                        <p className="text-sm text-muted-foreground">{trackingResult.region}</p>
                        <p className="text-sm text-muted-foreground">{trackingResult.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={trackingResult.status === 'Completed' ? 'default' : 'secondary'} className="bg-primary text-primary-foreground">
                              {trackingResult.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Type</span>
                            <span className="text-sm font-medium">{trackingResult.type}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Budget</span>
                            <span className="text-sm font-semibold">₱{trackingResult.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Start Date</span>
                            <span className="text-sm font-medium">{new Date(trackingResult.startDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${trackingResult.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{trackingResult.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Project Milestones</h4>
                      <div className="space-y-2">
                        {trackingResult.milestones.map((milestone: any, index: number) => {
                          const milestoneDate = new Date(milestone.date)
                          const now = new Date()
                          const daysAgo = Math.floor((now.getTime() - milestoneDate.getTime()) / (1000 * 60 * 60 * 24))
                          
                          return (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                              {milestone.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div className="flex-1">
                                <span className={milestone.completed ? 'text-green-700 font-medium' : 'text-muted-foreground'}>
                                  {milestone.name}
                                </span>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">
                                    {milestone.date}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {daysAgo > 0 ? `${daysAgo} days ago` : 'Today'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {trackingCode && !trackingResult && (
                  <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-700">Project not found. Please check your tracking code.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              System Capabilities
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive digital tools for managing agricultural infrastructure projects, 
              farm-to-market roads, and engineering initiatives across the Philippines.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature: any, index: number) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-0 bg-gradient-to-br from-white to-primary/5">
                <CardHeader className="pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <div className="text-primary-foreground">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground leading-tight">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/90">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Access ABEMIS?
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Join authorized personnel in managing agricultural infrastructure projects 
              and monitoring implementations across the Philippines.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Button 
              onClick={() => handleLoginClick('Login to System')}
              size="lg" 
              variant="secondary"
              className="transition-all duration-200 transform hover:scale-105 shadow-lg"
              type="button"
            >
              Login to System
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Mobile Access
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
