import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Building,
  CheckCircle2,
  Share2,
  FileText,
  DollarSign,
  Leaf,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  CompanyInfo,
  MonthlyTrendData,
  CarbonConfig,
  EnvironmentalCostAllocation,
} from '../../types';
import { formatIDR, formatNumber } from '../../utils/formatters';

interface GreenReportsModuleProps {
  company: CompanyInfo;
  monthlyData: MonthlyTrendData[];
  carbonConfig: CarbonConfig;
  costAllocations: EnvironmentalCostAllocation[];
}

export const GreenReportsModule: React.FC<GreenReportsModuleProps> = ({
  company,
  monthlyData,
  carbonConfig,
  costAllocations,
}) => {
  const [selectedReport, setSelectedReport] = useState<number>(1);
  const [reportPeriod, setReportPeriod] = useState<string>('Tahun Buku 2025 (Penuh)');

  const reportsList = [
    { id: 1, title: '1. Laporan Laba Rugi Lingkungan', desc: 'Integrasi beban operasional hijau dan provisi restorasi terhadap laba bersih' },
    { id: 2, title: '2. Laporan Biaya Lingkungan (EMA)', desc: 'Rincian biaya pencegahan, pengolahan limbah IPAL, energi, dan audit' },
    { id: 3, title: '3. Laporan Emisi Karbon & Pajak', desc: 'Inventarisasi emisi Scope 1, Scope 2, kuota cap, dan kewajiban pajak' },
    { id: 4, title: '4. Laporan Kinerja Lingkungan', desc: 'Indikator intensitas emisi, rasio daur ulang sirkular, dan konsumsi air' },
    { id: 5, title: '5. Laporan Keberlanjutan (GRI)', desc: 'Pengungkapan standar GRI 302 (Energi), GRI 305 (Emisi), GRI 306 (Limbah)' },
    { id: 6, title: '6. Ringkasan Akuntansi Hijau', desc: 'Ikhtisar manajerial hubungan kinerja ESG dan profitabilitas pemegang saham' },
    { id: 7, title: '7. Rekonsiliasi Keuangan Lingkungan', desc: 'Pencocokan akun fisik telemetri IoT dengan jurnal buku besar ERP' },
  ];

  const totalRevenue = monthlyData.reduce((acc, curr) => acc + curr.revenue * 1_000_000, 0);
  const totalEnvCost = monthlyData.reduce((acc, curr) => acc + curr.environmentalCost * 1_000_000, 0);
  const totalEmissions = monthlyData.reduce((acc, curr) => acc + curr.carbonEmissions, 0);
  const taxableEmissions = Math.max(0, totalEmissions - carbonConfig.carbonCap);
  const estimatedTax = taxableEmissions * carbonConfig.taxTariff;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const content = `LAPORAN AKUNTANSI LINGKUNGAN - ECOTRACE\nPerusahaan: ${company.name}\nPeriode: ${reportPeriod}\nTanggal Cetak: ${new Date().toLocaleDateString('id-ID')}\n\nTotal Pendapatan: ${formatIDR(totalRevenue)}\nTotal Beban Lingkungan: ${formatIDR(totalEnvCost)}\nTotal Emisi Karbon: ${totalEmissions} tCO2e\nEstimasi Pajak Karbon: ${formatIDR(estimatedTax)}\nStatus Verifikasi: Terverifikasi Konsensus Blockchain`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EcoTrace_Report_${selectedReport}_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#2F7D4A]" />
            Laporan Akuntansi Hijau Terintegrasi (Green Reports)
          </h2>
          <p className="text-xs text-gray-500">
            Kompilasi laporan berkala audit-ready untuk manajemen, auditor internal/eksternal, investor, dan otoritas regulator.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Berkas</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-[#2F7D4A] hover:bg-[#25683d] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Report List Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-2 h-fit text-xs">
          <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
            <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
              Katalog Laporan
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
              7 Format
            </span>
          </div>

          <div className="space-y-1">
            {reportsList.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReport(r.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-colors cursor-pointer ${
                  selectedReport === r.id
                    ? 'bg-[#173D2B] text-white font-medium shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold text-xs">{r.title}</div>
                <div className={`text-[10px] mt-0.5 line-clamp-1 ${selectedReport === r.id ? 'text-[#A9C7A8]' : 'text-gray-400'}`}>
                  {r.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100">
            <label className="block text-gray-500 text-[10px] mb-1 font-semibold">Pilih Periode Laporan:</label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full bg-[#F7F8F4] border border-gray-200 rounded-lg p-1.5 text-xs text-gray-800"
            >
              <option value="Tahun Buku 2025 (Penuh)">Tahun Buku 2025 (Penuh)</option>
              <option value="Kuartal IV 2025">Kuartal IV 2025</option>
              <option value="Kuartal III 2025">Kuartal III 2025</option>
              <option value="Semester II 2025">Semester II 2025</option>
            </select>
          </div>
        </div>

        {/* Right: Selected Report Preview Sheet */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-2xs space-y-6 text-xs print:p-0 print:border-none">
          {/* Header Lembar Laporan Formal */}
          <div className="border-b-2 border-gray-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#2F7D4A]">
                EcoTrace Environmental Accounting Standard
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                {reportsList.find((r) => r.id === selectedReport)?.title}
              </h3>
              <p className="text-gray-600 font-medium">
                {company.name} | {company.industry}
              </p>
            </div>

            <div className="text-left sm:text-right text-[11px] text-gray-500 space-y-0.5 font-mono">
              <div>Periode: <span className="font-semibold text-gray-800">{reportPeriod}</span></div>
              <div>Lokasi: Cikarang & Karawang, Jabar</div>
              <div>Mata Uang: IDR (Rupiah)</div>
              <div className="text-emerald-700 font-semibold flex items-center sm:justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Blockchain Verified
              </div>
            </div>
          </div>

          {/* REPORT CONTENT PER SELECTION */}
          {selectedReport === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">
                Laporan Laba Rugi Komprehensif Berkelanjutan (Environmental Income Statement)
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8F4] font-semibold text-gray-700 border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3">Uraian Akun</th>
                      <th className="py-2.5 px-3 text-right">Tahun 2025 (IDR)</th>
                      <th className="py-2.5 px-3 text-right">% dari Omzet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="font-bold bg-gray-50">
                      <td className="py-2 px-3">Pendapatan Bersih</td>
                      <td className="py-2 px-3 text-right font-mono">{formatIDR(totalRevenue)}</td>
                      <td className="py-2 px-3 text-right font-mono">100.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 pl-6 text-gray-700">Harga Pokok Penjualan Konvensional</td>
                      <td className="py-2 px-3 text-right font-mono text-gray-700">(Rp 109.000.000.000)</td>
                      <td className="py-2 px-3 text-right font-mono">58.8%</td>
                    </tr>
                    <tr className="bg-emerald-50/50 text-emerald-950 font-medium">
                      <td className="py-2 px-3 pl-6">HPP Lingkungan: Biaya Pengolahan Limbah & IPAL</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">(Rp 3.200.000.000)</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">1.73%</td>
                    </tr>
                    <tr className="bg-emerald-50/50 text-emerald-950 font-medium">
                      <td className="py-2 px-3 pl-6">HPP Lingkungan: Biaya Efisiensi Energi Bahan Bakar</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">(Rp 2.000.000.000)</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">1.08%</td>
                    </tr>
                    <tr className="font-bold bg-[#f1f4ee]">
                      <td className="py-2 px-3">Laba Kotor Operasi</td>
                      <td className="py-2 px-3 text-right font-mono">Rp 71.200.000.000</td>
                      <td className="py-2 px-3 text-right font-mono">38.4%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 pl-6 text-gray-700">Beban Administrasi & Pemasaran Umum</td>
                      <td className="py-2 px-3 text-right font-mono text-gray-700">(Rp 25.380.000.000)</td>
                      <td className="py-2 px-3 text-right font-mono">13.7%</td>
                    </tr>
                    <tr className="bg-emerald-50/50 text-emerald-950 font-medium">
                      <td className="py-2 px-3 pl-6">Beban Operasional Lingkungan (Sertifikasi & Audit)</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">(Rp 1.250.000.000)</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">0.67%</td>
                    </tr>
                    <tr className="bg-rose-50/50 text-rose-950 font-medium">
                      <td className="py-2 px-3 pl-6">Estimasi Beban Pajak Karbon Terakru (3.240 tCO₂e)</td>
                      <td className="py-2 px-3 text-right font-mono text-rose-700">(Rp 97.200.000)</td>
                      <td className="py-2 px-3 text-right font-mono text-rose-700">0.05%</td>
                    </tr>
                    <tr className="bg-emerald-50/50 text-emerald-950 font-medium">
                      <td className="py-2 px-3 pl-6">Beban Provisi Restorasi Lingkungan (PSAK 57)</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">(Rp 750.000.000)</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">0.40%</td>
                    </tr>
                    <tr className="bg-emerald-50/50 text-emerald-950 font-medium">
                      <td className="py-2 px-3 pl-6">Beban Verifikasi & Monitoring CEMS</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">(Rp 522.800.000)</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-900">0.28%</td>
                    </tr>
                    <tr className="font-bold bg-[#e3eae0] border-t-2 border-gray-400">
                      <td className="py-2.5 px-3 text-gray-900">Laba Bersih Tahun Berjalan</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-bold">
                        Rp 31.850.000.000
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-bold">17.2%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">
                Laporan Rincian Biaya Pengelolaan Lingkungan (Environmental Management Accounting - EMA)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {costAllocations.map((alloc, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-gray-200 bg-[#F7F8F4] space-y-2">
                    <span className="font-bold text-gray-900 block">{alloc.unitName}</span>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex justify-between">
                        <span>Konsumsi Energi:</span>
                        <span className="font-mono">{formatIDR(alloc.energyCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pengolahan Limbah Padat:</span>
                        <span className="font-mono">{formatIDR(alloc.wasteCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pengolahan Air Limbah IPAL:</span>
                        <span className="font-mono">{formatIDR(alloc.waterTreatmentCost)}</span>
                      </div>
                      <div className="flex justify-between text-rose-700">
                        <span>Alokasi Pajak Karbon:</span>
                        <span className="font-mono">{formatIDR(alloc.carbonTaxEstimated)}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-gray-200 font-bold text-gray-900">
                        <span>Total Biaya Unit:</span>
                        <span className="font-mono">{formatIDR(alloc.totalCost)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedReport === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">
                Laporan Inventarisasi Gas Rumah Kaca (GRK) & Eksposur Pajak Karbon
              </h4>
              <div className="bg-[#F7F8F4] p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-500 block">Total Emisi Scope 1 & 2:</span>
                    <span className="font-bold font-mono text-base">{formatNumber(totalEmissions)} tCO₂e</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Batas Kuota Cap:</span>
                    <span className="font-bold font-mono text-base">{formatNumber(carbonConfig.carbonCap)} tCO₂e</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Emisi Kena Pajak:</span>
                    <span className="font-bold font-mono text-base text-rose-700">{formatNumber(taxableEmissions)} tCO₂e</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    Estimasi Kewajiban Utang Pajak Karbon (Tarif Rp 30.000/tCO₂e):
                  </span>
                  <span className="text-base font-bold text-rose-700 font-mono">
                    {formatIDR(estimatedTax)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedReport >= 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">
                Pengungkapan Kinerja Keberlanjutan & Indikator Kepatuhan Regulasi
              </h4>
              <div className="p-4 bg-[#F7F8F4] rounded-xl border border-gray-200 space-y-3 leading-relaxed text-gray-700">
                <p>
                  PT Eco Manufacturing Indonesia menerapkan sistem pelaporan terpadu yang memadukan indikator Global Reporting Initiative (GRI 302, 305, 306) dan pemenuhan PROPER KLHK. Seluruh data telemetri emisi cerobong terkoneksi langsung ke SISPEK KLHK dan tersimpan dalam rantai ledger terverifikasi konsensus kriptografi.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-200 text-center font-mono">
                  <div className="bg-white p-2 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 block font-sans">Daur Ulang</span>
                    <span className="font-bold text-emerald-800">84.9%</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 block font-sans">Mutu BOD IPAL</span>
                    <span className="font-bold text-blue-800">24.5 mg/L</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 block font-sans">Status PROPER</span>
                    <span className="font-bold text-emerald-700">Kandidat HIJAU</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 block font-sans">Audit Ledger</span>
                    <span className="font-bold text-gray-800">SHA-256 Valid</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Signature Block */}
          <div className="pt-6 border-t border-gray-200 flex justify-between items-end text-[11px] text-gray-500">
            <div>
              <p>Disusun secara otomatis oleh EcoTrace Information System</p>
              <p className="font-mono text-[10px]">Hash Dokumen: 0x8f4c2e17a99bb8e2d4f6c12e831c9a7d3ef29188</p>
            </div>
            <div className="text-right space-y-8">
              <p>Disetujui oleh Direktur Keuangan & Lingkungan:</p>
              <p className="font-bold text-gray-900 border-t border-gray-300 pt-1">
                Budi Santoso, Ak., M.Ak., CA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
