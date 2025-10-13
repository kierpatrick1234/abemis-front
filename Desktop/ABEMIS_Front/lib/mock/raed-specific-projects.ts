import { Project } from '../types'
import { getRAEDLabel } from './raed-assignments'

// EPDSD Evaluator names
const epdsdEvaluators = [
  'EPDSD - Mark Gomez',
  'EPDSD - Sarah Rodriguez',
  'EPDSD - Miguel Santos',
  'EPDSD - Ana Dela Cruz',
  'EPDSD - Roberto Martinez'
]

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

// Region-specific provinces
const regionProvinces = {
  'Region 1': ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
  'Region 2': ['Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino'],
  'Region 3': ['Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales', 'Aurora'],
  'Region 4': ['Batangas', 'Cavite', 'Laguna', 'Quezon', 'Rizal'],
  'Region 4B': ['Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Romblon'],
  'Region 5': ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon'],
  'Region 6': ['Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo', 'Negros Occidental'],
  'Region 7': ['Bohol', 'Cebu', 'Negros Oriental', 'Siquijor'],
  'Region 8': ['Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte'],
  'Region 9': ['Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay'],
  'Region 10': ['Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental'],
  'Region 11': ['Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental', 'Davao de Oro'],
  'Region 12': ['Cotabato', 'Sarangani', 'South Cotabato', 'Sultan Kudarat'],
  'Region 13': ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur']
}

// const statuses: Array<'Proposal' | 'Procurement' | 'Implementation' | 'Completed'> = [
//   'Proposal', 'Procurement', 'Implementation', 'Completed'
// ]

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

// Generate deterministic status with realistic distribution, with special handling for machinery projects
function getRandomStatus(projectType?: 'FMR' | 'Infrastructure' | 'Machinery', seed?: number): 'Draft' | 'Proposal' | 'Procurement' | 'Implementation' | 'Completed' | 'Inventory' | 'For Delivery' | 'Delivered' {
  const random = seed !== undefined ? new SeededRandom(seed).next() : Math.random()
  
  // For machinery projects, use delivery-specific statuses
  if (projectType === 'Machinery') {
    if (random < 0.05) return 'Draft'
    if (random < 0.20) return 'Proposal'
    if (random < 0.40) return 'Procurement'
    if (random < 0.80) return 'For Delivery'
    if (random < 0.95) return 'Delivered'
    return 'Inventory'
  }
  
  // For non-machinery projects, use regular statuses
  if (random < 0.05) return 'Draft'
  if (random < 0.20) return 'Proposal'
  if (random < 0.40) return 'Procurement'
  if (random < 0.80) return 'Implementation'
  if (random < 0.95) return 'Completed'
  return 'Inventory'
}

// Generate random date between January 1, 2025 and October 5, 2025
function getRandomDate(): string {
  const startDate = new Date('2025-01-01')
  const endDate = new Date('2025-10-05')
  const timeDiff = endDate.getTime() - startDate.getTime()
  const randomTime = startDate.getTime() + Math.random() * timeDiff
  return new Date(randomTime).toISOString().split('T')[0]
}

// Generate project tracking reference in format: type-region-title-datecreated
function generateProjectReference(type: string, region: string, title: string, dateCreated: string): string {
  // Clean and format the inputs
  const cleanType = type.toUpperCase()
  const cleanRegion = region.replace(/\s+/g, '').toUpperCase() // Remove spaces and convert to uppercase
  const cleanTitle = title
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toUpperCase()
    .substring(0, 20) // Limit to 20 characters
  const cleanDate = dateCreated.replace(/-/g, '') // Remove hyphens from date
  
  return `${cleanType}-${cleanRegion}-${cleanTitle}-${cleanDate}`
}

// Generate random budget between 2M and 50M
function getRandomBudget(): number {
  return Math.floor(Math.random() * 48000000) + 2000000 // 2M to 50M
}

// Generate projects for a specific region
function generateProjectsForRegion(region: string, startIndex: number = 1): Project[] {
  // Use a deterministic seed based on region name to ensure consistent results
  const regionSeed = region.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const seededRandom = new SeededRandom(regionSeed)
  
  const projectCount = Math.floor(seededRandom.next() * 16) + 25 // 25-40 projects
  const projects: Project[] = []
  const provinces = regionProvinces[region as keyof typeof regionProvinces] || ['Unknown Province']
  
  for (let i = 0; i < projectCount; i++) {
    const projectIndex = startIndex + i
    const projectType = Object.keys(projectTemplates)[Math.floor(seededRandom.next() * 3)] as 'FMR' | 'Infrastructure' | 'Machinery'
    const template = projectTemplates[projectType][Math.floor(seededRandom.next() * projectTemplates[projectType].length)]
    const province = provinces[Math.floor(seededRandom.next() * provinces.length)]
    const status = getRandomStatus(projectType, regionSeed + i)
    const startDate = getRandomDate()
    const budget = getRandomBudget()
    
    // Generate end date for completed/delivered projects or some implementation/for delivery projects
    let endDate: string | undefined
    if (status === 'Completed' || status === 'Delivered' || (status === 'Implementation' && seededRandom.next() > 0.6) || (status === 'For Delivery' && seededRandom.next() > 0.6)) {
      const start = new Date(startDate)
      const maxEndDate = new Date('2025-10-05')
      const maxDuration = Math.floor((maxEndDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const duration = Math.floor(seededRandom.next() * Math.min(maxDuration, 365)) + 30 // 1 month to 1 year, but not exceeding Oct 5, 2025
      const calculatedEndDate = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000)
      
      // Ensure end date doesn't exceed October 5, 2025
      if (calculatedEndDate <= maxEndDate) {
        endDate = calculatedEndDate.toISOString().split('T')[0]
      }
    }
    
    // Generate updated date (more recent than start date, within 2025 range)
    const startTime = new Date(startDate).getTime()
    const endTime = new Date('2025-10-05').getTime()
    const timeDiff = endTime - startTime
    const randomUpdateTime = startTime + seededRandom.next() * timeDiff
    const updatedAt = new Date(randomUpdateTime).toISOString()
    
    // const regionNumber = region === 'Region 4B' ? '4B' : region.split(' ')[1]
    
    const projectTitle = `${template} - ${region}`
    const projectReference = generateProjectReference(projectType, region, template, startDate)
    
    const project: Project = {
      id: projectReference,
      title: projectTitle,
      type: projectType,
      province: province,
      region: region,
      status: status,
      description: `${template} project for ${province}, ${region}`,
      budget: budget,
      startDate: startDate,
      endDate: endDate,
      updatedAt: updatedAt,
      assignedTo: getRAEDLabel(region),
      // Add evaluator for proposal stage projects (Infrastructure and Machinery)
      ...(status === 'Proposal' && (projectType === 'Infrastructure' || projectType === 'Machinery') ? {
        evaluator: epdsdEvaluators[Math.floor(seededRandom.next() * epdsdEvaluators.length)]
      } : {}),
      // Add procurement fields for projects in Procurement, Implementation, For Delivery, or Completed/Delivered status
      ...(status === 'Procurement' || status === 'Implementation' || status === 'For Delivery' || status === 'Completed' || status === 'Delivered' ? {
        budgetYear: ['2023', '2024', '2025', '2026'][Math.floor(seededRandom.next() * 4)],
        bidOpeningDate: status === 'Implementation' || status === 'For Delivery' || status === 'Completed' || status === 'Delivered' ? 
          new Date(new Date(startDate).getTime() + seededRandom.next() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        noticeOfAwardDate: status === 'Implementation' || status === 'For Delivery' || status === 'Completed' || status === 'Delivered' ? 
          new Date(new Date(startDate).getTime() + (30 + seededRandom.next() * 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        noticeToProceedDate: status === 'Implementation' || status === 'For Delivery' || status === 'Completed' || status === 'Delivered' ? 
          new Date(new Date(startDate).getTime() + (45 + seededRandom.next() * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        procurementDocuments: status === 'Implementation' || status === 'For Delivery' || status === 'Completed' || status === 'Delivered' ? {
          bidOpening: 'bid-opening-document.pdf',
          noticeOfAward: 'notice-of-award-document.pdf',
          noticeToProceed: 'notice-to-proceed-document.pdf'
        } : undefined
      } : {}),
      // Add completed stage fields for completed/delivered projects - empty for RAED to fill
      ...(status === 'Completed' || status === 'Delivered' ? {
        // Dates and files will be empty initially - RAED needs to upload them
        dateCompleted: undefined,
        dateTurnedOver: undefined,
        asBuiltPlans: {
          cad: undefined,
          pdf: undefined
        },
        postGeotaggedPhotos: []
      } : {})
    }
    
    projects.push(project)
  }
  
  return projects
}

// Generate all projects for all RAED regions
export function generateAllRAEDProjects(): Project[] {
  const regions = [
    'Region 1', 'Region 2', 'Region 3', 'Region 4', 'Region 4B',
    'Region 5', 'Region 6', 'Region 7', 'Region 8', 'Region 9',
    'Region 10', 'Region 11', 'Region 12', 'Region 13'
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

// Create some specific draft projects for testing
function createDraftProjects(): Project[] {
  const draftProjects: Project[] = [
    {
      id: 'DRAFT-001',
      title: 'Community Health Center - Region 1',
      type: 'Infrastructure',
      province: 'Ilocos Norte',
      region: 'Region 1',
      status: 'Draft',
      description: 'Draft proposal for a new community health center in Ilocos Norte',
      budget: 12000000,
      startDate: '2025-03-01',
      updatedAt: '2025-01-15T10:30:00Z',
      assignedTo: 'RAED - Region 1'
    },
    {
      id: 'DRAFT-002',
      title: 'Agricultural Training Facility - Region 3',
      type: 'FMR',
      province: 'Nueva Ecija',
      region: 'Region 3',
      status: 'Draft',
      description: 'Draft proposal for agricultural training facility in Nueva Ecija',
      budget: 8500000,
      startDate: '2025-04-01',
      updatedAt: '2025-01-18T14:20:00Z',
      assignedTo: 'RAED - Region 3'
    },
    {
      id: 'DRAFT-003',
      title: 'Heavy Equipment Program - Region 7',
      type: 'Machinery',
      province: 'Cebu',
      region: 'Region 7',
      status: 'Draft',
      description: 'Draft proposal for heavy equipment procurement program in Cebu',
      budget: 25000000,
      startDate: '2025-05-01',
      updatedAt: '2025-01-22T09:15:00Z',
      assignedTo: 'RAED - Region 7'
    },
    {
      id: 'DRAFT-004',
      title: 'Rural Water System - Region 11',
      type: 'Infrastructure',
      province: 'Davao del Sur',
      region: 'Region 11',
      status: 'Draft',
      description: 'Draft proposal for rural water supply system in Davao del Sur',
      budget: 18000000,
      startDate: '2025-06-01',
      updatedAt: '2025-01-25T16:45:00Z',
      assignedTo: 'RAED - Region 11'
    },
    {
      id: 'DRAFT-005',
      title: 'Farm-to-Market Road - Region 5',
      type: 'FMR',
      province: 'Albay',
      region: 'Region 5',
      status: 'Draft',
      description: 'Draft proposal for farm-to-market road construction in Albay',
      budget: 15000000,
      startDate: '2025-07-01',
      updatedAt: '2025-01-28T11:30:00Z',
      assignedTo: 'RAED - Region 5'
    }
  ]
  
  return draftProjects
}

// Export the generated projects combined with draft projects
export const raedSpecificProjects = [...generateAllRAEDProjects(), ...createDraftProjects()]
