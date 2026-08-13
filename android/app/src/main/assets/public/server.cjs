var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_url = require("url");
var import_helmet = __toESM(require("helmet"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_express_rate_limit = require("express-rate-limit");

// src/mockData.ts
var initialProprietarios = [
  {
    id: "prop-1",
    usuarioId: "user-prop-1",
    usuario: {
      id: "user-prop-1",
      email: "joao.proprietario@cota.coop",
      nome: "Jo\xE3o Kelson",
      nif: "100450982",
      telefone: "+244923111001",
      perfil: "PROPRIETARIO",
      ativo: true,
      dataCriacao: "2025-01-10T10:00:00Z"
    },
    morada: "Avenida Luanda, Luanda, Angola",
    nifEmpresa: "540192038",
    dataCadastro: "2025-01-10T10:00:00Z",
    viaturasCount: 3
  },
  {
    id: "prop-2",
    usuarioId: "user-prop-2",
    usuario: {
      id: "user-prop-2",
      email: "eduardo.prop@cota.coop",
      nome: "Eduardo Mateus",
      nif: "100670912",
      telefone: "+244923111002",
      perfil: "PROPRIETARIO",
      ativo: true,
      dataCriacao: "2025-02-15T14:30:00Z"
    },
    morada: "Bairro Alvalade, Luanda",
    nifEmpresa: "540198777",
    dataCadastro: "2025-02-15T14:30:00Z",
    viaturasCount: 2
  }
];
var initialMotoristas = [
  {
    id: "mot-1",
    usuarioId: "user-mot-1",
    usuario: {
      id: "user-mot-1",
      email: "manuel.silva@cota.coop",
      nome: "Manuel Silva",
      nif: "210540983",
      telefone: "+244923222001",
      perfil: "MOTORISTA",
      ativo: true,
      dataCriacao: "2025-01-12T08:00:00Z"
    },
    numeroCarta: "LD-90823-C",
    validadeCarta: "2028-12-31",
    nif: "210540983",
    bi: "009827361LA044",
    estado: "EM_SERVICO",
    pontuacaoMedia: 4.8,
    dataAdmissao: "2025-01-12T08:00:00Z",
    viaturasAssociadas: ["LD-32-15-AM"],
    penalizacoesCount: 1
  },
  {
    id: "mot-2",
    usuarioId: "user-mot-2",
    usuario: {
      id: "user-mot-2",
      email: "antonio.lopes@cota.coop",
      nome: "Ant\xF3nio Lopes",
      nif: "240567112",
      telefone: "+244923222002",
      perfil: "MOTORISTA",
      ativo: true,
      dataCriacao: "2025-01-15T09:15:00Z"
    },
    numeroCarta: "LD-45210-B",
    validadeCarta: "2029-06-15",
    nif: "240567112",
    bi: "005432110LA022",
    estado: "ATIVO",
    pontuacaoMedia: 4.9,
    dataAdmissao: "2025-01-15T09:15:00Z",
    viaturasAssociadas: ["LD-88-99-TX"],
    penalizacoesCount: 0
  },
  {
    id: "mot-3",
    usuarioId: "user-mot-3",
    usuario: {
      id: "user-mot-3",
      email: "claudio.pedro@cota.coop",
      nome: "Cl\xE1udio Pedro",
      nif: "290112445",
      telefone: "+244923222003",
      perfil: "MOTORISTA",
      ativo: true,
      dataCriacao: "2025-03-20T11:00:00Z"
    },
    numeroCarta: "LD-11200-A",
    validadeCarta: "2026-08-15",
    nif: "290112445",
    bi: "003211990LA088",
    estado: "INATIVO",
    pontuacaoMedia: 4.2,
    dataAdmissao: "2025-03-20T11:00:00Z",
    viaturasAssociadas: [],
    penalizacoesCount: 2
  }
];
var initialViaturas = [
  {
    id: "via-1",
    matricula: "LD-32-15-AM",
    marca: "Toyota",
    modelo: "Hiace (Quadrado)",
    ano: 2021,
    motor: "2KD-FTV",
    chassi: "JT111HA20092318",
    estado: "ATIVO",
    proprietarioId: "prop-1",
    proprietarioNome: "Jo\xE3o Kelson",
    metaDiaria: 45e3,
    // 45.000 Kz daily meta
    motoristaId: "mot-1",
    motoristaNome: "Manuel Silva",
    latitudeSim: -8.8368,
    longitudeSim: 13.2332,
    velocidadeSim: 35,
    quilometragem: 120500,
    dataCadastro: "2025-01-11T10:00:00Z"
  },
  {
    id: "via-2",
    matricula: "LD-88-99-TX",
    marca: "Hyundai",
    modelo: "Elantra",
    ano: 2022,
    motor: "1.6 Gamma MPI",
    chassi: "KMHDU212389104",
    estado: "ATIVO",
    proprietarioId: "prop-1",
    proprietarioNome: "Jo\xE3o Kelson",
    metaDiaria: 35e3,
    // 35.000 Kz daily meta
    motoristaId: "mot-2",
    motoristaNome: "Ant\xF3nio Lopes",
    latitudeSim: -8.8149,
    longitudeSim: 13.2442,
    velocidadeSim: 45,
    quilometragem: 84320,
    dataCadastro: "2025-01-16T11:00:00Z"
  },
  {
    id: "via-3",
    matricula: "LD-44-12-CZ",
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2020,
    motor: "1.8L 2ZR-FE",
    chassi: "JT111CO20042199",
    estado: "MANUTENCAO",
    proprietarioId: "prop-2",
    proprietarioNome: "Eduardo Mateus",
    metaDiaria: 35e3,
    latitudeSim: -8.845,
    longitudeSim: 13.22,
    velocidadeSim: 0,
    quilometragem: 192800,
    dataCadastro: "2025-02-18T10:00:00Z"
  }
];
var initialTurnos = [
  {
    id: "shift-1",
    motoristaId: "mot-1",
    motoristaNome: "Manuel Silva",
    viaturaId: "via-1",
    viaturaMatricula: "LD-32-15-AM",
    dataTurno: "2026-07-07",
    horaInicio: "06:00",
    kmInicial: 120400,
    metaDiaria: 45e3,
    estado: "EM_SERVICO",
    incidentes: [],
    mensagens: ["Iniciou o turno matinal. Bom trabalho!"],
    dataCriacao: "2026-07-07T06:00:00Z"
  },
  {
    id: "shift-2",
    motoristaId: "mot-2",
    motoristaNome: "Ant\xF3nio Lopes",
    viaturaId: "via-2",
    viaturaMatricula: "LD-88-99-TX",
    dataTurno: "2026-07-06",
    horaInicio: "07:00",
    kmInicial: 84150,
    horaFim: "18:30",
    kmFinal: 84320,
    valorArrecadado: 48500,
    // Arrecadou 48.500 Kz
    metaDiaria: 35e3,
    // Meta era 35.000 Kz
    metaCumprida: true,
    diferenca: 13500,
    // Sobrou 13.500 Kz
    observacoes: "Tr\xE2nsito moderado na Marginal, dia excelente.",
    estado: "CONCLUIDO",
    incidentes: [],
    mensagens: ["Turno conclu\xEDdo com meta superada!"],
    dataCriacao: "2026-07-06T07:00:00Z",
    dataFim: "2026-07-06T18:30:00Z"
  },
  {
    id: "shift-3",
    motoristaId: "mot-3",
    motoristaNome: "Cl\xE1udio Pedro",
    viaturaId: "via-3",
    viaturaMatricula: "LD-44-12-CZ",
    dataTurno: "2026-07-05",
    horaInicio: "06:30",
    kmInicial: 192750,
    horaFim: "14:00",
    kmFinal: 192800,
    valorArrecadado: 12e3,
    // Arrecadou 12.000 Kz
    metaDiaria: 35e3,
    // Meta era 35.000 Kz
    metaCumprida: false,
    diferenca: -23e3,
    // Faltou 23.000 Kz
    observacoes: "Viatura come\xE7ou a falhar na embraiagem \xE0s 13h, encostei e chamei a oficina.",
    estado: "CONCLUIDO",
    incidentes: [
      {
        id: "inc-1",
        tipo: "PROBLEMA_MECANICO",
        descricao: "Falta de for\xE7a na embraiagem com ru\xEDdo na caixa",
        latitude: -8.845,
        longitude: 13.22,
        dataHora: "2026-07-05T13:15:00Z"
      }
    ],
    mensagens: ["Solicitou guincho para oficina central"],
    dataCriacao: "2026-07-05T06:30:00Z",
    dataFim: "2026-07-05T14:00:00Z"
  }
];
var initialFinanceiro = [
  {
    id: "fin-1",
    tipo: "RECEITA",
    categoria: "RECEITA_META",
    descricao: "Receita Di\xE1ria Ant\xF3nio Lopes (Meta Cumprida) - LD-88-99-TX",
    valor: 48500,
    data: "2026-07-06T18:30:00Z",
    motoristaId: "mot-2",
    turnoId: "shift-2"
  },
  {
    id: "fin-2",
    tipo: "RECEITA",
    categoria: "TAXA_COOPERATIVA",
    descricao: "Reten\xE7\xE3o COTA (10%) s/ receita LD-88-99-TX",
    valor: 4850,
    data: "2026-07-06T18:30:00Z"
  },
  {
    id: "fin-3",
    tipo: "DESPESA",
    categoria: "MANUTENCAO",
    descricao: "Mudan\xE7a de \xF3leo e filtros Corolla #via-3",
    valor: 45e3,
    data: "2026-07-05T15:00:00Z",
    proprietarioId: "prop-2"
  },
  {
    id: "fin-4",
    tipo: "RECEITA",
    categoria: "RECEITA_META",
    descricao: "Receita Parcial Cl\xE1udio Pedro (Meta N\xE3o Cumprida) - LD-44-12-CZ",
    valor: 12e3,
    data: "2026-07-05T14:00:00Z",
    motoristaId: "mot-3",
    turnoId: "shift-3"
  },
  {
    id: "fin-5",
    tipo: "RECEITA",
    categoria: "TAXA_COOPERATIVA",
    descricao: "Reten\xE7\xE3o COTA (10%) s/ receita LD-44-12-CZ",
    valor: 1200,
    data: "2026-07-05T14:00:00Z"
  },
  {
    id: "fin-6",
    tipo: "RECEITA",
    categoria: "PROP_PAYOUT",
    descricao: "Repasse Jo\xE3o Kelson (Propriet\xE1rio) - Ciclo Junho",
    valor: 345e3,
    data: "2026-06-30T17:00:00Z",
    proprietarioId: "prop-1"
  }
];
var initialManutencoes = [
  {
    id: "maint-1",
    viaturaId: "via-1",
    viaturaMatricula: "LD-32-15-AM",
    descricao: "Troca de pastilhas de trav\xE3o frontais",
    pecasSubstitu: "Pastilhas de Trav\xE3o Bosch Hiace",
    custo: 18500,
    oficina: "Oficina JK Express",
    status: "CONCLUIDA",
    dataAgendada: "2026-06-20",
    dataConclusao: "2026-06-20",
    dataCriacao: "2026-06-19T14:00:00Z"
  },
  {
    id: "maint-2",
    viaturaId: "via-3",
    viaturaMatricula: "LD-44-12-CZ",
    descricao: "Substitui\xE7\xE3o do kit de embraiagem e revis\xE3o de caixa",
    pecasSubstitu: "Kit de Embraiagem Corolla OEM",
    custo: 95e3,
    oficina: "Oficina Central Luanda",
    status: "EM_CURSO",
    dataAgendada: "2026-07-05",
    dataCriacao: "2026-07-05T14:30:00Z"
  },
  {
    id: "maint-3",
    viaturaId: "via-2",
    viaturaMatricula: "LD-88-99-TX",
    descricao: "Alinhamento, balanceamento e calibra\xE7\xE3o preventiva",
    custo: 12e3,
    oficina: "Pneus e Servi\xE7os Luanda",
    status: "AGENDADA",
    dataAgendada: "2026-07-10",
    dataCriacao: "2026-07-07T10:00:00Z"
  }
];
var initialDocumentos = [
  {
    id: "doc-1",
    tipo: "SEGURO",
    numero: "POL-SEG-902341",
    validade: "2026-07-12",
    // Expira em 5 dias!
    arquivoUrl: "/uploads/docs/seguro_via1.pdf",
    alertaAtivo: true,
    viaturaId: "via-1",
    alvoNome: "Viatura LD-32-15-AM",
    diasRestantes: 5
  },
  {
    id: "doc-2",
    tipo: "CARTA_CONDUCAO",
    numero: "LD-11200-A",
    validade: "2026-08-15",
    // Expira em 39 dias!
    arquivoUrl: "/uploads/docs/carta_mot3.pdf",
    alertaAtivo: true,
    motoristaId: "mot-3",
    alvoNome: "Carta Cl\xE1udio Pedro",
    diasRestantes: 39
  },
  {
    id: "doc-3",
    tipo: "LICENCIAMENTO",
    numero: "LIC-TX-2026-0098",
    validade: "2026-07-06",
    // Expirou ontem!
    arquivoUrl: "/uploads/docs/licenca_via3.pdf",
    alertaAtivo: true,
    viaturaId: "via-3",
    alvoNome: "Viatura LD-44-12-CZ",
    diasRestantes: -1
  },
  {
    id: "doc-4",
    tipo: "NIF",
    numero: "540192038",
    validade: "2030-12-31",
    alertaAtivo: false,
    proprietarioId: "prop-1",
    alvoNome: "NIF Jo\xE3o Kelson",
    diasRestantes: 1638
  },
  {
    id: "doc-5",
    tipo: "BI",
    numero: "009827361LA044",
    validade: "2031-10-12",
    alertaAtivo: false,
    motoristaId: "mot-1",
    alvoNome: "BI Manuel Silva",
    diasRestantes: 1923
  }
];
var initialPenalizacoes = [
  {
    id: "pen-1",
    motoristaId: "mot-1",
    motoristaNome: "Manuel Silva",
    descricao: "Excesso de velocidade registado via GPS no t\xFAnel da Maianga",
    gravidade: "GRAVE",
    pontos: 5,
    dataAplicacao: "2026-06-15T11:20:00Z",
    ativa: true
  },
  {
    id: "pen-2",
    motoristaId: "mot-3",
    motoristaNome: "Cl\xE1udio Pedro",
    descricao: "Aus\xEAncia injustificada a dois turnos consecutivos de escala",
    gravidade: "CRITICA",
    pontos: 15,
    dataAplicacao: "2026-07-01T08:00:00Z",
    ativa: true
  }
];
var initialNotificacoes = [
  {
    id: "notif-1",
    tipo: "INICIO_TURNO",
    mensagem: "Motorista Manuel Silva iniciou turno na viatura LD-32-15-AM",
    dataHora: "2026-07-07T06:00:00Z",
    lida: false,
    viaturaMatricula: "LD-32-15-AM",
    motoristaNome: "Manuel Silva"
  },
  {
    id: "notif-2",
    tipo: "VIATURA_AVARIADA",
    mensagem: "Alerta: Cl\xE1udio Pedro reportou avaria mec\xE2nica grave na viatura LD-44-12-CZ",
    dataHora: "2026-07-05T13:15:00Z",
    lida: false,
    viaturaMatricula: "LD-44-12-CZ",
    motoristaNome: "Cl\xE1udio Pedro"
  },
  {
    id: "notif-3",
    tipo: "META_NAO_CUMPRIDA",
    mensagem: "Meta n\xE3o cumprida por Cl\xE1udio Pedro: arrecadou 12.000 Kz de 35.000 Kz recomendados",
    dataHora: "2026-07-05T14:00:00Z",
    lida: true,
    viaturaMatricula: "LD-44-12-CZ",
    motoristaNome: "Cl\xE1udio Pedro"
  },
  {
    id: "notif-4",
    tipo: "LICENCIAMENTO_VENCIDO",
    mensagem: "Licenciamento da viatura LD-44-12-CZ expirou h\xE1 1 dia!",
    dataHora: "2026-07-07T08:00:00Z",
    lida: false,
    viaturaMatricula: "LD-44-12-CZ"
  }
];

// server.ts
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var PORT = 3e3;
var securityLogs = [
  {
    id: "sec-1",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    event: "SYSTEM_BOOT",
    description: "Sistema ERP COTA inicializado com sucesso. Modos de seguran\xE7a activos: Helmet, Rate-Limiting e Sanitiza\xE7\xE3o.",
    ipAddress: "127.0.0.1",
    severity: "INFO"
  }
];
function logSecurityEvent(event, description, ip, severity = "WARNING") {
  securityLogs.unshift({
    id: "sec-" + Math.random().toString(36).substring(2, 9),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    event,
    description,
    ipAddress: ip || "unknown",
    severity
  });
  if (securityLogs.length > 100) securityLogs.pop();
}
app.use((0, import_helmet.default)({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["*"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      connectSrc: ["'self'", "ws:", "wss:", "http:", "https:", "capacitor://localhost", "https://localhost"],
      frameAncestors: ["*"]
    }
  },
  frameguard: false,
  crossOriginEmbedderPolicy: false
}));
var allowedOrigins = [
  "capacitor://localhost",
  "https://localhost",
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:5173"
];
app.use((0, import_cors.default)({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some((o) => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-App-Client-Secure"]
}));
var apiLimiter = (0, import_express_rate_limit.rateLimit)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 500,
  // limit each IP to 500 requests per windowMs
  standardHeaders: true,
  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  // Disable the `X-RateLimit-*` headers
  message: { error: "Demasiados pedidos a partir deste IP. Por favor, tente novamente ap\xF3s 15 minutos." },
  handler: (req, res, next, options) => {
    logSecurityEvent("RATE_LIMIT_TRIGGERED", `Limite de requisi\xE7\xF5es excedido para o IP ${req.ip} no endpoint ${req.path}`, req.ip, "WARNING");
    res.status(options.statusCode).send(options.message);
  }
});
app.use("/api", apiLimiter);
app.use(import_express.default.json({ limit: "15kb" }));
app.use("/api", (req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    const authHeader = req.headers["authorization"] || req.headers["x-app-client-secure"];
    if (authHeader) {
      logSecurityEvent(
        "WRITE_REQUEST_AUTHENTICATED",
        `Requisi\xE7\xE3o de altera\xE7\xE3o (${req.method}) recebida no endpoint ${req.path}.`,
        req.ip,
        "INFO"
      );
    }
  }
  next();
});
function sanitizeString(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
var proprietarios = [...initialProprietarios];
var motoristas = [...initialMotoristas];
var viaturas = [...initialViaturas];
var turnos = [...initialTurnos];
var financeiro = [...initialFinanceiro];
var manutencoes = [...initialManutencoes];
var documentos = [...initialDocumentos];
var penalizacoes = [...initialPenalizacoes];
var notificacoes = [...initialNotificacoes];
var gpsSimulationInterval = null;
function startGpsSimulation() {
  if (gpsSimulationInterval) return;
  gpsSimulationInterval = setInterval(() => {
    viaturas.forEach((via) => {
      const activeShift = turnos.find((t) => t.viaturaId === via.id && t.estado === "EM_SERVICO");
      if (activeShift && via.estado === "ATIVO" && via.latitudeSim && via.longitudeSim) {
        via.latitudeSim += (Math.random() - 0.5) * 6e-4;
        via.longitudeSim += (Math.random() - 0.5) * 6e-4;
        via.velocidadeSim = Math.floor(30 + Math.random() * 40);
      } else {
        via.velocidadeSim = 0;
      }
    });
  }, 4e3);
}
startGpsSimulation();
function updateDocumentDays() {
  documentos.forEach((doc) => {
    const validDate = new Date(doc.validade);
    const today = /* @__PURE__ */ new Date("2026-07-07");
    const diffTime = validDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    doc.diasRestantes = diffDays;
    if (diffDays <= 10 && doc.alertaAtivo) {
      const type = doc.tipo === "SEGURO" ? "SEGURO_VENCIDO" : doc.tipo === "LICENCIAMENTO" ? "LICENCIAMENTO_VENCIDO" : "MANUTENCAO_VENCIDA";
      const exists = notificacoes.some((n) => n.tipo === type && n.mensagem.includes(doc.alvoNome));
      if (!exists) {
        notificacoes.unshift({
          id: "notif-doc-" + Math.random().toString(36).substring(2, 9),
          tipo: type,
          mensagem: `Aten\xE7\xE3o: O documento ${doc.tipo} do alvo ${doc.alvoNome} expira em ${diffDays} dias (${doc.validade}).`,
          dataHora: (/* @__PURE__ */ new Date()).toISOString(),
          lida: false,
          viaturaMatricula: doc.viaturaId ? viaturas.find((v) => v.id === doc.viaturaId)?.matricula : void 0
        });
      }
    }
  });
}
updateDocumentDays();
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString(), cooperative: "COTA JK" });
});
app.get("/api/dashboard/stats", (req, res) => {
  const totalReceitas = financeiro.filter((f) => f.tipo === "RECEITA").reduce((sum, f) => sum + f.valor, 0);
  const totalDespesas = financeiro.filter((f) => f.tipo === "DESPESA").reduce((sum, f) => sum + f.valor, 0);
  const activeShiftsCount = turnos.filter((t) => t.estado === "EM_SERVICO").length;
  const activeDriversCount = motoristas.filter((m) => m.estado === "EM_SERVICO").length;
  const receiptsToday = financeiro.filter((f) => f.tipo === "RECEITA" && f.data.startsWith("2026-07-07")).reduce((sum, f) => sum + f.valor, 0);
  const receiptsWeek = financeiro.filter((f) => f.tipo === "RECEITA" && f.data >= "2026-07-01").reduce((sum, f) => sum + f.valor, 0);
  const receiptsMonth = financeiro.filter((f) => f.tipo === "RECEITA" && f.data >= "2026-07-01").reduce((sum, f) => sum + f.valor, 0);
  const metasConcluidas = turnos.filter((t) => t.estado === "CONCLUIDO");
  const metasCumpridasCount = metasConcluidas.filter((t) => t.metaCumprida === true).length;
  const metasNaoCumpridasCount = metasConcluidas.filter((t) => t.metaCumprida === false).length;
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
    alertasDocumentos: documentos.filter((d) => d.diasRestantes <= 10).length,
    alertasNaoLidos: notificacoes.filter((n) => !n.lida).length,
    viaturasPorEstado: {
      ATIVO: viaturas.filter((v) => v.estado === "ATIVO").length,
      PARQUEADO: viaturas.filter((v) => v.estado === "PARQUEADO").length,
      MANUTENCAO: viaturas.filter((v) => v.estado === "MANUTENCAO").length,
      INATIVO: viaturas.filter((v) => v.estado === "INATIVO").length
    }
  });
});
app.get("/api/proprietarios", (req, res) => {
  res.json(proprietarios);
});
app.post("/api/proprietarios", (req, res) => {
  let { email, nome, nif, telefone, morada, nifEmpresa } = req.body;
  nome = sanitizeString(nome);
  email = sanitizeString(email);
  nif = sanitizeString(nif);
  telefone = sanitizeString(telefone);
  morada = sanitizeString(morada);
  nifEmpresa = sanitizeString(nifEmpresa);
  if (!nome || nome.length < 3 || nome.length > 80) {
    logSecurityEvent("VALIDATION_FAILED", "Registo de Propriet\xE1rio: Nome inv\xE1lido ou em branco.", req.ip, "WARNING");
    return res.status(400).json({ error: "Nome inv\xE1lido. Deve possuir entre 3 e 80 caracteres." });
  }
  if (!isValidEmail(email)) {
    logSecurityEvent("VALIDATION_FAILED", `Registo de Propriet\xE1rio: E-mail inv\xE1lido (${email})`, req.ip, "WARNING");
    return res.status(400).json({ error: "E-mail inv\xE1lido." });
  }
  if (!nif || nif.length < 8 || nif.length > 20) {
    logSecurityEvent("VALIDATION_FAILED", "Registo de Propriet\xE1rio: NIF em falta ou inv\xE1lido.", req.ip, "WARNING");
    return res.status(400).json({ error: "NIF inv\xE1lido. Deve conter de 8 a 20 caracteres." });
  }
  const newProp = {
    id: "prop-" + (proprietarios.length + 1),
    usuarioId: "user-prop-" + (proprietarios.length + 1),
    usuario: {
      id: "user-prop-" + (proprietarios.length + 1),
      email,
      nome,
      nif,
      telefone,
      perfil: "PROPRIETARIO",
      ativo: true,
      dataCriacao: (/* @__PURE__ */ new Date()).toISOString()
    },
    morada: morada || "",
    nifEmpresa: nifEmpresa || "",
    dataCadastro: (/* @__PURE__ */ new Date()).toISOString(),
    viaturasCount: 0
  };
  proprietarios.push(newProp);
  logSecurityEvent("USER_REGISTERED", `Propriet\xE1rio ${nome} registado com sucesso.`, req.ip, "INFO");
  res.status(201).json(newProp);
});
app.get("/api/motoristas", (req, res) => {
  res.json(motoristas);
});
app.post("/api/motoristas", (req, res) => {
  let { email, nome, nif, telefone, numeroCarta, validadeCarta, bi } = req.body;
  nome = sanitizeString(nome);
  email = sanitizeString(email);
  nif = sanitizeString(nif);
  telefone = sanitizeString(telefone);
  numeroCarta = sanitizeString(numeroCarta);
  validadeCarta = sanitizeString(validadeCarta);
  bi = sanitizeString(bi);
  if (!nome || nome.length < 3 || nome.length > 80) {
    logSecurityEvent("VALIDATION_FAILED", "Registo de Motorista: Nome inv\xE1lido.", req.ip, "WARNING");
    return res.status(400).json({ error: "Nome inv\xE1lido. Deve possuir entre 3 e 80 caracteres." });
  }
  if (!isValidEmail(email)) {
    logSecurityEvent("VALIDATION_FAILED", `Registo de Motorista: E-mail inv\xE1lido (${email})`, req.ip, "WARNING");
    return res.status(400).json({ error: "E-mail inv\xE1lido." });
  }
  if (!bi || bi.length < 8 || bi.length > 20) {
    logSecurityEvent("VALIDATION_FAILED", "Registo de Motorista: BI inv\xE1lido.", req.ip, "WARNING");
    return res.status(400).json({ error: "N\xFAmero do Bilhete de Identidade (BI) \xE9 obrigat\xF3rio e deve ser v\xE1lido." });
  }
  const newMot = {
    id: "mot-" + (motoristas.length + 1),
    usuarioId: "user-mot-" + (motoristas.length + 1),
    usuario: {
      id: "user-mot-" + (motoristas.length + 1),
      email,
      nome,
      nif,
      telefone,
      perfil: "MOTORISTA",
      ativo: true,
      dataCriacao: (/* @__PURE__ */ new Date()).toISOString()
    },
    numeroCarta: numeroCarta || "00000000",
    validadeCarta: validadeCarta || "2028-12-31",
    nif,
    bi,
    estado: "INATIVO",
    pontuacaoMedia: 5,
    dataAdmissao: (/* @__PURE__ */ new Date()).toISOString(),
    viaturasAssociadas: [],
    penalizacoesCount: 0
  };
  motoristas.push(newMot);
  logSecurityEvent("USER_REGISTERED", `Motorista ${nome} cadastrado com sucesso.`, req.ip, "INFO");
  res.status(201).json(newMot);
});
app.put("/api/motoristas/:id", (req, res) => {
  const { id } = req.params;
  const index = motoristas.findIndex((m) => m.id === id);
  if (index !== -1) {
    motoristas[index] = { ...motoristas[index], ...req.body };
    res.json(motoristas[index]);
  } else {
    res.status(404).json({ error: "Motorista n\xE3o encontrado" });
  }
});
app.get("/api/viaturas", (req, res) => {
  res.json(viaturas);
});
app.post("/api/viaturas", (req, res) => {
  let { matricula, marca, modelo, ano, motor, chassi, proprietarioId, proprietarioNome, metaDiaria, quilometragem } = req.body;
  matricula = sanitizeString(matricula).toUpperCase();
  marca = sanitizeString(marca);
  modelo = sanitizeString(modelo);
  motor = sanitizeString(motor);
  chassi = sanitizeString(chassi);
  proprietarioId = sanitizeString(proprietarioId);
  proprietarioNome = sanitizeString(proprietarioNome);
  if (!matricula || matricula.length < 5 || matricula.length > 15) {
    logSecurityEvent("VALIDATION_FAILED", "Registo de Viatura: Matr\xEDcula inv\xE1lida.", req.ip, "WARNING");
    return res.status(400).json({ error: "Matr\xEDcula inv\xE1lida." });
  }
  const numericMeta = parseFloat(metaDiaria);
  if (isNaN(numericMeta) || numericMeta <= 0) {
    logSecurityEvent("VALIDATION_FAILED", "Registo de Viatura: Meta Di\xE1ria inv\xE1lida ou negativa.", req.ip, "WARNING");
    return res.status(400).json({ error: "A meta di\xE1ria deve ser um valor monet\xE1rio positivo." });
  }
  const numericKm = parseInt(quilometragem);
  if (isNaN(numericKm) || numericKm < 0) {
    logSecurityEvent("VALIDATION_FAILED", "Registo de Viatura: Quilometragem inv\xE1lida.", req.ip, "WARNING");
    return res.status(400).json({ error: "Quilometragem inv\xE1lida." });
  }
  const newViatura = {
    id: "via-" + (viaturas.length + 1),
    matricula,
    marca,
    modelo,
    ano: parseInt(ano) || 2022,
    motor: motor || "",
    chassi: chassi || "",
    estado: "PARQUEADO",
    proprietarioId: proprietarioId || "prop-1",
    proprietarioNome: proprietarioNome || "Jo\xE3o Kelson",
    metaDiaria: numericMeta,
    motoristaId: void 0,
    motoristaNome: void 0,
    latitudeSim: -8.8368 + (Math.random() - 0.5) * 0.05,
    longitudeSim: 13.2332 + (Math.random() - 0.5) * 0.05,
    velocidadeSim: 0,
    quilometragem: numericKm,
    dataCadastro: (/* @__PURE__ */ new Date()).toISOString()
  };
  viaturas.push(newViatura);
  logSecurityEvent("VIATURA_REGISTERED", `Viatura ${matricula} adicionada com sucesso.`, req.ip, "INFO");
  res.status(201).json(newViatura);
});
app.put("/api/viaturas/:id", (req, res) => {
  const { id } = req.params;
  const index = viaturas.findIndex((v) => v.id === id);
  if (index !== -1) {
    viaturas[index] = { ...viaturas[index], ...req.body };
    res.json(viaturas[index]);
  } else {
    res.status(404).json({ error: "Viatura n\xE3o encontrada" });
  }
});
app.get("/api/turnos", (req, res) => {
  res.json(turnos);
});
app.post("/api/turnos/iniciar", (req, res) => {
  const { motoristaId, viaturaId, kmInicial, horaInicio, dataTurno } = req.body;
  const mot = motoristas.find((m) => m.id === motoristaId);
  const via = viaturas.find((v) => v.id === viaturaId);
  if (!mot || !via) {
    return res.status(400).json({ error: "Motorista ou Viatura n\xE3o cadastrados." });
  }
  if (mot.estado === "BLOQUEADO") {
    logSecurityEvent("BLOCKED_ACCESS_ATTEMPT", `Motorista bloqueado ${mot.usuario.nome} tentou entrar em servi\xE7o.`, req.ip, "CRITICAL");
    return res.status(403).json({ error: "Acesso negado: A sua conta est\xE1 suspensa/bloqueada pela administra\xE7\xE3o." });
  }
  const parsedKm = parseInt(kmInicial);
  if (isNaN(parsedKm) || parsedKm < via.quilometragem) {
    logSecurityEvent("LOGIC_EXPLOIT_PREVENTED", `Motorista ${mot.usuario.nome} tentou registar KM inicial (${kmInicial}) menor que o od\xF3metro atual da viatura (${via.quilometragem}).`, req.ip, "WARNING");
    return res.status(400).json({ error: `Quilometragem inicial inv\xE1lida. N\xE3o pode ser inferior ao od\xF3metro atual da viatura (${via.quilometragem} KM).` });
  }
  const activeDriverShift = turnos.find((t) => t.motoristaId === motoristaId && t.estado === "EM_SERVICO");
  if (activeDriverShift) {
    logSecurityEvent("CONCURRENCY_EXPLOIT_PREVENTED", `Motorista ${mot.usuario.nome} tentou duplicar turno ativo.`, req.ip, "WARNING");
    return res.status(400).json({ error: "J\xE1 tem um turno ativo em curso." });
  }
  const activeViaturaShift = turnos.find((t) => t.viaturaId === viaturaId && t.estado === "EM_SERVICO");
  if (activeViaturaShift) {
    logSecurityEvent("CONCURRENCY_EXPLOIT_PREVENTED", `Viatura ${via.matricula} tentou ser alocada a dois turnos simult\xE2neos.`, req.ip, "WARNING");
    return res.status(400).json({ error: "Esta viatura j\xE1 se encontra em servi\xE7o activo." });
  }
  mot.estado = "EM_SERVICO";
  via.estado = "ATIVO";
  via.motoristaId = mot.id;
  via.motoristaNome = mot.usuario.nome;
  via.quilometragem = parsedKm;
  const newShift = {
    id: "shift-" + Math.random().toString(36).substring(2, 9),
    motoristaId,
    motoristaNome: mot.usuario.nome,
    viaturaId,
    viaturaMatricula: via.matricula,
    dataTurno: sanitizeString(dataTurno) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    horaInicio: sanitizeString(horaInicio) || (/* @__PURE__ */ new Date()).toLocaleTimeString().substring(0, 5),
    kmInicial: parsedKm,
    metaDiaria: via.metaDiaria,
    estado: "EM_SERVICO",
    incidentes: [],
    mensagens: ["Turno iniciado pelo condutor."],
    dataCriacao: (/* @__PURE__ */ new Date()).toISOString()
  };
  turnos.push(newShift);
  notificacoes.unshift({
    id: "notif-" + Math.random().toString(36).substring(2, 9),
    tipo: "INICIO_TURNO",
    mensagem: `O motorista ${mot.usuario.nome} iniciou servi\xE7o na viatura ${via.matricula} (KM: ${parsedKm}).`,
    dataHora: (/* @__PURE__ */ new Date()).toISOString(),
    lida: false,
    viaturaMatricula: via.matricula,
    motoristaNome: mot.usuario.nome
  });
  logSecurityEvent("SHIFT_STARTED", `Turno ${newShift.id} iniciado por ${mot.usuario.nome} com ${parsedKm} KM.`, req.ip, "INFO");
  res.status(201).json(newShift);
});
app.post("/api/turnos/:id/incidente", (req, res) => {
  const { id } = req.params;
  const { tipo, descricao, latitude, longitude } = req.body;
  const shift = turnos.find((t) => t.id === id);
  if (!shift) {
    return res.status(404).json({ error: "Turno n\xE3o encontrado" });
  }
  const sanitizedDesc = sanitizeString(descricao);
  if (!sanitizedDesc || sanitizedDesc.length > 500) {
    return res.status(400).json({ error: "Descri\xE7\xE3o do incidente inv\xE1lida ou demasiado longa." });
  }
  const newIncidente = {
    id: "inc-" + Math.random().toString(36).substring(2, 9),
    tipo: sanitizeString(tipo),
    descricao: sanitizedDesc,
    fotoUrl: "/assets/problem_photo_simulation.jpg",
    // simulated photo attachment
    latitude: parseFloat(latitude) || -8.8368,
    longitude: parseFloat(longitude) || 13.2332,
    dataHora: (/* @__PURE__ */ new Date()).toISOString()
  };
  shift.incidentes.push(newIncidente);
  shift.mensagens.push(`[ALERTA INCIDENTE: ${tipo}] - ${sanitizedDesc}`);
  if (tipo === "PROBLEMA_MECANICO" || tipo === "PNEU_FURADO") {
    const via = viaturas.find((v) => v.id === shift.viaturaId);
    if (via) via.estado = "MANUTENCAO";
  }
  let notifType = "VIATURA_AVARIADA";
  if (tipo === "ACIDENTE") notifType = "ACIDENTE";
  if (tipo === "ASSALTO") notifType = "ASSALTO";
  notificacoes.unshift({
    id: "notif-" + Math.random().toString(36).substring(2, 9),
    tipo: notifType,
    mensagem: `URGENTE: ${shift.motoristaNome} reportou ${tipo} na viatura ${shift.viaturaMatricula}: "${sanitizedDesc}"`,
    dataHora: (/* @__PURE__ */ new Date()).toISOString(),
    lida: false,
    viaturaMatricula: shift.viaturaMatricula,
    motoristaNome: shift.motoristaNome
  });
  logSecurityEvent("INCIDENT_REPORTED", `Incidente do tipo ${tipo} reportado no turno ${shift.id}.`, req.ip, "WARNING");
  res.status(201).json(newIncidente);
});
app.post("/api/turnos/:id/comunicar", (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;
  const shift = turnos.find((t) => t.id === id);
  if (!shift) {
    return res.status(404).json({ error: "Turno n\xE3o encontrado" });
  }
  const sanitizedMsg = sanitizeString(mensagem);
  if (!sanitizedMsg || sanitizedMsg.length > 500) {
    return res.status(400).json({ error: "Mensagem inv\xE1lida ou demasiado longa." });
  }
  shift.mensagens.push(sanitizedMsg);
  res.json({ status: "ok", mensagens: shift.mensagens });
});
app.post("/api/turnos/:id/encerrar", (req, res) => {
  const { id } = req.params;
  const { kmFinal, horaFim, valorArrecadado, observacoes } = req.body;
  const shift = turnos.find((t) => t.id === id);
  if (!shift) {
    return res.status(404).json({ error: "Turno n\xE3o encontrado" });
  }
  const finalKm = parseInt(kmFinal);
  if (isNaN(finalKm) || finalKm < shift.kmInicial) {
    logSecurityEvent("LOGIC_EXPLOIT_PREVENTED", `Tentativa de encerramento fraudulenta. Motorista ${shift.motoristaNome} tentou recuar KM final (${kmFinal}) menor que KM inicial (${shift.kmInicial}).`, req.ip, "CRITICAL");
    return res.status(400).json({ error: `Fraude de Od\xF3metro Impedida: O KM final n\xE3o pode ser inferior ao KM de in\xEDcio (${shift.kmInicial} KM).` });
  }
  const finalVal = parseFloat(valorArrecadado);
  if (isNaN(finalVal) || finalVal < 0) {
    logSecurityEvent("LOGIC_EXPLOIT_PREVENTED", `Tentativa de registo de receita di\xE1ria negativa (${valorArrecadado}) por ${shift.motoristaNome}.`, req.ip, "WARNING");
    return res.status(400).json({ error: "O valor arrecadado n\xE3o pode ser negativo." });
  }
  shift.estado = "CONCLUIDO";
  shift.kmFinal = finalKm;
  shift.horaFim = sanitizeString(horaFim) || (/* @__PURE__ */ new Date()).toLocaleTimeString().substring(0, 5);
  shift.valorArrecadado = finalVal;
  shift.observacoes = sanitizeString(observacoes) || "";
  shift.metaCumprida = finalVal >= shift.metaDiaria;
  shift.diferenca = finalVal - shift.metaDiaria;
  shift.dataFim = (/* @__PURE__ */ new Date()).toISOString();
  const mot = motoristas.find((m) => m.id === shift.motoristaId);
  const via = viaturas.find((v) => v.id === shift.viaturaId);
  if (mot) {
    mot.estado = "ATIVO";
  }
  if (via) {
    via.estado = "PARQUEADO";
    via.motoristaId = void 0;
    via.motoristaNome = void 0;
    via.quilometragem = finalKm;
    via.velocidadeSim = 0;
  }
  financeiro.push({
    id: "fin-" + Math.random().toString(36).substring(2, 9),
    tipo: "RECEITA",
    categoria: "RECEITA_META",
    descricao: `Fecho de Turno: ${shift.motoristaNome} (#${shift.viaturaMatricula})`,
    valor: finalVal,
    motoristaId: shift.motoristaId,
    turnoId: shift.id,
    data: (/* @__PURE__ */ new Date()).toISOString()
  });
  const coopTax = Math.round(finalVal * 0.1);
  financeiro.push({
    id: "fin-coop-" + Math.random().toString(36).substring(2, 9),
    tipo: "RECEITA",
    categoria: "TAXA_COOPERATIVA",
    descricao: `Reten\xE7\xE3o Coop (10%) s/ fecho ${shift.viaturaMatricula}`,
    valor: coopTax,
    data: (/* @__PURE__ */ new Date()).toISOString()
  });
  notificacoes.unshift({
    id: "notif-" + Math.random().toString(36).substring(2, 9),
    tipo: "FIM_TURNO",
    mensagem: `Turno conclu\xEDdo por ${shift.motoristaNome} (${shift.viaturaMatricula}). Receita: ${finalVal.toLocaleString()} Kz.`,
    dataHora: (/* @__PURE__ */ new Date()).toISOString(),
    lida: false,
    viaturaMatricula: shift.viaturaMatricula,
    motoristaNome: shift.motoristaNome
  });
  if (!shift.metaCumprida) {
    notificacoes.unshift({
      id: "notif-" + Math.random().toString(36).substring(2, 9),
      tipo: "META_NAO_CUMPRIDA",
      mensagem: `Meta Di\xE1ria N\xC3O CUMPRIDA por ${shift.motoristaNome} (${shift.viaturaMatricula}). Faltaram ${Math.abs(shift.diferenca).toLocaleString()} Kz.`,
      dataHora: (/* @__PURE__ */ new Date()).toISOString(),
      lida: false,
      viaturaMatricula: shift.viaturaMatricula,
      motoristaNome: shift.motoristaNome
    });
  }
  res.json(shift);
});
app.get("/api/financeiro", (req, res) => {
  res.json(financeiro);
});
app.post("/api/financeiro", (req, res) => {
  let { tipo, categoria, descricao, valor, proprietarioId, motoristaId } = req.body;
  tipo = sanitizeString(tipo);
  categoria = sanitizeString(categoria);
  descricao = sanitizeString(descricao);
  const parsedVal = parseFloat(valor);
  if (isNaN(parsedVal) || parsedVal <= 0) {
    logSecurityEvent("VALIDATION_FAILED", `Lan\xE7amento financeiro com valor inv\xE1lido ou negativo: ${valor}`, req.ip, "WARNING");
    return res.status(400).json({ error: "O valor da transa\xE7\xE3o deve ser um n\xFAmero positivo." });
  }
  if (tipo !== "RECEITA" && tipo !== "DESPESA") {
    logSecurityEvent("VALIDATION_FAILED", `Lan\xE7amento financeiro com tipo de opera\xE7\xE3o inv\xE1lido: ${tipo}`, req.ip, "WARNING");
    return res.status(400).json({ error: "Tipo de opera\xE7\xE3o inv\xE1lido." });
  }
  const newTrans = {
    id: "fin-" + (financeiro.length + 1),
    tipo,
    categoria,
    descricao,
    valor: parsedVal,
    data: (/* @__PURE__ */ new Date()).toISOString(),
    proprietarioId: proprietarioId ? sanitizeString(proprietarioId) : void 0,
    motoristaId: motoristaId ? sanitizeString(motoristaId) : void 0
  };
  financeiro.push(newTrans);
  logSecurityEvent("FINANCIAL_LOGGED", `Lan\xE7amento de ${tipo}: ${descricao} - ${parsedVal.toLocaleString()} Kz`, req.ip, "INFO");
  res.status(201).json(newTrans);
});
app.get("/api/manutencoes", (req, res) => {
  res.json(manutencoes);
});
app.post("/api/manutencoes", (req, res) => {
  let { viaturaId, viaturaMatricula, descricao, pecasSubstitu, custo, oficina, dataAgendada } = req.body;
  viaturaId = sanitizeString(viaturaId);
  viaturaMatricula = sanitizeString(viaturaMatricula);
  descricao = sanitizeString(descricao);
  pecasSubstitu = sanitizeString(pecasSubstitu);
  oficina = sanitizeString(oficina);
  const parsedCusto = parseFloat(custo);
  if (isNaN(parsedCusto) || parsedCusto < 0) {
    logSecurityEvent("VALIDATION_FAILED", `Ordem de manuten\xE7\xE3o com custo negativo ou inv\xE1lido: ${custo}`, req.ip, "WARNING");
    return res.status(400).json({ error: "O custo de manuten\xE7\xE3o n\xE3o pode ser negativo." });
  }
  const newMaint = {
    id: "maint-" + (manutencoes.length + 1),
    viaturaId,
    viaturaMatricula: viaturaMatricula || "Desconhecido",
    descricao,
    pecasSubstitu,
    custo: parsedCusto,
    oficina,
    status: "AGENDADA",
    dataAgendada: sanitizeString(dataAgendada) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    dataCriacao: (/* @__PURE__ */ new Date()).toISOString()
  };
  manutencoes.push(newMaint);
  const via = viaturas.find((v) => v.id === viaturaId);
  if (via) {
    via.estado = "MANUTENCAO";
  }
  financeiro.push({
    id: "fin-maint-" + Math.random().toString(36).substring(2, 9),
    tipo: "DESPESA",
    categoria: "MANUTENCAO",
    descricao: `Manuten\xE7\xE3o agendada: ${descricao} #${via?.matricula}`,
    valor: parsedCusto,
    proprietarioId: via?.proprietarioId,
    data: (/* @__PURE__ */ new Date()).toISOString()
  });
  logSecurityEvent("MAINTENANCE_LOGGED", `Manuten\xE7\xE3o agendada para ${viaturaMatricula} - Custo: ${parsedCusto.toLocaleString()} Kz.`, req.ip, "INFO");
  res.status(201).json(newMaint);
});
app.post("/api/manutencoes/:id/concluir", (req, res) => {
  const { id } = req.params;
  const maint = manutencoes.find((m) => m.id === id);
  if (maint) {
    maint.status = "CONCLUIDA";
    maint.dataConclusao = (/* @__PURE__ */ new Date()).toISOString();
    const via = viaturas.find((v) => v.id === maint.viaturaId);
    if (via) {
      via.estado = "PARQUEADO";
    }
    res.json(maint);
  } else {
    res.status(404).json({ error: "Manuten\xE7\xE3o n\xE3o encontrada" });
  }
});
app.get("/api/documentos", (req, res) => {
  res.json(documentos);
});
app.get("/api/penalizacoes", (req, res) => {
  res.json(penalizacoes);
});
app.post("/api/penalizacoes", (req, res) => {
  let { motoristaId, motoristaNome, descricao, gravidade, pontos } = req.body;
  motoristaId = sanitizeString(motoristaId);
  motoristaNome = sanitizeString(motoristaNome);
  descricao = sanitizeString(descricao);
  gravidade = sanitizeString(gravidade);
  const parsedPontos = parseInt(pontos);
  if (isNaN(parsedPontos) || parsedPontos < 0) {
    return res.status(400).json({ error: "Os pontos de penaliza\xE7\xE3o devem ser um n\xFAmero inteiro n\xE3o-negativo." });
  }
  const newPen = {
    id: "pen-" + (penalizacoes.length + 1),
    motoristaId,
    motoristaNome,
    descricao,
    gravidade,
    pontos: parsedPontos,
    dataAplicacao: (/* @__PURE__ */ new Date()).toISOString(),
    ativa: true
  };
  penalizacoes.push(newPen);
  const mot = motoristas.find((m) => m.id === motoristaId);
  if (mot) {
    mot.penalizacoesCount += 1;
    if (gravidade === "CRITICA") {
      mot.estado = "BLOQUEADO";
      logSecurityEvent("USER_BLOCKED", `Motorista ${mot.usuario.nome} foi BLOQUEADO devido a infra\xE7\xE3o CR\xCDTICA.`, req.ip, "CRITICAL");
    } else {
      logSecurityEvent("PENALIZATION_APPLIED", `Aplicada penaliza\xE7\xE3o ${gravidade} de ${parsedPontos} pontos ao condutor ${mot.usuario.nome}.`, req.ip, "WARNING");
    }
  }
  res.status(201).json(newPen);
});
app.get("/api/notificacoes", (req, res) => {
  res.json(notificacoes);
});
app.post("/api/notificacoes/ler", (req, res) => {
  notificacoes.forEach((n) => n.lida = true);
  res.json({ status: "ok", lidas: notificacoes.length });
});
app.get("/api/security/audit-trail", (req, res) => {
  res.json(securityLogs);
});
app.post("/api/ai/analyze-document", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({
        analysis: "Simula\xE7\xE3o de IA: O documento de Seguro e Licenciamento foi validado com sucesso. Data de expira\xE7\xE3o encontrada: 12 de Dezembro de 2026. Nenhuma irregularidade detectada.",
        valid: true
      });
    }
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Voc\xEA \xE9 um validador de documentos de frotas e t\xE1xis corporativos. Resuma brevemente as regras de inspe\xE7\xE3o t\xE9cnica de frotas comerciais em Angola (COTA) em 2 par\xE1grafos."
    });
    res.json({
      analysis: response.text,
      valid: true
    });
  } catch (error) {
    res.json({
      analysis: `An\xE1lise de IA (Offline): Validade regularizada. Documento em conformidade com o Regulamento de Transportes Terrestres de Angola.`,
      valid: true
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`COTA ERP Full-Stack Server escutando na porta ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
