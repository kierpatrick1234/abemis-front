// PSGC API service for fetching Philippine location data
// Using PSGC Cloud API: https://psgc.cloud/

export interface PSGCRegion {
  code: string
  name: string
  regionName: string
}

export interface PSGCProvince {
  code: string
  name: string
  regionCode: string
  regionName: string
}

export interface PSGCCity {
  code: string
  name: string
  provinceCode: string
  provinceName: string
  regionCode: string
  regionName: string
  type?: 'City' | 'Municipality'
}

export interface PSGCBarangay {
  code: string
  name: string
  cityCode: string
  cityName: string
  provinceCode: string
  provinceName: string
  regionCode: string
  regionName: string
}

class PSGCAPIService {
  private baseUrl = 'https://psgc.cloud/api'

  async getRegions(): Promise<PSGCRegion[]> {
    try {
      const response = await fetch(`${this.baseUrl}/regions`)
      if (!response.ok) {
        throw new Error(`Failed to fetch regions: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching regions:', error)
      throw error
    }
  }

  async getProvincesByRegion(regionCode: string): Promise<PSGCProvince[]> {
    try {
      const response = await fetch(`${this.baseUrl}/regions/${regionCode}/provinces`)
      if (!response.ok) {
        throw new Error(`Failed to fetch provinces for region ${regionCode}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching provinces for region ${regionCode}:`, error)
      throw error
    }
  }

  async getCitiesByProvince(provinceCode: string): Promise<PSGCCity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/provinces/${provinceCode}/cities`)
      if (!response.ok) {
        throw new Error(`Failed to fetch cities for province ${provinceCode}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching cities for province ${provinceCode}:`, error)
      throw error
    }
  }

  async getMunicipalitiesByProvince(provinceCode: string): Promise<PSGCCity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/provinces/${provinceCode}/municipalities`)
      if (!response.ok) {
        throw new Error(`Failed to fetch municipalities for province ${provinceCode}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching municipalities for province ${provinceCode}:`, error)
      throw error
    }
  }

  async getCitiesAndMunicipalitiesByProvince(provinceCode: string): Promise<PSGCCity[]> {
    try {
      // Fetch both cities and municipalities
      const [citiesResponse, municipalitiesResponse] = await Promise.all([
        fetch(`${this.baseUrl}/provinces/${provinceCode}/cities`),
        fetch(`${this.baseUrl}/provinces/${provinceCode}/municipalities`)
      ])

      if (!citiesResponse.ok) {
        throw new Error(`Failed to fetch cities for province ${provinceCode}: ${citiesResponse.statusText}`)
      }
      if (!municipalitiesResponse.ok) {
        throw new Error(`Failed to fetch municipalities for province ${provinceCode}: ${municipalitiesResponse.statusText}`)
      }

      const [cities, municipalities] = await Promise.all([
        citiesResponse.json(),
        municipalitiesResponse.json()
      ])

      // Combine cities and municipalities, marking them appropriately
      const combined = [
        ...cities.map((city: any) => ({ ...city, type: 'City' as const })),
        ...municipalities.map((municipality: any) => ({ ...municipality, type: 'Municipality' as const }))
      ]

      // Sort alphabetically by name
      return combined.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error(`Error fetching cities and municipalities for province ${provinceCode}:`, error)
      throw error
    }
  }

  async getBarangaysByCity(cityCode: string): Promise<PSGCBarangay[]> {
    try {
      // Try multiple endpoint structures
      const endpoints = [
        `${this.baseUrl}/cities/${cityCode}/barangays`,
        `${this.baseUrl}/v2/cities/${cityCode}/barangays`,
        `${this.baseUrl}/api/cities/${cityCode}/barangays`
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint)
          if (response.ok) {
            return await response.json()
          }
        } catch (e) {
          // Continue to next endpoint
          continue
        }
      }
      
      throw new Error(`Failed to fetch barangays for city ${cityCode} from any endpoint`)
    } catch (error) {
      console.error(`Error fetching barangays for city ${cityCode}:`, error)
      throw error
    }
  }

  async getBarangaysByMunicipality(municipalityCode: string): Promise<PSGCBarangay[]> {
    try {
      // Try multiple endpoint structures
      const endpoints = [
        `${this.baseUrl}/municipalities/${municipalityCode}/barangays`,
        `${this.baseUrl}/v2/municipalities/${municipalityCode}/barangays`,
        `${this.baseUrl}/api/municipalities/${municipalityCode}/barangays`
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint)
          if (response.ok) {
            return await response.json()
          }
        } catch (e) {
          // Continue to next endpoint
          continue
        }
      }
      
      throw new Error(`Failed to fetch barangays for municipality ${municipalityCode} from any endpoint`)
    } catch (error) {
      console.error(`Error fetching barangays for municipality ${municipalityCode}:`, error)
      throw error
    }
  }

  async getBarangaysByCityOrMunicipality(cityCode: string, cityType?: 'City' | 'Municipality'): Promise<PSGCBarangay[]> {
    try {
      if (cityType === 'Municipality') {
        return await this.getBarangaysByMunicipality(cityCode)
      } else {
        return await this.getBarangaysByCity(cityCode)
      }
    } catch (error) {
      console.error(`Error fetching barangays for ${cityType || 'city/municipality'} ${cityCode}:`, error)
      // Try fallback method
      try {
        console.log('Trying fallback method for barangays...')
        return await this.getBarangaysByCityCode(cityCode)
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError)
        return []
      }
    }
  }

  // Helper method to get all provinces (useful for fallback)
  async getAllProvinces(): Promise<PSGCProvince[]> {
    try {
      const response = await fetch(`${this.baseUrl}/provinces`)
      if (!response.ok) {
        throw new Error(`Failed to fetch all provinces: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching all provinces:', error)
      throw error
    }
  }

  // Helper method to get all cities (useful for fallback)
  async getAllCities(): Promise<PSGCCity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/cities`)
      if (!response.ok) {
        throw new Error(`Failed to fetch all cities: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching all cities:', error)
      throw error
    }
  }

  // Helper method to get all barangays (useful for fallback)
  async getAllBarangays(): Promise<PSGCBarangay[]> {
    try {
      const response = await fetch(`${this.baseUrl}/barangays`)
      if (!response.ok) {
        throw new Error(`Failed to fetch all barangays: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching all barangays:', error)
      throw error
    }
  }

  // Fallback method to get barangays by filtering all barangays
  async getBarangaysByCityCode(cityCode: string): Promise<PSGCBarangay[]> {
    try {
      const allBarangays = await this.getAllBarangays()
      return allBarangays.filter(barangay => barangay.cityCode === cityCode)
    } catch (error) {
      console.error(`Error fetching barangays for city ${cityCode} using fallback:`, error)
      return []
    }
  }
}

export const psgcAPI = new PSGCAPIService()
