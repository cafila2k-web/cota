// src/App.tsx
// COTA - Cooperativa de Gestão de Táxis JK
// Master Full-Stack React Orchestrator

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Smartphone, Monitor, Sun, Moon } from 'lucide-react';

import { Proprietario, Motorista, Viatura, Turno, Financeiro, Manutencao, Documento, Penalizacao, NotificacaoAlerta } from './types';
import AdminPortal from './components/AdminPortal';
import MotoristaPortal from './components/MotoristaPortal';
import ProprietarioPortal from './components/ProprietarioPortal';

// Configure API base URL for mobile Capacitor / Web deployment
const API_URL = import.meta.env.VITE_API_URL || '/api';
axios.defaults.baseURL = API_URL;

export default function App() {
  // Navigation / Swapping between simulated devices/portals
  const [activePortal, setActivePortal] = useState<'admin' | 'motorista' | 'proprietario'>('admin');

  // Theme state - defaults to light mode as requested by the user
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Full cooperative ERP state
  const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [viaturas, setViaturas] = useState<Viatura[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [notificacoes, setNotificacoes] = useState<NotificacaoAlerta[]>([]);
  const [financeiro, setFinanceiro] = useState<Financeiro[]>([]);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [penalizacoes, setPenalizacoes] = useState<Penalizacao[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize state with Full-Stack Backend API
  const fetchCooperativeState = async () => {
    try {
      const [
        resProps, resMots, resVias, resShifts, resNotifs, resFin, resMaints, resDocs, resPens, resSecLogs
      ] = await Promise.all([
        axios.get('/proprietarios'),
        axios.get('/motoristas'),
        axios.get('/viaturas'),
        axios.get('/turnos'),
        axios.get('/notificacoes'),
        axios.get('/financeiro'),
        axios.get('/manutencoes'),
        axios.get('/documentos'),
        axios.get('/penalizacoes'),
        axios.get('/security/audit-trail')
      ]);

      setProprietarios(resProps.data);
      setMotoristas(resMots.data);
      setViaturas(resVias.data);
      setTurnos(resShifts.data);
      setNotificacoes(resNotifs.data);
      setFinanceiro(resFin.data);
      setManutencoes(resMaints.data);
      setDocumentos(resDocs.data);
      setPenalizacoes(resPens.data);
      setSecurityLogs(resSecLogs.data);
      setIsLoading(false);
    } catch (error) {
      console.warn('Backend API connection offline or restarting.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCooperativeState();
    // 3-second automatic polling to simulate real-time fleet GPS updates, shift logins and alerts!
    const pollInterval = setInterval(() => {
      fetchCooperativeState();
    }, 3000);
    return () => clearInterval(pollInterval);
  }, []);

  // ----------------------------------------------------
  // ERP CORE API ACTION HANDLERS
  // ----------------------------------------------------

  const handleAddProprietario = async (formData: any) => {
    try {
      await axios.post('/proprietarios', formData);
      fetchCooperativeState();
    } catch {
      alert('Erro ao registrar proprietário no backend.');
    }
  };

  const handleAddMotorista = async (formData: any) => {
    try {
      await axios.post('/motoristas', formData);
      fetchCooperativeState();
    } catch {
      alert('Erro ao registrar motorista no backend.');
    }
  };

  const handleAddViatura = async (formData: any) => {
    try {
      await axios.post('/viaturas', formData);
      fetchCooperativeState();
    } catch {
      alert('Erro ao registrar viatura no backend.');
    }
  };

  const handleAddFinanceiro = async (formData: any) => {
    try {
      await axios.post('/financeiro', formData);
      fetchCooperativeState();
    } catch {
      alert('Erro ao lançar transação financeira.');
    }
  };

  const handleAddManutencao = async (formData: any) => {
    try {
      await axios.post('/manutencoes', formData);
      fetchCooperativeState();
    } catch {
      alert('Erro ao agendar ordem de manutenção.');
    }
  };

  const handleConcluirManutencao = async (maintId: string) => {
    try {
      await axios.post(`/manutencoes/${maintId}/concluir`);
      fetchCooperativeState();
    } catch {
      alert('Erro ao concluir ordem de serviço.');
    }
  };

  const handleAddPenalizacao = async (formData: any) => {
    try {
      const driver = motoristas.find(m => m.id === formData.motoristaId);
      await axios.post('/penalizacoes', {
        ...formData,
        motoristaNome: driver ? driver.usuario.nome : 'Desconhecido'
      });
      fetchCooperativeState();
    } catch {
      alert('Erro ao aplicar penalização disciplinar.');
    }
  };

  const handleClearAlerts = async () => {
    try {
      await axios.post('/notificacoes/ler');
      fetchCooperativeState();
    } catch {
      alert('Erro ao limpar notificações.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 gap-4 font-sans">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="font-mono text-xs tracking-widest text-slate-400">CARREGANDO SISTEMA COOPERATIVO COTA...</span>
      </div>
    );
  }

  // Fallbacks to prevent rendering empty lists before API triggers
  const safeProps = proprietarios.length > 0 ? proprietarios : [];
  const safeMots = motoristas.length > 0 ? motoristas : [];
  const safeVias = viaturas.length > 0 ? viaturas : [];
  const safeShifts = turnos.length > 0 ? turnos : [];
  const safeNotifs = notificacoes.length > 0 ? notificacoes : [];
  const safeFins = financeiro.length > 0 ? financeiro : [];
  const safeMaints = manutencoes.length > 0 ? manutencoes : [];
  const safeDocs = documentos.length > 0 ? documentos : [];
  const safePens = penalizacoes.length > 0 ? penalizacoes : [];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'light'
        ? 'bg-slate-50 text-slate-900 selection:bg-emerald-500/20'
        : 'bg-slate-950 text-slate-100 selection:bg-emerald-500/30'
    }`}>
      
      {/* Master Demo Interactive Switcher Rail */}
      <nav className={`px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-50 border-b transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-white border-slate-200/80'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-[11px] font-bold uppercase tracking-widest font-mono ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>COTA JK MULTI-PORTAL PREVIEW</span>
          </div>

          {/* Clean, Polished Theme Switcher Button */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
              theme === 'light'
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/60'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Mudar o Tema Visual"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-slate-600">Modo Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-slate-200">Modo Claro</span>
              </>
            )}
          </button>
        </div>

        <div className={`flex items-center gap-2 p-1 rounded-xl border transition-colors ${
          theme === 'light'
            ? 'bg-slate-100 border-slate-200'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            onClick={() => setActivePortal('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePortal === 'admin'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-extrabold'
                : theme === 'light'
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Consola de Gestão ERP (Gestor)</span>
          </button>

          <button
            onClick={() => setActivePortal('motorista')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePortal === 'motorista'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-extrabold'
                : theme === 'light'
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>PWA do Motorista (Turnos & Metas)</span>
          </button>

          <button
            onClick={() => setActivePortal('proprietario')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePortal === 'proprietario'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-extrabold'
                : theme === 'light'
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>PWA do Proprietário (Rendimentos)</span>
          </button>
        </div>
      </nav>

      {/* Main Container rendering active simulated device/ERP panel */}
      <div className="flex-1 flex flex-col min-h-0">
        {activePortal === 'admin' && (
          <AdminPortal
            proprietarios={safeProps}
            motoristas={safeMots}
            viaturas={safeVias}
            turnos={safeShifts}
            notificacoes={safeNotifs}
            financeiro={safeFins}
            manutencoes={safeMaints}
            documentos={safeDocs}
            penalizacoes={safePens}
            securityLogs={securityLogs}
            onRefresh={fetchCooperativeState}
            onClearAlerts={handleClearAlerts}
            onAddProprietario={handleAddProprietario}
            onAddMotorista={handleAddMotorista}
            onAddViatura={handleAddViatura}
            onAddFinanceiro={handleAddFinanceiro}
            onAddManutencao={handleAddManutencao}
            onAddPenalizacao={handleAddPenalizacao}
            onConcluirManutencao={handleConcluirManutencao}
            theme={theme}
          />
        )}

        {activePortal === 'motorista' && safeMots.length > 0 && (
          <MotoristaPortal
            motorista={safeMots[0]}
            viaturas={safeVias}
            turnos={safeShifts}
            onRefresh={fetchCooperativeState}
            theme={theme}
          />
        )}

        {activePortal === 'proprietario' && safeProps.length > 0 && (
          <ProprietarioPortal
            proprietario={safeProps[0]}
            viaturas={safeVias}
            manutencoes={safeMaints}
            documentos={safeDocs}
            financeiro={safeFins}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
