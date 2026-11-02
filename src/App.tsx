/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { FinancialModule } from './components/financial/FinancialModule';
import { EnvironmentalModule } from './components/environmental/EnvironmentalModule';
import { CarbonModule } from './components/carbon/CarbonModule';
import { AIAnalyticsModule } from './components/ai/AIAnalyticsModule';
import { BlockchainModule } from './components/blockchain/BlockchainModule';
import { ERPModule } from './components/erp/ERPModule';
import { AutomatedLinkageModule } from './components/linkage/AutomatedLinkageModule';
import { GreenReportsModule } from './components/reports/GreenReportsModule';
import { ProperModule } from './components/proper/ProperModule';
import { PublicPortal } from './components/public/PublicPortal';

import {
  NavigationTab,
  FinancialTransaction,
  BlockchainBlock,
  CarbonConfig,
  LinkageProposal,
  AnomalyRecord,
  PublicFeedback,
  ERPSyncLog,
} from './types';

import {
  COMPANY_PROFILE,
  INITIAL_CARBON_CONFIG,
  MONTHLY_TRENDS,
  INCOME_STATEMENT,
  BALANCE_SHEET,
  INITIAL_TRANSACTIONS,
  ENVIRONMENTAL_READINGS,
  COST_ALLOCATIONS,
  INITIAL_BLOCKS,
  ANOMALIES,
  ERP_STATUS,
  ERP_SYNC_LOGS,
  AUTOMATED_LINKAGE_RULES,
  LINKAGE_PROPOSALS,
  PROPER_CRITERIA,
  PUBLIC_FEEDBACK_ITEMS,
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [selectedCompany, setSelectedCompany] = useState<string>(COMPANY_PROFILE.name);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-Full');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent session states
  const [monthlyData, setMonthlyData] = useState(MONTHLY_TRENDS);
  const [carbonConfig, setCarbonConfig] = useState<CarbonConfig>(INITIAL_CARBON_CONFIG);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [incomeStatement, setIncomeStatement] = useState(INCOME_STATEMENT);
  const [balanceSheet, setBalanceSheet] = useState(BALANCE_SHEET);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>(INITIAL_BLOCKS);
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>(ANOMALIES);
  const [syncLogs, setSyncLogs] = useState<ERPSyncLog[]>(ERP_SYNC_LOGS);
  const [proposals, setProposals] = useState<LinkageProposal[]>(LINKAGE_PROPOSALS);
  const [rules, setRules] = useState(AUTOMATED_LINKAGE_RULES);
  const [feedbackItems, setFeedbackItems] = useState<PublicFeedback[]>(PUBLIC_FEEDBACK_ITEMS);

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Trigger ERP Synchronization simulation
  const handleTriggerERPSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newLog: ERPSyncLog = {
        id: `SYNC-LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        system: 'SAP S/4HANA FICO',
        batchSize: 18,
        environmentalCostTotal: 97200000,
        status: 'Berhasil',
        reconciliationNotes: 'Sinkronisasi telemetri sensor CEMS & rekonsiliasi akun akrual pajak karbon sukses.',
      };
      setSyncLogs((prev) => [newLog, ...prev]);
      setIsSyncing(false);
      showToast('Sinkronisasi ERP Berhasil! 18 dokumen akuntansi lingkungan telah terekonsiliasi dengan SAP S/4HANA.');
    }, 1200);
  };

  // Add transaction
  const handleAddTransaction = (newTrx: FinancialTransaction) => {
    setTransactions((prev) => [newTrx, ...prev]);
    showToast(`Transaksi ${newTrx.id} senilai berhasil dicatat ke Jurnal Umum!`);
  };

  // Approve Linkage Proposal -> posts directly to financial transactions!
  const handleApproveProposal = (proposalId: string) => {
    const prop = proposals.find((p) => p.id === proposalId);
    if (!prop) return;

    // Update proposal status
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'Disetujui & Terposting',
              approvedBy: 'Budi Santoso, Ak., CA (Chief Accountant)',
              approvedAt: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            }
          : p
      )
    );

    // Create journal transaction
    const generatedTrx: FinancialTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      accountNumber: prop.debitAccountCode,
      accountName: prop.debitAccountName,
      description: `[Auto-Posting] ${prop.title} - ${prop.rationale}`,
      category: 'Beban Lingkungan',
      debit: prop.calculatedAmount,
      credit: 0,
      environmentalClassification: 'Pajak & Kepatuhan',
      verificationStatus: 'Terverifikasi',
      costCenter: 'CC-AUTO-LINKAGE',
    };

    setTransactions((prev) => [generatedTrx, ...prev]);
    showToast(`Jurnal otomatis untuk "${prop.title}" berhasil disetujui & diposting ke Jurnal Umum Keuangan!`);
  };

  // Reject Linkage Proposal
  const handleRejectProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? { ...p, status: 'Ditolak' }
          : p
      )
    );
    showToast(`Proposal ${proposalId} ditolak.`);
  };

  // Resolve Anomaly
  const handleResolveAnomaly = (anomalyId: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === anomalyId ? { ...a, status: 'Terselesaikan' } : a))
    );
    showToast(`Anomali ${anomalyId} berhasil ditandai selesai.`);
  };

  // Add Public Feedback
  const handleAddFeedback = (newFb: PublicFeedback) => {
    setFeedbackItems((prev) => [newFb, ...prev]);
  };

  // If public portal is active, render full-screen public portal
  if (currentTab === 'public') {
    return (
      <PublicPortal
        company={COMPANY_PROFILE}
        monthlyData={monthlyData}
        feedbackItems={feedbackItems}
        onAddFeedback={handleAddFeedback}
        onBackToDashboard={() => setCurrentTab('overview')}
      />
    );
  }

  const pendingProposalsCount = proposals.filter((p) => p.status === 'Pending Review').length;
  const activeAnomalyCount = anomalies.filter((a) => a.status !== 'Terselesaikan').length;

  return (
    <div className="flex h-screen bg-[#F7F8F4] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingProposalsCount={pendingProposalsCount}
        anomalyCount={activeAnomalyCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          selectedCompany={selectedCompany}
          onChangeCompany={setSelectedCompany}
          selectedPeriod={selectedPeriod}
          onChangePeriod={setSelectedPeriod}
          onNavigate={setCurrentTab}
          onTriggerQuickSync={handleTriggerERPSync}
          isSyncing={isSyncing}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#173D2B] text-white px-4 py-3 rounded-xl shadow-xl border border-[#2b6547] text-xs flex items-center gap-2.5 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable Viewport for Active Module */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto pb-12">
            {currentTab === 'overview' && (
              <OverviewDashboard
                monthlyData={monthlyData}
                carbonConfig={carbonConfig}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'financial' && (
              <FinancialModule
                transactions={transactions}
                incomeStatement={incomeStatement}
                balanceSheet={balanceSheet}
                onAddTransaction={handleAddTransaction}
              />
            )}

            {currentTab === 'environmental' && (
              <EnvironmentalModule
                readings={ENVIRONMENTAL_READINGS}
                costAllocations={COST_ALLOCATIONS}
              />
            )}

            {currentTab === 'carbon' && (
              <CarbonModule
                carbonConfig={carbonConfig}
                onUpdateConfig={setCarbonConfig}
                monthlyData={monthlyData}
                onTriggerLinkage={() => setCurrentTab('linkage')}
              />
            )}

            {currentTab === 'ai' && (
              <AIAnalyticsModule
                anomalies={anomalies}
                monthlyData={monthlyData}
                carbonConfig={carbonConfig}
                onResolveAnomaly={handleResolveAnomaly}
              />
            )}

            {currentTab === 'blockchain' && (
              <BlockchainModule
                blocks={blocks}
                onUpdateBlocks={setBlocks}
              />
            )}

            {currentTab === 'erp' && (
              <ERPModule
                erpSystems={ERP_STATUS}
                syncLogs={syncLogs}
                onTriggerSync={handleTriggerERPSync}
                isSyncing={isSyncing}
              />
            )}

            {currentTab === 'linkage' && (
              <AutomatedLinkageModule
                rules={rules}
                proposals={proposals}
                onApproveProposal={handleApproveProposal}
                onRejectProposal={handleRejectProposal}
              />
            )}

            {currentTab === 'reports' && (
              <GreenReportsModule
                company={COMPANY_PROFILE}
                monthlyData={monthlyData}
                carbonConfig={carbonConfig}
                costAllocations={COST_ALLOCATIONS}
              />
            )}

            {currentTab === 'proper' && (
              <ProperModule criteria={PROPER_CRITERIA} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
