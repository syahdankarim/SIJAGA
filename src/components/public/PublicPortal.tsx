import React, { useState } from 'react';
import {
  Globe,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Send,
  Droplets,
  Zap,
  Recycle,
  Award,
  ArrowLeft,
  MessageSquare,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { CompanyInfo, MonthlyTrendData, PublicFeedback } from '../../types';
import { formatIDRShort, formatNumber } from '../../utils/formatters';

interface PublicPortalProps {
  company: CompanyInfo;
  monthlyData: MonthlyTrendData[];
  feedbackItems: PublicFeedback[];
  onAddFeedback: (feedback: PublicFeedback) => void;
  onBackToDashboard: () => void;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({
  company,
  monthlyData,
  feedbackItems,
  onAddFeedback,
  onBackToDashboard,
}) => {
  // Public feedback form state
  const [userName, setUserName] = useState('');
  const [userOrg, setUserOrg] = useState('');
  const [category, setCategory] = useState<PublicFeedback['category']>('Observasi Emisi');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalEmissions = monthlyData.reduce((acc, curr) => acc + curr.carbonEmissions, 0);
  const totalWaste = monthlyData.reduce((acc, curr) => acc + curr.wasteTon, 0);
  const totalRecycled = monthlyData.reduce((acc, curr) => acc + curr.recycledTon, 0);
  const recycleRate = ((totalRecycled / totalWaste) * 100).toFixed(1);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !message.trim()) return;

    const newFeedback: PublicFeedback = {
      id: `FB-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      name: userName,
      organization: userOrg || 'Masyarakat Umum / Pemerhati Lingkungan',
      category,
      message,
      status: 'Diterima',
      reply: 'Terima kasih atas masukan dan kepedulian Anda terhadap kelestarian lingkungan operasional kami. Tim ESG PT EcoTrace akan menindaklanjuti dalam waktu 1x24 jam kerja.',
    };

    onAddFeedback(newFeedback);
    setIsSubmitted(true);
    setUserName('');
    setUserOrg('');
    setMessage('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#202720] pb-12">
      {/* Public Navbar */}
      <header className="bg-[#173D2B] text-white border-b border-[#24583e] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2F7D4A] flex items-center justify-center border border-[#449e65]">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white leading-tight">
                Portal Transparansi Lingkungan Publik
              </h1>
              <p className="text-[11px] text-[#A9C7A8] font-medium">
                {company.name} | Terverifikasi Blockchain & CEMS
              </p>
            </div>
          </div>

          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke ERP Internal</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F7D4A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Keterbukaan Informasi Publik ESG
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Komitmen Akuntabilitas Lingkungan & Kinerja Berkelanjutan
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sebagai bagian dari tanggung jawab kami kepada masyarakat, investor, dan regulator, halaman ini menyediakan transparansi penuh atas emisi gas rumah kaca, konsumsi sumber daya air, daur ulang limbah, serta sertifikasi kepatuhan lingkungan pabrik kami di Cikarang dan Karawang.
              </p>
            </div>

            <div className="bg-[#173D2B] text-white p-4 rounded-xl space-y-2 text-xs min-w-[220px]">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Status Audit Publik</span>
              </div>
              <p className="text-[#A9C7A8] text-[11px]">
                Seluruh data di bawah ini diverifikasi oleh hash blockchain ledger konsensus terdesentralisasi.
              </p>
              <div className="pt-2 border-t border-emerald-800/80 font-mono text-[10px] text-gray-300">
                Peringkat: Kandidat PROPER HIJAU
              </div>
            </div>
          </div>
        </div>

        {/* 4 Public Impact Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-semibold">Emisi Karbon Tahunan</span>
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono">
              {formatNumber(totalEmissions)} <span className="text-xs font-normal text-gray-500">tCO₂e</span>
            </div>
            <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
              <TrendingDown className="w-3.5 h-3.5" />
              Turun 7,8% dari awal tahun 2025
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-semibold">Tingkat Daur Ulang Sirkular</span>
              <Recycle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-800 font-mono">
              {recycleRate}%
            </div>
            <p className="text-[11px] text-gray-500">
              {formatNumber(totalRecycled)} Ton limbah dialihkan dari TPA
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-semibold">Mutu Air Olahan IPAL</span>
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-800 font-mono">
              24.5 <span className="text-xs font-normal text-gray-500">mg/L BOD</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              51% lebih bersih dari baku mutu KLHK (50)
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-semibold">Alokasi Investasi Hijau</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-[#173D2B] font-mono">
              Rp 8,56 M
            </div>
            <p className="text-[11px] text-gray-500">
              Solar rooftop 1.8 MWp & motor hemat energi
            </p>
          </div>
        </div>

        {/* Charts: Tren Emisi Karbon Bulanan & Daur Ulang */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3">
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                Tren Penurunan Emisi Karbon Bulanan (Scope 1 & 2)
              </h3>
              <p className="text-xs text-gray-500">
                Pencatatan real-time Continuous Emission Monitoring System (CEMS)
              </p>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[3500, 4400]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: any) => [`${val} tCO₂e`, 'Emisi Bulanan']} />
                  <Area type="monotone" dataKey="carbonEmissions" name="Emisi Terukur" stroke="#173D2B" fill="#A9C7A8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3">
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                Rasio Pemanfaatan & Daur Ulang Limbah Padat (%)
              </h3>
              <p className="text-xs text-gray-500">
                Peningkatan sirkularitas material paving block & agregat daur ulang
              </p>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[70, 90]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: any) => [`${val}%`, 'Tingkat Daur Ulang']} />
                  <Bar dataKey="recyclingRate" name="Daur Ulang (%)" fill="#2F7D4A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Public Feedback & Community Observations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4 text-xs">
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#2F7D4A]" />
                  Kirim Observasi atau Pertanyaan Publik
                </h3>
                <p className="text-gray-500">
                  Partisipasi masyarakat sekitar kawasan industri sangat kami hargai
                </p>
              </div>
            </div>

            {isSubmitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Terima kasih! Pesan Anda telah tercatat dan ditanggapi oleh tim ESG.</span>
              </div>
            )}

            <form onSubmit={handleSubmitFeedback} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Instansi / Komunitas</label>
                  <input
                    type="text"
                    value={userOrg}
                    onChange={(e) => setUserOrg(e.target.value)}
                    placeholder="Warga Cikarang / Universitas / LSM"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Kategori Masukan</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                >
                  <option value="Observasi Emisi">Observasi Emisi & Kualitas Udara</option>
                  <option value="Pengelolaan Limbah">Pengelolaan Limbah & Air IPAL</option>
                  <option value="Pertanyaan Laporan">Pertanyaan Laporan Keberlanjutan</option>
                  <option value="Saran Inovasi">Saran Inovasi Hijau & CSR</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Pesan / Observasi Lapangan</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pengamatan atau pertanyaan Anda terkait aktivitas lingkungan pabrik..."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#2F7D4A] hover:bg-[#25683d] text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirimkan Aspirasi ke Tim Lingkungan</span>
              </button>
            </form>
          </div>

          {/* Public Feedback Feed */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4 text-xs">
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">
                Aspirasi Terbuka & Tanggapan Manajemen
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">Diperbarui Hari Ini</span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {feedbackItems.map((fb) => (
                <div key={fb.id} className="p-3.5 rounded-lg border border-gray-200 bg-[#F7F8F4] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{fb.name}</span>
                      <span className="text-[11px] text-gray-500 ml-1">({fb.organization})</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{fb.date}</span>
                  </div>

                  <p className="text-gray-700 leading-relaxed italic bg-white p-2 rounded border border-gray-100">
                    "{fb.message}"
                  </p>

                  {fb.reply && (
                    <div className="pl-3 border-l-2 border-[#2F7D4A] text-[11px] text-emerald-950 bg-emerald-50/50 p-2 rounded-r">
                      <span className="font-bold block text-[#173D2B]">Tanggapan Tim Lingkungan EcoTrace:</span>
                      <p className="mt-0.5">{fb.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
