"use client"

import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useState } from 'react'
import { GUIDES } from '@/app/guidebook/data'

export default function GuideDetailPage() {
  const params = useParams<{ slug: string }>()
  const guide = GUIDES.find((item) => item.slug === params.slug)

  if (!guide) {
    notFound()
  }

  const [roleIndex, setRoleIndex] = useState(0)
  const [done, setDone] = useState<Record<string, boolean>>({})

  const role = guide.roles[roleIndex]
  const completed = role.steps.filter((step) => done[`${roleIndex}-${step.title}`]).length
  const pct = Math.round((completed / role.steps.length) * 100)

  return (
    <div className="page-shell min-h-screen">
      <div className="page-header px-6 py-6 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <Link href="/guidebook" className="text-sm font-semibold" style={{ color: '#226580' }}>
            ← All guides
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
        <div className="surface-card p-6 lg:p-8">
          <span className="text-5xl">{guide.emoji}</span>
          <p className="section-label mt-4">{guide.level}</p>
          <h1 className="section-title mt-2 text-4xl">{guide.title}</h1>
          <p className="section-body mt-3 max-w-2xl">{guide.summary}</p>

          {guide.roles.length > 1 && (
            <div className="mt-8 inline-flex rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold">
              {guide.roles.map((item, index) => (
                <button
                  key={item.role}
                  onClick={() => setRoleIndex(index)}
                  className="rounded-full px-5 py-2 transition"
                  style={
                    index === roleIndex
                      ? { backgroundColor: '#151b3a', color: '#faf7f0' }
                      : { backgroundColor: 'transparent', color: '#4a5568' }
                  }
                >
                  {item.role}
                </button>
              ))}
            </div>
          )}

          <p className="mt-6 text-base leading-7" style={{ color: '#4a5568' }}>
            {role.intro}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3 text-sm font-semibold">
              <span style={{ color: '#151b3a' }}>Quest progress</span>
              <span style={{ color: '#226580' }}>
                {completed}/{role.steps.length} · {pct}%
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: '#e2efef' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#151b3a' }} />
            </div>
            {pct === 100 && (
              <p className="mt-3 text-sm font-semibold" style={{ color: '#065f46' }}>
                🏅 Track complete — you’re ready.
              </p>
            )}
          </div>

          <ol className="mt-6 space-y-3">
            {role.steps.map((step, index) => {
              const key = `${roleIndex}-${step.title}`
              const checked = !!done[key]

              return (
                <li key={key}>
                  <button
                    onClick={() => setDone((current) => ({ ...current, [key]: !checked }))}
                    className="flex w-full gap-4 rounded-2xl border p-5 text-left transition"
                    style={
                      checked
                        ? { borderColor: '#6ee7b7', backgroundColor: '#ecfdf5' }
                        : { borderColor: '#d1d5db', backgroundColor: '#ffffff' }
                    }
                  >
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={
                        checked
                          ? { backgroundColor: '#16a34a', color: '#ffffff' }
                          : { backgroundColor: '#e2efef', color: '#151b3a' }
                      }
                    >
                      {checked ? '✓' : index + 1}
                    </span>
                    <span>
                      <span className="block text-lg font-semibold" style={{ color: '#151b3a' }}>
                        {step.title}
                      </span>
                      <span className="mt-1 block text-sm" style={{ color: '#6b7280' }}>
                        {step.detail}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold" style={{ color: '#151b3a' }}>
                Questions to ask
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {guide.asks.map((ask) => (
                  <li key={ask} className="rounded-xl px-4 py-2.5" style={{ backgroundColor: '#e2efef' }}>
                    “{ask}”
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold" style={{ color: '#151b3a' }}>
                What to bring
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {guide.bring.map((item) => (
                  <li key={item} className="flex gap-2" style={{ color: '#4a5568' }}>
                    <span aria-hidden>🎒</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/products" className="mt-5 inline-block text-sm font-semibold" style={{ color: '#226580' }}>
                Shop verified products →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
