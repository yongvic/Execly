'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth-context'
import { AuthLayout } from '@/components/auth-layout'

export default function SignupPage() {
  const { register } = useAuth()
  const t = useTranslations('signup')
  const tl = useTranslations('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const mergedT = (key: string) => {
    const primary = t(key as never)
    if (primary === `signup.${key}` || primary === key) {
      return tl(key as never)
    }
    return primary
  }

  const onSubmit = async (data: any) => {
    setError('')
    setLoading(true)
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error(t('passwordMismatch'))
      }
      await register({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        password: data.password,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      initialMode="signup" 
      t={mergedT} 
      onSubmit={onSubmit} 
      loading={loading} 
      error={error} 
    />
  )
}
