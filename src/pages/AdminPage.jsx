import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { categoriesList, sectionsList } from '../data/mockData';

export const AdminPage = () => {
  const {
    users,
    addUser,
    toggleUserStatus,
    auditLogs,
    systemConfig,
    updateConfig,
    activeSidebarTab,
    setActiveSidebarTab,
    showToast
  } = useApp();

  const currentTab = activeSidebarTab || 'Manajemen Akun';

  const [logSearch, setLogSearch] = useState('');
  const [configForm, setConfigForm] = useState({
    kelurahanName: systemConfig?.kelurahanName || 'Kelurahan Airmadidi Atas',
    apiNotifikasi: systemConfig?.apiNotifikasi || 'API Notifikasi (WA / SMS)',
    fileLimit: systemConfig?.fileLimit || 'Limit ukuran file: 10MB',
    alamatKantor: systemConfig?.alamatKantor || 'Jl. Raya Airmadidi Atas No. 12, Minahasa Utara',
    hotline: systemConfig?.hotline || '0812-4400-5511'
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nama: '',
    username: '',
    role: 'Front Office',
    roleKey: 'front_office'
  });

  const sidebarMenu = [
    { title: 'Manajemen Akun' },
    { title: 'Master Kategori' },
    { title: 'Konfigurasi Sistem' },
    { title: 'Log Audit' }
  ];

  const handleConfigSubmit = (e) => {
    e.preventDefault();
    updateConfig(configForm);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.nama || !newUser.username) {
      alert('Nama dan Username wajib diisi');
      return;
    }
    addUser(newUser);
    setShowAddModal(false);
    setNewUser({
      nama: '',
      username: '',
      role: 'Front Office',
      roleKey: 'front_office'
    });
  };

  const filteredLogs = auditLogs.filter(log => {
    if (!logSearch) return true;
    const term = logSearch.toLowerCase();
    return log.aktivitas.toLowerCase().includes(term) || log.user.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-[#f7f5ee] flex">
      {/* Sidebar */}
      <Sidebar
        roleTitle="Administrator Sistem"
        menuItems={sidebarMenu}
        activeItem={currentTab}
        onSelect={setActiveSidebarTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ======================================================== */}
          {/* HALAMAN 1: MANAJEMEN AKUN */}
          {/* ======================================================== */}
          {currentTab === 'Manajemen Akun' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Manajemen Akun
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Kelola pengguna internal kelurahan, hak akses role, dan status aktif.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="py-2.5 px-5 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-semibold text-sm shadow transition"
                >
                  + Tambah Pengguna
                </button>
              </div>

              {/* Table User */}
              <div className="bg-white rounded-2xl border border-[#e4e2da] shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <th className="py-3.5 px-6 font-semibold text-xs text-slate-700">Nama</th>
                      <th className="py-3.5 px-6 font-semibold text-xs text-slate-700">Username</th>
                      <th className="py-3.5 px-6 font-semibold text-xs text-slate-700">Role</th>
                      <th className="py-3.5 px-6 font-semibold text-xs text-slate-700">Status</th>
                      <th className="py-3.5 px-6 font-semibold text-xs text-slate-700 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">{u.nama}</td>
                        <td className="py-4 px-6 text-slate-600 font-mono text-xs">{u.username}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#cffafe] text-[#0e7490]">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                            {u.status || 'Aktif'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => showToast(`Edit profil ${u.nama}`)}
                              className="py-1.5 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => showToast(`Password ${u.username} di-reset ke default.`)}
                              className="py-1.5 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Reset Password
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleUserStatus(u.id)}
                              className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition ${
                                u.status === 'Aktif' ? 'border-red-400 text-red-600 hover:bg-red-50' : 'border-emerald-400 text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {u.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 2: MASTER KATEGORI */}
          {/* ======================================================== */}
          {currentTab === 'Master Kategori' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Master Kategori & Seksi
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Pengaturan klasifikasi kategori pengaduan dan data seksi pelaksana teknis kelurahan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Kategori Bidang Pelayanan</h3>
                  <div className="space-y-2">
                    {categoriesList.map((cat, idx) => (
                      <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="font-bold text-slate-800">{idx + 1}. {cat}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">Aktif</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Seksi Pelaksana Teknis</h3>
                  <div className="space-y-2">
                    {sectionsList.map((sec, idx) => (
                      <div key={sec} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="font-bold text-slate-800">{idx + 1}. {sec}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">Internal</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 3: KONFIGURASI SISTEM */}
          {/* ======================================================== */}
          {currentTab === 'Konfigurasi Sistem' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Konfigurasi Sistem
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Atur profil kelurahan, integrasi gateway notifikasi WhatsApp / SMS, dan limitasi berkas.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm max-w-2xl">
                <form onSubmit={handleConfigSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Instansi / Kelurahan</label>
                    <input
                      type="text"
                      value={configForm.kelurahanName}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, kelurahanName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gateway Notifikasi (WA / SMS)</label>
                    <input
                      type="text"
                      value={configForm.apiNotifikasi}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, apiNotifikasi: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Batasan Ukuran Berkas Upload</label>
                    <input
                      type="text"
                      value={configForm.fileLimit}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, fileLimit: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat Kantor Kelurahan</label>
                    <input
                      type="text"
                      value={configForm.alamatKantor}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, alamatKantor: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nomor Hotline Pelayanan</label>
                    <input
                      type="text"
                      value={configForm.hotline}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, hotline: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-[#0c4652] hover:bg-[#083842] text-white font-semibold text-sm shadow transition"
                  >
                    Simpan Perubahan Konfigurasi
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 4: LOG AUDIT */}
          {/* ======================================================== */}
          {currentTab === 'Log Audit' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Log Audit Jejak Aktivitas
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Rekaman seluruh riwayat aktivitas petugas internal demi transparansi dan akuntabilitas.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Cari aktivitas atau nama petugas..."
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => showToast('Log disaring.')}
                    className="py-2 px-5 rounded-lg bg-[#0c4652] text-white text-xs font-semibold"
                  >
                    Filter Log
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="py-3 px-4 font-bold text-slate-700">Aktivitas</th>
                        <th className="py-3 px-4 font-bold text-slate-700">Petugas / Aktor</th>
                        <th className="py-3 px-4 font-bold text-slate-700">Waktu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-900">{log.aktivitas}</td>
                          <td className="py-3 px-4 text-slate-600 font-mono">{log.user}</td>
                          <td className="py-3 px-4 text-slate-400">{log.waktu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modal Tambah Pengguna */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Tambah Pengguna Baru
            </h3>
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newUser.nama}
                  onChange={(e) => setNewUser(prev => ({ ...prev, nama: e.target.value }))}
                  placeholder="Misal: Petugas C"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="petugas.c"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => {
                    const r = e.target.value;
                    let rk = 'front_office';
                    if (r === 'Tindak Lanjut') rk = 'field_officer';
                    else if (r === 'Kepala Seksi') rk = 'section_head';
                    else if (r === 'Lurah / Seklur') rk = 'leader';
                    else if (r === 'Administrator') rk = 'admin';
                    setNewUser(prev => ({ ...prev, role: r, roleKey: rk }));
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                >
                  <option value="Front Office">Front Office</option>
                  <option value="Tindak Lanjut">Tindak Lanjut</option>
                  <option value="Kepala Seksi">Kepala Seksi</option>
                  <option value="Lurah / Seklur">Lurah / Seklur</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#b45309] text-white text-xs font-semibold hover:bg-[#92400e]"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
