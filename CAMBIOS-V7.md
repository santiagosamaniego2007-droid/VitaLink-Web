# VitaLink Web Beta 7.0

- Título interactivo con animación por letra, subrayado, rotación cada 3,4 segundos y control de pausa. Respeta la preferencia de movimiento reducido y se detiene fuera de la portada.
- Cinco paneles contextuales, apertura por cursor o clic, cierre con Escape y acordeón móvil.
- Se conserva la analítica de Netlify Blobs de Beta 6 (desactivada hasta configurar variables y desplegar). No se modifica Supabase ni V3.2.
- El MP4 adjunto fue referencia visual, no se incluyó como video del producto.
- Pruebas: compilación estática y cuatro pruebas unitarias de analítica; interfaz con HTML/recursos integrados en Chromium a 1440, 1024, 768 y 390 px. El entorno bloqueó el acceso al servidor local, por lo que aún falta verificar HTTP/HTTPS y Blobs en Netlify.
