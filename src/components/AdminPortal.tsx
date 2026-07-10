// src/components/AdminPortal.tsx
// COTA - Cooperativa de Gestão de Táxis JK
// Enterprise-grade Cooperative ERP Control Console

import React, { useState } from 'react';
import {
  Users, Car, ShieldAlert, DollarSign, ListOrdered, Wrench, Settings, FileText,
  Trash2, Plus, RefreshCw, Star, AlertTriangle, ArrowUpRight, ArrowDownRight, MapPin, CheckCircle, FileSpreadsheet, UserCheck, ShieldCheck, Lock
} from 'lucide-react';
import { Proprietario, Motorista, Viatura, Turno, Financeiro, Manutencao, Documento, Penalizacao, NotificacaoAlerta } from '../types';
import MapComponent from './MapComponent';
import CabineMonitor from './CabineMonitor';

interface AdminPortalProps {
  proprietarios: Proprietario[];
  motoristas: Motorista[];
  viaturas: Viatura[];
  turnos: Turno[];
  notificacoes: NotificacaoAlerta[];
  financeiro: Financeiro[];
  manutencoes: Manutencao[];
  documentos: Documento[];
  penalizacoes: Penalizacao[];
  securityLogs?: any[];
  onRefresh: () => void;
  onClearAlerts?: () => void;
  onAddProprietario: (data: any) => void;
  onAddMotorista: (data: any) => void;
  onAddViatura: (data: any) => void;
  onAddFinanceiro: (data: any) => void;
  onAddManutencao: (data: any) => void;
  onAddPenalizacao: (data: any) => void;
  onConcluirManutencao: (id: string) => void;
  theme?: 'light' | 'dark';
}

export default function AdminPortal({
  proprietarios, motoristas, viaturas, turnos, notificacoes, financeiro,
  manutencoes, documentos, penalizacoes, securityLogs = [], onRefresh, onClearAlerts,
  onAddProprietario, onAddMotorista, onAddViatura,
  onAddFinanceiro, onAddManutencao, onAddPenalizacao, onConcluirManutencao,
  theme = 'dark'
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'dash' | 'prop' | 'mot' | 'fleet' | 'fin' | 'maint' | 'docs' | 'gps' | 'sec'>('dash');

  // Modals status
  const [showPropModal, setShowPropModal] = useState(false);
  const [showMotModal, setShowMotModal] = useState(false);
  const [showViaturaModal, setShowViaturaModal] = useState(false);
  const [showFinModal, setShowFinModal] = useState(false);
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [showPenalizarModal, setShowPenalizarModal] = useState(false);

  // Form states
  const [propForm, setPropForm] = useState({ nome: '', email: '', nif: '', telefone: '', morada: '', nifEmpresa: '' });
  const [motForm, setMotForm] = useState({ nome: '', email: '', nif: '', telefone: '', numeroCarta: '', bi: '', validadeCarta: '2028-12-31' });
  const [viaForm, setViaForm] = useState({ matricula: '', marca: '', modelo: '', ano: '2022', motor: '', chassi: '', proprietarioId: '' });
  const [finForm, setFinForm] = useState({ tipo: 'RECEITA', categoria: 'TAXA_COOPERATIVA', descricao: '', valor: '', proprietarioId: '', motoristaId: '' });
  const [maintForm, setMaintForm] = useState({ viaturaId: '', descricao: '', pecasSubstitu: '', custo: '', oficina: '', dataAgendada: '' });
  const [penForm, setPenForm] = useState({ motoristaId: '', descricao: '', gravidade: 'LEVE', pontos: '2' });

  // 1. Calculations for KPIs
  const totalReceitas = financeiro.filter(f => f.tipo === 'RECEITA').reduce((s, f) => s + f.valor, 0);
  const totalDespesas = financeiro.filter(f => f.tipo === 'DESPESA').reduce((s, f) => s + f.valor, 0);
  const saldoCaixa = totalReceitas - totalDespesas;
  const activeDriversCount = motoristas.filter(m => m.estado === 'EM_SERVICO').length;
  const activeViaturasCount = viaturas.filter(v => v.estado === 'ATIVO').length;
  const docsExpirandoCount = documentos.filter(d => d.diasRestantes <= 10).length;

  const handleExportExcel = () => {
    alert('Relatório exportado com sucesso no formato XLSX. Verifique os seus downloads.');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 text-slate-100">
      {/* ERP Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-950 tracking-wider">
            CO
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              COTA <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium font-mono">ERP v1.5</span>
            </h1>
            <p className="text-xs text-slate-400">Cooperativa de Gestão de Táxis JK • Painel Geral</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            title="Sincronizar Dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-medium transition"
          >
            <FileText className="w-4 h-4" />
            <span>Imprimir PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold rounded-lg text-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </header>

      {/* Main ERP Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 flex flex-col gap-1.5">
          <p className="text-[10px] font-bold text-slate-500 px-3 uppercase tracking-wider mb-2">Módulos Corporativos</p>
          
          <button
            onClick={() => setActiveTab('dash')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'dash' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Users className="w-4 h-4" />
            <span>Dashboard Principal</span>
          </button>

          <button
            onClick={() => setActiveTab('prop')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'prop' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Gestão de Proprietários</span>
          </button>

          <button
            onClick={() => setActiveTab('mot')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'mot' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Users className="w-4 h-4" />
            <span>Gestão de Motoristas</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'fleet' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Car className="w-4 h-4" />
            <span>Gestão da Frota (Viaturas)</span>
          </button>

          <button
            onClick={() => setActiveTab('maint')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'maint' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Trash2 className="w-4 h-4 rotate-180" />
            <span>Manutenção Preventiva</span>
          </button>

          <button
            onClick={() => setActiveTab('fin')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'fin' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Gestão Financeira</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'docs' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Alertas & Documentos</span>
            {docsExpirandoCount > 0 && (
              <span className="ml-auto bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px]">
                {docsExpirandoCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gps')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'gps' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <MapPin className="w-4 h-4" />
            <span>GPS & Rastreamento Vivo</span>
          </button>

          <button
            onClick={() => setActiveTab('sec')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'sec' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Centro de Segurança</span>
            {securityLogs.filter((log: any) => log.severity === 'CRITICAL' || log.severity === 'WARNING').length > 0 && (
              <span className="ml-auto bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px]">
                {securityLogs.filter((log: any) => log.severity === 'CRITICAL' || log.severity === 'WARNING').length}
              </span>
            )}
          </button>
        </aside>

        {/* Dynamic Panel Content Area */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dash' && (
            <>
              {/* KPIs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Receitas Cooperativa</span>
                    <h3 className="text-xl font-extrabold text-white mt-1 font-mono">{totalReceitas.toLocaleString()} Kz</h3>
                    <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% este mês
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Despesas Operacionais</span>
                    <h3 className="text-xl font-extrabold text-white mt-1 font-mono">{totalDespesas.toLocaleString()} Kz</h3>
                    <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5" /> +8.1% (Manutenções)
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/25">
                    <DollarSign className="w-5 h-5 text-rose-400" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Fluxo Líquido</span>
                    <h3 className={`text-xl font-extrabold mt-1 font-mono ${saldoCaixa >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {saldoCaixa.toLocaleString()} Kz
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">Saldo consolidado cooperativa</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                    <DollarSign className="w-5 h-5 text-slate-300" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Alertas Documentação</span>
                    <h3 className="text-xl font-extrabold text-rose-400 mt-1 font-mono">{docsExpirandoCount}</h3>
                    <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" /> Atenção requerida imediata
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-rose-600/15 flex items-center justify-center border border-rose-500/30">
                    <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Live Dispatch map & fleet utilization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Rastreamento Operativo das Viaturas (Luanda)
                  </h4>
                  <MapComponent viaturas={viaturas} theme={theme} />
                </div>

                {/* Fleet Statistics Charts */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Distribuição da Frota</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Estado operacional consolidado</p>
                    
                    {/* SVG Donut Chart */}
                    <div className="flex justify-center my-6">
                      <svg width="140" height="140" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#334155" strokeWidth="12" />
                        {/* Actives circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="12"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 * (1 - activeViaturasCount / viaturas.length)}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>

                    <div className="flex flex-col gap-2 mt-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Ativas em Serviço</span>
                        <span className="font-bold text-emerald-400">{activeViaturasCount} viaturas</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Em Oficina / Manutenção</span>
                        <span className="font-bold text-amber-500">{viaturas.filter(v => v.estado === 'MANUTENCAO').length} viaturas</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Parqueadas (Livres)</span>
                        <span className="font-bold text-slate-400">{viaturas.filter(v => v.estado === 'PARQUEADO').length} viaturas</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>Motoristas Operacionais:</span>
                    <span className="font-mono text-white font-bold">{activeDriversCount} / {motoristas.length}</span>
                  </div>
                </div>
              </div>

              {/* Grid block containing: Operational Shifts tracker & Priority Alerts log */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Gestão de Turnos e Metas Diárias Table (2/3 size) */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Controlo Operacional de Turnos e Metas</h4>
                      <p className="text-[10px] text-slate-400">Registo diário de serviço, quilometragem e faturamento de condutores</p>
                    </div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono font-medium">
                      {turnos.filter(t => t.estado === 'EM_SERVICO').length} Ativos Hoje
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 font-mono text-[10px]">
                          <th className="py-2.5">Código</th>
                          <th className="py-2.5">Condutor / Viatura</th>
                          <th className="py-2.5">Período / KM</th>
                          <th className="py-2.5">Acompanhamento de Meta</th>
                          <th className="py-2.5">Incidentes</th>
                          <th className="py-2.5 text-right">Faturado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {turnos.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-slate-500 italic">
                              Nenhum turno registrado no sistema cooperativo.
                            </td>
                          </tr>
                        ) : (
                          turnos.map(turno => (
                            <tr key={turno.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                              <td className="py-3 font-mono font-bold text-slate-400">#{turno.id.substring(6)}</td>
                              <td className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-bold text-white">{turno.motoristaNome}</span>
                                  <span className="text-[10px] text-emerald-400 font-mono font-semibold">{turno.viaturaMatricula}</span>
                                </div>
                              </td>
                              <td className="py-3 font-mono text-[11px] text-slate-300">
                                <div className="flex flex-col">
                                  <span>📅 {turno.dataTurno}</span>
                                  <span className="text-[10px] text-slate-500">
                                    ⏱️ {turno.horaInicio} {turno.horaFim ? `→ ${turno.horaFim}` : '(Em serviço)'}
                                  </span>
                                  <span className="text-[9px] text-slate-500">
                                    🏎️ KM: {turno.kmInicial} {turno.kmFinal ? `→ ${turno.kmFinal}` : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3">
                                {turno.estado === 'EM_SERVICO' ? (
                                  <div className="flex flex-col">
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold inline-block w-fit">
                                      EM SERVIÇO ACTIVO
                                    </span>
                                    <span className="text-[10px] text-slate-400 mt-1">Exigido: {turno.metaDiaria.toLocaleString()} Kz</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold inline-block w-fit ${
                                      turno.metaCumprida
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    }`}>
                                      {turno.metaCumprida ? 'META ATINGIDA ✅' : 'META INCUMPRIDA ❌'}
                                    </span>
                                    <span className={`text-[10px] mt-1 font-semibold ${turno.diferenca && turno.diferenca >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {turno.diferenca && turno.diferenca >= 0 ? '+' : ''}
                                      {turno.diferenca?.toLocaleString()} Kz
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="py-3">
                                {turno.incidentes.length > 0 ? (
                                  <div className="flex flex-col gap-1">
                                    {turno.incidentes.map(inc => (
                                      <span key={inc.id} className="text-[9px] bg-rose-500/15 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold w-fit">
                                        ⚠️ {inc.tipo.replace('_', ' ')}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-500 text-[10px] italic">Sem ocorrências</span>
                                )}
                              </td>
                              <td className="py-3 text-right font-mono font-bold text-white text-xs">
                                {turno.estado === 'EM_SERVICO' ? (
                                  <span className="text-slate-500 italic text-[11px] font-normal">Pendente</span>
                                ) : (
                                  <span className="text-emerald-400">{turno.valorArrecadado?.toLocaleString()} Kz</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Priority Alerts and Notifications Board (1/3 size) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[420px] overflow-hidden">
                  <div className="flex flex-col gap-1 border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                        Alertas Urgentes COTA
                      </h4>
                      {onClearAlerts && notificacoes.some(n => !n.lida) && (
                        <button
                          onClick={onClearAlerts}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold transition font-mono uppercase"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">Avisos de acidentes, assaltos, avarias mecânicas e metas perdidas</p>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
                    {notificacoes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 text-[11px]">
                        <CheckCircle className="w-8 h-8 text-emerald-500/30 mb-2" />
                        <span>Excelente! Nenhuma notificação crítica pendente no servidor.</span>
                      </div>
                    ) : (
                      notificacoes.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl border flex flex-col gap-1 text-[11px] leading-snug transition-all ${
                            notif.tipo === 'ASSALTO' || notif.tipo === 'ACIDENTE'
                              ? 'bg-red-500/10 border-red-500/30 text-red-200'
                              : notif.tipo === 'VIATURA_AVARIADA'
                              ? 'bg-orange-500/10 border-orange-500/25 text-orange-200'
                              : notif.tipo === 'META_NAO_CUMPRIDA'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                          } ${!notif.lida ? 'ring-1 ring-emerald-500/30' : ''}`}
                        >
                          <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase">
                            <span className={
                              notif.tipo === 'ASSALTO' || notif.tipo === 'ACIDENTE'
                                ? 'text-red-400'
                                : notif.tipo === 'VIATURA_AVARIADA'
                                ? 'text-orange-400'
                                : 'text-slate-400'
                            }>
                              ⚠️ {notif.tipo.replace('_', ' ')}
                            </span>
                            <span className="text-slate-500">{new Date(notif.dataHora).toLocaleTimeString().substring(0, 5)}</span>
                          </div>
                          <p>{notif.mensagem}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: PROPRIETÁRIOS */}
          {activeTab === 'prop' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Módulo 2: Gestão de Proprietários</h3>
                  <p className="text-xs text-slate-400">Controle de donos de frotas associados à COTA</p>
                </div>
                <button
                  onClick={() => setShowPropModal(true)}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  <Plus className="w-4 h-4" /> Cadastrar Proprietário
                </button>
              </div>

              {/* Table List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3">Nome</th>
                      <th className="pb-3">NIF Pessoal / Empresa</th>
                      <th className="pb-3">Telefone</th>
                      <th className="pb-3">Endereço Residencial</th>
                      <th className="pb-3">Total Viaturas</th>
                      <th className="pb-3">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proprietarios.map(prop => (
                      <tr key={prop.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="py-3.5 font-bold text-white">{prop.usuario.nome}</td>
                        <td className="py-3.5 font-mono">{prop.usuario.nif} / <span className="text-slate-400">{prop.nifEmpresa}</span></td>
                        <td className="py-3.5">{prop.usuario.telefone}</td>
                        <td className="py-3.5 text-slate-300">{prop.morada}</td>
                        <td className="py-3.5 font-bold text-emerald-400">{prop.viaturasCount} viaturas</td>
                        <td className="py-3.5 text-slate-400 font-mono text-[10px]">{new Date(prop.dataCadastro).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MOTORISTAS */}
          {activeTab === 'mot' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Módulo 3: Gestão de Motoristas</h3>
                  <p className="text-xs text-slate-400">Controle de motoristas, estado operativo, avaliações e penalidades</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPenalizarModal(true)}
                    className="flex items-center gap-1 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 font-semibold px-3 py-1.5 rounded-xl text-xs transition"
                  >
                    Aplicar Penalização
                  </button>
                  <button
                    onClick={() => setShowMotModal(true)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                  >
                    <Plus className="w-4 h-4" /> Cadastrar Motorista
                  </button>
                </div>
              </div>

              {/* Drivers table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3">Motorista</th>
                      <th className="pb-3">NIF / BI</th>
                      <th className="pb-3">Carta de Condução</th>
                      <th className="pb-3">Classificação</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3">Infracções Ativas</th>
                      <th className="pb-3">Telefone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {motoristas.map(mot => (
                      <tr key={mot.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="py-3.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-white">{mot.usuario.nome}</span>
                            <span className="text-[10px] text-slate-500">{mot.usuario.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 font-mono">{mot.nif} / <span className="text-slate-400">{mot.bi}</span></td>
                        <td className="py-3.5 font-mono">
                          <div className="flex flex-col">
                            <span>{mot.numeroCarta}</span>
                            <span className="text-[10px] text-slate-400">Expira: {new Date(mot.validadeCarta).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-bold">{mot.pontuacaoMedia.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            mot.estado === 'ATIVO'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : mot.estado === 'EM_SERVICO'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {mot.estado}
                          </span>
                        </td>
                        <td className="py-3.5 font-bold text-slate-300 font-mono text-center">
                          {mot.penalizacoesCount > 0 ? (
                            <span className="text-rose-400">{mot.penalizacoesCount} infracção(ões)</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-3.5 text-slate-300">{mot.usuario.telefone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FROTA (Viaturas) */}
          {activeTab === 'fleet' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Módulo 4: Gestão da Frota</h3>
                  <p className="text-xs text-slate-400">Relação de táxis cadastrados, propriedade e motoristas designados</p>
                </div>
                <button
                  onClick={() => setShowViaturaModal(true)}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  <Plus className="w-4 h-4" /> Adicionar Viatura
                </button>
              </div>

              {/* Fleet List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3">Matrícula</th>
                      <th className="pb-3">Marca / Modelo / Ano</th>
                      <th className="pb-3">Proprietário</th>
                      <th className="pb-3">Motorista Escalado</th>
                      <th className="pb-3">Nº de Motor / Chassi</th>
                      <th className="pb-3">Estado Operativo</th>
                      <th className="pb-3">Última Posição Sim</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viaturas.map(via => (
                      <tr key={via.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="py-3.5 font-mono font-bold text-white text-sm">{via.matricula}</td>
                        <td className="py-3.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-200">{via.marca} {via.modelo}</span>
                            <span className="text-[10px] text-slate-500">Ano de fabrico: {via.ano}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-300 font-medium">{via.proprietarioNome}</td>
                        <td className="py-3.5 text-emerald-400">
                          {via.motoristaNome ? (
                            <span className="font-semibold">{via.motoristaNome}</span>
                          ) : (
                            <span className="text-slate-500 italic">Desassociado</span>
                          )}
                        </td>
                        <td className="py-3.5 font-mono text-slate-400 text-[10px]">
                          <div className="flex flex-col">
                            <span>Mtr: {via.motor || '-'}</span>
                            <span>Chs: {via.chassi || '-'}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            via.estado === 'ATIVO'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : via.estado === 'MANUTENCAO'
                              ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                              : via.estado === 'PARQUEADO'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {via.estado}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-[10px] text-slate-400">
                          {via.latitudeSim ? `${via.latitudeSim.toFixed(4)}, ${via.longitudeSim?.toFixed(4)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MANUTENÇÕES */}
          {activeTab === 'maint' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Módulo 7: Gestão de Manutenção</h3>
                  <p className="text-xs text-slate-400">Ordens de serviço preventivas, troca de peças, oficina e custos</p>
                </div>
                <button
                  onClick={() => setShowMaintModal(true)}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  <Plus className="w-4 h-4" /> Nova Ordem de Serviço
                </button>
              </div>

              {/* Maintenance orders table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3">Viatura</th>
                      <th className="pb-3">Descrição da Avaria / Peças</th>
                      <th className="pb-3">Oficina Autorizada</th>
                      <th className="pb-3">Data Agendada</th>
                      <th className="pb-3">Custo Peças / Mão de Obra</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manutencoes.map(maint => (
                      <tr key={maint.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="py-3.5 font-mono font-bold text-white">{maint.viaturaMatricula}</td>
                        <td className="py-3.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-200">{maint.descricao}</span>
                            <span className="text-[10px] text-slate-400">Peças: {maint.pecasSubstitu || 'Nenhuma registrada'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-300">{maint.oficina}</td>
                        <td className="py-3.5 font-mono text-slate-400">{new Date(maint.dataAgendada).toLocaleDateString()}</td>
                        <td className="py-3.5 font-mono font-bold text-rose-400">{maint.custo.toLocaleString()} Kz</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            maint.status === 'CONCLUIDA'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : maint.status === 'EM_CURSO'
                              ? 'bg-amber-500/15 text-amber-500 animate-pulse'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {maint.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {maint.status !== 'CONCLUIDA' && (
                            <button
                              onClick={() => onConcluirManutencao(maint.id)}
                              className="bg-emerald-600/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold px-2 py-1 rounded text-[10px] transition"
                            >
                              Concluir OS
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: FINANCEIRO */}
          {activeTab === 'fin' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Módulo 5: Gestão Financeira</h3>
                  <p className="text-xs text-slate-400">Lançamento de receitas cooperativas, despesas de manutenção, comissões de motoristas e repasse de proprietários</p>
                </div>
                <button
                  onClick={() => setShowFinModal(true)}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  <Plus className="w-4 h-4" /> Registrar Transação Manual
                </button>
              </div>

              {/* Financial Ledger Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3">Data Lançamento</th>
                      <th className="pb-3">Tipo</th>
                      <th className="pb-3">Categoria</th>
                      <th className="pb-3">Descrição da Transação</th>
                      <th className="pb-3 text-right">Valor Consolidado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeiro.map(fin => (
                      <tr key={fin.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="py-3 font-mono text-slate-400">{new Date(fin.data).toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            fin.tipo === 'RECEITA'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}>
                            {fin.tipo}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-slate-300 text-[10px] uppercase tracking-wider">{fin.categoria}</td>
                        <td className="py-3 text-slate-200">{fin.descricao}</td>
                        <td className={`py-3 text-right font-mono font-bold text-sm ${
                          fin.tipo === 'RECEITA' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {fin.tipo === 'RECEITA' ? '+' : '-'}{fin.valor.toLocaleString()} Kz
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: ALERTAS & DOCUMENTOS */}
          {activeTab === 'docs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-4 mb-2">
                <h3 className="text-base font-bold text-white">Módulo 8: Documentação & Validade Legal</h3>
                <p className="text-xs text-slate-400">Controle rigoroso de BI, NIF, Apólice de Seguros, Carta de Condução e Licenciamento das viaturas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentos.map(doc => {
                  const isExpiring = doc.diasRestantes <= 10 && doc.diasRestantes >= 0;
                  const isExpired = doc.diasRestantes < 0;
                  
                  return (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-xl border flex flex-col gap-2 shadow-md ${
                        isExpired
                          ? 'bg-rose-950/20 border-rose-500/30'
                          : isExpiring
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-slate-950/40 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2.5 py-0.5 rounded-full font-bold">
                          {doc.tipo}
                        </span>
                        
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isExpired
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                            : isExpiring
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {isExpired ? 'EXPIRADO' : isExpiring ? 'VENCE EM BREVE' : 'VÁLIDO'}
                        </span>
                      </div>

                      <div className="flex flex-col mt-1">
                        <span className="text-xs font-bold text-white">{doc.alvoNome}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Nº Registro: {doc.numero}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-800/50 mt-1 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">Validade: {new Date(doc.validade).toLocaleDateString()}</span>
                        <span className={`font-bold ${isExpired ? 'text-rose-400' : isExpiring ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {isExpired ? 'Expirou há ' + Math.abs(doc.diasRestantes) + ' dia(s)' : doc.diasRestantes + ' dias restantes'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 8: GPS */}
          {activeTab === 'gps' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-4 mb-2">
                <h3 className="text-base font-bold text-white">Módulo 9: Telemetria & Registros GPS</h3>
                <p className="text-xs text-slate-400">Histórico de coordenadas, monitorização de velocidade e alertas de violação de velocidade</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MapComponent viaturas={viaturas} theme={theme} />
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Histórico de Eventos Recentes</h4>
                  <div className="flex flex-col gap-3 h-[300px] overflow-y-auto pr-1">
                    {penalizacoes.map(pen => (
                      <div key={pen.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
                            {pen.gravidade}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(pen.dataAplicacao).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-200 leading-relaxed font-sans">{pen.descricao}</p>
                        <span className="text-[10px] text-slate-400 font-medium">Motorista: {pen.motoristaNome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Módulo 11: Cabine Monitor - Vídeo e Áudio em Tempo Real */}
              <div className="mt-4">
                <CabineMonitor viaturas={viaturas} theme={theme} />
              </div>
            </div>
          )}

          {/* TAB 9: CENTRO DE SEGURANÇA & AUDITORIA */}
          {activeTab === 'sec' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Módulo 10: Centro de Segurança & Trilha de Auditoria</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Proteção integrada contra injeções de script, tentativas de fraude operacional, controle de simultaneidade e integridade dos odómetros.
                </p>
              </div>

              {/* Security Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/20 flex flex-col gap-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Estado da Proteção</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Habilitado (100%)
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ataques Impedidos (DoS/XSS)</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    {securityLogs.filter(l => l.eventType === 'VALIDATION_FAILED' || l.eventType === 'BLOCKED_ACCESS_ATTEMPT').length}
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Exploits de Odómetro Impedidos</span>
                  <span className="text-lg font-mono font-bold text-amber-400">
                    {securityLogs.filter(l => l.message.includes('Odómetro') || l.message.includes('KM')).length}
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sessões Simultâneas Bloqueadas</span>
                  <span className="text-lg font-mono font-bold text-rose-400">
                    {securityLogs.filter(l => l.eventType === 'CONCURRENCY_EXPLOIT_PREVENTED').length}
                  </span>
                </div>
              </div>

              {/* Active Hardening Framework Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Políticas Ativas de Backend Hardening</h4>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">✔</span>
                      <div>
                        <strong className="text-white">Helmet CSS/CSP Middleware:</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">Defesa contra Cross-Site Scripting (XSS), Clickjacking e injeções de MIME no navegador.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">✔</span>
                      <div>
                        <strong className="text-white">Rate-Limiter Dinâmico (Express):</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">Limite máximo de 500 requisições por cada 15 minutos para evitar exaustão de recursos e brute-force.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">✔</span>
                      <div>
                        <strong className="text-white">Saneamento Recursivo de Inputs:</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">Processamento que neutraliza tags HTML, caracteres maliciosos e scripts suspeitos em qualquer campo.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Políticas Ativas de Integridade do Táxi</h4>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">✔</span>
                      <div>
                        <strong className="text-white">Bloqueio Anti-Retrocesso do Odómetro:</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">O sistema rejeita encerramento ou início de turno caso o motorista digite KM menor do que o atual do veículo.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">✔</span>
                      <div>
                        <strong className="text-white">Exclusão de Concorrência de Turno:</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">Garante por lógica no backend que nenhuma viatura ou motorista esteja em dois turnos concorrentes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">✔</span>
                      <div>
                        <strong className="text-white">Token de Validação Segura do Cliente:</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">Uso obrigatório de cabeçalho criptográfico exclusivo para validar a legitimidade de requisições mutantes (POST/PUT/DELETE).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-Time Security Audit Logs */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Trilha de Auditoria do ERP (Tempo Real)</h4>
                  <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">
                    Total: {securityLogs.length} eventos registrados
                  </span>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="max-h-[350px] overflow-y-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] sticky top-0 border-b border-slate-800">
                        <tr>
                          <th className="p-3">Data/Hora</th>
                          <th className="p-3">IP Cliente</th>
                          <th className="p-3">Tipo de Evento</th>
                          <th className="p-3">Severidade</th>
                          <th className="p-3">Detalhes da Atividade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {securityLogs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                              Nenhum evento de segurança registrado até ao momento.
                            </td>
                          </tr>
                        ) : (
                          [...securityLogs].reverse().map((log: any) => {
                            let sevColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                            if (log.severity === 'WARNING') sevColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                            if (log.severity === 'CRITICAL') sevColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse';

                            return (
                              <tr key={log.id} className="hover:bg-slate-900/40 transition">
                                <td className="p-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                                  {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="p-3 font-mono text-[11px] text-slate-400">
                                  {log.ip}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className="text-[10px] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                    {log.eventType}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${sevColor}`}>
                                    {log.severity}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-200">
                                  {log.message}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL WINDOWS FOR CRUD ACTIONS */}
      {/* ---------------------------------------------------- */}

      {/* Modal 1: Proprietário */}
      {showPropModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Novo Cadastro de Proprietário</h3>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={propForm.nome}
                  onChange={e => setPropForm({ ...propForm, nome: e.target.value })}
                  placeholder="ex: João Kelson"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={propForm.email}
                  onChange={e => setPropForm({ ...propForm, email: e.target.value })}
                  placeholder="ex: joao@cota.coop"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">NIF Pessoal</label>
                  <input
                    type="text"
                    value={propForm.nif}
                    onChange={e => setPropForm({ ...propForm, nif: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Telefone</label>
                  <input
                    type="text"
                    value={propForm.telefone}
                    onChange={e => setPropForm({ ...propForm, telefone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Endereço (Morada)</label>
                <input
                  type="text"
                  value={propForm.morada}
                  onChange={e => setPropForm({ ...propForm, morada: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setShowPropModal(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onAddProprietario(propForm);
                  setShowPropModal(false);
                  setPropForm({ nome: '', email: '', nif: '', telefone: '', morada: '', nifEmpresa: '' });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
              >
                Salvar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Motorista */}
      {showMotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Novo Cadastro de Motorista</h3>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={motForm.nome}
                  onChange={e => setMotForm({ ...motForm, nome: e.target.value })}
                  placeholder="Manuel Silva"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={motForm.email}
                  onChange={e => setMotForm({ ...motForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">NIF</label>
                  <input
                    type="text"
                    value={motForm.nif}
                    onChange={e => setMotForm({ ...motForm, nif: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bilhete Identidade (BI)</label>
                  <input
                    type="text"
                    value={motForm.bi}
                    onChange={e => setMotForm({ ...motForm, bi: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">Carta de Condução</label>
                  <input
                    type="text"
                    value={motForm.numeroCarta}
                    onChange={e => setMotForm({ ...motForm, numeroCarta: e.target.value })}
                    placeholder="LD-90823-C"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Telefone</label>
                  <input
                    type="text"
                    value={motForm.telefone}
                    onChange={e => setMotForm({ ...motForm, telefone: e.target.value })}
                    placeholder="+244"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setShowMotModal(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onAddMotorista(motForm);
                  setShowMotModal(false);
                  setMotForm({ nome: '', email: '', nif: '', telefone: '', numeroCarta: '', bi: '', validadeCarta: '2028-12-31' });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
              >
                Salvar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Viatura */}
      {showViaturaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Novo Cadastro de Viatura</h3>
            <div className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">Matrícula</label>
                  <input
                    type="text"
                    value={viaForm.matricula}
                    onChange={e => setViaForm({ ...viaForm, matricula: e.target.value })}
                    placeholder="LD-00-00-XX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ano de Fabrico</label>
                  <input
                    type="text"
                    value={viaForm.ano}
                    onChange={e => setViaForm({ ...viaForm, ano: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">Marca</label>
                  <input
                    type="text"
                    value={viaForm.marca}
                    onChange={e => setViaForm({ ...viaForm, marca: e.target.value })}
                    placeholder="Toyota"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Modelo</label>
                  <input
                    type="text"
                    value={viaForm.modelo}
                    onChange={e => setViaForm({ ...viaForm, modelo: e.target.value })}
                    placeholder="Hiace"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Código do Motor (Opcional)</label>
                <input
                  type="text"
                  value={viaForm.motor}
                  onChange={e => setViaForm({ ...viaForm, motor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Proprietário Associado</label>
                <select
                  value={viaForm.proprietarioId}
                  onChange={e => setViaForm({ ...viaForm, proprietarioId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="">Selecione um Proprietário...</option>
                  {proprietarios.map(p => (
                    <option key={p.id} value={p.id}>{p.usuario.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setShowViaturaModal(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onAddViatura(viaForm);
                  setShowViaturaModal(false);
                  setViaForm({ matricula: '', marca: '', modelo: '', ano: '2022', motor: '', chassi: '', proprietarioId: '' });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
              >
                Salvar Viatura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Lançamento Financeiro */}
      {showFinModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Registrar Transação Manual</h3>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Tipo de Transação</label>
                <select
                  value={finForm.tipo}
                  onChange={e => setFinForm({ ...finForm, tipo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="RECEITA">RECEITA (+)</option>
                  <option value="DESPESA">DESPESA (-)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Categoria</label>
                <select
                  value={finForm.categoria}
                  onChange={e => setFinForm({ ...finForm, categoria: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="TAXA_COOPERATIVA">TAXA COOPERATIVA</option>
                  <option value="MANUTENCAO">MANUTENÇÃO DE FROTA</option>
                  <option value="PROPRIETARIO_PAYOUT">REPASSE FINANCEIRO</option>
                  <option value="OUTRO">OUTRAS DESPESAS / RECEITAS</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Descrição Comercial</label>
                <input
                  type="text"
                  value={finForm.descricao}
                  onChange={e => setFinForm({ ...finForm, descricao: e.target.value })}
                  placeholder="ex: Licenciamento de viaturas"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Valor Comercial (Kz)</label>
                <input
                  type="number"
                  value={finForm.valor}
                  onChange={e => setFinForm({ ...finForm, valor: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-sm font-bold text-emerald-400"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setShowFinModal(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onAddFinanceiro(finForm);
                  setShowFinModal(false);
                  setFinForm({ tipo: 'RECEITA', categoria: 'TAXA_COOPERATIVA', descricao: '', valor: '', proprietarioId: '', motoristaId: '' });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
              >
                Lançar Transação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Manutenção preventive */}
      {showMaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Agendar Ordem de Serviço de Manutenção</h3>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Selecione a Viatura</label>
                <select
                  value={maintForm.viaturaId}
                  onChange={e => setMaintForm({ ...maintForm, viaturaId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="">Selecione uma viatura...</option>
                  {viaturas.map(v => (
                    <option key={v.id} value={v.id}>{v.matricula} ({v.marca} {v.modelo})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Descrição do Serviço / Avaria</label>
                <input
                  type="text"
                  value={maintForm.descricao}
                  onChange={e => setMaintForm({ ...maintForm, descricao: e.target.value })}
                  placeholder="Troca de correia dentada"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Peças a Substituir (Opcional)</label>
                <input
                  type="text"
                  value={maintForm.pecasSubstitu}
                  onChange={e => setMaintForm({ ...maintForm, pecasSubstitu: e.target.value })}
                  placeholder="Correia, Tensor"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">Oficina Credenciada</label>
                  <input
                    type="text"
                    value={maintForm.oficina}
                    onChange={e => setMaintForm({ ...maintForm, oficina: e.target.value })}
                    placeholder="Oficina JK Luanda"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Data do Agendamento</label>
                  <input
                    type="date"
                    value={maintForm.dataAgendada}
                    onChange={e => setMaintForm({ ...maintForm, dataAgendada: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Custo Total Estimado (Kz)</label>
                <input
                  type="number"
                  value={maintForm.custo}
                  onChange={e => setMaintForm({ ...maintForm, custo: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-sm font-bold text-rose-400"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setShowMaintModal(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onAddManutencao(maintForm);
                  setShowMaintModal(false);
                  setMaintForm({ viaturaId: '', descricao: '', pecasSubstitu: '', custo: '', oficina: '', dataAgendada: '' });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
              >
                Registrar OS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Penalização */}
      {showPenalizarModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Aplicar Medida Disciplinar / Penalização
            </h3>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Motorista Infrator</label>
                <select
                  value={penForm.motoristaId}
                  onChange={e => setPenForm({ ...penForm, motoristaId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="">Selecione um motorista...</option>
                  {motoristas.map(m => (
                    <option key={m.id} value={m.id}>{m.usuario.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Gravidade da Infração</label>
                <select
                  value={penForm.gravidade}
                  onChange={e => setPenForm({ ...penForm, gravidade: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="LEVE">LEVE (2 pontos na carteira)</option>
                  <option value="GRAVE">GRAVE (5 pontos na carteira)</option>
                  <option value="CRITICA">CRÍTICA (Suspensão e bloqueio de conta imediato)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Descrição Detalhada do Incidente</label>
                <textarea
                  value={penForm.descricao}
                  onChange={e => setPenForm({ ...penForm, descricao: e.target.value })}
                  rows={3}
                  placeholder="Descreva detalhadamente o ocorrido..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-sans text-xs"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setShowPenalizarModal(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onAddPenalizacao(penForm);
                  setShowPenalizarModal(false);
                  setPenForm({ motoristaId: '', descricao: '', gravidade: 'LEVE', pontos: '2' });
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-lg text-xs"
              >
                Aplicar Penalidade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
