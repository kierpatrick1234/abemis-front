// RAED region assignments with full Filipino names (first, middle, last)
export const raedAssignments = {
  'Region 1': 'Juan Miguel Dela Cruz',
  'Region 2': 'Maria Elena Santos',
  'Region 3': 'Jose Antonio Garcia',
  'Region 4': 'Ana Patricia Reyes',
  'Region 4B': 'Pedro Luis Bautista',
  'Region 5': 'Carmen Sofia Lopez',
  'Region 6': 'Antonio Rafael Cruz',
  'Region 7': 'Isabel Cristina Rodriguez',
  'Region 8': 'Francisco Miguel Martinez',
  'Region 9': 'Rosa Maria Hernandez',
  'Region 10': 'Manuel Carlos Gonzalez',
  'Region 11': 'Teresa Esperanza Perez',
  'Region 12': 'Carlos Eduardo Sanchez',
  'Region 13': 'Dolores Concepcion Ramirez',
  'NIR': 'Ricardo Antonio Villanueva'
}

// Function to get RAED name for a region
export function getRAEDName(region: string): string {
  return raedAssignments[region as keyof typeof raedAssignments] || 'Unknown RAED'
}

// Function to get RAED label (name + region number)
export function getRAEDLabel(region: string): string {
  const name = getRAEDName(region)
  if (region === 'NIR') {
    return `${name}\nRAED-NIR`
  }
  const regionNumber = region === 'Region 4B' ? '4B' : region.split(' ')[1]
  return `${name}\nRAED-${regionNumber}`
}

// Function to get just the RAED identifier
export function getRAEDIdentifier(region: string): string {
  if (region === 'NIR') {
    return 'RAED-NIR'
  }
  const regionNumber = region === 'Region 4B' ? '4B' : region.split(' ')[1]
  return `RAED-${regionNumber}`
}

// Function to get RAED name components
export function getRAEDNameComponents(region: string): { firstName: string; middleName: string; lastName: string } {
  const fullName = getRAEDName(region)
  const nameParts = fullName.split(' ')
  
  if (nameParts.length >= 3) {
    return {
      firstName: nameParts[0],
      middleName: nameParts[1],
      lastName: nameParts.slice(2).join(' ')
    }
  } else if (nameParts.length === 2) {
    return {
      firstName: nameParts[0],
      middleName: '',
      lastName: nameParts[1]
    }
  } else {
    return {
      firstName: fullName,
      middleName: '',
      lastName: ''
    }
  }
}
