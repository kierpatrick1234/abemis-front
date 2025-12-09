// PSGC API service for fetching Philippine location data
// Using PSGC Cloud API: https://psgc.cloud/

import { 
  filterCitiesByCongressionalDistrict,
  getCongressionalDistrictsByProvince,
  getLGUsByCongressionalDistrict,
  getProvinceCode
} from './congressional-district-mapping'

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

export interface PSGCCongressionalDistrict {
  code: string
  name: string
  provinceCode: string
  provinceName: string
  regionCode: string
  regionName: string
  districtNumber?: number
}

export interface PSGCCity {
  code: string
  name: string
  provinceCode: string
  provinceName: string
  regionCode: string
  regionName: string
  districtCode?: string
  districtName?: string
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

  async getCongressionalDistrictsByProvince(provinceCode: string, provinceName?: string): Promise<PSGCCongressionalDistrict[]> {
    try {
      // Convert PSGC province code to our mapping code
      // PSGC uses numeric codes, but our mapping uses short codes like "AGN", "AGS", etc.
      let mappingProvinceCode = provinceCode
      
      // If province name is provided, try to get the mapping code from the name
      if (provinceName) {
        const codeFromName = getProvinceCode(provinceName)
        if (codeFromName) {
          mappingProvinceCode = codeFromName
        }
      }
      
      // First, try to get districts from the mapping data using the mapping code
      const mappingDistricts = getCongressionalDistrictsByProvince(mappingProvinceCode)
      if (mappingDistricts.length > 0) {
        return mappingDistricts.map(district => ({
          code: `${provinceCode}-CD${district.districtNumber}`,
          name: district.districtName,
          provinceCode: provinceCode, // Keep original PSGC code
          provinceName: district.provinceName,
          regionCode: '',
          regionName: '',
          districtNumber: district.districtNumber
        }))
      }
      
      // If no mapping found, try API endpoints
      const endpoints = [
        `${this.baseUrl}/provinces/${provinceCode}/congressional-districts`,
        `${this.baseUrl}/provinces/${provinceCode}/districts`,
        `${this.baseUrl}/v2/provinces/${provinceCode}/congressional-districts`,
        `${this.baseUrl}/v2/provinces/${provinceCode}/districts`
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint)
          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data) && data.length > 0) {
              // Format the districts with proper naming (1st District, 2nd District, etc.)
              return data.map((item: any) => {
                const districtNumber = item.districtNumber || item.number || item.district || 0
                const provinceName = item.provinceName || ''
                
                // Format district name: "1st District", "2nd District", etc.
                const getOrdinalSuffix = (num: number) => {
                  const j = num % 10
                  const k = num % 100
                  if (j === 1 && k !== 11) return num + 'st'
                  if (j === 2 && k !== 12) return num + 'nd'
                  if (j === 3 && k !== 13) return num + 'rd'
                  return num + 'th'
                }
                
                const districtName = item.name || 
                                   item.districtName || 
                                   (districtNumber > 0 ? `${getOrdinalSuffix(districtNumber)} District` : 'District')
                
                return {
                  code: item.code || item.districtCode || `${provinceCode}-CD${districtNumber}`,
                  name: districtName,
                  provinceCode: item.provinceCode || provinceCode,
                  provinceName: provinceName,
                  regionCode: item.regionCode || '',
                  regionName: item.regionName || '',
                  districtNumber: districtNumber
                }
              })
            }
          }
        } catch (e) {
          // Continue to next endpoint
          continue
        }
      }
      
      // If no congressional districts found, return empty array
      return []
    } catch (error) {
      console.error(`Error fetching congressional districts for province ${provinceCode}:`, error)
      return []
    }
  }

  async getCitiesAndMunicipalitiesByCongressionalDistrict(districtCode: string, provinceCode: string): Promise<PSGCCity[]> {
    try {
      // Try multiple endpoint structures for municipalities by congressional district
      const endpoints = [
        `${this.baseUrl}/congressional-districts/${districtCode}/cities`,
        `${this.baseUrl}/congressional-districts/${districtCode}/municipalities`,
        `${this.baseUrl}/districts/${districtCode}/cities`,
        `${this.baseUrl}/districts/${districtCode}/municipalities`,
        `${this.baseUrl}/v2/congressional-districts/${districtCode}/cities`,
        `${this.baseUrl}/v2/congressional-districts/${districtCode}/municipalities`
      ]

      const allCities: PSGCCity[] = []

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint)
          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data) && data.length > 0) {
              allCities.push(...data.map((item: any) => ({ 
                ...item, 
                type: endpoint.includes('municipalities') ? 'Municipality' as const : 'City' as const,
                districtCode: districtCode
              })))
            }
          }
        } catch (e) {
          // Continue to next endpoint
          continue
        }
      }

      // If no direct endpoint works, fetch all cities from province and filter by district code
      if (allCities.length === 0) {
        try {
          const allProvinceCities = await this.getCitiesAndMunicipalitiesByProvince(provinceCode)
          // Filter cities that belong to this congressional district
          return allProvinceCities.filter((city: PSGCCity) => 
            city.districtCode === districtCode || 
            city.code?.startsWith(districtCode) ||
            // Fallback: if district code contains a number, try to match
            (districtCode.includes('CD') && city.districtCode?.includes(districtCode.split('-CD')[1]))
          )
        } catch (error) {
          console.error('Error filtering cities by congressional district:', error)
          return []
        }
      }

      // Remove duplicates and sort
      const unique = allCities.filter((city, index, self) => 
        index === self.findIndex(c => c.code === city.code)
      )
      return unique.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error(`Error fetching cities/municipalities for congressional district ${districtCode}:`, error)
      return []
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

  async getCitiesAndMunicipalitiesByProvince(provinceCode: string, congressionalDistrictCode?: string): Promise<PSGCCity[]> {
    try {
      // Fetch both cities and municipalities from province
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
      let combined = [
        ...cities.map((city: any) => ({ ...city, type: 'City' as const })),
        ...municipalities.map((municipality: any) => ({ ...municipality, type: 'Municipality' as const }))
      ]

      // If congressional district code is provided, filter using the mapping data
      // Note: The filtering is also done in useLocationData hook, but we do it here too
      // as a backup to ensure cities are filtered correctly
      if (congressionalDistrictCode && !congressionalDistrictCode.endsWith('-CD-ALL')) {
        // Extract district number from code (format: PROVINCE-CD1, PROVINCE-CD2, etc.)
        const districtMatch = congressionalDistrictCode.match(/CD(\d+)/) || 
                             congressionalDistrictCode.match(/-(\d+)$/)
        const districtNumber = districtMatch ? parseInt(districtMatch[1]) : null
        
        if (districtNumber) {
          // Use the congressional district mapping to filter LGUs
          // This ensures only cities/municipalities in the selected district are shown
          combined = filterCitiesByCongressionalDistrict(combined, provinceCode, districtNumber)
        } else {
          // Fallback: filter by district code if available in data
          combined = combined.filter((city: PSGCCity) => 
            city.districtCode === congressionalDistrictCode || 
            city.code?.startsWith(congressionalDistrictCode) ||
            !city.districtCode
          )
        }
      }

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
