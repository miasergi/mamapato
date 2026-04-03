import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | Mamá Pato',
  robots: { index: false },
}

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Política de Cookies</h1>

      <p>
        Este sitio web utiliza cookies. A continuación te explicamos qué son, qué tipos usamos
        y cómo puedes gestionarlas.
      </p>

      <h2>¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando
        visitas un sitio web. Permiten recordar tus preferencias y mejorar tu experiencia de
        navegación.
      </p>

      <h2>Cookies que utilizamos</h2>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Tipo</th>
            <th>Finalidad</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>cookie_consent</code></td>
            <td>Técnica</td>
            <td>Guarda tu elección sobre el consentimiento de cookies</td>
            <td>1 año</td>
          </tr>
          <tr>
            <td><code>demo_session</code></td>
            <td>Técnica</td>
            <td>Mantiene la sesión de administración activa</td>
            <td>Sesión</td>
          </tr>
        </tbody>
      </table>

      <p>Actualmente <strong>no utilizamos</strong> cookies de análisis ni de publicidad.</p>

      <h2>Cómo gestionar las cookies</h2>
      <p>
        Puedes configurar tu navegador para rechazar o eliminar cookies. A continuación, los
        enlaces de configuración de los navegadores más comunes:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      <p>
        Ten en cuenta que deshabilitar las cookies técnicas puede afectar al funcionamiento
        correcto del sitio.
      </p>

      <p className="text-sm text-gray-400 mt-8">Última actualización: abril 2026</p>
    </div>
  )
}
