// src/mockData.ts
// COTA - Cooperativa de Gestão de Táxis JK
// High-fidelity state seeding for live frontend simulations (Shift & Meta Diary System)

import { Proprietario, Motorista, Viatura, Turno, Financeiro, Manutencao, Documento, Escala, Penalizacao, NotificacaoAlerta } from './types';

export const initialProprietarios: Proprietario[] = [
  {
    id: 'prop-1',
    usuarioId: 'user-prop-1',
    usuario: {
      id: 'user-prop-1',
      email: 'joao.proprietario@cota.coop',
      nome: 'João Kelson',
      nif: '100450982',
      telefone: '+244923111001',
      perfil: 'PROPRIETARIO',
      ativo: true,
      dataCriacao: '2025-01-10T10:00:00Z',
    },
    morada: 'Avenida Luanda, Luanda, Angola',
    nifEmpresa: '540192038',
    dataCadastro: '2025-01-10T10:00:00Z',
    viaturasCount: 3,
  },
  {
    id: 'prop-2',
    usuarioId: 'user-prop-2',
    usuario: {
      id: 'user-prop-2',
      email: 'eduardo.prop@cota.coop',
      nome: 'Eduardo Mateus',
      nif: '100670912',
      telefone: '+244923111002',
      perfil: 'PROPRIETARIO',
      ativo: true,
      dataCriacao: '2025-02-15T14:30:00Z',
    },
    morada: 'Bairro Alvalade, Luanda',
    nifEmpresa: '540198777',
    dataCadastro: '2025-02-15T14:30:00Z',
    viaturasCount: 2,
  }
];

export const initialMotoristas: Motorista[] = [
  {
    id: 'mot-1',
    usuarioId: 'user-mot-1',
    usuario: {
      id: 'user-mot-1',
      email: 'manuel.silva@cota.coop',
      nome: 'Manuel Silva',
      nif: '210540983',
      telefone: '+244923222001',
      perfil: 'MOTORISTA',
      ativo: true,
      dataCriacao: '2025-01-12T08:00:00Z',
    },
    numeroCarta: 'LD-90823-C',
    validadeCarta: '2028-12-31',
    nif: '210540983',
    bi: '009827361LA044',
    estado: 'EM_SERVICO',
    pontuacaoMedia: 4.8,
    dataAdmissao: '2025-01-12T08:00:00Z',
    viaturasAssociadas: ['LD-32-15-AM'],
    penalizacoesCount: 1,
  },
  {
    id: 'mot-2',
    usuarioId: 'user-mot-2',
    usuario: {
      id: 'user-mot-2',
      email: 'antonio.lopes@cota.coop',
      nome: 'António Lopes',
      nif: '240567112',
      telefone: '+244923222002',
      perfil: 'MOTORISTA',
      ativo: true,
      dataCriacao: '2025-01-15T09:15:00Z',
    },
    numeroCarta: 'LD-45210-B',
    validadeCarta: '2029-06-15',
    nif: '240567112',
    bi: '005432110LA022',
    estado: 'ATIVO',
    pontuacaoMedia: 4.9,
    dataAdmissao: '2025-01-15T09:15:00Z',
    viaturasAssociadas: ['LD-88-99-TX'],
    penalizacoesCount: 0,
  },
  {
    id: 'mot-3',
    usuarioId: 'user-mot-3',
    usuario: {
      id: 'user-mot-3',
      email: 'claudio.pedro@cota.coop',
      nome: 'Cláudio Pedro',
      nif: '290112445',
      telefone: '+244923222003',
      perfil: 'MOTORISTA',
      ativo: true,
      dataCriacao: '2025-03-20T11:00:00Z',
    },
    numeroCarta: 'LD-11200-A',
    validadeCarta: '2026-08-15',
    nif: '290112445',
    bi: '003211990LA088',
    estado: 'INATIVO',
    pontuacaoMedia: 4.2,
    dataAdmissao: '2025-03-20T11:00:00Z',
    viaturasAssociadas: [],
    penalizacoesCount: 2,
  }
];

export const initialViaturas: Viatura[] = [
  {
    id: 'via-1',
    matricula: 'LD-32-15-AM',
    marca: 'Toyota',
    modelo: 'Hiace (Quadrado)',
    ano: 2021,
    motor: '2KD-FTV',
    chassi: 'JT111HA20092318',
    estado: 'ATIVO',
    proprietarioId: 'prop-1',
    proprietarioNome: 'João Kelson',
    metaDiaria: 45000, // 45.000 Kz daily meta
    motoristaId: 'mot-1',
    motoristaNome: 'Manuel Silva',
    latitudeSim: -8.8368,
    longitudeSim: 13.2332,
    velocidadeSim: 35,
    quilometragem: 120500,
    dataCadastro: '2025-01-11T10:00:00Z',
  },
  {
    id: 'via-2',
    matricula: 'LD-88-99-TX',
    marca: 'Hyundai',
    modelo: 'Elantra',
    ano: 2022,
    motor: '1.6 Gamma MPI',
    chassi: 'KMHDU212389104',
    estado: 'ATIVO',
    proprietarioId: 'prop-1',
    proprietarioNome: 'João Kelson',
    metaDiaria: 35000, // 35.000 Kz daily meta
    motoristaId: 'mot-2',
    motoristaNome: 'António Lopes',
    latitudeSim: -8.8149,
    longitudeSim: 13.2442,
    velocidadeSim: 45,
    quilometragem: 84320,
    dataCadastro: '2025-01-16T11:00:00Z',
  },
  {
    id: 'via-3',
    matricula: 'LD-44-12-CZ',
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: 2020,
    motor: '1.8L 2ZR-FE',
    chassi: 'JT111CO20042199',
    estado: 'MANUTENCAO',
    proprietarioId: 'prop-2',
    proprietarioNome: 'Eduardo Mateus',
    metaDiaria: 35000,
    latitudeSim: -8.8450,
    longitudeSim: 13.2200,
    velocidadeSim: 0,
    quilometragem: 192800,
    dataCadastro: '2025-02-18T10:00:00Z',
  }
];

export const initialTurnos: Turno[] = [
  {
    id: 'shift-1',
    motoristaId: 'mot-1',
    motoristaNome: 'Manuel Silva',
    viaturaId: 'via-1',
    viaturaMatricula: 'LD-32-15-AM',
    dataTurno: '2026-07-07',
    horaInicio: '06:00',
    kmInicial: 120400,
    metaDiaria: 45000,
    estado: 'EM_SERVICO',
    incidentes: [],
    mensagens: ['Iniciou o turno matinal. Bom trabalho!'],
    dataCriacao: '2026-07-07T06:00:00Z'
  },
  {
    id: 'shift-2',
    motoristaId: 'mot-2',
    motoristaNome: 'António Lopes',
    viaturaId: 'via-2',
    viaturaMatricula: 'LD-88-99-TX',
    dataTurno: '2026-07-06',
    horaInicio: '07:00',
    kmInicial: 84150,
    horaFim: '18:30',
    kmFinal: 84320,
    valorArrecadado: 48500, // Arrecadou 48.500 Kz
    metaDiaria: 35000, // Meta era 35.000 Kz
    metaCumprida: true,
    diferenca: 13500, // Sobrou 13.500 Kz
    observacoes: 'Trânsito moderado na Marginal, dia excelente.',
    estado: 'CONCLUIDO',
    incidentes: [],
    mensagens: ['Turno concluído com meta superada!'],
    dataCriacao: '2026-07-06T07:00:00Z',
    dataFim: '2026-07-06T18:30:00Z'
  },
  {
    id: 'shift-3',
    motoristaId: 'mot-3',
    motoristaNome: 'Cláudio Pedro',
    viaturaId: 'via-3',
    viaturaMatricula: 'LD-44-12-CZ',
    dataTurno: '2026-07-05',
    horaInicio: '06:30',
    kmInicial: 192750,
    horaFim: '14:00',
    kmFinal: 192800,
    valorArrecadado: 12000, // Arrecadou 12.000 Kz
    metaDiaria: 35000, // Meta era 35.000 Kz
    metaCumprida: false,
    diferenca: -23000, // Faltou 23.000 Kz
    observacoes: 'Viatura começou a falhar na embraiagem às 13h, encostei e chamei a oficina.',
    estado: 'CONCLUIDO',
    incidentes: [
      {
        id: 'inc-1',
        tipo: 'PROBLEMA_MECANICO',
        descricao: 'Falta de força na embraiagem com ruído na caixa',
        latitude: -8.8450,
        longitude: 13.2200,
        dataHora: '2026-07-05T13:15:00Z'
      }
    ],
    mensagens: ['Solicitou guincho para oficina central'],
    dataCriacao: '2026-07-05T06:30:00Z',
    dataFim: '2026-07-05T14:00:00Z'
  }
];

export const initialFinanceiro: Financeiro[] = [
  {
    id: 'fin-1',
    tipo: 'RECEITA',
    categoria: 'RECEITA_META',
    descricao: 'Receita Diária António Lopes (Meta Cumprida) - LD-88-99-TX',
    valor: 48500,
    data: '2026-07-06T18:30:00Z',
    motoristaId: 'mot-2',
    turnoId: 'shift-2',
  },
  {
    id: 'fin-2',
    tipo: 'RECEITA',
    categoria: 'TAXA_COOPERATIVA',
    descricao: 'Retenção COTA (10%) s/ receita LD-88-99-TX',
    valor: 4850,
    data: '2026-07-06T18:30:00Z',
  },
  {
    id: 'fin-3',
    tipo: 'DESPESA',
    categoria: 'MANUTENCAO',
    descricao: 'Mudança de óleo e filtros Corolla #via-3',
    valor: 45000,
    data: '2026-07-05T15:00:00Z',
    proprietarioId: 'prop-2',
  },
  {
    id: 'fin-4',
    tipo: 'RECEITA',
    categoria: 'RECEITA_META',
    descricao: 'Receita Parcial Cláudio Pedro (Meta Não Cumprida) - LD-44-12-CZ',
    valor: 12000,
    data: '2026-07-05T14:00:00Z',
    motoristaId: 'mot-3',
    turnoId: 'shift-3',
  },
  {
    id: 'fin-5',
    tipo: 'RECEITA',
    categoria: 'TAXA_COOPERATIVA',
    descricao: 'Retenção COTA (10%) s/ receita LD-44-12-CZ',
    valor: 1200,
    data: '2026-07-05T14:00:00Z',
  },
  {
    id: 'fin-6',
    tipo: 'RECEITA',
    categoria: 'PROP_PAYOUT',
    descricao: 'Repasse João Kelson (Proprietário) - Ciclo Junho',
    valor: 345000,
    data: '2026-06-30T17:00:00Z',
    proprietarioId: 'prop-1'
  }
];

export const initialManutencoes: Manutencao[] = [
  {
    id: 'maint-1',
    viaturaId: 'via-1',
    viaturaMatricula: 'LD-32-15-AM',
    descricao: 'Troca de pastilhas de travão frontais',
    pecasSubstitu: 'Pastilhas de Travão Bosch Hiace',
    custo: 18500,
    oficina: 'Oficina JK Express',
    status: 'CONCLUIDA',
    dataAgendada: '2026-06-20',
    dataConclusao: '2026-06-20',
    dataCriacao: '2026-06-19T14:00:00Z',
  },
  {
    id: 'maint-2',
    viaturaId: 'via-3',
    viaturaMatricula: 'LD-44-12-CZ',
    descricao: 'Substituição do kit de embraiagem e revisão de caixa',
    pecasSubstitu: 'Kit de Embraiagem Corolla OEM',
    custo: 95000,
    oficina: 'Oficina Central Luanda',
    status: 'EM_CURSO',
    dataAgendada: '2026-07-05',
    dataCriacao: '2026-07-05T14:30:00Z',
  },
  {
    id: 'maint-3',
    viaturaId: 'via-2',
    viaturaMatricula: 'LD-88-99-TX',
    descricao: 'Alinhamento, balanceamento e calibração preventiva',
    custo: 12000,
    oficina: 'Pneus e Serviços Luanda',
    status: 'AGENDADA',
    dataAgendada: '2026-07-10',
    dataCriacao: '2026-07-07T10:00:00Z',
  }
];

export const initialDocumentos: Documento[] = [
  {
    id: 'doc-1',
    tipo: 'SEGURO',
    numero: 'POL-SEG-902341',
    validade: '2026-07-12', // Expira em 5 dias!
    arquivoUrl: '/uploads/docs/seguro_via1.pdf',
    alertaAtivo: true,
    viaturaId: 'via-1',
    alvoNome: 'Viatura LD-32-15-AM',
    diasRestantes: 5,
  },
  {
    id: 'doc-2',
    tipo: 'CARTA_CONDUCAO',
    numero: 'LD-11200-A',
    validade: '2026-08-15', // Expira em 39 dias!
    arquivoUrl: '/uploads/docs/carta_mot3.pdf',
    alertaAtivo: true,
    motoristaId: 'mot-3',
    alvoNome: 'Carta Cláudio Pedro',
    diasRestantes: 39,
  },
  {
    id: 'doc-3',
    tipo: 'LICENCIAMENTO',
    numero: 'LIC-TX-2026-0098',
    validade: '2026-07-06', // Expirou ontem!
    arquivoUrl: '/uploads/docs/licenca_via3.pdf',
    alertaAtivo: true,
    viaturaId: 'via-3',
    alvoNome: 'Viatura LD-44-12-CZ',
    diasRestantes: -1,
  },
  {
    id: 'doc-4',
    tipo: 'NIF',
    numero: '540192038',
    validade: '2030-12-31',
    alertaAtivo: false,
    proprietarioId: 'prop-1',
    alvoNome: 'NIF João Kelson',
    diasRestantes: 1638,
  },
  {
    id: 'doc-5',
    tipo: 'BI',
    numero: '009827361LA044',
    validade: '2031-10-12',
    alertaAtivo: false,
    motoristaId: 'mot-1',
    alvoNome: 'BI Manuel Silva',
    diasRestantes: 1923,
  }
];

export const initialEscalas: Escala[] = [
  {
    id: 'esc-1',
    motoristaId: 'mot-1',
    motoristaNome: 'Manuel Silva',
    viaturaId: 'via-1',
    viaturaMatricula: 'LD-32-15-AM',
    dataInicio: '2026-07-06T06:00:00Z',
    dataFim: '2026-07-12T22:00:00Z',
    ativa: true,
  },
  {
    id: 'esc-2',
    motoristaId: 'mot-2',
    motoristaNome: 'António Lopes',
    viaturaId: 'via-2',
    viaturaMatricula: 'LD-88-99-TX',
    dataInicio: '2026-07-06T06:00:00Z',
    dataFim: '2026-07-12T22:00:00Z',
    ativa: true,
  }
];

export const initialPenalizacoes: Penalizacao[] = [
  {
    id: 'pen-1',
    motoristaId: 'mot-1',
    motoristaNome: 'Manuel Silva',
    descricao: 'Excesso de velocidade registado via GPS no túnel da Maianga',
    gravidade: 'GRAVE',
    pontos: 5,
    dataAplicacao: '2026-06-15T11:20:00Z',
    ativa: true,
  },
  {
    id: 'pen-2',
    motoristaId: 'mot-3',
    motoristaNome: 'Cláudio Pedro',
    descricao: 'Ausência injustificada a dois turnos consecutivos de escala',
    gravidade: 'CRITICA',
    pontos: 15,
    dataAplicacao: '2026-07-01T08:00:00Z',
    ativa: true,
  }
];

export const initialNotificacoes: NotificacaoAlerta[] = [
  {
    id: 'notif-1',
    tipo: 'INICIO_TURNO',
    mensagem: 'Motorista Manuel Silva iniciou turno na viatura LD-32-15-AM',
    dataHora: '2026-07-07T06:00:00Z',
    lida: false,
    viaturaMatricula: 'LD-32-15-AM',
    motoristaNome: 'Manuel Silva'
  },
  {
    id: 'notif-2',
    tipo: 'VIATURA_AVARIADA',
    mensagem: 'Alerta: Cláudio Pedro reportou avaria mecânica grave na viatura LD-44-12-CZ',
    dataHora: '2026-07-05T13:15:00Z',
    lida: false,
    viaturaMatricula: 'LD-44-12-CZ',
    motoristaNome: 'Cláudio Pedro'
  },
  {
    id: 'notif-3',
    tipo: 'META_NAO_CUMPRIDA',
    mensagem: 'Meta não cumprida por Cláudio Pedro: arrecadou 12.000 Kz de 35.000 Kz recomendados',
    dataHora: '2026-07-05T14:00:00Z',
    lida: true,
    viaturaMatricula: 'LD-44-12-CZ',
    motoristaNome: 'Cláudio Pedro'
  },
  {
    id: 'notif-4',
    tipo: 'LICENCIAMENTO_VENCIDO',
    mensagem: 'Licenciamento da viatura LD-44-12-CZ expirou há 1 dia!',
    dataHora: '2026-07-07T08:00:00Z',
    lida: false,
    viaturaMatricula: 'LD-44-12-CZ'
  }
];
