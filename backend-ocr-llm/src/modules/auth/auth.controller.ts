import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
  Res,
} from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { PrismaService } from '../../services/prisma.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      !(await this.authService.comparePasswords(password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.authService.signToken(payload);

    res.cookie('token', token, {
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });    

    return res.send({ message: 'Login bem-sucedido!', token });
  }

  @Post('signin')
  async signin(
    @Body() { email, password }: { email: string; password: string },
    @Res() res: Response,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.authService.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const payload = { sub: user.id, email: user.email };
    const token = await this.authService.signToken(payload);

    res.cookie('token', token, {
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return res.send({ message: 'Usuário registrado com sucesso!' });
  }
}
