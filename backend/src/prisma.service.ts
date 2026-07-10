// backend/src/prisma.service.ts
// COTA - NestJS Prisma Client integration

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('Conexão estabelecida com o banco de dados PostgreSQL COTA.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
