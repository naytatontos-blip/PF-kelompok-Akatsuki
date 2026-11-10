import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const { login, setCurrentPage } = useApp();
  const [role, setRole] = useState('Petugas Front Office');
  const [username, setUsername] = useState('petugas.a');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleRoleChange = (r) => {
    setRole(r);
    setErrorMsg(null);
    setPassword('');
    if (r === 'Petugas Front Office') setUsername('petugas.a');
    else if (r === 'Petugas Tindak Lanjut') setUsername('petugas.b');
    else if (r === 'Kepala Seksi (Kasie)') setUsername('kasie.bang');
    else if (r === 'Lurah / Sekretaris Lurah') setUsername('lurah.airmadidi');
    else setUsername('admin.sip');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = login(role, username, password);
    if (result && !result.success) {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Branding Hero Panel */}
      <div className="w-full md:w-5/12 bg-[#0e3d46] text-white p-10 md:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b] flex items-center justify-center text-slate-900 shadow-md">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
                SIP-Publik
              </h2>
              <p className="text-sm text-emerald-200/90 font-medium">
                Kelurahan Airmadidi Atas
              </p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-md">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
              Satu pintu layanan pengaduan warga.
            </h1>
            <p className="text-emerald-100/80 text-base md:text-lg leading-relaxed font-normal">
              Verifikasi, disposisi, tindak lanjut, hingga penutupan aduan tercatat transparan dan dapat dilacak.
            </p>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="pt-12 flex flex-wrap gap-2.5">
          {['Verifikasi', 'Disposisi', 'Tindak Lanjut', 'Approval'].map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#164d57]/70 text-emerald-100 border border-[#216674]/80 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="w-full md:w-7/12 bg-[#f7f5ee] flex items-center justify-center p-8 md:p-14 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Masuk Petugas
            </h2>
            <p className="text-sm text-slate-600">
              Gunakan akun & kata sandi khusus masing-masing petugas.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-start gap-3 shadow-sm animate-pulse">
              <span className="text-lg leading-none">⚠️</span>
              <div className="flex-1 font-medium leading-relaxed">
                {errorMsg}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role / Identitas Petugas
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4652] focus:border-transparent transition appearance-none cursor-pointer"
                >
                  <option value="Petugas Front Office">Petugas Front Office</option>
                  <option value="Petugas Tindak Lanjut">Petugas Tindak Lanjut</option>
                  <option value="Kepala Seksi (Kasie)">Kepala Seksi (Kasie)</option>
                  <option value="Lurah / Sekretaris Lurah">Lurah / Sekretaris Lurah</option>
                  <option value="Administrator Sistem">Administrator Sistem</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nama.petugas"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0c4652] focus:border-transparent transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Kata Sandi Khusus
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#0c4652] hover:underline font-semibold"
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(null); }}
                  placeholder="Masukkan kata sandi khusus..."
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0c4652] focus:border-transparent transition pr-10"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 text-xs">
                  {showPassword ? '👁️' : '🔒'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Setiap petugas memiliki kata sandi berbeda. Tidak bisa login dengan sandi petugas lain.
              </p>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#0c4652] hover:bg-[#083842] active:bg-[#062c34] text-white font-semibold text-sm shadow-sm transition-colors text-center"
              >
                Login Petugas
              </button>
            </div>
          </form>

          {/* Citizen Link */}
          <div className="mt-8 text-center text-xs text-slate-600">
            Warga umum?{' '}
            <button
              onClick={() => setCurrentPage('citizen-form')}
              className="text-[#0c4652] hover:text-[#083842] font-semibold underline underline-offset-2 transition"
            >
              Ajukan atau lacak pengaduan tanpa login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

