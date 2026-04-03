import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Envíos y Devoluciones | Mamá Pato',
  description: 'Política de envíos y devoluciones de Mamá Pato. Envíos en 24-48h, 30 días para devolver.',
}

export default function EnviosDevolicionesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Envíos y Devoluciones</h1>

      <h2>Envíos</h2>

      <h3>Plazos de entrega</h3>
      <table>
        <thead>
          <tr><th>Destino</th><th>Plazo</th><th>Coste</th></tr>
        </thead>
        <tbody>
          <tr><td>Península</td><td>24 – 48 h laborables</td><td>Gratis a partir de 60 €</td></tr>
          <tr><td>Baleares</td><td>2 – 4 días laborables</td><td>Consultar</td></tr>
          <tr><td>Canarias, Ceuta, Melilla</td><td>3 – 5 días laborables</td><td>Consultar</td></tr>
          <tr><td>Recogida en tienda (Benicarló)</td><td>Disponible en 2 h</td><td>Gratis</td></tr>
        </tbody>
      </table>

      <p>
        Los pedidos realizados antes de las 14:00 h en días laborables se procesan el mismo día.
        Los pedidos recibidos en fin de semana se procesan el lunes siguiente.
      </p>

      <h3>Incidencias con el envío</h3>
      <p>
        Si tu paquete llega dañado o no ha llegado en el plazo estimado, contáctanos por WhatsApp
        o email y lo gestionamos de inmediato.
      </p>

      <h2>Devoluciones</h2>

      <h3>Derecho de desistimiento</h3>
      <p>
        Conforme al Real Decreto Legislativo 1/2007 (TRLGDCU), tienes <strong>30 días naturales</strong> desde
        la recepción del pedido para devolver cualquier artículo sin necesidad de justificación.
      </p>

      <h3>Condiciones</h3>
      <ul>
        <li>El producto debe estar en perfecto estado, sin usar y con su embalaje original.</li>
        <li>Incluye todos los accesorios, manuales y documentación original.</li>
        <li>Los artículos de higiene (sacaleches, etc.) <strong>no son retornables</strong> por razones sanitarias si han sido abiertos.</li>
      </ul>

      <h3>¿Cómo devolver?</h3>
      <ol>
        <li>Contáctanos en hola@mamapatodebebes.com o por WhatsApp indicando tu pedido y el motivo.</li>
        <li>Te facilitaremos la etiqueta de recogida o podrás traer el artículo a nuestra tienda de Benicarló.</li>
        <li>Una vez recibido y comprobado el estado, procesaremos el reembolso en 5 – 7 días hábiles.</li>
      </ol>

      <h3>Productos defectuosos o incorrectos</h3>
      <p>
        Si recibes un artículo defectuoso o diferente al pedido, nos hacemos cargo de los gastos de
        envío de la devolución. Contáctanos en las primeras 48 h desde la recepción.
      </p>

      <h2>Garantías</h2>
      <p>
        Todos nuestros productos cuentan con la garantía legal de 3 años para consumidores
        (conforme a la Directiva EU 2019/771, vigente desde el 1 de enero de 2022).
      </p>

      <p className="text-sm text-gray-400 mt-8">Última actualización: abril 2026</p>
    </div>
  )
}
