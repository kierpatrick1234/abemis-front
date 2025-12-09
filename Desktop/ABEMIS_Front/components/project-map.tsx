'use client'

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'

// Region coordinates for zooming
const regionCoordinates: Record<string, [number, number]> = {
  'Region 1': [16.6167, 120.3167],
  'Region 2': [17.6167, 121.7167],
  'Region 3': [15.1475, 120.5847],
  'Region 4': [14.6042, 121.0000],
  'Region 4B': [13.1333, 121.2833],
  'Region 5': [13.1333, 123.7333],
  'Region 6': [10.7167, 122.5667],
  'Region 7': [10.3167, 123.9000],
  'NIR': [10.6667, 122.9500],
  'Region 8': [11.2500, 125.0000],
  'Region 9': [6.9167, 122.0833],
  'Region 10': [8.4833, 124.6500],
  'Region 11': [7.0667, 125.6000],
  'Region 12': [6.1167, 124.6500],
  'Region 13': [9.7833, 125.4833],
  'CAR': [16.4023, 120.5960],
}

interface ProjectMapProps {
  projects: Array<{
    id: string
    title: string
    budget: number
    startDate: string
    status: string
    coordinates: [number, number]
    region?: string
    province?: string
  }>
}

function CreateClusterLayer({ projects }: ProjectMapProps) {
  const map = useMap()
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)

  useEffect(() => {
    if (!map) return

    // Create cluster group
    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    })

    // Add circles for each project
    projects.forEach((project) => {
      const isCompleted = project.status === 'Completed' || project.status === 'Delivered'
      const isInProgress = project.status === 'Implementation' || project.status === 'Procurement'
      
      // Color: green for completed, blue for in progress, gray for others
      const fillColor = isCompleted ? '#10b981' : isInProgress ? '#3b82f6' : '#6b7280'
      const color = isCompleted ? '#059669' : isInProgress ? '#2563eb' : '#4b5563'

      const circle = L.circleMarker(project.coordinates, {
        radius: 8,
        fillColor,
        color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.7,
      })

      // Format date
      const startDate = new Date(project.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })

      // Format budget
      const budgetFormatted = `₱${(project.budget / 1000000).toFixed(2)}M`

      // Format coordinates
      const [lat, lng] = project.coordinates
      const coordinatesFormatted = `${lat.toFixed(6)}, ${lng.toFixed(6)}`

      // Create popup content
      const popupContent = `
        <div style="min-width: 220px; padding: 12px;">
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #1f2937; line-height: 1.4;">${project.title}</h3>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <span style="color: #6b7280;">Total Cost:</span>
              <span style="font-weight: 600; text-align: right;">${budgetFormatted}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <span style="color: #6b7280;">Date Started:</span>
              <span style="font-weight: 600; text-align: right;">${startDate}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: start; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <span style="color: #6b7280;">Status:</span>
              <span style="font-weight: 600; color: ${isCompleted ? '#10b981' : isInProgress ? '#3b82f6' : '#6b7280'}; text-align: right;">${project.status}</span>
            </div>
            ${project.region ? `
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <span style="color: #6b7280;">Region:</span>
              <span style="font-weight: 600; text-align: right;">${project.region}</span>
            </div>
            ` : ''}
            ${project.province ? `
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <span style="color: #6b7280;">Province:</span>
              <span style="font-weight: 600; text-align: right;">${project.province}</span>
            </div>
            ` : ''}
            <div style="display: flex; flex-direction: column; gap: 2px; padding-top: 8px; border-top: 1px solid #e5e7eb; margin-top: 4px;">
              <span style="color: #6b7280; font-size: 12px;">Coordinates:</span>
              <span style="font-weight: 600; font-family: 'Courier New', monospace; font-size: 13px; color: #374151; background: #f3f4f6; padding: 4px 6px; border-radius: 4px; word-break: break-all;">${coordinatesFormatted}</span>
            </div>
          </div>
        </div>
      `

      circle.bindPopup(popupContent)
      circle.bindTooltip(project.title, { permanent: false, direction: 'top' })
      
      // Add hover effect
      circle.on('mouseover', function() {
        this.setStyle({
          radius: 10,
          opacity: 1,
          fillOpacity: 0.9,
        })
      })
      
      circle.on('mouseout', function() {
        this.setStyle({
          radius: 8,
          opacity: 0.8,
          fillOpacity: 0.7,
        })
      })

      clusterGroup.addLayer(circle)
    })

    clusterRef.current = clusterGroup
    map.addLayer(clusterGroup)

    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current)
      }
    }
  }, [map, projects])

  return null
}

export default CreateClusterLayer

