import Link from 'next/link'
import { Facebook, Linkedin, Mail, MessageCircle, Music2, Phone, Globe } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="relative border-t border-zinc-100 bg-white text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-primary">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">E</div>
              <span>Execly.</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              Plateforme de services digitaux structurée pour étudiants et jeunes professionnels.
            </p>
            <div className="space-y-3 text-sm text-zinc-500">
              <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Lomé, Togo</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +228 90 00 00 00</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contact@execly.app</p>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-900">Navigation</h3>
            <ul className="space-y-3 text-sm font-medium text-zinc-500">
              <li><Link href="/browse" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Tarifs</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-900">Social</h3>
            <ul className="space-y-3 text-sm font-medium text-zinc-500">
              <li><a href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><Facebook className="h-4 w-4 text-primary" /> Facebook</a></li>
              <li><a href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><Linkedin className="h-4 w-4 text-primary" /> LinkedIn</a></li>
              <li><a href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><MessageCircle className="h-4 w-4 text-primary" /> WhatsApp</a></li>
              <li><a href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><Music2 className="h-4 w-4 text-primary" /> TikTok</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-900">Légal</h3>
            <ul className="space-y-3 text-sm font-medium text-zinc-500">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Conditions générales</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Gestion des cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-100 pt-8 text-center">
          <p className="text-xs font-medium tracking-widest text-zinc-400">
            © {new Date().getFullYear()} EXECLY TECHNOLOGY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}
