import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../services/auth/auth.service';
import { PrismaService } from '../../services/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7 days' },
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard]
})
export class AuthModule {}
