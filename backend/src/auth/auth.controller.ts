// backend/src/auth/auth.controller.ts
// COTA - NestJS Auth Controller

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistroDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registrar')
  @ApiOperation({ summary: 'Registrar um novo usuário na cooperativa' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'E-mail ou documento já cadastrado.' })
  registrar(@Body() registroDto: RegistroDto) {
    return this.authService.registrar(registroDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login e emitir tokens JWT' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar Access Token usando o Refresh Token' })
  @ApiResponse({ status: 200, description: 'Token renovado.' })
  @ApiResponse({ status: 401, description: 'Refresh Token inválido ou expirado.' })
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
