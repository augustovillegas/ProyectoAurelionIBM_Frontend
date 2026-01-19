# Proyecto Aurelion (React 19.1 + Tailwind 4.1)

Sitio BI + ML para el proyecto Aurelion en JavaScript puro. Los datos se cargan desde `public/INFORMACION` y se procesan en runtime.

## Enfoque para recruiting

- Insights clave visibles en la home: mix de medios de pago (por tickets), mix de categorias (por facturacion) y KPIs ejecutivos.
- Controles de calidad y definiciones de metricas en el summary principal.
- Metodologia ML resumida con metricas cargadas desde `modelos/metricas_*.json`.

## Instalacion (segun imagen de Tailwind + Vite)

```bash
npm create vite@latest my-project
cd my-project
npm install
npm install tailwindcss @tailwindcss/vite
```

Agregar el plugin en `vite.config.mjs` y cargar Tailwind en `src/index.css`:

```css
@import "tailwindcss";
```

## Comandos del proyecto

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Datos fuente

Los archivos en `public/INFORMACION/` son la unica fuente de verdad. Los principales assets:

- `db/base_final_aurelion.csv`
- `db/base_final_ML_clientes.csv`
- `modelos/perfiles_segmentos.csv`
- `modelos/clientes_con_clusters.csv`
- `modelos/clientes_alto_riesgo.csv`
- `modelos/predicciones_customer_value.csv`
- `modelos/feature_importance_churn.csv`
- `modelos/feature_importance_customer_value.csv`
- `modelos/metricas_churn.json`
- `modelos/metricas_customer_value.json`
- `DOCUMENTACION.md`
- `resumen_ejecutivo.pdf`
- `Proyecto Aurelion - Power BI.pbix`

## Calidad y definiciones

- Normalizacion en `src/data/normalize.js` (nulos numericos a 0, defaults de texto, medio_pago Desconocido).
- Duplicados calculados por `id_venta + id_producto`.
- Ticket promedio = promedio del importe total por `id_venta` (consistente con BI).

## Resumen ML

- Dataset ML: `db/base_final_ML_clientes.csv` (67 filas, 16 variables numericas + `id_cliente` y `ciudad`).
- Segmentacion con K-Means (K=3) y distribucion de clusters en `modelos/clientes_con_clusters.csv`.
- Churn y customer value con Random Forest, metricas en `modelos/metricas_churn.json` y `modelos/metricas_customer_value.json`.

## Verificacion responsive

- Desktop: revisar grillas de KPIs y graficos en 1200px o mas.
- Tablet: validar filtros en 2 columnas y sidebar en top.
- Mobile: confirmar indice de Documentacion con toggle.

## Estructura

- `public/INFORMACION/` archivos fuente (CSV, PDF, PBIX, MD).
- `src/data/` loaders + normalizadores.
- `src/lib/` helpers de formato y estadistica.
- `src/state/` contextos de datos y filtros.
- `src/pages/` rutas principales.
- `src/components/` UI reusable.

## Agregar nuevos datos

1. Copiar archivos nuevos en `public/INFORMACION/`.
2. Actualizar rutas en `src/data/files.js`.
3. Crear un normalizador en `src/data/normalize.js` si cambia el schema.
4. Consumir el dataset en la pagina correspondiente.

## Notas

- Todos los estilos se aplican via clases Tailwind en el mismo componente.
- Los filtros globales impactan en todas las vistas BI.
- Si un archivo falta, el loader mostrara un error en la UI.
