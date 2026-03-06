'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Check, Star, TrendingUp, Users, Zap, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TiltCard } from '@/components/animations/tilt-card'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useAuth } from '@/lib/auth-context'

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()
  const t = useTranslations('landing')
  const heroX = useMotionValue(0)
  const heroY = useMotionValue(0)
  const smoothX = useSpring(heroX, { stiffness: 120, damping: 18, mass: 0.3 })
  const smoothY = useSpring(heroY, { stiffness: 120, damping: 18, mass: 0.3 })
  const heroTransform = useMotionTemplate`translate3d(${smoothX}px, ${smoothY}px, 0)`

  const onHeroMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    heroX.set((px - 0.5) * 24)
    heroY.set((py - 0.5) * 18)
  }

  const onHeroLeave = () => {
    heroX.set(0)
    heroY.set(0)
  }

  const services = [
    { title: t('graphicDesign'), desc: t('graphicDesignDesc'), icon: '🎨', image: '/images/services/graphic-design.svg' },
    { title: t('templates'), desc: t('templatesDesc'), icon: '📄', image: '/images/services/templates.svg' },
    { title: t('writing'), desc: t('writingDesc'), icon: '✍️', image: '/images/services/writing.svg' },
    { title: t('webDev'), desc: t('webDevDesc'), icon: '💻', image: '/images/services/web-dev.svg' },
  ]

  const steps = [
    { num: '1', title: t('step1Title'), desc: t('step1Desc') },
    { num: '2', title: t('step2Title'), desc: t('step2Desc') },
    { num: '3', title: t('step3Title'), desc: t('step3Desc') },
  ]

  const features = [
    t('feature1'),
    t('feature2'),
    t('feature3'),
    t('feature4'),
    t('feature5'),
    t('feature6'),
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          animate={{ x: [0, 40, -10, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: 'mirror' }}
        />
        <motion.div
          className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -10, 0] }}
          transition={{ duration: 16, repeat: Infinity, repeatType: 'mirror' }}
        />
      </motion.div>

      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <span className="text-sm font-bold text-primary-foreground">M</span>
            </div>
            <span className="text-xl font-bold text-foreground">Execly</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#services" className="text-sm text-foreground/70 transition hover:text-foreground">{t('services')}</Link>
            <Link href="#how-it-works" className="text-sm text-foreground/70 transition hover:text-foreground">{t('howItWorks')}</Link>
            <Link href="#features" className="text-sm text-foreground/70 transition hover:text-foreground">{t('features')}</Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t('signIn')}</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">{t('getStarted')}</Button>
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 md:hidden">
            <div className="space-y-1">
              <div className="h-0.5 w-6 bg-foreground" />
              <div className="h-0.5 w-6 bg-foreground" />
              <div className="h-0.5 w-6 bg-foreground" />
            </div>
          </button>
        </div>
        {isMenuOpen && (
          <div className="border-t border-border px-4 py-4 md:hidden">
            <div className="mb-3"><LanguageSwitcher /></div>
            <div className="flex flex-col gap-2">
              <Link href="#services" className="text-sm text-foreground/80">{t('services')}</Link>
              <Link href="#how-it-works" className="text-sm text-foreground/80">{t('howItWorks')}</Link>
              <Link href="#features" className="text-sm text-foreground/80">{t('features')}</Link>
              {user ? (
                <Link href="/dashboard" className="text-sm text-foreground/80">
                  <User className="inline h-4 w-4 mr-1" />
                  {user.name}
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-foreground/80">{t('signIn')}</Link>
                  <Link href="/signup" className="text-sm text-foreground/80">{t('getStarted')}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <section className="relative overflow-hidden py-20 md:py-28" onMouseMove={onHeroMove} onMouseLeave={onHeroLeave}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.14),transparent_45%),radial-gradient(circle_at_80%_40%,hsl(var(--accent)/0.15),transparent_45%)]" />
        <motion.div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8" initial="hidden" animate="visible" variants={sectionReveal}>
          <motion.div style={{ transform: heroTransform }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">{t('trustedBadge')}</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">{t('heroTitle')}</h1>
            <p className="mb-8 text-lg leading-relaxed text-foreground/70">{t('heroDescription')}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/browse">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  {t('browseServices')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">{t('learnMore')}</Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-bold text-foreground">500+</div>
                <p className="text-sm text-foreground/60">{t('servicesAvailable')}</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">2K+</div>
                <p className="text-sm text-foreground/60">{t('happyCustomers')}</p>
              </div>
            </div>
          </motion.div>
          <TiltCard
            className="relative"
          >
            <motion.div
              style={{ transform: heroTransform }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
              <div className="relative flex h-96 items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/15 to-accent/15 md:h-[500px]">
                <div className="text-center">
                  <TrendingUp className="mx-auto mb-4 h-16 w-16 text-primary/50" />
                  <p className="text-foreground/50">{t('marketplace')}</p>
                </div>
              </div>
            </motion.div>
          </TiltCard>
        </motion.div>
      </section>

      <motion.section id="services" className="border-t border-border py-20 md:py-28" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionReveal}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{t('servicesTitle')}</h2>
            <p className="text-lg text-foreground/60">{t('servicesDesc')}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => (
              <TiltCard key={service.title}>
                <motion.div
                  key={service.title}
                  className={`rounded-xl border bg-card p-6 transition-all duration-300 ${
                    idx === 0
                      ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/20 scale-105'
                      : 'border-border hover:border-primary/50 hover:shadow-lg'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.45 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="mb-4 text-3xl">{service.icon}</div>
                  <h3 className={`mb-2 font-semibold ${idx === 4 ? 'text-green-800' : 'text-foreground'}`}>{service.title}</h3>
                  <p className={`text-sm ${idx === 4 ? 'text-green-600' : 'text-foreground/60'}`}>{service.desc}</p>
                  <div className="mt-4 h-24 overflow-hidden rounded-lg">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="how-it-works" className="bg-muted/30 py-20 md:py-28" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionReveal}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{t('howTitle')}</h2>
            <p className="text-lg text-foreground/60">{t('howDesc')}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
              >
                <div className="mb-4 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {step.num}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-foreground/60">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionReveal}>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">{t('whyTitle')}</h2>
            <ul className="space-y-4">
              {features.map((feature, idx) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="flex h-80 items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" initial={{ opacity: 0, rotate: -3 }} whileInView={{ opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Users className="h-24 w-24 text-primary/30" />
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 py-16 md:py-24">
        <motion.div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{t('ctaTitle')}</h2>
          <p className="mb-8 text-lg text-foreground/70">{t('ctaDesc')}</p>
          <Link href="/signup">
            <Button size="lg">{t('ctaButton')}</Button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Execly</h3>
              <p className="text-sm text-foreground/60">{t('marketplace')}</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">{t('services')}</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="/browse?category=graphic-design" className="hover:text-foreground">{t('graphicDesign')}</Link></li>
                <li><Link href="/browse?category=templates" className="hover:text-foreground">{t('templates')}</Link></li>
                <li><Link href="/browse?category=writing" className="hover:text-foreground">{t('writing')}</Link></li>
                <li><Link href="/browse?category=web-dev" className="hover:text-foreground">{t('webDev')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">{t('company')}</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="/" className="hover:text-foreground">{t('about')}</Link></li>
                <li><Link href="/" className="hover:text-foreground">{t('contact')}</Link></li>
                <li><Link href="/" className="hover:text-foreground">{t('blog')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">{t('legal')}</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="/" className="hover:text-foreground">{t('privacy')}</Link></li>
                <li><Link href="/" className="hover:text-foreground">{t('terms')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-foreground/60 md:flex-row">
            <p>&copy; 2026 Execly. {t('rights')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Twitter</a>
              <a href="#" className="hover:text-foreground">LinkedIn</a>
              <a href="#" className="hover:text-foreground">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

