import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import * as path from 'path';
import * as fs from 'fs-extra';

@Injectable()
export class OcrService implements OnModuleInit {
  private wasmSourceDir: string;
  private wasmTargetDir: string;

  onModuleInit() {
    this.wasmSourceDir = path.resolve(
      __dirname,
      '../../public/tesseract.js-core',
    );
    this.wasmTargetDir = path.resolve(
      __dirname,
      '../../node_modules/tesseract.js-core',
    );

    this.ensureWasmDirectory();
  }

  private async ensureWasmDirectory() {
    if (!(await fs.pathExists(this.wasmTargetDir))) {
      console.log('Copying tesseract.js-core directory to target location...');
      await fs.copy(this.wasmSourceDir, this.wasmTargetDir);
      console.log('tesseract.js-core directory successfully copied.');
    } else {
      console.log('tesseract.js-core directory already exists. Skipping copy.');
    }
  }

  async processImage(imagePath: string): Promise<string> {
    const wasmPath = path.join(this.wasmTargetDir, 'tesseract-core-simd.wasm');

    const result = await Tesseract.recognize(imagePath, 'eng', {
      corePath: wasmPath,
      logger: () => {},
    });

    return result.data.text;
  }
}