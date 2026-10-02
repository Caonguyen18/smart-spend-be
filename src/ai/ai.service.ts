import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { TransactionType, categoryTransactionType } from '@prisma/client';

export interface ExtractedTransaction {
  amount: number;
  type: TransactionType;
  category: categoryTransactionType;
  note: string;
}

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async extractTransactionFromText(
    description: string,
  ): Promise<ExtractedTransaction> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Phân tích mô tả giao dịch sau và trích xuất thông tin: "${description}"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: {
                type: Type.NUMBER,
                description: 'Số tiền của giao dịch (VNĐ)',
              },
              type: {
                type: Type.STRING,
                enum: [TransactionType.INCOME, TransactionType.EXPENSE],
                description:
                  'Loại giao dịch: EXPENSE (chi tiêu) hoặc INCOME (thu nhập)',
              },
              category: {
                type: Type.STRING,
                enum: [
                  categoryTransactionType.FOOD,
                  categoryTransactionType.TRAVEL,
                  categoryTransactionType.SALARY,
                ],
                description: 'Danh mục giao dịch',
              },
              note: {
                type: Type.STRING,
                description: 'Ghi chú ngắn gọn về giao dịch',
              },
            },
            required: ['amount', 'type', 'category', 'note'],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new InternalServerErrorException(
          'Không nhận được phản hồi từ AI',
        );
      }

      return JSON.parse(text) as ExtractedTransaction;
    } catch (error) {
      throw new InternalServerErrorException(
        `Lỗi khi phân tích giao dịch bằng AI: ${(error as Error).message}`,
      );
    }
  }
}
