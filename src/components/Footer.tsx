import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#e2efef', fontFamily: 'Inter, system-ui, sans-serif' }} className="mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#151b3a' }} className="text-xl font-bold mb-3">
                            Zero<span style={{ color: '#151b3a' }}>Cross</span>
                        </h3>
                        <p style={{ color: '#545554' }} className="text-sm leading-relaxed">
                            Connecting people with dietary restrictions to certified allergen-free dining areas, groceries, and recipes. Our mission is to make food safe and accessible for everyone.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#545554' }}>Explore</h4>
                        <div className="flex flex-col gap-2">
                            {[['Products', '/products'], ['Places', '/places'], ['Recipes', '/recipes'], ['Guidebook', '/guidebook']].map(([label, href]) => (
                                <Link key={href} href={href} className="text-sm transition-colors duration-150" style={{ color: '#151b3a' }}>
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Allergens */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#545554' }}>We Cover</h4>
                        <p className="text-sm" style={{ color: '#151b3a' }}>
                            Gluten · Tree Nuts · Peanuts · Dairy · Eggs · Soy · Sesame · Fish · Shellfish & more
                        </p>
                    </div>
                </div>

                <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #545554' }}>
                    <p className="text-xs" style={{ color: '#545554' }}>© 2026 ZeroCross. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer