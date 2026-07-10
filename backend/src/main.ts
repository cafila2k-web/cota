// backend/src/main.ts
// COTA - NestJS Entry Point

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração global de validação dos DTOs via class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Ativar CORS seguro para os PWAs
  app.enableCors({
    origin: '*', // Em produção, definir os domínios permitidos dos PWAs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configurar Swagger para Documentação Oficial da API
  const config = new DocumentBuilder()
    .setTitle('COTA ERP - API Comercial')
    .setDescription('API REST Completa e Infraestrutura Socket.IO de Gestão de Cooperativa de Táxis JK')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`COTA NestJS Backend rodando em: http://localhost:${PORT}`);
  console.log(`Documentação da API Swagger disponível em: http://localhost:${PORT}/api/docs`);
}

bootstrap();
