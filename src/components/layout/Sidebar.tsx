import React from 'react';
import {
  LayoutDashboard,
  Landmark,
  Leaf,
  Gauge,
  BrainCircuit,
  Blocks,
  Workflow,
  GitMerge,
  FileSpreadsheet,
  Award,
  Globe,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  pendingProposalsCount: number;
  anomalyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingProposalsCount,
  anomalyCount,
}) => {
  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'overview', label: 'Ringkasan Eksekutif', icon: LayoutDashboard },
    { id: 'financial', label: 'Akuntansi Keuangan', icon: Landmark },
    { id: 'environmental', label: 'Akuntansi Lingkungan', icon: Leaf },
    { id: 'carbon', label: 'Manajemen Karbon', icon: Gauge },
    { id: 'ai', label: 'AI Analytics', icon: BrainCircuit, badge: anomalyCount, badgeColor: 'bg-amber-500 text-white' },
    { id: 'blockchain', label: 'Ledger Blockchain', icon: Blocks },
    { id: 'erp', label: 'Integrasi ERP', icon: Workflow },
    { id: 'linkage', label: 'Penghubung Akuntansi', icon: GitMerge, badge: pendingProposalsCount, badgeColor: 'bg-emerald-600 text-white' },
    { id: 'reports', label: 'Laporan Hijau', icon: FileSpreadsheet },
    { id: 'proper', label: 'Pemantauan PROPER', icon: Award },
    { id: 'public', label: 'Portal Transparansi Publik', icon: Globe },
  ];

  return (
    <aside className="w-64 bg-[#173D2B] text-white flex flex-col shrink-0 min-h-screen border-r border-[#24583e] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#24583e] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2F7D4A] flex items-center justify-center shadow-md border border-[#449e65]">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-tight">
              EcoTrace
            </h1>
            <p className="text-[11px] text-[#A9C7A8] tracking-wider uppercase font-medium">
              Green Accounting ERP
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-wider font-semibold text-[#A9C7A8]/70">
          Modul Terintegrasi
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#2F7D4A] text-white shadow-sm font-semibold'
                  : 'text-[#d6e5d5] hover:bg-[#204e37] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#A9C7A8]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-emerald-600 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Integrity Badge Footer */}
      <div className="p-4 border-t border-[#24583e] bg-[#122e20]/60 space-y-2 text-[11px]">
        <div className="flex items-center justify-between text-[#A9C7A8]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Blockchain Ledger
          </span>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800 font-mono">
            VERIFIED
          </span>
        </div>
        <div className="flex items-center justify-between text-[#A9C7A8]">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#A9C7A8]" />
            SAP & Oracle ERP
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">SINKRON</span>
        </div>
      </div>
    </aside>
  );
};
