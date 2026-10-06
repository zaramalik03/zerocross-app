"use client"

import Link from 'next/link'
import { GUIDES } from '@/app/guidebook/data'

const GROUPS = ['Events', 'Everyday', 'Skills'] as const

export default function GuidebookPage() {
  return (
    <div className="page-shell min-h-screen">
      <div className="page-header px-6 py-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="section-label">Guides</p>
          <h1 className="section-title mt-3">Prep for the next party, potluck, or game.</h1>
          <p className="section-body mt-3 max-w-2xl">
            Each guide is a short quest: pick a track, work through the checklist, and learn the
            easiest questions to ask before you sit down, host, or shop.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
        {GROUPS.map((group) => (
          <section key={group} className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: '#6b7280' }}>
              {group}
            </h2>

            <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {GUIDES.filter((guide) => guide.category === group).map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guidebook/${guide.slug}`}
                  className="surface-card flex h-full flex-col p-6 transition-transform duration-150 hover:-translate-y-1"
                >
                  <span className="text-3xl">{guide.emoji}</span>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#226580' }}>
                    {guide.level}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold leading-snug" style={{ color: '#151b3a' }}>
                    {guide.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6" style={{ color: '#4a5568' }}>
                    {guide.summary}
                  </p>
                  <p className="mt-4 text-xs font-semibold" style={{ color: '#6b7280' }}>
                    {guide.minutes} min · {guide.roles.length} track{guide.roles.length > 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}