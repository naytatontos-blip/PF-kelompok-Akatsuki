import React from 'react';
import { useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { CitizenFormPage } from './pages/CitizenFormPage';
import { CitizenTrackingPage } from './pages/CitizenTrackingPage';
import { FrontOfficePage } from './pages/FrontOfficePage';
import { FieldOfficerPage } from './pages/FieldOfficerPage';
import { SectionHeadPage } from './pages/SectionHeadPage';
import { LeaderDashboardPage } from './pages/LeaderDashboardPage';
import { AdminPage } from './pages/AdminPage';

export const App = () => {
  const { currentPage, toast } = useApp();

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'citizen-form':
        return <CitizenFormPage />;
      case 'citizen-tracking':
        return <CitizenTrackingPage />;
      case 'front-office':
        return <FrontOfficePage />;
      case 'field-officer':
        return <FieldOfficerPage />;
      case 'section-head':
        return <SectionHeadPage />;
      case 'leader-dashboard':
        return <LeaderDashboardPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <CitizenFormPage />;
    }
  };

  return (
    <div className="relative min-h-screen text-slate-800">
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl bg-slate-900 text-white text-sm font-medium border border-slate-700 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main View Router */}
      {renderCurrentView()}
    </div>
  );
};

export default App;

