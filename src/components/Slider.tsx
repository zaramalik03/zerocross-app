"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const steps = [
  { num: '01', title: 'Set your allergen profile', desc: 'Tell us your restrictions once. Every result you see is filtered to match — automatically.' },
  { num: '02', title: 'Browse verified spaces', desc: 'Restaurants, grocery brands, and recipes all screened for gluten-free and nut-free production.' },
  { num: '03', title: 'Eat with confidence', desc: 'Community-reviewed, cross-contact assessed. Trust what you put on your plate.' },
]

const allergens = [
  { icon: '🌾', name: 'Gluten' }, { icon: '🥜', name: 'Peanuts' }, { icon: '🌰', name: 'Tree Nuts' },
  { icon: '🥛', name: 'Dairy' }, { icon: '🥚', name: 'Eggs' }, { icon: '🫛', name: 'Soy' },
  { icon: '🐟', name: 'Fish' }, { icon: '🦞', name: 'Shellfish' }, { icon: '🌱', name: 'Sesame' },
]

export default function Slider() {
  return (
    <div style={{ fontFamily: 'Fraunces, system-ui, serif', fontWeight: 550, color: '#151b3a' }}>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#e2efef', minHeight: '88vh' }}
      >
        <div
        // w/2 for adding a diagonal cream accent on the right side of the hero section if needed
          className="absolute bottom-0 right-0 h-full hidden lg:block" 
          style={{
            backgroundColor: '#FAF7F0',
            clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center min-h-[88vh] gap-12 py-16">

          {/* Left: headline */}
          <div className="flex-1 flex flex-col gap-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest w-fit"
              style={{ backgroundColor: '#ffffff', color: '#A7C4B5' }}
            >
              Allergen-free · Various Options
            </div>
            <h1
              className="text-5xl lg:text-6xl xl:text-7xl leading-tight"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 550, color:'#020307' }}
            >
              Discover flavorful, globally-inspired foods, accommodating to your allergens.
            </h1>
            <p className="text-lg max-w-md leading-relaxed" style={{ color: '#545554' }}>
              We bring together allergen-free places, products, and recipes, removing the noise for people with dietary restrictions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* <Link
                href="/search"
                className="px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 text-center"
                style={{ backgroundColor: '#151b3a', color: '#ffffff' }}
              >
                Browse Options →
              </Link> */}
              {/* <Link
                href="/recipes"
                className="px-8 py-4 rounded-full font-semibold text-sm border-2 text-center transition-all duration-200"
                style={{ borderColor: '#A7C4B5', backgroundColor: '#ffffff' }}
              >
                Explore Recipes
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 lg:px-12" style={{ backgroundColor: '#e2efef' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#151b3a' }}>The Process</p>
            <h2
              className="text-4xl lg:text-5xl"
              style={{ fontFamily: 'Fraunces, serif', color: '#151b3a' }}
            >
              Three steps to confident eating
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{ backgroundColor: i === 1 ? '#151b3a' : '#FFFFFF', border: '1px solid #E5E7EB' }}
              >
                <div
                  className="text-6xl font-bold mb-6 opacity-10 select-none"
                  style={{ color: i === 1 ? '#FFFFFF' : '#151b3a', fontFamily: 'Playfair Display, serif' }}
                >
                  {s.num}
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: i === 1 ? '#FAF7F0' : '#151b3a' }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: i === 1 ? '#A7C4B5' : '#6B7280' }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALLERGENS COVERED ── */}
      <section className="py-20 px-6 lg:px-12" style={{ backgroundColor: '#151b3a' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#226580' }}>What We Screen For</p>
            <h2
              className="text-3xl lg:text-4xl"
              style={{ fontFamily: 'Fraunces, serif', fontWeight: 550, color: '#ffffff' }}
            >
              The top 9 allergens, and then some
            </h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
            {allergens.map(a => (
              <div
                key={a.name}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
              >
                <span className="text-3xl">{a.icon}</span>
                <span className="text-xs font-medium text-center" style={{ color: '#4A5568' }}>{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── CTA ── */}
      <section
        className="py-20 px-6 text-center"
        style={{ backgroundColor: '#e2efef' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-4xl lg:text-5xl mb-6"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 550,color: '#151b3a' }}
          >
            Ready to begin?
          </h2>
          <p className="mb-8 text-base" style={{ color: '#226580' }}>
            Living allergen-free does not have to be stressful or anxiety-inducing. Set up your profile and start browsing allergen-free groceries, dining spaces, and recipes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200"
              style={{ backgroundColor: '#151b3a', color: '#ffffff' }}
            >
              Browse Allergen-Free Products
            </Link>
            <Link
              href="/recipes"
              className="px-8 py-4 rounded-full font-semibold text-sm border-2 transition-all duration-200"
              style={{ borderColor: '#A7C4B5', color: '#151b3a', backgroundColor: '#ffffff' }}
            >
              Discover Recipes
            </Link>
            <Link
              href="/places"
              className="px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200"
              style={{ backgroundColor: '#151b3a', color: '#ffffff' }}
            >
              Browse Allergen-Free Places
            </Link>
          </div>
          {/* <p className="mb-8 text-base" style={{ color: '#226580' }}>
            Does not sell any data and is used for information purposes. Does not guarantee reducing cross-contamination risk. No app can do that.
          </p> */}
        </div>
      </section>
    </div>
  )
}