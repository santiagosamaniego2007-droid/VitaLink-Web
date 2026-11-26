# Analytics en Cloudflare Pages

1. En plan Free crear D1 `vitalink-analytics`; ejecutar `cloudflare/schema.sql` en Console.
2. Pages → vitalink-web → Settings → Bindings: D1 con nombre `VL_ANALYTICS_DB`. Configurar Production; Preview usa otra D1 de prueba si se desea.
3. Variables/secrets: `VL_ANALYTICS_ENABLED=true` y `VL_ANALYTICS_ADMIN_TOKEN` como secret (mínimo 32 caracteres, aleatorio, no guardar en GitHub). Deshabilitado hasta configurar ambos y la base.
4. Redesplegar rama correspondiente. Comprobar API sin clave (401), con clave (200), evento sin consentimiento (403), evento autorizado y actualización del contador. No introducir datos de pacientes. No activar plan de pago.
5. Historial Netlify: extraer respuesta JSON de analytics-report desde Network del navegador tras consultar con clave en la web antigua. Guardar localmente. Importar contadores validados por fecha antes de habilitar recolección; no sumar dos veces. No publicar el JSON en GitHub. El historial antiguo no migra automáticamente.
6. Retención: se eliminan filas de más de 90 días al recibir nuevos eventos; si el sitio queda inactivo, ejecutar limpieza manual. No se almacenan IP ni IDs en D1. El límite agregado por evento y día no sustituye límites de tráfico del proveedor. Revisar cuotas gratuitas y configuración antiabuso antes de publicar.

## Prueba del entorno Preview

Usar exclusivamente `vitalink-analytics-preview` como binding D1 del entorno Preview. Tras configurar las variables y el secreto, desplegar nuevamente esta rama. Abrir `/analytics` sin compartir la clave; comprobar rechazo de clave incorrecta, consulta con clave válida y registro de una carga consentida desde la portada. Los datos de prueba no se importan a producción.

## Activación de producción

Después de guardar el binding D1 `VL_ANALYTICS_DB` apuntando a `vitalink-analytics` y las variables de producción, se requiere un nuevo despliegue. Si el panel devuelve 503, verificar también que la tabla `daily` exista en esa base mediante `SELECT COUNT(*) FROM daily;`. No importar los registros de Preview.
