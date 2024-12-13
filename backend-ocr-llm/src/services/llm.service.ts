import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class LlmService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
  
      if (!response.choices?.length) {
        throw new Error('Nenhuma resposta recebida do LLM.');
      }
  
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao chamar LLM:', error);
      throw new InternalServerErrorException('Erro ao gerar resposta do LLM.');
    }
  }
  
}
