import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { OcrController } from './ocr.controller';
import { OcrService } from 'src/services/ocr.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [OcrController],
  providers: [OcrService, PrismaService],
})
export class OcrModule {}
