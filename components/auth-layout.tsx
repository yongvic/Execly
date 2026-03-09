'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, ShieldCheck, Star, Sparkles, Mail, Lock, User, Phone, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSwitcher } from '@/components/language-switcher'

interface AuthLayoutProps {
  initialMode: 'login' | 'signup'
  t: any
  onSubmit: (data: any) => Promise<void>
  loading: boolean
  error: string
}

export function AuthLayout({ initialMode, t, onSubmit, loading, error }: AuthLayoutProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    identifier: ''
  })

  const isLogin = mode === 'login'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex items-center justify-center p-4 lg:p-8 font-sans overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[2.5rem] border border-zinc-200 shadow-2xl overflow-hidden min-h-[700px]">
        
        {/* LEFT SIDE: Visual & Info */}
        <div className={`relative hidden lg:flex flex-col justify-between p-12 overflow-hidden transition-all duration-700 ease-in-out bg-slate-50 ${isLogin ? 'order-1 border-r border-zinc-100' : 'order-2 border-l border-zinc-100'}`}>
          {/* Animated Image Background */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={mode}
                src={isLogin 
                  ? "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80" 
                  : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
                }
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.15, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover grayscale"
              />
            </AnimatePresence>
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter mb-12 group text-primary">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white group-hover:rotate-12 transition-transform">E</div>
               <span>Execly.</span>
            </Link>

            <motion.div
              key={mode + "-text"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-md"
            >
              <h2 className="text-4xl font-bold leading-tight mb-6 text-zinc-800">
                {isLogin 
                  ? "Propulsez vos projets avec une qualité Studio." 
                  : "Rejoignez la nouvelle ère du service digital."
                }
              </h2>
              <div className="space-y-4">
                {[
                  "Processus 100% sécurisé",
                  "Livrables premium garantis",
                  "Support client réactif"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-zinc-500">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 flex items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 max-w-sm shadow-sm">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-100" />
              ))}
            </div>
            <p className="text-xs text-zinc-500">
              <span className="text-primary font-bold">+1k</span> étudiants ont déjà franchi le pas.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className={`relative flex flex-col p-8 lg:p-16 transition-all duration-700 ease-in-out ${isLogin ? 'order-2' : 'order-1'}`}>
          <div className="flex justify-between items-center mb-12">
            <div className="lg:hidden">
              <Link href="/" className="font-bold text-xl tracking-tighter text-primary">Execly.</Link>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <motion.div
              key={mode + "-title"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-2 text-zinc-900">
                {isLogin ? t('title') : t('signupTitle')}
              </h1>
              <p className="text-zinc-500 text-sm">
                {isLogin 
                  ? "Content de vous revoir ! Connectez-vous à votre espace." 
                  : "Commencez dès aujourd'hui et donnez vie à vos idées."
                }
              </p>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">{t('fullName')}</label>
                    <div className="relative group">
                      <Input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="h-12 bg-zinc-50 border-zinc-200 rounded-xl pl-11 focus:bg-white focus:border-primary/50 text-zinc-900 transition-all" 
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLogin ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">{t('emailOrPhone')}</label>
                  <div className="relative group">
                    <Input 
                      name="identifier" 
                      value={formData.identifier} 
                      onChange={handleChange}
                      placeholder="Email ou téléphone"
                      className="h-12 bg-zinc-50 border-zinc-200 rounded-xl pl-11 focus:bg-white focus:border-primary/50 text-zinc-900 transition-all" 
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">{t('email')}</label>
                    <div className="relative group">
                      <Input 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="h-12 bg-zinc-50 border-zinc-200 rounded-xl pl-11 focus:bg-white focus:border-primary/50 text-zinc-900 transition-all" 
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">{t('phone')}</label>
                    <div className="relative group">
                      <Input 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange}
                        placeholder="+228..."
                        className="h-12 bg-zinc-50 border-zinc-200 rounded-xl pl-11 focus:bg-white focus:border-primary/50 text-zinc-900 transition-all" 
                      />
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t('password')}</label>
                  {isLogin && <Link href="/forgot-password" size="sm" className="text-[10px] text-primary hover:underline uppercase font-bold tracking-widest">Oublié ?</Link>}
                </div>
                <div className="relative group">
                  <Input 
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-12 bg-zinc-50 border-zinc-200 rounded-xl pl-11 focus:bg-white focus:border-primary/50 text-zinc-900 transition-all" 
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">{t('confirmPassword')}</label>
                  <div className="relative group">
                    <Input 
                      name="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword} 
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="h-12 bg-zinc-50 border-zinc-200 rounded-xl pl-11 focus:bg-white focus:border-primary/50 text-zinc-900 transition-all" 
                    />
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                </motion.div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="h-12 w-full bg-primary text-white hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 mt-4"
              >
                {loading ? (
                  <Sparkles className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? t('submit') : t('submitSignup')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-500">
                {isLogin ? t('noAccount') : t('haveAccount')}{' '}
                <button 
                  onClick={() => setMode(isLogin ? 'signup' : 'login')}
                  className="text-primary font-bold hover:underline underline-offset-4"
                >
                  {isLogin ? t('createOne') : t('signIn')}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-12 text-[10px] text-zinc-400 flex justify-between uppercase tracking-widest font-bold">
            <span>© {new Date().getFullYear()} EXECLY</span>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
