import React from 'react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Baru':
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
          Baru
        </span>
      );
    case 'Terverifikasi':
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-[#cffafe] text-[#0e7490]">
          Terverifikasi
        </span>
      );
    case 'Didisposisikan':
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-[#ede9fe] text-[#6d28d9]">
          Didisposisikan
        </span>
      );
    case 'Diproses':
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-[#fef3c7] text-[#b45309]">
          Diproses
        </span>
      );
    case 'Selesai Penanganan':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#dcfce7] text-[#15803d]">
          Selesai Penanganan
        </span>
      );
    case 'Selesai':
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-[#dcfce7] text-[#166534]">
          Selesai
        </span>
      );
    case 'Ditolak':
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-[#fee2e2] text-[#b91c1c]">
          Ditolak
        </span>
      );
    default:
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
};

export const SlaBadge = ({ timerSla, isOverdue }) => {
  if (isOverdue || (timerSla && timerSla.toLowerCase().includes('overdue'))) {
    return (
      <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-[#fee2e2] text-[#991b1b]">
        {timerSla || 'Overdue'}
      </span>
    );
  }
  return (
    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-[#dcfce7] text-[#166534]">
      {timerSla || 'Tepat waktu'}
    </span>
  );
};

