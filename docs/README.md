# COTA ERP — Cooperativa de Gestão de Táxis JK
### Plataforma Corporativa Completa de Logística, Frotas, Finanças e PWAs

Esta é a especificação arquitetônica e repositório de base oficial para o **COTA ERP**, um sistema completo e resiliente projetado especificamente para a administração de cooperativas de transporte urbano e frotas de táxi, integrando donos de viaturas, motoristas, operadores e clientes finais.

---

## 1. Arquitetura de Software e Diretórios

O projeto utiliza um design orientado a domínios (DDD) com separação modular e portabilidade de PWAs:

```
├── apps/                        # Portais PWAs Autônomos (Código & Layout)
│   ├── admin/                   # Painel Administrativo Geral ERP
│   ├── motorista/               # PWA do Condutor (Status, Corridas e Ganhos)
│   ├── proprietario/            # PWA do Dono da Frota (Finanças e Despesas)
│   └── cliente/                 # PWA do Passageiro (Chamados e Rotas)
├── backend/                     # API Server NestJS (TypeScript + PostgreSQL)
│   ├── src/
│   │   ├── auth/                # Controle de Sessão, RBAC e Tokens JWT
│   │   ├── corrida/             # Despachador de Corridas e WebSockets (Socket.IO)
│   │   └── prisma.service.ts    # Conexão com Banco de Dados
│   └── Dockerfile               # Imagem Docker de Produção do Servidor
├── database/                    # Modelagem de Dados
│   ├── schema.prisma            # Schema do Prisma ORM para PostgreSQL
│   └── seed.ts                  # Semeadura automática de dados iniciais
└── docker-compose.yml           # Orquestração do PostgreSQL, Redis e NestJS
```

---

## 2. Tecnologias Utilizadas

### Core Frontend (PWAs):
- **React 19** e **Vite** para compilação estática ultra-veloz.
- **Tailwind CSS** para design corporativo responsivo.
- **Lucide React** para iconografia.
- **Axios** para consumo da API REST com interceptors JWT.
- **Recharts** para análise gráfica do fluxo de caixa e telemetria.

### Core Backend (Microserviço):
- **NestJS** (TypeScript) estruturado sob SOLID.
- **Prisma ORM** para manipulação robusta de dados relacionais.
- **PostgreSQL** para persistência e ACID de transações financeiras.
- **Socket.IO** para despacho instantâneo de viagens e GPS Logs.
- **Redis** para cache de sessões e controle de filas de despacho.

### Roteamento e Mapas (100% Google-Free):
- **OpenStreetMap** (Mapas base de Luanda, Angola).
- **MapLibre GL JS** para renderização vetorial no Canvas.
- **Nominatim** para pesquisa e preenchimento automático de endereços de origem e destino.

---

## 3. Rodando o Projeto Localmente via Docker

Para subir todo o ecossistema (PostgreSQL + Redis + NestJS Backend) com um único comando:

```bash
# Copiar arquivo de variáveis de ambiente
cp .env.example .env

# Executar os containers em background
docker compose up -d --build
```

### Comandos de Inicialização do Banco de Dados:

```bash
# Executar migrations do Prisma para estruturar o PostgreSQL
npx prisma migrate dev --name init_cota_erp

# Executar script de seed para popular os dados de teste
npx prisma db seed
```

---

## 4. Endpoints Principais da API REST (Swagger)

A documentação interativa Swagger estará disponível em: `http://localhost:4000/api/docs`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/registrar` | Registra Proprietários, Motoristas ou Clientes |
| `POST` | `/api/auth/login` | Emite JWT Access Token e Refresh Token |
| `GET` | `/api/dashboard/stats` | Retorna as receitas, despesas e frotas ativas |
| `GET` | `/api/viaturas` | Retorna o inventário completo da frota |
| `POST` | `/api/corridas` | Solicita uma nova viagem (dispara canal Socket.IO) |
| `POST` | `/api/manutencoes` | Abre uma nova Ordem de Serviço na oficina |

---

## 5. Relações do Banco de Dados (Prisma)

- **Proprietário (1:N) Viaturas**: Um proprietário pode investir e cooperar com diversos veículos na frota.
- **Motorista (1:1) Viatura**: Escalas garantem que um táxi seja operado por um único motorista credenciado por turno.
- **Viatura (1:N) Manutenções**: Acompanhamento rigoroso de faturas e peças substituídas de cada carro.
- **Viatura (1:N) GpsLogs**: Logs de telemetria gravando posições e velocidades simuladas no trânsito de Luanda.
