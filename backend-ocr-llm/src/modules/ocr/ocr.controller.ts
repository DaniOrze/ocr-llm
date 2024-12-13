import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
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

    console.log("aqui", file.path); 
    console.log("Tipo do arquivo:", file.mimetype);


    const uploadedFile = await this.prisma.uploadedFile.create({
      data: {
        filename: file.originalname,
        filepath: file.path,
      },
    });

    console.log("wsse", uploadedFile)

    const text = await this.ocrService.processImage(file.path);
    const ocr = await this.prisma.ocrResult.create({
      data: {
        text,
        fileId: uploadedFile.id,
      },
    });

    return { ocrText: text, ocrId: ocr.id };
  }
}
