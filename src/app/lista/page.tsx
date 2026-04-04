import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Baby, Gift, Heart, Phone, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { BirthListSummary } from '@/types/database'

export const metadata: Metadata = {
  title: 'Lista de Nacimiento · Mamá Pato Benicarló',
  description:
    'Crea tu lista de nacimiento en Mamá Pato, la tienda de bebés de Benicarló. Tus familiares y amigos podrán regalar exactamente lo que necesitas para tu bebé.',
}

const HOW_IT_WORKS = [
  { icon: Baby,  step: '1', title: 'Ven a la tienda',     desc: 'Pásate por Mamá Pato y elige los productos que necesitas para tu bebé.' },
  { icon: Gift,  step: '2', title: 'Creamos tu lista',    desc: 'Registramos tu lista en nuestro sistema y te damos un enlace para compartir.' },
  { icon: Heart, step: '3', title: 'Comparten el enlace', desc: 'Tus familiares y amigos entran a la lista, eligen un regalo y lo reservan.' },
  { icon: Star,  step: '4', title: 'Recógelo en tienda',  desc: 'Pagamos juntos (Bizum / tarjeta) y te llevamos el regalo perfecto.' },
]

export default async function ListaNacimientoPage() {
  const supabase = await createClient()
  const { data: lists } = await supabase
    .from('v_birth_list_summary')
    .select('*')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })

  const activeLists = (lists as BirthListSummary[]) ?? []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Simple header ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/tienda" aria-label="Mamá Pato - Inicio">
            <Image src="/logo.svg" alt="Mamá Pato" width={60} height={48} priority />
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/tienda" className="text-gray-600 hover:text-duck-700 transition-colors font-medium">Tienda</Link>
            <Link href="/lista" className="text-duck-700 font-semibold border-b-2 border-duck-500 pb-0.5">Lista nacimiento</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-duck-100 text-duck-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Lista de nacimiento · Benicarló
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            El regalo perfecto<br />
            <span className="text-duck-600">para tu bebé</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Crea tu lista de nacimiento en Mamá Pato. Tus seres queridos
            podrán elegir exactamente lo que necesitas, sin duplicados y con la confianza
            de una tienda especializada en Benicarló.
          </p>
          <a
            href={`tel:+34964000000`}
            className="inline-flex items-center gap-2 bg-duck-600 hover:bg-duck-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-base"
          >
            <Phone className="w-5 h-5" />
            Llámanos para crear tu lista
          </a>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">¿Cómo funciona?</h2>
            <p className="text-gray-500 mt-2">Sencillo, gratuito y personalizado</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-duck-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-duck-600" />
                </div>
                <span className="text-xs font-bold text-duck-500 uppercase tracking-widest">Paso {step}</span>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active lists (demo) ── */}
      {activeLists.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900">Listas activas</h2>
              <p className="text-gray-500 mt-2">¿Tienes un enlace? Búscalo aquí o pídelos a los papás.</p>
            </div>
            <div className="space-y-4">
              {activeLists.map((list) => (
                <Link
                  key={list.id}
                  href={`/lista/${list.public_slug}`}
                  className="flex items-center gap-4 bg-white rounded-2xl border p-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-duck-100 flex items-center justify-center shrink-0">
                    <Baby className="w-6 h-6 text-duck-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{list.baby_name}</p>
                    <p className="text-sm text-gray-500">{list.parents_display}</p>
                  </div>
                  <span className="text-duck-600 font-semibold text-sm shrink-0">Ver lista →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-duck-700 to-duck-600 rounded-3xl p-8 text-white text-center">
          <Heart className="mx-auto h-8 w-8 mb-4 text-duck-200" />
          <h2 className="text-2xl font-extrabold mb-3">¿Esperáis un bebé?</h2>
          <p className="text-duck-100 mb-6">
            Llámanos o pásate por la tienda en Benicarló y te ayudamos a montar
            la lista perfecta para vuestro bebé, sin coste y sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/34964000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Escríbenos por WhatsApp
            </a>
            <a
              href="tel:+34964000000"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <Phone className="w-5 h-5" />
              Llámanos
            </a>
          </div>
        </div>
      </section>
      {/* ── Footer simple ── */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-sm text-center mt-16">
        <p>© {new Date().getFullYear()} Mamá Pato · Benicarló · <Link href="/tienda/legal/aviso-legal" className="hover:text-white transition-colors">Aviso legal</Link></p>
      </footer>
    </main>
    </div>
  )
}
