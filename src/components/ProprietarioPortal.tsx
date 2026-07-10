// src/components/ProprietarioPortal.tsx
// COTA - Cooperativa de Gestão de Táxis JK
// High-fidelity Proprietario PWA Dashboard

import React, { useState } from 'react';
import { DollarSign, Car, Wrench, FileText, TrendingUp, History, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { Proprietario, Viatura, Manutencao, Documento, Financeiro } from '../types';

interface ProprietarioPortalProps {
  proprietario: Proprietario;
  viaturas: Viatura[];
  manutencoes: Manutencao[];
  documentos: Documento[];
  financeiro: Financeiro[];
  theme?: 'light' | 'dark';
}

export default function ProprietarioPortal({
  proprietario, viaturas, manutencoes, documentos, financeiro, theme = 'dark'
}: ProprietarioPortalProps) {
  // Filters for owner-specific items
  const ownerViaturas = viaturas.filter(v => v.proprietarioId === proprietario.id);
  const ownerViaturaIds = ownerViaturas.map(v => v.id);
  
  const ownerManutencoes = manutencoes.filter(m => ownerViaturaIds.includes(m.viaturaId));
  const ownerDocs = documentos.filter(d => d.proprietarioId === proprietario.id || (d.viaturaId && ownerViaturaIds.includes(d.viaturaId)));
  const ownerPayouts = financeiro.filter(f => f.proprietarioId === proprietario.id && f.categoria === 'PROP_PAYOUT');

  // Calculations
  const totalReceived = ownerPayouts.reduce((sum, f) => sum + f.valor, 0);
  const totalMaintCost = ownerManutencoes.reduce((sum, m) => sum + m.custo, 0);
  const docAlertsCount = ownerDocs.filter(d => d.diasRestantes <= 10).length;

  return (
    <div className={`flex justify-center items-start min-h-full p-4 transition-colors duration-200 ${
      theme === 'light' ? 'bg-slate-50' : 'bg-slate-950'
    }`}>
      {/* PWA Phone Frame */}
      <div className={`w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[780px] relative border transition-colors ${
        theme === 'light' ? 'bg-slate-100 border-slate-300/80 shadow-slate-200/50' : 'bg-slate-900 border-slate-800 shadow-slate-950'
      }`}>
        
        {/* Phone Notch */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 rounded-b-xl z-50 flex items-center justify-center transition-colors ${
          theme === 'light' ? 'bg-slate-200' : 'bg-slate-950'
        }`}>
          <div className={`w-3 h-3 rounded-full ${theme === 'light' ? 'bg-slate-300' : 'bg-slate-900'}`} />
        </div>

        {/* PWA App Header */}
        <header className={`px-6 pt-8 pb-4 flex items-center justify-between border-b transition-colors ${
          theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800/60'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">
              P
            </div>
            <div>
              <span className={`text-[10px] uppercase tracking-widest font-mono ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>PWA PROPRIETÁRIO</span>
              <h2 className={`text-xs font-bold -mt-0.5 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>{proprietario.usuario.nome}</h2>
            </div>
          </div>
        </header>
 
        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto p-4 flex flex-col gap-4 transition-colors ${
          theme === 'light' ? 'bg-[#f8fafc]' : 'bg-slate-900/40'
        }`}>
          
          {/* Dashboard Summary Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 rounded-3xl border border-emerald-500/30 text-slate-950 shadow-md flex flex-col gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-950/80">Saldo Recebido COTA</span>
              <h3 className="text-2xl font-extrabold font-mono text-white mt-1">{(totalReceived || 345000).toLocaleString()} Kz</h3>
              <p className="text-[10px] text-emerald-950 font-medium mt-0.5">Repasses consolidados ciclo em curso</p>
            </div>
            <div className="flex items-center gap-1 bg-emerald-950/20 px-3 py-1.5 rounded-xl border border-emerald-500/10 self-start text-xs text-white">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-semibold">Rendimento em alta de +4.8%</span>
            </div>
          </div>
 
          {/* Micro stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border text-center flex flex-col gap-1 transition-colors ${
              theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-950/30 border-slate-800/50'
            }`}>
              <span className={`text-[9px] uppercase font-bold tracking-wider ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>Sua Frota</span>
              <span className={`text-sm font-extrabold font-mono ${
                theme === 'light' ? 'text-slate-800' : 'text-white'
              }`}>{ownerViaturas.length} Viaturas</span>
            </div>
            <div className={`p-3 rounded-xl border text-center flex flex-col gap-1 transition-colors ${
              theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-950/30 border-slate-800/50'
            }`}>
              <span className={`text-[9px] uppercase font-bold tracking-wider ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>Custo Oficina</span>
              <span className="text-sm font-extrabold text-rose-500 font-mono">{totalMaintCost.toLocaleString()} Kz</span>
            </div>
          </div>
 
          {/* Owned Vehicles List */}
          <div className="flex flex-col gap-2">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-1 ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <Car className="w-3.5 h-3.5 text-slate-500" /> Suas Viaturas
            </h4>
            
            <div className="flex flex-col gap-2.5">
              {ownerViaturas.map(via => (
                <div key={via.id} className={`p-3 border rounded-2xl flex items-center justify-between text-xs transition-colors ${
                  theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm text-slate-800' : 'p-3 bg-slate-950/30 border border-slate-800/60'
                }`}>
                  <div className="flex flex-col">
                    <span className={`font-mono font-bold text-sm ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}>{via.matricula}</span>
                    <span className={`text-[10px] mt-0.5 ${
                      theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}>{via.marca} {via.modelo}</span>
                    <span className={`text-[9px] ${
                      theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                    }`}>Condutor: {via.motoristaNome || 'Nenhum'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    via.estado === 'ATIVO'
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20'
                      : via.estado === 'MANUTENCAO'
                      ? 'bg-amber-500/15 text-amber-600 border border-amber-500/20'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {via.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Active Maintenance and Repairs */}
          <div className="flex flex-col gap-2">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-1 ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <Wrench className="w-3.5 h-3.5 text-slate-500" /> Histórico & Ordens de Manutenção
            </h4>
 
            {ownerManutencoes.length === 0 ? (
              <span className={`text-xs italic text-center py-4 rounded-xl ${
                theme === 'light' ? 'bg-white border border-slate-200 text-slate-400' : 'bg-slate-950/20'
              }`}>Sem manutenções agendadas</span>
            ) : (
              ownerManutencoes.map(m => (
                <div key={m.id} className={`p-3 border rounded-xl flex items-start justify-between text-xs transition-colors ${
                  theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-950/30 border-slate-800/50'
                }`}>
                  <div className="flex flex-col gap-1">
                    <span className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{m.descricao}</span>
                    <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Viatura: {m.viaturaMatricula}</span>
                    <span className={`text-[9px] ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Oficina: {m.oficina}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-mono font-bold text-rose-500">{m.custo.toLocaleString()} Kz</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      m.status === 'CONCLUIDA' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
 
          {/* Expiring documents and insurance warnings */}
          <div className="flex flex-col gap-2">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-1 ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Documentos Legais & Validade
            </h4>
 
            {ownerDocs.map(doc => {
              const warning = doc.diasRestantes <= 10;
              return (
                <div
                  key={doc.id}
                  className={`p-3 border rounded-xl flex items-center justify-between text-xs transition-colors ${
                    warning 
                      ? theme === 'light' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-rose-950/15 border-rose-500/30' 
                      : theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-950/20 border-slate-800/60'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`font-bold ${
                      warning ? 'text-rose-700' : theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                    }`}>{doc.tipo} - {doc.alvoNome.split(' ')[1]}</span>
                    <span className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Vence: {new Date(doc.validade).toLocaleDateString()}</span>
                  </div>
                  {warning ? (
                    <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" /> Vence em {doc.diasRestantes}d
                    </span>
                  ) : (
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">REGULAR</span>
                  )}
                </div>
              );
            })}
          </div>
 
        </div>
 
        {/* Profile indicator footer */}
        <footer className={`px-6 py-4 border-t flex items-center justify-between text-xs transition-colors ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className={`font-sans font-medium ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>Cooperado Ativo</span>
          </div>
          <span className={`text-[9px] font-mono ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>ID: PROP-{proprietario.id.substring(5)}</span>
        </footer>
      </div>
    </div>
  );
}
