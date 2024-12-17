import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from 'src/services/ocr.service';
import { Multer } from 'multer';
import { PrismaService } from 'src/services/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ocr')
export class OcrController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Multer.File,
    @Request() req,
  ): Promise<any> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const uploadedFile = await this.prisma.uploadedFile.create({
      data: {
        filename: file.originalname,
        filepath: file.path,
        userId: userId,
      },
    });

    const text = await this.ocrService.processImage(file.path);
    const ocr = await this.prisma.ocrResult.create({
      data: {
        text,
        fileId: uploadedFile.id,
      },
    });

    return { ocrText: text, ocrId: ocr.id };
  }

  @Get('view')
  @UseGuards(AuthGuard('jwt'))
  async viewUploadedDocuments(@Request() req) {

    const userId = req.user?.userId;

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const uploadedDocuments = await this.prisma.uploadedFile.findMany({
      where: {
        userId: userId,
      },
      include: {
        ocrResults: {
          include: {
            llmResults: true,
          },
        },
      },
    });

    if (!uploadedDocuments || uploadedDocuments.length === 0) {
      throw new NotFoundException('No uploaded documents found');
    }

    return uploadedDocuments.map((document) => ({
      id: document.id,
      filename: document.filename,
      filepath: document.filepath,
      ocrResults: document.ocrResults.map((ocr) => ({
        text: ocr.text,
        createdAt: ocr.createdAt,
        llmResults: ocr.llmResults.map((llm) => ({
          question: llm.question,
          response: llm.response,
          createdAt: llm.createdAt,
        })),
      })),
    }));
  }

  @Get('view/:id')
  @UseGuards(AuthGuard('jwt'))
  async viewUploadedDocumentById(@Param('id') id: string, @Request() req) {
    const userId = req.user?.userId;

    if (!userId) {
      throw new NotFoundException('User not found');
    }
    
    const documentId = parseInt(id, 10);

    if (isNaN(documentId)) {
      throw new NotFoundException('ID inválido');
    }

    const document = await this.prisma.uploadedFile.findUnique({
      where: {
        id: documentId,
        userId: userId,
      },
      include: {
        ocrResults: {
          include: {
            llmResults: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    return {
      id: document.id,
      filename: document.filename,
      filepath: document.filepath,
      ocrResults: document.ocrResults.map((ocr) => ({
        text: ocr.text,
        createdAt: ocr.createdAt,
        llmResults: ocr.llmResults.map((llm) => ({
          question: llm.question,
          response: llm.response,
          createdAt: llm.createdAt,
        })),
      })),
    };
  }
}