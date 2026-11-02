import React, { useState } from 'react';
import {
  Landmark,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  Scale,
  CreditCard,
  Building,
} from 'lucide-react';
import {
  FinancialTransaction,
  IncomeStatementItem,
  BalanceSheetItem,
} from '../../types';
import { formatIDR, formatNumber } from '../../utils/formatters';

interface FinancialModuleProps {
  transactions: FinancialTransaction[];
  incomeStatement: IncomeStatementItem[];
  balanceSheet: BalanceSheetItem[];
  onAddTransaction: (trx: FinancialTransaction) => void;
}

export const FinancialModule: React.FC<FinancialModuleProps> = ({
  transactions,
  incomeStatement,
  balanceSheet,
  onAddTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'laba-rugi' | 'neraca' | 'arus-kas' | 'transaksi' | 'coa'>('transaksi');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [selectedTrx, setSelectedTrx] = useState<FinancialTransaction | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding transaction
  const [newDate, setNewDate] = useState('2025-12-31');
  const [newAccountCode, setNewAccountCode] = useState('6-2200');
  const [newAccountName, setNewAccountName] = useState('Estimasi Beban Pajak Karbon');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<FinancialTransaction['category']>('Beban Lingkungan');
  const [newAmount, setNewAmount] = useState('15000000');
  const [newIsDebit, setNewIsDebit] = useState(true);
  const [newEnvClass, setNewEnvClass] = useState<FinancialTransaction['environmentalClassification']>('Pajak & Kepatuhan');

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'Semua' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newAmount) || 0;
    const newTrx: FinancialTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: newDate,
      accountNumber: newAccountCode,
      accountName: newAccountName,
      description: newDesc || 'Pencatatan transaksi akuntansi lingkungan terverifikasi',
      category: newCategory,
      debit: newIsDebit ? amountVal : 0,
      credit: newIsDebit ? 0 : amountVal,
      environmentalClassification: newEnvClass,
      verificationStatus: 'Terverifikasi',
      costCenter: 'CC-ENV-MANUAL',
    };
    onAddTransaction(newTrx);
    setShowAddModal(false);
    setNewDesc('');
  };

  const handleExportCSV = () => {
    const headers = 'ID Transaksi,Tanggal,No Akun,Nama Akun,Deskripsi,Kategori,Debit,Kredit,Klasifikasi Lingkungan,Status\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.id}","${t.date}","${t.accountNumber}","${t.accountName}","${t.description.replace(/"/g, '""')}","${t.category}",${t.debit},${t.credit},"${t.environmentalClassification}","${t.verificationStatus}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EcoTrace_Financial_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#2F7D4A]" />
            Akuntansi Keuangan Terintegrasi Lingkungan
          </h2>
          <p className="text-xs text-gray-500">
            Penyajian laporan keuangan standar (PSAK/IFRS) dengan integrasi akun biaya dan provisi lingkungan hidup.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('transaksi')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'transaksi'
                ? 'bg-[#173D2B] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Buku Jurnal Transaksi
          </button>
          <button
            onClick={() => setActiveTab('laba-rugi')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'laba-rugi'
                ? 'bg-[#173D2B] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Laporan Laba Rugi
          </button>
          <button
            onClick={() => setActiveTab('neraca')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'neraca'
                ? 'bg-[#173D2B] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Neraca Keuangan
          </button>
          <button
            onClick={() => setActiveTab('arus-kas')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'arus-kas'
                ? 'bg-[#173D2B] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Arus Kas
          </button>
          <button
            onClick={() => setActiveTab('coa')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'coa'
                ? 'bg-[#173D2B] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bagan Akun (COA)
          </button>
        </div>
      </div>

      {/* TAB 1: BUKU TRANSAKSI (Interactive Financial Transactions) */}
      {activeTab === 'transaksi' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F7F8F4]">
            <div className="flex items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari ID, nama akun, deskripsi..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white text-xs border border-gray-200 rounded-lg outline-hidden"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white px-2 py-1.5 border border-gray-200 rounded-lg outline-hidden text-xs cursor-pointer"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Beban Lingkungan">Beban Lingkungan</option>
                  <option value="Aset Lingkungan">Aset Lingkungan</option>
                  <option value="Pendapatan">Pendapatan</option>
                  <option value="Beban Operasional">Beban Operasional</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor CSV</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-[#2F7D4A] hover:bg-[#25683d] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Transaksi</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f4ee] text-gray-700 border-b border-gray-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tanggal / ID</th>
                  <th className="py-3 px-4">No & Nama Akun</th>
                  <th className="py-3 px-4">Deskripsi Transaksi</th>
                  <th className="py-3 px-4">Klasifikasi Lingkungan</th>
                  <th className="py-3 px-4 text-right">Debit (Rp)</th>
                  <th className="py-3 px-4 text-right">Kredit (Rp)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 block">{trx.id}</span>
                      <span className="text-[11px] text-gray-500">{trx.date}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-gray-600 block">{trx.accountNumber}</span>
                      <span className="font-medium text-gray-900">{trx.accountName}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs text-gray-600 truncate" title={trx.description}>
                      {trx.description}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          trx.environmentalClassification === 'Pajak & Kepatuhan'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : trx.environmentalClassification === 'Efisiensi Energi'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : trx.environmentalClassification === 'Pengolahan Limbah'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : trx.environmentalClassification === 'Restorasi Lingkungan'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {trx.environmentalClassification}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-900">
                      {trx.debit > 0 ? formatIDR(trx.debit) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-900">
                      {trx.credit > 0 ? formatIDR(trx.credit) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${
                          trx.verificationStatus === 'Terverifikasi'
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-amber-700 bg-amber-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {trx.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedTrx(trx)}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                        title="Lihat Detail Transaksi"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LAPORAN LABA RUGI TERINTEGRASI */}
      {activeTab === 'laba-rugi' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Laporan Laba Rugi Komprehensif Terintegrasi Lingkungan
              </h3>
              <p className="text-xs text-gray-500">
                Untuk Tahun yang Berakhir pada 31 Desember 2025 (Dinyatakan dalam Rupiah Indonesia)
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
              Audit Ready (Green Accounting)
            </span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {incomeStatement.map((item, idx) => (
              <div
                key={idx}
                className={`py-2.5 flex items-center justify-between ${
                  item.isHeader
                    ? 'font-bold text-gray-900 pt-4 bg-[#f8f9f5] px-2 rounded'
                    : item.isSubtotal
                    ? 'font-bold text-gray-900 border-t-2 border-gray-300 py-3 bg-[#eef3eb] px-2 rounded my-1'
                    : item.isEnvironmental
                    ? 'bg-emerald-50/60 pl-6 pr-2 rounded text-emerald-950 font-medium'
                    : 'pl-6 pr-2 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-400 text-[11px]">{item.code}</span>
                  <span>{item.title}</span>
                  {item.isEnvironmental && (
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-normal">
                      Akun Hijau
                    </span>
                  )}
                  {item.notes && (
                    <span className="text-[10px] text-gray-500 italic hidden md:inline">
                      ({item.notes})
                    </span>
                  )}
                </div>
                <div className="font-mono font-semibold">
                  {formatIDR(item.amount)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <p>
              <strong>Catatan Akuntansi Lingkungan:</strong> Beban lingkungan langsung sebesar Rp 7.820.000.000 (4,21% dari pendapatan) telah diakui dalam Harga Pokok Penjualan dan Beban Operasional. Estimasi Pajak Karbon sebesar Rp 97.200.000 diakrualkan sesuai tarif indikatif Rp 30.000/tCO₂e.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: NERACA KEUANGAN */}
      {activeTab === 'neraca' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Laporan Posisi Keuangan (Neraca)
              </h3>
              <p className="text-xs text-gray-500">
                Per 31 Desember 2025 dengan Pengungkapan Aset & Provisi Lingkungan Hidup
              </p>
            </div>
            <span className="text-xs text-gray-500 font-mono">IDR (Rupiah Penuh)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aset Side */}
            <div className="border border-gray-200 rounded-xl p-4 bg-[#F7F8F4] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#173D2B] pb-2 border-b border-gray-200 flex items-center justify-between">
                <span>ASET (AKTIVA)</span>
                <span>Nilai Bersih</span>
              </h4>
              <div className="space-y-2 text-xs">
                {balanceSheet
                  .filter((b) => b.category.includes('Aset'))
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between py-1.5 px-2 rounded ${
                        item.isEnvironmental ? 'bg-emerald-100/70 text-emerald-950 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <div>
                        <span className="font-mono text-gray-400 mr-2 text-[11px]">{item.code}</span>
                        <span>{item.title}</span>
                        {item.isEnvironmental && (
                          <span className="ml-2 text-[10px] text-emerald-700 font-bold">🌿 Aset Hijau</span>
                        )}
                      </div>
                      <span className="font-mono font-semibold">{formatIDR(item.amount)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Kewajiban & Ekuitas Side */}
            <div className="border border-gray-200 rounded-xl p-4 bg-[#F7F8F4] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#173D2B] pb-2 border-b border-gray-200 flex items-center justify-between">
                <span>KEWAJIBAN & EKUITAS (PASIVA)</span>
                <span>Nilai Bersih</span>
              </h4>
              <div className="space-y-2 text-xs">
                {balanceSheet
                  .filter((b) => !b.category.includes('Aset'))
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between py-1.5 px-2 rounded ${
                        item.isEnvironmental ? 'bg-amber-100/70 text-amber-950 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <div>
                        <span className="font-mono text-gray-400 mr-2 text-[11px]">{item.code}</span>
                        <span>{item.title}</span>
                        {item.isEnvironmental && (
                          <span className="ml-2 text-[10px] text-amber-800 font-bold">⚠️ Kewajiban Hijau</span>
                        )}
                      </div>
                      <span className="font-mono font-semibold">{formatIDR(item.amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ARUS KAS */}
      {activeTab === 'arus-kas' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Laporan Arus Kas Konsolidasi (Metode Langsung)
              </h3>
              <p className="text-xs text-gray-500">
                Menampilkan pengeluaran kas operasional dan investasi berwawasan lingkungan
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <h5 className="font-bold text-gray-900">1. Arus Kas dari Aktivitas Operasi</h5>
              <div className="flex justify-between pl-4 text-gray-700">
                <span>Penerimaan kas dari pelanggan produk hijau & konvensional</span>
                <span className="font-mono font-medium">Rp 184.200.000.000</span>
              </div>
              <div className="flex justify-between pl-4 text-rose-700">
                <span>Pembayaran kas untuk operasional & bahan baku ramah lingkungan</span>
                <span className="font-mono font-medium">(Rp 112.500.000.000)</span>
              </div>
              <div className="flex justify-between pl-4 text-emerald-800 font-medium bg-emerald-50/70 p-1 rounded">
                <span>Pengeluaran operasional pengelolaan limbah, IPAL & kalibrasi CEMS</span>
                <span className="font-mono font-medium">(Rp 5.420.000.000)</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
                <span>Arus Kas Bersih dari Aktivitas Operasi</span>
                <span className="font-mono">Rp 42.680.000.000</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <h5 className="font-bold text-gray-900">2. Arus Kas dari Aktivitas Investasi Hijau</h5>
              <div className="flex justify-between pl-4 text-rose-700">
                <span>Investasi instalasi Solar Rooftop 1.8 MWp & Inverter Motor Tanur</span>
                <span className="font-mono font-medium">(Rp 8.200.000.000)</span>
              </div>
              <div className="flex justify-between pl-4 text-emerald-800 font-medium bg-emerald-50/70 p-1 rounded">
                <span>Perolehan Sertifikat Kredit Karbon Terverifikasi (SPE-GRK)</span>
                <span className="font-mono font-medium">(Rp 360.000.000)</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
                <span>Arus Kas Bersih Digunakan untuk Investasi</span>
                <span className="font-mono text-rose-700">(Rp 12.800.000.000)</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <h5 className="font-bold text-gray-900">3. Arus Kas dari Aktivitas Pendanaan</h5>
              <div className="flex justify-between pl-4 text-gray-700">
                <span>Pencairan Fasilitas Green Loan Bank Mandiri (Suku Bunga Preferensial)</span>
                <span className="font-mono font-medium">Rp 15.000.000.000</span>
              </div>
              <div className="flex justify-between pl-4 text-rose-700">
                <span>Pembayaran Dividen Kas Pemegang Saham</span>
                <span className="font-mono font-medium">(Rp 12.000.000.000)</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
                <span>Kenaikan Bersih Kas dan Setara Kas</span>
                <span className="font-mono text-emerald-700">Rp 19.480.000.000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CHART OF ACCOUNTS (COA) */}
      {activeTab === 'coa' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-base text-gray-900">Bagan Akun Terstandarisasi (Chart of Accounts)</h3>
              <p className="text-xs text-gray-500">
                Struktur klasifikasi akun keuangan konvensional dan sub-akun akuntansi hijau
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-gray-200 rounded-lg p-3 space-y-2">
              <h5 className="font-bold text-emerald-900 bg-emerald-50 p-1.5 rounded">Akun Aset & Kewajiban Lingkungan</h5>
              <ul className="space-y-1.5 text-gray-700">
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">1-1400</span>
                  <span className="font-medium">Aset Kredit Karbon Bersertifikat (SPE-GRK)</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">1-2300</span>
                  <span className="font-medium">Instalasi Fasilitas IPAL & Pengolahan Limbah</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">1-2400</span>
                  <span className="font-medium">Sistem Solar Rooftop & Sensor CEMS</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">2-1300</span>
                  <span className="font-medium text-rose-700">Utang Pajak Karbon Terestimasi</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">2-2100</span>
                  <span className="font-medium text-amber-800">Provisi Restorasi Lingkungan (PSAK 57)</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-3 space-y-2">
              <h5 className="font-bold text-emerald-900 bg-emerald-50 p-1.5 rounded">Akun Beban Operasional Hijau</h5>
              <ul className="space-y-1.5 text-gray-700">
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">5-1400</span>
                  <span className="font-medium">BOP Lingkungan: Pengolahan Limbah & IPAL</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">5-1410</span>
                  <span className="font-medium">BOP Lingkungan: Energi Efisiensi Operasional</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">6-2100</span>
                  <span className="font-medium">Beban Operasional Lingkungan (EMA General)</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">6-2200</span>
                  <span className="font-medium text-rose-700">Estimasi Beban Pajak Karbon</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">6-2300</span>
                  <span className="font-medium">Beban Provisi Restorasi Lingkungan</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono text-gray-500">6-2400</span>
                  <span className="font-medium">Beban Verifikasi & Monitoring Lingkungan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Transaksi Keuangan */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Input Transaksi Jurnal Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Kategori Akuntansi</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                  >
                    <option value="Beban Lingkungan">Beban Lingkungan</option>
                    <option value="Aset Lingkungan">Aset Lingkungan</option>
                    <option value="Kewajiban Lingkungan">Kewajiban Lingkungan</option>
                    <option value="Pendapatan">Pendapatan</option>
                    <option value="Beban Operasional">Beban Operasional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Pilih Akun Terkait</label>
                <select
                  value={newAccountCode}
                  onChange={(e) => {
                    setNewAccountCode(e.target.value);
                    if (e.target.value === '6-2200') setNewAccountName('Estimasi Beban Pajak Karbon');
                    if (e.target.value === '5-1400') setNewAccountName('BOP Lingkungan: Pengolahan Limbah & IPAL');
                    if (e.target.value === '6-2400') setNewAccountName('Beban Verifikasi & Monitoring Lingkungan');
                    if (e.target.value === '1-1400') setNewAccountName('Aset Kredit Karbon Bersertifikat');
                    if (e.target.value === '6-2300') setNewAccountName('Beban Provisi Restorasi Lingkungan');
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                >
                  <option value="6-2200">6-2200 - Estimasi Beban Pajak Karbon</option>
                  <option value="5-1400">5-1400 - BOP Lingkungan: Pengolahan Limbah & IPAL</option>
                  <option value="6-2400">6-2400 - Beban Verifikasi & Monitoring Lingkungan</option>
                  <option value="1-1400">1-1400 - Aset Kredit Karbon Bersertifikat</option>
                  <option value="6-2300">6-2300 - Beban Provisi Restorasi Lingkungan</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Deskripsi Transaksi</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Misal: Akrual beban pengelolaan limbah B3 triwulan IV"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Nominal (Rupiah)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Posisi Akun</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={newIsDebit}
                        onChange={() => setNewIsDebit(true)}
                      />
                      <span>Debit</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!newIsDebit}
                        onChange={() => setNewIsDebit(false)}
                      />
                      <span>Kredit</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Klasifikasi Lingkungan</label>
                <select
                  value={newEnvClass}
                  onChange={(e) => setNewEnvClass(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                >
                  <option value="Pajak & Kepatuhan">Pajak & Kepatuhan</option>
                  <option value="Pengolahan Limbah">Pengolahan Limbah</option>
                  <option value="Efisiensi Energi">Efisiensi Energi</option>
                  <option value="Restorasi Lingkungan">Restorasi Lingkungan</option>
                  <option value="Pencegahan Polusi">Pencegahan Polusi</option>
                  <option value="Non-Lingkungan">Non-Lingkungan</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2F7D4A] hover:bg-[#25683d] text-white rounded-lg font-semibold cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail Transaksi */}
      {selectedTrx && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Rincian Transaksi Keuangan</h3>
              <button onClick={() => setSelectedTrx(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">ID Transaksi:</span>
                <span className="font-mono font-bold text-gray-900">{selectedTrx.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Tanggal Posting:</span>
                <span className="text-gray-900 font-medium">{selectedTrx.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Kode & Nama Akun:</span>
                <span className="text-gray-900 font-medium">{selectedTrx.accountNumber} - {selectedTrx.accountName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Pusat Biaya (Cost Center):</span>
                <span className="font-mono text-gray-900">{selectedTrx.costCenter}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Klasifikasi Lingkungan:</span>
                <span className="font-semibold text-emerald-700">{selectedTrx.environmentalClassification}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Nominal Debit:</span>
                <span className="font-mono font-bold text-gray-900">{formatIDR(selectedTrx.debit)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Nominal Kredit:</span>
                <span className="font-mono font-bold text-gray-900">{formatIDR(selectedTrx.credit)}</span>
              </div>
              <div className="py-1">
                <span className="text-gray-500 block mb-1">Keterangan Jurnal:</span>
                <p className="p-2 bg-gray-50 rounded text-gray-700 border border-gray-100 leading-relaxed">
                  {selectedTrx.description}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTrx(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
