import React from 'react';
import { useApp } from '../context/AppContext';

export const Navbar = () => {
  const { currentPage, setCurrentPage, currentUser, logout } = useApp();

  return (
    <header className="bg-[#0e3d46] text-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
      {/* Brand */}
      <button 
        onClick={() => setCurrentPage('citizen-form')}
        className="flex items-center gap-3 text-left focus:outline-none group"
      >
        <div className="w-8 h-8 rounded-lg bg-[#f59e0b] flex items-center justify-center text-slate-900 font-bold shadow-sm">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-tight text-white group-hover:text-amber-200 transition-colors">
          SIP-Publik Airmadidi Atas
        </span>
      </button>

      {/* Nav Menu */}
      <nav className="flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => setCurrentPage('citizen-form')}
          className={`transition-colors py-1 ${
            currentPage === 'citizen-form'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-white/80 hover:text-white'
          }`}
        >
          Ajukan Pengaduan
        </button>

        <button
          onClick={() => setCurrentPage('citizen-tracking')}
          className={`transition-colors py-1 ${
            currentPage === 'citizen-tracking'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-white/80 hover:text-white'
          }`}
        >
          Lacak Status
        </button>

        {currentUser ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentUser.roleKey === 'front_office') setCurrentPage('front-office');
                else if (currentUser.roleKey === 'field_officer') setCurrentPage('field-officer');
                else if (currentUser.roleKey === 'section_head') setCurrentPage('section-head');
                else if (currentUser.roleKey === 'leader') setCurrentPage('leader-dashboard');
                else setCurrentPage('admin');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#164d57] text-white hover:bg-[#1f5c68] text-xs font-semibold"
            >
              Dashboard ({currentUser.role})
            </button>
            <button
              onClick={logout}
              className="text-xs text-rose-300 hover:text-rose-100"
            >
              Keluar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCurrentPage('login')}
            className={`transition-colors py-1 ${
              currentPage === 'login'
                ? 'text-white font-bold border-b-2 border-white'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Login Petugas
          </button>
        )}
      </nav>
    </header>
  );
};

