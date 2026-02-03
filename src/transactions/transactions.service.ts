import { Injectable } from '@nestjs/common';
import {
  categoryTransactionType,
  PrismaClient,
  TransactionType,
} from '@prisma/client';

@Injectable()
export class TransactionsService {
  private prisma = new PrismaClient();

  // Hàm lấy tất cả giao dịch của 1 người dùng
  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  // Hàm tạo giao dịch mới
  async create(data: {
    amount: number;
    type: TransactionType;
    category: categoryTransactionType;
    note?: string;
    userId: string;
  }) {
    return this.prisma.transaction.create({
      data: data,
    });
  }
}
