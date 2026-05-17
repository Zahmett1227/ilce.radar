const STORAGE_KEY = 'ilceradar_wizard_v1'

/**
 * @typedef {{ step: string; answers: Record<string, number|null>; selectedRegions: string[]; currentQuestionIndex: number }} WizardSnapshot
 */

/**
 * @param {WizardSnapshot} snapshot
 */
export function saveWizardSession(snapshot) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    /* quota / private mode */
  }
}

/**
 * @returns {WizardSnapshot | null}
 */
export function loadWizardSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    if (!data.step || !data.answers) return null
    return {
      step: data.step,
      answers: data.answers,
      selectedRegions: Array.isArray(data.selectedRegions) ? data.selectedRegions : [],
      currentQuestionIndex:
        typeof data.currentQuestionIndex === 'number' ? data.currentQuestionIndex : 0,
    }
  } catch {
    return null
  }
}

export function clearWizardSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
