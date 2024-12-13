import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from 'src/services/llm.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [LlmController],
  providers: [LlmService, PrismaService],
})
export class LlmModule {}
