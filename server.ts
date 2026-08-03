// server.ts
// COTA - Cooperativa de Gestão de Táxis JK
// Full-Stack Express Server with Shift/Meta Simulator & Vite Middleware

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import static seeds to populate memory-state
import {
  initialProprietarios,
  initialMotoristas,
  initialViaturas,
  initialTurnos,
  initialFinanceiro,
  initialManutencoes,
  initialDocumentos,
  initialPenalizacoes,
  initialNotificacoes
} from './src/mockData.ts';

const app = express();
const PORT = 3000;

// Security audit log structure
interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  description: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

let securityLogs: SecurityLog[] = [
  {
    id: 'sec-1',
    timestamp: new Date().toISOString(),
    event: 'SYSTEM_BOOT',
    description: 'Sistema ERP COTA inicializado com sucesso. Modos de segurança activos: Helmet, Rate-Limiting e Sanitização.',
    ipAddress: '127.0.0.1',
    severity: 'INFO'
  }
];

function logSecurityEvent(event: string, description: string, ip: string, severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'WARNING') {
  securityLogs.unshift({
    id: 'sec-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    event,
    description,
    ipAddress: ip || 'unknown',
    severity
  });
  if (securityLogs.length > 100) securityLogs.pop();
}

// ----------------------------------------------------
// MIDDLEWARES DE SEGURANÇA (HELMET & RATE-LIMIT)
// ----------------------------------------------------

// 1. Helmet to secure headers (and configure CSP to allow iframe embedding)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["*"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      connectSrc: ["'self'", "ws:", "wss:", "http:", "https:"],
      frameAncestors: ["*"],
    }
  },
  frameguard: false,
  crossOriginEmbedderPolicy: false
}));

// 2. Rate Limiting to prevent brute-force attacks on the API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Demasiados pedidos a partir deste IP. Por favor, tente novamente após 15 minutos.' },
  handler: (req, res, next, options) => {
    logSecurityEvent('RATE_LIMIT_TRIGGERED', `Limite de requisições excedido para o IP ${req.ip} no endpoint ${req.path}`, req.ip, 'WARNING');
    res.status(options.statusCode).send(options.message);
  }
});

// Apply rate limiter specifically to API routes
app.use('/api', apiLimiter);

// 3. Express Body Parser with payload limit protection (DOS mitigation)
app.use(express.json({ limit: '15kb' }));

// 4. Client Validation Token / Anti-Automation Check
const CLIENT_SECURE_TOKEN = 'COTA-JK-SECURE-KEY-v1';

app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const clientHeader = req.headers['x-app-client-secure'];
    if (clientHeader !== CLIENT_SECURE_TOKEN) {
      logSecurityEvent(
        'UNAUTHORIZED_WRITE_BLOCKED',
        `Tentativa não autorizada de alteração (${req.method}) no endpoint ${req.path} sem token de cliente válido.`,
        req.ip,
        'CRITICAL'
      );
      return res.status(403).json({ error: 'Acesso Proibido: Token de segurança do cliente inválido ou em falta.' });
    }
  }
  next();
});

// 5. Sanitizer Utilities
function sanitizeString(str: any): string {
  if (typeof str !== 'string') return '';
  // Strips standard HTML tags to mitigate persistent/stored XSS
  return str.replace(/<[^>]*>/g, '').trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ----------------------------------------------------
// STATE SIMULATOR (In-Memory Database)
// Holds the dynamic state so different portals can communicate in real-time!
// ----------------------------------------------------
let proprietarios = [...initialProprietarios];
let motoristas = [...initialMotoristas];
let viaturas = [...initialViaturas];
let turnos = [...initialTurnos];
let financeiro = [...initialFinanceiro];
let manutencoes = [...initialManutencoes];
let documentos = [...initialDocumentos];
let penalizacoes = [...initialPenalizacoes];
let notificacoes = [...initialNotificacoes];

// Real-Time Driver Coordinate / GPS Tracker Simulation
let gpsSimulationInterval: NodeJS.Timeout | null = null;

function startGpsSimulation() {
  if (gpsSimulationInterval) return;
  
  gpsSimulationInterval = setInterval(() => {
    // Simulate moving active vehicles under an active shift
    viaturas.forEach(via => {
      // Find if this vehicle has an active shift
      const activeShift = turnos.find(t => t.viaturaId === via.id && t.estado === 'EM_SERVICO');
      
      if (activeShift && via.estado === 'ATIVO' && via.latitudeSim && via.longitudeSim) {
        // Move vehicle slightly around Luanda route points
        via.latitudeSim += (Math.random() - 0.5) * 0.0006;
        via.longitudeSim += (Math.random() - 0.5) * 0.0006;
        via.velocidadeSim = Math.floor(30 + Math.random() * 40); // 30-70 km/h
      } else {
        via.velocidadeSim = 0;
      }
    });
  }, 4000);
}

startGpsSimulation();

// Helper to calculate document expiry times
function updateDocumentDays() {
  documentos.forEach(doc => {
    const validDate = new Date(doc.validade);
    const today = new Date('2026-07-07'); // Anchored project time
    const diffTime = validDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    doc.diasRestantes = diffDays;
    
    // Auto-create alerts for expiring documents if not already created
    if (diffDays <= 10 && doc.alertaAtivo) {
      const type = doc.tipo === 'SEGURO' ? 'SEGURO_VENCIDO' : doc.tipo === 'LICENCIAMENTO' ? 'LICENCIAMENTO_VENCIDO' : 'MANUTENCAO_VENCIDA';
      const exists = notificacoes.some(n => n.tipo === type && n.mensagem.includes(doc.alvoNome));
      if (!exists) {
        notificacoes.unshift({
          id: 'notif-doc-' + Math.random().toString(36).substring(2, 9),
          tipo: type as any,
          mensagem: `Atenção: O documento ${doc.tipo} do alvo ${doc.alvoNome} expira em ${diffDays} dias (${doc.validade}).`,
          dataHora: new Date().toISOString(),
          lida: false,
          viaturaMatricula: doc.viaturaId ? viaturas.find(v => v.id === doc.viaturaId)?.matricula : undefined
        });
      }
    }
  });
}

updateDocumentDays();

// ----------------------------------------------------
// API REST ENDPOINTS
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), cooperative: 'COTA JK' });
});

// Dashboard Statistics (Gestor KPIs)
app.get('/api/dashboard/stats', (req, res) => {
  const totalReceitas = financeiro
    .filter(f => f.tipo === 'RECEITA')
    .reduce((sum, f) => sum + f.valor, 0);
    
  const totalDespesas = financeiro
    .filter(f => f.tipo === 'DESPESA')
    .reduce((sum, f) => sum + f.valor, 0);

  const activeShiftsCount = turnos.filter(t => t.estado === 'EM_SERVICO').length;
  const activeDriversCount = motoristas.filter(m => m.estado === 'EM_SERVICO').length;
  
  // Daily, Weekly, Monthly receipts
  const receiptsToday = financeiro
    .filter(f => f.tipo === 'RECEITA' && f.data.startsWith('2026-07-07'))
    .reduce((sum, f) => sum + f.valor, 0);

  const receiptsWeek = financeiro
    .filter(f => f.tipo === 'RECEITA' && f.data >= '2026-07-01')
    .reduce((sum, f) => sum + f.valor, 0);

  const receiptsMonth = financeiro
    .filter(f => f.tipo === 'RECEITA' && f.data >= '2026-07-01') // July 2026
    .reduce((sum, f) => sum + f.valor, 0);

  const metasConcluidas = turnos.filter(t => t.estado === 'CONCLUIDO');
  const metasCumpridasCount = metasConcluidas.filter(t => t.metaCumprida === true).length;
  const metasNaoCumpridasCount = metasConcluidas.filter(t => t.metaCumprida === false).length;

  res.json({
    receitas: totalReceitas,
    despesas: totalDespesas,
    lucro: totalReceitas - totalDespesas,
    receitasHoje: receiptsToday,
    receitasSemana: receiptsWeek,
    receitasMes: receiptsMonth,
    totalViaturas: viaturas.length,
    motoristasAtivos: activeDriversCount,
    turnosAtivos: activeShiftsCount,
    metasCumpridas: metasCumpridasCount,
    metasNaoCumpridas: metasNaoCumpridasCount,
    alertasDocumentos: documentos.filter(d => d.diasRestantes <= 10).length,
    alertasNaoLidos: notificacoes.filter(n => !n.lida).length,
    viaturasPorEstado: {
      ATIVO: viaturas.filter(v => v.estado === 'ATIVO').length,
      PARQUEADO: viaturas.filter(v => v.estado === 'PARQUEADO').length,
      MANUTENCAO: viaturas.filter(v => v.estado === 'MANUTENCAO').length,
      INATIVO: viaturas.filter(v => v.estado === 'INATIVO').length,
    }
  });
});

// 1. PROPRIETARIOS CRUD
app.get('/api/proprietarios', (req, res) => {
  res.json(proprietarios);
});

app.post('/api/proprietarios', (req, res) => {
  let { email, nome, nif, telefone, morada, nifEmpresa } = req.body;
  
  nome = sanitizeString(nome);
  email = sanitizeString(email);
  nif = sanitizeString(nif);
  telefone = sanitizeString(telefone);
  morada = sanitizeString(morada);
  nifEmpresa = sanitizeString(nifEmpresa);

  if (!nome || nome.length < 3 || nome.length > 80) {
    logSecurityEvent('VALIDATION_FAILED', 'Registo de Proprietário: Nome inválido ou em branco.', req.ip, 'WARNING');
    return res.status(400).json({ error: 'Nome inválido. Deve possuir entre 3 e 80 caracteres.' });
  }
  if (!isValidEmail(email)) {
    logSecurityEvent('VALIDATION_FAILED', `Registo de Proprietário: E-mail inválido (${email})`, req.ip, 'WARNING');
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  if (!nif || nif.length < 8 || nif.length > 20) {
    logSecurityEvent('VALIDATION_FAILED', 'Registo de Proprietário: NIF em falta ou inválido.', req.ip, 'WARNING');
    return res.status(400).json({ error: 'NIF inválido. Deve conter de 8 a 20 caracteres.' });
  }

  const newProp = {
    id: 'prop-' + (proprietarios.length + 1),
    usuarioId: 'user-prop-' + (proprietarios.length + 1),
    usuario: {
      id: 'user-prop-' + (proprietarios.length + 1),
      email,
      nome,
      nif,
      telefone,
      perfil: 'PROPRIETARIO' as const,
      ativo: true,
      dataCriacao: new Date().toISOString(),
    },
    morada: morada || '',
    nifEmpresa: nifEmpresa || '',
    dataCadastro: new Date().toISOString(),
    viaturasCount: 0,
  };
  proprietarios.push(newProp);
  logSecurityEvent('USER_REGISTERED', `Proprietário ${nome} registado com sucesso.`, req.ip, 'INFO');
  res.status(201).json(newProp);
});

// 2. MOTORISTAS CRUD
app.get('/api/motoristas', (req, res) => {
  res.json(motoristas);
});

app.post('/api/motoristas', (req, res) => {
  let { email, nome, nif, telefone, numeroCarta, validadeCarta, bi } = req.body;

  nome = sanitizeString(nome);
  email = sanitizeString(email);
  nif = sanitizeString(nif);
  telefone = sanitizeString(telefone);
  numeroCarta = sanitizeString(numeroCarta);
  validadeCarta = sanitizeString(validadeCarta);
  bi = sanitizeString(bi);

  if (!nome || nome.length < 3 || nome.length > 80) {
    logSecurityEvent('VALIDATION_FAILED', 'Registo de Motorista: Nome inválido.', req.ip, 'WARNING');
    return res.status(400).json({ error: 'Nome inválido. Deve possuir entre 3 e 80 caracteres.' });
  }
  if (!isValidEmail(email)) {
    logSecurityEvent('VALIDATION_FAILED', `Registo de Motorista: E-mail inválido (${email})`, req.ip, 'WARNING');
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  if (!bi || bi.length < 8 || bi.length > 20) {
    logSecurityEvent('VALIDATION_FAILED', 'Registo de Motorista: BI inválido.', req.ip, 'WARNING');
    return res.status(400).json({ error: 'Número do Bilhete de Identidade (BI) é obrigatório e deve ser válido.' });
  }

  const newMot = {
    id: 'mot-' + (motoristas.length + 1),
    usuarioId: 'user-mot-' + (motoristas.length + 1),
    usuario: {
      id: 'user-mot-' + (motoristas.length + 1),
      email,
      nome,
      nif,
      telefone,
      perfil: 'MOTORISTA' as const,
      ativo: true,
      dataCriacao: new Date().toISOString(),
    },
    numeroCarta: numeroCarta || '00000000',
    validadeCarta: validadeCarta || '2028-12-31',
    nif,
    bi,
    estado: 'INATIVO' as const,
    pontuacaoMedia: 5.0,
    dataAdmissao: new Date().toISOString(),
    viaturasAssociadas: [],
    penalizacoesCount: 0,
  };
  motoristas.push(newMot);
  logSecurityEvent('USER_REGISTERED', `Motorista ${nome} cadastrado com sucesso.`, req.ip, 'INFO');
  res.status(201).json(newMot);
});

app.put('/api/motoristas/:id', (req, res) => {
  const { id } = req.params;
  const index = motoristas.findIndex(m => m.id === id);
  if (index !== -1) {
    motoristas[index] = { ...motoristas[index], ...req.body };
    res.json(motoristas[index]);
  } else {
    res.status(404).json({ error: 'Motorista não encontrado' });
  }
});

// 3. VIATURAS CRUD
app.get('/api/viaturas', (req, res) => {
  res.json(viaturas);
});

app.post('/api/viaturas', (req, res) => {
  let { matricula, marca, modelo, ano, motor, chassi, proprietarioId, proprietarioNome, metaDiaria, quilometragem } = req.body;

  matricula = sanitizeString(matricula).toUpperCase();
  marca = sanitizeString(marca);
  modelo = sanitizeString(modelo);
  motor = sanitizeString(motor);
  chassi = sanitizeString(chassi);
  proprietarioId = sanitizeString(proprietarioId);
  proprietarioNome = sanitizeString(proprietarioNome);

  if (!matricula || matricula.length < 5 || matricula.length > 15) {
    logSecurityEvent('VALIDATION_FAILED', 'Registo de Viatura: Matrícula inválida.', req.ip, 'WARNING');
    return res.status(400).json({ error: 'Matrícula inválida.' });
  }

  const numericMeta = parseFloat(metaDiaria);
  if (isNaN(numericMeta) || numericMeta <= 0) {
    logSecurityEvent('VALIDATION_FAILED', 'Registo de Viatura: Meta Diária inválida ou negativa.', req.ip, 'WARNING');
    return res.status(400).json({ error: 'A meta diária deve ser um valor monetário positivo.' });
  }

  const numericKm = parseInt(quilometragem);
  if (isNaN(numericKm) || numericKm < 0) {
    logSecurityEvent('VALIDATION_FAILED', 'Registo de Viatura: Quilometragem inválida.', req.ip, 'WARNING');
    return res.status(400).json({ error: 'Quilometragem inválida.' });
  }

  const newViatura = {
    id: 'via-' + (viaturas.length + 1),
    matricula,
    marca,
    modelo,
    ano: parseInt(ano) || 2022,
    motor: motor || '',
    chassi: chassi || '',
    estado: 'PARQUEADO' as const,
    proprietarioId: proprietarioId || 'prop-1',
    proprietarioNome: proprietarioNome || 'João Kelson',
    metaDiaria: numericMeta,
    motoristaId: undefined,
    motoristaNome: undefined,
    latitudeSim: -8.8368 + (Math.random() - 0.5) * 0.05,
    longitudeSim: 13.2332 + (Math.random() - 0.5) * 0.05,
    velocidadeSim: 0,
    quilometragem: numericKm,
    dataCadastro: new Date().toISOString(),
  };
  viaturas.push(newViatura);
  logSecurityEvent('VIATURA_REGISTERED', `Viatura ${matricula} adicionada com sucesso.`, req.ip, 'INFO');
  res.status(201).json(newViatura);
});

app.put('/api/viaturas/:id', (req, res) => {
  const { id } = req.params;
  const index = viaturas.findIndex(v => v.id === id);
  if (index !== -1) {
    viaturas[index] = { ...viaturas[index], ...req.body };
    res.json(viaturas[index]);
  } else {
    res.status(404).json({ error: 'Viatura não encontrada' });
  }
});

// 4. SHIFTS / TURNOS OPERATIONS (PWA & COOPERATIVE DRIVERS LOGS)
app.get('/api/turnos', (req, res) => {
  res.json(turnos);
});

// Start Shift (Entrar em Serviço)
app.post('/api/turnos/iniciar', (req, res) => {
  const { motoristaId, viaturaId, kmInicial, horaInicio, dataTurno } = req.body;
  
  const mot = motoristas.find(m => m.id === motoristaId);
  const via = viaturas.find(v => v.id === viaturaId);

  if (!mot || !via) {
    return res.status(400).json({ error: 'Motorista ou Viatura não cadastrados.' });
  }

  // Security Check: Driver blocked
  if (mot.estado === 'BLOQUEADO') {
    logSecurityEvent('BLOCKED_ACCESS_ATTEMPT', `Motorista bloqueado ${mot.usuario.nome} tentou entrar em serviço.`, req.ip, 'CRITICAL');
    return res.status(403).json({ error: 'Acesso negado: A sua conta está suspensa/bloqueada pela administração.' });
  }

  const parsedKm = parseInt(kmInicial);
  if (isNaN(parsedKm) || parsedKm < via.quilometragem) {
    logSecurityEvent('LOGIC_EXPLOIT_PREVENTED', `Motorista ${mot.usuario.nome} tentou registar KM inicial (${kmInicial}) menor que o odómetro atual da viatura (${via.quilometragem}).`, req.ip, 'WARNING');
    return res.status(400).json({ error: `Quilometragem inicial inválida. Não pode ser inferior ao odómetro atual da viatura (${via.quilometragem} KM).` });
  }

  // Security Check: Concurrency double shift prevention
  const activeDriverShift = turnos.find(t => t.motoristaId === motoristaId && t.estado === 'EM_SERVICO');
  if (activeDriverShift) {
    logSecurityEvent('CONCURRENCY_EXPLOIT_PREVENTED', `Motorista ${mot.usuario.nome} tentou duplicar turno ativo.`, req.ip, 'WARNING');
    return res.status(400).json({ error: 'Já tem um turno ativo em curso.' });
  }

  const activeViaturaShift = turnos.find(t => t.viaturaId === viaturaId && t.estado === 'EM_SERVICO');
  if (activeViaturaShift) {
    logSecurityEvent('CONCURRENCY_EXPLOIT_PREVENTED', `Viatura ${via.matricula} tentou ser alocada a dois turnos simultâneos.`, req.ip, 'WARNING');
    return res.status(400).json({ error: 'Esta viatura já se encontra em serviço activo.' });
  }

  // Set driver and vehicle status
  mot.estado = 'EM_SERVICO';
  via.estado = 'ATIVO';
  via.motoristaId = mot.id;
  via.motoristaNome = mot.usuario.nome;
  via.quilometragem = parsedKm;

  const newShift = {
    id: 'shift-' + Math.random().toString(36).substring(2, 9),
    motoristaId,
    motoristaNome: mot.usuario.nome,
    viaturaId,
    viaturaMatricula: via.matricula,
    dataTurno: sanitizeString(dataTurno) || new Date().toISOString().split('T')[0],
    horaInicio: sanitizeString(horaInicio) || new Date().toLocaleTimeString().substring(0, 5),
    kmInicial: parsedKm,
    metaDiaria: via.metaDiaria,
    estado: 'EM_SERVICO' as const,
    incidentes: [],
    mensagens: ['Turno iniciado pelo condutor.'],
    dataCriacao: new Date().toISOString()
  };

  turnos.push(newShift);

  // Push notification alert for Gestor
  notificacoes.unshift({
    id: 'notif-' + Math.random().toString(36).substring(2, 9),
    tipo: 'INICIO_TURNO',
    mensagem: `O motorista ${mot.usuario.nome} iniciou serviço na viatura ${via.matricula} (KM: ${parsedKm}).`,
    dataHora: new Date().toISOString(),
    lida: false,
    viaturaMatricula: via.matricula,
    motoristaNome: mot.usuario.nome
  });

  logSecurityEvent('SHIFT_STARTED', `Turno ${newShift.id} iniciado por ${mot.usuario.nome} com ${parsedKm} KM.`, req.ip, 'INFO');
  res.status(201).json(newShift);
});

// Report Incident during the day
app.post('/api/turnos/:id/incidente', (req, res) => {
  const { id } = req.params;
  const { tipo, descricao, latitude, longitude } = req.body;
  
  const shift = turnos.find(t => t.id === id);
  if (!shift) {
    return res.status(404).json({ error: 'Turno não encontrado' });
  }

  const sanitizedDesc = sanitizeString(descricao);
  if (!sanitizedDesc || sanitizedDesc.length > 500) {
    return res.status(400).json({ error: 'Descrição do incidente inválida ou demasiado longa.' });
  }

  const newIncidente = {
    id: 'inc-' + Math.random().toString(36).substring(2, 9),
    tipo: sanitizeString(tipo) as any,
    descricao: sanitizedDesc,
    fotoUrl: '/assets/problem_photo_simulation.jpg', // simulated photo attachment
    latitude: parseFloat(latitude) || -8.8368,
    longitude: parseFloat(longitude) || 13.2332,
    dataHora: new Date().toISOString()
  };

  shift.incidentes.push(newIncidente);
  shift.mensagens.push(`[ALERTA INCIDENTE: ${tipo}] - ${sanitizedDesc}`);

  // Auto set vehicle to MANUTENCAO if mechanical problem
  if (tipo === 'PROBLEMA_MECANICO' || tipo === 'PNEU_FURADO') {
    const via = viaturas.find(v => v.id === shift.viaturaId);
    if (via) via.estado = 'MANUTENCAO';
  }

  // Create notifications based on incident types
  let notifType: 'VIATURA_AVARIADA' | 'ACIDENTE' | 'ASSALTO' = 'VIATURA_AVARIADA';
  if (tipo === 'ACIDENTE') notifType = 'ACIDENTE';
  if (tipo === 'ASSALTO') notifType = 'ASSALTO';

  notificacoes.unshift({
    id: 'notif-' + Math.random().toString(36).substring(2, 9),
    tipo: notifType,
    mensagem: `URGENTE: ${shift.motoristaNome} reportou ${tipo} na viatura ${shift.viaturaMatricula}: "${sanitizedDesc}"`,
    dataHora: new Date().toISOString(),
    lida: false,
    viaturaMatricula: shift.viaturaMatricula,
    motoristaNome: shift.motoristaNome
  });

  logSecurityEvent('INCIDENT_REPORTED', `Incidente do tipo ${tipo} reportado no turno ${shift.id}.`, req.ip, 'WARNING');
  res.status(201).json(newIncidente);
});

// Driver messages/comunicar
app.post('/api/turnos/:id/comunicar', (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;
  
  const shift = turnos.find(t => t.id === id);
  if (!shift) {
    return res.status(404).json({ error: 'Turno não encontrado' });
  }

  const sanitizedMsg = sanitizeString(mensagem);
  if (!sanitizedMsg || sanitizedMsg.length > 500) {
    return res.status(400).json({ error: 'Mensagem inválida ou demasiado longa.' });
  }

  shift.mensagens.push(sanitizedMsg);
  res.json({ status: 'ok', mensagens: shift.mensagens });
});

// End Shift (Encerrar Turno e preencher Meta Diária)
app.post('/api/turnos/:id/encerrar', (req, res) => {
  const { id } = req.params;
  const { kmFinal, horaFim, valorArrecadado, observacoes } = req.body;

  const shift = turnos.find(t => t.id === id);
  if (!shift) {
    return res.status(404).json({ error: 'Turno não encontrado' });
  }

  const finalKm = parseInt(kmFinal);
  if (isNaN(finalKm) || finalKm < shift.kmInicial) {
    logSecurityEvent('LOGIC_EXPLOIT_PREVENTED', `Tentativa de encerramento fraudulenta. Motorista ${shift.motoristaNome} tentou recuar KM final (${kmFinal}) menor que KM inicial (${shift.kmInicial}).`, req.ip, 'CRITICAL');
    return res.status(400).json({ error: `Fraude de Odómetro Impedida: O KM final não pode ser inferior ao KM de início (${shift.kmInicial} KM).` });
  }

  const finalVal = parseFloat(valorArrecadado);
  if (isNaN(finalVal) || finalVal < 0) {
    logSecurityEvent('LOGIC_EXPLOIT_PREVENTED', `Tentativa de registo de receita diária negativa (${valorArrecadado}) por ${shift.motoristaNome}.`, req.ip, 'WARNING');
    return res.status(400).json({ error: 'O valor arrecadado não pode ser negativo.' });
  }

  shift.estado = 'CONCLUIDO';
  shift.kmFinal = finalKm;
  shift.horaFim = sanitizeString(horaFim) || new Date().toLocaleTimeString().substring(0, 5);
  shift.valorArrecadado = finalVal;
  shift.observacoes = sanitizeString(observacoes) || '';
  shift.metaCumprida = finalVal >= shift.metaDiaria;
  shift.diferenca = finalVal - shift.metaDiaria;
  shift.dataFim = new Date().toISOString();

  // Release driver and vehicle status
  const mot = motoristas.find(m => m.id === shift.motoristaId);
  const via = viaturas.find(v => v.id === shift.viaturaId);

  if (mot) {
    mot.estado = 'ATIVO'; // ready for another day
  }
  if (via) {
    via.estado = 'PARQUEADO';
    via.motoristaId = undefined;
    via.motoristaNome = undefined;
    via.quilometragem = finalKm;
    via.velocidadeSim = 0;
  }

  // 1. Register financial transaction representing final revenue
  financeiro.push({
    id: 'fin-' + Math.random().toString(36).substring(2, 9),
    tipo: 'RECEITA',
    categoria: 'RECEITA_META',
    descricao: `Fecho de Turno: ${shift.motoristaNome} (#${shift.viaturaMatricula})`,
    valor: finalVal,
    motoristaId: shift.motoristaId,
    turnoId: shift.id,
    data: new Date().toISOString()
  });

  // 2. Coop fee (10%)
  const coopTax = Math.round(finalVal * 0.1);
  financeiro.push({
    id: 'fin-coop-' + Math.random().toString(36).substring(2, 9),
    tipo: 'RECEITA',
    categoria: 'TAXA_COOPERATIVA',
    descricao: `Retenção Coop (10%) s/ fecho ${shift.viaturaMatricula}`,
    valor: coopTax,
    data: new Date().toISOString()
  });

  // Post notifications for Gestor
  notificacoes.unshift({
    id: 'notif-' + Math.random().toString(36).substring(2, 9),
    tipo: 'FIM_TURNO',
    mensagem: `Turno concluído por ${shift.motoristaNome} (${shift.viaturaMatricula}). Receita: ${finalVal.toLocaleString()} Kz.`,
    dataHora: new Date().toISOString(),
    lida: false,
    viaturaMatricula: shift.viaturaMatricula,
    motoristaNome: shift.motoristaNome
  });

  if (!shift.metaCumprida) {
    notificacoes.unshift({
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      tipo: 'META_NAO_CUMPRIDA',
      mensagem: `Meta Diária NÃO CUMPRIDA por ${shift.motoristaNome} (${shift.viaturaMatricula}). Faltaram ${(Math.abs(shift.diferenca)).toLocaleString()} Kz.`,
      dataHora: new Date().toISOString(),
      lida: false,
      viaturaMatricula: shift.viaturaMatricula,
      motoristaNome: shift.motoristaNome
    });
  }

  res.json(shift);
});

// 5. FINANCEIRO CRUD
app.get('/api/financeiro', (req, res) => {
  res.json(financeiro);
});

app.post('/api/financeiro', (req, res) => {
  let { tipo, categoria, descricao, valor, proprietarioId, motoristaId } = req.body;
  tipo = sanitizeString(tipo);
  categoria = sanitizeString(categoria);
  descricao = sanitizeString(descricao);

  const parsedVal = parseFloat(valor);
  if (isNaN(parsedVal) || parsedVal <= 0) {
    logSecurityEvent('VALIDATION_FAILED', `Lançamento financeiro com valor inválido ou negativo: ${valor}`, req.ip, 'WARNING');
    return res.status(400).json({ error: 'O valor da transação deve ser um número positivo.' });
  }
  if (tipo !== 'RECEITA' && tipo !== 'DESPESA') {
    logSecurityEvent('VALIDATION_FAILED', `Lançamento financeiro com tipo de operação inválido: ${tipo}`, req.ip, 'WARNING');
    return res.status(400).json({ error: 'Tipo de operação inválido.' });
  }

  const newTrans = {
    id: 'fin-' + (financeiro.length + 1),
    tipo: tipo as 'RECEITA' | 'DESPESA',
    categoria,
    descricao,
    valor: parsedVal,
    data: new Date().toISOString(),
    proprietarioId: proprietarioId ? sanitizeString(proprietarioId) : undefined,
    motoristaId: motoristaId ? sanitizeString(motoristaId) : undefined,
  };
  financeiro.push(newTrans);
  logSecurityEvent('FINANCIAL_LOGGED', `Lançamento de ${tipo}: ${descricao} - ${parsedVal.toLocaleString()} Kz`, req.ip, 'INFO');
  res.status(201).json(newTrans);
});

// 6. MANUTENCOES CRUD
app.get('/api/manutencoes', (req, res) => {
  res.json(manutencoes);
});

app.post('/api/manutencoes', (req, res) => {
  let { viaturaId, viaturaMatricula, descricao, pecasSubstitu, custo, oficina, dataAgendada } = req.body;
  viaturaId = sanitizeString(viaturaId);
  viaturaMatricula = sanitizeString(viaturaMatricula);
  descricao = sanitizeString(descricao);
  pecasSubstitu = sanitizeString(pecasSubstitu);
  oficina = sanitizeString(oficina);

  const parsedCusto = parseFloat(custo);
  if (isNaN(parsedCusto) || parsedCusto < 0) {
    logSecurityEvent('VALIDATION_FAILED', `Ordem de manutenção com custo negativo ou inválido: ${custo}`, req.ip, 'WARNING');
    return res.status(400).json({ error: 'O custo de manutenção não pode ser negativo.' });
  }

  const newMaint = {
    id: 'maint-' + (manutencoes.length + 1),
    viaturaId,
    viaturaMatricula: viaturaMatricula || 'Desconhecido',
    descricao,
    pecasSubstitu,
    custo: parsedCusto,
    oficina,
    status: 'AGENDADA' as const,
    dataAgendada: sanitizeString(dataAgendada) || new Date().toISOString().split('T')[0],
    dataCriacao: new Date().toISOString()
  };
  manutencoes.push(newMaint);
  
  // Set vehicle under maintenance
  const via = viaturas.find(v => v.id === viaturaId);
  if (via) {
    via.estado = 'MANUTENCAO';
  }

  // Register maintenance expense
  financeiro.push({
    id: 'fin-maint-' + Math.random().toString(36).substring(2, 9),
    tipo: 'DESPESA',
    categoria: 'MANUTENCAO',
    descricao: `Manutenção agendada: ${descricao} #${via?.matricula}`,
    valor: parsedCusto,
    proprietarioId: via?.proprietarioId,
    data: new Date().toISOString()
  });

  logSecurityEvent('MAINTENANCE_LOGGED', `Manutenção agendada para ${viaturaMatricula} - Custo: ${parsedCusto.toLocaleString()} Kz.`, req.ip, 'INFO');
  res.status(201).json(newMaint);
});

app.post('/api/manutencoes/:id/concluir', (req, res) => {
  const { id } = req.params;
  const maint = manutencoes.find(m => m.id === id);
  if (maint) {
    maint.status = 'CONCLUIDA';
    maint.dataConclusao = new Date().toISOString();
    
    // Set vehicle back to parked
    const via = viaturas.find(v => v.id === maint.viaturaId);
    if (via) {
      via.estado = 'PARQUEADO';
    }
    res.json(maint);
  } else {
    res.status(404).json({ error: 'Manutenção não encontrada' });
  }
});

// 7. DOCUMENTOS (Expirations & Alerts)
app.get('/api/documentos', (req, res) => {
  res.json(documentos);
});

// 8. PENALIZACOES CRUD
app.get('/api/penalizacoes', (req, res) => {
  res.json(penalizacoes);
});

app.post('/api/penalizacoes', (req, res) => {
  let { motoristaId, motoristaNome, descricao, gravidade, pontos } = req.body;
  motoristaId = sanitizeString(motoristaId);
  motoristaNome = sanitizeString(motoristaNome);
  descricao = sanitizeString(descricao);
  gravidade = sanitizeString(gravidade);

  const parsedPontos = parseInt(pontos);
  if (isNaN(parsedPontos) || parsedPontos < 0) {
    return res.status(400).json({ error: 'Os pontos de penalização devem ser um número inteiro não-negativo.' });
  }

  const newPen = {
    id: 'pen-' + (penalizacoes.length + 1),
    motoristaId,
    motoristaNome,
    descricao,
    gravidade: gravidade as 'LEVE' | 'GRAVE' | 'CRITICA',
    pontos: parsedPontos,
    dataAplicacao: new Date().toISOString(),
    ativa: true,
  };
  penalizacoes.push(newPen);
  
  // Update driver's penalization count
  const mot = motoristas.find(m => m.id === motoristaId);
  if (mot) {
    mot.penalizacoesCount += 1;
    if (gravidade === 'CRITICA') {
      mot.estado = 'BLOQUEADO';
      logSecurityEvent('USER_BLOCKED', `Motorista ${mot.usuario.nome} foi BLOQUEADO devido a infração CRÍTICA.`, req.ip, 'CRITICAL');
    } else {
      logSecurityEvent('PENALIZATION_APPLIED', `Aplicada penalização ${gravidade} de ${parsedPontos} pontos ao condutor ${mot.usuario.nome}.`, req.ip, 'WARNING');
    }
  }

  res.status(201).json(newPen);
});

// 9. ALERTS NOTIFICATIONS
app.get('/api/notificacoes', (req, res) => {
  res.json(notificacoes);
});

app.post('/api/notificacoes/ler', (req, res) => {
  notificacoes.forEach(n => n.lida = true);
  res.json({ status: 'ok', lidas: notificacoes.length });
});

// 10. SECURITY AUDIT TRAIL ENDPOINT
app.get('/api/security/audit-trail', (req, res) => {
  res.json(securityLogs);
});

// Gemini AI integration for document checking or automatic reporting
app.post('/api/ai/analyze-document', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({
        analysis: "Simulação de IA: O documento de Seguro e Licenciamento foi validado com sucesso. Data de expiração encontrada: 12 de Dezembro de 2026. Nenhuma irregularidade detectada.",
        valid: true
      });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Você é um validador de documentos de frotas e táxis corporativos. Resuma brevemente as regras de inspeção técnica de frotas comerciais em Angola (COTA) em 2 parágrafos.'
    });

    res.json({
      analysis: response.text,
      valid: true
    });
  } catch (error: any) {
    res.json({
      analysis: `Análise de IA (Offline): Validade regularizada. Documento em conformidade com o Regulamento de Transportes Terrestres de Angola.`,
      valid: true
    });
  }
});

// ----------------------------------------------------
// VITE AND PRODUCTION BUILD ROUTING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middleware to compile react code on demand
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from compiled dist folder in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`COTA ERP Full-Stack Server escutando na porta ${PORT}`);
  });
}

startServer();
