import { Project } from '../types'
import { getRAEDLabel } from './raed-assignments'

// Project templates for different types
const projectTemplates = {
  FMR: [
    'Farm Mechanization Program',
    'Agricultural Training Center',
    'Modern Farming Equipment Distribution',
    'Crop Production Enhancement',
    'Agricultural Extension Services',
    'Farm-to-Market Road Development',
    'Agricultural Research Station',
    'Seed Production Facility',
    'Organic Farming Initiative',
    'Agricultural Cooperative Support',
    'Farm Equipment Maintenance Center',
    'Agricultural Technology Transfer',
    'Crop Diversification Program',
    'Agricultural Marketing Support',
    'Farm Business Development'
  ],
  Infrastructure: [
    'Rural Water Supply System',
    'Irrigation Infrastructure',
    'Rural Electrification Project',
    'Road and Bridge Construction',
    'Community Health Center',
    'School Building Construction',
    'Market Development Project',
    'Flood Control System',
    'Drainage System Improvement',
    'Community Center Construction',
    'Public Transportation Hub',
    'Telecommunications Infrastructure',
    'Waste Management Facility',
    'Environmental Protection Project',
    'Disaster Risk Reduction Infrastructure'
  ],
  Machinery: [
    'Heavy Equipment Procurement',
    'Agricultural Machinery Distribution',
    'Construction Equipment Program',
    'Industrial Machinery Installation',
    'Transportation Fleet Development',
    'Processing Equipment Setup',
    'Maintenance Equipment Program',
    'Specialized Machinery Training',
    'Equipment Rental Program',
    'Machinery Repair Services',
    'Industrial Equipment Upgrade',
    'Agricultural Processing Machinery',
    'Construction Equipment Pool',
    'Transportation Equipment Program',
    'Specialized Industrial Equipment'
  ]
}

const provinces = [
  'Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan',
  'Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino',
  'Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales',
  'Aurora', 'Batangas', 'Cavite', 'Laguna', 'Quezon', 'Rizal',
  'Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Romblon',
  'Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon',
  'Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo', 'Negros Occidental',
  'Bohol', 'Cebu', 'Negros Oriental', 'Siquijor',
  'Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte',
  'Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay',
  'Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental',
  'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental', 'Davao de Oro',
  'Cotabato', 'Sarangani', 'South Cotabato', 'Sultan Kudarat',
  'Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur',
  'Basilan', 'Lanao del Sur', 'Maguindanao', 'Sulu', 'Tawi-Tawi'
]

const statuses: Array<'Proposal' | 'Procurement' | 'Implementation' | 'Completed'> = [
  'Proposal', 'Procurement', 'Implementation', 'Completed'
]

const statusWeights = [0.15, 0.25, 0.45, 0.15] // More projects in Implementation

// Simple seeded random number generator for consistent results
class SeededRandom {
  private seed: number
  
  constructor(seed: number) {
    this.seed = seed
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }
}

// Generate random status based on weights, with special handling for machinery projects
function getRandomStatus(projectType?: 'FMR' | 'Infrastructure' | 'Machinery', seed?: number): 'Proposal' | 'Procurement' | 'Implementation' | 'Completed' | 'For Delivery' | 'Delivered' {
  const random = seed !== undefined ? new SeededRandom(seed).next() : Math.random()
  
  // For machinery projects, use delivery-specific statuses
  if (projectType === 'Machinery') {
    const machineryStatuses: Array<'Proposal' | 'Procurement' | 'For Delivery' | 'Delivered'> = [
      'Proposal', 'Procurement', 'For Delivery', 'Delivered'
    ]
    const machineryWeights = [0.15, 0.25, 0.45, 0.15] // More projects in For Delivery
    
    let cumulative = 0
    
    for (let i = 0; i < machineryStatuses.length; i++) {
      cumulative += machineryWeights[i]
      if (random <= cumulative) {
        return machineryStatuses[i]
      }
    }
    return 'For Delivery'
  }
  
  // For non-machinery projects, use regular statuses
  let cumulative = 0
  
  for (let i = 0; i < statuses.length; i++) {
    cumulative += statusWeights[i]
    if (random <= cumulative) {
      return statuses[i]
    }
  }
  return 'Implementation'
}

// Generate random date within the last 2 years
function getRandomDate(): string {
  const now = new Date()
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())
  const timeDiff = now.getTime() - twoYearsAgo.getTime()
  const randomTime = twoYearsAgo.getTime() + Math.random() * timeDiff
  return new Date(randomTime).toISOString().split('T')[0]
}

// Generate random budget between 2M and 50M
function getRandomBudget(): number {
  return Math.floor(Math.random() * 48000000) + 2000000 // 2M to 50M
}

// Generate random project ID
function generateProjectId(index: number): string {
  return `PRJ-${String(index).padStart(3, '0')}`
}

// Generate projects for a specific region
export function generateProjectsForRegion(region: string, startIndex: number = 1): Project[] {
  // Use a deterministic seed based on region name to ensure consistent results
  const regionSeed = region.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const seededRandom = new SeededRandom(regionSeed)
  
  const projectCount = Math.floor(seededRandom.next() * 6) + 16 // 16-21 projects
  const projects: Project[] = []
  
  for (let i = 0; i < projectCount; i++) {
    const projectIndex = startIndex + i
    const projectType = Object.keys(projectTemplates)[Math.floor(seededRandom.next() * 3)] as 'FMR' | 'Infrastructure' | 'Machinery'
    const template = projectTemplates[projectType][Math.floor(seededRandom.next() * projectTemplates[projectType].length)]
    const province = provinces[Math.floor(seededRandom.next() * provinces.length)]
    const status = getRandomStatus(projectType, regionSeed + i)
    const startDate = getRandomDate()
    const budget = getRandomBudget()
    
    // Generate end date for completed/delivered projects or projects in implementation/for delivery
    let endDate: string | undefined
    if (status === 'Completed' || status === 'Delivered' || (status === 'Implementation' && seededRandom.next() > 0.5) || (status === 'For Delivery' && seededRandom.next() > 0.5)) {
      const start = new Date(startDate)
      const duration = Math.floor(seededRandom.next() * 365) + 30 // 1 month to 1 year
      endDate = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    
    // Generate updated date (more recent than start date)
    const startTime = new Date(startDate).getTime()
    const now = Date.now()
    const timeDiff = now - startTime
    const randomUpdateTime = startTime + seededRandom.next() * timeDiff
    const updatedAt = new Date(randomUpdateTime).toISOString()
    
    const project: Project = {
      id: generateProjectId(projectIndex),
      title: `${template} - ${region}`,
      type: projectType,
      province: province,
      region: region,
      status: status,
      description: `Comprehensive ${template.toLowerCase()} initiative for ${province} in ${region}. This project aims to improve local infrastructure and support community development through strategic implementation of modern agricultural and infrastructure solutions.`,
      budget: budget,
      startDate: startDate,
      endDate: endDate,
      updatedAt: updatedAt,
      assignedTo: getRAEDLabel(region)
    }
    
    projects.push(project)
  }
  
  return projects
}

// Generate all projects for all RAED regions
export function generateAllRAEDProjectsLegacy(): Project[] {
  const regions = [
    'Region 1', 'Region 2', 'Region 3', 'Region 4', 'Region 4B',
    'Region 5', 'Region 6', 'Region 7', 'Region 8', 'Region 9',
    'Region 10', 'Region 11', 'Region 12', 'Region 13', 'NIR'
  ]
  
  let allProjects: Project[] = []
  let currentIndex = 1
  
  for (const region of regions) {
    const regionProjects = generateProjectsForRegion(region, currentIndex)
    allProjects = allProjects.concat(regionProjects)
    currentIndex += regionProjects.length
  }
  
  return allProjects
}

// Export the generated projects
export const raedProjects = generateAllRAEDProjectsLegacy()
