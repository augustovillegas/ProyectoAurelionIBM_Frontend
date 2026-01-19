import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ToTop from './ToTop';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Topbar />
          <div className="mt-5 space-y-6 lg:mt-8 lg:space-y-8">{children}</div>
        </main>
      </div>
      <ToTop />
    </div>
  );
};

export default Layout;

