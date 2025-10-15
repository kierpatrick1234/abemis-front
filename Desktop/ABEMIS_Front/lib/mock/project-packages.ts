import { Project } from '../types'

// Mock individual projects for project packages
const mockInfrastructureProjects: Project[] = [
  {
    id: 'INFRA-PKG1-001',
    title: 'Rural Water Supply System - Package 1',
    type: 'Infrastructure',
    province: 'Ilocos Norte',
    region: 'Region 1',
    status: 'Proposal',
    description: 'Comprehensive water supply system for rural communities',
    budget: 15000000,
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    updatedAt: '2024-01-20T10:30:00Z',
    assignedTo: 'RAED - Region 1',
    evaluator: 'EPDSD - Mark Gomez'
  },
  {
    id: 'INFRA-PKG2-001',
    title: 'Road Construction Project - Package 2',
    type: 'Infrastructure',
    province: 'Nueva Ecija',
    region: 'Region 3',
    status: 'Implementation',
    description: 'Construction of farm-to-market roads',
    budget: 25000000,
    startDate: '2024-01-15',
    endDate: '2024-11-30',
    updatedAt: '2024-01-22T14:20:00Z',
    assignedTo: 'RAED - Region 3',
    budgetYear: '2024',
    bidOpeningDate: '2024-01-30',
    noticeOfAwardDate: '2024-02-15',
    noticeToProceedDate: '2024-02-25',
    procurementDocuments: {
      bidOpening: 'bid-opening-document.pdf',
      noticeOfAward: 'notice-of-award-document.pdf',
      noticeToProceed: 'notice-to-proceed-document.pdf'
    }
  }
]

const mockMachineryProjects: Project[] = [
  {
    id: 'MACH-PKG1-001',
    title: 'Agricultural Machinery Distribution - Package 1',
    type: 'Machinery',
    province: 'Cagayan',
    region: 'Region 2',
    status: 'For Delivery',
    description: 'Distribution of modern agricultural machinery to farmers',
    budget: 18000000,
    startDate: '2024-02-15',
    endDate: '2024-11-30',
    updatedAt: '2024-01-22T14:20:00Z',
    assignedTo: 'RAED - Region 2',
    evaluator: 'EPDSD - Sarah Rodriguez',
    budgetYear: '2024',
    bidOpeningDate: '2024-03-01',
    noticeOfAwardDate: '2024-03-20',
    noticeToProceedDate: '2024-04-01',
    procurementDocuments: {
      bidOpening: 'bid-opening-document.pdf',
      noticeOfAward: 'notice-of-award-document.pdf',
      noticeToProceed: 'notice-to-proceed-document.pdf'
    },
    deliveryDate: '2024-08-15',
    inspectionDate: '2024-08-20',
    inspectorName: 'John Inspector'
  },
  {
    id: 'MACH-PKG3-001',
    title: 'Heavy Equipment Program - Package 3',
    type: 'Machinery',
    province: 'Cebu',
    region: 'Region 7',
    status: 'Delivered',
    description: 'Heavy equipment procurement and distribution program',
    budget: 35000000,
    startDate: '2024-01-01',
    endDate: '2024-10-31',
    updatedAt: '2024-01-25T16:45:00Z',
    assignedTo: 'RAED - Region 7',
    evaluator: 'EPDSD - Miguel Santos',
    budgetYear: '2024',
    bidOpeningDate: '2024-01-15',
    noticeOfAwardDate: '2024-02-01',
    noticeToProceedDate: '2024-02-10',
    procurementDocuments: {
      bidOpening: 'bid-opening-document.pdf',
      noticeOfAward: 'notice-of-award-document.pdf',
      noticeToProceed: 'notice-to-proceed-document.pdf'
    },
    deliveryDate: '2024-06-30',
    inspectionDate: '2024-07-05',
    inspectorName: 'Maria Inspector',
    dateTurnover: '2024-07-15',
    representativeBeneficiary: 'LGU Cebu City',
    beneficiaryNumber: 'BEN-001'
  }
]

const mockFMRProjects: Project[] = [
  {
    id: 'FMR-PKG1-001',
    title: 'Farm-to-Market Road - Package 1',
    type: 'FMR',
    province: 'Albay',
    region: 'Region 5',
    status: 'Proposal',
    description: 'Farm-to-market road construction for agricultural communities',
    budget: 12000000,
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    updatedAt: '2024-01-28T11:30:00Z',
    assignedTo: 'RAED - Region 5'
  },
  {
    id: 'FMR-PKG2-001',
    title: 'Rural Access Road - Package 2',
    type: 'FMR',
    province: 'Nueva Ecija',
    region: 'Region 3',
    status: 'Completed',
    description: 'Rural access road development project',
    budget: 22000000,
    startDate: '2023-06-01',
    endDate: '2023-12-15',
    updatedAt: '2023-12-15T16:45:00Z',
    assignedTo: 'RAED - Region 3',
    budgetYear: '2023',
    bidOpeningDate: '2023-06-15',
    noticeOfAwardDate: '2023-07-01',
    noticeToProceedDate: '2023-07-10',
    procurementDocuments: {
      bidOpening: 'bid-opening-document.pdf',
      noticeOfAward: 'notice-of-award-document.pdf',
      noticeToProceed: 'notice-to-proceed-document.pdf'
    },
    dateCompleted: '2023-12-15',
    dateTurnedOver: '2023-12-20',
    asBuiltPlans: {
      cad: 'as-built-plans.dwg',
      pdf: 'as-built-plans.pdf'
    },
    postGeotaggedPhotos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
  },
  {
    id: 'FMR-PKG3-001',
    title: 'Agricultural Road Network - Package 3',
    type: 'FMR',
    province: 'Cebu',
    region: 'Region 7',
    status: 'Implementation',
    description: 'Agricultural road network development',
    budget: 28000000,
    startDate: '2024-01-01',
    endDate: '2024-10-31',
    updatedAt: '2024-01-30T09:15:00Z',
    assignedTo: 'RAED - Region 7',
    budgetYear: '2024',
    bidOpeningDate: '2024-01-15',
    noticeOfAwardDate: '2024-02-01',
    noticeToProceedDate: '2024-02-10',
    procurementDocuments: {
      bidOpening: 'bid-opening-document.pdf',
      noticeOfAward: 'notice-of-award-document.pdf',
      noticeToProceed: 'notice-to-proceed-document.pdf'
    }
  }
]

// Helper function to generate project packages for each region
function generateProjectPackagesForRegion(region: string, regionNumber: number, provinces: string[]): Project[] {
  const packages: Project[] = []
  
  for (let i = 1; i <= 5; i++) {
    const packageId = `PKG-${String(regionNumber).padStart(2, '0')}${i}`
    const provinceIndex = (i - 1) % provinces.length
    const province = provinces[provinceIndex]
    
    const statuses = ['Proposal', 'Implementation', 'Completed']
    const status = statuses[(i - 1) % statuses.length]
    
    const packageTitles = [
      `${region} Development Package`,
      `${province} Infrastructure Package`,
      `${province} Equipment Package`,
      `${province} Rural Package`,
      `${region} Connectivity Package`
    ]
    
    const descriptions = [
      `Comprehensive development package for ${region} including infrastructure and agricultural projects`,
      `Infrastructure development package for ${province} focusing on road construction and public facilities`,
      `Equipment and machinery package for ${province} region including agricultural and construction equipment`,
      `Rural development package for ${province} focusing on connectivity and agricultural infrastructure`,
      `Connectivity and infrastructure package for improved transportation in ${region}`
    ]
    
    const packageTitle = packageTitles[i - 1]
    const description = descriptions[i - 1]
    
    // Generate different project combinations
    const projectCombinations = [
      { infrastructure: 1, machinery: 1, fmr: 1 },
      { infrastructure: 2, machinery: 0, fmr: 1 },
      { infrastructure: 0, machinery: 2, fmr: 1 },
      { infrastructure: 1, machinery: 1, fmr: 2 },
      { infrastructure: 1, machinery: 1, fmr: 1 }
    ]
    
    const combination = projectCombinations[i - 1]
    
    // Select individual projects based on combination
    const individualProjects: Project[] = []
    
    for (let j = 0; j < combination.infrastructure; j++) {
      individualProjects.push({
        ...mockInfrastructureProjects[j % mockInfrastructureProjects.length],
        id: `${packageId}-INFRA-${j + 1}`,
        title: `${mockInfrastructureProjects[j % mockInfrastructureProjects.length].title} - ${packageTitle}`,
        province: province,
        region: region,
        assignedTo: `RAED - ${region}`
      })
    }
    
    for (let j = 0; j < combination.machinery; j++) {
      individualProjects.push({
        ...mockMachineryProjects[j % mockMachineryProjects.length],
        id: `${packageId}-MACH-${j + 1}`,
        title: `${mockMachineryProjects[j % mockMachineryProjects.length].title} - ${packageTitle}`,
        province: province,
        region: region,
        assignedTo: `RAED - ${region}`
      })
    }
    
    for (let j = 0; j < combination.fmr; j++) {
      individualProjects.push({
        ...mockFMRProjects[j % mockFMRProjects.length],
        id: `${packageId}-FMR-${j + 1}`,
        title: `${mockFMRProjects[j % mockFMRProjects.length].title} - ${packageTitle}`,
        province: province,
        region: region,
        assignedTo: `RAED - ${region}`
      })
    }
    
    const totalBudget = individualProjects.reduce((sum, project) => sum + project.budget, 0)
    
    packages.push({
      id: packageId,
      title: packageTitle,
      type: 'Project Package',
      province: province,
      region: region,
      status: status,
      description: description,
      budget: totalBudget,
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      updatedAt: '2024-01-20T10:30:00Z',
      assignedTo: `RAED - ${region}`,
      packageProjects: combination,
      individualProjects: individualProjects
    })
  }
  
  return packages
}

// Mock Project Packages - 5 packages per region
export const mockProjectPackages: Project[] = [
  // Region 1
  ...generateProjectPackagesForRegion('Region 1', 1, ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan']),
  
  // Region 2
  ...generateProjectPackagesForRegion('Region 2', 2, ['Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino']),
  
  // Region 3
  ...generateProjectPackagesForRegion('Region 3', 3, ['Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales', 'Aurora']),
  
  // Region 4
  ...generateProjectPackagesForRegion('Region 4', 4, ['Batangas', 'Cavite', 'Laguna', 'Quezon', 'Rizal']),
  
  // Region 4B
  ...generateProjectPackagesForRegion('Region 4B', 5, ['Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Romblon']),
  
  // Region 5
  ...generateProjectPackagesForRegion('Region 5', 6, ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon']),
  
  // Region 6
  ...generateProjectPackagesForRegion('Region 6', 7, ['Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo', 'Negros Occidental']),
  
  // Region 7
  ...generateProjectPackagesForRegion('Region 7', 8, ['Bohol', 'Cebu', 'Negros Oriental', 'Siquijor']),
  
  // Region 8
  ...generateProjectPackagesForRegion('Region 8', 9, ['Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte']),
  
  // Region 9
  ...generateProjectPackagesForRegion('Region 9', 10, ['Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay']),
  
  // Region 10
  ...generateProjectPackagesForRegion('Region 10', 11, ['Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental']),
  
  // Region 11
  ...generateProjectPackagesForRegion('Region 11', 12, ['Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental', 'Davao de Oro']),
  
  // Region 12
  ...generateProjectPackagesForRegion('Region 12', 13, ['Cotabato', 'Sarangani', 'South Cotabato', 'Sultan Kudarat']),
  
  // Region 13
  ...generateProjectPackagesForRegion('Region 13', 14, ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur'])
]
