import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmService } from './services/llm.service';
import { OcrService } from './services/ocr.service';
import { PrismaService } from './services/prisma.service';
import { OcrModule } from './modules/ocr/ocr.module';
import { LlmModule } from './modules/llm/llm.module';

@Module({
  imports: [OcrModule, LlmModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, OcrService, LlmService],
})
export class AppModule {}
