// Single Product Page
// src/app/dining/[id]/page.tsx
"use client"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const RANKING_META: Record<number, {
  label: string; color: string; bg: string; detail: string
}> = {
  1: {
    label:  'Dedicated Allergen-Free Facility',
    color:  '#065F46',
    bg:     '#D1FAE5',
    detail: 'This facility is 100% dedicated to allergen-free production. No allergen cross-contact from shared equipment or shared facilities.'
  },
  2: {
    label:  'Allergen-Free But May Not Be Fully Dedicated',
    color:  '#1E40AF',
    bg:     '#DBEAFE',
    detail: 'This product has a documented allergen-free menu or a strong variety of safe options. It may or may not be a dedicated facility — confirm with staff before ordering.'
  },
  3: {
    label:  'Limited Allergen-Free Options',
    color:  '#92400E',
    bg:     '#FEF3C7',
    detail: 'This product has some allergen-free options but is not a dedicated facility. Cross-contact risk is higher. Best for mild intolerances rather than severe allergies.'
  },
}

type ProductDetail = {
  id:                   number
  name:                 string
  category:             string | null
  ranking:              1 | 2 | 3 | null
  culturalCuisine:      string | null
  description:          string | null
  verified:             boolean | null
  active:               boolean | null
  isDedicatedFacility:  boolean
  isCertified:          boolean
  knowBeforeYouBuy:     string | null
  freeOf:               string[]
  canAccommodate:       string[]
  mayContain:           string[]
  dietTags:             string[]
}

export default function ProductDetailPage() {
  const params   = useParams()
  const router   = useRouter()
  const [product, setProduct]     = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) return

    fetch(`/api/products/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.json()
      })
      .then(json => {
        setProduct(json.data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message === '404'
          ? 'This product could not be found.'
          : 'Could not load product details. Please try again.'
        )
        setLoading(false)
      })
  }, [params.id])

  if (loading) return (
    <div className="page-shell min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: '#6B7280' }}>Loading...</p>
    </div>
  )

  if (error || !product) return (
    <div className="page-shell min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-sm font-semibold" style={{ color: '#991B1B' }}>
        {error ?? 'Product not found'}
      </p>
      <Link href="/products" className="text-sm font-semibold" style={{ color: '#1A3D2B' }}>
        ← Back to products
      </Link>
    </div>
  )

  const rankMeta = product.ranking ? RANKING_META[product.ranking] : null

  return (
    <div className="page-shell min-h-screen">
      <div className="page-header px-6 lg:px-12 py-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-sm font-semibold"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#226580', padding: 0 }}
          >
            ← Back
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#151b3a', padding: '2rem 2rem 3rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Category + verified */}
          <div style={{ display: 'flex', alignItems: 'center',
            gap: 8, marginBottom: 12 }}>
            {product.category && (
              <span style={{ fontSize: 12, color: '#A7C4B5',
                textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {product.category}
              </span>
            )}
            {product.verified && (
              <span style={{ fontSize: 11, padding: '2px 8px',
                borderRadius: 99, backgroundColor: '#D1FAE5',
                color: '#065F46', fontWeight: 600 }}>
                ✓ ZeroCross Verified
              </span>
            )}
          </div>

          {/* Name */}
          <h1 style={{ color: '#FAF7F0', fontSize: 30, margin: '0 0 6px',
            fontFamily: 'Fraunces, serif', fontWeight: 550 }}>
            {product.name}
          </h1>
          {/* Ranking badge */}
          {rankMeta && (
            <span style={{
              display: 'inline-block',
              fontSize: 12, fontWeight: 600,
              padding: '5px 14px', borderRadius: 99,
              backgroundColor: rankMeta.bg,
              color: rankMeta.color,
            }}>
              Rank {product.ranking} — {rankMeta.label}
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Description */}
        {product.description && (
          <div className="surface-card p-6">
            <p className="text-[15px] leading-7 m-0" style={{ color: '#374151' }}>
              {product.description}
            </p>
          </div>
        )}

        {/* Ranking explanation */}
        {rankMeta && (
          <div style={{ backgroundColor: rankMeta.bg, borderRadius: 16,
            padding: '1.25rem 1.5rem',
            border: `1px solid ${rankMeta.color}30` }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: rankMeta.color,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              margin: '0 0 6px' }}>
              What Rank {product.ranking} means
            </p>
            <p style={{ fontSize: 13, color: rankMeta.color,
              margin: 0, lineHeight: 1.6 }}>
              {rankMeta.detail}
            </p>
          </div>
        )}

        {/* Allergen status */}
        <div className="surface-card p-6">
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1A3D2B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 16px' }}>
            Allergen Information
          </h2>

          {product.freeOf.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#065F46',
                margin: '0 0 8px' }}>Free of</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {product.freeOf.map(a => (
                  <span key={a} style={{ fontSize: 12, padding: '4px 10px',
                    borderRadius: 99, backgroundColor: '#D1FAE5',
                    color: '#065F46', fontWeight: 500 }}>
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          )}
          {product.canAccommodate.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#8faa22',
                margin: '0 0 8px' }}>Can Accommodate</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {product.canAccommodate.map(a => (
                  <span key={a} style={{ fontSize: 12, padding: '4px 10px',
                    borderRadius: 99, backgroundColor: '#e2ff9f',
                    color: '#8faa22', fontWeight: 500 }}>
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          )}
          {product.mayContain.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#92400E',
                margin: '0 0 8px' }}>May contain — confirm before ordering</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {product.mayContain.map(a => (
                  <span key={a} style={{ fontSize: 12, padding: '4px 10px',
                    borderRadius: 99, backgroundColor: '#FEF3C7',
                    color: '#92400E', fontWeight: 500 }}>
                    ⚠ {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Safety flags */}
        <div className="surface-card p-6">
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1A3D2B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 16px' }}>
            Safety Details
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              [product.isDedicatedFacility, '🏭', 'Dedicated allergen-free facility',
                'No shared equipment with allergen-containing products'],
              [product.isCertified, '✓', 'Third-party certified',
                'Holds a recognized allergen-free certification'],
            ].map(([present, icon, label, detail]) => (
              <div key={String(label)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: present ? '#D1FAE5' : '#F3F4F6',
                  flexShrink: 0, fontSize: 14 }}>
                  {present ? icon : '—'}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px',
                    color: present ? '#1A3D2B' : '#9CA3AF' }}>
                    {String(label)}
                  </p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
                    {present ? String(detail) : 'Not confirmed'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diet tags */}
        {/* {product.dietTags.length > 0 && (
          <div className="surface-card p-6">
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1A3D2B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>
              Dietary Options
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {product.dietTags.map(tag => (
                <span key={tag} style={{ fontSize: 12, padding: '4px 12px',
                  borderRadius: 99, backgroundColor: '#F3E8FF',
                  color: '#6B21A8', fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )} */}

        {/* Know before you buy */}
        {product.knowBeforeYouBuy && (
          <div style={{ backgroundColor: '#FEF3C7', borderRadius: 16,
            padding: '1.5rem',
            borderLeft: '4px solid #E8A020' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#92400E',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              margin: '0 0 10px' }}>
              Know before you buy
            </h2>
            <p style={{ fontSize: 14, color: '#78350F',
              margin: 0, lineHeight: 1.7 }}>
              {product.knowBeforeYouBuy}
            </p>
          </div>
        )}
        {/* Back link */}
        <div style={{ paddingTop: 8, paddingBottom: 32 }}>
          <Link href="/products" className="text-sm font-semibold" style={{ color: '#6B7280', textDecoration: 'none' }}>
            ← Back to all products
          </Link>
        </div>
      </div>
    </div>
  )
}