"use client"
import React, { useEffect, useState } from 'react'
import { getProfile, type UserProfile } from '@/lib/userprofile'
import Link from 'next/link'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(getProfile)

  useEffect(() => {
    setProfile(getProfile())
  }, [])

  return (
    <div className="page-shell min-h-screen pt-20">
      <section className="mx-auto flex max-w-4xl flex-col gap-12 px-6">
        <div className="text-center">
          <h1 className="section-title">Your profile</h1>
        </div>

        <div className="surface-card p-5 text-left transition">
          <h2 className="mb-4 text-2xl font-semibold">About Me</h2>
          <p className="text-sm text-gray-600">
            Your onboarding choices are saved here and used to filter dining and grocery options.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Preferences</h2>
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              style={{ backgroundColor: '#FAF7F0' }}
              className="rounded-2xl border p-5 text-left transition shadow-md"
            >
              <h3 className="mb-2 text-xl font-semibold">Allergens</h3>
              {profile.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.allergens.map((item) => (
                    <span key={item} className="rounded-full bg-[#1A3D2B] px-3 py-1 text-sm text-[#FAF7F0]">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No allergens selected yet.</p>
              )}
            </div>

            <div
              style={{ backgroundColor: '#FAF7F0' }}
              className="rounded-2xl border p-5 text-left transition shadow-md"
            >
              <h3 className="mb-2 text-xl font-semibold">Diets</h3>
              {profile.diets.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.diets.map((item) => (
                    <span key={item} className="rounded-full bg-[#226580] px-3 py-1 text-sm text-[#FAF7F0]">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No diets selected yet.</p>
              )}
            </div>
            {/* <div className="text-center">
              <Link
                href="/recommendations"
                className="px-8 py-4 rounded-full font-semibold text-sm text-center"
                style={{ backgroundColor: '#151b3a', color: '#ffffff' }}
              >
                Get Recommendations
              </Link> 
            </div> */}
          </section>
        </div>
      </section>
    </div>
  )
}