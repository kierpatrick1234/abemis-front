// Congressional District to LGU (Municipality/City) Mapping
// Data based on: https://nswmc.emb.gov.ph/wp-content/uploads/2018/09/r4A1.pdf
// This mapping filters LGUs by their congressional district

import districtMappingData from './district-mapping-data.json'

export interface CongressionalDistrictMapping {
  provinceCode: string
  provinceName: string
  districtNumber: number
  districtName: string
  lguNames: string[] // List of LGU (Municipality/City) names in this district
}

// Province name to PSGC code mapping
const provinceNameToCode: Record<string, string> = {
  'ILOCOS NORTE': 'ILN',
  'ILOCOS SUR': 'ILS',
  'LA UNION': 'LUN',
  'PANGASINAN': 'PAN',
  'BATANES': 'BTN',
  'CAGAYAN': 'CAG',
  'ISABELA': 'ISA',
  'NUEVA VIZCAYA': 'NUV',
  'QUIRINO': 'QUI',
  'BATAAN': 'BAN',
  'BULACAN': 'BUL',
  'NUEVA ECIJA': 'NUE',
  'PAMPANGA': 'PAM',
  'TARLAC': 'TAR',
  'ZAMBALES': 'ZMB',
  'AURORA': 'AUR',
  'BATANGAS': 'BTG',
  'CAVITE': 'CAV',
  'LAGUNA': 'LAG',
  'QUEZON': 'QUE',
  'RIZAL': 'RIZ',
  'MARINDUQUE': 'MAD',
  'OCCIDENTAL MINDORO': 'MDC',
  'ORIENTAL MINDORO': 'MDR',
  'PALAWAN': 'PLW',
  'ROMBLON': 'ROM',
  'ALBAY': 'ALB',
  'CAMARINES NORTE': 'CAN',
  'CAMARINES SUR': 'CAS',
  'CATANDUANES': 'CAT',
  'MASBATE': 'MAS',
  'SORSOGON': 'SOR',
  'AKLAN': 'AKL',
  'ANTIQUE': 'ANT',
  'CAPIZ': 'CAP',
  'ILOILO': 'ILI',
  'NEGROS OCCIDENTAL': 'NEC',
  'GUIMARAS': 'GUI',
  'BOHOL': 'BOH',
  'CEBU': 'CEB',
  'NEGROS ORIENTAL': 'NER',
  'SIQUIJOR': 'SIG',
  'EASTERN SAMAR': 'EAS',
  'LEYTE': 'LEY',
  'NORTHERN SAMAR': 'NSA',
  'SAMAR (WESTERN SAMAR)': 'WSA',
  'SOUTHERN LEYTE': 'SLE',
  'BILIRAN': 'BIL',
  'ZAMBOANGA DEL NORTE': 'ZAN',
  'ZAMBOANGA DEL SUR': 'ZAS',
  'ZAMBOANGA SIBUGAY': 'ZSI',
  'BUKIDNON': 'BUK',
  'CAMIGUIN': 'CAM',
  'LANAO DEL NORTE': 'LAN',
  'MISAMIS OCCIDENTAL': 'MSC',
  'MISAMIS ORIENTAL': 'MSR',
  'DAVAO DEL NORTE': 'DAV',
  'DAVAO DEL SUR': 'DAS',
  'DAVAO ORIENTAL': 'DAO',
  'COMPOSTELA VALLEY': 'COM',
  'DAVAO OCCIDENTAL': 'DVO',
  'COTABATO (NORTH COTABATO)': 'NCO',
  'SOUTH COTABATO': 'SCO',
  'SULTAN KUDARAT': 'SUK',
  'SARANGANI': 'SAR',
  'AGUSAN DEL NORTE': 'AGN',
  'AGUSAN DEL SUR': 'AGS',
  'SURIGAO DEL NORTE': 'SUN',
  'SURIGAO DEL SUR': 'SUR',
  'DINAGAT ISLANDS': 'DIN',
  'ABRA': 'ABR',
  'BENGUET': 'BEN',
  'IFUGAO': 'IFU',
  'KALINGA': 'KAL',
  'MOUNTAIN PROVINCE': 'MOU',
  'APAYAO': 'APA',
  'BASILAN': 'BAS',
  'LANAO DEL SUR': 'LAS',
  'MAGUINDANAO': 'MAG',
  'SULU': 'SLU',
  'TAWI-TAWI': 'TAW'
}

// Congressional District to LGU Mapping
// Populated from district-list.txt via district-mapping-data.json
export const congressionalDistrictToLGUMapping: Record<string, CongressionalDistrictMapping[]> = districtMappingData as Record<string, CongressionalDistrictMapping[]>

/**
 * Get LGUs (Municipalities/Cities) for a specific congressional district
 */
export function getLGUsByCongressionalDistrict(
  provinceCode: string,
  districtNumber: number
): string[] {
  const provinceDistricts = congressionalDistrictToLGUMapping[provinceCode]
  if (!provinceDistricts) {
    return []
  }
  
  const district = provinceDistricts.find(d => d.districtNumber === districtNumber)
  return district ? district.lguNames : []
}

/**
 * Get all congressional districts for a province
 */
export function getCongressionalDistrictsByProvince(
  provinceCode: string
): CongressionalDistrictMapping[] {
  return congressionalDistrictToLGUMapping[provinceCode] || []
}

/**
 * Get province code from province name
 * Handles various name formats and case variations
 */
export function getProvinceCode(provinceName: string): string | null {
  if (!provinceName) return null
  
  // Normalize the name: uppercase, trim, handle common variations
  let normalizedName = provinceName.toUpperCase().trim()
  
  // Try exact match first
  if (provinceNameToCode[normalizedName]) {
    return provinceNameToCode[normalizedName]
  }
  
  // Try with common variations
  // Remove "Province of" prefix if present
  normalizedName = normalizedName.replace(/^PROVINCE OF /i, '')
  if (provinceNameToCode[normalizedName]) {
    return provinceNameToCode[normalizedName]
  }
  
  // Try matching with partial names (e.g., "Agusan del Norte" might be returned as "Agusan Del Norte")
  // Check if any key contains the normalized name or vice versa
  for (const [key, code] of Object.entries(provinceNameToCode)) {
    // Exact match after normalization
    if (key === normalizedName) {
      return code
    }
    // Check if key contains the name or name contains key (for partial matches)
    if (key.includes(normalizedName) || normalizedName.includes(key)) {
      // Make sure it's a meaningful match (not just a single word)
      const keyWords = key.split(/\s+/)
      const nameWords = normalizedName.split(/\s+/)
      if (keyWords.length > 1 && nameWords.length > 1) {
        // Check if most words match
        const matchingWords = keyWords.filter(word => nameWords.includes(word))
        if (matchingWords.length >= Math.min(keyWords.length, nameWords.length) - 1) {
          return code
        }
      }
    }
  }
  
  return null
}

/**
 * Check if an LGU belongs to a specific congressional district
 */
export function isLGUInCongressionalDistrict(
  provinceCode: string,
  districtNumber: number,
  lguName: string
): boolean {
  const lgus = getLGUsByCongressionalDistrict(provinceCode, districtNumber)
  // Normalize names for comparison (case-insensitive, remove extra spaces, remove "CITY OF", etc.)
  const normalizeName = (name: string) => {
    return name
      .trim()
      .toUpperCase()
      .replace(/^CITY OF /i, '')
      .replace(/ \(.*?\)/g, '') // Remove parenthetical notes
      .replace(/\s+/g, ' ')
  }
  
  const normalizedLGUName = normalizeName(lguName)
  return lgus.some(lgu => {
    const normalized = normalizeName(lgu)
    return normalized === normalizedLGUName || 
           normalized.includes(normalizedLGUName) ||
           normalizedLGUName.includes(normalized)
  })
}

/**
 * Filter cities/municipalities by congressional district
 */
export function filterCitiesByCongressionalDistrict(
  cities: Array<{ name: string; [key: string]: any }>,
  provinceCode: string,
  districtNumber: number
): Array<{ name: string; [key: string]: any }> {
  const districtLGUs = getLGUsByCongressionalDistrict(provinceCode, districtNumber)
  
  if (districtLGUs.length === 0) {
    // If no mapping found, return all cities (fallback)
    return cities
  }
  
  // Normalize LGU names for comparison
  const normalizeName = (name: string) => {
    return name
      .trim()
      .toUpperCase()
      .replace(/^CITY OF /i, '')
      .replace(/ \(.*?\)/g, '') // Remove parenthetical notes like (Capital)
      .replace(/\s+/g, ' ')
  }
  
  const normalizedDistrictLGUs = districtLGUs.map(lgu => normalizeName(lgu))
  
  return cities.filter(city => {
    const normalizedCityName = normalizeName(city.name)
    // Check if city name matches any LGU in the district
    return normalizedDistrictLGUs.some(lgu => {
      // Exact match
      if (normalizedCityName === lgu) return true
      // Partial match (handles variations like "CITY OF X" vs "X")
      if (normalizedCityName.includes(lgu) || lgu.includes(normalizedCityName)) return true
      // Handle common variations
      const cityBase = normalizedCityName.replace(/^CITY OF /, '')
      const lguBase = lgu.replace(/^CITY OF /, '')
      return cityBase === lguBase
    })
  })
}
