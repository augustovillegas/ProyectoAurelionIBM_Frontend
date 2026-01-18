import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { LoadingState } from './components/States';
import { DataProvider } from './state/data';
import { FiltersProvider } from './state/filters';

const Home = React.lazy(() => import('./pages/Home'));
const BiOverview = React.lazy(() => import('./pages/bi/Overview'));
const BiPagos = React.lazy(() => import('./pages/bi/Pagos'));
const BiCategorias = React.lazy(() => import('./pages/bi/Categorias'));
const BiGeografia = React.lazy(() => import('./pages/bi/Geografia'));
const BiEstacionalidad = React.lazy(() => import('./pages/bi/Estacionalidad'));
const BiProductos = React.lazy(() => import('./pages/bi/Productos'));
const MlSegmentacion = React.lazy(() => import('./pages/ml/Segmentacion'));
const MlChurn = React.lazy(() => import('./pages/ml/Churn'));
const MlCustomerValue = React.lazy(() => import('./pages/ml/CustomerValue'));
const PowerBi = React.lazy(() => import('./pages/PowerBi'));
const Artefactos = React.lazy(() => import('./pages/Artefactos'));
const Documentacion = React.lazy(() => import('./pages/Documentacion'));
const Conclusiones = React.lazy(() => import('./pages/Conclusiones'));

const App = () => {
  return (
    <DataProvider>
      <FiltersProvider>
        <Layout>
          <Suspense fallback={<LoadingState label="Cargando modulo..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bi/overview" element={<BiOverview />} />
              <Route path="/bi/pagos" element={<BiPagos />} />
              <Route path="/bi/categorias" element={<BiCategorias />} />
              <Route path="/bi/geografia" element={<BiGeografia />} />
              <Route path="/bi/estacionalidad" element={<BiEstacionalidad />} />
              <Route path="/bi/productos" element={<BiProductos />} />
              <Route path="/ml/segmentacion" element={<MlSegmentacion />} />
              <Route path="/ml/churn" element={<MlChurn />} />
              <Route path="/ml/customer-value" element={<MlCustomerValue />} />
              <Route path="/powerbi" element={<PowerBi />} />
              <Route path="/artefactos" element={<Artefactos />} />
              <Route path="/documentacion" element={<Documentacion />} />
              <Route path="/conclusiones" element={<Conclusiones />} />
            </Routes>
          </Suspense>
        </Layout>
      </FiltersProvider>
    </DataProvider>
  );
};

export default App;

