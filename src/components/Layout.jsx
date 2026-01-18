import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Topbar />
          <div className="mt-6 space-y-8 lg:mt-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

