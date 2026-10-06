'use client'

const DIETS = [
  { id: 'gluten-free', emoji: '🌾', label: 'Gluten' },
  { id: 'vegan', emoji: '🥜', label: 'Vegan' },
  { id: 'keto', emoji: '🥑', label: 'Keto' },
  { id: 'paleo', emoji: '🥚', label: 'Paleo' },
  { id: 'tree-nut', emoji: '🌰', label: 'Tree nuts' },
  { id: 'nut-free', emoji: '🥜', label: 'Nuts' },
]

type Props = {
  selected: string[]
  onChange: (v: string[]) => void
}

export default function DietStep({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id])
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600,
        fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 8 }}>
        Are you currently dieting or exploring dieting?
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 1.6 }}>
        Select every diet you want. We filter everything —
        dining, groceries, and recipes — to match.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {DIETS.map(a => {
          const on = selected.includes(a.id)
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                border: `1.5px solid ${on ? '#151b3a':'#6B7280' }`,
                backgroundColor: '#FFFFFF',
                textAlign: 'left', transition: 'all 0.12s',
              }}
            >
              <span style={{ fontSize: 22 }}>{a.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600,
                  color: on ? '#A7C4B5' : '#1A3D2B' }}>{a.label}</div>
              </div>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <p style={{ marginTop: 16, fontSize: 13, color: '#1A3D2B',
          fontWeight: 500, textAlign: 'center' }}>
          ✓ {selected.length} allergen{selected.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}