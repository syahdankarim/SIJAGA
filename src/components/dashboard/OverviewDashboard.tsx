import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  DollarSign,
  CloudRain,
  Flame,
  Zap,
  Recycle,
  CheckCircle2,
  FileText,
  BarChart3,
  Calendar,
  Leaf,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MonthlyTrendData, NavigationTab, CarbonConfig } from '../../types';
import { formatIDR, formatIDRShort, formatNumber } from '../../utils/formatters';

interface OverviewDashboardProps {
  monthlyData: MonthlyTrendData[];
  carbonConfig: CarbonConfig;
  onNavigate: (tab: NavigationTab) => void;
  onSimulateEnergySaving?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  monthlyData,
  carbonConfig,
  onNavigate,
}) => {
  const [selectedChartFilter, setSelectedChartFilter] = useState<'12M' | '6M' | '3M'>('12M');
  const [showAiModal, setShowAiModal] = useState(false);

  // Compute aggregated numbers
  const filteredData = selectedChartFilter === '3M'
    ? monthlyData.slice(-3)
    : selectedChartFilter === '6M'
    ? monthlyData.slice(-6)
    : monthlyData;

  const totalRevenue = monthlyData.reduce((acc, curr) => acc + curr.revenue * 1_000_000, 0);
  const totalOpex = monthlyData.reduce((acc, curr) => acc + curr.operatingExpense * 1_000_000, 0);
  const totalNetProfit = monthlyData.reduce((acc, curr) => acc + curr.netProfit * 1_000_000, 0);
  const totalEnvCost = monthlyData.reduce((acc, curr) => acc + curr.environmentalCost * 1_000_000, 0);

  const totalEmissions = monthlyData.reduce((acc, curr) => acc + curr.carbonEmissions, 0);
  const totalEnergyMWh = monthlyData.reduce((acc, curr) => acc + curr.energyKWh, 0) / 1000;
  const totalWaste = monthlyData.reduce((acc, curr) => acc + curr.wasteTon, 0);
  const totalRecycled = monthlyData.reduce((acc, curr) => acc + curr.recycledTon, 0);
  const averageRecyclingRate = (totalRecycled / totalWaste) * 100;

  // Carbon tax calculations
  const taxableEmissions = Math.max(0, totalEmissions - carbonConfig.carbonCap);
  const estimatedCarbonTax = taxableEmissions * carbonConfig.taxTariff;
  const remainingAllowance = Math.max(0, carbonConfig.carbonCap - totalEmissions);
  const emissionIntensity = totalEmissions / (totalRevenue / 1_000_000_000); // tCO2e per Rp 1 Miliar Omzet

  // Cost breakdown data
  const envCostBreakdown = [
    { name: 'Konsumsi Energi Bersih', value: 3200000000, color: '#2F7D4A' },
    { name: 'Pengolahan Limbah & IPAL', value: 2450000000, color: '#173D2B' },
    { name: 'Restorasi & Revegetasi', value: 750000000, color: '#A9C7A8' },
    { name: 'Monitoring & Sensor CEMS', value: 522800000, color: '#4B7B61' },
    { name: 'Estimasi Pajak Karbon', value: estimatedCarbonTax, color: '#E06D53' },
    { name: 'Sertifikasi & Audit Hijau', value: 800000000, color: '#6A9B7E' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Executive Alert */}
      <div className="bg-gradient-to-r from-[#173D2B] to-[#25583e] text-white rounded-2xl p-6 shadow-sm border border-[#2b6547] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Laporan Terintegrasi 2025
              </span>
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Periode Fiskal Tahunan
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Sistem Akuntansi Lingkungan & Kinerja Karbon
            </h2>
            <p className="text-xs md:text-sm text-[#A9C7A8] max-w-2xl">
              Integrasi langsung pengukuran fisik telemetri IoT dengan Laporan Laba Rugi, Neraca, dan Estimasi Kewajiban Pajak Karbon.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('linkage')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Otomatisasi Jurnal (1 Siap)</span>
            </button>
            <button
              onClick={() => setShowAiModal(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Ringkasan Eksekutif AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section 1: Financial Performance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#2F7D4A]" />
            Indikator Finansial Terintegrasi
          </h3>
          <span className="text-[11px] text-gray-500">Mata Uang: IDR (Rupiah)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Total Pendapatan Bersih</span>
              <span className="flex items-center text-emerald-600 font-semibold text-[11px]">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +8.4%
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 mt-2">
              {formatIDRShort(totalRevenue)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>vs Periode Sebelumnya: Rp 171,0 M</span>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded">Menguntungkan</span>
            </div>
          </div>

          {/* Opex */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Beban Operasional (Opex)</span>
              <span className="flex items-center text-amber-600 font-semibold text-[11px]">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2%
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 mt-2">
              {formatIDRShort(totalOpex)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Efisiensi rasio: 76.7%</span>
              <span className="text-[10px] text-gray-600 font-medium bg-gray-100 px-1.5 py-0.2 rounded">Sesuai Target</span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Laba Bersih (Net Income)</span>
              <span className="flex items-center text-emerald-600 font-semibold text-[11px]">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +14.6%
              </span>
            </div>
            <div className="text-xl font-bold text-emerald-800 mt-2">
              {formatIDRShort(totalNetProfit)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Margin Bersih: 17.2%</span>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded">Menguntungkan</span>
            </div>
          </div>

          {/* Environmental Cost */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Beban Lingkungan (EMA)</span>
              <span className="flex items-center text-emerald-600 font-semibold text-[11px]">
                <TrendingDown className="w-3 h-3 mr-0.5" /> -5.1%
              </span>
            </div>
            <div className="text-xl font-bold text-[#173D2B] mt-2">
              {formatIDRShort(totalEnvCost)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Porsi Pendapatan: 4.21%</span>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded">Efisien (Favorable)</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Section 2: Environmental & Carbon Impact */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-[#2F7D4A]" />
            Metrik Lingkungan & Manajemen Karbon
          </h3>
          <span className="text-[11px] text-gray-500">Satuan Emisi: tCO₂e | Energi: MWh</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Carbon Emissions */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Total Emisi Karbon GRK</span>
              <span className="flex items-center text-emerald-600 font-semibold text-[11px]">
                <TrendingDown className="w-3 h-3 mr-0.5" /> -7.8% (Des vs Jan)
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 mt-2">
              {formatNumber(totalEmissions, 0)} <span className="text-xs font-normal text-gray-500">tCO₂e</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Batas Cap: {formatNumber(carbonConfig.carbonCap)} tCO₂e</span>
              <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.2 rounded">Kelebihan 3.240 t</span>
            </div>
          </div>

          {/* Carbon Emission Intensity */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Intensitas Emisi Karbon</span>
              <span className="flex items-center text-emerald-600 font-semibold text-[11px]">
                <TrendingDown className="w-3 h-3 mr-0.5" /> -12.4%
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 mt-2">
              {formatNumber(emissionIntensity, 2)} <span className="text-xs font-normal text-gray-500">tCO₂e / Rp Miliar</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Target Sektoral: &lt; 0.30</span>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded">Melampaui Benchmark</span>
            </div>
          </div>

          {/* Recycling Rate */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Rasio Daur Ulang Limbah</span>
              <span className="flex items-center text-emerald-600 font-semibold text-[11px]">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +6.1%
              </span>
            </div>
            <div className="text-xl font-bold text-emerald-700 mt-2">
              {formatNumber(averageRecyclingRate, 1)}%
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>1.516 Ton dari 1.840 Ton</span>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded">Zero Waste Target</span>
            </div>
          </div>

          {/* Estimated Carbon Tax Liability */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Estimasi Utang Pajak Karbon</span>
              <span className="flex items-center text-amber-600 font-semibold text-[11px]">
                Tarif: Rp 30.000/t
              </span>
            </div>
            <div className="text-xl font-bold text-rose-700 mt-2">
              {formatIDR(estimatedCarbonTax)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Emisi Kena Pajak: 3.240 t</span>
              <span className="text-[10px] text-rose-700 font-medium bg-rose-50 px-1.5 py-0.2 rounded">Kewajiban Akrual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section (6 Enterprise Charts) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2F7D4A]" />
              Visualisasi Analitik Akuntansi Lingkungan
            </h3>
            <p className="text-xs text-gray-500">
              Hubungan interaktif performa finansial, konsumsi sumber daya, dan kepatuhan karbon.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 self-start sm:self-auto text-xs">
            {(['12M', '6M', '3M'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedChartFilter(filter)}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  selectedChartFilter === filter
                    ? 'bg-[#173D2B] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter === '12M' ? '12 Bulan' : filter === '6M' ? '6 Bulan Terakhir' : '3 Bulan Terakhir'}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid: 2 rows of 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Chart 1: Pendapatan vs Beban Lingkungan */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="mb-3">
              <h4 className="text-xs font-bold text-gray-800">1. Pendapatan vs Beban Lingkungan</h4>
              <p className="text-[11px] text-gray-500">Perbandingan pertumbuhan omzet dengan pengeluaran EMA (Juta IDR)</p>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(val) => `Rp${val/1000}M`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(val) => `Rp${val}Jt`} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      name === 'Beban Lingkungan' ? `Rp ${value} Juta` : `Rp ${value} Juta`,
                      name,
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="revenue" name="Pendapatan Bersih" fill="#2F7D4A" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="environmentalCost" name="Beban Lingkungan" stroke="#E06D53" strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Emisi Karbon Bulanan */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="mb-3">
              <h4 className="text-xs font-bold text-gray-800">2. Emisi Karbon Bulanan (Scope 1 & 2)</h4>
              <p className="text-[11px] text-gray-500">Realisasi emisi per bulan (tCO₂e) dari seluruh unit pabrik</p>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#173D2B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#173D2B" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[3500, 4500]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: any) => [`${value} tCO₂e`, 'Emisi Terukur']} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="carbonEmissions" name="Emisi Terverifikasi (tCO₂e)" stroke="#173D2B" fillOpacity={1} fill="url(#colorEmission)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Tren Konsumsi Energi */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="mb-3">
              <h4 className="text-xs font-bold text-gray-800">3. Tren Konsumsi Listrik & Bahan Bakar</h4>
              <p className="text-[11px] text-gray-500">Daya listrik (Ribu kWh) vs Bio-solar/Gas (Ribu Liter)</p>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="kwh" tick={{ fontSize: 10 }} domain={[1700, 2200]} />
                  <YAxis yAxisId="liter" orientation="right" tick={{ fontSize: 10 }} domain={[80, 115]} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="kwh" dataKey="energyKWh" name="Listrik (Ribu kWh)" fill="#A9C7A8" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="liter" type="monotone" dataKey="fuelLiters" name="Bahan Bakar (Ribu Liter)" stroke="#2F7D4A" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Rincian Biaya Lingkungan (Breakdown) */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="mb-3">
              <h4 className="text-xs font-bold text-gray-800">4. Rincian Biaya Lingkungan (EMA Breakdown)</h4>
              <p className="text-[11px] text-gray-500">Distribusi pengeluaran lingkungan tahun berjalan</p>
            </div>
            <div className="h-60 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={envCostBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {envCostBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatIDR(Number(value))} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Emisi Karbon vs Carbon Cap */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="mb-3">
              <h4 className="text-xs font-bold text-gray-800">5. Emisi Karbon vs Batas Cap Bulanan</h4>
              <p className="text-[11px] text-gray-500">Garis merah mengindikasikan batas atas kuota per bulan (3.750 tCO₂e)</p>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[3400, 4400]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: any, name: any) => [`${value} tCO₂e`, name]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="carbonEmissions" name="Realisasi Emisi" fill="#7C857D" radius={[3, 3, 0, 0]} />
                  <Line type="monotone" dataKey="carbonCapMonthly" name="Batas Cap Bulanan" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 6: Profitabilitas vs Kinerja Lingkungan */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="mb-3">
              <h4 className="text-xs font-bold text-gray-800">6. Profitabilitas vs Tingkat Daur Ulang</h4>
              <p className="text-[11px] text-gray-500">Membuktikan hubungan positif sirkularitas limbah dengan laba bersih</p>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="profit" tick={{ fontSize: 10 }} tickFormatter={(v) => `Rp${v/1000}M`} />
                  <YAxis yAxisId="recycle" orientation="right" domain={[75, 90]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="profit" dataKey="netProfit" name="Laba Bersih (Juta)" fill="#173D2B" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="recycle" type="monotone" dataKey="recyclingRate" name="Rasio Daur Ulang (%)" stroke="#2F7D4A" strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* AI Executive Summary Card (Embedded directly on dashboard) */}
      <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-2xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2F7D4A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">
                Ringkasan Eksekutif AI (EcoTrace Intelligence)
              </h4>
              <p className="text-xs text-gray-500">
                Analisis otomatis terkonsolidasi data keuangan, sensor CEMS, dan kewajiban pajak karbon
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai')}
            className="text-xs text-[#2F7D4A] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            Buka Modul AI Lengkap <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#F7F8F4] p-3 rounded-lg border border-gray-100">
            <span className="font-bold text-gray-800 block mb-1">1. Kondisi Finansial</span>
            <p className="text-gray-600 leading-relaxed">
              Laba bersih naik 14,6% YOY ke Rp 31,85 M. Beban lingkungan (Rp 7,82 M) berada di level 4,21% pendapatan, menunjukkan efisiensi operasional yang sehat.
            </p>
          </div>

          <div className="bg-[#F7F8F4] p-3 rounded-lg border border-gray-100">
            <span className="font-bold text-gray-800 block mb-1">2. Kinerja Emisi Karbon</span>
            <p className="text-gray-600 leading-relaxed">
              Total emisi 48.240 tCO₂e melampaui cap tahunan sebesar 3.240 tCO₂e. Namun intensitas emisi turun dari 0,29 ke 0,26 tCO₂e/Miliar IDR.
            </p>
          </div>

          <div className="bg-[#F7F8F4] p-3 rounded-lg border border-gray-100">
            <span className="font-bold text-gray-800 block mb-1">3. Potensi Penghematan Biaya</span>
            <p className="text-gray-600 leading-relaxed">
              Optimasi soot-blowing Boiler A & perbaikan kebocoran kompresor berpotensi memotong biaya energi Rp 192 Jt/tahun dan menurunkan pajak Rp 28,4 Jt.
            </p>
          </div>

          <div className="bg-[#F7F8F4] p-3 rounded-lg border border-gray-100">
            <span className="font-bold text-emerald-800 block mb-1">4. Rekomendasi Manajemen</span>
            <p className="text-gray-600 leading-relaxed">
              Setujui proposal jurnal akrual pajak karbon Rp 97,2 Jt dan percepat pengadaan biomassa cangkang sawit untuk kuartal I 2026.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-gray-500">Tindakan Cepat:</span>
          <button
            onClick={() => onNavigate('linkage')}
            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Review Jurnal Pajak Karbon Rp 97,2 Jt
          </button>
          <button
            onClick={() => onNavigate('carbon')}
            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
          >
            Simulasi Penurunan Energi
          </button>
          <button
            onClick={() => onNavigate('blockchain')}
            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
          >
            Audit Validitas Blok CEMS #104
          </button>
        </div>
      </div>

      {/* Interactive Modal for In-depth AI Synthesis */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2F7D4A]" />
                <h3 className="font-bold text-base text-gray-900">
                  Laporan Sintesis Eksekutif AI
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gray-700">
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 text-emerald-900">
                <p className="font-semibold mb-1">Kesimpulan Kunci Dewan Direksi:</p>
                <p>
                  PT Eco Manufacturing Indonesia berhasil mempertahankan rasio pertumbuhan laba bersih di atas 14% dengan menekan rasio beban lingkungan ke 4,21%. Penurunan emisi bulanan di akhir tahun (3.800 tCO₂e) mencerminkan keberhasilan efisiensi inverter motor tanur.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-900 mb-1">Tiga Prioritas Kuartal Depan:</h5>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Mengurangi emisi kelebihan 3.240 tCO₂e agar terhindar dari eskalasi pajak karbon 2026.</li>
                  <li>Memperluas pemanfaatan 1.200 unit kredit karbon bersertifikat SPE-GRK sebagai aset offset.</li>
                  <li>Peningkatan rasio pemulihan air daur ulang IPAL dari 68% ke 80% untuk mengamankan sertifikasi PROPER Emas.</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowAiModal(false);
                  onNavigate('reports');
                }}
                className="px-4 py-2 bg-[#2F7D4A] hover:bg-[#25683d] text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cetak Laporan Lengkap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
