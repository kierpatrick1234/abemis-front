'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, X, MapPin } from 'lucide-react'
import { useLocationData } from '@/lib/hooks/use-location-data'

interface FMRProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: Record<string, unknown>) => void
  editingDraft?: any // Project being edited
  showCloseButton?: boolean // Show X button for package projects
  packageTitle?: string
  packageDescription?: string
}

export function FMRProjectModal({ 
  isOpen, 
  onClose, 
  onProjectCreate, 
  editingDraft, 
  showCloseButton = false,
  packageTitle,
  packageDescription
}: FMRProjectModalProps) {
  // Location data from PSGC API
  const {
    locationData,
    selection,
    handleRegionChange,
    handleProvinceChange,
    handleDistrictChange,
    handleCityChange,
    handleBarangayChange
  } = useLocationData()

  const [formData, setFormData] = useState({
    title: editingDraft?.title || '',
    description: editingDraft?.description || '',
    budget: editingDraft?.budget || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!selection.region || !selection.province || !selection.district || !selection.city || !selection.barangay) {
      alert('Please fill in all required location fields (Region, Province, District, Municipality/City, and Barangay)')
      return
    }
    
    const projectData = {
      title: formData.title || 'New FMR Project',
      type: 'FMR',
      description: formData.description || 'Farm-to-Market Road project',
      // Location data from PSGC API
      region: locationData.regions.find(r => r.code === selection.region)?.name || '',
      province: locationData.provinces.find(p => p.code === selection.province)?.name || '',
      district: locationData.congressionalDistricts.find(d => d.code === selection.district)?.name || '',
      municipality: locationData.cities.find(c => c.code === selection.city)?.name || '',
      barangay: locationData.barangays.find(b => b.code === selection.barangay)?.name || '',
      // PSGC codes for reference
      regionCode: selection.region,
      provinceCode: selection.province,
      districtCode: selection.district,
      cityCode: selection.city,
      barangayCode: selection.barangay,
      budget: formData.budget ? parseFloat(formData.budget) : 0,
      ...(packageTitle && { packageTitle }),
      ...(packageDescription && { packageDescription })
    }

    onProjectCreate(projectData)
  }

  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      description: '',
      budget: ''
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Create FMR Project
              </DialogTitle>
              <DialogDescription>
                Fill in the details for your Farm-to-Market Road project
              </DialogDescription>
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="Enter FMR project title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
              />
            </div>

            {locationData.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{locationData.error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="region" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  Region *
                </Label>
                <select
                  id="region"
                  value={selection.region}
                  onChange={(e) => {
                    const selectedRegion = locationData.regions.find(r => r.code === e.target.value)
                    if (selectedRegion) {
                      handleRegionChange(selectedRegion.code, selectedRegion.name)
                    }
                  }}
                  disabled={locationData.loading.regions}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">{locationData.loading.regions ? 'Loading regions...' : 'Select Region'}</option>
                  {locationData.regions.map((region) => (
                    <option key={region.code} value={region.code}>{region.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="province" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  Province *
                </Label>
                <select
                  id="province"
                  value={selection.province}
                  onChange={(e) => {
                    const selectedProvince = locationData.provinces.find(p => p.code === e.target.value)
                    if (selectedProvince) {
                      handleProvinceChange(selectedProvince.code, selectedProvince.name)
                    }
                  }}
                  disabled={!selection.region || locationData.loading.provinces}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    {!selection.region 
                      ? 'Select a region first' 
                      : locationData.loading.provinces 
                        ? 'Loading provinces...' 
                        : 'Select Province'
                    }
                  </option>
                  {locationData.provinces.map((province) => (
                    <option key={province.code} value={province.code}>{province.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  District *
                </Label>
                <select
                  id="district"
                  value={selection.district}
                  onChange={(e) => {
                    const selectedDistrict = locationData.congressionalDistricts.find(d => d.code === e.target.value)
                    if (selectedDistrict) {
                      handleDistrictChange(selectedDistrict.code, selectedDistrict.name)
                    }
                  }}
                  disabled={!selection.province || locationData.loading.congressionalDistricts}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    {!selection.province 
                      ? 'Select a province first' 
                      : locationData.loading.congressionalDistricts 
                        ? 'Loading districts...' 
                        : 'Select District'
                    }
                  </option>
                  {locationData.congressionalDistricts.map((district) => (
                    <option key={district.code} value={district.code}>{district.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipality" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  Municipality/City *
                </Label>
                <select
                  id="municipality"
                  value={selection.city}
                  onChange={(e) => {
                    const selectedCity = locationData.cities.find(c => c.code === e.target.value)
                    if (selectedCity) {
                      handleCityChange(selectedCity.code, selectedCity.name, selectedCity.type)
                    }
                  }}
                  disabled={!selection.district || locationData.loading.cities}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    {!selection.district 
                      ? 'Select a district first' 
                      : locationData.loading.cities 
                        ? 'Loading cities...' 
                        : 'Select Municipality/City'
                    }
                  </option>
                  {locationData.cities.map((city) => (
                    <option key={city.code} value={city.code}>
                      {city.name} {city.type ? `(${city.type})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barangay" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  Barangay *
                </Label>
                <select
                  id="barangay"
                  value={selection.barangay}
                  onChange={(e) => {
                    const selectedBarangay = locationData.barangays.find(b => b.code === e.target.value)
                    if (selectedBarangay) {
                      handleBarangayChange(selectedBarangay.code, selectedBarangay.name)
                    }
                  }}
                  disabled={!selection.city || locationData.loading.barangays}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    {!selection.city 
                      ? 'Select a municipality/city first' 
                      : locationData.loading.barangays 
                        ? 'Loading barangays...' 
                        : 'Select Barangay'
                    }
                  </option>
                  {locationData.barangays.map((barangay) => (
                    <option key={barangay.code} value={barangay.code}>{barangay.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (PHP)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter budget amount"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create FMR Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
