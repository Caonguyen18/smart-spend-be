import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private categoriesService: CategoriesService,
  ) {}

  // Hàm lấy tất cả giao dịch của 1 người dùng
  async findAll(userId: string) {
    return await this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
        item: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Hàm tạo giao dịch mới
  async create(data: {
    amount: number;
    type: TransactionType;
    categoryId: string;
    note?: string;
    userId: string;
  }) {
    return await this.prisma.transaction.create({
      data: {
        amount: data.amount,
        type: data.type,
        categoryId: data.categoryId,
        note: data.note,
        userId: data.userId,
      },
      include: {
        category: true,
      },
    });
  }

  // Tái sử dụng logic từ CategoriesService
  async findOrCreateCategory(name: string, userId: string) {
    return await this.categoriesService.findOrCreate(name, userId);
  }
}
