// backend/src/auth/dto/auth.dto.ts
// COTA - NestJS Auth DTOs

import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PerfilEnum {
  ADMINISTRADOR = 'ADMINISTRADOR',
  OPERADOR = 'OPERADOR',
  MOTORISTA = 'MOTORISTA',
  PROPRIETARIO = 'PROPRIETARIO',
  CLIENTE = 'CLIENTE',
}

export class LoginDto {
  @ApiProperty({ example: 'admin@cota.coop' })
  @IsEmail({}, { message: 'Formato de email inválido' })
  email: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;
}

export class RegistroDto {
  @ApiProperty({ example: 'Manuel Silva' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'manuel@cota.coop' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha_segura_123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @ApiProperty({ enum: PerfilEnum, example: 'MOTORISTA' })
  @IsEnum(PerfilEnum, { message: 'Perfil de usuário inválido' })
  perfil: PerfilEnum;

  @ApiProperty({ example: '540192038', required: false })
  @IsOptional()
  @IsString()
  nif?: string;

  @ApiProperty({ example: '+244923123456', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  // Campos específicos para motoristas
  @ApiProperty({ example: 'LD-90823-C', required: false })
  @IsOptional()
  @IsString()
  numeroCarta?: string;

  @ApiProperty({ example: '2028-12-31', required: false })
  @IsOptional()
  @IsString()
  validadeCarta?: string;

  @ApiProperty({ example: '009827361LA044', required: false })
  @IsOptional()
  @IsString()
  bi?: string;
}
