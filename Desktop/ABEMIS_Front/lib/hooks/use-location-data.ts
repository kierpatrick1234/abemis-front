import { useState, useEffect, useCallback } from 'react'
import { psgcAPI, PSGCRegion, PSGCProvince, PSGCCongressionalDistrict, PSGCCity, PSGCBarangay } from '@/lib/services/psgc-api'
import { filterCitiesByCongressionalDistrict, getProvinceCode } from '@/lib/services/congressional-district-mapping'

export interface LocationData {
  regions: PSGCRegion[]
  provinces: PSGCProvince[]
  congressionalDistricts: PSGCCongressionalDistrict[]
  cities: PSGCCity[]
  barangays: PSGCBarangay[]
  loading: {
    regions: boolean
    provinces: boolean
    congressionalDistricts: boolean
    cities: boolean
    barangays: boolean
  }
  error: string | null
}

export interface LocationSelection {
  region: string
  province: string
  district: string
  city: string
  barangay: string
}

export const useLocationData = () => {
  const [locationData, setLocationData] = useState<LocationData>({
    regions: [],
    provinces: [],
    congressionalDistricts: [],
    cities: [],
    barangays: [],
    loading: {
      regions: false,
      provinces: false,
      congressionalDistricts: false,
      cities: false,
      barangays: false
    },
    error: null
  })

  const [selection, setSelection] = useState<LocationSelection>({
    region: '',
    province: '',
    district: '',
    city: '',
    barangay: ''
  })

  // Load regions on mount
  useEffect(() => {
    loadRegions()
  }, [])

  const loadRegions = useCallback(async () => {
    setLocationData(prev => ({
      ...prev,
      loading: { ...prev.loading, regions: true },
      error: null
    }))

    try {
      const regions = await psgcAPI.getRegions()
      setLocationData(prev => ({
        ...prev,
        regions,
        loading: { ...prev.loading, regions: false }
      }))
    } catch (error) {
      setLocationData(prev => ({
        ...prev,
        loading: { ...prev.loading, regions: false },
        error: error instanceof Error ? error.message : 'Failed to load regions'
      }))
    }
  }, [])

  const loadProvinces = useCallback(async (regionCode: string) => {
    if (!regionCode) return

    setLocationData(prev => ({
      ...prev,
      loading: { ...prev.loading, provinces: true },
      error: null
    }))

    try {
      const provinces = await psgcAPI.getProvincesByRegion(regionCode)
      setLocationData(prev => ({
        ...prev,
        provinces,
        loading: { ...prev.loading, provinces: false }
      }))
    } catch (error) {
      setLocationData(prev => ({
        ...prev,
        loading: { ...prev.loading, provinces: false },
        error: error instanceof Error ? error.message : 'Failed to load provinces'
      }))
    }
  }, [])

  const loadCongressionalDistricts = useCallback(async (provinceCode: string, provinceName?: string) => {
    if (!provinceCode) return

    setLocationData(prev => ({
      ...prev,
      loading: { ...prev.loading, congressionalDistricts: true },
      error: null
    }))

    try {
      // Get province name - use provided name or find from location data
      let finalProvinceName = provinceName || ''
      if (!finalProvinceName) {
        // Get from current location data state
        const currentProvinces = locationData.provinces
        const province = currentProvinces.find(p => p.code === provinceCode)
        finalProvinceName = province?.name || ''
      }
      
      const congressionalDistricts = await psgcAPI.getCongressionalDistrictsByProvince(provinceCode, finalProvinceName)
      
      // If no congressional districts found, create a default "All Districts" option
      // This ensures district selection is always required
      const finalDistricts = congressionalDistricts.length > 0 
        ? congressionalDistricts 
        : [{
            code: provinceCode + '-CD-ALL',
            name: 'All Districts',
            provinceCode: provinceCode,
            provinceName: '',
            regionCode: '',
            regionName: '',
            districtNumber: 0
          }]
      
      setLocationData(prev => ({
        ...prev,
        congressionalDistricts: finalDistricts,
        loading: { ...prev.loading, congressionalDistricts: false }
      }))
    } catch (error) {
      // On error, create a default district option
      setLocationData(prev => ({
        ...prev,
        congressionalDistricts: [{
          code: provinceCode + '-CD-ALL',
          name: 'All Districts',
          provinceCode: provinceCode,
          provinceName: '',
          regionCode: '',
          regionName: '',
          districtNumber: 0
        }],
        loading: { ...prev.loading, congressionalDistricts: false },
        error: error instanceof Error ? error.message : 'Failed to load districts'
      }))
    }
  }, [locationData.provinces])

  const loadCities = useCallback(async (provinceCode: string, congressionalDistrictCode?: string) => {
    if (!provinceCode) return

    setLocationData(prev => ({
      ...prev,
      loading: { ...prev.loading, cities: true },
      error: null
    }))

    try {
      // First, get all cities from the province
      let cities = await psgcAPI.getCitiesAndMunicipalitiesByProvince(provinceCode, congressionalDistrictCode)
      
      // If a congressional district is specified, filter cities by district using the mapping
      if (congressionalDistrictCode && !congressionalDistrictCode.endsWith('-CD-ALL')) {
        // Extract district number from the congressional district code
        // Format is typically like "PROVINCE-CD1" or "PROVINCE-CD-1" or similar
        const districtMatch = congressionalDistrictCode.match(/CD(\d+)/) || 
                             congressionalDistrictCode.match(/-(\d+)$/)
        if (districtMatch) {
          const districtNumber = parseInt(districtMatch[1])
          
          // Get province name from the current selection or location data
          const province = locationData.provinces.find(p => p.code === provinceCode)
          const provinceName = province?.name || ''
          
          // Get province code for mapping (convert province name to code)
          // Try multiple approaches to find the correct province code
          let mappingProvinceCode = getProvinceCode(provinceName)
          
          // If province name mapping fails, try using the province code directly
          // (PSGC codes might be numeric, so we need to map them)
          if (!mappingProvinceCode) {
            // Try to find a match by checking if the province code matches any key in the mapping
            // This handles cases where PSGC uses numeric codes but our mapping uses short codes
            mappingProvinceCode = provinceCode
          }
          
          // Filter cities using the congressional district mapping
          // This will filter cities to only show those in the selected congressional district
          cities = filterCitiesByCongressionalDistrict(cities, mappingProvinceCode, districtNumber)
        }
      }
      
      setLocationData(prev => ({
        ...prev,
        cities,
        loading: { ...prev.loading, cities: false }
      }))
    } catch (error) {
      setLocationData(prev => ({
        ...prev,
        loading: { ...prev.loading, cities: false },
        error: error instanceof Error ? error.message : 'Failed to load cities and municipalities'
      }))
    }
  }, [locationData.provinces])

  const loadBarangays = useCallback(async (cityCode: string, cityType?: 'City' | 'Municipality') => {
    if (!cityCode) return

    setLocationData(prev => ({
      ...prev,
      loading: { ...prev.loading, barangays: true },
      error: null
    }))

    try {
      const barangays = await psgcAPI.getBarangaysByCityOrMunicipality(cityCode, cityType)
      setLocationData(prev => ({
        ...prev,
        barangays,
        loading: { ...prev.loading, barangays: false }
      }))
    } catch (error) {
      setLocationData(prev => ({
        ...prev,
        loading: { ...prev.loading, barangays: false },
        error: error instanceof Error ? error.message : 'Failed to load barangays'
      }))
    }
  }, [])

  const handleRegionChange = useCallback((regionCode: string, regionName: string) => {
    setSelection({
      region: regionCode,
      province: '',
      district: '',
      city: '',
      barangay: ''
    })
    
    // Clear dependent data
    setLocationData(prev => ({
      ...prev,
      provinces: [],
      congressionalDistricts: [],
      cities: [],
      barangays: []
    }))

    if (regionCode) {
      loadProvinces(regionCode)
    }
  }, [loadProvinces])

  const handleProvinceChange = useCallback((provinceCode: string, provinceName: string) => {
    setSelection(prev => ({
      ...prev,
      province: provinceCode,
      district: '',
      city: '',
      barangay: ''
    }))

    // Clear dependent data
    setLocationData(prev => ({
      ...prev,
      congressionalDistricts: [],
      cities: [],
      barangays: []
    }))

    if (provinceCode) {
      // Load congressional districts first with province name for code mapping
      // Don't load cities yet - wait for congressional district selection
      loadCongressionalDistricts(provinceCode, provinceName)
    }
  }, [loadCongressionalDistricts])

  const handleDistrictChange = useCallback((congressionalDistrictCode: string, congressionalDistrictName: string) => {
    setSelection(prev => ({
      ...prev,
      district: congressionalDistrictCode,
      city: '',
      barangay: ''
    }))

    // Clear dependent data
    setLocationData(prev => ({
      ...prev,
      cities: [],
      barangays: []
    }))

    // Load cities/municipalities filtered by congressional district
    // If district code ends with '-CD-ALL', it's a default district, so load from province
    if (congressionalDistrictCode && selection.province) {
      if (congressionalDistrictCode.endsWith('-CD-ALL')) {
        // Default congressional district - load all municipalities from province
        loadCities(selection.province)
      } else {
        // Real congressional district - load municipalities filtered by district
        loadCities(selection.province, congressionalDistrictCode)
      }
    }
  }, [loadCities, selection.province])

  const handleCityChange = useCallback((cityCode: string, cityName: string, cityType?: 'City' | 'Municipality') => {
    setSelection(prev => ({
      ...prev,
      city: cityCode,
      barangay: ''
    }))

    // Clear dependent data
    setLocationData(prev => ({
      ...prev,
      barangays: []
    }))

    if (cityCode) {
      loadBarangays(cityCode, cityType)
    }
  }, [loadBarangays])

  const handleBarangayChange = useCallback((barangayCode: string, barangayName: string) => {
    setSelection(prev => ({
      ...prev,
      barangay: barangayCode
    }))
  }, [])

  const resetSelection = useCallback(() => {
    setSelection({
      region: '',
      province: '',
      district: '',
      city: '',
      barangay: ''
    })
    setLocationData(prev => ({
      ...prev,
      provinces: [],
      congressionalDistricts: [],
      cities: [],
      barangays: []
    }))
  }, [])

  return {
    locationData,
    selection,
    handleRegionChange,
    handleProvinceChange,
    handleDistrictChange,
    handleCityChange,
    handleBarangayChange,
    resetSelection
  }
}
