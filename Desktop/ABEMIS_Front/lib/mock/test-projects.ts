import { Project } from '../types'

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

// Minimal test projects
export const testProjects: Project[] = [
  {
    id: generateProjectReference('FMR', 'Region 1', 'Test Project 1', '2024-01-01'),
    title: 'Test Project 1',
    type: 'FMR',
    province: 'Test Province',
    region: 'Region 1',
    status: 'Implementation',
    description: 'Test project description',
    budget: 10000000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    updatedAt: '2024-01-01T00:00:00Z',
    assignedTo: 'RAED-1'
  }
]
