import { useState, useEffect, useCallback } from 'react'
import { psgcAPI, PSGCRegion, PSGCProvince, PSGCCity, PSGCBarangay } from '@/lib/services/psgc-api'

export interface LocationData {
  regions: PSGCRegion[]
  provinces: PSGCProvince[]
  cities: PSGCCity[]
  barangays: PSGCBarangay[]
  loading: {
    regions: boolean
    provinces: boolean
    cities: boolean
    barangays: boolean
  }
  error: string | null
}

export interface LocationSelection {
  region: string
  province: string
  city: string
  barangay: string
}

export const useLocationData = () => {
  const [locationData, setLocationData] = useState<LocationData>({
    regions: [],
    provinces: [],
    cities: [],
    barangays: [],
    loading: {
      regions: false,
      provinces: false,
      cities: false,
      barangays: false
    },
    error: null
  })

  const [selection, setSelection] = useState<LocationSelection>({
    region: '',
    province: '',
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

  const loadCities = useCallback(async (provinceCode: string) => {
    if (!provinceCode) return

    setLocationData(prev => ({
      ...prev,
      loading: { ...prev.loading, cities: true },
      error: null
    }))

    try {
      const cities = await psgcAPI.getCitiesAndMunicipalitiesByProvince(provinceCode)
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
  }, [])

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
      city: '',
      barangay: ''
    })
    
    // Clear dependent data
    setLocationData(prev => ({
      ...prev,
      provinces: [],
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
      city: '',
      barangay: ''
    }))

    // Clear dependent data
    setLocationData(prev => ({
      ...prev,
      cities: [],
      barangays: []
    }))

    if (provinceCode) {
      loadCities(provinceCode)
    }
  }, [loadCities])

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
      city: '',
      barangay: ''
    })
    setLocationData(prev => ({
      ...prev,
      provinces: [],
      cities: [],
      barangays: []
    }))
  }, [])

  return {
    locationData,
    selection,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
    resetSelection
  }
}
