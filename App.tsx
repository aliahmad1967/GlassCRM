
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Pipeline } from './pages/Pipeline';
import { Leads } from './pages/Leads';
import { Lists } from './pages/Lists';
import { Settings } from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';
import { LeadsProvider } from './context/LeadsContext';
import { PipelineProvider } from './context/PipelineContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 transition-colors duration-500 bg-fixed">
      {/* Sidebar is fixed on right (RTL), push content left */}
      <Sidebar />
      <main className="flex-1 mr-0 md:mr-64 p-4 md:p-8 min-h-screen transition-all duration-300">
         <div className="max-w-7xl mx-auto mt-4 md:mt-8">
           {children}
         </div>
      </main>
      <ToastContainer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <PipelineProvider>
          <LeadsProvider>
            <HashRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/pipeline" element={<Pipeline />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/lists" element={<Lists />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </HashRouter>
          </LeadsProvider>
        </PipelineProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;