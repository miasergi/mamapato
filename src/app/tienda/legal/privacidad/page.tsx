import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Mamá Pato',
  description: 'Información sobre el tratamiento de datos personales en Mamá Pato.',
  robots: { index: false },
}

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Política de Privacidad</h1>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Identidad:</strong> Mamá Pato</li>
        <li><strong>Dirección:</strong> Benicarló, Castellón</li>
        <li><strong>Email:</strong> hola@mamapatodebebes.com</li>
      </ul>

      <h2>2. Datos que recopilamos</h2>
      <p>Podemos recopilar los siguientes datos personales:</p>
      <ul>
        <li>Nombre y apellidos</li>
        <li>Teléfono y correo electrónico</li>
        <li>Datos de navegación (a través de cookies técnicas)</li>
      </ul>

      <h2>3. Finalidad y base legal</h2>
      <table>
        <thead>
          <tr><th>Finalidad</th><th>Base legal</th></tr>
        </thead>
        <tbody>
          <tr><td>Gestión de listas de nacimiento</td><td>Consentimiento del interesado</td></tr>
          <tr><td>Atención al cliente (WhatsApp/teléfono)</td><td>Interés legítimo / consentimiento</td></tr>
          <tr><td>Envío de comunicaciones comerciales</td><td>Consentimiento previo y expreso</td></tr>
        </tbody>
      </table>

      <h2>4. Conservación de datos</h2>
      <p>
        Los datos se conservarán durante el tiempo necesario para la finalidad para la que se
        recabaron y, en todo caso, mientras no solicite su supresión, con los plazos mínimos
        legalmente establecidos.
      </p>

      <h2>5. Derechos de los interesados</h2>
      <p>
        Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad dirigiéndose por escrito a hola@mamapatodebebes.com, adjuntando copia de su DNI.
      </p>
      <p>
        Si considera que el tratamiento no es adecuado, puede presentar una reclamación ante la
        Agencia Española de Protección de Datos (www.aepd.es).
      </p>

      <h2>6. Transferencias internacionales</h2>
      <p>
        No se realizan transferencias internacionales de datos. Los servicios utilizados (hosting,
        base de datos) cuentan con garantías adecuadas conforme al RGPD.
      </p>

      <p className="text-sm text-gray-400 mt-8">Última actualización: abril 2026</p>
    </div>
  )
}
