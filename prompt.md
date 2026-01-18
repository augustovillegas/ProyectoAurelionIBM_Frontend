# PROMPT PARA CODEX — Sitio Web Interactivo “Proyecto Aurelion” (React 19.1 + Tailwind 4.1)

Actuá como un **equipo senior de frontend + data analytics/BI**. Generá un proyecto web **completo, funcional, profesional y consistente** para presentar el **Proyecto Aurelion (Retail minorista | IBM & Guayerd | Sprint 4 Demo 3 | Dic 2025)**, sin inventar datos ni conclusiones.  
**Todo** lo que se muestre debe salir **exclusivamente** de los archivos ubicados en la carpeta **INFORMACION** (datasets/artefactos) y de los documentos incluidos ahí (PDF/MD).  
**IMPORTANTE:** el proyecto debe generarse **exactamente con la misma estructura y forma de instalación** que se muestra en la imagen **"instalacion"** dentro de `INFORMACION`. Replicá esa estructura (framework/entrypoints/scripts/orden de carpetas) y asegurá que corra con los mismos comandos que indica esa imagen.

---

## 0) Objetivo del sitio
Construir un sitio que cuente la historia completa del proyecto:
- **Problema de negocio**: convertir datos transaccionales en decisiones: optimizar inventario/mix, retención, priorizar recursos por valor esperado.
- **Solución**: ETL + dataset master BI + tablero Power BI + modelos ML (KMeans, churn RF, customer value RF regressor).
- **Evidencia**: KPIs, gráficos, métricas y artefactos exportados (CSVs).
- **Conclusiones**: hallazgos, limitaciones, recomendaciones y roadmap 30/60/90.

El sitio debe ser **interactivo**: filtros, drilldowns, tooltips, tablas con búsqueda/orden, y secciones navegables.

---

## 1) Tecnologías obligatorias
- **React v19.1**
- **Tailwind v4.1**
- Router: `react-router-dom`
- Lectura CSV: `papaparse`
- Gráficos: `recharts` (principal) + opcional `d3` si hace falta.
- Tablas: `@tanstack/react-table`
- Utilidades UI: `clsx` + `tailwind-merge`
- Iconos: `lucide-react`
- Markdown rendering (para DOCUMENTACION): `react-markdown` + `remark-gfm`
- Export/Download: permitir descargar los archivos fuente desde UI (links a static assets).
- Calidad: ESLint + Prettier (configurados).
- Accesibilidad: focus states, aria-labels, contraste adecuado, navegación teclado.

**No** uses librerías pesadas tipo MUI/AntD. Estética: “data product / BI enterprise”.

---

## 2) Fuente única de verdad (no inventar)
Consumir **solo** archivos de `INFORMACION`:
- `db/base_final_aurelion.csv` (343 filas x 21 columnas aprox).
- `db/base_final_ML_clientes.csv` (67 clientes x 18 cols: id_cliente + ciudad + 16 features).
- `modelos/perfiles_segmentos.csv`
- `modelos/clientes_con_clusters.csv`
- `modelos/clientes_alto_riesgo.csv`
- `modelos/predicciones_customer_value.csv`
- `modelos/feature_importance_churn.csv`
- `modelos/feature_importance_customer_value.csv`
- `resumen_ejecutivo.pdf`
- `DOCUMENTACION.md`
- `Proyecto Aurelion - Power BI.pbix`

Si algún cálculo del sitio difiere de los documentos, **mostrá lo que da el dataset** y aclaralo con un “Nota de consistencia” (sin cambiar números a mano).

---

## 3) Requerimientos de contenido (lo mínimo que debe mostrarse)
### 3.1 KPIs ejecutivos (calculados desde `base_final_aurelion.csv` y mostrados también como “baseline” del documento)
Mostrar tarjetas KPI con:
- Ventas totales (ARS)
- Ticket promedio (ARS)
- Ticket mediana (ARS)
- Items por venta (promedio)
- Clientes únicos
- Transacciones (tickets)
- SKUs
- Calidad: nulos/duplicados (reportar conteo real)

### 3.2 Power BI (sin inventar embed)
No inventes un “link de publicación” si no existe.  
En la sección Power BI:
- Mostrar un bloque “Entregable” con el `.pbix` descargable.
- Explicar qué contiene (KPIs, tendencias, mix medios de pago, segmentación por ciudad/categoría) usando lo que está en PDF/MD.
- Si no es posible renderizar PBIX en web, dejarlo claro: “El PBIX es un archivo de Power BI Desktop; para verlo, descargue y abra en Power BI Desktop”.

### 3.3 Hallazgos BI (desde el dataset + documentos)
Gráficos y tablas:
- Mix de medios de pago (pie/donut): efectivo, QR, tarjeta, transferencia.
- Mix de categorías (pie/donut): alimentos vs limpieza.
- Distribución geográfica: ventas por ciudad (bar).
- Estacionalidad: ventas por mes (line/bar).
- Top productos por facturación (bar + tabla con % acumulado).

### 3.4 ML — Segmentación (K-Means)
Sección con:
- Métricas: Silhouette, Calinski-Harabasz, Davies-Bouldin, Inertia (si está disponible en docs; si no, no inventar).
- Distribución de clusters (19/19/29).
- Perfiles promedio por cluster (desde `perfiles_segmentos.csv`):
  - ventas promedio, importe total, ticket promedio, mix de pago, líneas/venta, cantidad promedio, etc.
- Visualización:
  - Scatter 2D usando PCA si hay columnas para graficar; si no, usar un scatter “ticket_promedio vs n_ventas” coloreado por cluster.
  - Tabla de clientes con su cluster (`clientes_con_clusters.csv`) con filtros por ciudad/cluster y búsqueda por id_cliente.

### 3.5 ML — Churn (Random Forest Classifier)
Sección con:
- Definición de target: churn si `recency > 60 días` (según docs).
- Métricas: accuracy train/test, ROC-AUC, umbral óptimo.
- Interpretación: hay sobreajuste; usar como semáforo inicial (NO automatizar decisiones).
- Feature importance (`feature_importance_churn.csv`) top 10 (bar horizontal).
- Lista de clientes alto riesgo (`clientes_alto_riesgo.csv`) con:
  - probabilidad/score si existe en el CSV
  - filtros (umbral slider) si la columna existe; si no existe, solo mostrar lista.
  - CTA de “acciones sugeridas” (texto basado en docs: retención focalizada, reactivación, etc., sin inventar).

### 3.6 ML — Valor del cliente (Random Forest Regressor)
Sección con:
- Métricas: MAE train/test, RMSE train/test, R² train/test.
- Estadísticas target: media, mediana, desvío.
- Feature importance (`feature_importance_customer_value.csv`) top 10 (bar horizontal).
- Predicciones (`predicciones_customer_value.csv`):
  - tabla de clientes con valor real vs predicho si existe; si solo hay predicho, mostrar eso.
  - gráfico de dispersión real vs predicho si hay ambas columnas.
  - ranking top 10 clientes por valor predicho.

### 3.7 Conclusiones, riesgos y roadmap
Secciones fieles a documentos:
- Implicancias estratégicas: concentración geográfica, oportunidad mix limpieza, cartera riesgo, segmento premium.
- Riesgos/limitaciones: dataset reducido 67 clientes, silhouette bajo, churn con sobreajuste, etc.
- Recomendaciones ejecutivas
- Roadmap 30/60/90 días (tabla).

### 3.8 Documentación completa
Renderizar `DOCUMENTACION.md` en una página “Documentación” con TOC navegable (anchors), código formateado y bloques tipo “callout”.

---

## 4) Interactividad (obligatorio)
- Barra superior con filtros globales (cuando aplique):
  - Rango de fechas (si `fecha` existe en el dataset)
  - Ciudad
  - Categoría
  - Medio de pago
- Todas las páginas deben reaccionar a esos filtros.
- Tooltips en gráficos, cross-filter simple (click en una barra filtra tablas).
- Tablas con paginación, orden, búsqueda.
- “Data provenance”: en cada sección, un pequeño badge “Fuente: db/base_final_aurelion.csv” / “Fuente: modelos/*.csv”.

---

## 5) Diseño (estilo industria)
- Layout tipo producto analítico:
  - Sidebar izquierda con navegación por módulos
  - Topbar con filtros + estado de carga
  - Contenido en cards, grid, spacing consistente
- Tema claro (default) y toggle dark mode (opcional pero recomendado).
- Tipografía moderna, jerarquía clara, tarjetas KPI con variaciones sutiles.
- Estados: loading skeletons, empty states (“No hay datos para estos filtros”), error states.

---

## 6) Estructura de proyecto (muy importante)
**Replicar lo que indica la imagen `INFORMACION/instalacion.*`**.
Además, cumplir:
- Mantener `INFORMACION` como carpeta de entrada.
- Copiar/servir archivos para el frontend como assets estáticos (ej: `public/INFORMACION/...`) para poder fetchearlos en runtime con `fetch()`.
- Crear una capa `src/data/` con:
  - loaders (csvLoader.ts)
  - normalizadores (parse fechas, números ARS)
  - diccionario de columnas (labels, formatos)
- Crear `src/pages/` y `src/components/` y `src/features/` (BI, ML).
- Agregar `src/lib/format.ts` (ARS, porcentajes, fechas).
- Agregar `src/lib/stats.ts` (median, quantiles, IQR, correlación si hace falta).
- Agregar `src/state/filters.ts` (context o zustand si querés; si usás zustand, agregar dependencia).

---

## 7) Páginas obligatorias (rutas)
- `/` Home / Executive Summary
- `/bi/overview` KPIs + Overview BI
- `/bi/pagos` Medios de pago
- `/bi/categorias` Categorías + cross-sell
- `/bi/geografia` Ventas por ciudad
- `/bi/estacionalidad` Ventas por mes
- `/bi/productos` Top productos
- `/ml/segmentacion` KMeans
- `/ml/churn` Churn
- `/ml/customer-value` Valor del cliente
- `/powerbi` Entregable PBIX + explicación
- `/artefactos` Descargas + diccionario de archivos
- `/documentacion` Render DOCUMENTACION.md
- `/conclusiones` Implicancias + riesgos + recomendaciones + roadmap

---

## 8) Cálculos que el sitio debe implementar (desde CSV)
Implementar en runtime (JS/TS) estos cálculos para `base_final_aurelion.csv`:
- Ventas totales: suma de `importe`
- Ticket promedio/mediana: por `id_venta` (agrupar detalle_ventas por venta) o usar una columna “ticket” si ya existe. Elegir el método correcto según columnas reales del CSV (inspeccionarlas).
- Items por venta: promedio de suma `cantidad` por `id_venta`
- Mix medios de pago: contar ventas (cabecera) o tickets por `medio_pago` según dataset.
- Mix categorías: sumar `importe` por `categoria`
- Top productos: sumar `importe` por `nombre_producto`
- Estacionalidad: sumar `importe` por mes (desde `fecha`)
- Geografía: sumar `importe` por `ciudad`

Para `base_final_ML_clientes.csv`:
- Asegurar parse numérico de features.
- Unir (si hace falta) con `clientes_con_clusters.csv`, `clientes_alto_riesgo.csv`, `predicciones_customer_value.csv` por `id_cliente`.

---

## 9) Rendimiento / DX
- Cachear datasets parseados en memoria (context) para no reparsear.
- Mostrar barra de progreso o skeleton mientras carga.
- Code splitting por rutas.
- Validación: si un archivo no existe, mostrar error “Archivo faltante en INFORMACION: …”.

---

## 10) Entregables (lo que Codex debe producir)
1) Proyecto React + Tailwind listo para instalar/ejecutar (respetando la imagen “instalacion”).
2) Sitio con navegación, interactividad y todas las secciones.
3) Lectura real de CSV/MD/PDF (PDF al menos como link descargable; si se puede, vista previa con pdf.js sin romper performance).
4) UI profesional y consistente.
5) README con:
   - comandos exactos (según imagen instalacion)
   - explicación de estructura
   - cómo agregar nuevos datos

---

## 11) Criterios de aceptación (CHECKLIST)
- [ ] Corre con los comandos exactos de la imagen “instalacion”.
- [ ] No hay datos inventados: todo viene de CSV/MD/PDF.
- [ ] KPIs y gráficos se recalculan con filtros.
- [ ] ML secciones muestran métricas + tablas + feature importance + listados.
- [ ] “Power BI” no inventa embed/link: solo descarga PBIX y explicación.
- [ ] Diseño “BI enterprise” (sidebar, cards, tipografía, estados).
- [ ] Código limpio, tipado (TypeScript recomendado), modular.

---

## 12) Nota final (muy importante)
Antes de programar UI, **inspeccioná los encabezados reales de cada CSV** en `INFORMACION` para:
- mapear nombres de columnas
- decidir claves de join
- evitar supuestos

Si hay inconsistencias entre docs y datasets, **no modifiques datos**; mostrálas como “Notas de consistencia”.

Fin del prompt.
