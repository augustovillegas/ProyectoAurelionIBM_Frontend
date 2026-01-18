import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, BarChart3, Users, Brain, FileText, Download, Linkedin } from 'lucide-react';
import { cn } from '../lib/cn';

const navItems = [
  { to: '/', label: 'Resumen', icon: Home },
  { to: '/bi/overview', label: 'BI Overview', icon: LayoutDashboard },
  { to: '/bi/pagos', label: 'BI Pagos', icon: BarChart3 },
  { to: '/bi/categorias', label: 'BI Categorias', icon: BarChart3 },
  { to: '/bi/geografia', label: 'BI Geografia', icon: BarChart3 },
  { to: '/bi/estacionalidad', label: 'BI Estacionalidad', icon: BarChart3 },
  { to: '/bi/productos', label: 'BI Productos', icon: BarChart3 },
  { to: '/ml/segmentacion', label: 'ML Segmentacion', icon: Users },
  { to: '/ml/churn', label: 'ML Churn', icon: Brain },
  { to: '/ml/customer-value', label: 'ML Customer Value', icon: Brain },
  { to: '/powerbi', label: 'Power BI', icon: FileText },
  { to: '/artefactos', label: 'Artefactos', icon: Download },
  { to: '/documentacion', label: 'Documentacion', icon: FileText },
  { to: '/conclusiones', label: 'Conclusiones', icon: FileText },
];

const linkBase =
  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap';

const Sidebar = () => {
  return (
    <aside className="flex w-full flex-col gap-4 border-b border-slate-200 bg-white/80 px-4 py-4 shadow-sm lg:h-full lg:w-64 lg:border-b-0 lg:border-r lg:py-6">
      <div className="px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Proyecto Aurelion
        </p>
        <h1 className="mt-2 text-lg font-semibold text-slate-900">Retail BI + ML</h1>
      </div>
      <nav className="flex flex-1 flex-wrap gap-2 overflow-x-auto pr-1 lg:flex-col lg:flex-nowrap lg:gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  linkBase,
                  isActive
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100',
                )
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <a
        href="https://www.linkedin.com/in/augustovillegas/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-600 hover:bg-white lg:mt-auto"
      >
        <Linkedin size={14} />
        linkedin.com/in/augustovillegas
      </a>
    </aside>
  );
};

export default Sidebar;

