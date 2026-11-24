# Integración y revisión antes de publicar

## 1. Documentos legales
`legal.html` es el borrador maestro de términos, privacidad y cookies. Completar nombre del responsable real, domicilio, teléfono, correo oficial, delegado si procede, plazos de conservación, base jurídica, proveedores y garantías de transferencias. Verificar prácticas de Netlify, Supabase, proveedor de correo y cualquier servicio adicional. Confirmar que el equipo puede tramitar derechos y gestionar incidentes. No atribuir responsabilidad a la universidad sin autorización. Revisar con asesoría legal y aprobar versión/fecha antes de activar y retirar el aviso de borrador y noindex.

## 2. Compartir los mismos documentos en V3.2 y Android
Una vez publicados en el dominio informativo, sustituir `[URL_PUBLICA_LEGAL]` por la URL HTTPS real. En la plataforma añadir enlaces visibles en inicio de sesión, registro y ajustes; en Android, en Acerca de y registro. Usar los fragmentos #terminos, #privacidad, #cookies; abrir el navegador del sistema para enlaces externos en Android. No duplicar documentos ni enlazar a rutas ficticias.

## 3. Aceptación de términos y consentimiento de salud
Separar aceptación de términos de consentimiento explícito de salud y de preferencias de cookies. Mostrar textos completos antes de recoger datos. Sin casillas premarcadas; ofrecer retirada y explicar consecuencias. Para terceros, verificar legitimación, representación e información al titular. Si se valida el modelo de consentimiento, registrar mediante backend autenticado la versión del documento, fecha del servidor, tipo de decisión y sujeto legitimado; registrar revocaciones. El backend debe comprobar las condiciones antes de permitir tratamientos de salud, no solo deshabilitar botones. No usar el consentimiento de cookies como consentimiento de salud. No crear una tabla de aceptación definitiva hasta definir si existen múltiples titulares por cuenta y cómo se verificará su representación.

## 4. Gestor del sitio publicitario
`privacy.js`: necesario para recordar la decisión, opcional para guardar el modo de portada. Las preferencias no se transmiten a Supabase. Verificar en DevTools > Application > Cookies y Local Storage. Consentimiento expira a 180 días; cambiar categorías desde el footer. No modificar sesiones Supabase Auth existentes.

## 5. Analítica opcional (no activada)
No añadir un rastreador solo por tener cookies. Para una futura implementación, contabilizar visitas, clics al acceso y reproducciones del video de forma agregada, sin identificadores persistentes ni datos de salud. Separar el almacenamiento de los proyectos médicos; preferir un proyecto analítico independiente o servicio con minimización de datos. Si se utiliza un endpoint propio, validar eventos permitidos, aplicar límites, bloquear lecturas públicas, evitar claves privilegiadas en el navegador, definir retención y revisar registros de IP del alojamiento. No llamar al endpoint hasta obtener consentimiento cuando corresponda. Actualizar aviso y gestor para permitir retirada. No se incluyen estadísticas ficticias ni un endpoint sin protección.

## 6. Verificación previa a migración V3.2
- Confirmar cambios de V3.2, hacer respaldo y validar migración/rollback antes de usarla como oficial.
- Probar con dos cuentas ficticias: acceso cruzado por ID a pacientes, medicamentos, confirmaciones, notificaciones y dispositivos debe estar bloqueado en lectura y escritura; probar operaciones válidas del propietario y acceso sin sesión.
- Revisar grants, RLS, funciones privilegiadas, tokens y emparejamiento/revocación, permisos de columnas sensibles; nunca publicar service_role ni tokens del dispositivo.
- Probar retiro del consentimiento, solicitudes de acceso/supresión, eliminación/retención de registros, copias de seguridad y documentación de incidentes. Verificar notificaciones reales y hardware por separado.
- Confirmar las condiciones de publicación con el responsable; ningún visto bueno académico sustituye la validación legal o técnica.

Fuentes para revisión: LOPDP de Ecuador, arts. 7, 8, 12 y 26; https://www.spdp.gob.ec/docs/proteccion-de-datos-personales/general/consentimiento/ ; https://www.spdp.gob.ec/docs/proteccion-de-datos-personales/cuales-son-mis-derechos/ ; https://supabase.com/docs/guides/database/postgres/row-level-security .

## Actualización Beta 6 — analítica opcional
La identificación pública provisional es Equipo de Desarrollo VitaLink; correo, domicilio, teléfono y plazos médicos siguen pendientes. No activar tratamiento de datos reales con documentos sin aprobar. La cookie v2 exige nueva elección; no hereda permiso de analítica de la v1. El panel de estadísticas es `analytics.html`; el informe requiere un token del servidor y no está enlazado públicamente. Ver instrucciones de ACTIVAR-ANALITICA.md. Sustituye la propuesta de analítica de la sección 5 por la implementación preparada; sigue desactivada por defecto.
