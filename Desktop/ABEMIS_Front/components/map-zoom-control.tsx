'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface MapZoomControlProps {
  regionFilter: string
}

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
}

function MapZoomControl({ regionFilter }: MapZoomControlProps) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    if (regionFilter === 'All Regions') {
      // Zoom to show entire Philippines
      map.flyTo([12.5, 122.5], 6, {
        duration: 1.5,
        easeLinearity: 0.25
      })
    } else {
      const coords = regionCoordinates[regionFilter]
      if (coords) {
        // Zoom to specific region with appropriate zoom level
        map.flyTo(coords, 8, {
          duration: 1.5,
          easeLinearity: 0.25
        })
      }
    }
  }, [map, regionFilter])

  return null
}

export default MapZoomControl

