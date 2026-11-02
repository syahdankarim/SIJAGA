import React, { useState } from 'react';
import {
  Gauge,
  Flame,
  Scale,
  Sliders,
  DollarSign,
  TrendingDown,
  Info,
  ShieldAlert,
  ArrowRight,
  Sun,
  Zap,
  CheckCircle2,
  RefreshCw,
  Award,
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
  ReferenceLine,
} from 'recharts';
import { CarbonConfig, MonthlyTrendData } from '../../types';
import { formatIDR, formatNumber } from '../../utils/formatters';

interface CarbonModuleProps {
  carbonConfig: CarbonConfig;
  onUpdateConfig: (config: CarbonConfig) => void;
  monthlyData: MonthlyTrendData[];
  onTriggerLinkage: () => void;
}

export const CarbonModule: React.FC<CarbonModuleProps> = ({
  carbonConfig,
  onUpdateConfig,
  monthlyData,
  onTriggerLinkage,
}) => {
  // Configurable parameters
  const [capSlider, setCapSlider] = useState<number>(carbonConfig.carbonCap);
  const [tariffSlider, setTariffSlider] = useState<number>(carbonConfig.taxTariff);
  
  // Operational Simulation Sliders
  const [solarRooftopPercent, setSolarRooftopPercent] = useState<number>(15); // 0 - 40%
  const [biomassSubstitutionPercent, setBiomassSubstitutionPercent] = useState<number>(10); // 0 - 30%
  const [boilerEfficiencyGain, setBoilerEfficiencyGain] = useState<number>(5); // 0 - 15%

  // Baseline calculations
  const baselineEmissions = monthlyData.reduce((acc, curr) => acc + curr.carbonEmissions, 0);

  // Simulated reductions based on user operational sliders
  // Scope 2 (grid electricity) ~40% of emissions = ~19.000 tCO2e -> solar reduces this
  const solarReduction = (baselineEmissions * 0.40) * (solarRooftopPercent / 100);
  // Scope 1 (boiler) ~60% of emissions = ~29.000 tCO2e -> biomass and efficiency reduces this
  const biomassReduction = (baselineEmissions * 0.45) * (biomassSubstitutionPercent / 100);
  const efficiencyReduction = (baselineEmissions * 0.15) * (boilerEfficiencyGain / 100);

  const totalReductionSimulated = Math.round(solarReduction + biomassReduction + efficiencyReduction);
  const effectiveEmissions = Math.max(0, baselineEmissions - totalReductionSimulated);

  // Carbon tax calculations
  const taxableEmissions = Math.max(0, effectiveEmissions - capSlider);
  const estimatedTaxLiability = taxableEmissions * tariffSlider;
  const remainingAllowance = Math.max(0, capSlider - effectiveEmissions);

  // Baseline tax without simulation
  const baselineTaxable = Math.max(0, baselineEmissions - capSlider);
  const baselineTax = baselineTaxable * tariffSlider;
  const taxSavingsFromSimulation = baselineTax - estimatedTaxLiability;

  // Monthly breakdown for chart
  const chartData = monthlyData.map((m) => {
    const monthlySimulated = Math.round(m.carbonEmissions * (1 - (totalReductionSimulated / baselineEmissions)));
    return {
      month: m.month,
      baseline: m.carbonEmissions,
      simulasi: monthlySimulated,
      cap: Math.round(capSlider / 12),
    };
  });

  const handleApplyConfig = () => {
    onUpdateConfig({
      ...carbonConfig,
      carbonCap: capSlider,
      taxTariff: tariffSlider,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-[#2F7D4A]" />
            Manajemen Karbon & Estimasi Pajak Karbon
          </h2>
          <p className="text-xs text-gray-500">
            Penetapan batas atas emisi (Cap-and-Tax), pemantauan emisi kena pajak, simulasi dekarbonisasi, dan aset kredit SPE-GRK.
          </p>
        </div>

        <button
          onClick={onTriggerLinkage}
          className="px-4 py-2 bg-[#2F7D4A] hover:bg-[#25683d] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <span>Buat Draf Jurnal Pajak Karbon</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main KPI Cards: Carbon Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Total Emissions */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block">Total Emisi Tahunan (Realisasi)</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {formatNumber(effectiveEmissions)} <span className="text-xs font-normal text-gray-500">tCO₂e</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            Pengurangan: -{formatNumber(totalReductionSimulated)} tCO₂e ({((totalReductionSimulated/baselineEmissions)*100).toFixed(1)}%)
          </div>
        </div>

        {/* Carbon Cap */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block">Batas Atas Kuota Emisi (Cap)</span>
          <div className="text-2xl font-bold text-[#173D2B] mt-1">
            {formatNumber(capSlider)} <span className="text-xs font-normal text-gray-500">tCO₂e</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Batas per bulan: {formatNumber(Math.round(capSlider / 12))} tCO₂e
          </p>
        </div>

        {/* Taxable Emissions */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block">Emisi Kena Pajak (Taxable)</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {formatNumber(taxableEmissions)} <span className="text-xs font-normal text-gray-500">tCO₂e</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {taxableEmissions > 0 ? 'Melebihi alokasi cap' : 'Di bawah batas cap (Tanpa Pajak)'}
          </p>
        </div>

        {/* Estimated Carbon Tax */}
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <span className="text-gray-600 block font-medium">Estimasi Beban Pajak Karbon</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">
            {formatIDR(estimatedTaxLiability)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Hemat: {formatIDR(taxSavingsFromSimulation)} via inisiatif hijau
          </div>
        </div>
      </div>

      {/* Two Columns: Config & Interactive Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Konfigurasi Parameter Regulasi */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2F7D4A]" />
              Parameter Regulasi & Nilai Ekonomi Karbon
            </h3>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
              Configurable Model
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider 1: Carbon Cap */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold text-gray-700">Batas Cap Emisi Tahunan (tCO₂e)</span>
                <span className="font-mono font-bold text-[#173D2B]">{formatNumber(capSlider)} tCO₂e</span>
              </div>
              <input
                type="range"
                min="35000"
                max="55000"
                step="500"
                value={capSlider}
                onChange={(e) => setCapSlider(Number(e.target.value))}
                className="w-full accent-[#2F7D4A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>35.000 t</span>
                <span>Ketat &lt;-- Kuota Cap --&gt; Longgar</span>
                <span>55.000 t</span>
              </div>
            </div>

            {/* Slider 2: Carbon Tax Tariff */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold text-gray-700">Tarif Pajak Karbon (Rp per tCO₂e)</span>
                <span className="font-mono font-bold text-rose-700">{formatIDR(tariffSlider)} / tCO₂e</span>
              </div>
              <input
                type="range"
                min="30000"
                max="100000"
                step="5000"
                value={tariffSlider}
                onChange={(e) => setTariffSlider(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Rp 30.000 (Dasar UU HPP)</span>
                <span>Skenario Pasar Karbon</span>
                <span>Rp 100.000</span>
              </div>
            </div>

            {/* Aset Kredit Karbon SPE-GRK */}
            <div className="bg-[#F7F8F4] p-3 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Kredit Karbon Bersertifikat (SPE-GRK)
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                  1.200 Unit Aktif
                </span>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                PT Eco Manufacturing Indonesia memiliki 1.200 kredit SPE-GRK dari proyek PLTMH bernilai perolehan Rp 360 Juta. Kredit ini siap dimanfaatkan sebagai mekanisme pengurang (offset) kepatuhan batas emisi.
              </p>
            </div>

            <button
              onClick={handleApplyConfig}
              className="w-full py-2 bg-[#173D2B] hover:bg-[#204e37] text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              Simpan & Terapkan Konfigurasi ke Sistem
            </button>
          </div>
        </div>

        {/* Panel 2: Simulasi Dekarbonisasi Operasional */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Simulasi Skenario Transisi Energi Bersih
            </h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              What-If Analysis
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider 1: Solar PV Rooftop */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold text-gray-700">Pemanfaatan Solar Rooftop (Scope 2)</span>
                <span className="font-mono font-bold text-amber-600">{solarRooftopPercent}% Daya Mandiri</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={solarRooftopPercent}
                onChange={(e) => setSolarRooftopPercent(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-gray-500 mt-0.5">
                Mereduksi: ~{formatNumber(Math.round(solarReduction))} tCO₂e emisi listrik PLN
              </p>
            </div>

            {/* Slider 2: Biomassa Cangkang Sawit */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold text-gray-700">Substitusi Biomassa Boiler (Scope 1)</span>
                <span className="font-mono font-bold text-emerald-700">{biomassSubstitutionPercent}% Substitusi Solar</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={biomassSubstitutionPercent}
                onChange={(e) => setBiomassSubstitutionPercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[10px] text-gray-500 mt-0.5">
                Mereduksi: ~{formatNumber(Math.round(biomassReduction))} tCO₂e emisi bahan bakar
              </p>
            </div>

            {/* Slider 3: Peningkatan Efisiensi Boiler */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold text-gray-700">Efisiensi Thermal Boiler & Flue Gas</span>
                <span className="font-mono font-bold text-[#173D2B]">{boilerEfficiencyGain}% Efisiensi</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={boilerEfficiencyGain}
                onChange={(e) => setBoilerEfficiencyGain(Number(e.target.value))}
                className="w-full accent-[#173D2B] cursor-pointer"
              />
              <p className="text-[10px] text-gray-500 mt-0.5">
                Mereduksi: ~{formatNumber(Math.round(efficiencyReduction))} tCO₂e via optimasi pembakaran
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="font-bold block">Hasil Simulasi Langsung:</span>
              <div className="flex justify-between">
                <span>Total Pengurangan Emisi Terproyeksi:</span>
                <span className="font-bold font-mono text-emerald-800">-{formatNumber(totalReductionSimulated)} tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span>Penurunan Utang Pajak Karbon:</span>
                <span className="font-bold font-mono text-emerald-800">Hemat {formatIDR(taxSavingsFromSimulation)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart: Realisasi vs Skenario vs Cap Bulanan */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900">
              Proyeksi Emisi Karbon Bulanan: Realisasi vs Skenario Efisiensi
            </h3>
            <p className="text-xs text-gray-500">
              Garis putus-putus merah menandai kuota batas cap per bulan ({formatNumber(Math.round(capSlider/12))} tCO₂e)
            </p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[3000, 4500]} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(val: any, name: any) => [`${val} tCO₂e`, name]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={Math.round(capSlider/12)} stroke="#dc2626" strokeDasharray="4 4" label={{ value: 'Batas Cap Bulanan', fill: '#dc2626', fontSize: 10 }} />
              <Bar dataKey="baseline" name="Emisi Aktual / Baseline" fill="#7C857D" radius={[3, 3, 0, 0]} />
              <Bar dataKey="simulasi" name="Emisi Pasca Simulasi Efisiensi" fill="#2F7D4A" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Official Regulatory Disclaimer */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-amber-950">
            Penjelasan & Batasan Legal Pajak Karbon:
          </h5>
          <p className="leading-relaxed text-amber-900">
            Kewajiban pajak karbon yang dihitung dalam modul ini merupakan <strong>estimasi manajerial internal</strong> untuk tujuan perencanaan akuntansi lingkungan dan akrual beban. Penetapan kewajiban pajak resmi yang terutang secara hukum tunduk pada peraturan perundang-undangan perpajakan Republik Indonesia (UU HPP No. 7/2021, Perpres No. 98/2021 mengenai Nilai Ekonomi Karbon), kebijakan sektoral Ditjen Ketenagalistrikan / Kementerian ESDM / KLHK, hasil verifikasi Lembaga Validasi & Verifikasi (LVV) independen terakreditasi KAN, serta pelaporan pada Sistem Registri Nasional Pengendalian Perubahan Iklim (SRN PPI).
          </p>
        </div>
      </div>
    </div>
  );
};
