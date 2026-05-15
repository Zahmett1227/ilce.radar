import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Sparkles,
  Waves,
  ShieldCheck,
  Trees,
  Scale,
  Wallet,
} from 'lucide-react'
import districtsBundle from '../data/districts.json'
import metricQuestionsJson from '../data/metricQuestions.json'
import QuestionScreen from '../components/QuestionScreen.jsx'
import RegionScreen from '../components/RegionScreen.jsx'
import ResultScreen from '../components/ResultScreen.jsx'
import StartScreen from '../components/StartScreen.jsx'
import { mergeMetricQuestions } from '../utils/questionMerge.js'
import { getTopDistricts } from '../utils/scoring.js'

const ICON_BY_KEY = {
  socialCulture: Sparkles,
  seaAccess: Waves,
  earthquakeSafety: ShieldCheck,
  lowCrowding: Trees,
  lowJudicialIntensity: Scale,
  affordability: Wallet,
}

const FALLBACK_QUESTIONS = [
  {
    key: 'socialCulture',
    title: 'Sosyal ve kültürel imkanlar',
    question:
      'Bir ilçede sosyal hayat, kültürel etkinlikler, eğitimli çevre ve şehir imkanları senin için ne kadar önemli?',
    description:
      'Kafe, etkinlik, üniversite çevresi, kültürel canlılık ve genel sosyoekonomik gelişmişlik etkisini temsil eder.',
    scoreColumn: 'social_culture_score_20',
    icon: Sparkles,
  },
  {
    key: 'seaAccess',
    title: 'Denize yakınlık',
    question: 'Denize yakın olmak senin için ne kadar önemli?',
    description: 'Denize erişim ve kıyı şeridine yakınlık hissinin ağırlığını ölçer.',
    scoreColumn: 'sea_access_score_20',
    icon: Waves,
  },
  {
    key: 'earthquakeSafety',
    title: 'Deprem güvenliği',
    question:
      'Deprem riskinin daha düşük olduğu bir ilçede yaşamak senin için ne kadar önemli?',
    description: 'Jeolojik risk bantları ve güvenlik skorunun birleşik etkisini yansıtır.',
    scoreColumn: 'earthquake_safety_score_20',
    icon: ShieldCheck,
  },
  {
    key: 'lowCrowding',
    title: 'Sakinlik / kalabalık olmaması',
    question:
      'Daha az kalabalık, daha sakin ve nefes alınabilir bir ilçede yaşamak senin için ne kadar önemli?',
    description: 'Yoğunluk ve “nefes alınabilirlik” algısını temsil eden skordur.',
    scoreColumn: 'low_crowding_score_20',
    icon: Trees,
  },
  {
    key: 'lowJudicialIntensity',
    title: 'Adli olay yoğunluğunun düşük olması',
    question:
      'Adli olay yoğunluğu daha düşük bölgelerde yaşamak senin için ne kadar önemli?',
    description: 'Bölgesel adalet istatistiklerinden türetilen proxy göstergedir.',
    scoreColumn: 'judicial_low_event_score_20',
    icon: Scale,
  },
  {
    key: 'affordability',
    title: 'Pahalılığın düşük olması',
    question:
      'Kira ve konut fiyatlarının daha erişilebilir olması senin için ne kadar önemli?',
    description: 'Konut piyasası göstergeleri ters puanlanmıştır; yüksek skor daha avantajlıdır.',
    scoreColumn: 'affordability_score_20',
    icon: Wallet,
  },
]

const metricRows = Array.isArray(metricQuestionsJson) ? metricQuestionsJson : []
const ACTIVE_QUESTIONS =
  mergeMetricQuestions(metricRows, ICON_BY_KEY) ?? FALLBACK_QUESTIONS

function unwrapDistricts(bundle) {
  if (Array.isArray(bundle)) {
    return { districts: bundle, generatedAt: null, rowCount: bundle.length }
  }
  const d = bundle?.districts
  const list = Array.isArray(d) ? d : []
  return {
    districts: list,
    generatedAt: bundle?.generatedAt ?? null,
    rowCount:
      typeof bundle?.rowCount === 'number' ? bundle.rowCount : list.length,
  }
}

function emptyAnswers() {
  return Object.fromEntries(ACTIVE_QUESTIONS.map((q) => [q.key, null]))
}

export default function IdealDistrictWizard() {
  const [step, setStep] = useState('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(() => emptyAnswers())
  const [selectedRegions, setSelectedRegions] = useState([])

  const { districts: allDistricts, generatedAt, rowCount } = useMemo(
    () => unwrapDistricts(districtsBundle),
    [],
  )

  const topDistricts = useMemo(() => {
    if (step !== 'results') return []
    return getTopDistricts(allDistricts, answers, ACTIVE_QUESTIONS, {
      limit: 20,
      selectedRegions,
    })
  }, [step, answers, allDistricts, selectedRegions])

  const currentQuestion = ACTIVE_QUESTIONS[currentQuestionIndex]
  const totalQuestions = ACTIVE_QUESTIONS.length

  const handleStart = () => {
    setStep('region')
  }

  const handleSelect = (value) => {
    const q = ACTIVE_QUESTIONS[currentQuestionIndex]
    if (!q) return
    setAnswers((prev) => ({ ...prev, [q.key]: value }))
  }

  const handleNext = () => {
    const q = ACTIVE_QUESTIONS[currentQuestionIndex]
    if (!q || answers[q.key] == null) return
    if (currentQuestionIndex >= totalQuestions - 1) {
      setStep('results')
      return
    }
    setCurrentQuestionIndex((i) => i + 1)
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1)
    } else {
      setStep('region')
    }
  }

  const handleChangePreferences = () => {
    setStep('region')
    setCurrentQuestionIndex(0)
  }

  const handleRestart = () => {
    setAnswers(emptyAnswers())
    setCurrentQuestionIndex(0)
    setSelectedRegions([])
    setStep('start')
  }

  const selectedValue =
    currentQuestion != null ? answers[currentQuestion.key] : null

  return (
    <div className="min-h-svh bg-gradient-to-b from-slate-950 via-[#0a1020] to-slate-950 text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(52, 211, 153, 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(34, 211, 238, 0.12), transparent)',
        }}
        aria-hidden
      />
      <main className="relative z-10 flex min-h-svh flex-col items-center justify-center py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div
              key="start"
              className="flex w-full justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StartScreen onStart={handleStart} />
            </motion.div>
          )}

          {step === 'region' && (
            <motion.div
              key="region"
              className="flex w-full justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RegionScreen
                selectedRegions={selectedRegions}
                onChangeSelectedRegions={setSelectedRegions}
                onBack={() => {
                  setSelectedRegions([])
                  setStep('start')
                }}
                onNext={() => {
                  setStep('questions')
                  setCurrentQuestionIndex(0)
                }}
              />
            </motion.div>
          )}

          {step === 'questions' && currentQuestion && (
            <motion.div
              key={`q-${currentQuestionIndex}`}
              className="flex w-full justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QuestionScreen
                question={currentQuestion}
                currentIndex={currentQuestionIndex}
                total={totalQuestions}
                value={selectedValue}
                onChange={handleSelect}
                onBack={handleBack}
                onNext={handleNext}
                isLast={currentQuestionIndex === totalQuestions - 1}
                canProceed={selectedValue != null}
              />
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="results"
              className="flex w-full justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultScreen
                districts={topDistricts}
                allDistricts={allDistricts}
                selectedRegions={selectedRegions}
                generatedAt={generatedAt}
                rowCount={rowCount}
                answers={answers}
                questions={ACTIVE_QUESTIONS}
                onChangePreferences={handleChangePreferences}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
