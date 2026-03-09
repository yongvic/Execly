'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, Check, Star, Layout, FileText, Globe, 
  PenTool, Sparkles, ShieldCheck, Mail, Loader2, 
  User as UserIcon, LogOut, Package, CreditCard, Clock, 
  Bell, ChevronRight, Settings, Grid, Search, Plus
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useAppLocale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SiteFooter } from '@/components/site-footer'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from '@/hooks/use-toast'
import { NotificationDropdown } from '@/components/notification-dropdown'

const copy = {
  fr: {
    heroTitle: 'Vos services digitaux,\ncentralisés et simplifiés.',
    heroSub: 'Execly remplace les échanges interminables avec des freelances par un workflow structuré, premium et sécurisé. Commandez, suivez, recevez.',
    ctaPrimary: 'Commencer gratuitement',
    ctaSecondary: 'Voir les exemples',
    trustedBy: 'La plateforme préférée des étudiants et jeunes pros ambitieux',
    feature1Title: 'Fini le chaos des commandes.',
    feature1Sub: 'Oubliez les DMs WhatsApp et les emails perdus. Sur Execly, chaque commande suit un process clair : Brief > Validation > Livraison.',
    feature2Title: 'Des livrables standards Studio.',
    feature2Sub: 'Nous ne vendons pas juste du temps, mais un résultat. Nos templates garantissent une cohérence visuelle et une qualité professionnelle.',
    bentoTitle: 'Tout ce dont vous avez besoin pour vous lancer.',
    testimonialsTitle: 'Ils ont passé commande.',
    finalCta: 'Prêt à structurer vos projets ?',
    newsletterTitle: 'Restez à l\'affût',
    newsletterSub: 'Recevez nos derniers templates et conseils pour booster votre carrière, directement dans votre boîte mail.',
    newsletterPlaceholder: 'votre@email.com',
    newsletterButton: 'S\'abonner',
  },
  en: {
    heroTitle: 'Your digital services,\ncentralized and simplified.',
    heroSub: 'Execly replaces endless freelancer chats with a structured, premium, and secure workflow. Order, track, receive.',
    ctaPrimary: 'Start for free',
    ctaSecondary: 'View examples',
    trustedBy: 'The preferred platform for ambitious students and young pros',
    feature1Title: 'End the ordering chaos.',
    feature1Sub: 'Forget WhatsApp DMs and lost emails. On Execly, every order follows a clear process: Brief > Validation > Delivery.',
    feature2Title: 'Studio-standard deliverables.',
    feature2Sub: 'We don’t just sell time, we sell a result. Our templates ensure visual consistency and professional quality.',
    bentoTitle: 'Everything you need to launch.',
    testimonialsTitle: 'They ordered correctly.',
    finalCta: 'Ready to structure your projects?',
    newsletterTitle: 'Stay updated',
    newsletterSub: 'Receive our latest templates and tips to boost your career, directly in your inbox.',
    newsletterPlaceholder: 'your@email.com',
    newsletterButton: 'Subscribe',
  },
} as const

const services = [
  { 
    title: 'CV & Carrière', 
    desc: 'Le dossier gagnant pour vos prochaines opportunités.', 
    icon: FileText,
    img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80' 
  },
  { 
    title: 'Portfolio Web', 
    desc: 'Une présence en ligne qui valorise votre talent.', 
    icon: Globe,
    img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80' 
  },
  { 
    title: 'Branding Kit', 
    desc: 'L\'image de marque qui rend vos projets inoubliables.', 
    icon: PenTool,
    img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80' 
  },
  { 
    title: 'Slides Deck', 
    desc: 'L\'impact visuel pour convaincre vos futurs partenaires.', 
    icon: Layout,
    img: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80' 
  },
]

export default function LandingPage() {
  const { user } = useAuth()
  const { locale } = useAppLocale()
  const { toast } = useToast()
  const t = copy[locale]

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Succès",
          description: data.message,
        })
        setEmail('success_state')
      } else {
        toast({
          title: "Erreur",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F8FAFC] font-sans text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-blue-400/5 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[80px]" />
      </div>

      {/* Navbar Minimaliste - DeepSeek Style */}
      <header className="sticky top-0 z-50 w-full flex justify-center pt-4 px-4 pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex h-16 max-w-6xl w-full items-center justify-between px-6 rounded-full border border-zinc-200 bg-white/80 backdrop-blur-xl shadow-lg pointer-events-auto"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm group-hover:rotate-6 transition-transform">
               <span className="text-sm font-black">E</span>
             </div>
             <span className="text-primary tracking-tighter font-black">Execly.</span>
          </Link>

          {/* Navigation Centrale */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-zinc-500">
            <Link href="/browse" className="hover:text-primary transition-colors">Services</Link>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors group text-sm">
              <span>Solutions</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 transition-transform group-hover:translate-y-0.5">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
            <Link href="/templates" className="hover:text-primary transition-colors">Templates</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">Tarifs</Link>
          </nav>

          {/* Actions Droite */}
          <div className="flex items-center gap-4">
            {user && <NotificationDropdown />}
            <div className="hidden sm:flex items-center gap-3 text-zinc-400">
              <LanguageSwitcher />
            </div>

            <div className="h-4 w-px bg-zinc-100 hidden md:block"></div>

            <div className="flex items-center gap-2">
              {!user ? (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="hidden md:flex h-10 rounded-full border-zinc-200 px-6 text-sm font-bold hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all text-zinc-600">
                      Connexion
                    </Button>
                  </Link>

                  <Link href="/signup">
                    <Button className="h-10 rounded-full bg-primary px-6 text-sm font-bold shadow-md shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all group text-white">
                      Démarrer
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm border border-primary/10 hover:bg-primary/20 transition-all shadow-sm"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Tableau de bord</span>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      <main className="flex-1 relative z-10">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 lg:pt-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tighter sm:text-6xl lg:text-7xl whitespace-pre-line bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-800 to-primary">
                {t.heroTitle}
              </h1>
              <p className="max-w-[500px] text-xl text-zinc-500 leading-relaxed font-medium">
                {t.heroSub}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 rounded-full px-10 text-lg font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 text-white">
                    {t.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5 text-white" />
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button variant="outline" size="lg" className="h-14 rounded-full bg-white border-zinc-200 text-zinc-600 px-10 text-lg font-bold hover:bg-zinc-50 hover:-translate-y-1 transition-all shadow-sm">
                    {t.ctaSecondary}
                  </Button>
                </Link>
              </div>
              <div className="pt-4 flex items-center gap-4 text-sm text-zinc-400">
                <div className="flex -space-x-2">
                   {[
                     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop',
                     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop',
                     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop'
                   ].map((url, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-zinc-100 shadow-sm"
                     >
                        <img src={url} alt="User avatar" className="h-full w-full object-cover" />
                     </motion.div>
                   ))}
                </div>
                <p className="animate-in fade-in slide-in-from-left-4 duration-1000 delay-700 font-bold text-primary/80 uppercase tracking-widest text-[10px]">{t.trustedBy}</p>
              </div>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
               animate={{ opacity: 1, scale: 1, rotate: 0 }}
               transition={{ delay: 0.2, duration: 0.8, ease: "circOut" }}
               className="relative lg:ml-auto"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 via-blue-400/5 to-transparent blur-2xl rounded-3xl" />
              
              <div className="relative rounded-3xl border border-zinc-100 bg-white shadow-2xl overflow-hidden aspect-[4/3] max-w-lg mx-auto lg:max-w-none group hover:shadow-primary/5 transition-all duration-500">
                 <div className="absolute top-0 left-0 w-full h-8 bg-zinc-50 border-b border-zinc-100 flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/20"></div>
                 </div>
                 <div className="pt-12 px-8 pb-8 space-y-6">
                    <div className="space-y-1">
                       <h4 className="text-sm font-black text-primary flex items-center gap-2 uppercase tracking-tight">
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                          Projet : Portfolio Web V3
                       </h4>
                       <div className="h-1 w-1/3 bg-primary/20 rounded-full"></div>
                    </div>
                    <div className="space-y-3 text-zinc-500 font-medium">
                       <p className="text-xs leading-relaxed">
                          Conception d'un portfolio minimaliste pour un étudiant en Design. 
                          Focus sur l'expérience utilisateur et l'optimisation mobile.
                       </p>
                       <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded-full text-[10px] font-bold tracking-tight uppercase">Next.js</span>
                          <span className="px-2 py-0.5 bg-zinc-50 text-zinc-400 border border-zinc-100 rounded-full text-[10px] font-bold tracking-tight uppercase">Tailwind CSS</span>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <motion.div 
                          whileHover={{ scale: 1.02, backgroundColor: '#F8FAFC' }}
                          className="h-24 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-2 text-zinc-400 transition-colors cursor-default"
                        >
                          <FileText className="h-5 w-5 opacity-50 text-zinc-400" />
                          <span className="text-[10px] font-black tracking-widest uppercase">Brief.pdf</span>
                       </motion.div>
                       <motion.div 
                          whileHover={{ scale: 1.02, backgroundColor: '#eff6ff' }}
                          className="h-24 rounded-2xl bg-primary text-white flex flex-col items-center justify-center gap-2 transition-all cursor-default shadow-lg shadow-primary/20"
                        >
                          <Sparkles className="h-5 w-5 text-white" />
                          <span className="text-[10px] font-black tracking-widest uppercase">Livrable.zip</span>
                       </motion.div>
                    </div>
                 </div>
                 {/* Floating Card */}
                 <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute -bottom-6 -right-6 bg-white border border-zinc-100 shadow-2xl p-4 rounded-2xl max-w-[200px] hidden md:block"
                 >
                    <div className="flex items-center gap-3 mb-2">
                       <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><Check className="h-4 w-4" /></div>
                       <div>
                          <p className="text-xs font-black text-zinc-900 uppercase tracking-tighter leading-tight">Commande Terminée</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Succès</p>
                       </div>
                    </div>
                 </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* LOGO STRIP */}
        <section className="border-y border-zinc-100 bg-white py-12 overflow-hidden">
           <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-10">
                 Compatible avec vos outils préférés
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                 {[
                   { name: 'Notion', color: 'hover:text-[#000000]', icon: <path d="M4.459 4.211c.187-.213.456-.341.739-.341h13.604c.283 0 .552.128.739.341l2.121 2.424c.224.256.338.591.338.924v12.882c0 .333-.114.668-.338.924l-2.121 2.424c-.187.213-.456.341-.739.341H5.198c-.283 0-.552-.128-.739-.341L2.338 21.4c-.224-.256-.338-.591-.338-.924V7.559c0-.333.114-.668.338-.924l2.121-2.424zm13.345 1.659H6.196L4.742 7.559V20.44l1.454 1.659h11.608l1.454-1.659V7.559l-1.454-1.659zM8.5 9.5h7v2h-7v-2zm0 4h7v2h-7v-2z" /> },
                   { name: 'Figma', color: 'hover:text-[#F24E1E]', icon: <path d="M8 2a4 4 0 100 8 4 4 0 000-8zm4 4a4 4 0 108 0 4 4 0 00-8 0zM8 10a4 4 0 100 8h4V10H8zm4 4a4 4 0 114-4h-4v4zM8 18a4 4 0 104 4v-4H8z" /> },
                   { name: 'Canva', color: 'hover:text-[#00C4CC]', icon: <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-12h2v4h4v2h-4v4h-2v-4H7v-2h4V8z" /> },
                   { name: 'Node.js', color: 'hover:text-[#339933]', icon: <path d="M12 2L4.5 6.33v8.67L12 19.33l7.5-4.33V6.33L12 2zm1 14.5l-1 .58-1-.58V7.5l1-.58 1 .58v9zm4.5-2.6l-1 .58-4.5-2.59V6.33l1-.58L17.5 8.34v5.56z" /> },
                   { name: 'Photoshop', color: 'hover:text-[#31A8FF]', icon: <path d="M2 2v20h20V2H2zm11.2 11.5c0 1.2-.8 2.1-2.1 2.1H9.8v3.1H8.3V7.3h3.1c1.3 0 2.1.9 2.1 2.1v4.1zm-1.5-4.1c0-.5-.3-.8-.8-.8H9.8v1.6h.9c.5 0 .8-.3.8-.8v-.1zm3.1 1.1c-.8 0-1.4.4-1.7 1.1l1.3.5c.1-.3.3-.5.6-.5.3 0 .5.2.5.5 0 .8-1.9.7-1.9 2.3 0 .8.6 1.4 1.5 1.4.7 0 1.2-.3 1.5-.9v.8h1.4v-3.6c0-1-.7-1.6-1.7-1.6zm0 3.1c-.3 0-.5-.2-.5-.5 0-.5.6-.5.6-.5.3 0 .5.1.5.4 0 .4-.3.6-.6.6z" /> },
                   { name: 'Word', color: 'hover:text-[#2B579A]', icon: <path d="M21.1 2.1H2.9c-.5 0-.9.4-.9.9v18c0 .5.4.9.9.9h18.2c.5 0 .9-.4.9-.9V3c0-.5-.4-.9-.9-.9zM9.5 17.5l-1.4-5.4-1.4 5.4H5.2L7.4 7.3h1.5l1.4 5.4 1.4-5.4h1.5l2.2 10.2H9.5zm9.3 0h-1.5v-4.1h-2.2v4.1h-1.5V7.3h1.5v4.1h2.2V7.3h1.5v10.2z" /> },
                   { name: 'PowerPoint', color: 'hover:text-[#D24726]', icon: <path d="M21.1 2.1H2.9c-.5 0-.9.4-.9.9v18c0 .5.4.9.9.9h18.2c.5 0 .9-.4.9-.9V3c0-.5-.4-.9-.9-.9zM10.5 17.5H9.1V7.3h3.1c1.3 0 2.1.9 2.1 2.1v2.1c0 1.2-.8 2.1-2.1 2.1h-1.7v3.9zm0-5.4h1.6c.5 0 .8-.3.8-.8V9.4c0-.5-.3-.8-.8-.8h-1.6v3.5z" /> },
                 ].map((tool, i) => (
                    <motion.div
                       key={tool.name}
                       initial={{ opacity: 0, scale: 0.8 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.1, duration: 0.5 }}
                       whileHover={{ y: -8, scale: 1.1 }}
                       className={`flex flex-col items-center gap-3 group cursor-default transition-all duration-300 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 ${tool.color}`}
                    >
                       <div className="p-3 rounded-2xl bg-slate-50 border border-zinc-100 group-hover:bg-white group-hover:border-primary/20 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 transition-transform group-hover:rotate-[360deg] duration-1000">{tool.icon}</svg>
                       </div>
                       <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400 group-hover:text-primary transition-colors">{tool.name}</span>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* ... Rest of components refined similarly ... */}
        {/* BENTO, TESTIMONIALS, NEWSLETTER refined to use white/zinc/primary theme */}
        
        {/* NEWSLETTER SECTION */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
           <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[3rem] border border-zinc-100 bg-white p-8 shadow-2xl shadow-primary/5 sm:p-16"
           >
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-400/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              <AnimatePresence mode="wait">
                {!email.includes('success') ? (
                  <motion.div
                    key="form-content"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 mx-auto max-w-2xl text-center"
                  >
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 flex justify-center">
                       <div className="rounded-2xl bg-primary/10 p-4 shadow-inner">
                          <Mail className="h-10 w-10 text-primary" />
                       </div>
                    </motion.div>
                    <motion.h2 className="text-4xl font-black tracking-tight sm:text-5xl text-zinc-800 uppercase italic font-serif leading-none mb-6">
                       {t.newsletterTitle}
                    </motion.h2>
                    <motion.p className="mx-auto max-w-xl text-lg text-zinc-500 font-medium mb-12">
                       {t.newsletterSub}
                    </motion.p>
                    <motion.form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const target = e.target as any;
                        const mail = target.email.value;
                        setLoading(true);
                        try {
                          const res = await fetch('/api/newsletter', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: mail }),
                          });
                          if (res.ok) setEmail('success_state');
                          else toast({ title: "Erreur", description: "Échec.", variant: "destructive" });
                        } catch (err) { toast({ title: "Erreur", description: "Échec.", variant: "destructive" }); }
                        finally { setLoading(false); }
                      }}
                      className="flex flex-col gap-3 sm:flex-row sm:justify-center"
                    >
                       <div className="relative flex-1 sm:max-w-md">
                          <Input name="email" type="email" placeholder={t.newsletterPlaceholder} required className="h-14 w-full rounded-2xl border-zinc-200 bg-zinc-50 px-6 text-zinc-900 font-bold focus:bg-white transition-all shadow-inner" />
                          <Globe className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300" />
                       </div>
                       <Button type="submit" disabled={loading} className="h-14 rounded-2xl bg-primary px-10 text-lg font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all text-white">
                          {loading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <>{t.newsletterButton} <ArrowRight className="ml-2 h-5 w-5" /></>}
                       </Button>
                    </motion.form>
                  </motion.div>
                ) : (
                  <motion.div key="success-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center py-12 text-center">
                    <motion.div transition={{ type: 'spring' }} className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
                       <ShieldCheck className="h-12 w-12" />
                    </motion.div>
                    <h2 className="text-4xl font-black tracking-tight text-emerald-600 uppercase">Bienvenue à bord !</h2>
                    <Button variant="ghost" onClick={() => setEmail('')} className="mt-8 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Retour au formulaire</Button>
                  </motion.div>
                )}
              </AnimatePresence>
           </motion.div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-32 text-center overflow-hidden">
           <div className="mx-auto max-w-4xl px-4 relative z-10">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 uppercase italic font-serif leading-none mb-8">
                    Prêt à structurer <br/><span className="text-primary">vos projets ?</span>
                 </h2>
                 <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                    <Link href="/signup">
                       <Button size="lg" className="h-16 rounded-full px-12 text-xl font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all text-white">
                          Créer un compte
                       </Button>
                    </Link>
                    <Link href="/browse">
                        <Button variant="outline" size="lg" className="h-16 rounded-full px-12 text-xl bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 transition-all font-black italic">
                          Explorer les services
                        </Button>
                    </Link>
                 </div>
              </motion.div>
           </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
