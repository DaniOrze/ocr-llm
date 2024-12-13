import { Injectable } from '@nestjs/common';
const Tesseract = require('tesseract.js');

@Injectable()
export class OcrService {
  async processImage(imagePath: string): Promise<string> {
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: () => {},
    });
    return result.data.text;
  }
}
