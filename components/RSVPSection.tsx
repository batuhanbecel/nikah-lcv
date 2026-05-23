'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import toast from 'react-hot-toast'

const RSVP_ENDPOINT = '/api/rsvp'

interface FormState {
  firstName:  string
  lastName:   string
  guestCount: string
  afterParty: boolean
}
const INIT: FormState = { firstName: '', lastName: '', guestCount: '1', afterParty: false }

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function RSVPSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [form,    setForm]    = useState<FormState>(INIT)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('Lütfen adınızı ve soyadınızı giriniz.')
      return
    }
    setLoading(true)
    const toastId = toast.loading('Gönderiliyor…')
    try {
      const res  = await fetch(RSVP_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(), lastName: form.lastName.trim(),
          guestCount: Number(form.guestCount) || 1, afterParty: form.afterParty,
        }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Teşekkürler! Katılımınız kaydedildi.', { id: toastId })
        setForm(INIT)
      } else { throw new Error(json.message ?? 'Bilinmeyen hata') }
    } catch (err) {
      console.error(err)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.', { id: toastId })
    } finally { setLoading(false) }
  }

  return (
    <section ref={ref} id="rsvp" className="relative py-32 px-6 overflow-hidden">

      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #FFFEF9, transparent)' }} />

      {/* Soft blush glow — gives this section a slightly different warmth without a hard edge */}
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(243,232,255,0.50) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-20 -left-20 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(237,233,254,0.45) 0%, transparent 70%)' }} />

      {/* Bottom fade into footer */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FFFEF9, transparent)' }} />

      <div className="relative z-10 max-w-md mx-auto flex flex-col gap-12">

        {/* Heading */}
        <div className="flex flex-col items-center gap-5">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="font-dm text-[10px] uppercase tracking-ultrawide text-plum-500">
            Katılım Bildirimi
          </motion.p>
          <motion.hr custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="rule-plum w-20" />
          <motion.h2 custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="font-cormorant font-light text-plum-900 text-center"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)' }}>
            Bizi Onurlandırır mısınız?
          </motion.h2>
          <motion.p custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="font-dm text-[12px] text-plum-500 text-center leading-relaxed tracking-wide max-w-xs">
            Törenimizde sizi görmekten mutluluk duyarız.<br />
            Lütfen aşağıdaki formu doldurunuz.
          </motion.p>
        </div>

        {/* Form card */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="glass rounded-3xl p-8 sm:p-10 shadow-2xl shadow-plum-200/40">
          <form onSubmit={handleSubmit} className="flex flex-col gap-9" noValidate>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-5">
              {(['firstName', 'lastName'] as const).map((field, i) => (
                <div key={field} className="flex flex-col gap-2">
                  <label htmlFor={field}
                    className="font-dm text-[9px] uppercase tracking-superwide text-plum-500">
                    {i === 0 ? 'Ad' : 'Soyad'}
                  </label>
                  <input
                    id={field} name={field} type="text"
                    autoComplete={i === 0 ? 'given-name' : 'family-name'}
                    required value={form[field]} onChange={handleChange}
                    className="form-input"
                    placeholder={i === 0 ? 'Adınız' : 'Soyadınız'}
                  />
                </div>
              ))}
            </div>

            {/* Guest count */}
            <div className="flex flex-col gap-2">
              <label htmlFor="guestCount"
                className="font-dm text-[9px] uppercase tracking-superwide text-plum-500">
                Misafir Sayısı
              </label>
              <input
                id="guestCount" name="guestCount" type="number" min="1" max="10"
                value={form.guestCount} onChange={handleChange}
                className="form-input" placeholder="1"
              />
            </div>

            {/* After party toggle */}
            <div className="flex items-center justify-between gap-4 py-3 border-b-2 border-plum-100">
              <div className="flex flex-col gap-1">
                <span className="font-dm text-[9px] uppercase tracking-superwide text-plum-500">
                  After Party
                </span>
                <span className="font-dm text-[11px] text-plum-400 leading-relaxed">
                  Nikah sonrası kutlamaya katılacak mısınız?
                </span>
              </div>
              <button
                type="button" role="switch" aria-checked={form.afterParty}
                onClick={() => setForm(p => ({ ...p, afterParty: !p.afterParty }))}
                className="relative flex-shrink-0 w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400"
                style={{ background: form.afterParty ? 'linear-gradient(135deg,#5B21B6,#A78BFA)' : '#EDE9FE' }}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 rounded-full shadow-md flex items-center justify-center"
                  style={{ left: form.afterParty ? 'calc(100% - 24px)' : '4px', background: form.afterParty ? 'white' : '#C4B5FD' }}
                >
                  {form.afterParty && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 3" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.span>
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="group relative w-full rounded-2xl py-4 font-dm text-[11px] uppercase tracking-superwide
                         text-white font-medium overflow-hidden transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #A78BFA 100%)',
                boxShadow: '0 8px 24px rgba(124,58,237,0.30)',
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                               -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">{loading ? 'Gönderiliyor…' : 'Katılımımı Bildir'}</span>
            </button>

          </form>
        </motion.div>
      </div>
    </section>
  )
}
