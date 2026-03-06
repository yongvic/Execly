'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { login } = useAuth()
  const t = useTranslations('login')

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ identifier: '', password: '', rememberMe: false })
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
      if (!formData.identifier || !formData.password) {
        throw new Error(t('required'))
      }

      await login(formData.identifier, formData.password)
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
          <span className="text-2xl font-bold text-foreground">Execly</span>
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
              <label htmlFor="identifier" className="mb-2 block text-sm font-medium text-foreground">{t('emailOrPhone')}</label>
              <Input id="identifier" name="identifier" type="text" placeholder={t('identifierPlaceholder')} value={formData.identifier} onChange={handleChange} required className="border-border bg-muted" />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">{t('password')}</label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">{t('forgot')}</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-border bg-muted pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
              />
              <label htmlFor="rememberMe" className="text-sm text-foreground/70">{t('remember')}</label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? t('submitting') : t('submit')}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-foreground/60">
              {t('noAccount')} <Link href="/signup" className="font-medium text-primary hover:underline">{t('createOne')}</Link>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-card px-2 text-foreground/50">{t('orContinue')}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="w-full">{t('google')}</Button>
            <Button variant="outline" type="button" className="w-full">{t('facebook')}</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

