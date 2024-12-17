import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from '../../services/llm.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [LlmController],
  providers: [LlmService, PrismaService],
})
export class LlmModule {}
