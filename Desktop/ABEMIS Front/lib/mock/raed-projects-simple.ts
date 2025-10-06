import { Project } from '../types'
import { getRAEDLabel } from './raed-assignments'

// Simple project generation for testing
export function generateSimpleRAEDProjects(): Project[] {
  const regions = [
    'Region 1', 'Region 2', 'Region 3', 'Region 4', 'Region 4B',
    'Region 5', 'Region 6', 'Region 7', 'Region 8', 'Region 9',
    'Region 10', 'Region 11', 'Region 12', 'Region 13'
  ]
  
  const projects: Project[] = []
  let projectId = 1
  
  for (const region of regions) {
    const projectCount = 18 // Fixed number for testing
    const regionNumber = region === 'Region 4B' ? '4B' : region.split(' ')[1]
    
    for (let i = 0; i < projectCount; i++) {
      const project: Project = {
        id: `PRJ-${String(projectId).padStart(3, '0')}`,
        title: `Sample Project ${i + 1} - ${region}`,
        type: i % 3 === 0 ? 'FMR' : i % 3 === 1 ? 'Infrastructure' : 'Machinery',
        province: `Sample Province ${i + 1}`,
        region: region,
        status: i % 4 === 0 ? 'Proposal' : i % 4 === 1 ? 'Procurement' : i % 4 === 2 ? 'Implementation' : 'Completed',
        description: `This is a sample project for ${region} to test the system functionality.`,
        budget: 10000000 + (i * 1000000), // 10M + increment
        startDate: '2024-01-01',
        endDate: i % 4 === 3 ? '2024-12-31' : undefined,
        updatedAt: new Date().toISOString(),
        assignedTo: getRAEDLabel(region)
      }
      
      projects.push(project)
      projectId++
    }
  }
  
  return projects
}

export const raedProjects = generateSimpleRAEDProjects()
