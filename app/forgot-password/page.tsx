'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSent(true)
        toast.success(t('toastSuccess'))
      } else {
        const data = await response.json()
        toast.error(t('failed'))
      }
    } catch (error) {
      toast.error(t('errorOccurred'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md items-center px-4 py-10">
      <Card className="w-full border-slate-200 shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/login" className="text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSent ? (
            <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-100">
              <p className="font-medium mb-1">{t('successTitle')}</p>
              <p>{t('successMessage', { email })}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('emailLabel')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('sending')}
                  </>
                ) : (
                  t('submit')
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center text-sm text-slate-600">
          {!isSent && (
            <p>
              {t('remembered')}{' '}
              <Link href="/login" className="font-medium text-sky-600 hover:underline">
                {t('backToLogin')}
              </Link>
            </p>
          )}
          {isSent && (
            <Button variant="ghost" className="text-sky-600" onClick={() => setIsSent(false)}>
              {t('tryAnother')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
