// backend/src/auth/auth.service.ts
// COTA - NestJS Auth Service

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegistroDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registrar(dto: RegistroDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (usuarioExistente) {
      throw new ConflictException('O email informado já está cadastrado.');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 12);

    const usuario = await this.prisma.usuario.create({
      data: {
        email: dto.email,
        senha: senhaHash,
        nome: dto.nome,
        nif: dto.nif,
        telefone: dto.telefone,
        perfil: dto.perfil,
      },
    });

    // Se for Proprietário ou Motorista, criar a entidade correspondente vazia
    if (dto.perfil === 'PROPRIETARIO') {
      await this.prisma.proprietario.create({
        data: { usuarioId: usuario.id }
      });
    } else if (dto.perfil === 'MOTORISTA') {
      if (!dto.numeroCarta || !dto.validadeCarta) {
        throw new ConflictException('Para motoristas, o número e a validade da carta de condução são obrigatórios.');
      }
      await this.prisma.motorista.create({
        data: {
          usuarioId: usuario.id,
          numeroCarta: dto.numeroCarta,
          validadeCarta: new Date(dto.validadeCarta),
          nif: dto.nif || '',
          bi: dto.bi || '',
        }
      });
    }

    return this.gerarTokens(usuario.id, usuario.email, usuario.perfil);
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!usuario || !(await bcrypt.compare(dto.senha, usuario.senha))) {
      throw new UnauthorizedException('Credenciais inválidas. Verifique seu email e senha.');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Esta conta está inativa. Entre em contato com a administração.');
    }

    return this.gerarTokens(usuario.id, usuario.email, usuario.perfil);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'cota_super_secret_refresh_jwt_key_2026',
      });

      const usuario = await this.prisma.usuario.findUnique({
        where: { id: payload.sub },
      });

      if (!usuario || !usuario.ativo) {
        throw new UnauthorizedException();
      }

      return this.gerarTokens(usuario.id, usuario.email, usuario.perfil);
    } catch {
      throw new UnauthorizedException('Sessão expirada. Faça login novamente.');
    }
  }

  private async gerarTokens(userId: string, email: string, perfil: string) {
    const payload = { sub: userId, email, role: perfil };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET || 'cota_super_secret_jwt_key_angola_2026',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || 'cota_super_secret_refresh_jwt_key_2026',
      }),
    ]);

    return {
      usuario: {
        id: userId,
        email,
        perfil,
      },
      accessToken,
      refreshToken,
    };
  }
}
