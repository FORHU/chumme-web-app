"use client";

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Heart, Brain, Users, MessageCircle, Sparkles, Globe, TrendingUp, Moon, Sun } from 'lucide-react'

export default function LandingPage() {
  // HYDRATION GUARD
  // We wait until the page is loaded in the browser before showing
  // theme-sensitive elements (like the sun/moon toggle button).
  // Without this, the server and browser disagree on what to render → crash.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = mounted ? resolvedTheme === 'dark' : true
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')
  const router = useRouter()

  return (
    <div className={`min-h-screen w-full relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>

      {/* Background gradient — a subtle colored overlay on the whole page */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#0a0a0a] via-[#1a0510]/30 to-[#0a0a0a]' : 'bg-gradient-to-b from-white via-[#fce7f3]/20 to-white'}`} />

      {/* All content sits above the background via relative z-10 */}
      <div className="relative z-10">

        {/* ─── NAVBAR ─── */}
        {/* motion.nav: slides in from y:-20 (above) to y:0 on page load */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-8 lg:px-16 py-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo text */}
            <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-[#EF88AD] via-[#A53860] to-[#670D2F] bg-clip-text text-transparent">
              CHUMME
            </span>

            <div className="flex items-center gap-4">
              {/* Theme toggle — only render after mounted to avoid hydration error */}
              {mounted ? (
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              ) : (
                <div className="w-9 h-9" /> // Placeholder keeps layout stable during SSR
              )}

              <button
                onClick={() => router.push('/auth')}
                className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Sign In
              </button>

              <button
                onClick={() => router.push('/auth')}
                className="bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-medium px-6 py-2 rounded-lg transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.nav>

        {/* ─── HERO SECTION ─── */}
        <section className="px-8 lg:px-16 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto text-center">

              {/* Main headline — fades in from below with a 0.1s delay */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-12"
              >
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-[#EF88AD] via-[#A53860] to-[#670D2F] bg-clip-text text-transparent">
                    Emotions
                  </span>
                  <br />
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    Become Memorable
                  </span>
                </h1>
                <p className={`text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  A friend that remembers emotions, an intelligent platform that connects your feelings and experiences
                </p>
                <p className={`text-base max-w-2xl mx-auto ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Technology doesn&apos;t replace emotions. Technology makes emotions memorable.
                </p>
              </motion.div>

              {/* CTA buttons — slightly later delay for staggered feel */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              >
                <button
                  onClick={() => router.push('/auth')}
                  className="bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-medium text-base px-10 py-4 rounded-xl transition-all"
                >
                  Start Your Journey
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`font-medium transition-colors px-6 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Learn More
                </button>
              </motion.div>

              {/* 3 benefit pills */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
              >
                {[
                  { icon: Heart, text: 'Remember every moment' },
                  { icon: Brain, text: 'AI-powered insights' },
                  { icon: Sparkles, text: 'Turn emotions into value' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#A53860]/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#A53860]" />
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES SECTION ─── */}
        {/* id="features" lets the "Learn More" button scroll here */}
        <section id="features" className="px-8 lg:px-16 py-20">
          <div className="max-w-7xl mx-auto">
            {/* whileInView: animation only plays when this element scrolls into view */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }} // only animate once, not every scroll
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-[#A53860]/10 mb-4">
                <span className="text-sm text-[#A53860] font-medium">The Platform</span>
              </div>
              <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Experience, without the hassle
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Every feature designed to make your emotional journey unforgettable
              </p>
            </motion.div>

            {/* 2x2 grid of feature cards */}
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                { step: '01', icon: MessageCircle, title: 'Chumme Chat', description: 'AI-powered conversations that understand your emotions. Chat with an intelligent friend that learns from your experiences and helps you express what you feel.' },
                { step: '02', icon: Users, title: 'Circle', description: 'Connect with communities that share your passions. Join circles of fans, friends, and creators who understand your emotional journey.' },
                { step: '03', icon: TrendingUp, title: 'Collaboration', description: 'Work with brands and artists on meaningful projects. Transform your emotional connection into real-world opportunities and experiences.' },
                { step: '04', icon: Globe, title: 'Discover', description: 'Explore moments, experiences, and communities. Find new ways to engage with the things and people you love most.' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.step}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`rounded-xl p-8 border transition-all ${isDark ? 'bg-gray-900/50 border-gray-800 hover:border-[#A53860]/50' : 'bg-white border-gray-200 hover:border-[#A53860]/50'}`}
                >
                  <div className="flex items-start gap-5 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#A53860]/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-[#A53860]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[#A53860] text-sm font-semibold mb-2">{feature.step}</div>
                      <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                      <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="px-8 lg:px-16 py-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                A step-by-step approach
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                From emotion to economy to finance
              </p>
            </motion.div>

            <div className="space-y-12">
              {[
                { number: '1', title: 'Express your emotions', description: 'Share your feelings, experiences, and moments through AI-powered chat and intelligent memory capture.' },
                { number: '2', title: 'Connect with communities', description: 'Join circles and discover like-minded fans. Build meaningful relationships around shared passions and experiences.' },
                { number: '3', title: 'Create lasting value', description: 'Transform your emotional journey into economic opportunities. Collaborate with brands and turn memories into assets.' },
              ].map((step, index) => (
                // initial x:-30 means it starts 30px to the LEFT, then slides to x:0
                <motion.div
                  key={step.number}
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-white">{step.number}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                    <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="px-8 lg:px-16 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { value: '50K+', label: 'Active Users' },
                { value: '3x', label: 'Value Creation' },
                { value: '98%', label: 'Emotional Accuracy' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`text-center p-8 rounded-2xl border transition-all ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#A53860]/10' : 'bg-white border-gray-200 shadow-lg'}`}
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#EF88AD] to-[#A53860] bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA SECTION ─── */}
        <section className="px-8 lg:px-16 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Glowing blur behind the text — pure CSS trick */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A53860]/20 to-[#670D2F]/20 rounded-3xl blur-3xl" />
              <div className="relative">
                <h2 className={`text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Make your emotions<br />
                  <span className="bg-gradient-to-r from-[#EF88AD] to-[#A53860] bg-clip-text text-transparent">
                    unforgettable
                  </span>
                </h2>
                <p className={`text-xl mb-12 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Join CHUMME and turn your feelings into lasting value
                </p>
                {/* whileHover scales button up to 105%, whileTap scales down to 95% */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={() => router.push('/auth')}
                    className="bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:from-[#EF88AD] hover:to-[#A53860] text-white font-medium text-lg px-12 py-5 rounded-xl transition-all shadow-2xl shadow-[#A53860]/40"
                  >
                    Start Your Journey
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className={`px-8 lg:px-16 py-12 border-t ${isDark ? 'border-[#A53860]/10' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <span className="text-xl font-semibold bg-gradient-to-r from-[#EF88AD] to-[#A53860] bg-clip-text text-transparent">
              CHUMME
            </span>
            <div className="flex items-center gap-8">
              {['Platform', 'Features', 'About', 'Contact'].map((item) => (
                <a key={item} href="#" className={`text-sm transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  {item}
                </a>
              ))}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>© 2026 CHUMME</div>
          </div>
        </footer>

      </div>
    </div>
  )
}
