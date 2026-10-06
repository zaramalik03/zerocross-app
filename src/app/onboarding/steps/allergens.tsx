'use client'

const ALLERGENS = [
  { id: 'gluten',    emoji: '🌾', label: 'Gluten',     note: 'Wheat, rye, barley' },
  { id: 'peanut',   emoji: '🥜', label: 'Peanuts',     note: 'High anaphylaxis risk' },
  { id: 'tree-nut', emoji: '🌰', label: 'Tree nuts',   note: 'Cashew, almond, walnut' },
  { id: 'dairy',    emoji: '🥛', label: 'Dairy',       note: 'Milk, cheese, butter' },
  { id: 'egg',      emoji: '🥚', label: 'Eggs',        note: 'All egg products' },
  { id: 'soy',      emoji: '🫘', label: 'Soy',         note: 'Tofu, edamame, miso' },
  { id: 'fish',     emoji: '🐟', label: 'Fish',        note: 'Salmon, tuna, cod' },
  { id: 'shellfish',emoji: '🦐', label: 'Shellfish',   note: 'Shrimp, crab, lobster' },
  { id: 'sesame',   emoji: '⚪', label: 'Sesame',      note: 'Seeds, oil, tahini' },
  { id: 'mustard',  emoji: '🌿', label: 'Mustard',     note: 'EU allergen' },
  { id: 'corn',     emoji: '🌽', label: 'Corn',        note: 'Maize, HFCS' },
  { id: 'sulfites', emoji: '🍷', label: 'Sulphites',   note: 'Wine, dried fruit' },
]

type Props = {
  selected: string[]
  onChange: (v: string[]) => void
}

export default function AllergenStep({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id])
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600,
        fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 8 }}>
        What are you allergic to and/or want to avoid?
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 1.6 }}>
        Select every allergen that applies. We filter everything —
        dining, groceries, and recipes — to match.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {ALLERGENS.map(a => {
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
                <div style={{ fontSize: 11,
                  color: on ? '#A7C4B5' : '#1A3D2B' }}>{a.note}</div>
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