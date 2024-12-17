import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmService } from './services/llm.service';
import { OcrService } from './services/ocr.service';
import { PrismaService } from './services/prisma.service';
import { OcrModule } from './modules/ocr/ocr.module';
import { LlmModule } from './modules/llm/llm.module';
import { AuthService } from './services/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './modules/auth/jwt.strategy';

@Module({
  imports: [OcrModule, LlmModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, OcrService, LlmService, AuthService, JwtService, JwtStrategy],
})
export class AppModule {}
