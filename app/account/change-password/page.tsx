import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function ChangePasswordPage() {
    const t = useTranslations('ChangePassword')
    const { logout } = useAuth()
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (form.newPassword !== form.confirmPassword) {
            toast.error(t('passwordsDoNotMatch'))
            return
        }
        setLoading(true)
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || t('unknownError'))
            toast.success(t('passwordChanged'))
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : t('unknownError'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="currentPassword">
                        {t('currentPassword')}
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        required
                        autoComplete="current-password"
                        value={form.currentPassword}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="newPassword">
                        {t('newPassword')}
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        required
                        autoComplete="new-password"
                        value={form.newPassword}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                        {t('confirmPassword')}
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 transition"
                >
                    {loading ? t('updating') : t('update')}
                </button>
            </form>
            <hr className="my-6" />
            <button
                onClick={logout}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
                {t('logout')}
            </button>
        </div>
    )
}
