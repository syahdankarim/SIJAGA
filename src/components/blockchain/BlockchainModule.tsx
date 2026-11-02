import React, { useState } from 'react';
import {
  Blocks,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Clock,
  Radio,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  Plus,
  Eye,
  Lock,
  Unlock,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { BlockchainBlock } from '../../types';
import { generateSimulatedHash } from '../../utils/formatters';

interface BlockchainModuleProps {
  blocks: BlockchainBlock[];
  onUpdateBlocks: (blocks: BlockchainBlock[]) => void;
}

export const BlockchainModule: React.FC<BlockchainModuleProps> = ({
  blocks,
  onUpdateBlocks,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(null);
  const [tamperTargetBlockId, setTamperTargetBlockId] = useState<number>(104);
  const [tamperValue, setTamperValue] = useState<string>('BoilerA:15.0|Power:50.0 (Dimanipulasi!)');
  const [isTamperModalOpen, setIsTamperModalOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Check if chain is currently tampered
  const hasTamperedBlock = blocks.some((b) => b.isTampered);

  // Mine a new block
  const handleMineNewBlock = () => {
    const nextNumber = Math.max(...blocks.map((b) => b.blockNumber)) + 1;
    const latestBlock = blocks[0];
    const prevHash = latestBlock.blockHash;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const payload = `SensorRec#${nextNumber}:BoilerCEMS:138.2tCO2e|Flowmeter:14.2m3|Time:${Date.now()}`;
    const newHash = generateSimulatedHash(payload + prevHash);
    const merkle = generateSimulatedHash(payload);

    const newBlock: BlockchainBlock = {
      blockNumber: nextNumber,
      blockHash: newHash,
      previousHash: prevHash,
      timestamp,
      transactionCount: 3,
      merkleRoot: merkle,
      sensorRecordSummary: `Sensor CEMS Boiler A: 138.2 tCO2e | Aliran IPAL: 14.2 m³`,
      recordedBy: 'CEMS Automated Oracle Node #04',
      isTampered: false,
      originalPayload: payload,
      currentPayload: payload,
      originalHash: newHash,
    };

    onUpdateBlocks([newBlock, ...blocks]);
    setSuccessNotice(`Blok #${nextNumber} berhasil divalidasi secara kriptografis dan ditautkan ke rantai ledger!`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // Simulate Tamper Attack
  const handleExecuteTamper = () => {
    const updated = blocks.map((b) => {
      if (b.blockNumber === tamperTargetBlockId) {
        // Change payload without re-mining valid consensus hash -> causing immediate hash mismatch!
        const invalidCurrentHash = generateSimulatedHash(tamperValue + b.previousHash);
        return {
          ...b,
          isTampered: true,
          currentPayload: tamperValue,
          blockHash: invalidCurrentHash, // Changed hash will mismatch future blocks or original signature
        };
      }
      return b;
    });

    onUpdateBlocks(updated);
    setIsTamperModalOpen(false);
    setSuccessNotice(`Simulasi serangan manipulasi data dieksekusi pada Blok #${tamperTargetBlockId}! Sistem mendeteksi hash mismatch.`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  // Reset chain to pristine state
  const handleResetChain = () => {
    const restored = blocks.map((b) => ({
      ...b,
      isTampered: false,
      currentPayload: b.originalPayload,
      blockHash: b.originalHash,
    }));
    onUpdateBlocks(restored);
    setSuccessNotice('Integritas rantai ledger berhasil dipulihkan ke kondisi tervalidasi.');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Blocks className="w-5 h-5 text-[#2F7D4A]" />
            Ledger Blockchain Lingkungan (Simulasi Integritas Data)
          </h2>
          <p className="text-xs text-gray-500">
            Pencatatan telemetri emisi dan limbah dalam rantai blok kriptografis untuk menjamin immutability dan auditabilitas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasTamperedBlock ? (
            <button
              onClick={handleResetChain}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Pulihkan Integritas Rantai (Reset)</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTamperModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Simulasi Percobaan Manipulasi</span>
            </button>
          )}

          <button
            onClick={handleMineNewBlock}
            className="px-3.5 py-1.5 bg-[#2F7D4A] hover:bg-[#25683d] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Validasi & Tambang Blok Baru</span>
          </button>
        </div>
      </div>

      {/* Success / Alert Banner */}
      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Integrity Alert Status */}
      {hasTamperedBlock ? (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-rose-900">
              PERINGATAN AUDIT: HASH MISMATCH TERDETEKSI PADA RANTAI LEDGER!
            </h4>
            <p className="leading-relaxed text-rose-800">
              Payload data pada Blok #{tamperTargetBlockId} telah diubah dari nilai aslinya. Karena hash kriptografis turunan tidak sesuai dengan signature konsensus, status integritas seluruh rantai berubah menjadi <strong>INVALID / TAMPERED DETECTED</strong>. Tidak ada data yang dapat dipalsukan tanpa merusak audit trail.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="font-bold text-gray-900">Integritas Kriptografis Rantai: 100% TERVERIFIKASI</span>
              <p className="text-[11px] text-gray-500">
                Seluruh {blocks.length} blok data sensor terikat secara kriptografis melalui Previous Hash & Merkle Root.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
            CONSENSUS OK
          </span>
        </div>
      )}

      {/* Blocks Visual Chain / Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#2F7D4A]" />
          Visualisasi Rantai Blok Kriptografis (Cryptographic Block Chain)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {blocks.map((b, idx) => (
            <div
              key={b.blockNumber}
              className={`p-4 rounded-xl border transition-all relative ${
                b.isTampered
                  ? 'border-rose-400 bg-rose-50/70 shadow-sm ring-2 ring-rose-300'
                  : 'border-gray-200 bg-[#F7F8F4] hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 text-xs">
                <span className="font-bold text-gray-900 font-mono">
                  BLOK #{b.blockNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    b.isTampered
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {b.isTampered ? 'TAMPERED' : 'VALID'}
                </span>
              </div>

              <div className="space-y-2 mt-3 text-[11px]">
                <div>
                  <span className="text-gray-400 block text-[10px]">Waktu Pencatatan:</span>
                  <span className="text-gray-700 font-medium">{b.timestamp}</span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px]">Hash Blok (SHA-256 Simulated):</span>
                  <span className="font-mono text-[10px] text-gray-900 break-all bg-white p-1 rounded border border-gray-100 block">
                    {b.blockHash.slice(0, 22)}...
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px]">Previous Block Hash:</span>
                  <span className="font-mono text-[10px] text-gray-500 break-all">
                    {b.previousHash.slice(0, 18)}...
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Data Telemetri:</span>
                  <p className="text-gray-800 font-medium truncate" title={b.sensorRecordSummary}>
                    {b.sensorRecordSummary}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBlock(b)}
                  className="w-full mt-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded text-gray-700 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspeksi Detail</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-[#F7F8F4] flex justify-between items-center">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
            Tabel Buku Besar Kriptografis (Blockchain Ledger Records)
          </h4>
          <span className="text-[11px] text-gray-500">Node: Hyperledger Fabric / Ethereum Enterprise Mock</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#f2f4ee] text-gray-700 font-semibold text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Blok ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Ringkasan Data Lingkungan</th>
                <th className="py-2.5 px-3">Otoritas Pencatat</th>
                <th className="py-2.5 px-3 font-mono">Hash Blok (SHA-256)</th>
                <th className="py-2.5 px-3 text-center">Status Integritas</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blocks.map((block) => (
                <tr
                  key={block.blockNumber}
                  className={`hover:bg-gray-50 ${block.isTampered ? 'bg-rose-50/50' : ''}`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-gray-900">
                    #{block.blockNumber}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{block.timestamp}</td>
                  <td className="py-2.5 px-3 font-medium text-gray-800 max-w-xs truncate" title={block.sensorRecordSummary}>
                    {block.sensorRecordSummary}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">{block.recordedBy}</td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-gray-700 whitespace-nowrap">
                    {block.blockHash.slice(0, 24)}...
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        block.isTampered
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {block.isTampered ? 'Mismatch Terdeteksi' : 'Verified Hash'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedBlock(block)}
                      className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
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

      {/* Educational Prototype Disclaimer */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-gray-500 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-gray-800">
            Catatan Edukatif Modul Blockchain:
          </h5>
          <p className="leading-relaxed">
            Modul ini beroperasi sebagai <strong>simulasi edukatif konsep blockchain</strong> untuk mendemonstrasikan bagaimana fungsi hash kriptografis dan struktur rantai blok mencegah pengubahan data historis (data immutability). Harap diperhatikan bahwa blockchain menjamin integritas catatan yang telah disimpan agar tidak dapat dimanipulasi, namun tidak dapat secara independen menjamin akurasi fisik pengukuran sensor asli di lapangan (yang tetap memerlukan kalibrasi sensor CEMS dan audit berkala).
          </p>
        </div>
      </div>

      {/* Modal: Simulasi Percobaan Manipulasi */}
      {isTamperModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Unlock className="w-4 h-4 text-amber-600" />
                Simulasi Serangan Manipulasi Data
              </h3>
              <button onClick={() => setIsTamperModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-gray-600 leading-relaxed">
                Pilih blok ledger yang ingin diubah datanya untuk menguji apakah sistem kriptografis dapat mendeteksi pemalsuan angka emisi:
              </p>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Pilih Target Blok</label>
                <select
                  value={tamperTargetBlockId}
                  onChange={(e) => setTamperTargetBlockId(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                >
                  {blocks.map((b) => (
                    <option key={b.blockNumber} value={b.blockNumber}>
                      Blok #{b.blockNumber} ({b.sensorRecordSummary.slice(0, 40)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Modifikasi Payload Palsu</label>
                <input
                  type="text"
                  value={tamperValue}
                  onChange={(e) => setTamperValue(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-mono text-[11px]"
                  placeholder="Misal: Ubah emisi 142.8 tCO2e menjadi 15.0 tCO2e"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                <strong>Hipotesis Pengujian:</strong> Begitu nilai payload diubah tanpa proses konsensus mining ulang, hash yang dihasilkan akan mismatch dengan signature awal, memicu status peringatan merah seketika.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsTamperModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteTamper}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold cursor-pointer"
              >
                Jalankan Serangan Manipulasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detail Inspeksi Blok Kriptografi */}
      {selectedBlock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 font-mono">
                Inspeksi Kriptografi Blok #{selectedBlock.blockNumber}
              </h3>
              <button onClick={() => setSelectedBlock(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Current Block Hash</span>
                <span className="font-mono text-[11px] font-bold text-gray-900 break-all">
                  {selectedBlock.blockHash}
                </span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Previous Block Hash</span>
                <span className="font-mono text-[11px] text-gray-600 break-all">
                  {selectedBlock.previousHash}
                </span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Merkle Root Transaction</span>
                <span className="font-mono text-[11px] text-gray-600 break-all">
                  {selectedBlock.merkleRoot}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 border border-gray-100 rounded">
                  <span className="text-[10px] text-gray-400 block">Waktu Blok Ditambang:</span>
                  <span className="font-medium text-gray-800">{selectedBlock.timestamp}</span>
                </div>
                <div className="p-2 border border-gray-100 rounded">
                  <span className="text-[10px] text-gray-400 block">Otoritas Validasi:</span>
                  <span className="font-medium text-gray-800">{selectedBlock.recordedBy}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Payload Konten Mentah:</span>
                <div className="bg-gray-900 text-emerald-400 font-mono p-2.5 rounded text-[11px] break-all">
                  {selectedBlock.currentPayload}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBlock(null)}
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
