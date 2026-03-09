'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth-context'
import { AuthLayout } from '@/components/auth-layout'

export default function LoginPage() {
  const { login } = useAuth()
  const t = useTranslations('login')
  const ts = useTranslations('signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const mergedT = (key: string) => {
    const primary = t(key as never)
    if (primary === `login.${key}` || primary === key) {
      return ts(key as never)
    }
    return primary
  }

  const onSubmit = async (data: any) => {
    setError('')
    setLoading(true)
    try {
      await login(data.identifier, data.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      initialMode="login" 
      t={mergedT} 
      onSubmit={onSubmit} 
      loading={loading} 
      error={error} 
    />
  )
}
