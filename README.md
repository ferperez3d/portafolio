# Portafolio de Fernando Pérez

Web estática para presentar gestión de proyectos y operaciones creativas. Incluye Choco Roles × Stranger Things, Planet Fitness, Marinela Mundial 2026 e Hisense Copa Mundial 2026. La portada presenta a Fernando; las campañas se exploran una sola vez en Proyectos. El contenido se actualiza en `dist/content.json`, sin editar el diseño. Incluye CV con trayectoria, formación y contacto profesional, y cuatro trabajos 3D complementarios seleccionados del ArtStation de Fernando, después de su trayectoria.

## Actualizar contenido desde GitHub

1. Abrir `dist/content.json` en el repositorio y elegir editar.
2. Cambiar los textos o los datos y guardar el commit.
3. El flujo de GitHub Pages publicará el cambio cuando Pages esté configurado con GitHub Actions.

Guía rápida de edición:

| Qué actualizar | Dónde se cambia |
| --- | --- |
| Presentación y sobre mí | `profile.intro` y `profile.about` |
| Cómo trabajo | `profile.capabilities` |
| Campañas y mi aportación | `projects` |
| Total público de misiones | `projects[].publicResult.count`; conservar la unidad y el crédito colectivo |
| Trayectoria y formación | `trajectory` y `education` |
| Correo y LinkedIn | `profile.contact` |
| Ciudad | `profile.location` |
| Trabajo 3D | `portfolio3d.works` |

Las campañas se ordenan automáticamente de mayor a menor número de misiones completadas. Son una selección de casos destacados, no la totalidad de la experiencia de Fernando.

Para cambiar una imagen, subir primero su archivo a `dist/assets/` y después actualizar su ruta en `content.json`, por ejemplo `./assets/nueva-imagen.webp`. Mantener el texto alternativo, la fuente y el crédito correspondientes.

El CV descargable conserva exactamente el PDF original compartido por Fernando; no se regenera a partir de los textos de la web. Para sustituir el CV, subir el nuevo PDF a `dist/assets/Fernando-Perez-CV.pdf` y cambiar `cv.revision` a un identificador nuevo, por ejemplo `20261015-1`. Esto renueva el enlace de descarga y evita que el navegador siga entregando el PDF anterior. Cambiar ese número no modifica el contenido del PDF.

Antes de publicar, el flujo comprueba que el JSON sea válido y que existan los archivos locales que menciona. Si falla, la publicación se detiene y la web anterior continúa disponible. El detalle del error aparece en la pestaña Actions. Para recuperar un contenido anterior, se puede revertir su commit y volver a publicar.

Las secciones sin contenido, como contacto y modelos 3D, se omiten en la web. El CV aparece cuando `cv.publicFile` apunta a un PDF existente. Se puede guardar en `dist/assets/Fernando-Perez-CV.pdf` y utilizar `./assets/Fernando-Perez-CV.pdf`.

`projects` contiene las campañas comerciales. Cada caso permite editar contexto, aportación y créditos; los campos opcionales de decisión y entrega se usan solo cuando añaden información distinta. La automatización se menciona como capacidad en «Cómo trabajo», sin una sección independiente ni casos detallados de procesos internos. El campo `automations` se conserva vacío por compatibilidad.

## Experiencia visual e interactiva

La identidad visual parte de los gustos de Fernando y de la iluminación de sus obras personales: fondo oscuro, luz azul y violeta, bordes luminosos y capas. Su nombre ocupa la primera jerarquía; las campañas presentan su trabajo principal y el 3D aparece después de la trayectoria.

Las campañas se presentan primero en una lista visual compacta, con miniatura, título y resultado; la galería queda como segunda opción. «Cómo trabajo» resume tres áreas de práctica. Las obras 3D se filtran por entornos virtuales y visualización. Cada imagen puede ampliarse en una galería con navegación, acercamiento y créditos. Los casos tienen accesos a sus apartados disponibles.

La portada incorpora una firma de luz original basada en las iniciales FP: una cinta azul y violeta con profundidad, respuesta suave al puntero y al desplazamiento, y un recorrido de luz. En móvil no captura gestos. La animación se detiene fuera de pantalla y respeta la preferencia del sistema de movimiento reducido. Los controles funcionan con teclado y la galería devuelve el foco al botón de origen al cerrarse.

Los textos de «Cómo trabajo» se editan en `profile.capabilities`. Cada área contiene `title` y `text`, sin una lista adicional de pasos. Mantener las explicaciones generales y omitir datos internos y resultados que no se hayan medido.

`trajectory` y `education` contienen los periodos y datos aportados en el CV. El campo `formalTitle` de JALO conserva la denominación utilizada por Fernando en su CV; no certifica un título contractual. El contacto utiliza su correo profesional, no una cuenta de administración.

## Actualizar la selección 3D

`portfolio3d` contiene `title`, `intro`, `albumURL` y `works`. Cada obra tiene `title`, `category`, `description`, `tools`, `credit`, `image: {src, alt}` y `sourceURL`. Puede incluir `experienceURL` para enlazar al entorno externo que el autor publica.

La selección actual es MAXA CAMP, Festival Multiverso, la propuesta de montaje de Del Bosque y Palacio Municipal de El Oro. Sus imágenes se conservan en `dist/assets/3d-*.webp` y `3d-palacio.jpg`; proceden de las publicaciones de Fernando en ArtStation. Las fechas de publicación no se usan como fechas del proyecto ni las obras se asignan automáticamente a un empleo. Las imágenes muestran el trabajo publicado y los créditos describen la aportación de Fernando; completar créditos de colaboradores y activos de terceros si se amplían las fichas.

Las experiencias MAXA CAMP y Multiverso se enlazan a Vatom y Hyperfy según sus publicaciones; su disponibilidad depende de esas plataformas. No se inserta un visor externo ni se recuperan archivos de geometría desde esos entornos. Para girar modelos dentro de esta web se necesita un archivo GLB propio o autorizado.

## Incorporar una pieza pública

Cada proyecto tiene `media` para las piezas dentro del caso. El campo opcional `background` permite mostrar una imagen de fondo detrás de piezas transparentes, como las identidades de Marinela e Hisense. Para añadir una imagen, guardar el archivo autorizado en `dist/assets/` e incluir un objeto con `src`, `alt`, `caption`, `credit` y `sourceURL`. Usar una ruta relativa como `./assets/imagen.jpg`. `sourceURL` puede apuntar a la publicación pública de origen. Una portada distinta se configura en `cover`, con `src`, `alt`, `background` y, si la composición lo requiere, `secondarySrc` y `secondaryAlt`. La portada de Choco Roles conserva ambos logos y el fondo de la landing oficial; las piezas del detalle se limitan a las dos tarjetas seleccionadas. Los diagramas visibles sin imágenes son esquemas originales del alcance, no piezas de las campañas.

Comprobar la publicación, la versión y el crédito de la pieza antes de incorporarla. Las fuentes de investigación y datos internos deben permanecer fuera del repositorio. Los enlaces públicos del sitio son referencias; no implican permiso para copiar su material.

Las cuatro campañas incluyen imágenes de sus publicaciones públicas: Choco Roles, Planet Fitness, Marinela Los favoritos del Vasco e Hisense Copa Mundial 2026. Los archivos se conservan en `dist/assets/`, con fuente y crédito en `content.json`. La autoría visual se atribuye al equipo de campaña; la coordinación y operación de Fernando se describen por separado.

`publicResult` conserva un resultado agregado público con `count`, `label`, `period` y `scope`. Los cuatro totales actuales son misiones completadas, no personas únicas ni registros. Las cifras finales fueron confirmadas por Fernando. Las capturas de respaldo se conservan únicamente en la investigación privada; no se publican ni se enlazan desde el sitio. No actualizar con métricas internas ni sustituir esta unidad por participantes.

El caso Choco Roles muestra solo dos piezas: las misiones Adquiere y Clave oculta, procedentes de la landing pública. Su diseño se atribuye al equipo de diseño de JALO y la coordinación a Fernando. El rediseño de la pantalla general de participación se acredita como colaboración de Fernando y el equipo de diseño.

## Incorporar modelos 3D

Guardar un modelo propio o autorizado en formato GLB en `dist/assets/` y añadirlo a `models3d` con `title`, `src`, `alt`, `description` y `credit`. Se puede incluir una imagen `poster` y `autoRotate: true`. Las rutas son relativas al sitio, por ejemplo `./assets/modelo.glb`.

El visitante elige cargar el modelo y puede girarlo y acercarlo. El visor se descarga únicamente al pulsar el botón; utiliza una versión fijada de model-viewer. No hay modelos de Fernando incorporados todavía. El visor depende de acceso al CDN para cargar la biblioteca.

## Publicar en GitHub Pages

Subir esta carpeta a un repositorio de GitHub con rama principal `main`. En Settings → Pages, seleccionar GitHub Actions como origen. El flujo incluido publica solo `dist/`. No requiere compilación ni un servidor de aplicación. La web funciona tanto en una ruta de repositorio como en un dominio propio porque utiliza rutas relativas.

Primera publicación:

1. Crear o elegir el repositorio en tu cuenta. El nombre sugerido es `portafolio`. GitHub Pages admite repositorios públicos con GitHub Free; para un repositorio privado hay que comprobar que el plan incluya Pages.
2. Descomprimir el paquete y subir **su contenido a la raíz del repositorio**: `dist`, `.github`, `.gitignore` y este README. No subir el ZIP como un único archivo ni colocar todo dentro de otra carpeta. Es importante conservar `.github/workflows/pages.yml`.
3. Confirmar que la rama principal se llama `main`. El flujo se ejecuta al guardar cambios en esa rama.
4. Entrar en **Settings → Pages → Build and deployment → Source** y elegir **GitHub Actions**.
5. Ir a **Actions → Publicar portafolio → Run workflow**, seleccionar `main` y ejecutar. Esto también permite repetir la primera publicación si el flujo se lanzó antes de activar Pages.
6. Cuando termine correctamente, abrir la dirección que muestra **Settings → Pages** y comprobar portada, casos, imágenes y descarga del CV desde el teléfono.

La dirección del nuevo sitio depende de tu usuario y del repositorio. Más adelante se puede conectar un dominio propio. Una vez conocida la dirección definitiva, actualizar también el enlace del portafolio dentro del PDF del CV.

Después de esta configuración inicial, cada cambio guardado en `main` actualiza la web automáticamente. No hay que volver a subir todo el paquete para cambiar un texto, una imagen o el CV.

Referencia: [Crear un sitio de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

Configuración: [Elegir el origen de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Vista local

Servir la carpeta `dist` con un servidor HTTP local. El archivo JSON se obtiene mediante HTTP; abrir el HTML directamente desde el explorador de archivos no es una vista válida. Por ejemplo, con Python instalado: `python -m http.server 8000 --directory dist`.

## Estructura

- `dist/index.html`: estructura y navegación.
- `dist/styles.css`: diseño y adaptación a móvil.
- `dist/app.js`: contenido, casos y visor de modelos.
- `dist/content.json`: textos y materiales editables.
- `.github/workflows/pages.yml`: publicación en GitHub Pages.

Documentación del visor: [model-viewer](https://modelviewer.dev/).

## Tipografía

Space Grotesk se aloja localmente en `dist/assets/space-grotesk.woff2`; incluye los caracteres latinos y españoles. Su licencia SIL Open Font License 1.1 se conserva en `dist/assets/space-grotesk-OFL.txt`. Fuente: [Google Fonts](https://github.com/google/fonts/tree/main/ofl/spacegrotesk). La firma FP es una composición vectorial original de esta web, independiente de las obras 3D del portafolio.
