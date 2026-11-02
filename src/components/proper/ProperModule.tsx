import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Info,
  Droplets,
  Wind,
  Trash2,
  Zap,
  Users,
} from 'lucide-react';
import { ProperCriterion } from '../../types';

interface ProperModuleProps {
  criteria: ProperCriterion[];
}

export const ProperModule: React.FC<ProperModuleProps> = ({ criteria }) => {
  const totalScore = criteria.reduce((sum, c) => sum + c.currentScore, 0);
  const maxScore = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const percentage = (totalScore / maxScore) * 100;

  const properTiers = [
    { name: 'EMAS', color: 'bg-amber-400 text-amber-950 border-amber-500', desc: 'Sangat Unggul & Beyond Compliance berkelanjutan' },
    { name: 'HIJAU', color: 'bg-emerald-600 text-white border-emerald-700 font-bold', desc: 'Melampaui ketaatan (Beyond Compliance) - Peringkat PT EcoTrace', active: true },
    { name: 'BIRU', color: 'bg-blue-500 text-white border-blue-600', desc: 'Taat 100% terhadap peraturan lingkungan hidup' },
    { name: 'MERAH', color: 'bg-rose-500 text-white border-rose-600', desc: 'Tidak taat terhadap sebagian peraturan lingkungan' },
    { name: 'HITAM', color: 'bg-gray-900 text-white border-black', desc: 'Sengaja tidak melakukan pengendalian pencemaran' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2F7D4A]" />
            Pemantauan Kepatuhan & Simulasi Peringkat PROPER KLHK
          </h2>
          <p className="text-xs text-gray-500">
            Penilaian mandiri ketaatan terhadap Program Penilaian Peringkat Kinerja Perusahaan dalam Pengelolaan Lingkungan Hidup.
          </p>
        </div>

        <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-300 self-start sm:self-auto flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-700" />
          Kandidat PROPER HIJAU (Skor: {percentage.toFixed(1)}%)
        </span>
      </div>

      {/* PROPER Rating Level Visual Ladder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
            Skala Peringkat PROPER Kementerian Lingkungan Hidup dan Kehutanan
          </h3>
          <span className="text-[11px] text-gray-400">Periode Evaluasi 2024-2025</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          {properTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between relative ${tier.color} ${
                tier.active ? 'ring-3 ring-emerald-400 shadow-md transform -translate-y-1' : 'opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold tracking-wider text-sm">{tier.name}</span>
                  {tier.active && (
                    <span className="text-[9px] bg-white text-emerald-900 font-bold px-1.5 py-0.2 rounded uppercase">
                      Posisi Saat Ini
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-tight opacity-90">{tier.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block mb-1">Skor Ketaatan Terkonsolidasi</span>
          <div className="text-2xl font-bold text-gray-900 font-mono">
            {totalScore.toFixed(1)} / {maxScore} Poin
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-[#2F7D4A] h-full rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block mb-1">Status Kepatuhan Kunci</span>
          <div className="text-base font-bold text-emerald-800 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            100% Taat Regulasi Dasar
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            AMDAL, SLO IPAL, Izin CEMS, dan Festronik Limbah B3 valid tanpa pelanggaran hukum.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block mb-1">Roadmap Menuju PROPER EMAS</span>
          <div className="text-base font-bold text-amber-700 mt-1">
            Butuh +5.3 Poin Beyond Compliance
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Fokus: Peningkatan konservasi air 80% & penambahan kapasitas solar rooftop 1.8 MWp.
          </p>
        </div>
      </div>

      {/* Detailed Evaluation Criteria Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden text-xs">
        <div className="p-4 border-b border-gray-100 bg-[#F7F8F4] flex justify-between items-center">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
            Matriks Evaluasi 6 Aspek Kriteria PROPER
          </h4>
          <span className="text-[11px] text-gray-500">Berdasarkan Permen LHK No. 1 Tahun 2021</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f2f4ee] text-gray-700 font-semibold text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Aspek Penilaian</th>
                <th className="py-2.5 px-3 text-center">Bobot</th>
                <th className="py-2.5 px-3 text-center">Skor Capaian</th>
                <th className="py-2.5 px-3 text-center">Predikat Aspek</th>
                <th className="py-2.5 px-3">Inisiatif Utama Perusahaan</th>
                <th className="py-2.5 px-3 text-right">Audit Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {criteria.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-semibold text-gray-900 max-w-xs">{c.category}</td>
                  <td className="py-3 px-3 text-center font-mono text-gray-500">{c.weight}%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-gray-900">
                    {c.currentScore} / {c.maxScore}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status.includes('Emas')
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : c.status.includes('Hijau')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-600 max-w-sm">{c.keyInitiative}</td>
                  <td className="py-3 px-3 text-right font-mono text-gray-400 whitespace-nowrap">{c.lastAuditDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official KLHK Disclaimer */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-gray-500 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-gray-800">
            Penafian Resmi Peringkat PROPER:
          </h5>
          <p className="leading-relaxed">
            Status pemeringkatan PROPER yang ditampilkan pada sistem ini merupakan <strong>hasil simulasi mandiri internal (self-assessment)</strong> berdasarkan integrasi data telemetri sensor CEMS, neraca limbah, dan data akuntansi lingkungan perusahaan. Penetapan peringkat resmi PROPER secara hukum merupakan wewenang mutlak Kementerian Lingkungan Hidup dan Kehutanan (KLHK) Republik Indonesia melalui Keputusan Menteri LHK setelah proses evaluasi, verifikasi lapangan, dan sidang pertimbangan dewan juri PROPER independen.
          </p>
        </div>
      </div>
    </div>
  );
};
