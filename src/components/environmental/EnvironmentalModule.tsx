import React, { useState } from 'react';
import {
  Leaf,
  Droplets,
  Zap,
  Trash2,
  Wind,
  ShieldCheck,
  Building,
  Layers,
  ArrowRight,
  TrendingDown,
  Clock,
  Radio,
  Search,
  Filter,
  BarChart2,
  DollarSign,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  EnvironmentalReading,
  EnvironmentalCostAllocation,
} from '../../types';
import { formatIDR, formatNumber } from '../../utils/formatters';

interface EnvironmentalModuleProps {
  readings: EnvironmentalReading[];
  costAllocations: EnvironmentalCostAllocation[];
}

export const EnvironmentalModule: React.FC<EnvironmentalModuleProps> = ({
  readings,
  costAllocations,
}) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'alokasi' | 'transaksi-fisik' | 'ema-flow'>('alokasi');
  const [unitFilter, setUnitFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected reading for detail view
  const [selectedReading, setSelectedReading] = useState<EnvironmentalReading | null>(null);

  // Filtered readings
  const filteredReadings = readings.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productionUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.indicator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = unitFilter === 'Semua' || r.productionUnit === unitFilter;
    return matchesSearch && matchesUnit;
  });

  // Calculate totals
  const totalAllocatedCost = costAllocations.reduce((sum, c) => sum + c.totalCost, 0);

  // Chart data for cost allocation per unit
  const allocationChartData = costAllocations.map((a) => ({
    name: a.unitName.split(' ')[1] || a.unitName,
    fullName: a.unitName,
    Energi: a.energyCost / 1_000_000,
    Limbah: a.wasteCost / 1_000_000,
    Air: a.waterTreatmentCost / 1_000_000,
    Restorasi: a.restorationCost / 1_000_000,
    Monitoring: a.complianceCost / 1_000_000,
    PajakKarbon: a.carbonTaxEstimated / 1_000_000,
  }));

  // EMA product category allocation
  const productAllocation = [
    { product: 'Beton Ramah Lingkungan (Green Concrete)', volume: '45.000 Ton', cost: 2850000000, carbonIntensity: '0.18 tCO2e/Ton', color: '#2F7D4A' },
    { product: 'Semen Komposit Rendah Karbon (PPC)', volume: '38.000 Ton', cost: 2420000000, carbonIntensity: '0.24 tCO2e/Ton', color: '#173D2B' },
    { product: 'Agregat Daur Ulang Paving Block', volume: '22.000 Ton', cost: 1350000000, carbonIntensity: '0.08 tCO2e/Ton', color: '#6A9B7E' },
    { product: 'Mortar Khusus Pracetak Ramah Lingkungan', volume: '16.000 Ton', cost: 1200000000, carbonIntensity: '0.15 tCO2e/Ton', color: '#A9C7A8' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#2F7D4A]" />
            Akuntansi Manajemen Lingkungan (EMA)
          </h2>
          <p className="text-xs text-gray-500">
            Kombinasi Environmental Material Flow Cost Accounting (MFCA) dan alokasi biaya moneter berbasis aktivitas manufaktur.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs text-xs">
          <button
            onClick={() => setActiveTab('alokasi')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'alokasi' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Alokasi Biaya Lingkungan
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'monitoring' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pemantauan Fisik & Sensor
          </button>
          <button
            onClick={() => setActiveTab('transaksi-fisik')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'transaksi-fisik' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Catatan Transaksi Lingkungan
          </button>
          <button
            onClick={() => setActiveTab('ema-flow')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'ema-flow' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Alur Konversi Fisik-ke-Moneter
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Energi & Emisi Boiler</span>
          </div>
          <div className="text-lg font-bold text-gray-900">Rp 3,81 Miliar</div>
          <p className="text-[11px] text-gray-500 mt-1">48.7% dari total biaya lingkungan</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>Pengolahan Air & IPAL</span>
          </div>
          <div className="text-lg font-bold text-gray-900">Rp 1,70 Miliar</div>
          <p className="text-[11px] text-gray-500 mt-1">BOD rata-rata 24,5 mg/L (Baku Mutu 50)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Trash2 className="w-4 h-4 text-emerald-600" />
            <span>Pengelolaan Limbah Padat</span>
          </div>
          <div className="text-lg font-bold text-gray-900">Rp 1,49 Miliar</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">84.9% daur ulang sirkular</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <DollarSign className="w-4 h-4 text-rose-600" />
            <span>Estimasi Pajak Karbon Terakru</span>
          </div>
          <div className="text-lg font-bold text-rose-700">Rp 97,20 Juta</div>
          <p className="text-[11px] text-gray-500 mt-1">Kelebihan kuota 3.240 tCO₂e</p>
        </div>
      </div>

      {/* TAB 1: ALOKASI BIAYA LINGKUNGAN (Cost Allocation by Unit & Product) */}
      {activeTab === 'alokasi' && (
        <div className="space-y-6">
          {/* Chart: Alokasi Biaya per Unit Produksi */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Alokasi Biaya Lingkungan ke Unit Operasional Manufaktur
                </h3>
                <p className="text-xs text-gray-500">
                  Penguraian biaya energi, limbah, IPAL, restorasi, monitoring, dan pajak karbon (dalam Juta Rupiah)
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Total Alokasi: {formatIDR(totalAllocatedCost)}
              </span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allocationChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `Rp${val}Jt`} />
                  <Tooltip
                    formatter={(val: any, name: any) => [`Rp ${Number(val).toLocaleString('id-ID')} Juta`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Energi" stackId="a" fill="#2F7D4A" />
                  <Bar dataKey="Limbah" stackId="a" fill="#173D2B" />
                  <Bar dataKey="Air" stackId="a" fill="#6A9B7E" />
                  <Bar dataKey="Restorasi" stackId="a" fill="#A9C7A8" />
                  <Bar dataKey="Monitoring" stackId="a" fill="#8884d8" />
                  <Bar dataKey="PajakKarbon" stackId="a" fill="#E06D53" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table: Breakdown per Unit */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-[#F7F8F4] flex justify-between items-center">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                Matriks Pembebanan Biaya Lingkungan per Unit Produksi
              </h4>
              <span className="text-[11px] text-gray-500">Metode: Activity-Based Environmental Costing (ABEC)</span>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 font-semibold text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Unit Produksi</th>
                    <th className="py-2.5 px-3 text-right">Biaya Energi</th>
                    <th className="py-2.5 px-3 text-right">Limbah Padat</th>
                    <th className="py-2.5 px-3 text-right">Air / IPAL</th>
                    <th className="py-2.5 px-3 text-right">Restorasi</th>
                    <th className="py-2.5 px-3 text-right">Pajak Karbon</th>
                    <th className="py-2.5 px-3 text-right font-bold text-gray-900">Total Biaya (IDR)</th>
                    <th className="py-2.5 px-3 text-right">Biaya per Ton</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {costAllocations.map((alloc, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-semibold text-gray-900">{alloc.unitName}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatIDR(alloc.energyCost)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatIDR(alloc.wasteCost)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatIDR(alloc.waterTreatmentCost)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatIDR(alloc.restorationCost)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-700">{formatIDR(alloc.carbonTaxEstimated)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900 bg-emerald-50/50">
                        {formatIDR(alloc.totalCost)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-600">
                        {alloc.costPerTon > 0 ? `Rp ${alloc.costPerTon.toLocaleString('id-ID')}/Ton` : 'N/A (Utilitas)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alokasi per Kategori Produk Hijau */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Alokasi Biaya Lingkungan ke Kategori Produk (Green Product Accounting)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {productAllocation.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-gray-200 bg-[#F7F8F4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{p.product}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Output: <span className="font-semibold text-gray-800">{p.volume}</span>
                  </div>
                  <div className="text-base font-bold text-gray-900 font-mono">
                    {formatIDR(p.cost)}
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Intensitas:</span>
                    <span className="font-semibold text-emerald-700">{p.carbonIntensity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PEMANTAUAN FISIK & SENSOR (CEMS & SCADA Telemetry) */}
      {activeTab === 'monitoring' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Integrasi Telemetri Sensor Lingkungan (IoT & SCADA)
              </h3>
              <p className="text-xs text-gray-500">
                Pengukuran real-time emisi cerobong, aliran limbah cair IPAL, dan daya listrik
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                Live Telemetri Aktif
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Sensor CEMS */}
            <div className="p-4 rounded-xl border border-gray-200 bg-[#F7F8F4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-emerald-600" />
                  CEMS Cerobong Boiler A
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                  ONLINE 99.4%
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Konsentrasi Partikulat:</span>
                  <span className="font-mono font-bold text-gray-900">32.4 mg/Nm³ (Baku: 150)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Emisi Sulfur Dioksida (SO₂):</span>
                  <span className="font-mono font-bold text-gray-900">118 mg/Nm³ (Baku: 550)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Emisi Nitrogen Oksida (NOₓ):</span>
                  <span className="font-mono font-bold text-gray-900">210 mg/Nm³ (Baku: 650)</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Terhubung ke SISPEK KLHK</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>

            {/* Sensor IPAL */}
            <div className="p-4 rounded-xl border border-gray-200 bg-[#F7F8F4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  Smart Flowmeter IPAL Outlet
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">
                  TERKALIBRASI
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>BOD (Biochemical Oxygen):</span>
                  <span className="font-mono font-bold text-gray-900">24.5 mg/L (Baku: 50)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>COD (Chemical Oxygen):</span>
                  <span className="font-mono font-bold text-gray-900">68.2 mg/L (Baku: 100)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Derajat Keasaman (pH):</span>
                  <span className="font-mono font-bold text-gray-900">7.2 (Baku: 6.0 - 9.0)</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Debit Aliran: 14.8 m³/jam</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>

            {/* Sensor SCADA Daya */}
            <div className="p-4 rounded-xl border border-gray-200 bg-[#F7F8F4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  SCADA Power Tanur & Finishing
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                  ACTIVE
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Beban Puncak Aktif:</span>
                  <span className="font-mono font-bold text-gray-900">2.840 kVA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kontribusi Solar Rooftop:</span>
                  <span className="font-mono font-bold text-emerald-700">18.4% (Green Power)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Faktor Emisi Scope 2:</span>
                  <span className="font-mono font-bold text-gray-900">0.85 kg CO₂/kWh</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Integrasi ke Ledger Hash</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATATAN TRANSAKSI LINGKUNGAN */}
      {activeTab === 'transaksi-fisik' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F7F8F4]">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari ID sensor, unit produksi, indikator..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white text-xs border border-gray-200 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="bg-white px-2 py-1.5 border border-gray-200 rounded-lg outline-hidden text-xs cursor-pointer"
                >
                  <option value="Semua">Semua Unit</option>
                  <option value="Unit Boiler A">Unit Boiler A</option>
                  <option value="Unit Smelting & Tanur">Unit Smelting & Tanur</option>
                  <option value="Unit Finishing">Unit Finishing</option>
                  <option value="Instalasi IPAL">Instalasi IPAL</option>
                  <option value="Utilitas & Kompresor">Utilitas & Kompresor</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-gray-500">
              Total {filteredReadings.length} Telemetri Tercatat
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#f2f4ee] text-gray-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-3">Waktu & ID</th>
                  <th className="py-3 px-3">Lokasi Pabrik</th>
                  <th className="py-3 px-3">Unit Produksi</th>
                  <th className="py-3 px-3">Indikator Terukur</th>
                  <th className="py-3 px-3 text-right">Nilai Terukur</th>
                  <th className="py-3 px-3">Dampak Lingkungan</th>
                  <th className="py-3 px-3 text-right">Ekuivalen Moneter (EMA)</th>
                  <th className="py-3 px-3 text-center">Sumber Data</th>
                  <th className="py-3 px-3 text-center">Status Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReadings.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 block">{r.id}</span>
                      <span className="text-[11px] text-gray-500">{r.timestamp}</span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-700 whitespace-nowrap">{r.factoryLocation}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-800 whitespace-nowrap">{r.productionUnit}</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-medium whitespace-nowrap">{r.indicator}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                      {formatNumber(r.measuredValue, 1)} {r.unit}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 max-w-xs truncate" title={r.calculatedImpact}>
                      {r.calculatedImpact}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-gray-900 font-medium whitespace-nowrap">
                      {formatIDR(r.monetaryEquivalent)}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-mono">
                        {r.dataSource}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        {r.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ALUR KONVERSI FISIK KE MONETER (EMA Flow Diagram) */}
      {activeTab === 'ema-flow' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-gray-200">
            <h3 className="font-bold text-base text-gray-900">
              Metodologi Akuntansi Manajemen Lingkungan (Konversi Fisik ke Moneter)
            </h3>
            <p className="text-xs text-gray-500">
              Bagaimana data pengukuran volume fisik sensor dikonversikan menjadi angka moneter yang siap diintegrasikan ke laporan laba rugi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                Tahap 1: Pengukuran Fisik
              </span>
              <h5 className="font-bold text-gray-900">Mass & Energy Balance</h5>
              <p className="text-gray-600 leading-relaxed">
                Sensor CEMS, power meter, dan weighbridge mengukur konsumsi solar (L), listrik PLN (kWh), air tanah (m³), dan limbah (Ton).
              </p>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-emerald-200">
                Contoh: 142.8 tCO₂e Scope 1 dari Boiler A
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                Tahap 2: Valuasi Moneter (EMA)
              </span>
              <h5 className="font-bold text-gray-900">Tarif Satuan & Biaya Restorasi</h5>
              <p className="text-gray-600 leading-relaxed">
                Sistem mengalikan unit fisik dengan biaya bahan kimia pengolah, tarif listrik industri, biaya disposal PPLI, dan tarif pajak karbon.
              </p>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-emerald-200">
                Formula: KWh × Tarif PLN + Solar × Harga Solar
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                Tahap 3: Pembebanan Finansial
              </span>
              <h5 className="font-bold text-gray-900">Alokasi ke HPP & Jurnal ERP</h5>
              <p className="text-gray-600 leading-relaxed">
                Biaya lingkungan dibebankan ke akun BOP Manufaktur (Akun 5-1400) dan Beban Operasional Umum (Akun 6-2200), mempengaruhi laba kotor & bersih.
              </p>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-emerald-200">
                Posting: Debit BOP Lingkungan Rp 3,2 M
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
