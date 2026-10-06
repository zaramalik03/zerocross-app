"use client"
import React, { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div
      className="page-shell min-h-screen flex"
    >
      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#151b3a' }}
          >
            {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
            {mode === 'login'
              ? 'Sign in to access your allergen profile and saved places.'
              : 'Join thousands exploring global food, safely.'
            }
          </p>

          <div className="space-y-4 mb-6">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4A5568' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all"
                  style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', color: '#1A3D2B' }}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#455269' }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all"
                style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', color: '#1A3D2B' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4A5568' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all"
                style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', color: '#1A3D2B' }}
              />
            </div>
          </div>

          <button
            className="w-full py-3 rounded-full font-semibold text-sm transition-all mb-4"
            style={{ backgroundColor: '#151b3a', color: '#FAF7F0' }}
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="relative flex items-center my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
            <span className="mx-4 text-xs" style={{ color: '#9CA3AF' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
          </div>

          <button
            className="w-full py-3 rounded-full font-semibold text-sm border transition-all mb-6"
            style={{ borderColor: '#D1D5DB', color: '#4A5568', backgroundColor: '#FFFFFF' }}
          >
            Continue with Google
          </button>
          <p className="text-center text-xs" style={{ color: '#6B7280' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-semibold underline"
              style={{ color: '#151b3a' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          <p className="text-center text-xs" style={{ color: '#000000' }}>
              Have a problem? Contact us!
          </p>
        </div>
      </div>
    </div>
  )
}