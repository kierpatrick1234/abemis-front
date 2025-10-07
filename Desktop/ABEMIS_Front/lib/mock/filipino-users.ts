import { User, Role } from '../types'
import { getRAEDName, getRAEDNameComponents } from './raed-assignments'

// Filipino names data
const filipinoFirstNames = [
  'Maria', 'Jose', 'Antonio', 'Francisco', 'Manuel', 'Pedro', 'Juan', 'Carlos', 'Rafael', 'Diego',
  'Ana', 'Carmen', 'Isabel', 'Rosa', 'Teresa', 'Dolores', 'Pilar', 'Concepcion', 'Mercedes', 'Josefa',
  'Miguel', 'Angel', 'Luis', 'Fernando', 'Sergio', 'Alberto', 'Roberto', 'Ricardo', 'Eduardo', 'Jorge',
  'Cristina', 'Patricia', 'Monica', 'Alejandra', 'Beatriz', 'Elena', 'Gloria', 'Ines', 'Lucia', 'Magdalena',
  'Andres', 'Felipe', 'Gabriel', 'Hector', 'Ignacio', 'Julio', 'Leonardo', 'Marcos', 'Nicolas', 'Oscar',
  'Adela', 'Blanca', 'Catalina', 'Diana', 'Esperanza', 'Felicia', 'Gabriela', 'Helena', 'Irene', 'Julia',
  'Pablo', 'Quentin', 'Ramon', 'Sebastian', 'Tomas', 'Victor', 'Wilfredo', 'Xavier', 'Yolando', 'Zacarias',
  'Amparo', 'Belen', 'Cecilia', 'Dolores', 'Esperanza', 'Francisca', 'Guadalupe', 'Herminia', 'Imelda', 'Jovita',
  'Lorenzo', 'Marcelo', 'Nestor', 'Octavio', 'Pascual', 'Quintin', 'Rogelio', 'Salvador', 'Tiburcio', 'Ulises',
  'Valentina', 'Wanda', 'Ximena', 'Yolanda', 'Zenaida', 'Aurora', 'Benedicta', 'Consuelo', 'Dorotea', 'Eulalia'
]

const filipinoLastNames = [
  'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Lopez', 'Gonzales', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez',
  'Diaz', 'Cruz', 'Morales', 'Gutierrez', 'Ruiz', 'Blanco', 'Mendoza', 'Castillo', 'Romero', 'Jimenez',
  'Herrera', 'Medina', 'Aguilar', 'Vargas', 'Ramos', 'Moreno', 'Munoz', 'Alvarez', 'Rojas', 'Mendez',
  'Vega', 'Castro', 'Ortega', 'Delgado', 'Silva', 'Rojas', 'Guerrero', 'Contreras', 'Luna', 'Espinoza',
  'Fernandez', 'Mendoza', 'Herrera', 'Vargas', 'Ramos', 'Moreno', 'Munoz', 'Alvarez', 'Rojas', 'Mendez',
  'Vega', 'Castro', 'Ortega', 'Delgado', 'Silva', 'Rojas', 'Guerrero', 'Contreras', 'Luna', 'Espinoza',
  'Navarro', 'Jimenez', 'Torres', 'Dominguez', 'Vargas', 'Herrera', 'Morales', 'Gutierrez', 'Ruiz', 'Blanco',
  'Mendoza', 'Castillo', 'Romero', 'Jimenez', 'Herrera', 'Medina', 'Aguilar', 'Vargas', 'Ramos', 'Moreno',
  'Munoz', 'Alvarez', 'Rojas', 'Mendez', 'Vega', 'Castro', 'Ortega', 'Delgado', 'Silva', 'Rojas'
]

const regions = [
  'NCR', 'BARMM', 'Region 1', 'Region 2', 'Region 3', 'Region 4A', 'Region 4B', 
  'Region 5', 'Region 6', 'Region 7', 'Region 8', 'Region 9', 'Region 10', 
  'Region 11', 'Region 12', 'Region 13'
]

// const roles: Role[] = ['superadmin', 'RAED', 'EPDSD', 'PPMD', 'SEPD']

// Generate 150 Filipino users
export const generateFilipinoUsers = (): User[] => {
  const users: User[] = []
  
  for (let i = 1; i <= 150; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)]
    
    // Role assignment based on region
    let role: Role
    let firstName: string
    let middleName: string
    let lastName: string
    let name: string
    
    if (region === 'NCR') {
      // NCR can only have: superadmin, EPDSD, PPMD, SEPD
      const ncrRoles: Role[] = ['superadmin', 'EPDSD', 'PPMD', 'SEPD']
      role = ncrRoles[Math.floor(Math.random() * ncrRoles.length)]
      firstName = filipinoFirstNames[Math.floor(Math.random() * filipinoFirstNames.length)]
      middleName = filipinoFirstNames[Math.floor(Math.random() * filipinoFirstNames.length)] // Use first names as middle names
      lastName = filipinoLastNames[Math.floor(Math.random() * filipinoLastNames.length)]
      name = `${firstName} ${middleName} ${lastName}`
    } else {
      // All other regions only have RAED - use specific RAED names
      role = 'RAED'
      const nameComponents = getRAEDNameComponents(region)
      firstName = nameComponents.firstName
      middleName = nameComponents.middleName
      lastName = nameComponents.lastName
      name = getRAEDName(region)
    }
    
    const status = Math.random() > 0.2 ? 'active' : 'inactive'
    
    // Generate realistic dates
    const createdAt = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const lastLogin = status === 'active' 
      ? new Date(2024, 0, Math.floor(Math.random() * 25) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
      : new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    
    const user: User = {
      id: `USR-${String(i).padStart(3, '0')}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@abemis.gov`,
      role,
      firstName,
      middleName,
      lastName,
      regionAssigned: region,
      status,
      lastLogin: lastLogin.toISOString(),
      createdAt: createdAt.toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`
    }
    
    users.push(user)
  }
  
  return users
}

export const mockFilipinoUsers = generateFilipinoUsers()
