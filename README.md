# Para ti

Un jardín espacial de girasoles 3D procedurales, construido con React, Vite y Three.js. Sin modelos ni imágenes externos.

## Instalar y ejecutar

Requiere Node.js 20.19+ o 22.12+ (recomendado: Node 24).

```sh
npm install
npm run dev
```

Abre la dirección local que imprime Vite. En PowerShell con scripts bloqueados, utiliza `npm.cmd` en lugar de `npm`.

```sh
npm run build
npm run preview
npm test
```

La compilación se genera en `dist/`. El servidor de desarrollo escucha en la red local para probar desde un teléfono en la misma Wi-Fi.

Pruebas de navegador opcionales (con Vite ejecutándose): `npx playwright install chromium` y `npx playwright test`. Cubren entrada, onda repetible, audio ausente, cinco tamaños de pantalla, gestos y fallback WebGL. Las capturas se guardan en `test-results/`.

## Experiencia

Pulsa ELISSS para entrar. Arrastra para orbitar, usa la rueda o un gesto de pinza para acercarte. Con el universo enfocado, las flechas permiten explorar con teclado. Los ángulos y la distancia están limitados. “Iluminar el universo” inicia una onda desde fuera hacia el centro; se puede repetir cuando termina.

La calidad inicial depende de núcleos, memoria disponible y tipo de puntero. Si la cadencia medida es inferior a 29 FPS, baja un nivel automáticamente una vez. También se puede elegir Alta, Media o Ligera en la esquina superior. La opción Ligera desactiva el postprocesamiento. Se respeta `prefers-reduced-motion`.

## Música opcional

Coloca un archivo propio o con licencia adecuada en **`public/music.mp3`**. El botón de sonido lo carga únicamente al pulsarlo; no hay autoplay. Si falta o el navegador no puede reproducirlo, aparece un aviso y el jardín sigue funcionando. No se incluye música en esta versión.

## Vercel

Sube esta carpeta a un repositorio de GitHub e impórtalo en Vercel. Selecciona el preset **Vite**, comando de compilación `npm run build` y directorio de salida `dist`. Si el repositorio contiene más proyectos, configura `para-ti` como Root Directory. No requiere claves, backend ni variables de entorno.

## Estructura y rendimiento

- `src/App.jsx`: fases, accesibilidad, fallback y coordinación.
- `src/components/Universe.jsx`: escena, iluminación y bloom.
- `SunflowerField.jsx` y `src/utils/geometry.js`: geometrías curvas y cinco mallas instanciadas para todo el jardín.
- `Stars.jsx`: estrellas y polvo con shaders; movimiento sin renders de React.
- `CameraController.jsx`, `LightingSequence.jsx`: cámara y secuencia radial.
- `Interface.jsx`, `Intro.jsx`, `src/styles.css`: interfaz adaptable y transición.
- `src/hooks/`: calidad, movimiento reducido y audio opcional.

Geometrías/materiales reutilizados, DPR limitado (1–1.65), ausencia de sombras, luces constantes, emisión por instancia, atributos luminosos a 24 Hz y partículas animadas en GPU. Los recursos se liberan al cambiar la calidad. Las estrellas ocupan todo el entorno y se excluyen del frustum culling; el jardín sí lo utiliza. No se actualiza estado React por frame.

Necesita WebGL 2. La pérdida de contexto muestra un mensaje con opción de reintentar. El rendimiento real depende de la GPU, temperatura y navegador; los objetivos de 30/60 FPS no son garantías para todos los dispositivos.
