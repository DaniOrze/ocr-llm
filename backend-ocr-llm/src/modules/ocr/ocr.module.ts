import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { OcrController } from './ocr.controller';
import { OcrService } from 'src/services/ocr.service';
import { PrismaService } from 'src/services/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
  ],
  controllers: [OcrController],
  providers: [OcrService, PrismaService, JwtStrategy, JwtAuthGuard],
})
export class OcrModule {}
