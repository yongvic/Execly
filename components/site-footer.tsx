import Link from 'next/link'
import { motion } from 'framer-motion'
import { Linkedin, Facebook, MessageCircle, Music2, Mail, Phone, Globe } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="relative bg-white text-zinc-900 overflow-hidden border-t border-zinc-100">
      {/* GLOBAL SECTION (Experience Superior Style) */}
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-50 border border-zinc-100 p-12 mb-24 shadow-sm">
           {/* Animated Globe Container */}
           <div className="absolute top-1/2 -right-24 -translate-y-1/2 w-[400px] h-[400px] opacity-20 hidden lg:block">
              <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                 className="relative w-full h-full"
              >
                 {/* Dotted Globe SVG */}
                 <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 2" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 3" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 4" />
                    {/* Dots representing data points */}
                    {[...Array(20)].map((_, i) => (
                       <circle 
                          key={i}
                          cx={50 + 35 * Math.cos(i * Math.PI / 10)} 
                          cy={50 + 35 * Math.sin(i * Math.PI / 10)} 
                          r="0.8" 
                          fill="currentColor" 
                          className="animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                       />
                    ))}
                 </svg>
              </motion.div>
           </div>

           <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-zinc-800">
                 Vivez l'expérience <span className="text-primary italic font-serif">premium</span>.
              </h2>
              <p className="text-xl text-zinc-500 mb-10 leading-relaxed">
                 +1000 étudiants nous font confiance pour leurs projets académiques et professionnels.
              </p>
              <Link href="/signup">
                 <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                 >
                    Commencer maintenant
                 </motion.button>
              </Link>
           </div>
        </div>

        {/* FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
           <div className="space-y-8">
              <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-primary">
                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">E</div>
                 <span>Execly.</span>
              </Link>
              <div className="space-y-4 text-zinc-500 text-sm">
                 <p className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-primary" />
                    Lomé, Togo - Afrique de l'Ouest
                 </p>
                 <p className="flex items-center gap-3 group cursor-pointer">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="group-hover:text-primary transition-colors">+228 90 00 00 00</span>
                 </p>
                 <p className="flex items-center gap-3 group cursor-pointer">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="group-hover:text-primary transition-colors">contact@execly.app</span>
                 </p>
              </div>
           </div>

           <div>
              <h3 className="text-zinc-900 font-bold mb-8 tracking-widest uppercase text-xs">Navigation</h3>
              <ul className="space-y-4 text-zinc-500 text-sm font-medium">
                 <li><Link href="/browse" className="hover:text-primary transition-colors">Services</Link></li>
                 <li><Link href="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
                 <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                 <li><Link href="/about" className="hover:text-primary transition-colors">À propos</Link></li>
                 <li><Link href="/support" className="hover:text-primary transition-colors">FAQ / Support</Link></li>
              </ul>
           </div>

           <div>
              <h3 className="text-zinc-900 font-bold mb-8 tracking-widest uppercase text-xs">Social</h3>
              <ul className="space-y-4 text-zinc-500 text-sm font-medium">
                 <li>
                    <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors group">
                       <Facebook className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" /> Facebook
                    </a>
                 </li>
                 <li>
                    <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors group">
                       <Linkedin className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" /> LinkedIn
                    </a>
                 </li>
                 <li>
                    <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors group">
                       <MessageCircle className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" /> WhatsApp
                    </a>
                 </li>
                 <li>
                    <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors group">
                       <Music2 className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" /> TikTok
                    </a>
                 </li>
              </ul>
           </div>

           <div>
              <h3 className="text-zinc-900 font-bold mb-8 tracking-widest uppercase text-xs">Légal</h3>
              <ul className="space-y-4 text-zinc-500 text-sm font-medium">
                 <li><Link href="/terms" className="hover:text-primary transition-colors">Conditions générales</Link></li>
                 <li><Link href="/privacy" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
                 <li><Link href="/cookies" className="hover:text-primary transition-colors">Gestion des cookies</Link></li>
              </ul>
           </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-zinc-400 text-xs tracking-widest font-medium">
              © {new Date().getFullYear()} EXECLY TECHNOLOGY. ALL RIGHTS RESERVED.
           </p>
           <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-zinc-300">
              <span className="hover:text-primary transition-colors cursor-default">AFRICA</span>
              <span className="hover:text-primary transition-colors cursor-default">EUROPE</span>
              <span className="hover:text-primary transition-colors cursor-default">GLOBAL</span>
           </div>
        </div>
      </div>

      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-primary/[0.03] blur-[120px] rounded-full pointer-events-none" />
    </footer>
  )
}
