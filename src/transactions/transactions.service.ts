import { Injectable } from '@nestjs/common';
import { categoryTransactionType, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // Hàm lấy tất cả giao dịch của 1 người dùng
  async findAll(userId: string) {
    return await this.prisma.transaction.findMany({
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
    return await this.prisma.transaction.create({
      data: data,
    });
  }
}
