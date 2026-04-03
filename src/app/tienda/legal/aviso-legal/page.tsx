import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal | Mamá Pato',
  description: 'Información legal sobre Mamá Pato, tienda de productos para bebés en Benicarló.',
  robots: { index: false },
}

export default function AvisoLegalPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Aviso Legal</h1>

      <h2>1. Datos del titular</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad
        de la Información y de Comercio Electrónico (LSSI-CE), se informa:
      </p>
      <ul>
        <li><strong>Denominación social:</strong> Mamá Pato</li>
        <li><strong>Domicilio:</strong> Benicarló, Castellón (España)</li>
        <li><strong>Teléfono:</strong> +34 600 000 000</li>
        <li><strong>Email:</strong> hola@mamapatodebebes.com</li>
        <li><strong>Actividad:</strong> Venta de artículos de puericultura y accesorios para bebés</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        El presente Aviso Legal regula el uso del sitio web accesible en el dominio
        mamapatodebebes.com y sus subdominios (en adelante, "el Sitio Web"), que Mamá Pato pone a
        disposición de los usuarios de Internet.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y uso del Sitio Web atribuye la condición de usuario e implica la aceptación plena
        y sin reservas de todas las disposiciones incluidas en este Aviso Legal. El usuario se compromete
        a hacer un uso correcto del Sitio Web conforme a la legislación vigente, a las buenas costumbres
        y al orden público.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos del Sitio Web (textos, imágenes, marcas, logotipos, etc.) son propiedad
        de Mamá Pato o de terceros que han autorizado su uso. Queda prohibida la reproducción total o
        parcial sin autorización expresa del titular.
      </p>

      <h2>5. Exclusión de responsabilidad</h2>
      <p>
        Mamá Pato no se hace responsable de los daños que pudieran ocasionarse por la interrupción,
        defecto o fallo en el acceso al Sitio Web, ni por la existencia de virus o elementos maliciosos
        en los contenidos.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Este Aviso Legal se rige por la legislación española. Para la resolución de cualquier controversia
        que pudiera surgir de su interpretación o aplicación, las partes se someten a los juzgados y
        tribunales de Castellón, salvo que la ley obligue a fuero distinto.
      </p>

      <p className="text-sm text-gray-400 mt-8">Última actualización: abril 2026</p>
    </div>
  )
}
