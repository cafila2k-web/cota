// src/types.ts
// COTA - Cooperativa de Gestão de Táxis JK
// Type definitions for the complete cooperative ERP system (Updated for Daily Meta & Shifts)

export type PerfilUsuario = 'ADMINISTRADOR' | 'PROPRIETARIO' | 'MOTORISTA';

export type EstadoMotorista = 'ATIVO' | 'INATIVO' | 'EM_SERVICO' | 'BLOQUEADO';

export type EstadoViatura = 'ATIVO' | 'MANUTENCAO' | 'INATIVO' | 'PARQUEADO';

export type StatusManutencao = 'AGENDADA' | 'EM_CURSO' | 'CONCLUIDA' | 'CANCELADA';

export type TipoDocumento = 'BI' | 'NIF' | 'CARTA_CONDUCAO' | 'SEGURO' | 'LICENCIAMENTO' | 'INSPECCAO';

export type TipoTransacao = 'RECEITA' | 'DESPESA';

export type TipoIncidente = 'PROBLEMA_MECANICO' | 'ACIDENTE' | 'ASSALTO' | 'PNEU_FURADO' | 'FALTA_COMBUSTIVEL';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  nif?: string;
  telefone?: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  dataCriacao: string;
}

export interface Proprietario {
  id: string;
  usuarioId: string;
  usuario: Usuario;
  morada: string;
  nifEmpresa: string;
  dataCadastro: string;
  viaturasCount: number;
}

export interface Motorista {
  id: string;
  usuarioId: string;
  usuario: Usuario;
  numeroCarta: string;
  validadeCarta: string;
  nif: string;
  bi: string;
  estado: EstadoMotorista;
  pontuacaoMedia: number;
  dataAdmissao: string;
  viaturasAssociadas: string[]; // matrículas
  penalizacoesCount: number;
}

export interface Viatura {
  id: string;
  matricula: string;
  marca: string;
  modelo: string;
  ano: number;
  motor?: string;
  chassi?: string;
  estado: EstadoViatura;
  proprietarioId: string;
  proprietarioNome: string;
  metaDiaria: number; // Daily Meta value (e.g. 35000, 45000, 85000 Kz)
  motoristaId?: string;
  motoristaNome?: string;
  latitudeSim?: number;
  longitudeSim?: number;
  velocidadeSim?: number;
  quilometragem: number; // Current Odometer reading
  dataCadastro: string;
}

export interface Incidente {
  id: string;
  tipo: TipoIncidente;
  descricao: string;
  fotoUrl?: string; // Simulado
  latitude: number;
  longitude: number;
  dataHora: string;
}

export interface Turno {
  id: string;
  motoristaId: string;
  motoristaNome: string;
  viaturaId: string;
  viaturaMatricula: string;
  dataTurno: string; // YYYY-MM-DD
  horaInicio: string; // HH:MM
  kmInicial: number;
  horaFim?: string; // HH:MM (populated on close)
  kmFinal?: number; // populated on close
  valorArrecadado?: number; // Total revenue collected at final
  metaDiaria: number; // Expected Meta
  metaCumprida?: boolean; // Automatically calculated
  diferenca?: number; // Automatically calculated (valorArrecadado - metaDiaria)
  observacoes?: string;
  estado: 'EM_SERVICO' | 'CONCLUIDO';
  incidentes: Incidente[];
  mensagens: string[]; // Simple text log of alerts/messages sent
  dataCriacao: string;
  dataFim?: string;
}

export interface Financeiro {
  id: string;
  tipo: TipoTransacao;
  categoria: string; // "RECEITA_META", "MANUTENCAO", "TAXA_COOPERATIVA", "PROP_PAYOUT"
  descricao: string;
  valor: number;
  data: string;
  proprietarioId?: string;
  motoristaId?: string;
  turnoId?: string;
}

export interface Manutencao {
  id: string;
  viaturaId: string;
  viaturaMatricula: string;
  descricao: string;
  pecasSubstitu?: string;
  custo: number;
  oficina: string;
  status: StatusManutencao;
  dataAgendada: string;
  dataConclusao?: string;
  dataCriacao: string;
}

export interface Documento {
  id: string;
  tipo: TipoDocumento;
  numero: string;
  validade: string;
  arquivoUrl?: string;
  alertaAtivo: boolean;
  proprietarioId?: string;
  motoristaId?: string;
  viaturaId?: string;
  alvoNome: string; // "Viatura LD-12...", "Manuel Silva"
  diasRestantes: number;
}

export interface GpsLog {
  id: string;
  viaturaId: string;
  viaturaMatricula: string;
  latitude: number;
  longitude: number;
  velocidade: number;
  dataHora: string;
}

export interface Escala {
  id: string;
  motoristaId: string;
  motoristaNome: string;
  viaturaId: string;
  viaturaMatricula: string;
  dataInicio: string;
  dataFim: string;
  ativa: boolean;
}

export interface Penalizacao {
  id: string;
  motoristaId: string;
  motoristaNome: string;
  descricao: string;
  gravidade: 'LEVE' | 'GRAVE' | 'CRITICA';
  pontos: number;
  dataAplicacao: string;
  ativa: boolean;
}

export interface NotificacaoAlerta {
  id: string;
  tipo: 'INICIO_TURNO' | 'FIM_TURNO' | 'META_NAO_CUMPRIDA' | 'VIATURA_AVARIADA' | 'ACIDENTE' | 'ASSALTO' | 'MANUTENCAO_VENCIDA' | 'SEGURO_VENCIDO' | 'LICENCIAMENTO_VENCIDO';
  mensagem: string;
  dataHora: string;
  lida: boolean;
  viaturaMatricula?: string;
  motoristaNome?: string;
}
