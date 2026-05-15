/** @type {Record<string, string>} il adı (Excel ile aynı) → bölge anahtarı */
export const PROVINCE_TO_REGION = {
  İstanbul: 'marmara',
  Edirne: 'marmara',
  Kırklareli: 'marmara',
  Tekirdağ: 'marmara',
  Kocaeli: 'marmara',
  Sakarya: 'marmara',
  Yalova: 'marmara',
  Bursa: 'marmara',
  Bilecik: 'marmara',
  Balıkesir: 'marmara',
  Çanakkale: 'marmara',

  İzmir: 'ege',
  Aydın: 'ege',
  Muğla: 'ege',
  Manisa: 'ege',
  Denizli: 'ege',
  Uşak: 'ege',
  Kütahya: 'ege',
  Afyonkarahisar: 'ege',

  Antalya: 'akdeniz',
  Burdur: 'akdeniz',
  Isparta: 'akdeniz',
  Mersin: 'akdeniz',
  Adana: 'akdeniz',
  Osmaniye: 'akdeniz',
  Hatay: 'akdeniz',
  Kahramanmaraş: 'akdeniz',

  Ankara: 'ic-anadolu',
  Eskişehir: 'ic-anadolu',
  Konya: 'ic-anadolu',
  Karaman: 'ic-anadolu',
  Aksaray: 'ic-anadolu',
  Niğde: 'ic-anadolu',
  Nevşehir: 'ic-anadolu',
  Kırşehir: 'ic-anadolu',
  Kırıkkale: 'ic-anadolu',
  Yozgat: 'ic-anadolu',
  Sivas: 'ic-anadolu',
  Kayseri: 'ic-anadolu',
  Çankırı: 'ic-anadolu',

  Zonguldak: 'karadeniz',
  Bartın: 'karadeniz',
  Karabük: 'karadeniz',
  Düzce: 'karadeniz',
  Bolu: 'karadeniz',
  Kastamonu: 'karadeniz',
  Sinop: 'karadeniz',
  Samsun: 'karadeniz',
  Ordu: 'karadeniz',
  Giresun: 'karadeniz',
  Trabzon: 'karadeniz',
  Rize: 'karadeniz',
  Artvin: 'karadeniz',
  Amasya: 'karadeniz',
  Tokat: 'karadeniz',
  Çorum: 'karadeniz',
  Gümüşhane: 'karadeniz',
  Bayburt: 'karadeniz',

  Erzurum: 'dogu-anadolu',
  Erzincan: 'dogu-anadolu',
  Ağrı: 'dogu-anadolu',
  Kars: 'dogu-anadolu',
  Iğdır: 'dogu-anadolu',
  Ardahan: 'dogu-anadolu',
  Van: 'dogu-anadolu',
  Muş: 'dogu-anadolu',
  Bitlis: 'dogu-anadolu',
  Hakkari: 'dogu-anadolu',
  'Hakkâri': 'dogu-anadolu',
  Bingöl: 'dogu-anadolu',
  Elazığ: 'dogu-anadolu',
  Malatya: 'dogu-anadolu',
  Tunceli: 'dogu-anadolu',

  Gaziantep: 'guneydogu-anadolu',
  Kilis: 'guneydogu-anadolu',
  Adıyaman: 'guneydogu-anadolu',
  Şanlıurfa: 'guneydogu-anadolu',
  Diyarbakır: 'guneydogu-anadolu',
  Mardin: 'guneydogu-anadolu',
  Batman: 'guneydogu-anadolu',
  Siirt: 'guneydogu-anadolu',
  Şırnak: 'guneydogu-anadolu',
}

export const ANY_REGION_KEY = 'any'

export const REGION_OPTIONS = [
  {
    key: 'marmara',
    label: 'Marmara Bölgesi',
    description: 'İstanbul, Bursa, Balıkesir, Kocaeli ve çevresi.',
  },
  {
    key: 'ege',
    label: 'Ege Bölgesi',
    description: 'İzmir, Muğla, Aydın, Manisa ve çevresi.',
  },
  {
    key: 'akdeniz',
    label: 'Akdeniz Bölgesi',
    description: 'Antalya, Mersin, Adana, Hatay ve çevresi.',
  },
  {
    key: 'ic-anadolu',
    label: 'İç Anadolu Bölgesi',
    description: 'Ankara, Konya, Eskişehir, Kayseri ve çevresi.',
  },
  {
    key: 'karadeniz',
    label: 'Karadeniz Bölgesi',
    description: 'Samsun, Trabzon, Ordu, Rize ve çevresi.',
  },
  {
    key: 'dogu-anadolu',
    label: 'Doğu Anadolu Bölgesi',
    description: 'Erzurum, Van, Malatya, Elazığ ve çevresi.',
  },
  {
    key: 'guneydogu-anadolu',
    label: 'Güneydoğu Anadolu Bölgesi',
    description: 'Gaziantep, Diyarbakır, Şanlıurfa, Mardin ve çevresi.',
  },
]

export const ALL_REGION_KEYS = REGION_OPTIONS.map((region) => region.key)

/**
 * @param {unknown[]} [selectedRegions]
 * @returns {string[]}
 */
export function normalizeSelectedRegions(selectedRegions = []) {
  if (!Array.isArray(selectedRegions) || selectedRegions.length === 0) {
    return []
  }

  if (selectedRegions.includes(ANY_REGION_KEY)) {
    return [ANY_REGION_KEY]
  }

  const validSelected = selectedRegions.filter((key) =>
    ALL_REGION_KEYS.includes(key),
  )

  if (validSelected.length === ALL_REGION_KEYS.length) {
    return [ANY_REGION_KEY]
  }

  return validSelected
}

/**
 * @param {unknown[]} [selectedRegions]
 */
export function isAnyRegionSelected(selectedRegions = []) {
  const normalized = normalizeSelectedRegions(selectedRegions)
  return normalized.includes(ANY_REGION_KEY)
}

/**
 * @param {Record<string, unknown>} district
 * @param {unknown[]} [selectedRegions]
 */
export function districtMatchesSelectedRegions(district, selectedRegions = []) {
  const normalized = normalizeSelectedRegions(selectedRegions)

  if (normalized.length === 0) return false
  if (normalized.includes(ANY_REGION_KEY)) return true

  const districtRegion = getRegionKeyByProvince(district.il)
  return districtRegion != null && normalized.includes(districtRegion)
}

/**
 * @param {unknown[]} [selectedRegions]
 * @returns {string[]}
 */
export function getSelectedRegionLabels(selectedRegions = []) {
  const normalized = normalizeSelectedRegions(selectedRegions)

  if (normalized.includes(ANY_REGION_KEY)) {
    return ['Farketmez']
  }

  return normalized.map((key) => getRegionLabel(key))
}

/**
 * @param {string | null | undefined} regionKey
 */
export function getRegionLabel(regionKey) {
  if (!regionKey || regionKey === ANY_REGION_KEY) return 'Farketmez'
  const option = REGION_OPTIONS.find((item) => item.key === regionKey)
  return option?.label ?? String(regionKey)
}

/**
 * @param {string | null | undefined} province
 */
export function getRegionKeyByProvince(province) {
  const p = String(province ?? '').trim()
  if (!p) return null
  return PROVINCE_TO_REGION[p] ?? null
}

/**
 * @param {Record<string, unknown>} district
 * @param {string | null | undefined} selectedRegion
 */
export function districtMatchesRegion(district, selectedRegion) {
  if (!selectedRegion || selectedRegion === ANY_REGION_KEY) return true
  const province = String(district.il || '').trim()
  return getRegionKeyByProvince(province) === selectedRegion
}
