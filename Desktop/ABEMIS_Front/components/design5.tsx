import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowRight, 
  BarChart3, 
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Smartphone,
  PieChart
} from 'lucide-react'

// Design 5: Clean Dashboard Style (duplicated from Design3 without background image)
export function Design5({ 
  handleLoginClick, 
  trackingCode, 
  setTrackingCode, 
  trackingResult, 
  handleTrackingSearch, 
  downloadReport, 
  features, 
  stats, 
  projectStats,
  availableProjects,
  isVisible,
  scrollAnimations,
  scrollToDashboard,
  dashboardRef
}: any) {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-primary/5 via-background to-muted/30">
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className={`text-4xl md:text-5xl font-bold text-foreground leading-tight transition-all duration-1000 ease-out transform ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}>
                  ABEMIS 3.0
                  <span className={`block text-2xl md:text-3xl font-semibold text-primary mt-2 transition-all duration-1000 ease-out transform delay-300 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-12'
                  }`}>
                    Agricultural & Biosystems Engineering Management Information System
                  </span>
                </h1>
                <p className={`text-lg text-muted-foreground leading-relaxed transition-all duration-1000 ease-out transform delay-500 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}>
                  Official information system of the Department of Agriculture - 
                  Bureau of Agricultural and Fisheries Engineering (DA-BAFE) Central Office, 
                  designed to manage agricultural infrastructure projects across the Philippines.
                </p>
              </div>
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 ease-out transform delay-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}>
                <Button 
                  onClick={() => handleLoginClick('Access System')}
                  size="lg" 
                  className="transition-all duration-300 transform hover:scale-105"
                  type="button"
                >
                  Access System
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={scrollToDashboard}
                  className="border-border text-foreground bg-background hover:bg-muted transition-all duration-300 transform hover:scale-105"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="flex justify-end">
              <div className="grid grid-cols-2 gap-4 max-w-md">
              {stats.map((stat: any, index: number) => (
                <Card 
                  key={index} 
                  className={`p-6 text-center hover:shadow-lg transition-all duration-1000 ease-out bg-background/80 backdrop-blur-md border border-border transform hover:scale-105 hover:bg-background ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{
                    transitionDelay: `${900 + (index * 200)}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                    <div className="text-primary">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section ref={dashboardRef} className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Project Status Distribution */}
            <Card 
              data-animate
              id="project-status"
              className={`p-6 transition-all duration-1000 ease-out transform ${
                scrollAnimations['project-status'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Project Status</h3>
              </div>
              <div className="space-y-4">
                {projectStats.statusDistribution.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{item.count}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Project Types */}
            <Card 
              data-animate
              id="project-types"
              className={`p-6 transition-all duration-1000 ease-out transform delay-200 ${
                scrollAnimations['project-types'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Project Types</h3>
              </div>
              <div className="space-y-4">
                {projectStats.projectTypes.map((item: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className="text-xs text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Tracking Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate
            id="tracking-header"
            className={`text-center mb-12 space-y-4 transition-all duration-1000 ease-out transform ${
              scrollAnimations['tracking-header'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <h2 className="text-3xl font-bold text-foreground">
              Project Tracking Dashboard
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter your project tracking code to view real-time status, progress, and milestones.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card 
              data-animate
              id="tracking-card"
              className={`p-6 transition-all duration-1000 ease-out transform delay-300 ${
                scrollAnimations['tracking-card'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter project tracking reference"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleTrackingSearch} className="px-8">
                      <Search className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">Or select from available projects:</span>
                  </div>
                  <Select value={trackingCode} onValueChange={setTrackingCode}>
                    <SelectTrigger className="w-full">
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
                  <div className="space-y-6 p-6 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{trackingResult.title}</h3>
                        <p className="text-sm text-muted-foreground">{trackingResult.region}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={trackingResult.status === 'Completed' ? 'default' : 'secondary'}>
                          {trackingResult.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">₱{trackingResult.budget.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">{trackingResult.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${trackingResult.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Project Milestones</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {trackingResult.milestones.map((milestone: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {milestone.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={milestone.completed ? 'text-green-700' : 'text-muted-foreground'}>
                              {milestone.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {trackingCode && !trackingResult && (
                  <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-red-700 text-sm">Project not found. Please check your tracking code.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate
            id="features-header"
            className={`text-center mb-12 space-y-4 transition-all duration-1000 ease-out transform ${
              scrollAnimations['features-header'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <h2 className="text-3xl font-bold text-foreground">
              System Capabilities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for managing agricultural infrastructure projects.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature: any, index: number) => (
              <Card 
                key={index} 
                data-animate
                id={`feature-${index}`}
                className={`p-6 hover:shadow-lg transition-all duration-1000 ease-out transform hover:scale-105 ${
                  scrollAnimations[`feature-${index}`] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                    {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Access the ABEMIS System
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Authorized personnel can access the system to manage projects and monitor implementations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleLoginClick('Login to System')}
              size="lg" 
              variant="secondary"
              className="transition-all duration-200 transform hover:scale-105"
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
