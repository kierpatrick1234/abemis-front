'use client'

import { useState, useMemo } from 'react'
import * as XLSX from 'xlsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StatCard } from '@/components/stat-card'
import { raedSpecificProjects } from '@/lib/mock/raed-specific-projects'
import { Project } from '@/lib/types'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart,
  Activity,
  Target,
  Calendar,
  DollarSign,
  MapPin,
  Filter,
  Download,
  Eye,
  CheckCircle,
  PlayCircle,
  ShoppingCart,
  FileText,
  Package,
  Building2,
  Wrench,
  Route,
  ArrowUpRight,
  ArrowDownRight,
  LineChart as LineChartIcon,
  Search,
  X,
  Globe,
  FolderOpen,
  Clock
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const regions = [
  'All Regions',
  'Region 1', 'Region 2', 'Region 3', 'Region 4', 'Region 4B',
  'Region 5', 'Region 6', 'Region 7', 'Region 8', 'Region 9',
  'Region 10', 'Region 11', 'Region 12', 'Region 13', 'NIR'
]

const projectTypes = ['All Types', 'FMR', 'Infrastructure', 'Machinery', 'Project Package']
const years = ['All Years', '2023', '2024', '2025', '2026', '2027']
const graphYears = ['All Years', '2023', '2024', '2025', '2026', '2027']

// Project templates for generating additional projects
const projectTemplates = {
  FMR: [
    'Farm Mechanization Program', 'Agricultural Training Center', 'Modern Farming Equipment Distribution',
    'Crop Production Enhancement', 'Agricultural Extension Services', 'Farm-to-Market Road Development',
    'Agricultural Research Station', 'Seed Production Facility', 'Organic Farming Initiative',
    'Agricultural Cooperative Support', 'Farm Equipment Maintenance Center', 'Agricultural Technology Transfer'
  ],
  Infrastructure: [
    'Rural Water Supply System', 'Irrigation Infrastructure', 'Rural Electrification Project',
    'Road and Bridge Construction', 'Community Health Center', 'School Building Construction',
    'Market Development Project', 'Flood Control System', 'Drainage System Improvement',
    'Community Center Construction', 'Public Transportation Hub', 'Telecommunications Infrastructure'
  ],
  Machinery: [
    'Heavy Equipment Procurement', 'Agricultural Machinery Distribution', 'Construction Equipment Program',
    'Industrial Machinery Installation', 'Transportation Fleet Development', 'Processing Equipment Setup',
    'Maintenance Equipment Program', 'Specialized Machinery Training', 'Equipment Rental Program',
    'Machinery Repair Services', 'Industrial Equipment Upgrade', 'Agricultural Processing Machinery'
  ]
}

const regionProvinces: Record<string, string[]> = {
  'Region 1': ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
  'Region 2': ['Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino'],
  'Region 3': ['Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales', 'Aurora'],
  'Region 4': ['Batangas', 'Cavite', 'Laguna', 'Quezon', 'Rizal'],
  'Region 4B': ['Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Romblon'],
  'Region 5': ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon'],
  'Region 6': ['Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo'],
  'Region 7': ['Bohol', 'Cebu'],
  'NIR': ['Negros Occidental', 'Negros Oriental', 'Siquijor'],
  'Region 8': ['Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte'],
  'Region 9': ['Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay'],
  'Region 10': ['Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental'],
  'Region 11': ['Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental', 'Davao de Oro'],
  'Region 12': ['Cotabato', 'Sarangani', 'South Cotabato', 'Sultan Kudarat'],
  'Region 13': ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur']
}

// Generate additional random projects to ensure 50-250 projects
function generateAdditionalProjects(baseProjects: Project[], targetMin: number = 50, targetMax: number = 250): Project[] {
  const currentCount = baseProjects.length
  const allRegions = regions.slice(1) // Exclude 'All Regions'
  const allTypes: Array<'FMR' | 'Infrastructure' | 'Machinery'> = ['FMR', 'Infrastructure', 'Machinery']
  const statuses: Array<'Draft' | 'Proposal' | 'Procurement' | 'Implementation' | 'Completed' | 'For Delivery' | 'Delivered'> = 
    ['Draft', 'Proposal', 'Procurement', 'Implementation', 'Completed', 'For Delivery', 'Delivered']
  
  // Determine how many projects to generate
  let projectsToGenerate = 0
  if (currentCount < targetMin) {
    // Generate enough to reach at least targetMin, but randomize between targetMin and targetMax
    const randomTarget = Math.floor(Math.random() * (targetMax - targetMin + 1)) + targetMin
    projectsToGenerate = Math.max(randomTarget - currentCount, 0)
  } else if (currentCount < targetMax) {
    // Randomly decide if we should add more projects up to targetMax
    const shouldAddMore = Math.random() > 0.3 // 70% chance to add more
    if (shouldAddMore) {
      projectsToGenerate = Math.floor(Math.random() * (targetMax - currentCount + 1))
    }
  }
  
  if (projectsToGenerate === 0) {
    return baseProjects
  }
  
  const additionalProjects: Project[] = []
  const startId = baseProjects.length + 1
  
  for (let i = 0; i < projectsToGenerate; i++) {
    const region = allRegions[Math.floor(Math.random() * allRegions.length)]
    const type = allTypes[Math.floor(Math.random() * allTypes.length)]
    const template = projectTemplates[type][Math.floor(Math.random() * projectTemplates[type].length)]
    const provinces = regionProvinces[region] || ['Unknown Province']
    const province = provinces[Math.floor(Math.random() * provinces.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    // Generate random dates between 2023 and 2027
    const startYear = 2023 + Math.floor(Math.random() * 5) // 2023-2027
    const startMonth = Math.floor(Math.random() * 12)
    const startDay = Math.floor(Math.random() * 28) + 1
    const startDate = new Date(startYear, startMonth, startDay).toISOString().split('T')[0]
    
    // Generate end date for completed/delivered projects (30-365 days after start)
    let endDate: string | undefined
    if (status === 'Completed' || status === 'Delivered') {
      const duration = Math.floor(Math.random() * 335) + 30
      const end = new Date(startDate)
      end.setDate(end.getDate() + duration)
      endDate = end.toISOString().split('T')[0]
    }
    
    // Generate random budget between 2M and 50M
    const budget = Math.floor(Math.random() * 48000000) + 2000000
    
    // Generate updated date (between start date and now)
    const updatedAt = new Date(
      new Date(startDate).getTime() + Math.random() * (Date.now() - new Date(startDate).getTime())
    ).toISOString()
    
    const project: Project = {
      id: `PRJ-${String(startId + i).padStart(4, '0')}`,
      title: `${template} - ${region}`,
      type,
      province,
      region,
      status,
      description: `This is a ${type.toLowerCase()} project in ${province}, ${region}.`,
      budget,
      startDate,
      endDate,
      updatedAt,
      assignedTo: `RAED - ${region}`
    }
    
    additionalProjects.push(project)
  }
  
  return [...baseProjects, ...additionalProjects]
}

export default function SummaryPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions')
  const [selectedType, setSelectedType] = useState<string>('All Types')
  const [selectedYear, setSelectedYear] = useState<string>('All Years')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All Periods')
  const [viewMode, setViewMode] = useState<'overview' | 'regional' | 'detailed'>('overview')
  const [graphYearFilter, setGraphYearFilter] = useState<string>('All Years')
  const [graphQuarterFilter, setGraphQuarterFilter] = useState<string>('All Quarters')

  // Get all projects (national view) with additional generated projects (50-250 range)
  const allProjects = useMemo(() => {
    return generateAdditionalProjects(raedSpecificProjects, 50, 250)
  }, [])

  // Filter projects based on selections
  const filteredProjects = useMemo(() => {
    let filtered = [...allProjects]

    if (selectedRegion !== 'All Regions') {
      filtered = filtered.filter(p => p.region === selectedRegion)
    }

    if (selectedType !== 'All Types') {
      filtered = filtered.filter(p => p.type === selectedType)
    }

    if (selectedYear !== 'All Years') {
      filtered = filtered.filter(p => {
        const projectYear = new Date(p.startDate).getFullYear().toString()
        if (projectYear !== selectedYear) return false
        
        // Apply quarterly/semestral filter if selected
        if (selectedPeriod !== 'All Periods') {
          const projectDate = new Date(p.startDate)
          const month = projectDate.getMonth() + 1 // 1-12
          
          if (selectedPeriod === 'Q1') {
            return month >= 1 && month <= 3
          } else if (selectedPeriod === 'Q2') {
            return month >= 4 && month <= 6
          } else if (selectedPeriod === 'Q3') {
            return month >= 7 && month <= 9
          } else if (selectedPeriod === 'Q4') {
            return month >= 10 && month <= 12
          } else if (selectedPeriod === '1st Semester') {
            return month >= 1 && month <= 6
          } else if (selectedPeriod === '2nd Semester') {
            return month >= 7 && month <= 12
          }
        }
        
        return true
      })
    }

    return filtered
  }, [allProjects, selectedRegion, selectedType, selectedYear, selectedPeriod])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProjects = filteredProjects.length
    const totalBudget = filteredProjects.reduce((sum, p) => sum + p.budget, 0)
    const implementedProjects = filteredProjects.filter(p => 
      p.status === 'Completed' || p.status === 'Implementation' || p.status === 'Delivered'
    ).length
    const completedProjects = filteredProjects.filter(p => 
      p.status === 'Completed' || p.status === 'Delivered'
    ).length
    
    // Budget utilized (assuming 60% average utilization for active projects)
    const activeProjects = filteredProjects.filter(p => 
      p.status === 'Implementation' || p.status === 'Procurement'
    )
    const completedBudget = filteredProjects
      .filter(p => p.status === 'Completed' || p.status === 'Delivered')
      .reduce((sum, p) => sum + p.budget, 0)
    const activeBudgetUtilized = activeProjects.reduce((sum, p) => sum + p.budget * 0.6, 0)
    const budgetUtilized = completedBudget + activeBudgetUtilized
    const budgetUtilizationRate = totalBudget > 0 ? (budgetUtilized / totalBudget) * 100 : 0

    // Project type breakdown
    const fmrProjects = filteredProjects.filter(p => p.type === 'FMR').length
    const infrastructureProjects = filteredProjects.filter(p => p.type === 'Infrastructure').length
    const machineryProjects = filteredProjects.filter(p => p.type === 'Machinery').length
    const packageProjects = filteredProjects.filter(p => p.type === 'Project Package').length

    return {
      totalProjects,
      totalBudget,
      implementedProjects,
      completedProjects,
      budgetUtilized,
      budgetUtilizationRate,
      fmrProjects,
      infrastructureProjects,
      machineryProjects,
      packageProjects
    }
  }, [filteredProjects])

  // Regional statistics
  const regionalStats = useMemo(() => {
    const regionData = regions.slice(1).map(region => {
      const regionProjects = allProjects.filter(p => p.region === region)
      const totalBudget = regionProjects.reduce((sum, p) => sum + p.budget, 0)
      const completed = regionProjects.filter(p => p.status === 'Completed' || p.status === 'Delivered').length
      const inProgress = regionProjects.filter(p => 
        p.status === 'Implementation' || p.status === 'Procurement'
      ).length
      const completionRate = regionProjects.length > 0 
        ? (completed / regionProjects.length) * 100 
        : 0

      return {
        region,
        totalProjects: regionProjects.length,
        totalBudget,
        completed,
        inProgress,
        completionRate,
        projects: regionProjects
      }
    })

    return regionData.sort((a, b) => b.totalProjects - a.totalProjects)
  }, [allProjects])

  // Status distribution
  const statusDistribution = useMemo(() => {
    const statuses = [
      { status: 'Completed', count: filteredProjects.filter(p => p.status === 'Completed' || p.status === 'Delivered').length, color: 'bg-green-500' },
      { status: 'Implementation', count: filteredProjects.filter(p => p.status === 'Implementation').length, color: 'bg-blue-500' },
      { status: 'Procurement', count: filteredProjects.filter(p => p.status === 'Procurement').length, color: 'bg-yellow-500' },
      { status: 'Proposal', count: filteredProjects.filter(p => p.status === 'Proposal').length, color: 'bg-orange-500' },
      { status: 'Draft', count: filteredProjects.filter(p => p.status === 'Draft').length, color: 'bg-gray-500' },
      { status: 'For Delivery', count: filteredProjects.filter(p => p.status === 'For Delivery').length, color: 'bg-purple-500' },
    ]
    return statuses.filter(s => s.count > 0)
  }, [filteredProjects])

  // Project type distribution
  const typeDistribution = useMemo(() => {
    return [
      { type: 'Infrastructure', count: stats.infrastructureProjects, color: 'bg-blue-500', icon: Building2 },
      { type: 'FMR', count: stats.fmrProjects, color: 'bg-green-500', icon: Route },
      { type: 'Machinery', count: stats.machineryProjects, color: 'bg-purple-500', icon: Wrench },
      { type: 'Project Package', count: stats.packageProjects, color: 'bg-orange-500', icon: Package },
    ].filter(t => t.count > 0)
  }, [stats])

  // Get top performing regions
  const topRegions = useMemo(() => {
    return regionalStats
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5)
  }, [regionalStats])

  // Static data for graph (2023-2025)
  const staticGraphData = {
    '2023': [
      { month: 'Jan 2023', proposed: 12, completed: 8 },
      { month: 'Feb 2023', proposed: 15, completed: 10 },
      { month: 'Mar 2023', proposed: 18, completed: 12 },
      { month: 'Apr 2023', proposed: 20, completed: 15 },
      { month: 'May 2023', proposed: 22, completed: 18 },
      { month: 'Jun 2023', proposed: 25, completed: 20 },
      { month: 'Jul 2023', proposed: 28, completed: 22 },
      { month: 'Aug 2023', proposed: 30, completed: 25 },
      { month: 'Sep 2023', proposed: 32, completed: 28 },
      { month: 'Oct 2023', proposed: 35, completed: 30 },
      { month: 'Nov 2023', proposed: 38, completed: 32 },
      { month: 'Dec 2023', proposed: 40, completed: 35 },
    ],
    '2024': [
      { month: 'Jan 2024', proposed: 15, completed: 12 },
      { month: 'Feb 2024', proposed: 18, completed: 15 },
      { month: 'Mar 2024', proposed: 22, completed: 18 },
      { month: 'Apr 2024', proposed: 25, completed: 20 },
      { month: 'May 2024', proposed: 28, completed: 23 },
      { month: 'Jun 2024', proposed: 30, completed: 25 },
      { month: 'Jul 2024', proposed: 32, completed: 28 },
      { month: 'Aug 2024', proposed: 35, completed: 30 },
      { month: 'Sep 2024', proposed: 38, completed: 33 },
      { month: 'Oct 2024', proposed: 40, completed: 35 },
      { month: 'Nov 2024', proposed: 42, completed: 38 },
      { month: 'Dec 2024', proposed: 45, completed: 40 },
    ],
    '2025': [
      { month: 'Jan 2025', proposed: 20, completed: 15 },
      { month: 'Feb 2025', proposed: 22, completed: 18 },
      { month: 'Mar 2025', proposed: 25, completed: 20 },
      { month: 'Apr 2025', proposed: 28, completed: 23 },
      { month: 'May 2025', proposed: 30, completed: 25 },
      { month: 'Jun 2025', proposed: 32, completed: 28 },
      { month: 'Jul 2025', proposed: 35, completed: 30 },
      { month: 'Aug 2025', proposed: 38, completed: 33 },
      { month: 'Sep 2025', proposed: 40, completed: 35 },
      { month: 'Oct 2025', proposed: 42, completed: 38 },
    ],
  }

  // Graph data: Proposed vs Completed projects over time
  const graphData = useMemo(() => {
    // Use static data for 2023, 2024, and All Years (2023-2025)
    if (graphYearFilter === '2023' || graphYearFilter === '2024' || graphYearFilter === 'All Years') {
      let data: Array<{ month: string, proposed: number, completed: number }> = []
      
      if (graphYearFilter === 'All Years') {
        // Combine all years data
        data = [
          ...staticGraphData['2023'],
          ...staticGraphData['2024'],
          ...staticGraphData['2025'],
        ]
      } else {
        data = [...staticGraphData[graphYearFilter as '2023' | '2024']]
      }
      
      // Apply quarterly filter if selected
      if (graphQuarterFilter !== 'All Quarters') {
        const quarterMonths: Record<string, number[]> = {
          'Q1': [1, 2, 3],
          'Q2': [4, 5, 6],
          'Q3': [7, 8, 9],
          'Q4': [10, 11, 12],
        }
        
        const monthsToInclude = quarterMonths[graphQuarterFilter] || []
        data = data.filter(item => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const monthIndex = monthNames.findIndex(m => item.month.startsWith(m))
          return monthIndex !== -1 && monthsToInclude.includes(monthIndex + 1)
        })
      }
      
      return data
    }
    
    // For other years, use actual project data
    let projectsForGraph = [...allProjects]
    
    if (graphYearFilter !== 'All Years') {
      projectsForGraph = projectsForGraph.filter(p => {
        const projectYear = new Date(p.startDate).getFullYear().toString()
        if (projectYear !== graphYearFilter) return false
        
        // Apply quarterly filter if selected
        if (graphQuarterFilter !== 'All Quarters') {
          const projectDate = new Date(p.startDate)
          const month = projectDate.getMonth() + 1 // 1-12
          
          if (graphQuarterFilter === 'Q1') {
            return month >= 1 && month <= 3
          } else if (graphQuarterFilter === 'Q2') {
            return month >= 4 && month <= 6
          } else if (graphQuarterFilter === 'Q3') {
            return month >= 7 && month <= 9
          } else if (graphQuarterFilter === 'Q4') {
            return month >= 10 && month <= 12
          }
        }
        
        return true
      })
    }

    // Group by month
    const monthlyData: Record<string, { month: string, proposed: number, completed: number }> = {}
    
    projectsForGraph.forEach(project => {
      // Handle proposed projects (Draft, Proposal) - count by start date month
      if (project.status === 'Draft' || project.status === 'Proposal') {
        const date = new Date(project.startDate)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthLabel, proposed: 0, completed: 0 }
        }
        monthlyData[monthKey].proposed++
      }
      
      // Handle completed projects (Completed, Delivered) - count by completion date month
      if (project.status === 'Completed' || project.status === 'Delivered') {
        const completionDate = project.endDate ? new Date(project.endDate) : new Date(project.updatedAt)
        const completionMonthKey = `${completionDate.getFullYear()}-${String(completionDate.getMonth() + 1).padStart(2, '0')}`
        const completionMonthLabel = completionDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        
        // Apply year filter to completion date if filter is set
        if (graphYearFilter === 'All Years' || completionDate.getFullYear().toString() === graphYearFilter) {
          // Apply quarterly filter to completion date if selected
          let shouldInclude = true
          if (graphQuarterFilter !== 'All Quarters' && graphYearFilter !== 'All Years') {
            const completionMonth = completionDate.getMonth() + 1 // 1-12
            
            if (graphQuarterFilter === 'Q1') {
              shouldInclude = completionMonth >= 1 && completionMonth <= 3
            } else if (graphQuarterFilter === 'Q2') {
              shouldInclude = completionMonth >= 4 && completionMonth <= 6
            } else if (graphQuarterFilter === 'Q3') {
              shouldInclude = completionMonth >= 7 && completionMonth <= 9
            } else if (graphQuarterFilter === 'Q4') {
              shouldInclude = completionMonth >= 10 && completionMonth <= 12
            }
          }
          
          if (shouldInclude) {
            if (!monthlyData[completionMonthKey]) {
              monthlyData[completionMonthKey] = { month: completionMonthLabel, proposed: 0, completed: 0 }
            }
            monthlyData[completionMonthKey].completed++
          }
        }
      }
    })
    
    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([key, value]) => ({
        ...value,
        sortKey: key
      }))
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ sortKey, ...rest }) => rest)
  }, [allProjects, graphYearFilter, graphQuarterFilter])

  // Export to Excel function
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new()
    
    // Helper function to format currency
    const formatCurrency = (amount: number) => {
      return `₱${(amount / 1000000).toFixed(2)}M`
    }

    // Helper function to format date
    const formatDate = (dateString: string | undefined) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    // Sheet 1: Summary Statistics
    const summaryData: (string | number)[][] = [
      ['NATIONAL PROJECT SUMMARY REPORT'],
      ['Generated on:', new Date().toLocaleString('en-US')],
      [''],
      ['FILTERS APPLIED'],
      ['Region:', selectedRegion || 'All Regions'],
      ['Project Type:', selectedType || 'All Types'],
      ['Year:', selectedYear || 'All Years'],
      ['Period:', selectedPeriod || 'All Periods'],
      [''],
      ['KEY STATISTICS'],
      ['Total Projects', stats.totalProjects],
      ['Total Budget', formatCurrency(stats.totalBudget)],
      ['Budget Utilized', formatCurrency(stats.budgetUtilized)],
      ['Budget Utilization Rate', `${stats.budgetUtilizationRate.toFixed(2)}%`],
      ['Completed Projects', stats.completedProjects],
      ['Implementation Rate', `${stats.totalProjects > 0 ? ((stats.implementedProjects / stats.totalProjects) * 100).toFixed(2) : 0}%`],
      ['Completion Rate', `${stats.totalProjects > 0 ? ((stats.completedProjects / stats.totalProjects) * 100).toFixed(2) : 0}%`],
      [''],
      ['PROJECT TYPE BREAKDOWN'],
      ['Infrastructure', stats.infrastructureProjects],
      ['FMR', stats.fmrProjects],
      ['Machinery', stats.machineryProjects],
      ['Project Package', stats.packageProjects],
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    summarySheet['!cols'] = [
      { wch: 25 }, // Column A width
      { wch: 20 }  // Column B width
    ]
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Sheet 2: Projects List
    const projectsData: (string | number)[][] = [
      ['Project ID', 'Title', 'Type', 'Region', 'Province', 'Status', 'Budget', 'Start Date', 'End Date', 'Assigned To', 'Description']
    ]

    filteredProjects.forEach(project => {
      projectsData.push([
        project.id,
        project.title,
        project.type,
        project.region || 'N/A',
        project.province || 'N/A',
        project.status,
        formatCurrency(project.budget),
        formatDate(project.startDate),
        formatDate(project.endDate),
        project.assignedTo || 'N/A',
        project.description || 'N/A'
      ])
    })

    const projectsSheet = XLSX.utils.aoa_to_sheet(projectsData)
    projectsSheet['!cols'] = [
      { wch: 12 }, // Project ID
      { wch: 40 }, // Title
      { wch: 15 }, // Type
      { wch: 15 }, // Region
      { wch: 20 }, // Province
      { wch: 15 }, // Status
      { wch: 15 }, // Budget
      { wch: 15 }, // Start Date
      { wch: 15 }, // End Date
      { wch: 20 }, // Assigned To
      { wch: 50 }  // Description
    ]
    XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projects List')

    // Sheet 3: Regional Performance
    const regionalData: (string | number)[][] = [
      ['Region', 'Total Projects', 'Total Budget', 'Completed', 'In Progress', 'Completion Rate (%)', 'Average Budget per Project']
    ]

    regionalStats.forEach(region => {
      regionalData.push([
        region.region,
        region.totalProjects,
        formatCurrency(region.totalBudget),
        region.completed,
        region.inProgress,
        parseFloat(region.completionRate.toFixed(2)),
        formatCurrency(region.totalProjects > 0 ? region.totalBudget / region.totalProjects : 0)
      ])
    })

    const regionalSheet = XLSX.utils.aoa_to_sheet(regionalData)
    regionalSheet['!cols'] = [
      { wch: 15 }, // Region
      { wch: 15 }, // Total Projects
      { wch: 18 }, // Total Budget
      { wch: 12 }, // Completed
      { wch: 12 }, // In Progress
      { wch: 18 }, // Completion Rate
      { wch: 25 }  // Average Budget
    ]
    XLSX.utils.book_append_sheet(workbook, regionalSheet, 'Regional Performance')

    // Sheet 4: Budget Analysis
    const budgetData: (string | number)[][] = [
      ['BUDGET ANALYSIS'],
      [''],
      ['Budget by Project Type'],
      ['Type', 'Count', 'Total Budget', 'Percentage of Total']
    ]

    typeDistribution.forEach(type => {
      const typeProjects = filteredProjects.filter(p => p.type === type.type)
      const typeBudget = typeProjects.reduce((sum, p) => sum + p.budget, 0)
      const percentage = stats.totalBudget > 0 ? (typeBudget / stats.totalBudget) * 100 : 0
      
      budgetData.push([
        type.type,
        type.count,
        formatCurrency(typeBudget),
        `${percentage.toFixed(2)}%`
      ])
    })

    budgetData.push([''])
    budgetData.push(['Budget Utilization'])
    budgetData.push(['Total Budget', formatCurrency(stats.totalBudget)])
    budgetData.push(['Budget Utilized', formatCurrency(stats.budgetUtilized)])
    budgetData.push(['Budget Remaining', formatCurrency(stats.totalBudget - stats.budgetUtilized)])
    budgetData.push(['Utilization Rate', `${stats.budgetUtilizationRate.toFixed(2)}%`])

    const budgetSheet = XLSX.utils.aoa_to_sheet(budgetData)
    budgetSheet['!cols'] = [
      { wch: 20 }, // Type
      { wch: 12 }, // Count
      { wch: 18 }, // Total Budget
      { wch: 18 }  // Percentage
    ]
    XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Budget Analysis')

    // Sheet 5: Status Distribution
    const statusData: (string | number)[][] = [
      ['Status', 'Count', 'Percentage']
    ]

    statusDistribution.forEach(status => {
      const percentage = stats.totalProjects > 0 
        ? (status.count / stats.totalProjects) * 100 
        : 0
      statusData.push([
        status.status,
        status.count,
        `${percentage.toFixed(2)}%`
      ])
    })

    const statusSheet = XLSX.utils.aoa_to_sheet(statusData)
    statusSheet['!cols'] = [
      { wch: 20 }, // Status
      { wch: 12 }, // Count
      { wch: 15 }  // Percentage
    ]
    XLSX.utils.book_append_sheet(workbook, statusSheet, 'Status Distribution')

    // Sheet 6: Projects by Year
    const yearData: (string | number)[][] = [
      ['Year', 'Project Count', 'Total Budget', 'Completed Projects', 'Completion Rate (%)']
    ]

    const yearList = ['2023', '2024', '2025', '2026', '2027']
    yearList.forEach(year => {
      const yearProjects = allProjects.filter(p => {
        const projectYear = new Date(p.startDate).getFullYear().toString()
        return projectYear === year
      })
      const yearBudget = yearProjects.reduce((sum, p) => sum + p.budget, 0)
      const yearCompleted = yearProjects.filter(p => 
        p.status === 'Completed' || p.status === 'Delivered'
      ).length
      const completionRate = yearProjects.length > 0 
        ? (yearCompleted / yearProjects.length) * 100 
        : 0

      yearData.push([
        year,
        yearProjects.length,
        formatCurrency(yearBudget),
        yearCompleted,
        parseFloat(completionRate.toFixed(2))
      ])
    })

    const yearSheet = XLSX.utils.aoa_to_sheet(yearData)
    yearSheet['!cols'] = [
      { wch: 10 }, // Year
      { wch: 15 }, // Project Count
      { wch: 18 }, // Total Budget
      { wch: 18 }, // Completed Projects
      { wch: 18 }  // Completion Rate
    ]
    XLSX.utils.book_append_sheet(workbook, yearSheet, 'Projects by Year')

    // Generate filename with filters
    const filterParts = []
    if (selectedRegion !== 'All Regions') filterParts.push(selectedRegion.replace(/\s+/g, '_'))
    if (selectedType !== 'All Types') filterParts.push(selectedType)
    if (selectedYear !== 'All Years') filterParts.push(selectedYear)
    if (selectedPeriod !== 'All Periods') filterParts.push(selectedPeriod.replace(/\s+/g, '_'))
    
    const filename = `National_Project_Summary${filterParts.length > 0 ? '_' + filterParts.join('_') : ''}_${new Date().toISOString().split('T')[0]}.xlsx`

    // Write and download
    XLSX.writeFile(workbook, filename)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b-2 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            National Project Summary
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Comprehensive overview of all projects across the nation with detailed analytics and reporting
          </p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2 border-2 h-11 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={exportToExcel}
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-2 animate-in fade-in slide-in-from-bottom-4 duration-600 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                Filters & Search
              </CardTitle>
              <CardDescription className="mt-2">
                Filter projects by region, type, year, and period for detailed analysis
              </CardDescription>
            </div>
            {(selectedRegion !== 'All Regions' || selectedType !== 'All Types' || selectedYear !== 'All Years' || selectedPeriod !== 'All Periods') && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedRegion('All Regions')
                  setSelectedType('All Types')
                  setSelectedYear('All Years')
                  setSelectedPeriod('All Periods')
                }}
                className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Region Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Region
              </Label>
              <Select value={selectedRegion} onValueChange={(value) => {
                setSelectedRegion(value)
                setSelectedPeriod('All Periods') // Reset period when region changes
              }}>
                <SelectTrigger className="h-11 border-2 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select region" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        {region !== 'All Regions' && <MapPin className="h-3.5 w-3.5 text-muted-foreground" />}
                        {region}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <FolderOpen className="h-4 w-4 text-primary" />
                Project Type
              </Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-11 border-2 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map(type => {
                    const getIcon = () => {
                      if (type === 'All Types') return null
                      if (type === 'FMR') return <Route className="h-3.5 w-3.5 text-orange-500" />
                      if (type === 'Infrastructure') return <Building2 className="h-3.5 w-3.5 text-blue-500" />
                      if (type === 'Machinery') return <Wrench className="h-3.5 w-3.5 text-purple-500" />
                      if (type === 'Project Package') return <Package className="h-3.5 w-3.5 text-green-500" />
                      return null
                    }
                    return (
                      <SelectItem key={type} value={type} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          {getIcon()}
                          {type}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Year
              </Label>
              <Select value={selectedYear} onValueChange={(value) => {
                setSelectedYear(value)
                if (value === 'All Years') {
                  setSelectedPeriod('All Periods')
                }
              }}>
                <SelectTrigger className="h-11 border-2 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select year" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        {year !== 'All Years' && <Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
                        {year}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Period {selectedYear !== 'All Years' ? <span className="text-xs text-muted-foreground">(Quarterly/Semestral)</span> : ''}
              </Label>
              <Select 
                value={selectedPeriod} 
                onValueChange={setSelectedPeriod}
                disabled={selectedYear === 'All Years'}
              >
                <SelectTrigger className="h-11 border-2 hover:border-primary/50 transition-colors disabled:opacity-50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={selectedYear === 'All Years' ? 'Select year first' : 'Select period'} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Periods" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      All Periods
                    </div>
                  </SelectItem>
                  <SelectItem value="Q1" className="cursor-pointer">Q1 (Jan-Mar)</SelectItem>
                  <SelectItem value="Q2" className="cursor-pointer">Q2 (Apr-Jun)</SelectItem>
                  <SelectItem value="Q3" className="cursor-pointer">Q3 (Jul-Sep)</SelectItem>
                  <SelectItem value="Q4" className="cursor-pointer">Q4 (Oct-Dec)</SelectItem>
                  <SelectItem value="1st Semester" className="cursor-pointer">1st Semester (Jan-Jun)</SelectItem>
                  <SelectItem value="2nd Semester" className="cursor-pointer">2nd Semester (Jul-Dec)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedRegion !== 'All Regions' || selectedType !== 'All Types' || selectedYear !== 'All Years' || selectedPeriod !== 'All Periods') && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">Active Filters:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedRegion !== 'All Regions' && (
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                    <MapPin className="h-3 w-3" />
                    {selectedRegion}
                    <button
                      onClick={() => setSelectedRegion('All Regions')}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedType !== 'All Types' && (
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                    <FolderOpen className="h-3 w-3" />
                    {selectedType}
                    <button
                      onClick={() => setSelectedType('All Types')}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedYear !== 'All Years' && (
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                    <Calendar className="h-3 w-3" />
                    {selectedYear}
                    <button
                      onClick={() => {
                        setSelectedYear('All Years')
                        setSelectedPeriod('All Periods')
                      }}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedPeriod !== 'All Periods' && (
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                    <Clock className="h-3 w-3" />
                    {selectedPeriod}
                    <button
                      onClick={() => setSelectedPeriod('All Periods')}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          change={`${stats.implementedProjects} implemented`}
          changeType="positive"
          icon={BarChart3}
        />
        <StatCard
          title="Total Budget"
          value={`₱${(stats.totalBudget / 1000000).toFixed(1)}M`}
          change={`${stats.budgetUtilizationRate.toFixed(1)}% utilized`}
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Completed Projects"
          value={stats.completedProjects}
          change={`${stats.totalProjects > 0 ? ((stats.completedProjects / stats.totalProjects) * 100).toFixed(1) : 0}% completion rate`}
          changeType="positive"
          icon={CheckCircle}
        />
        <StatCard
          title="Budget Utilized"
          value={`₱${(stats.budgetUtilized / 1000000).toFixed(1)}M`}
          change={`${stats.budgetUtilizationRate.toFixed(1)}% of total`}
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Proposed vs Completed Projects Line Graph */}
      <Card className="border-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 transition-all hover:shadow-xl hover:scale-[1.01]">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LineChartIcon className="h-6 w-6 text-primary" />
                Proposed vs Completed Projects
              </CardTitle>
              <CardDescription className="mt-2">
                Track the trend of proposed projects versus completed projects over time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold whitespace-nowrap">Filter by Year:</Label>
                <Select 
                  value={graphYearFilter} 
                  onValueChange={(value) => {
                    setGraphYearFilter(value)
                    if (value === 'All Years') {
                      setGraphQuarterFilter('All Quarters')
                    }
                  }}
                >
                  <SelectTrigger className="h-10 w-[140px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {graphYears.map(year => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {graphYearFilter !== 'All Years' && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                  <Label className="text-sm font-semibold whitespace-nowrap">Quarter:</Label>
                  <Select 
                    value={graphQuarterFilter} 
                    onValueChange={setGraphQuarterFilter}
                  >
                    <SelectTrigger className="h-10 w-[140px]">
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Quarters">All Quarters</SelectItem>
                      <SelectItem value="Q1">Q1 (Jan-Mar)</SelectItem>
                      <SelectItem value="Q2">Q2 (Apr-Jun)</SelectItem>
                      <SelectItem value="Q3">Q3 (Jul-Sep)</SelectItem>
                      <SelectItem value="Q4">Q4 (Oct-Dec)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={graphData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  formatter={(value: number, name: string) => [`${value} projects`, name]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="proposed" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Proposed Projects"
                  animationDuration={1000}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Completed Projects"
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {graphData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No data available for the selected year
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Type Breakdown */}
      <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <Card className="border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5 animate-pulse" />
              Project Type Distribution
            </CardTitle>
            <CardDescription>
              Breakdown by project category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {typeDistribution.map((item) => {
                const Icon = item.icon
                const percentage = stats.totalProjects > 0 
                  ? (item.count / stats.totalProjects) * 100 
                  : 0
                return (
                  <div key={item.type} className="space-y-2 transition-all duration-300 hover:translate-x-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-125" />
                        <span className="text-sm font-medium">{item.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">{item.count}</span>
                        <Badge variant="secondary" className="text-xs">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 animate-pulse" />
              Status Distribution
            </CardTitle>
            <CardDescription>
              Current project status overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusDistribution.map((item) => {
                const percentage = stats.totalProjects > 0 
                  ? (item.count / stats.totalProjects) * 100 
                  : 0
                return (
                  <div key={item.status} className="space-y-2 transition-all duration-300 hover:translate-x-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.color} transition-transform duration-300 hover:scale-125`}></div>
                        <span className="text-sm font-medium">{item.status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">{item.count}</span>
                        <Badge variant="secondary" className="text-xs">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Analysis & Project Trends - Moved Above Regional Performance */}
      <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        {/* Budget by Project Type */}
        <Card className="border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 animate-pulse" />
              Budget by Project Type
            </CardTitle>
            <CardDescription>
              Budget allocation across project categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {typeDistribution.map((item) => {
                const typeProjects = filteredProjects.filter(p => p.type === item.type)
                const typeBudget = typeProjects.reduce((sum, p) => sum + p.budget, 0)
                const budgetPercentage = stats.totalBudget > 0 
                  ? (typeBudget / stats.totalBudget) * 100 
                  : 0
                const Icon = item.icon
                return (
                  <div key={item.type} className="space-y-2 p-3 rounded-lg hover:bg-muted/30 transition-all duration-300 hover:translate-x-2 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-125" />
                        <span className="text-sm font-semibold">{item.type}</span>
                      </div>
                      <span className="text-sm font-bold">₱{(typeBudget / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${budgetPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{typeProjects.length} projects</span>
                      <span className="font-medium">{budgetPercentage.toFixed(1)}% of total</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card className="border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 animate-pulse" />
              Budget Utilization
            </CardTitle>
            <CardDescription>
              Budget utilization and remaining allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative w-36 h-36 mx-auto">
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - stats.budgetUtilizationRate / 100)}`}
                      className="text-green-500 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{stats.budgetUtilizationRate.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground font-medium">Utilized</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg border-2 bg-green-50 border-green-200">
                  <div className="text-2xl font-bold text-green-600">₱{(stats.budgetUtilized / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-green-700 font-semibold mt-1">Utilized</div>
                </div>
                <div className="text-center p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">₱{((stats.totalBudget - stats.budgetUtilized) / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-blue-700 font-semibold mt-1">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects by Year & Project Type Performance */}
      <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
        {/* Projects by Year */}
        <Card className="border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 animate-pulse" />
              Projects by Year
            </CardTitle>
            <CardDescription>
              Project distribution across different years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['2023', '2024', '2026'].map((year) => {
                const yearProjects = allProjects.filter(p => {
                  const projectYear = new Date(p.startDate).getFullYear().toString()
                  return projectYear === year
                })
                const yearBudget = yearProjects.reduce((sum, p) => sum + p.budget, 0)
                const yearCompleted = yearProjects.filter(p => 
                  p.status === 'Completed' || p.status === 'Delivered'
                ).length
                const percentage = allProjects.length > 0 
                  ? (yearProjects.length / allProjects.length) * 100 
                  : 0
                
                return (
                  <div key={year} className="space-y-2 p-3 rounded-lg hover:bg-muted/30 transition-all duration-300 hover:translate-x-2 hover:shadow-md border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 text-center bg-primary/10 rounded-lg py-1 transition-transform duration-300 hover:scale-110">
                          <div className="text-lg font-bold text-primary">{year}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{yearProjects.length} projects</span>
                            <Badge variant="secondary" className="text-xs">
                              {percentage.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            ₱{(yearBudget / 1000000).toFixed(1)}M budget • {yearCompleted} completed
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Project Type Performance */}
        <Card className="border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 animate-pulse" />
              Project Type Performance
            </CardTitle>
            <CardDescription>
              Completion rates by project type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {typeDistribution.map((item) => {
                const typeProjects = filteredProjects.filter(p => p.type === item.type)
                const completed = typeProjects.filter(p => 
                  p.status === 'Completed' || p.status === 'Delivered'
                ).length
                const completionRate = typeProjects.length > 0 
                  ? (completed / typeProjects.length) * 100 
                  : 0
                const Icon = item.icon
                
                return (
                  <div key={item.type} className="space-y-2 p-3 rounded-lg hover:bg-muted/30 transition-all duration-300 hover:translate-x-2 hover:shadow-md border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground transition-transform duration-300 hover:scale-125" />
                        <div>
                          <div className="text-sm font-semibold">{item.type}</div>
                          <div className="text-xs text-muted-foreground">
                            {completed}/{typeProjects.length} completed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          completionRate >= 70 ? 'text-green-600' :
                          completionRate >= 50 ? 'text-blue-600' :
                          completionRate >= 30 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {completionRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">completion</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          completionRate >= 70 ? 'bg-green-500' :
                          completionRate >= 50 ? 'bg-blue-500' :
                          completionRate >= 30 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      <Card className="border-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="h-6 w-6 text-primary" />
                Regional Performance Overview
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Comprehensive performance metrics across all regions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg mb-3 border-2 border-primary/20">
            <div className="col-span-3 font-bold text-sm text-foreground">Region</div>
            <div className="col-span-2 font-bold text-sm text-center text-foreground">Total Projects</div>
            <div className="col-span-2 font-bold text-sm text-center text-foreground">Total Budget</div>
            <div className="col-span-2 font-bold text-sm text-center text-foreground">Completed</div>
            <div className="col-span-2 font-bold text-sm text-center text-foreground">In Progress</div>
            <div className="col-span-1 font-bold text-sm text-center text-foreground">Progress</div>
          </div>

          {/* Regional Data */}
          <div className="space-y-3">
            {regionalStats.map((region, index) => {
              const budgetInM = region.totalBudget / 1000000
              const completionColor = 
                region.completionRate >= 70 ? 'text-green-600' :
                region.completionRate >= 50 ? 'text-blue-600' :
                region.completionRate >= 30 ? 'text-yellow-600' :
                'text-red-600'
              
              const progressBarColor = 
                region.completionRate >= 70 ? 'bg-green-500' :
                region.completionRate >= 50 ? 'bg-blue-500' :
                region.completionRate >= 30 ? 'bg-yellow-500' :
                'bg-red-500'

              return (
                <div 
                  key={region.region}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 rounded-lg border-2 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group bg-card animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    setSelectedRegion(region.region)
                    setViewMode('detailed')
                  }}
                >
                  {/* Region Name - Mobile & Desktop */}
                  <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-semibold text-sm md:text-base truncate">{region.region}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {region.projects.length} projects
                      </div>
                    </div>
                  </div>

                  {/* Total Projects */}
                  <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
                    <div className="md:hidden text-xs text-muted-foreground mb-1">Total Projects</div>
                    <div className="text-xl md:text-2xl font-bold text-center">
                      {region.totalProjects}
                    </div>
                  </div>

                  {/* Total Budget */}
                  <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
                    <div className="md:hidden text-xs text-muted-foreground mb-1">Total Budget</div>
                    <div className="text-lg md:text-xl font-bold text-center">
                      ₱{budgetInM.toFixed(1)}M
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      Avg: ₱{(budgetInM / region.totalProjects).toFixed(1)}M
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
                    <div className="md:hidden text-xs text-muted-foreground mb-1">Completed</div>
                    <div className="text-xl md:text-2xl font-bold text-green-600 text-center">
                      {region.completed}
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      {region.totalProjects > 0 ? ((region.completed / region.totalProjects) * 100).toFixed(1) : 0}%
                    </div>
                  </div>

                  {/* In Progress */}
                  <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
                    <div className="md:hidden text-xs text-muted-foreground mb-1">In Progress</div>
                    <div className="text-xl md:text-2xl font-bold text-blue-600 text-center">
                      {region.inProgress}
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      {region.totalProjects > 0 ? ((region.inProgress / region.totalProjects) * 100).toFixed(1) : 0}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="col-span-1 md:col-span-1 flex flex-col justify-center">
                    <div className="md:hidden text-xs text-muted-foreground mb-2">Completion Rate</div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 w-full bg-gray-200 rounded-full h-3 overflow-hidden max-w-[60px]">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${progressBarColor}`}
                          style={{ width: `${Math.min(region.completionRate, 100)}%` }}
                        ></div>
                      </div>
                      <div className={`text-sm font-bold min-w-[3.5rem] text-center ${completionColor}`}>
                        {region.completionRate.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Footer */}
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">{regionalStats.reduce((sum, r) => sum + r.totalProjects, 0)}</div>
                <div className="text-xs text-muted-foreground">Total Projects</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">₱{(regionalStats.reduce((sum, r) => sum + r.totalBudget, 0) / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground">Total Budget</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">{regionalStats.reduce((sum, r) => sum + r.completed, 0)}</div>
                <div className="text-xs text-muted-foreground">Total Completed</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">{regionalStats.reduce((sum, r) => sum + r.inProgress, 0)}</div>
                <div className="text-xs text-muted-foreground">Total In Progress</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Regions */}
      <Card className="border-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-6 w-6 text-green-600" />
            Top Performing Regions
          </CardTitle>
          <CardDescription className="text-base">
            Regions with highest completion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {topRegions.map((region, index) => (
              <div 
                key={region.region}
                className="p-4 rounded-lg border text-center hover:bg-muted/50 hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer animate-in fade-in zoom-in-95"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  setSelectedRegion(region.region)
                  setViewMode('detailed')
                }}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                </div>
                <div className="font-semibold text-sm mb-1">{region.region}</div>
                <div className="text-2xl font-bold text-green-600">{region.completionRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">{region.completed}/{region.totalProjects} projects</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  )
}

