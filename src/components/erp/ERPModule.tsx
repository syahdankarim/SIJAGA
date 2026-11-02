import React, { useState } from 'react';
import {
  Workflow,
  Server,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Layers,
  Cpu,
  FileCheck,
  Building,
  Info,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { ERPSystemStatus, ERPSyncLog } from '../../types';
import { formatIDR } from '../../utils/formatters';

interface ERPModuleProps {
  erpSystems: ERPSystemStatus[];
  syncLogs: ERPSyncLog[];
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const ERPModule: React.FC<ERPModuleProps> = ({
  erpSystems,
  syncLogs,
  onTriggerSync,
  isSyncing,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'mapping' | 'status' | 'logs'>('pipeline');
  const [selectedSystem, setSelectedSystem] = useState<string>('SAP S/4HANA');

  // Account mappings between EcoTrace and SAP/Oracle
  const accountMappings = [
    {
      ecoTraceCode: '6-2200',
      ecoTraceName: 'Estimasi Beban Pajak Karbon',
      erpSystem: 'SAP S/4HANA FICO',
      erpGLCode: '0000622010',
      erpGLName: 'Carbon Tax Accrued Liability',
      costCenter: 'CC-TAX-04',
      status: 'Mapped & Validated',
    },
    {
      ecoTraceCode: '5-1400',
      ecoTraceName: 'BOP Lingkungan: Pengolahan Limbah & IPAL',
      erpSystem: 'SAP S/4HANA MM',
      erpGLCode: '0000514050',
      erpGLName: 'Manufacturing Waste Treatment Overhead',
      costCenter: 'CC-PROD-BOILER',
      status: 'Mapped & Validated',
    },
    {
      ecoTraceCode: '1-1400',
      ecoTraceName: 'Aset Kredit Karbon Bersertifikat',
      erpSystem: 'Oracle Cloud Assets',
      erpGLCode: '1410-00-99',
      erpGLName: 'SPE-GRK Certified Intangible Green Asset',
      costCenter: 'CC-TREASURY',
      status: 'Mapped & Validated',
    },
    {
      ecoTraceCode: '6-2300',
      ecoTraceName: 'Beban Provisi Restorasi Lingkungan',
      erpSystem: 'SAP S/4HANA FICO',
      erpGLCode: '0000623080',
      erpGLName: 'Environmental Decommissioning Provision',
      costCenter: 'CC-ENV-RESTORE',
      status: 'Mapped & Validated',
    },
    {
      ecoTraceCode: '6-2400',
      ecoTraceName: 'Beban Verifikasi & Monitoring Lingkungan',
      erpSystem: 'Oracle Cloud Expenses',
      erpGLCode: '6240-10-00',
      erpGLName: 'CEMS & ESG Third-Party Audit Fees',
      costCenter: 'CC-ENV-01',
      status: 'Mapped & Validated',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-[#2F7D4A]" />
            Integrasi Enterprise Resource Planning (ERP)
          </h2>
          <p className="text-xs text-gray-500">
            Jembatan otomatis antara telemetri fisik lingkungan, validasi AI/blockchain, dan modul FICO SAP S/4HANA & Oracle Cloud.
          </p>
        </div>

        <button
          onClick={onTriggerSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-[#2F7D4A] hover:bg-[#25683d] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Memproses Sinkronisasi...' : 'Jalankan Sinkronisasi ERP Sekarang'}</span>
        </button>
      </div>

      {/* Visual Integration Pipeline Flow (The core requirement) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2F7D4A]" />
            Alur Integrasi Otomatis (End-to-End Enterprise Flow)
          </h3>
          <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
            Automated Pipeline
          </span>
        </div>

        {/* 8-Stage Visual Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          {[
            { step: '1', title: 'Sensor IoT', desc: 'CEMS, SCADA, Flowmeter', icon: Radio, bg: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
            { step: '2', title: 'Data Processing', desc: 'Normalisasi Fisik', icon: Cpu, bg: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
            { step: '3', title: 'AI Validation', desc: 'Deteksi Anomali', icon: CheckCircle2, bg: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
            { step: '4', title: 'Blockchain', desc: 'Hash Immutability', icon: FileCheck, bg: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
            { step: '5', title: 'EMA Accounting', desc: 'Valuasi Moneter', icon: Database, bg: 'bg-[#173D2B] text-white border-[#173D2B]' },
            { step: '6', title: 'ERP Financial', desc: 'SAP / Oracle Sync', icon: Server, bg: 'bg-[#173D2B] text-white border-[#173D2B]' },
            { step: '7', title: 'Lap. Keuangan', desc: 'Neraca & Laba Rugi', icon: Building, bg: 'bg-emerald-900 text-white border-emerald-900' },
            { step: '8', title: 'Green Report', desc: 'GRI & PROPER', icon: FileSpreadsheet, bg: 'bg-emerald-900 text-white border-emerald-900' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col items-center text-center justify-between min-h-[110px] relative transition-transform hover:-translate-y-0.5 ${item.bg}`}
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px] mb-1">
                  {item.step}
                </div>
                <Icon className="w-4 h-4 mb-1" />
                <span className="font-bold text-[11px] leading-tight">{item.title}</span>
                <span className="text-[9px] opacity-80 mt-1">{item.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'pipeline' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Status Konektor Sistem ERP
        </button>
        <button
          onClick={() => setActiveTab('mapping')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'mapping' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pemetaan Akun (GL & Cost Center Mapping)
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'logs' ? 'bg-[#173D2B] text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Log Rekonsiliasi & Sinkronisasi
        </button>
      </div>

      {/* TAB 1: STATUS KONEKTOR */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {erpSystems.map((sys, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-bold text-gray-900">{sys.systemType}</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {sys.status}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 block text-[10px]">Nama Instance ERP:</span>
                  <span className="font-semibold text-gray-800">{sys.systemName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Endpoint API Terhubung:</span>
                  <span className="font-mono text-[10px] text-gray-600 bg-gray-50 p-1 rounded block truncate">
                    {sys.endpoint}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Terakhir Sinkron:</span>
                    <span className="font-medium text-gray-700">{sys.lastSync}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Record Tersinkron:</span>
                    <span className="font-mono font-bold text-[#173D2B]">{sys.recordsSynced.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-500 flex items-center justify-between">
                  <span>Jadwal Sinkron: {sys.syncInterval}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PEMETAAN AKUN */}
      {activeTab === 'mapping' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden text-xs">
          <div className="p-4 border-b border-gray-100 bg-[#F7F8F4] flex justify-between items-center">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Kamus Pemetaan Akun Lingkungan ke ERP General Ledger
            </h4>
            <span className="text-[11px] text-gray-500">Standar SAP BAPI & Oracle REST API</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f2f4ee] text-gray-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Kode EcoTrace</th>
                  <th className="py-2.5 px-3">Nama Akun EcoTrace</th>
                  <th className="py-2.5 px-3">Target ERP</th>
                  <th className="py-2.5 px-3">Nomor GL Akun ERP</th>
                  <th className="py-2.5 px-3">Nama GL Akun ERP</th>
                  <th className="py-2.5 px-3">Pusat Biaya (Cost Center)</th>
                  <th className="py-2.5 px-3 text-center">Status Pemetaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accountMappings.map((map, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-gray-900">{map.ecoTraceCode}</td>
                    <td className="py-2.5 px-3 font-medium text-emerald-900">{map.ecoTraceName}</td>
                    <td className="py-2.5 px-3 text-gray-700">{map.erpSystem}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-900">{map.erpGLCode}</td>
                    <td className="py-2.5 px-3 text-gray-600">{map.erpGLName}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-700">{map.costCenter}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {map.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOG REKONSILIASI */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden text-xs">
          <div className="p-4 border-b border-gray-100 bg-[#F7F8F4] flex justify-between items-center">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Riwayat Sinkronisasi & Rekonsiliasi Buku Besar ERP
            </h4>
            <span className="text-[11px] text-gray-500">Audit Trail Terpadu</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f2f4ee] text-gray-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">ID Batch</th>
                  <th className="py-2.5 px-3">Waktu Sinkron</th>
                  <th className="py-2.5 px-3">Sistem Tujuan</th>
                  <th className="py-2.5 px-3 text-right">Ukuran Batch</th>
                  <th className="py-2.5 px-3 text-right">Total Biaya Tersinkron</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Catatan Rekonsiliasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-gray-900">{log.id}</td>
                    <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-800">{log.system}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{log.batchSize} Dokumen</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">
                      {formatIDR(log.environmentalCostTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 max-w-sm truncate" title={log.reconciliationNotes}>
                      {log.reconciliationNotes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Simulated Integration Disclaimer */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-gray-500 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-gray-800">
            Penafian Konektivitas Sistem ERP:
          </h5>
          <p className="leading-relaxed">
            Modul ini mensimulasikan integrasi dua arah dengan SAP S/4HANA dan Oracle Cloud ERP menggunakan arsitektur payload standar industri (RFC/BAPI dan REST endpoint). Pada lingkungan implementasi sesungguhnya, koneksi aktif menggunakan kredensial aman mTLS atau OAuth2 client credentials yang menghubungkan modul akuntansi lingkungan EcoTrace secara langsung ke General Ledger ERP perusahaan.
          </p>
        </div>
      </div>
    </div>
  );
};
