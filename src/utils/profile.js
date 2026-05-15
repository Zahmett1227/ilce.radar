/**
 * @param {Record<string, number | null | undefined>} answers
 * @param {number} [limit=3]
 * @returns {string[]}
 */
export function getTopAnswerKeys(answers, limit = 3) {
  if (!answers || typeof answers !== 'object') return []
  return Object.entries(answers)
    .filter(([, v]) => typeof v === 'number' && v >= 1 && v <= 5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k]) => k)
}

/**
 * @param {Record<string, number | null | undefined>} answers
 * @returns {{ name: string; description: string }}
 */
export function getLifeProfile(answers) {
  const n = (key) => {
    const v = answers?.[key]
    return typeof v === 'number' ? v : 0
  }

  const sea = n('seaAccess')
  const soc = n('socialCulture')
  const eq = n('earthquakeSafety')
  const crowd = n('lowCrowding')
  const aff = n('affordability')

  if (sea >= 4 && soc >= 3) {
    return {
      name: 'Sahil Odaklı Dengeli Yaşamcı',
      description:
        'Denize yakınlık senin için güçlü bir öncelik. Sosyal imkanları da tamamen göz ardı etmiyorsun.',
    }
  }

  if (eq >= 4 && crowd >= 4) {
    return {
      name: 'Sakin ve Güvenli Yaşam Arayan',
      description:
        'Daha güvenli, daha az kalabalık ve daha dengeli ilçeler senin için öne çıkıyor.',
    }
  }

  if (soc >= 4 && aff <= 3) {
    return {
      name: 'Sosyal Hayat Odaklı Şehir İnsanı',
      description:
        'Kültürel canlılık, sosyal imkanlar ve şehir hissi senin için güçlü kriterler.',
    }
  }

  if (aff >= 4 && crowd >= 3) {
    return {
      name: 'Bütçe Dostu Yaşam Arayan',
      description:
        'Konut maliyetleri ve daha erişilebilir bir yaşam düzeni senin için belirleyici.',
    }
  }

  if (eq >= 5) {
    return {
      name: 'Deprem Güvenliği Öncelikli Seçici',
      description:
        'Deprem güvenliği senin kararında en güçlü belirleyici kriterlerden biri.',
    }
  }

  if (crowd >= 5 && soc <= 3) {
    return {
      name: 'Kalabalıktan Kaçan Stratejik Göçmen',
      description:
        'Daha sakin, daha az yoğun ve nefes alınabilir ilçeler senin için daha cazip.',
    }
  }

  return {
    name: 'Dengeli Yaşam Arayan',
    description:
      'Tek bir kritere saplanmadan, farklı yaşam faktörlerini dengeli biçimde önemsiyorsun.',
  }
}
