// backend/src/app.module.ts
// COTA - NestJS Core Module

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'cota_super_secret_jwt_key_angola_2026',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    PrismaService,
    AuthService,
  ],
})
export class AppModule {}
