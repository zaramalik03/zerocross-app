"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
 

const Navbar = () => {
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)

    const links = [
        { href: '/', label: 'Home' }, 
        { href: '/products', label: 'Products' },
        { href: '/places', label: 'Places' },
        { href: '/recipes', label: 'Recipes' },
        { href: '/guidebook', label: 'Guidebook' },
    ]

    return (
        <nav
            style={{ backgroundColor: '#e2efef', fontFamily: 'Inter, system-ui, sans-serif' }}
            className="sticky top-0 z-50 shadow-md"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span
                        className="text-xl font-bold tracking-tight"
                        style={{ color: '#151b3a', fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                        Zero<span style={{ color: '#151b3a' }}>Cross</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium transition-colors duration-200"
                            style={{
                                color: pathname === link.href ? '#226580' : '#545554',
                                borderBottom: pathname === link.href ? '2px solid #226580' : '2px solid transparent',
                                paddingBottom: '2px',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right side */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                        style={{ color: '#ffffff', backgroundColor: '#151b3a' }}
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/onboarding"
                        className="text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                        style={{ color: '#ffffff', backgroundColor: '#226580' }}
                    >
                        Profile
                    </Link>
                </div>                

                {/* Mobile menu button */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="block w-5 h-0.5 bg-[#151b3a]"></span>
                    <span className="block w-5 h-0.5 bg-[#151b3a]"></span>
                    <span className="block w-5 h-0.5 bg-[#151b3a]"></span>
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div style={{ backgroundColor: '#FAF7F0', borderTop: '1px solid #D1D5DB' }} className="md:hidden px-6 py-4 flex flex-col gap-4">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium"
                            style={{ color: pathname === link.href ? '#226580' : '#4A5568' }}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-center py-2 rounded-full"
                        style={{ backgroundColor: '#151b3a', color: '#ffffff' }}
                        onClick={() => setMenuOpen(false)}
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/onboarding"
                        className="text-sm font-semibold text-center py-2 rounded-full"
                        style={{ backgroundColor: '#226580', color: '#ffffff' }}
                        onClick={() => setMenuOpen(false)}
                    >
                        Build my Profile
                    </Link>                        
                </div>
            )}
        </nav>
    )
}

export default Navbar