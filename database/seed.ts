// database/seed.ts
// COTA - Cooperativa de Gestão de Táxis JK
// Database Seeding Script using Prisma Client

import { PrismaClient, PerfilUsuario, EstadoMotorista, EstadoViatura, TipoDocumento, TipoTransacao } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando semeadura do banco de dados COTA...');

  // 1. Limpar banco de dados existente de forma segura
  await prisma.penalizacao.deleteMany();
  await prisma.escala.deleteMany();
  await prisma.gpsLog.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.manutencao.deleteMany();
  await prisma.financeiro.deleteMany();
  await prisma.corrida.deleteMany();
  await prisma.viatura.deleteMany();
  await prisma.motorista.deleteMany();
  await prisma.proprietario.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('Banco de dados limpo com sucesso.');

  // 2. Criar Usuários Administradores
  const adminUser = await prisma.usuario.create({
    data: {
      email: 'admin@cota.coop',
      senha: '$2b$12$K89sS9zG7hH8jKnLpMo98uXvWyZaBx12CcDdEeFfGgHhIiJjKkLlM', // bcrypt mock
      nome: 'Administrador Geral COTA',
      nif: '500120340',
      telefone: '+244923000001',
      perfil: PerfilUsuario.ADMINISTRADOR,
    }
  });

  const operadorUser = await prisma.usuario.create({
    data: {
      email: 'operador@cota.coop',
      senha: '$2b$12$K89sS9zG7hH8jKnLpMo98uXvWyZaBx12CcDdEeFfGgHhIiJjKkLlM',
      nome: 'Operador JK Dispatch',
      nif: '500120341',
      telefone: '+244923000002',
      perfil: PerfilUsuario.OPERADOR,
    }
  });

  // 3. Criar Proprietário
  const propUser = await prisma.usuario.create({
    data: {
      email: 'proprietario@cota.coop',
      senha: '$2b$12$K89sS9zG7hH8jKnLpMo98uXvWyZaBx12CcDdEeFfGgHhIiJjKkLlM',
      nome: 'João Kelson Proprietário',
      nif: '100450982',
      telefone: '+244923000003',
      perfil: PerfilUsuario.PROPRIETARIO,
    }
  });

  const proprietario = await prisma.proprietario.create({
    data: {
      usuarioId: propUser.id,
      morada: 'Avenida Luanda, Luanda, Angola',
      nifEmpresa: '540192038',
    }
  });

  // 4. Criar Motoristas
  const motUser1 = await prisma.usuario.create({
    data: {
      email: 'motorista1@cota.coop',
      senha: '$2b$12$K89sS9zG7hH8jKnLpMo98uXvWyZaBx12CcDdEeFfGgHhIiJjKkLlM',
      nome: 'Manuel Silva',
      nif: '210540983',
      telefone: '+244923000004',
      perfil: PerfilUsuario.MOTORISTA,
    }
  });

  const motorista1 = await prisma.motorista.create({
    data: {
      usuarioId: motUser1.id,
      numeroCarta: 'LD-90823-C',
      validadeCarta: new Date('2028-12-31'),
      nif: '210540983',
      bi: '009827361LA044',
      estado: EstadoMotorista.ATIVO,
      pontuacaoMedia: 4.8,
    }
  });

  const motUser2 = await prisma.usuario.create({
    data: {
      email: 'motorista2@cota.coop',
      senha: '$2b$12$K89sS9zG7hH8jKnLpMo98uXvWyZaBx12CcDdEeFfGgHhIiJjKkLlM',
      nome: 'António Lopes',
      nif: '240567112',
      telefone: '+244923000005',
      perfil: PerfilUsuario.MOTORISTA,
    }
  });

  const motorista2 = await prisma.motorista.create({
    data: {
      usuarioId: motUser2.id,
      numeroCarta: 'LD-45210-B',
      validadeCarta: new Date('2029-06-15'),
      nif: '240567112',
      bi: '005432110LA022',
      estado: EstadoMotorista.ATIVO,
      pontuacaoMedia: 4.9,
    }
  });

  // 5. Criar Cliente
  const cliUser = await prisma.usuario.create({
    data: {
      email: 'cliente@cota.coop',
      senha: '$2b$12$K89sS9zG7hH8jKnLpMo98uXvWyZaBx12CcDdEeFfGgHhIiJjKkLlM',
      nome: 'Maria Fernandes',
      nif: '900234120',
      telefone: '+244923000006',
      perfil: PerfilUsuario.CLIENTE,
    }
  });

  // 6. Criar Viaturas
  const viatura1 = await prisma.viatura.create({
    data: {
      matricula: 'LD-32-15-AM',
      marca: 'Toyota',
      modelo: 'Hiace (Quadrado)',
      ano: 2021,
      motor: '2KD-FTV',
      chassi: 'JT111HA20092318',
      estado: EstadoViatura.PARQUEADO,
      proprietarioId: proprietario.id,
      motoristaId: motorista1.id,
      latitudeSim: -8.8368,
      longitudeSim: 13.2332,
      velocidadeSim: 0,
    }
  });

  const viatura2 = await prisma.viatura.create({
    data: {
      matricula: 'LD-88-99-TX',
      marca: 'Hyundai',
      modelo: 'Elantra',
      ano: 2022,
      motor: '1.6 Gamma MPI',
      chassi: 'KMHDU212389104',
      estado: EstadoViatura.ATIVO,
      proprietarioId: proprietario.id,
      motoristaId: motorista2.id,
      latitudeSim: -8.8149,
      longitudeSim: 13.2442,
      velocidadeSim: 45.0,
    }
  });

  // 7. Criar Documentos
  await prisma.documento.createMany({
    data: [
      {
        tipo: TipoDocumento.BI,
        numero: motorista1.bi,
        validade: new Date('2031-10-12'),
        motoristaId: motorista1.id,
      },
      {
        tipo: TipoDocumento.CARTA_CONDUCAO,
        numero: motorista1.numeroCarta,
        validade: motorista1.validadeCarta,
        motoristaId: motorista1.id,
      },
      {
        tipo: TipoDocumento.SEGURO,
        numero: 'AP-INS-98231',
        validade: new Date('2026-12-31'),
        viaturaId: viatura1.id,
      },
      {
        tipo: TipoDocumento.LICENCIAMENTO,
        numero: 'LIC-TX-2026-0042',
        validade: new Date('2026-10-31'),
        viaturaId: viatura1.id,
      },
    ]
  });

  // 8. Criar Manutenção de Teste
  await prisma.manutencao.create({
    data: {
      viaturaId: viatura1.id,
      descricao: 'Mudança de óleo de motor e filtros',
      pecasSubstitu: 'Óleo Toyota 5W30, Filtro de Óleo, Filtro de Ar',
      custo: 35000.0,
      oficina: 'Oficina JK Motors Luanda',
      status: StatusManutencao.CONCLUIDA,
      dataAgendada: new Date('2026-06-01'),
      dataConclusao: new Date('2026-06-01'),
    }
  });

  // 9. Criar Registro de Corrida Histórica
  const corridaHist = await prisma.corrida.create({
    data: {
      clienteId: cliUser.id,
      motoristaId: motorista1.id,
      viaturaId: viatura1.id,
      origem: 'Aeroporto Internacional 4 de Fevereiro',
      destino: 'Talatona Shopping',
      origemLat: -8.8522,
      origemLng: 13.2325,
      destinoLat: -8.9142,
      destinoLng: 13.1812,
      status: StatusCorrida.CONCLUIDA,
      valor: 8500.0,
      distanciaKm: 12.5,
      tempoMin: 28,
      classificacao: 5,
      comentarioCli: 'Excelente condução e viatura muito limpa.',
      dataInicio: new Date('2026-07-06T15:00:00Z'),
      dataFim: new Date('2026-07-06T15:28:00Z'),
    }
  });

  // 10. Criar Registro Financeiro
  await prisma.financeiro.createMany({
    data: [
      {
        tipo: TipoTransacao.RECEITA,
        categoria: 'CORRIDA',
        descricao: 'Corrida finalizada #Ref-' + corridaHist.id.substring(0, 8),
        valor: 8500.0,
        motoristaId: motorista1.id,
        corridaId: corridaHist.id,
      },
      {
        tipo: TipoTransacao.DESPESA,
        categoria: 'MANUTENCAO',
        descricao: 'Reparação preventiva de óleo e filtros',
        valor: 35000.0,
        proprietarioId: proprietario.id,
      },
      {
        tipo: TipoTransacao.RECEITA,
        categoria: 'TAXA_COOPERATIVA',
        descricao: 'Comissão de 10% s/ corrida finalizada',
        valor: 850.0,
      }
    ]
  });

  // 11. Criar Penalização Ativa para teste
  await prisma.penalizacao.create({
    data: {
      motoristaId: motorista1.id,
      descricao: 'Atraso injustificado à escala semanal',
      gravidade: 'LEVE',
      pontos: 2,
      ativa: true,
    }
  });

  console.log('Semeadura do banco de dados COTA concluída com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro na semeadura do banco de dados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
