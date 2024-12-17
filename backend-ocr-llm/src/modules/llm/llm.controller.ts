import { Controller, Post, Body, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { LlmService } from '../../services/llm.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('llm')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('ask')
  @UseGuards(AuthGuard('jwt'))
  async askLlm(
    @Body() { question, ocrId }: { question: string; ocrId: number },
    @Request() req
  ) {
    const userId = req.user?.userId;

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const ocr = await this.prisma.ocrResult.findUnique({
      where: { id: ocrId },
    });
    if (!ocr) {
      throw new NotFoundException('OCR result not found');
    }

    const response = await this.llmService.generateText(
      ocr.text + '\n' + question,
    );

    const llmResult = await this.prisma.llmResult.create({
      data: {
        ocrId: ocr.id,
        question: question,
        response: response,
      },
    });

    return { response, llmResultId: llmResult.id };
  }

  @Post('explain')
  @UseGuards(AuthGuard('jwt'))
  async explainOcrText(@Body() { ocrId }: { ocrId: number }, @Request() req) {
    const userId = req.user?.userId;

    if (!userId) {
      throw new NotFoundException('User not found');
    }
    
    const ocr = await this.prisma.ocrResult.findUnique({
      where: { id: ocrId },
    });
    if (!ocr) {
      throw new NotFoundException('OCR result not found');
    }

    const explanation = await this.llmService.generateText(
      `Explique o seguinte texto:\n\n${ocr.text}`,
    );

    return { explanation };
  }
}
