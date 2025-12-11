import React from 'react'
import { motion } from 'framer-motion'

// AppTheme.jsx
// Default export: <AppTheme>{children}</AppTheme>
// Wrap your pages with <AppTheme> in _app.jsx / index.js or each page to apply a single, consistent theme.

// Usage:
// import AppTheme from './AppTheme'
// function App({ Component, pageProps }) {
//   return (
//     <AppTheme>
//       <Component {...pageProps} />
//     </AppTheme>
//   )
// }

// Requirements:
// - Tailwind CSS must be configured in the project (this file uses Tailwind classes)
// - Install framer-motion: `npm i framer-motion`

// Design goals implemented here:
// 1) Eye-catching high-contrast palette (deep indigo, electric cyan, warm accent)
// 2) Subtle glassy cards, consistent rounded corners, roomy spacing
// 3) Smooth entrance + hover micro-animations from Framer Motion
// 4) Shared components: Layout, Card, CTAButton, IconButton, AccentText
// 5) Utility class names and examples you can copy into your existing pages

// --- Theme tokens (Tailwind-friendly classnames) ---
// Primary background: bg-gradient-to-br from-[#071A52] to-[#002E99]
// Card background: bg-white/6 backdrop-blur-md border border-white/8
// Accent (buttons, highlights): text-cyan-300 and bg-gradient-to-r from-cyan-400 to-indigo-500
// Rounded corners: rounded-2xl (2xl is used across components)

// Framer Motion presets
const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
}

const float = {
  rest: { y: 0 },
  hover: { y: -6, transition: { duration: 0.25, ease: 'easeOut' } }
}

export default function AppTheme({ children }) {
  return (
    <div className="app-theme-wrapper min-h-screen font-sans text-gray-100 antialiased bg-[#071A52]">
    
      {/* Top-level container with subtle grain */}
      <div className="min-h-screen p-6 md:p-10 lg:p-14">
        <div className="max-w-[100%] ">
          <Header />

          <main className="mt-8">
            {/* animate page content on mount */}
            <motion.div initial="hidden" animate="show" variants={fadeIn}>
              {children}
            </motion.div>
          </main>

          <Footer />
        </div>
      </div>

      {/* decorative floating blobs */}
      <div aria-hidden="true" className="pointer-events-none">
        <div className="absolute -left-20 -top-20 w-72 h-72 bg-gradient-to-tr from-[#00d4ff]/20 to-[#7733ff]/10 rounded-full blur-3xl" />
        <div className="absolute right-[-60px] bottom-[-60px] w-96 h-96 bg-gradient-to-br from-[#00ffd0]/12 to-[#002E99]/6 rounded-full blur-2xl" />
      </div>

      {/* Tiny global styles for card glass and focus rings (keeps Tailwind markup concise) */}
      <style jsx global>{`
        /* Focus ring utility for keyboard accessibility */
        :root { --accent: rgba(34,211,238,0.95); }
        .focus-accent:focus { outline: none; box-shadow: 0 0 0 4px rgba(34,211,238,0.12); border-color: rgba(34,211,238,0.5); }

        /* Glass card theme fallback for non-Tailwind parts */
        .glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(6px); }

        /* Subtle text glow for titles */
        .title-glow { text-shadow: 0 6px 18px rgba(0,0,0,0.35); }
      `}</style>
    </div>
  )
}

function Header() {
  return (
    <header className="flex items-center justify-between gap-6">
      <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
        {/* <div className="p-2 bg-white/8 rounded-2xl glass">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#g)" />
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="#00d4ff" />
                <stop offset="1" stopColor="#6b21a8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight title-glow">YourAppName</h1>
          <p className="text-xs text-white/60 -mt-1">Shop faster • Build smarter</p>
        </div> */}
      </motion.div>

      {/* <nav className="flex items-center gap-3">
        <SearchBox />
        <IconButton label="Cart" icon={cartSvg()} />
        <IconButton label="Profile" icon={userSvg()} />
      </nav> */}
    </header>
  )
}

function Footer() {
  return (
    <div></div>
    // <footer className="mt-14 py-8 text-sm text-white/60 flex flex-col md:flex-row justify-between items-center gap-6">
    //   <p>© {new Date().getFullYear()} YourAppName. All rights reserved.</p>
    //   <div className="flex gap-4">
    //     <a className="hover:text-white transition">Privacy</a>
    //     <a className="hover:text-white transition">Terms</a>
    //     <a className="hover:text-white transition">Help</a>
    //   </div>
    // </footer>
  )
}

function SearchBox() {
  return (
    <div className="hidden sm:flex items-center glass rounded-full px-3 py-1 gap-2 border border-white/6">
      <input className="bg-transparent outline-none placeholder-white/60 text-sm w-44" placeholder="Search products, brands..." />
      <button className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-black text-sm font-medium shadow-sm hover:scale-105 transition transform">Search</button>
    </div>
  )
}

function IconButton({ label, icon }) {
  return (
    <motion.button whileHover={{ scale: 1.06 }} className="p-2 rounded-full glass focus-accent" aria-label={label} title={label}>
      <span className="w-6 h-6 inline-block">{icon}</span>
    </motion.button>
  )
}

// Small SVGs
function cartSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/></svg>
  )
}
function userSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 21a9 9 0 0 1 18 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/></svg>
  )
}

// ----------------------
// Reusable components for your pages
// Copy these into your components folder and use them throughout to keep consistent styles
// ----------------------

export function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.995 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.36 } }}
      whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(2,6,23,0.45)' }}
      className={`glass rounded-2xl p-5 border border-white/6 ${className}`}>
      {children}
    </motion.div>
  )
}

export function CTAButton({ children, onClick, subtle = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-3 px-5 py-2 rounded-2xl font-semibold shadow-md transition-transform focus-accent ${subtle ? 'bg-white/6 text-white/90 border border-white/8' : 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-gray-900'}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}

export function AccentText({ children }) {
  return <span className="text-cyan-300 font-semibold">{children}</span>
}

export function ProductCard({ product }) {
  return (
    <GlassCard className="max-w-sm">
      <div className="flex items-start gap-4">
        <motion.img src={product.image} alt={product.name} className="w-28 h-28 object-cover rounded-xl" whileHover={{ scale: 1.04 }} />
        <div className="flex-1">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-sm text-white/70 mt-1">{product.short}</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-xl font-extrabold">₹{product.price}</div>
              <div className="text-xs text-white/60">Free delivery</div>
            </div>
            <CTAButton>Buy now</CTAButton>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

// ----------------------
// Helpful Tailwind config snippet to add to tailwind.config.js
// (drop into your project's tailwind.config.js to make these classes available)
// ----------------------

/*
module.exports = {
  theme: {
    extend: {
      colors: {
        cyan: {
          300: '#66f2ff',
          400: '#00d4ff'
        },
        brand: {
          deep: '#071A52',
          bright: '#002E99'
        }
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  }
}
*/

// ----------------------
// Quick integration notes (short):
// - Wrap your top-level pages in <AppTheme> (see usage comment at top)
// - Replace top-level containers with <GlassCard> to get consistent card look
// - Use <CTAButton> instead of plain <button> for consistent CTA styling & animations
// - For lists (products, categories) give each item a small hover lift using whileHover={{ y: -6 }} on motion.div
// - Keep spacing consistent using Tailwind spacing scales (p-5, gap-4, rounded-2xl)
// ----------------------
