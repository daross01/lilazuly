# Protección de imágenes en móvil (revisado)

## Objetivo
Dificultar el "guardar imagen" con long-press en iOS Safari y Chrome Android, sin romper el slider, el lazy loading ni el aspecto visual.

## Cambios

### 1. `src/components/PhoneMockup.tsx`
Reemplazar el `<img>` del screenshot por un `div` con `background-image`, manteniendo el frame PNG superpuesto.

- Conservar contenedor con `aspectRatio: "573 / 1167"` y los insets actuales (`left 5.93%`, `right 5.76%`, `top 8.14%`, `bottom 2.83%`, `rounded-[12%/5.5%]`).
- Sustituir `<img>` del wallpaper por:
  - `div` con `backgroundImage: url(${src})`, `bg-cover bg-center`.
  - Clase `wallpaper-protected` + `style={{ WebkitTouchCallout: "none" }}` inline para reforzar iOS Safari.
  - Clases `pointer-events-none select-none`.
- Overlay transparente `absolute inset-0 z-10` que captura long-press sobre el área del wallpaper.
- Frame del iPhone: mantener `<img>` con `draggable={false}`, `z-20`, `select-none`, `pointer-events-none`.
- `topRightSlot` en `z-30` para que el botón Pinterest siga clicable.

#### Lazy loading
Se mantiene a través del `IntersectionObserver` + `BATCH_SIZE` ya existente en `ColorGroupSlider`: si el mockup no se monta, no se solicita el background.

#### Atributos Pinterest
Los `data-pin-description` / `data-pin-media` que antes iban en `imgProps` se trasladan al `div` con background (Pinterest los acepta en cualquier elemento). El botón "Pin it" del `topRightSlot` (URL directa) sigue siendo el flujo principal.

### 2. `src/components/ColorGroupSlider.tsx`
Ajuste mínimo: reutilizar `imgProps` aceptando `HTMLAttributes<HTMLDivElement>` (renombrado a `mediaProps` opcionalmente) para pasar `data-pin-*` al div con background. Eliminar `width/height` (no aplican a div).

### 3. `src/index.css`
**No** aplicar reglas globales con `*`. En su lugar, añadir solo una clase específica:

```css
.wallpaper-protected {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}
```

Así no se rompe la selección/copia de texto en el resto del sitio.

## Lo que NO se toca
- Lógica de datos (`collections.ts`, manifest).
- `IntersectionObserver` ni `BATCH_SIZE`.
- Scroll táctil / `snap-x` (no se usa `preventDefault` en `touchstart`).
- Aspecto visual del marco ni proporciones.

## Limitaciones honestas
Esto **dificulta** el guardado pero no lo impide al 100%: un usuario avanzado puede inspeccionar el DOM y obtener la URL del `background-image`. Para protección real haría falta watermarking server-side o servir resoluciones reducidas en preview, fuera del alcance.
