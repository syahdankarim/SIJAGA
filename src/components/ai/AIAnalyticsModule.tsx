import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  LineChart as LineChartIcon,
  Send,
  CheckCircle2,
  HelpCircle,
  Zap,
  Leaf,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Bot,
  User,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { AnomalyRecord, ChatMessage, MonthlyTrendData, CarbonConfig } from '../../types';
import { formatIDR, formatNumber } from '../../utils/formatters';

interface AIAnalyticsModuleProps {
  anomalies: AnomalyRecord[];
  monthlyData: MonthlyTrendData[];
  carbonConfig: CarbonConfig;
  onResolveAnomaly: (id: string) => void;
}

export const AIAnalyticsModule: React.FC<AIAnalyticsModuleProps> = ({
  anomalies,
  monthlyData,
  carbonConfig,
  onResolveAnomaly,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'anomaly' | 'efficiency' | 'predictive' | 'assistant'>('assistant');

  // Interactive AI Assistant State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: '09:00 WIB',
      text: 'Halo Pak Budi, saya EcoTrace AI. Saya terhubung dengan data akuntansi finansial ERP, telemetri sensor IoT CEMS, dan simulasi ledger blockchain PT Eco Manufacturing Indonesia. Ada yang dapat saya bantu analisis hari ini?',
      suggestions: [
        'Mengapa emisi karbon kita meningkat di kuartal IV?',
        'Unit produksi mana yang menghasilkan biaya lingkungan tertinggi?',
        'Bagaimana pengaruh biaya lingkungan terhadap laba bersih perusahaan?',
        'Apa yang terjadi jika konsumsi listrik diturunkan 10%?',
        'Transaksi lingkungan mana yang butuh verifikasi lebih lanjut?',
      ],
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Predictive dataset (6 months historical + 6 months forward forecast)
  const predictiveForecast = [
    { month: 'Jul 25', actualEmission: 3910, forecastedEmission: null, actualCost: 645, forecastedCost: null, cap: 3750 },
    { month: 'Agu 25', actualEmission: 3880, forecastedEmission: null, actualCost: 660, forecastedCost: null, cap: 3750 },
    { month: 'Sep 25', actualEmission: 3950, forecastedEmission: null, actualCost: 680, forecastedCost: null, cap: 3750 },
    { month: 'Okt 25', actualEmission: 3990, forecastedEmission: null, actualCost: 710, forecastedCost: null, cap: 3750 },
    { month: 'Nov 25', actualEmission: 3860, forecastedEmission: null, actualCost: 725, forecastedCost: null, cap: 3750 },
    { month: 'Des 25', actualEmission: 3800, forecastedEmission: null, actualCost: 750, forecastedCost: null, cap: 3750 },
    // Forecast months
    { month: 'Jan 26 (P)', actualEmission: null, forecastedEmission: 3740, actualCost: null, forecastedCost: 710, cap: 3750 },
    { month: 'Feb 26 (P)', actualEmission: null, forecastedEmission: 3690, actualCost: null, forecastedCost: 695, cap: 3750 },
    { month: 'Mar 26 (P)', actualEmission: null, forecastedEmission: 3650, actualCost: null, forecastedCost: 680, cap: 3750 },
    { month: 'Apr 26 (P)', actualEmission: null, forecastedEmission: 3610, actualCost: null, forecastedCost: 670, cap: 3750 },
    { month: 'Mei 26 (P)', actualEmission: null, forecastedEmission: 3580, actualCost: null, forecastedCost: 660, cap: 3750 },
    { month: 'Jun 26 (P)', actualEmission: null, forecastedEmission: 3550, actualCost: null, forecastedCost: 650, cap: 3750 },
  ];

  // Eco-efficiency correlation data (Production vs Energy vs Revenue)
  const efficiencyData = monthlyData.map((m) => ({
    month: m.month,
    revenue: m.revenue,
    energyIntensity: Number((m.energyKWh / (m.revenue / 1000)).toFixed(2)), // kWh per Ribu IDR
    emissionIntensity: Number((m.carbonEmissions / (m.revenue / 1000)).toFixed(3)),
    profitMargin: Number(((m.netProfit / m.revenue) * 100).toFixed(1)),
  }));

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || userInput;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    // Contextual domain calculation engine for EcoTrace AI responses
    setTimeout(() => {
      let replyText = '';
      let contextData: { label: string; value: string }[] | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes('mengapa') && (lower.includes('emisi') || lower.includes('meningkat'))) {
        replyText =
          'Berdasarkan telemetri sensor CEMS cerobong Boiler A dan sistem SCADA tanur, kenaikan emisi pada bulan Oktober (3.990 tCO₂e) disebabkan oleh peningkatan volume produksi agregat beton (+12%) serta penurunan efisiensi burner no. 3 akibat akumulasi jelaga. Perbaikan soot-blowing di bulan November dan Desember berhasil menekan emisi kembali ke 3.800 tCO₂e.';
        contextData = [
          { label: 'Puncak Emisi', value: '3.990 tCO₂e (Okt)' },
          { label: 'Emisi Akhir Tahun', value: '3.800 tCO₂e (Des)' },
          { label: 'Unit Kunci', value: 'Unit Boiler A Cikarang' },
        ];
      } else if (lower.includes('unit produksi mana') || lower.includes('biaya tertinggi')) {
        replyText =
          'Unit Boiler & Pembangkit Uap menghasilkan beban lingkungan tertinggi, yaitu sebesar Rp 3,81 Miliar (48,7% dari total beban lingkungan perusahaan). Rincian utamanya mencakup konsumsi bahan bakar solar industri (Rp 2,84 M) dan estimasi alokasi pajak karbon (Rp 48,6 Jt). Unit Smelting & Tanur berada di posisi kedua dengan Rp 2,75 Miliar.';
        contextData = [
          { label: 'Unit Tertinggi', value: 'Unit Boiler A' },
          { label: 'Total Biaya Unit', value: 'Rp 3.808.600.000' },
          { label: 'Persentase Beban', value: '48,7% dari Seluruh Pabrik' },
        ];
      } else if (lower.includes('laba bersih') || lower.includes('pengaruh biaya lingkungan')) {
        replyText =
          'Total pengeluaran lingkungan tahun 2025 tercatat sebesar Rp 7,82 Miliar atau setara dengan 4,21% dari pendapatan bersih (Rp 185,4 M). Meskipun biaya lingkungan diakui dalam HPP dan beban operasional, laba bersih perusahaan tetap tumbuh 14,6% ke Rp 31,85 M. Investasi inverter daya dan daur ulang limbah justru menyumbang penghematan energi Rp 340 Juta.';
        contextData = [
          { label: 'Beban Lingkungan', value: 'Rp 7,82 Miliar' },
          { label: 'Rasio terhadap Omzet', value: '4,21%' },
          { label: 'Laba Bersih Tahunan', value: 'Rp 31,85 Miliar (+14,6%)' },
        ];
      } else if (lower.includes('10%') || lower.includes('konsumsi listrik')) {
        const energyKWhTotal = monthlyData.reduce((acc, c) => acc + c.energyKWh, 0) * 1000;
        const savedKWh = energyKWhTotal * 0.10;
        const savedIDR = savedKWh * 1250; // tarif industri Rp 1.250/kWh
        const savedEmission = (savedKWh * 0.85) / 1000; // 0.85 kgCO2/kWh
        const savedTax = Math.min(3240, savedEmission) * carbonConfig.taxTariff;

        replyText = `Jika konsumsi listrik PLN diturunkan sebesar 10%:\n1. Penghematan biaya tagihan listrik: sekitar ${formatIDR(savedIDR)} per tahun.\n2. Penurunan emisi Scope 2: sebesar ${formatNumber(savedEmission, 0)} tCO₂e.\n3. Pengurangan utang pajak karbon: hemat ${formatIDR(savedTax)} karena emisi kena pajak terpangkas.\n4. Kenaikan margin laba operasional bersih: +0,85%.`;
        contextData = [
          { label: 'Penghematan Listrik', value: formatIDR(savedIDR) },
          { label: 'Emisi Terhindar', value: `${formatNumber(savedEmission, 0)} tCO₂e` },
          { label: 'Penghematan Pajak Karbon', value: formatIDR(savedTax) },
        ];
      } else if (lower.includes('verifikasi') || lower.includes('transaksi')) {
        replyText =
          'Terdapat 1 proposal jurnal otomatis yang berstatus "Pending Review": Pengakuan Kewajiban Pajak Karbon Tahunan 2025 sebesar Rp 97.200.000 atas kelebihan emisi 3.240 tCO₂e. Selain itu, catatan sensor IPAL GIIC untuk BOD (24,5 mg/L) telah divalidasi AI dan siap dimasukkan ke blok ledger blockchain berikutnya.';
        contextData = [
          { label: 'Proposal Menunggu', value: 'PROP-2025-Q4-01' },
          { label: 'Nilai Jurnal', value: 'Rp 97.200.000' },
          { label: 'Akun Terkait', value: '6-2200 Debit / 2-1300 Kredit' },
        ];
      } else {
        replyText =
          `Berdasarkan data keuangan dan lingkungan EcoTrace: Total emisi tahun 2025 adalah 48.240 tCO₂e terhadap kuota cap ${formatNumber(carbonConfig.carbonCap)} tCO₂e. Estimasi pajak karbon terakru adalah ${formatIDR(Math.max(0, 48240 - carbonConfig.carbonCap) * carbonConfig.taxTariff)}. Seluruh catatan telemetri tervalidasi pada blok blockchain #101-#104.`;
        contextData = [
          { label: 'Total Emisi', value: '48.240 tCO₂e' },
          { label: 'Status Cap', value: `Cap: ${formatNumber(carbonConfig.carbonCap)} tCO₂e` },
          { label: 'Status ERP', value: 'Sinkron dengan SAP FICO' },
        ];
      }

      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        text: replyText,
        contextData,
        suggestions: [
          'Bagaimana strategi mencapai peringkat PROPER Emas?',
          'Tampilkan rekomendasi efisiensi energi boiler',
          'Berapa sisa kuota emisi kita kuartal depan?',
        ],
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#2F7D4A]" />
            Analitik Kecerdasan Buatan (AI Analytics)
          </h2>
          <p className="text-xs text-gray-500">
            Deteksi anomali telemetri lingkungan, korelasi eko-efisiensi, prediksi emisi 6 bulan ke depan, dan asisten EcoTrace AI.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('assistant')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'assistant' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>EcoTrace AI Assistant</span>
          </button>
          <button
            onClick={() => setActiveSubTab('anomaly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'anomaly' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Deteksi Anomali ({anomalies.filter((a) => a.status !== 'Terselesaikan').length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('efficiency')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'efficiency' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Analisis Efisiensi</span>
          </button>
          <button
            onClick={() => setActiveSubTab('predictive')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'predictive' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Prediktif 2026</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: ECOTRACE AI INTERACTIVE ASSISTANT */}
      {activeSubTab === 'assistant' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 bg-[#F7F8F4] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2F7D4A] flex items-center justify-center text-white shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900">
                  EcoTrace AI Enterprise Co-Pilot
                </h4>
                <p className="text-[11px] text-gray-500">
                  Model analitik berbasis aturan domain & data telemetri real-time terintegrasi
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              DATA READY
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${
                  m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-white text-xs ${
                    m.sender === 'user' ? 'bg-gray-800' : 'bg-[#173D2B]'
                  }`}
                >
                  {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl shadow-2xs ${
                      m.sender === 'user'
                        ? 'bg-[#173D2B] text-white rounded-tr-none'
                        : 'bg-[#F7F8F4] text-gray-800 border border-gray-200 rounded-tl-none leading-relaxed'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Context Data Cards */}
                    {m.contextData && m.contextData.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {m.contextData.map((cd, i) => (
                          <div key={i} className="bg-white p-2 rounded-lg border border-gray-100">
                            <span className="text-[10px] text-gray-400 block">{cd.label}</span>
                            <span className="font-bold text-gray-900 text-[11px]">{cd.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-gray-400 px-1 block">
                    {m.timestamp}
                  </span>

                  {/* Follow-up suggestions */}
                  {m.suggestions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sug)}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#2F7D4A] border border-gray-200 rounded-full text-[11px] transition-colors cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-xs text-gray-400 italic">
                <div className="w-7 h-7 rounded-lg bg-[#173D2B] flex items-center justify-center text-white">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span>EcoTrace AI sedang menganalisis data keuangan dan sensor...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tanyakan analisis emisi, biaya lingkungan, atau simulasi penghematan..."
                className="flex-1 px-4 py-2 bg-[#F7F8F4] text-xs border border-gray-200 rounded-xl outline-hidden focus:border-[#2F7D4A]"
              />
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="px-4 py-2 bg-[#2F7D4A] hover:bg-[#25683d] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DETEKSI ANOMALI LINGKUNGAN */}
      {activeSubTab === 'anomaly' && (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950">
                Peringatan Dini Telemetri AI (Early Warning System)
              </h4>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                Algoritma Machine Learning EcoTrace mendeteksi deviasi pola konsumsi energi, emisi cerobong, dan beban organik IPAL yang menyimpang dari rentang normal operasi.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {anomalies.map((anom) => (
              <div
                key={anom.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        anom.severity === 'Tinggi'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : anom.severity === 'Sedang'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      Keparahan: {anom.severity}
                    </span>
                    <span className="font-bold text-sm text-gray-900">{anom.metricName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">{anom.detectedAt}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        anom.status === 'Terselesaikan'
                          ? 'bg-emerald-100 text-emerald-800'
                          : anom.status === 'Dalam Investigasi'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {anom.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#F7F8F4] p-3 rounded-lg">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Unit Operasional</span>
                    <span className="font-semibold text-gray-800">{anom.operationalUnit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Nilai Anomali Terdeteksi</span>
                    <span className="font-bold text-rose-600">{anom.anomalyValue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Rentang Normal</span>
                    <span className="font-mono text-gray-700">{anom.normalRange}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Dampak Finansial Terestimasi</span>
                    <span className="font-mono font-bold text-rose-700">{formatIDR(anom.financialImpact)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-gray-800 block mb-1">Kemungkinan Akar Masalah:</span>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-100">
                      {anom.probableCause}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800 block mb-1">Rekomendasi Investigasi AI:</span>
                    <p className="text-gray-600 leading-relaxed bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                      {anom.recommendedAction}
                    </p>
                  </div>
                </div>

                {anom.status !== 'Terselesaikan' && (
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => onResolveAnomaly(anom.id)}
                      className="px-3 py-1.5 bg-[#2F7D4A] hover:bg-[#25683d] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tandai Terselesaikan & Perbarui Status</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: ANALISIS EFISIENSI LINGKUNGAN */}
      {activeSubTab === 'efficiency' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Analisis Eko-Efisiensi (Eco-Efficiency Decoupling)
              </h3>
              <p className="text-xs text-gray-500">
                Membuktikan pemisahan (decoupling) antara kenaikan pendapatan ekonomi dan intensitas emisi karbon
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Decoupling Ratio: 1.84x (Positif)
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} label={{ value: 'Intensitas (tCO2e/Juta IDR)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[15, 25]} tick={{ fontSize: 10 }} label={{ value: 'Margin Laba (%)', angle: 90, position: 'insideRight', fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="emissionIntensity" name="Intensitas Emisi Karbon" stroke="#dc2626" strokeWidth={2.5} />
                <Line yAxisId="right" type="monotone" dataKey="profitMargin" name="Margin Laba Bersih (%)" stroke="#2F7D4A" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#F7F8F4] rounded-lg border border-gray-200">
              <span className="font-bold text-gray-800 block mb-1">1. Energi vs Output</span>
              <p className="text-gray-600">
                Konsumsi listrik per ton semen beton turun dari 32,5 kWh ke 28,4 kWh seiring modernisasi motor listrik tanur.
              </p>
            </div>
            <div className="p-3 bg-[#F7F8F4] rounded-lg border border-gray-200">
              <span className="font-bold text-gray-800 block mb-1">2. Emisi vs Pendapatan</span>
              <p className="text-gray-600">
                Pendapatan tumbuh 23% dalam kurun waktu 12 bulan, sementara total emisi GRK berhasil ditekan sebesar 7,8%.
              </p>
            </div>
            <div className="p-3 bg-[#F7F8F4] rounded-lg border border-gray-200">
              <span className="font-bold text-gray-800 block mb-1">3. Reduksi Limbah vs Biaya</span>
              <p className="text-gray-600">
                Peningkatan daur ulang ke 84.9% memangkas biaya tipping fee TPA dan pengangkutan limbah sebesar Rp 215 Juta.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: PREDIKTIF ANALITIK 2026 */}
      {activeSubTab === 'predictive' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Prediksi Emisi & Beban Lingkungan Semester I 2026
              </h3>
              <p className="text-xs text-gray-500">
                Model regresi time-series memproyeksikan penurunan emisi di bawah batas kuota cap (3.750 tCO₂e/bulan)
              </p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full font-bold border border-blue-200">
              Model Confidence: 94.2%
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictiveForecast}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#173D2B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#173D2B" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F7D4A" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#2F7D4A" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[3400, 4200]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any, name: any) => [`${val} tCO₂e`, name]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="actualEmission" name="Emisi Aktual Historis" stroke="#173D2B" fill="url(#colorActual)" />
                <Area type="monotone" dataKey="forecastedEmission" strokeDasharray="5 5" name="Proyeksi Prediktif AI" stroke="#2F7D4A" fill="url(#colorForecast)" />
                <Line type="monotone" dataKey="cap" name="Batas Kuota Cap" stroke="#dc2626" strokeDasharray="3 3" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-bold text-sm block">Insight Proyeksi Semester Depan:</span>
            <p className="leading-relaxed">
              Jika implementasi solar rooftop 1,8 MWp selesai tepat waktu di Februari 2026, PT Eco Manufacturing Indonesia diproyeksikan akan <strong>bebas sepenuhnya dari beban pajak karbon</strong> pada semester I 2026, karena seluruh emisi berada di bawah batas cap (rata-rata 3.630 tCO₂e vs cap 3.750 tCO₂e/bulan).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
