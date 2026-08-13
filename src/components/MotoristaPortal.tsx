// src/components/MotoristaPortal.tsx
// COTA - Cooperativa de Gestão de Táxis JK
// High-fidelity Motorista PWA Dashboard (Shift & Daily Meta Tracker)

import React, { useState } from 'react';
import axios from '../config/api';
import {
  Power,
  MapPin,
  User,
  Compass,
  Star,
  Bell,
  History,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  Navigation,
  Wrench,
  ShieldAlert,
  Flame,
  AlertTriangle,
  MessageSquare,
  Plus,
  ArrowRight,
  ClipboardList,
  Gauge,
  X,
  Send,
  HelpCircle
} from 'lucide-react';
import { Motorista, Viatura, Turno, TipoIncidente } from '../types';
import MapComponent from './MapComponent';

interface MotoristaPortalProps {
  motorista: Motorista;
  viaturas: Viatura[];
  turnos: Turno[];
  onRefresh: () => void;
  theme?: 'light' | 'dark';
}

export default function MotoristaPortal({
  motorista,
  viaturas,
  turnos,
  onRefresh,
  theme = 'dark'
}: MotoristaPortalProps) {
  // State for shift creation (Iniciar Turno)
  const [selectedViaturaId, setSelectedViaturaId] = useState('');
  const [kmInicial, setKmInicial] = useState<number>(0);
  const [horaInicio, setHoraInicio] = useState(new Date().toLocaleTimeString().substring(0, 5));
  const [dataTurno, setDataTurno] = useState(new Date().toISOString().split('T')[0]);

  // State for Incident reporting during the day
  const [activeIncidentType, setActiveIncidentType] = useState<TipoIncidente | null>(null);
  const [incidentDesc, setIncidentDesc] = useState('');
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // State for messages to Gestor
  const [quickMessage, setQuickMessage] = useState('');

  // State for Ending Shift (Encerrar Turno)
  const [kmFinal, setKmFinal] = useState<string>('');
  const [valorArrecadado, setValorArrecadado] = useState<string>('');
  const [observacoes, setObservacoes] = useState('');
  const [showEndShiftConfirm, setShowEndShiftConfirm] = useState(false);

  // State to show last completed shift summary
  const [showSummary, setShowSummary] = useState(false);
  const [lastEndedShift, setLastEndedShift] = useState<Turno | null>(null);

  // Find active shift of the driver
  const activeShift = turnos.find(t => t.motoristaId === motorista.id && t.estado === 'EM_SERVICO');

  // Find assigned vehicle detail
  const assignedViatura = activeShift ? viaturas.find(v => v.id === activeShift.viaturaId) : null;

  // Handle vehicle selection change to prefill Odometer
  const handleViaturaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const viaId = e.target.value;
    setSelectedViaturaId(viaId);
    const via = viaturas.find(v => v.id === viaId);
    if (via) {
      setKmInicial(via.quilometragem);
    }
  };

  // Iniciar Turno API call
  const handleStartShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedViaturaId) {
      alert('Selecione uma viatura para iniciar serviço.');
      return;
    }
    try {
      await axios.post('/turnos/iniciar', {
        motoristaId: motorista.id,
        viaturaId: selectedViaturaId,
        kmInicial,
        horaInicio,
        dataTurno
      });
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao iniciar turno.');
    }
  };

  // Submit Incident API call
  const handleReportIncident = async () => {
    if (!activeShift) return;
    if (!activeIncidentType || !incidentDesc) {
      alert('Descreva resumidamente o ocorrido antes de reportar.');
      return;
    }
    try {
      await axios.post(`/turnos/${activeShift.id}/incidente`, {
        tipo: activeIncidentType,
        descricao: incidentDesc,
        latitude: assignedViatura?.latitudeSim || -8.8368,
        longitude: assignedViatura?.longitudeSim || 13.2332
      });
      alert('Ocorrência reportada ao Gestor e central de operações!');
      setActiveIncidentType(null);
      setIncidentDesc('');
      setShowIncidentModal(false);
      onRefresh();
    } catch (err: any) {
      alert('Erro ao enviar relatório de ocorrência.');
    }
  };

  // Send message API call
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift || !quickMessage.trim()) return;
    try {
      await axios.post(`/turnos/${activeShift.id}/comunicar`, {
        mensagem: quickMessage
      });
      setQuickMessage('');
      onRefresh();
    } catch {
      alert('Erro ao enviar mensagem.');
    }
  };

  // Encerrar Turno API call
  const handleEndShiftSubmit = async () => {
    if (!activeShift) return;
    if (!kmFinal || parseInt(kmFinal) < activeShift.kmInicial) {
      alert(`A quilometragem final deve ser igual ou superior à inicial (${activeShift.kmInicial} KM).`);
      return;
    }
    if (!valorArrecadado || parseFloat(valorArrecadado) < 0) {
      alert('Informe o valor total arrecadado no dia.');
      return;
    }

    try {
      const res = await axios.post(`/turnos/${activeShift.id}/encerrar`, {
        kmFinal: parseInt(kmFinal),
        horaFim: new Date().toLocaleTimeString().substring(0, 5),
        valorArrecadado: parseFloat(valorArrecadado),
        observacoes
      });
      
      // Save for summary display
      setLastEndedShift(res.data);
      setShowSummary(true);

      // Reset local end shift inputs
      setKmFinal('');
      setValorArrecadado('');
      setObservacoes('');
      setShowEndShiftConfirm(false);
      onRefresh();
    } catch (err: any) {
      alert('Erro ao encerrar turno.');
    }
  };

  // History of completed shifts for this driver
  const completedShifts = turnos.filter(t => t.motoristaId === motorista.id && t.estado === 'CONCLUIDO');

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
          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
            theme === 'light' ? 'bg-slate-300 border-slate-400' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme === 'light' ? 'bg-slate-400' : 'bg-slate-700'}`} />
          </div>
        </div>

        {/* PWA App Header */}
        <header className={`px-6 pt-8 pb-4 flex items-center justify-between border-b transition-colors ${
          theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800/60'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">
              COTA
            </div>
            <div>
              <span className={`text-[10px] uppercase tracking-widest font-mono ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>PWA MOTORISTA</span>
              <h2 className={`text-xs font-bold -mt-0.5 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>{motorista.usuario.nome}</h2>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider ${
            activeShift 
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
              : theme === 'light' ? 'bg-slate-200 text-slate-500' : 'bg-slate-800 text-slate-400'
          }`}>
            {activeShift ? 'EM SERVIÇO' : 'LIVRE'}
          </span>
        </header>

        {/* Scrollable Content Area */}
        <div className={`flex-1 overflow-y-auto p-4 flex flex-col gap-4 transition-colors ${
          theme === 'light' ? 'bg-[#f8fafc]' : 'bg-slate-900/40'
        }`}>
          
          {/* STATE 3: SHIFT COMPLETED SUMMARY POPUP */}
          {showSummary && lastEndedShift && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 flex flex-col gap-3.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold text-xs uppercase tracking-wider">Turno Concluído com Sucesso!</h3>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Viatura:</span>
                  <span className="text-white font-bold">{lastEndedShift.viaturaMatricula}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Km Percorridos:</span>
                  <span className="text-white font-bold">
                    {lastEndedShift.kmFinal && lastEndedShift.kmFinal - lastEndedShift.kmInicial} KM
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Meta Requerida:</span>
                  <span className="text-slate-300">{lastEndedShift.metaDiaria.toLocaleString()} Kz</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Valor Arrecadado:</span>
                  <span className="text-white font-bold text-sm text-emerald-400">
                    {lastEndedShift.valorArrecadado?.toLocaleString()} Kz
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Meta Cumprida:</span>
                  <span className={`font-bold ${lastEndedShift.metaCumprida ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {lastEndedShift.metaCumprida ? 'SIM (PARABÉNS!)' : 'NÃO'}
                  </span>
                </div>
                <div className="flex justify-between pb-0.5">
                  <span className="text-slate-400">Diferença:</span>
                  <span className={`font-bold ${lastEndedShift.diferenca && lastEndedShift.diferenca >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {lastEndedShift.diferenca && lastEndedShift.diferenca >= 0 ? '+' : ''}
                    {lastEndedShift.diferenca?.toLocaleString()} Kz
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSummary(false);
                  setLastEndedShift(null);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl transition"
              >
                Voltar à Página Inicial
              </button>
            </div>
          )}

          {/* STATE 1: NO ACTIVE SHIFT (Show Iniciar Turno form) */}
          {!activeShift && !showSummary && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              
              {/* Information Banner */}
              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                <h3 className="text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-emerald-400" />
                  Registo Diário Obrigatório
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Para cumprir as regras da cooperativa COTA JK, certifique-se de associar a viatura correspondente e indicar a quilometragem exata ao iniciar o serviço.
                </p>
              </div>

              {/* Start Shift Form */}
              <form onSubmit={handleStartShiftSubmit} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Iniciar Novo Turno</span>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">Selecione a Viatura</label>
                  <select
                    value={selectedViaturaId}
                    onChange={handleViaturaChange}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  >
                    <option value="">-- Escolher Viatura --</option>
                    {viaturas
                      .filter(v => v.estado !== 'INATIVO')
                      .map(via => (
                        <option key={via.id} value={via.id}>
                          {via.matricula} - {via.marca} {via.modelo} (Meta: {via.metaDiaria.toLocaleString()} Kz)
                        </option>
                      ))}
                  </select>
                </div>

                {selectedViaturaId && (() => {
                  const selectedVia = viaturas.find(v => v.id === selectedViaturaId);
                  if (!selectedVia) return null;
                  return (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col gap-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Marca/Modelo:</span>
                        <span className="font-bold text-white">{selectedVia.marca} {selectedVia.modelo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Meta Diária COTA:</span>
                        <span className="font-bold text-emerald-400 font-mono">{selectedVia.metaDiaria.toLocaleString()} Kz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Odométro Atual:</span>
                        <span className="font-bold text-white font-mono">{selectedVia.quilometragem.toLocaleString()} KM</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-medium">KM Inicial</label>
                    <input
                      type="number"
                      value={kmInicial || ''}
                      onChange={e => setKmInicial(parseInt(e.target.value) || 0)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-medium">Hora Início</label>
                    <input
                      type="text"
                      value={horaInicio}
                      onChange={e => setHoraInicio(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">Data do Turno</label>
                  <input
                    type="date"
                    value={dataTurno}
                    onChange={e => setDataTurno(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 mt-2"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Entrar em Serviço Activo</span>
                </button>
              </form>

              {/* Driver Penalties Notification */}
              {motorista.penalizacoesCount > 0 && (
                <div className="p-3.5 bg-rose-950/20 border border-rose-500/20 rounded-xl flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">Infrações Disciplinares</span>
                    <span className="text-[9px] text-slate-400">Você possui {motorista.penalizacoesCount} penalizações ativas na cooperativa.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATE 2: ACTIVE SHIFT (In service) */}
          {activeShift && !showSummary && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              
              {/* Shift Banner */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Em serviço com:</span>
                  <span className="font-bold text-white uppercase">{activeShift.viaturaMatricula}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500">Iniciado às: </span>
                    <span className="text-slate-300 font-bold">{activeShift.horaInicio}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">KM Início: </span>
                    <span className="text-slate-300 font-bold">{activeShift.kmInicial}</span>
                  </div>
                </div>
                <div className="bg-emerald-950/20 p-2 rounded-xl border border-emerald-500/10 flex justify-between items-center mt-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wide">Meta Recomendada:</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">{activeShift.metaDiaria.toLocaleString()} Kz</span>
                </div>
              </div>

              {/* CCTV Camera & Mic Indicator */}
              <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[10px] animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 block" />
                  <span className="font-mono font-bold text-slate-300">CCTV INTERNO EM CURSO</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="bg-slate-900 border border-slate-800 text-[9px] px-1.5 py-0.5 rounded font-mono">CAM: OK</span>
                  <span className="bg-slate-900 border border-slate-800 text-[9px] px-1.5 py-0.5 rounded font-mono">MIC: EMISSÃO</span>
                </div>
              </div>

              {/* GPS Log Vector Map */}
              <div className={`p-3 rounded-2xl border transition-colors ${
                theme === 'light' ? 'bg-white border-slate-200/80' : 'bg-slate-950 border-slate-800'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 font-mono flex items-center justify-between ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <span>GPS EM TEMPO REAL</span>
                  {assignedViatura && assignedViatura.velocidadeSim !== undefined && (
                    <span className={`${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'} flex items-center gap-1`}>
                      <Gauge className="w-3 h-3" /> {assignedViatura.velocidadeSim} KM/H
                    </span>
                  )}
                </span>
                <MapComponent viaturas={assignedViatura ? [assignedViatura] : []} theme={theme} />
              </div>

              {/* REPORT INCIDENT SECTION */}
              <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> Comunicação de Ocorrências
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    onClick={() => {
                      setActiveIncidentType('PROBLEMA_MECANICO');
                      setShowIncidentModal(true);
                    }}
                    className="flex flex-col items-center gap-1.5 p-2 bg-slate-900 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-slate-300 transition"
                  >
                    <Wrench className="w-4 h-4 text-orange-400" />
                    <span>Avaria Mecânica</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveIncidentType('ACIDENTE');
                      setShowIncidentModal(true);
                    }}
                    className="flex flex-col items-center gap-1.5 p-2 bg-slate-900 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-slate-300 transition"
                  >
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>Acidente de Viação</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveIncidentType('ASSALTO');
                      setShowIncidentModal(true);
                    }}
                    className="flex flex-col items-center gap-1.5 p-2 bg-slate-900 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-slate-300 transition"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span>Assalto / Coação</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveIncidentType('PNEU_FURADO');
                      setShowIncidentModal(true);
                    }}
                    className="flex flex-col items-center gap-1.5 p-2 bg-slate-900 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-slate-300 transition"
                  >
                    <Compass className="w-4 h-4 text-blue-400" />
                    <span>Pneu Furado</span>
                  </button>
                </div>
              </div>

              {/* MESSAGES / TEXTING GESTOR */}
              <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Enviar Nota para o Gestor
                </h4>
                
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={quickMessage}
                    onChange={e => setQuickMessage(e.target.value)}
                    placeholder="Escreva algo sobre o trânsito ou estado..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl px-3 flex items-center justify-center transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {activeShift.mensagens.length > 0 && (
                  <div className="flex flex-col gap-1 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 max-h-24 overflow-y-auto">
                    <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">Log do Turno:</span>
                    {activeShift.mensagens.map((msg, index) => (
                      <p key={index} className="text-[10px] text-slate-300 leading-snug">
                        • {msg}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* END SHIFT / REGISTRY OF METAS */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/20 flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 font-mono">Fechar Serviço & Enviar Meta</span>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-medium">KM Final</label>
                    <input
                      type="number"
                      value={kmFinal}
                      onChange={e => setKmFinal(e.target.value)}
                      placeholder={activeShift.kmInicial.toString()}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-medium">Valor Arrecadado (Kz)</label>
                    <input
                      type="number"
                      value={valorArrecadado}
                      onChange={e => setValorArrecadado(e.target.value)}
                      placeholder="e.g. 48000"
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-emerald-400 font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">Observações / Comentários</label>
                  <textarea
                    rows={2}
                    value={observacoes}
                    onChange={e => setObservacoes(e.target.value)}
                    placeholder="Descreva problemas com o carro, trânsito ou se precisou faltar..."
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                {/* Meta calculations preview */}
                {valorArrecadado && (() => {
                  const val = parseFloat(valorArrecadado) || 0;
                  const diff = val - activeShift.metaDiaria;
                  const isFlipped = diff >= 0;
                  return (
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[10px] flex flex-col gap-1 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Meta do Carro:</span>
                        <span className="text-white font-bold">{activeShift.metaDiaria.toLocaleString()} Kz</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Seu Faturamento:</span>
                        <span className="text-emerald-400 font-bold">{val.toLocaleString()} Kz</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1 mt-1">
                        <span className="text-slate-400">Diferença / Status:</span>
                        <span className={`font-bold ${isFlipped ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isFlipped ? 'Meta Cumprida (+' : 'Faltaram ('}
                          {Math.abs(diff).toLocaleString()} Kz)
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => setShowEndShiftConfirm(true)}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Solicitar Encerramento do Turno</span>
                </button>
              </div>
            </div>
          )}

          {/* HISTORICAL RECENT LOGS */}
          {!activeShift && !showSummary && completedShifts.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                <History className="w-3.5 h-3.5 text-slate-500" /> Últimos Turnos Concluídos
              </h4>
              <div className="flex flex-col gap-2">
                {completedShifts.slice(0, 3).map(shift => (
                  <div key={shift.id} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-300 font-mono text-[10px]">Data: {shift.dataTurno} ({shift.viaturaMatricula})</span>
                      <span className="text-[10px] text-slate-400 font-mono">Quilometragem: {shift.kmFinal} KM</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold font-mono text-[11px] block ${shift.metaCumprida ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {shift.valorArrecadado?.toLocaleString()} Kz
                      </span>
                      <span className="text-[9px] text-slate-500 uppercase">{shift.metaCumprida ? 'Metas ✅' : 'Falhou ❌'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* INCIDENT REPORT MODAL (OVERLAY) */}
        {showIncidentModal && activeIncidentType && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 animate-scaleIn">
              <div className="flex items-center justify-between">
                <span className="text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" /> REPORTAR {activeIncidentType.replace('_', ' ')}
                </span>
                <button onClick={() => setShowIncidentModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed mb-1">
                Ao reportar esta ocorrência, o Gestor da cooperativa receberá um alerta prioritário com as suas coordenadas GPS atuais do veículo.
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-medium">Escreva uma descrição detalhada:</label>
                <textarea
                  rows={3}
                  value={incidentDesc}
                  onChange={e => setIncidentDesc(e.target.value)}
                  placeholder="Escreva detalhes adicionais sobre o local, danos ou apoio necessário..."
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                  required
                />
              </div>

              {/* Mock photo attachment */}
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-600 font-mono text-[9px] text-center p-0.5">
                  FOTO REPO
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-300 font-bold">imagem_danos_auto.jpg</span>
                  <span className="text-[9px] text-slate-500">Anexo simulado capturado da câmara</span>
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleReportIncident}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-xl transition"
                >
                  Enviar Alerta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* END SHIFT CONFIRMATION MODAL */}
        {showEndShiftConfirm && activeShift && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 text-center">
              <HelpCircle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
              <h3 className="font-extrabold text-xs text-white uppercase">Confirmar Fecho de Caixa?</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Você está finalizando seu turno de hoje com a viatura <span className="text-white font-bold font-mono">{activeShift.viaturaMatricula}</span>.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] text-left flex flex-col gap-1 font-mono">
                <div><span className="text-slate-400">Meta:</span> <span className="text-white font-bold">{activeShift.metaDiaria.toLocaleString()} Kz</span></div>
                <div><span className="text-slate-400">Entregue:</span> <span className="text-emerald-400 font-bold">{(parseFloat(valorArrecadado) || 0).toLocaleString()} Kz</span></div>
                <div><span className="text-slate-400">KM Fim:</span> <span className="text-white font-bold">{kmFinal} KM</span></div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowEndShiftConfirm(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 rounded-xl transition"
                >
                  Ajustar
                </button>
                <button
                  type="button"
                  onClick={handleEndShiftSubmit}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-xl transition"
                >
                  Confirmar e Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile indicator footer */}
        <footer className={`px-6 py-4 border-t flex items-center justify-between text-xs transition-colors ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" />
            <div className="flex flex-col">
              <span className={`text-[10px] font-bold ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>Admissão</span>
              <span className={`text-[9px] font-mono ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(motorista.dataAdmissao).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{motorista.pontuacaoMedia.toFixed(1)}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
