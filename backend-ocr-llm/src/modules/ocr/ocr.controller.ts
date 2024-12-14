import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from 'src/services/ocr.service';
import { Multer } from 'multer';
import { PrismaService } from 'src/services/prisma.service';

@Controller('ocr')
export class OcrController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Multer.File): Promise<any> {

    const uploadedFile = await this.prisma.uploadedFile.create({
      data: {
        filename: file.originalname,
        filepath: file.path,
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
  async viewUploadedDocuments() {
    const uploadedDocuments = await this.prisma.uploadedFile.findMany({
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
  
    return uploadedDocuments.map(document => ({
      id: document.id,
      filename: document.filename,
      filepath: document.filepath,
      ocrResults: document.ocrResults.map(ocr => ({
        text: ocr.text,
        createdAt: ocr.createdAt,
        llmResults: ocr.llmResults.map(llm => ({
          question: llm.question,
          response: llm.response,
          createdAt: llm.createdAt,
        })),
      })),
    }));
  }

  @Get('view/:id')
  async viewUploadedDocumentById(@Param('id') id: string) {
    const documentId = parseInt(id, 10);
  
    if (isNaN(documentId)) {
      throw new NotFoundException('ID inválido');
    }
  
    const document = await this.prisma.uploadedFile.findUnique({
      where: {
        id: documentId,
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
      ocrResults: document.ocrResults.map(ocr => ({
        text: ocr.text,
        createdAt: ocr.createdAt,
        llmResults: ocr.llmResults.map(llm => ({
          question: llm.question,
          response: llm.response,
          createdAt: llm.createdAt,
        })),
      })),
    };
  }
}  