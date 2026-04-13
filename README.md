# Simulador de Órbita y Aterrizaje Lunar 2D

Aplicación web académica (MVP) para la materia **Modelado y Simulación**, enfocada en un problema clásico: evolución orbital 2D y descenso controlado hacia la superficie lunar.

## Objetivo del proyecto

Construir un simulador didáctico y ejecutable que permita:

1. Simular una **fase orbital 2D** alrededor de la Luna.
2. Simular una **fase de descenso y aterrizaje 2D** con empuje simplificado.
3. Visualizar en tiempo real trayectorias, métricas y gráficos.
4. Comparar numéricamente resultados entre **Euler** y **Runge-Kutta 4**.

## Alcance del MVP

- Sin backend (todo corre en cliente).
- Modelo intencionalmente simple, estable y defendible para primer parcial.
- Interfaz de dashboard académico (oscura, limpia, legible).
- Simulación con actualización pseudo tiempo real.

## Tecnologías usadas

- **React** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (gráficos)
- **SVG** (escena 2D central)

## Métodos numéricos implementados

1. **EDO de segundo orden** (reformuladas como sistema de primer orden en estado `[x, y, vx, vy, combustible]`).
2. **Método de Euler explícito**.
3. **Método de Runge-Kutta de orden 4 (RK4)**.
4. **Búsqueda de raíces por bisección** para detectar el instante de contacto (`altura(t)=0`) entre dos pasos discretos.
5. **Interpolación lineal** para refinar estado intermedio y mejorar la transición visual.

## Modelo matemático simplificado

Centro lunar en `(0, 0)`.

Variables principales:
- Posición: `x, y`
- Velocidad: `vx, vy`
- Tiempo: `t`
- Combustible: `fuel`

Magnitudes derivadas:
- `r = sqrt(x^2 + y^2)`
- `altura = r - R_luna`

Gravedad central:
- `a_g = -(mu / r^3) * [x, y]`

Fases:
- **Órbita:** solo gravedad central.
- **Descenso:** gravedad + empuje simplificado de control:
  - retrogrado para reducir velocidad orbital,
  - mayor componente radial de frenado cerca de superficie.

> Nota académica: el controlador de descenso es una aproximación didáctica deliberada para mantener un comportamiento estable y explicable con herramientas de primer parcial.

## Reglas de estado

- **En órbita**
- **Descendiendo**
- **Aterrizaje exitoso** (si velocidad de contacto <= umbral seguro)
- **Impacto** (si supera el umbral)
- **Escape** (si `r` supera un radio máximo del sistema)

## Interfaz

- **Panel izquierdo**: parámetros iniciales + selección de método + acciones de simulación.
- **Panel central**: Luna 2D, trayectoria orbital, trayectoria de descenso y nave.
- **Panel derecho**: métricas en tiempo real (tiempo, velocidad, altura, combustible, estado, etc.).
- **Parte inferior**: gráficos de distancia, velocidad y altura en función del tiempo, más comparación Euler vs RK4.

## Estructura de carpetas

```text
src/
  components/
    Header.tsx
    ControlPanel.tsx
    MoonCanvas.tsx
    MetricsPanel.tsx
    ChartsPanel.tsx
  hooks/
    useSimulation.ts
  simulation/
    constants.ts
    types.ts
    physics.ts
    integrators.ts
    events.ts
    interpolation.ts
    controller.ts
  App.tsx
  main.tsx
```

## Cómo ejecutar

### Requisitos
- Node.js 18+
- npm 9+

### Pasos

```bash
npm install
npm run dev
```

Luego abrir la URL que muestra Vite (por defecto `http://localhost:5173`).

## Decisiones de diseño relevantes

- Separación clara entre **lógica de simulación** y **componentes UI**.
- Simulación precomputada por escenario y reproducción animada en frontend.
- Detección de touchdown más robusta usando bisección en lugar de quedarse con el paso discreto.
- Parámetros por defecto elegidos para obtener una demo funcional desde el primer render.

## Limitaciones del modelo

- No incluye perturbaciones reales (achatamiento lunar, tercer cuerpo, etc.).
- No hay modelo de orientación/actitud de la nave.
- Consumo de combustible simplificado y no calibrado con motor real.
- No pretende exactitud aeroespacial profesional; sí claridad metodológica de nivel universitario inicial.

---

Proyecto pensado como entrega práctica de **Modelado y Simulación** con foco en fundamentos numéricos y visualización técnica.
