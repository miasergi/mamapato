# Mamá Pato · Roadmap de desarrollo

> **Contrato:** 3.000€ fijo + 80€/mes  
> **Plazo:** 2 meses de desarrollo + 1 mes de puesta a punto y formación  
> **Estado:** Post-reunión 14/04/2026 — pendiente de firma

---

## Resumen ejecutivo

| Fase | Contenido principal | Semanas estimadas |
|------|---------------------|-------------------|
| 0 | Preparación, referencias visuales, accesos | 0.5 |
| 1 | Rediseño visual completo (estilo Mamá Pato) | 2 |
| 2 | Mejoras al panel existente | 2.5 |
| 3 | Nuevas secciones: Pedidos + Marketplace | 2 |
| 4 | Tienda pública: carrito + pasarela de pago | 2 |
| 5 | Puesta a punto, formación y lanzamiento | 4 |
| **Total** | | **~13 semanas** |

---

## Fase 0 — Preparación y análisis
**Duración:** ~3 días  
**Objetivo:** Tener todos los accesos, referencias y decisiones técnicas cerradas antes de tocar código.

### Tareas
- [ ] Obtener acceso FTP/hosting actual de mamapatodebebes.com
- [ ] Obtener credenciales de Ontario ERP (para sincronización automática)
- [ ] Recopilar assets de marca: logo, colores exactos, tipografías, fotos de tienda
- [ ] Analizar estructura visual de [mamapatodebebes.com](https://mamapatodebebes.com/) y [bebemalaga.com](https://bebemalaga.com/)
- [ ] Definir paleta de colores y tipografía definitiva del proyecto
- [x] **Pasarela de pago: RedSys TPV virtual + Bizum** ✓
- [x] **Roles de acceso: `Administrador`, `Trabajador`, `Cliente`** (cliente creado, sin acceso al panel por ahora) ✓
- [x] **Dominio desarrollo:** `mamapato.miarquitecto.com` · **Dominio producción:** `mamapatodebebes.com` (migración al lanzar) ✓
- [x] **Blog:** CMS propio para crear artículos; feed de Instagram como contenido inicial; opción de vincular cada artículo a un post de Instagram ✓
- [ ] Confirmar proveedor de hosting y emails transaccionales *(pendiente de datos de acceso del cliente)*

---

## Fase 1 — Rediseño visual completo
**Duración:** ~2 semanas  
**Objetivo:** La plataforma tiene que parecer una continuación natural de mamapatodebebes.com, con referencias a bebemalaga.com en estructura y usabilidad.

### 1.1 Identidad visual
- [ ] Adaptar paleta de colores principal a la marca actual
- [ ] Implementar tipografías del sitio actual (o acordadas en fase 0)
- [ ] Nuevo logo/favicon alineado con la marca
- [ ] Iconografía coherente con el estilo de la tienda

### 1.2 Tienda pública — estructura y navegación
- [ ] **Menú principal con desplegables por tipo de producto**
  - Movilidad, Porteo, Descanso, Baño, Alimentación, Juguetes, Ropa…
  - Sub-categorías dentro de cada tipo
- [ ] Rediseño de la home: heroes, categorías destacadas, novedades, productos estrella
- [ ] Listado de productos con filtros laterales (categoría, precio, edad, estado de stock)
- [ ] Ficha de producto rediseñada: galería de imágenes, descripción, stock, WhatsApp

### 1.3 Secciones públicas nuevas

#### Blog / Novedades
- [ ] Sección blog visible para visitantes
- [ ] **Feed de Instagram** como contenido inicial del blog (embed del perfil público, sin API)
- [ ] **CMS de artículos en el panel:** crear entradas con título, contenido rich-text, imagen destacada y fecha de publicación
- [ ] Opción por artículo: vincular opcionalmente a un post de Instagram (URL del post → se muestra incrustado)
- [ ] Gestión de artículos: listar, editar, publicar/despublicar, eliminar

#### Proveedores en la web pública
- [ ] Página pública de proveedores con imagen, logo y marcas que representan
- [ ] Ficha pública de cada proveedor (opcional: solo nombre + marcas)

### 1.4 Panel de administración — reskin visual
- [ ] Adaptar sidebar, cabecera y componentes al nuevo estilo visual
- [ ] Reordenar el menú del panel:
  - **Quitar del menú principal:** Fichajes, Actividad de usuario
  - **Bajar posición:** Clientes (menos prioritario para el uso diario)
  - **Nueva posición del menú sugerida:**
    1. Dashboard
    2. Listas de deseos *(antes: Listas de nacimiento)*
    3. Pedidos *(nuevo)*
    4. Productos
    5. Proveedores
    6. Vales y Cupones
    7. Mensajes
    8. Marketplace *(nuevo)*
    9. Ontario ERP
    10. Clientes
    11. Sync Ontario
    12. Configuración

---

## Fase 2 — Mejoras al panel existente
**Duración:** ~2.5 semanas  
**Objetivo:** Completar y perfilar todas las secciones ya existentes con las necesidades reales de Mamá Pato.

### 2.1 Listas de deseos *(renombrar + ampliar)*

**Renombrado:** "Listas de nacimiento" → **"Listas de deseos"**

#### Tipos de lista
- [ ] Nueva tipología: `nacimiento`, `cumpleaños 1 año`, `cumpleaños 2 años`, `cumpleaños 3 años`, `otro`
- [ ] Campo de fecha del evento (parto o cumpleaños)

#### Visibilidad y acceso
- [ ] Opción **pública / privada** por lista
  - Pública: accesible con la URL directamente
  - Privada: accesible solo con la URL + PIN o contraseña simple
- [ ] **Botón "Copiar enlace de la lista"** en panel y en la ficha de lista
- [ ] Acceso para los padres con cuenta propia:
  - Los padres pueden ver todos los productos de su lista
  - Los padres ven quién compró qué (info oculta en la vista pública/invitados)
  - Los padres pueden añadir y quitar productos de su lista desde la web
  - **Login con magic link:** el padre recibe un enlace por email — sin contraseña que recordar

#### Gestión de productos en la lista
- [ ] **Añadir productos a la lista** (buscador de catálogo interno) desde el panel
- [ ] **Quitar productos de la lista** desde el panel
- [ ] Estado por producto en la lista:
  - `Disponible` — en catálogo y en stock
  - `Reservado` — alguien lo ha marcado o pagado
  - `Pendiente de pedido` — reservado pero aún no pedido al proveedor
  - `Pedido al proveedor` — solicitado, pendiente de llegada
  - `En camino` — confirmado por el proveedor, en tránsito
  - `Recibido en tienda` — llegó al almacén
  - `Entregado` — entregado al regalante o a los padres

#### Seguimiento de pago por producto
- [ ] Campo de estado de pago: `Sin pagar`, `Señal pagada`, `Pagado`
- [ ] Fecha de pago registrada
- [ ] Opción: **botón a TPV online** para pagar directamente desde la lista (fase 4)
- [ ] Opción: **subir ticket de pago** (imagen/PDF) como confirmación de pago en tienda
- [ ] Quién compró: visible solo para la tienda y para los padres, **oculto en la vista pública**

#### Tracking de stock / pedido al proveedor
- [ ] Vinculación del estado del producto en la lista con el módulo de Pedidos (fase 3)
- [ ] Alerta visual cuando un producto reservado lleva más de X días sin ser pedido al proveedor

#### Formulario de alta de lista mejorado
- [ ] Crear padres directamente desde el formulario de la lista sin ir a Clientes
  - Campo "Mamá" y "Papá" con buscador: si no existe se crea al guardar la lista
- [ ] Selección de tipo de lista y fecha del evento
- [ ] Selección pública/privada
- [ ] Añadir productos directamente al crear la lista (opcional, se puede editar después)

#### Filtros avanzados en el listado de listas
- [ ] Filtrar por: tipo de lista, estado, visibilidad (pública/privada), fecha del evento, mamá/papá

#### Registro propio de padres desde la web
- [ ] Los padres pueden crear su cuenta + lista desde la web pública (formulario sencillo)
- [ ] Las listas creadas desde la web se guardan automáticamente como **borrador** (no visibles en tienda ni en la URL pública aún)
- [ ] La tienda recibe una **notificación inmediata**: *"Nueva lista de deseos pendiente de revisar"*
- [ ] Desde el panel, la tienda puede revisar, editar, activar o rechazar el borrador
- [ ] Solo cuando la tienda activa la lista, pasa a estado público/privado según la configuración elegida

---

### 2.2 Vales regalo — ampliar + nuevos cupones

#### Mejoras a vales existentes
- [ ] **Historial de uso por vale:** cada vez que se usa el vale se registra cuándo, cuánto y en qué producto o lista
- [ ] Uso del vale en la tienda web durante el checkout (fase 4)
- [ ] **Compartir vale por enlace:** página pública del vale con QR y código, accesible por URL única
- [ ] Envío del vale por email al destinatario directamente desde el panel

#### Nuevos: cupones de descuento
- [ ] CRUD de cupones de descuento
- [ ] Tipos: descuento fijo (€) o porcentual (%)
- [ ] Configuración: fecha de inicio, fecha de caducidad, número máximo de usos
- [ ] Aplicación en el checkout de la tienda web (fase 4)
- [ ] Historial de usos por cupón

---

### 2.3 Productos — mejoras

- [ ] **Columna de stock rediseñada:** separar claramente "Stock web" y "Stock físico" con etiquetas visuales y sin ambigüedad
- [ ] **Subida de imágenes en el formulario** de crear y editar producto (soporte multi-imagen)
- [ ] Galería de imágenes por producto (hasta 5 fotos)
- [ ] Campo de edad recomendada y categoría para filtros de tienda

---

### 2.4 Proveedores — ampliar significativamente

#### Gestión de productos por proveedor
- [ ] Vincular productos existentes del catálogo a un proveedor
- [ ] Crear nuevos productos directamente desde la ficha del proveedor
- [ ] Quitar productos de un proveedor
- [ ] **Importación masiva de productos desde Excel o PDF** (subida de archivo, mapeo de columnas)

#### Documentación del proveedor
- [ ] Subir y gestionar **dossiers, tarifas y listas de precios** por proveedor (PDF/Excel)
  - Nombre del documento, fecha de subida, descargar/ver
  - Alerta si la tarifa tiene más de 12 meses

#### Imagen y presencia pública
- [ ] Subir **logo/imagen del proveedor** para mostrarlo en la web pública
- [ ] Ficha pública del proveedor en la tienda (opcional activar por proveedor)

#### Filtros y acciones masivas
- [ ] Filtros potentes: por tipo de producto, marca, plazo de entrega, estado
- [ ] **Imprimir o compartir lista de productos** de un proveedor con filtros aplicados (PDF/enlace)

---

### 2.5 Mensajes — control de acceso + Instagram

#### Permisos de acceso
- [ ] **Roles confirmados del sistema:**
  - `Administrador` — acceso completo (propietaria)
  - `Trabajador` — acceso al panel sin emails privados ni configuración
  - `Cliente` — rol reservado para padres; creado pero sin acceso al panel de administración por ahora
- [ ] **Email solo visible para el Administrador**
- [ ] El rol Trabajador solo ve WhatsApp e Instagram en la bandeja de mensajes
- [ ] Gestión de roles en el panel de Configuración: asignar rol a cada usuario del panel

#### Integración Instagram DMs
- [ ] Conexión con Instagram Graph API (mensajes directos)
- [ ] Los DMs de Instagram aparecen en la bandeja unificada con icono diferenciador
- [ ] Responder DMs de Instagram desde el panel (misma interfaz actual)
- [ ] Contador de no leídos en el menú incluye Instagram

---

## Fase 3 — Nuevas secciones
**Duración:** ~2 semanas

### 3.1 Pedidos *(sección nueva)*
**Objetivo:** Vista única para gestionar todos los pedidos recibidos por cualquier vía.

#### Fuentes de pedidos
- Canal web (tienda online)
- Canal tienda física (entrada manual)
- Canal WhatsApp (entrada manual o vinculado a conversación)
- Canal Instagram (importado desde bandeja de mensajes)
- Canales Marketplace: Amazon, Miravia, Vinted, Wallapop (fase 3.2)

#### Ficha de pedido
- [ ] Número de pedido, fecha, canal de origen
- [ ] Cliente o nombre del comprador
- [ ] Productos solicitados con cantidad y precio
- [ ] Estado del pedido: `Recibido`, `En preparación`, `Pendiente de stock`, `Listo`, `Enviado`, `Entregado`, `Cancelado`
- [ ] Método de pago y estado: `Pendiente`, `Señal`, `Pagado`
- [ ] Notas internas del pedido
- [ ] Vínculo a lista de deseos si el pedido viene de una lista

#### Solicitud de producto al proveedor
- [ ] Desde un pedido, marcar productos como "Pendiente de pedir al proveedor"
- [ ] **Botón "Solicitar al proveedor":** genera un borrador de email/WhatsApp con los productos a pedir, respetando que hay proveedores con mínimo de pedido
- [ ] Alerta de mínimos: el sistema avisa si el importe o la cantidad no alcanza el mínimo del proveedor
- [ ] Estado de aprovisionamiento por línea: `Por pedir`, `Pedido`, `En camino`, `Recibido`
- [ ] Historial de solicitudes enviadas por proveedor

#### Listado y filtros
- [ ] Filtros: canal, estado, fecha, cliente, proveedor, con/sin stock
- [ ] Vista de calendario (qué llega y cuándo)
- [ ] Exportar listado a CSV

---

### 3.2 Marketplace — integraciones externas *(sección nueva)*

**Plataformas objetivo:** Amazon, Miravia, Vinted, Wallapop *(extensible a más)*

#### Panel de conexiones
- [ ] Pantalla de gestión de integraciones activas
- [ ] Conectar/desconectar cada plataforma via API (OAuth o API Key según cada una)
- [ ] Estado de sincronización: activa, error, última sincronización

#### Sincronización de catálogo
- [ ] En la ficha de cada producto, **selector de canales de publicación** con checkboxes individuales:
  - `☐ Web propia` · `☐ Amazon` · `☐ Miravia` · `☐ Vinted` · `☐ Wallapop`
  - Botón **"Seleccionar todos"** y opción de desmarcar individualmente
- [ ] Publicar/despublicar en un canal concreto sin afectar a los demás
- [ ] Sincronizar stock bidireccional (si se vende en Amazon, se descuenta en el panel)
- [ ] Gestión de precios por plataforma (puede diferir del precio web)

#### Mensajes unificados
- [ ] Los mensajes de cada plataforma llegan a la bandeja de mensajes del panel
- [ ] Responder desde el panel (donde la API de cada plataforma lo permita)
- [ ] Indicador de plataforma de origen en cada conversación

#### Pedidos unificados
- [ ] Cada venta en plataformas externas genera un pedido automático en la sección de Pedidos
- [ ] Estado sincronizado: si se marca enviado en el panel, se actualiza en la plataforma

> **Nota técnica:** Cada plataforma tiene su propio proceso de verificación de API. Amazon y Miravia requieren cuenta vendedor activa. Vinted y Wallapop tienen APIs más limitadas — puede requerir solución alternativa (scraping autorizado o webhooks).

---

## Fase 4 — Tienda pública: carrito y pagos
**Duración:** ~2 semanas

### 4.1 Carrito de compra
- [ ] Botón "Añadir al carrito" en listado y ficha de producto
- [ ] Mini-carrito en el header con contador de productos
- [ ] Página de carrito: productos, cantidades, precios, total
- [ ] Aplicación de vales de regalo y cupones de descuento en el carrito
- [ ] Guardar carrito en sesión (no se pierde si se cambia de página)

### 4.2 Proceso de checkout
- [ ] Formulario de datos del comprador (nombre, email, teléfono, dirección de envío)
- [ ] Selección de método de envío (recogida en tienda / envío a domicilio)
- [ ] Resumen del pedido antes de pagar
- [ ] Integración con **RedSys TPV virtual** (pasarela bancaria estándar en España)
- [ ] Métodos de pago habilitados: **tarjeta de crédito/débito** y **Bizum** (ambos vía RedSys)

### 4.3 Pago desde listas de deseos
- [ ] En la página pública de una lista, botón "Comprar este regalo" por producto
- [ ] El producto se reserva mientras se completa el pago
- [ ] Tras el pago exitoso, el producto queda marcado como pagado en el panel
- [ ] El comprador recibe confirmación por email
- [ ] La tienda recibe notificación de nuevo pago/reserva
- [ ] El nombre del comprador **solo visible para tienda y padres** (oculto en la vista pública)

### 4.4 Gestión post-pago
- [ ] Los pedidos web entran automáticamente en la sección Pedidos (fase 3.1)
- [ ] Email de confirmación automático al comprador
- [ ] Email/notificación a la tienda de cada nuevo pedido

---

## Fase 5 — Puesta a punto, formación y lanzamiento
**Duración:** ~4 semanas (1 mes)

### 5.1 Migración de datos
- [ ] Importar clientes existentes desde Ontario o Excel
- [ ] Importar catálogo de productos desde Ontario
- [ ] Importar listas de deseos activas (si las hay en algún sistema actual)
- [ ] Importar proveedores y sus datos de contacto

### 5.2 Configuración de producción
- [ ] Despliegue inicial en **`mamapato.miarquitecto.com`** (entorno de staging/pruebas durante el desarrollo)
- [ ] Migración a **`mamapatodebebes.com`** en el momento del lanzamiento (cambio DNS + redirección del sitio actual)
- [ ] Configuración de la pasarela de pago en producción (con TPV real)
- [ ] Configuración de emails transaccionales (confirmaciones de pedido, vales, etc.)
- [ ] Conexión real con Instagram Graph API
- [ ] Primeras conexiones con Marketplace (Amazon y/o Miravia como prioritarios)
- [ ] Configuración de roles de usuario (propietaria vs. empleadas)
- [ ] Tests de carga, seguridad y SEO

### 5.3 Formación del equipo
- [ ] Sesión 1 (2h): Panel de administración básico — listas, productos, pedidos
- [ ] Sesión 2 (2h): Mensajes, vales, proveedores, marketplace
- [ ] Documentación de uso entregada (guía PDF por sección)
- [ ] Periodo de acompañamiento post-lanzamiento (consultas por WhatsApp durante 30 días)

### 5.4 Lanzamiento
- [ ] Revisión final con la propietaria
- [ ] Go-live en dominio producción
- [ ] Redirección del dominio actual si se desea
- [ ] Anuncio en RRSS (opcional, a cargo de la tienda)

---

## Decisiones confirmadas

| # | Decisión | Respuesta |
|---|----------|-----------|
| 1 | Pasarela de pago | **RedSys TPV virtual + Bizum** |
| 2 | Blog | **CMS propio** con feed de Instagram inicial; opción de vincular cada artículo a un post de IG |
| 3 | Login de padres | **Magic link** (enlace por email, sin contraseña) |
| 4 | Marketplaces en lanzamiento | **Miravia, Amazon, Vinted y Wallapop** · selector de canales por producto |
| 5 | Dominio | Desarrollo en `mamapato.miarquitecto.com` → producción en `mamapatodebebes.com` al lanzar |
| 6 | Hosting y emails transaccionales | **Pendiente** — cliente debe proporcionar datos de acceso |
| 7 | Roles de acceso | **Administrador**, **Trabajador**, **Cliente** (creado, sin acceso al panel por ahora) |
| 8 | Creación de cuenta de padres | Los padres se registran solos → **lista creada como borrador** → tienda recibe notificación para revisar y activar |

---

## Lo que NO entra en este desarrollo

> Acordado en la reunión como no necesario para Mamá Pato.

- ~~Fichajes digitales~~ — gestionado desde Ontario
- ~~Registro de actividad de usuario~~ — gestionado desde Ontario

---

## Notas económicas

- **Precio cerrado:** 3.000€ fijo + 80€/mes (suscripción)
- **Los 3.000€ son fraccionables** según se acuerde
- **La cuota mensual de 80€ incluye:** uso de la plataforma, hosting, mantenimiento y soporte técnico
- El coste de las APIs externas (pasarela de pago, Instagram, Amazon MWS…) va por cuenta del cliente
- El hosting del dominio (~10–15€/mes) está incluido en la cuota mensual

---

*Documento actualizado: 14/04/2026 · Siguiente revisión: al cerrar contrato*
