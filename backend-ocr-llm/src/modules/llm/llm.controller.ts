import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { LlmService } from 'src/services/llm.service';

@Controller('llm')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly prisma: PrismaService,
  ) {}
  @Post('ask')
  async askLlm(
    @Body() { question, ocrId }: { question: string; ocrId: number },
  ) {
    const ocr = await this.prisma.ocrResult.findUnique({
      where: { id: ocrId },
    });
    if (!ocr) {
      throw new NotFoundException('OCR result not found');
    }

    const response = await this.llmService.generateText(
      ocr.text + '\n' + question,
    );
    return { response };
  }
}
