import React, { useState } from 'react';
import {
  Bell,
  Search,
  RefreshCw,
  Building,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  User,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface TopNavbarProps {
  selectedCompany: string;
  onChangeCompany: (name: string) => void;
  selectedPeriod: string;
  onChangePeriod: (period: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  onTriggerQuickSync: () => void;
  isSyncing: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  selectedCompany,
  onChangeCompany,
  selectedPeriod,
  onChangePeriod,
  onNavigate,
  onTriggerQuickSync,
  isSyncing,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'Kewajiban Pajak Karbon Q4 Siap Posting',
      desc: 'Nilai terhitung Rp 97,2 Jt menunggu persetujuan akun 6-2200.',
      time: '15 menit lalu',
      type: 'tax',
    },
    {
      id: 2,
      title: 'Anomali Boiler Cikarang Terdeteksi',
      desc: 'Efisiensi pembakaran menurun 28,4% pada sensor IoT CEMS.',
      time: '1 jam lalu',
      type: 'warning',
    },
    {
      id: 3,
      title: 'Sinkronisasi SAP FICO Berhasil',
      desc: '42 batch transaksi akuntansi hijau telah terekonsiliasi.',
      time: '3 jam lalu',
      type: 'success',
    },
  ];

  const searchableItems = [
    { label: 'Beban Pajak Karbon Terestimasi', category: 'Akun Finansial', tab: 'financial' as NavigationTab },
    { label: 'Sensor CEMS Cerobong Boiler A', category: 'Data Lingkungan', tab: 'environmental' as NavigationTab },
    { label: 'Simulasi Kuota Carbon Cap', category: 'Manajemen Karbon', tab: 'carbon' as NavigationTab },
    { label: 'Deteksi Anomali COD IPAL', category: 'AI Analytics', tab: 'ai' as NavigationTab },
    { label: 'Blok Ledger #104 Sensor CEMS', category: 'Blockchain', tab: 'blockchain' as NavigationTab },
    { label: 'Integrasi SAP S/4HANA FICO', category: 'ERP System', tab: 'erp' as NavigationTab },
    { label: 'Laporan Laba Rugi Lingkungan', category: 'Laporan Hijau', tab: 'reports' as NavigationTab },
    { label: 'Kepatuhan PROPER KLHK', category: 'Regulasi', tab: 'proper' as NavigationTab },
  ];

  const filteredItems = searchableItems.filter((i) =>
    i.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Organization & Period Selectors */}
      <div className="flex items-center gap-4">
        {/* Company Dropdown */}
        <div className="flex items-center gap-2 bg-[#F7F8F4] px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-800">
          <Building className="w-3.5 h-3.5 text-[#2F7D4A]" />
          <span className="font-semibold text-gray-500">Entitas:</span>
          <select
            value={selectedCompany}
            onChange={(e) => onChangeCompany(e.target.value)}
            className="bg-transparent font-medium text-gray-900 border-none outline-hidden cursor-pointer"
          >
            <option value="PT Eco Manufacturing Indonesia">PT Eco Manufacturing Indonesia</option>
            <option value="PT Cikarang Green Polymer (Subsidiary)">PT Cikarang Green Polymer</option>
            <option value="Konsolidasi Grup EcoTrace">Konsolidasi Grup EcoTrace</option>
          </select>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-[#F7F8F4] px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-800">
          <Calendar className="w-3.5 h-3.5 text-[#2F7D4A]" />
          <span className="font-semibold text-gray-500">Periode:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => onChangePeriod(e.target.value)}
            className="bg-transparent font-medium text-gray-900 border-none outline-hidden cursor-pointer"
          >
            <option value="2025-Full">Tahun 2025 (Penuh)</option>
            <option value="2025-Q4">Kuartal IV 2025</option>
            <option value="2025-Q3">Kuartal III 2025</option>
            <option value="2026-YTD">2026 (YTD Simulasi)</option>
          </select>
        </div>
      </div>

      {/* Right: Search, Sync, Notification, Profile */}
      <div className="flex items-center gap-3">
        {/* Search Trigger */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 bg-[#F7F8F4] border border-gray-200 rounded-lg hover:border-gray-300 transition-colors w-48 text-left"
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span>Cari akun, sensor, blok...</span>
          <kbd className="ml-auto text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400">
            ⌘K
          </kbd>
        </button>

        {/* Sync Trigger Button */}
        <button
          onClick={onTriggerQuickSync}
          disabled={isSyncing}
          title="Sinkronisasi Telemetri Lingkungan ke ERP"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F8F4] hover:bg-emerald-50 text-gray-700 hover:text-[#2F7D4A] border border-gray-200 hover:border-emerald-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#2F7D4A] ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkron ERP'}</span>
        </button>

        {/* Public View Shortcut */}
        <button
          onClick={() => onNavigate('public')}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#2F7D4A] border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <span>Portal Publik</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-semibold text-gray-900">
                <span>Pemberitahuan Sistem</span>
                <span className="text-[10px] text-emerald-600 font-normal">3 Baru</span>
              </div>
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 hover:bg-gray-50 px-1 rounded transition-colors">
                    <div className="flex items-start gap-2">
                      {n.type === 'tax' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5" />}
                      {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5" />}
                      {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{n.title}</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#173D2B] text-white flex items-center justify-center font-bold text-xs">
            BS
          </div>
          <div className="text-left text-xs leading-tight hidden lg:block">
            <p className="font-semibold text-gray-800">Budi Santoso, CA</p>
            <p className="text-[10px] text-gray-500">Chief Accountant & ESG</p>
          </div>
        </div>
      </div>

      {/* Global Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi, modul, indikator emisi, atau sensor..."
                className="w-full text-sm outline-hidden"
                autoFocus
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                ESC
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-2 divide-y divide-gray-50">
              {filteredItems.length === 0 ? (
                <p className="p-4 text-center text-xs text-gray-400">Tidak ada hasil ditemukan.</p>
              ) : (
                filteredItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(item.tab);
                      setShowSearchModal(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-emerald-50 flex items-center justify-between text-xs group transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-[#2F7D4A]">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.category}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#2F7D4A]" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
