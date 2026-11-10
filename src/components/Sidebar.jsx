import React from 'react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ roleTitle, menuItems, activeItem, onSelect }) => {
  const { logout, setCurrentPage, currentUser, login } = useApp();

  return (
    <aside className="w-64 bg-[#0e3d46] text-white flex flex-col min-h-screen shrink-0 border-r border-[#164d57]">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#144953]/50">
        <h1 className="text-xl font-bold tracking-tight text-white">
          SIP-Publik
        </h1>
        <p className="text-sm text-emerald-200/80 font-normal mt-0.5">
          {roleTitle}
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = activeItem === item.title;
          return (
            <button
              key={item.title}
              onClick={() => onSelect(item.title)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#18535f] text-white shadow-sm font-semibold'
                  : 'text-slate-200/85 hover:text-white hover:bg-[#134953]/50'
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </nav>

      {/* Quick Role Switcher (Prototype helper) & Logout */}
      <div className="p-4 border-t border-[#144953]/60 bg-[#0a3138]/60 space-y-3">
        <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
          Ganti Akun Demo:
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          <button 
            onClick={() => login('front_office', 'petugas.a')}
            className={`px-2 py-1 rounded text-left truncate transition ${currentUser?.roleKey === 'front_office' ? 'bg-[#18535f] text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-[#134953]'}`}
          >
            • Front Office
          </button>
          <button 
            onClick={() => login('field_officer', 'petugas.b')}
            className={`px-2 py-1 rounded text-left truncate transition ${currentUser?.roleKey === 'field_officer' ? 'bg-[#18535f] text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-[#134953]'}`}
          >
            • Tindak Lanjut
          </button>
          <button 
            onClick={() => login('section_head', 'kasie.bang')}
            className={`px-2 py-1 rounded text-left truncate transition ${currentUser?.roleKey === 'section_head' ? 'bg-[#18535f] text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-[#134953]'}`}
          >
            • Kepala Seksi
          </button>
          <button 
            onClick={() => login('leader', 'lurah.airmadidi')}
            className={`px-2 py-1 rounded text-left truncate transition ${currentUser?.roleKey === 'leader' ? 'bg-[#18535f] text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-[#134953]'}`}
          >
            • Lurah / Seklur
          </button>
          <button 
            onClick={() => login('admin', 'admin.sip')}
            className={`col-span-2 px-2 py-1 rounded text-left truncate transition ${currentUser?.roleKey === 'admin' ? 'bg-[#18535f] text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-[#134953]'}`}
          >
            • Administrator Sistem
          </button>
        </div>

        <div className="pt-2 border-t border-[#164d57]/50 flex items-center justify-between text-xs">
          <button
            onClick={() => setCurrentPage('citizen-form')}
            className="text-amber-300 hover:text-amber-200 transition font-medium"
          >
            ← Portal Warga
          </button>
          <button
            onClick={logout}
            className="text-rose-300 hover:text-rose-100 transition"
          >
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
};

