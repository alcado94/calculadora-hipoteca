# Simulador de hipoteca

Aplicacion web para simular una hipoteca en Espana, analizar viabilidad financiera y comparar compra vs alquiler con metricas claras y visuales.

## Demo

- Produccion: https://alcado94.github.io/calculadora-hipoteca/

## Funcionalidades

- Calculo de cuota mensual hipotecaria (sistema frances).
- Calculo de entrada, impuestos y gastos iniciales:
  - Vivienda usada: ITP.
  - Vivienda nueva: IVA + AJD.
  - Estimaciones de notaria, registro, gestoria y tasacion.
- Calculo de ahorro necesario y tiempo estimado para alcanzarlo.
- Ratio de esfuerzo financiero (cuota + IBI/comunidad vs ingresos).
- Tabla y grafico de amortizacion.
- Ajuste de cuota real por inflacion.
- Analisis de viabilidad (incluye estimacion de prestamo maximo recomendable).
- Comparativa comprar vs alquilar.
- Interfaz responsive con formularios optimizados para movil y escritorio.

## Stack tecnologico

- [Astro](https://astro.build/) (sitio estatico)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

## Requisitos

- Node.js 22+ (recomendado)

## Desarrollo local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Iniciar entorno de desarrollo:

   ```bash
   npm run dev
   ```

3. Abrir en navegador la URL que muestra Astro (por defecto `http://localhost:4321`).

## Scripts disponibles

- `npm run dev` - inicia servidor de desarrollo.
- `npm run build` - genera build en `dist/`.
- `npm run preview` - previsualiza el build local.
- `npm run lint` - chequeo de tipos (`tsc --noEmit`).
- `npm run deploy` - publica `dist/` con `gh-pages`.

## Despliegue

El repositorio incluye workflow de GitHub Actions en `.github/workflows/deploy.yml` para desplegar automaticamente en GitHub Pages al hacer push a `main`.

## Estructura del proyecto

- `src/pages/index.astro` - entrada principal.
- `src/components/App.tsx` - layout principal y navegacion de secciones.
- `src/hooks/useMortgageCalculator.ts` - estado y calculos de negocio.
- `src/components/forms/*` - formularios de entrada.
- `src/components/charts/*` - visualizaciones.
- `src/components/*Analysis.tsx` - analisis de viabilidad y compra/alquiler.
- `src/utils.ts` - utilidades de formato y formulas.

## Notas

- Actualmente no se requieren variables de entorno para ejecutar la app.
- Moneda y formato orientados a Espana (`es-ES`, EUR).
- Para SEO se mantienen referencias historicas como "calculadora hipotecaria" y "calculadora de hipoteca" en metadatos.
