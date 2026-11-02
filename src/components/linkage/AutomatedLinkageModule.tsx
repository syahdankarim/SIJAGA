import React, { useState } from 'react';
import {
  GitMerge,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Eye,
  Info,
  Sliders,
  Scale,
  Sparkles,
} from 'lucide-react';
import {
  AutomatedLinkageRule,
  LinkageProposal,
  FinancialTransaction,
} from '../../types';
import { formatIDR } from '../../utils/formatters';

interface AutomatedLinkageModuleProps {
  rules: AutomatedLinkageRule[];
  proposals: LinkageProposal[];
  onApproveProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string) => void;
}

export const AutomatedLinkageModule: React.FC<AutomatedLinkageModuleProps> = ({
  rules,
  proposals,
  onApproveProposal,
  onRejectProposal,
}) => {
  const [selectedProposal, setSelectedProposal] = useState<LinkageProposal | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApprove = (p: LinkageProposal) => {
    onApproveProposal(p.id);
    setSelectedProposal(null);
    setSuccessMessage(`Proposal "${p.title}" senilai ${formatIDR(p.calculatedAmount)} berhasil disetujui dan otomatis diposting ke Jurnal Umum Keuangan!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleReject = (p: LinkageProposal) => {
    onRejectProposal(p.id);
    setSelectedProposal(null);
    setSuccessMessage(`Proposal "${p.title}" telah ditolak.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-[#2F7D4A]" />
            Penghubung Akuntansi Otomatis (Automated Accounting Linkage)
          </h2>
          <p className="text-xs text-gray-500">
            Inti inovasi EcoTrace: Konversi otomatis telemetri fisik sensor lingkungan menjadi draf ayat jurnal akuntansi keuangan yang siap direview dan diposting.
          </p>
        </div>

        <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
          {proposals.filter((p) => p.status === 'Pending Review').length} Proposal Menunggu Review Akuntan
        </span>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Pending Proposals Section (The Accountant Review Queue) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-[#F7F8F4] flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800">
              Pratinjau Otomatisasi Akuntansi (Accounting Automation Preview Queue)
            </h3>
            <p className="text-[11px] text-gray-500">
              Setiap ayat jurnal yang dihasilkan sensor memerlukan validasi profesional sebelum mempengaruhi saldo buku besar resmi
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {proposals.map((prop) => (
            <div key={prop.id} className="p-5 hover:bg-gray-50/50 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-900 text-sm">{prop.id}</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {prop.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-[11px]">{prop.date}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      prop.status === 'Pending Review'
                        ? 'bg-amber-100 text-amber-800'
                        : prop.status === 'Disetujui & Terposting'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {prop.status}
                  </span>
                </div>
              </div>

              {/* Journal Double-Entry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#F7F8F4] p-3.5 rounded-xl border border-gray-200">
                {/* Debit */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    DEBIT
                  </span>
                  <div className="font-mono text-gray-900 font-semibold text-[11px] mt-1">
                    {prop.debitAccountCode} - {prop.debitAccountName}
                  </div>
                  <div className="text-base font-bold text-gray-900 font-mono">
                    {formatIDR(prop.calculatedAmount)}
                  </div>
                </div>

                {/* Credit */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">
                    KREDIT
                  </span>
                  <div className="font-mono text-gray-900 font-semibold text-[11px] mt-1">
                    {prop.creditAccountCode} - {prop.creditAccountName}
                  </div>
                  <div className="text-base font-bold text-gray-900 font-mono">
                    {formatIDR(prop.calculatedAmount)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-gray-600">
                <div>
                  <span className="font-bold text-gray-700 block mb-0.5">Pemicu Data Lingkungan (Trigger Event):</span>
                  <p className="bg-white p-2 rounded border border-gray-200">
                    {prop.triggerEvent} ({prop.sourceValue})
                  </p>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-0.5">Dasar Pengakuan & Asumsi Akuntansi:</span>
                  <p className="bg-white p-2 rounded border border-gray-200">
                    {prop.rationale}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Accountant */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-100">
                {prop.approvedBy ? (
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ Disetujui oleh {prop.approvedBy} ({prop.approvedAt})
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400">
                    Membutuhkan otorisasi Pejabat Keuangan Berwenang (CA/CFO).
                  </span>
                )}

                {prop.status === 'Pending Review' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(prop)}
                      className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak Jurnal</span>
                    </button>
                    <button
                      onClick={() => handleApprove(prop)}
                      className="px-4 py-1.5 bg-[#2F7D4A] hover:bg-[#25683d] text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui & Posting ke Jurnal Umum</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Standard Accounting Linkage Rules Matrix */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4 text-xs">
        <div className="pb-3 border-b border-gray-200">
          <h3 className="font-bold text-sm text-gray-900">
            Daftar Aturan Otomasi Akuntansi (Standard Accounting Linkage Rules)
          </h3>
          <p className="text-gray-500">
            Konfigurasi logika bisnis penghubung metrik fisik dengan standar pelaporan PSAK/IFRS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 rounded-xl border border-gray-200 bg-[#F7F8F4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{rule.title}</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {rule.id}
                </span>
              </div>

              <div className="space-y-1.5 text-gray-600">
                <div>
                  <span className="font-semibold text-gray-800">Kondisi Pemicu:</span> {rule.conditionDescription}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Standar Acuan:</span>{' '}
                  <span className="text-[#173D2B] font-medium">{rule.accountingStandard}</span>
                </div>
                <div className="p-2 bg-white rounded border border-gray-200 font-mono text-[11px] space-y-0.5">
                  <div className="text-emerald-800 font-semibold">Dr: {rule.debitAccount}</div>
                  <div className="text-blue-800 font-semibold">Cr: {rule.creditAccount}</div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-[11px]">
                  <span className="text-gray-500">Nilai Terkalkulasi Terkini:</span>
                  <span className="font-mono font-bold text-gray-900">{formatIDR(rule.currentCalculatedAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recognition Assumptions Disclaimer */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-gray-500 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-gray-800">
            Kriteria Pengakuan Akuntansi & Pertimbangan Profesional:
          </h5>
          <p className="leading-relaxed">
            Sesuai prinsip kehati-hatian (prudence) dalam PSAK, pengakuan provisi restorasi lingkungan dan kewajiban pajak karbon tidak dibuat secara otomatis tanpa pratinjau verifikasi. Keberadaan emisi di bawah batas cap <strong>tidak serta merta diakui sebagai pendapatan</strong>, melainkan sebagai efisiensi biaya, kecuali terdapat sertifikat kredit karbon resmi (SPE-GRK) yang telah diterbitkan dan memiliki nilai wajar yang dapat diukur secara andal.
          </p>
        </div>
      </div>
    </div>
  );
};
