export type NavigationTab = 
  | 'overview'
  | 'financial'
  | 'environmental'
  | 'carbon'
  | 'ai'
  | 'blockchain'
  | 'erp'
  | 'linkage'
  | 'reports'
  | 'proper'
  | 'public';

export interface CompanyInfo {
  name: string;
  code: string;
  industry: string;
  plantLocations: string[];
  fiscalYear: string;
  currency: string;
  reportingPeriod: string;
}

// Financial Types
export interface FinancialTransaction {
  id: string;
  date: string;
  accountNumber: string;
  accountName: string;
  description: string;
  category: 'Pendapatan' | 'Beban Operasional' | 'Beban Lingkungan' | 'Aset Lingkungan' | 'Kewajiban Lingkungan';
  debit: number;
  credit: number;
  environmentalClassification: 'Non-Lingkungan' | 'Pencegahan Polusi' | 'Pengolahan Limbah' | 'Efisiensi Energi' | 'Pajak & Kepatuhan' | 'Restorasi Lingkungan';
  verificationStatus: 'Terverifikasi' | 'Menunggu Review' | 'Sinkronisasi ERP';
  costCenter: string;
}

export interface IncomeStatementItem {
  code: string;
  title: string;
  amount: number;
  isHeader?: boolean;
  isSubtotal?: boolean;
  isEnvironmental?: boolean;
  notes?: string;
}

export interface BalanceSheetItem {
  code: string;
  title: string;
  amount: number;
  category: 'Aset Lancar' | 'Aset Tetap Lingkungan' | 'Aset Lainnya' | 'Kewajiban Lancar' | 'Provisi Lingkungan' | 'Ekuitas';
  isEnvironmental?: boolean;
}

// Environmental Types
export interface EnvironmentalReading {
  id: string;
  timestamp: string;
  factoryLocation: string;
  productionUnit: 'Unit Boiler A' | 'Unit Smelting & Tanur' | 'Unit Finishing' | 'Instalasi IPAL' | 'Utilitas & Kompresor';
  indicator: 'Emisi Scope 1 (Cerobong)' | 'Emisi Scope 2 (Listrik PLN)' | 'Konsumsi Listrik' | 'Konsumsi Bahan Bakar' | 'Pengambilan Air Tanah' | 'Air Limbah (BOD/COD)' | 'Timbulan Limbah B3' | 'Limbah Padat Non-B3';
  measuredValue: number;
  unit: 'tCO₂e' | 'kWh' | 'Liter' | 'm³' | 'kg' | 'Ton' | 'mg/L';
  emissionFactor: number; // e.g., 0.85 kgCO2e/kWh
  calculatedImpact: string;
  monetaryEquivalent: number; // EMA equivalent cost in IDR
  dataSource: 'IoT CEMS Sensor' | 'Smart Flowmeter' | 'SCADA Power Meter' | 'Weighbridge Digital' | 'Lab Uji Terakreditasi';
  verificationStatus: 'Blockchain Verified' | 'AI Validated' | 'Pending Audit';
}

export interface EnvironmentalCostAllocation {
  unitName: string;
  energyCost: number;
  wasteCost: number;
  waterTreatmentCost: number;
  restorationCost: number;
  complianceCost: number;
  carbonTaxEstimated: number;
  totalCost: number;
  productionVolume: number; // in Ton output
  costPerTon: number;
}

// Carbon Management Types
export interface CarbonConfig {
  carbonCap: number; // tCO2e per year
  taxTariff: number; // IDR per tCO2e (default Rp 30.000)
  reportingYear: number;
  baselineReductionGoalPercent: number;
  purchasedCredits: number; // SPE-GRK credits owned
}

export interface MonthlyTrendData {
  month: string;
  revenue: number; // in million IDR
  operatingExpense: number;
  environmentalCost: number;
  netProfit: number;
  carbonEmissions: number; // tCO2e
  carbonCapMonthly: number; // monthly cap
  energyKWh: number; // in thousand kWh
  fuelLiters: number; // in thousand Liters
  waterM3: number; // in m3
  wasteTon: number; // in Ton
  recycledTon: number;
  recyclingRate: number; // percentage
}

// Blockchain Types
export interface BlockchainBlock {
  blockNumber: number;
  blockHash: string;
  previousHash: string;
  timestamp: string;
  transactionCount: number;
  merkleRoot: string;
  sensorRecordSummary: string;
  recordedBy: string;
  isTampered: boolean;
  originalPayload: string;
  currentPayload: string;
  originalHash: string;
}

// AI Analytics Types
export interface AnomalyRecord {
  id: string;
  detectedAt: string;
  operationalUnit: string;
  metricName: string;
  severity: 'Tinggi' | 'Sedang' | 'Rendah';
  anomalyValue: string;
  normalRange: string;
  probableCause: string;
  recommendedAction: string;
  financialImpact: number;
  status: 'Perlu Tindakan' | 'Dalam Investigasi' | 'Terselesaikan';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  contextData?: {
    label: string;
    value: string;
  }[];
  suggestions?: string[];
}

// ERP Integration Types
export interface ERPSystemStatus {
  systemName: string;
  systemType: 'SAP S/4HANA' | 'Oracle Cloud ERP' | 'Sistem ERP Internal';
  status: 'Terkoneksi' | 'Sinkron' | 'Tertunda';
  lastSync: string;
  syncInterval: string;
  endpoint: string;
  recordsSynced: number;
}

export interface ERPSyncLog {
  id: string;
  timestamp: string;
  system: string;
  batchSize: number;
  environmentalCostTotal: number;
  status: 'Berhasil' | 'Sebagian' | 'Gagal';
  reconciliationNotes: string;
}

// Automated Accounting Linkage Types
export interface AutomatedLinkageRule {
  id: string;
  title: string;
  conditionDescription: string;
  accountingStandard: string; // e.g., 'PSAK 57 / PSAK 104'
  debitAccount: string;
  creditAccount: string;
  formula: string;
  currentCalculatedAmount: number;
  status: 'Siap Posting' | 'Menunggu Verifikasi' | 'Sudah Terposting';
  sourceMetric: string;
}

export interface LinkageProposal {
  id: string;
  date: string;
  title: string;
  triggerEvent: string;
  sourceValue: string;
  debitAccountCode: string;
  debitAccountName: string;
  creditAccountCode: string;
  creditAccountName: string;
  calculatedAmount: number;
  rationale: string;
  status: 'Pending Review' | 'Disetujui & Terposting' | 'Ditolak';
  approvedBy?: string;
  approvedAt?: string;
}

// PROPER Monitoring Types
export interface ProperCriterion {
  id: string;
  category: string;
  weight: number;
  currentScore: number;
  maxScore: number;
  status: 'Memenuhi Kriteria Emas' | 'Memenuhi Kriteria Hijau' | 'Memenuhi Kriteria Biru' | 'Perlu Perbaikan';
  keyInitiative: string;
  lastAuditDate: string;
}

// Public Transparency Types
export interface PublicFeedback {
  id: string;
  date: string;
  name: string;
  organization: string;
  category: 'Observasi Emisi' | 'Pengelolaan Limbah' | 'Pertanyaan Laporan' | 'Saran Inovasi';
  message: string;
  status: 'Diterima' | 'Ditanggapi';
  reply?: string;
}
