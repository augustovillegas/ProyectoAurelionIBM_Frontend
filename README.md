# Proyecto Aurelion (React 19.1 + Tailwind 4.1)

Sitio BI + ML para el proyecto Aurelion en JavaScript puro. Los datos se cargan desde `public/INFORMACION` y se procesan en runtime.

## Comandos (segun instalacion Tailwind + Vite)

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

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
