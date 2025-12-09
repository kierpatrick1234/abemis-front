const fs = require('fs');
const path = require('path');

// Read the district list file
const filePath = path.join(__dirname, '../components/district-list.txt');
const data = fs.readFileSync(filePath, 'utf8');
const lines = data.split('\n');

let currentProvince = '';
let currentRegion = '';

// Province name to PSGC code mapping
const provinceCodeMap = {
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
};

function parseDistrictNumber(districtStr) {
  if (districtStr.toLowerCase() === 'lone') return 1;
  const match = districtStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

function formatDistrictName(districtNumber) {
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + 'st';
    if (j === 2 && k !== 12) return num + 'nd';
    if (j === 3 && k !== 13) return num + 'rd';
    return num + 'th';
  };
  return `${getOrdinalSuffix(districtNumber)} District`;
}

const mapping = {};

for (let i = 0; i < lines.length; i++) {
  let line = lines[i].replace(/\r$/, ''); // Remove Windows line ending
  
  // Skip empty lines and header
  if (!line.trim() || line.trim() === 'district-list') continue;
  
  // Check if it's a region header (starts with tab and contains REGION)
  if (line.startsWith('\t') && line.includes('REGION')) {
    currentRegion = line.trim();
    continue;
  }
  
  // Check if it's a province (starts with tab, no leading digits or "lone")
  // Format: \tPROVINCE NAME
  if (line.startsWith('\t') && !line.match(/^\t\d+[a-z]+\t/) && !line.match(/^\tlone\t/) && !line.match(/^\t\d+\s+LD\t/)) {
    const trimmed = line.trim();
    // Check if it looks like a province name (not a district entry)
    if (trimmed && !trimmed.match(/^\d+/) && !trimmed.toLowerCase().startsWith('lone') && !trimmed.includes('REGION')) {
      currentProvince = trimmed;
      continue;
    }
  }
  
  // Check if it's a district + LGU line (starts with district number, no tab)
  // Format: 1st\tLGU NAME or lone\tLGU NAME or 2 LD\tLGU NAME
  if (!line.startsWith('\t') && !line.startsWith(' ')) {
    const districtMatch = line.match(/^(\d+[a-z]+|lone|\d+\s+LD)\t(.+)$/);
    if (districtMatch && currentProvince) {
      const districtStr = districtMatch[1].trim();
      let lguName = districtMatch[2].trim();
      
      // Skip special entries like "Not a Province"
      if (lguName.includes('Not a Province') || lguName.includes('NCR,')) {
        continue;
      }
      
      // Handle "LD" districts (Legislative Districts) - treat as regular districts
      const cleanDistrictStr = districtStr.replace(/\s+LD$/, '');
      const districtNumber = parseDistrictNumber(cleanDistrictStr);
      const provinceCode = provinceCodeMap[currentProvince] || currentProvince.substring(0, 3).toUpperCase();
      
      if (!mapping[provinceCode]) {
        mapping[provinceCode] = {};
      }
      
      if (!mapping[provinceCode][districtNumber]) {
        mapping[provinceCode][districtNumber] = {
          provinceCode: provinceCode,
          provinceName: currentProvince,
          districtNumber: districtNumber,
          districtName: formatDistrictName(districtNumber),
          lguNames: []
        };
      }
      
      mapping[provinceCode][districtNumber].lguNames.push(lguName);
    }
  }
}

// Convert to array format
const result = {};
for (const [code, districts] of Object.entries(mapping)) {
  result[code] = Object.values(districts);
}

// Write to file
const outputPath = path.join(__dirname, '../lib/services/district-mapping-data.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

console.log('District mapping generated successfully!');
console.log(`Found ${Object.keys(result).length} provinces`);
console.log(`Total districts: ${Object.values(result).reduce((sum, arr) => sum + arr.length, 0)}`);

