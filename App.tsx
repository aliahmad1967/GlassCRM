
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Pipeline } from './pages/Pipeline';
import { Leads } from './pages/Leads';
import { Lists } from './pages/Lists';
import { Settings } from './pages/Settings';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LeadsProvider } from './context/LeadsContext';
import { PipelineProvider } from './context/PipelineContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { UIProvider, useUI } from './context/UIContext';
import { ToastContainer } from './components/ToastContainer';
import { AddLeadModal } from './components/AddLeadModal';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toggleTheme } = useTheme();
  const { isAddLeadModalOpen, closeAddLeadModal, openAddLeadModal } = useUI();
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // New Lead: Alt + N
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openAddLeadModal();
      }
      // Toggle Theme: Alt + T
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
        // Optional: toast is handled by visual change, but we could add one
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme, openAddLeadModal]);

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 transition-colors duration-500 bg-fixed">
      {/* Sidebar is fixed on right (RTL), push content left */}
      <Sidebar />
      <main className="flex-1 mr-0 md:mr-64 p-4 md:p-8 min-h-screen transition-all duration-300">
         <div className="max-w-7xl mx-auto mt-4 md:mt-8">
           {children}
         </div>
      </main>
      <AddLeadModal isOpen={isAddLeadModalOpen} onClose={closeAddLeadModal} />
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
            <UIProvider>
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
            </UIProvider>
          </LeadsProvider>
        </PipelineProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
