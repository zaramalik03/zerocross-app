// src/app/onboarding/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AllergenStep from './steps/allergens'
import DietStep from './steps/diet'
import { saveProfile } from '@/lib/userprofile'
import Link from 'next/link'

const STEPS = ['Allergens', 'Diet']

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [allergens, setAllergens] = useState<string[]>([])
  const [diets, setDiets]         = useState<string[]>([])
  const [cuisines, setCuisines]   = useState<string[]>([])

  const finish = () => {
    saveProfile({ allergens, diets, completedOnboarding: true })
    router.push('/profile')
  }

  return (
    <div className="page-shell" style={{ minHeight: '100vh' }}>

      {/* Progress bar */}
      <div style={{ backgroundColor: '#e2efef', padding: '1.25rem 1.5rem' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <p style={{ color: '#000000', fontSize: 12, marginBottom: 8 }}>
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
          <div style={{ height: 4, backgroundColor: '#c4c7cd', borderRadius: 99 }}>
            <div style={{
              height: 4, borderRadius: 99, backgroundColor: '#226580',
              width: `${((step + 1) / STEPS.length) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {step === 0 && (
          <AllergenStep selected={allergens} onChange={setAllergens} />
        )}
        {step === 1 && (
          <DietStep selected={diets} onChange={setDiets} />
        )}
        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: '2rem' }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{ flex: 1, padding: '12px', borderRadius: 99,
                border: '1.5px solid #D1D5DB', background: 'transparent',
                color: '#4A5568', fontSize: 14, cursor: 'pointer' }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : finish()}
            style={{ flex: 2, padding: '12px', borderRadius: 99,
              border: 'none', background: '#151b3a',
              color: '#FAF7F0', fontSize: 14,
              fontWeight: 600, cursor: 'pointer' }}
          >
            {step < STEPS.length - 1 ? 'Continue →' : 'Finish Profile →'}
          </button>
        </div>

        {step === 0 && (
          <button
            onClick={finish}
            style={{ width: '100%', marginTop: 12, padding: '10px',
              background: 'none', border: 'none',
              color: '#000000', fontSize: 13, cursor: 'pointer' }}
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}