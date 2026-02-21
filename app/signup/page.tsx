'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'

export default function SignupPage() {
  const router = useRouter()
  const { register } = useAuth()
  const t = useTranslations('signup')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error(t('allRequired'))
      }
      if (formData.password.length < 6) {
        throw new Error(t('passwordShort'))
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error(t('passwordMismatch'))
      }
      if (!formData.agreeToTerms) {
        throw new Error(t('acceptTerms'))
      }

      await register(formData.email, formData.password, formData.name)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="mb-6 flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <span className="text-lg font-bold text-primary-foreground">M</span>
          </div>
          <span className="text-2xl font-bold text-foreground">Mentorly</span>
        </div>

        <div className="space-y-6 rounded-xl border border-border bg-card p-8 shadow-xl shadow-primary/5">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-foreground/60">{t('subtitle')}</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">{t('fullName')}</label>
              <Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="border-border bg-muted" />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">{t('email')}</label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className="border-border bg-muted" />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">{t('password')}</label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={handleChange} required className="border-border bg-muted pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-foreground/50">{t('minChars')}</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">{t('confirmPassword')}</label>
              <div className="relative">
                <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className="border-border bg-muted pr-10" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                  setError('')
                }}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-foreground/70">
                {t('agree')} <Link href="/terms" className="text-primary hover:underline">{t('terms')}</Link>
              </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? t('submitting') : t('submit')}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-foreground/60">
              {t('haveAccount')} <Link href="/login" className="font-medium text-primary hover:underline">{t('signIn')}</Link>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-card px-2 text-foreground/50">{t('orContinue')}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="w-full">Google</Button>
            <Button variant="outline" type="button" className="w-full">Facebook</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
