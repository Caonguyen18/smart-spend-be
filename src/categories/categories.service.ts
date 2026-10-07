import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Tạo danh mục mới cho user
  async create(userId: string, dto: CreateCategoryDto) {
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }
    }

    return await this.prisma.category.create({
      data: {
        name: dto.name,
        icon: dto.icon,
        parentId: dto.parentId,
        userId: userId,
      },
    });
  }

  // Lấy toàn bộ danh mục khả dụng (danh mục mặc định hệ thống + danh mục riêng của user)
  async findAll(userId: string) {
    return await this.prisma.category.findMany({
      where: {
        OR: [{ userId: null }, { userId: userId }],
      },
      include: {
        children: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Lấy chi tiết một danh mục
  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
        OR: [{ userId: null }, { userId: userId }],
      },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return category;
  }

  // Tìm danh mục theo tên hoặc tự động tạo nếu chưa có (dùng cho AI trích xuất)
  async findOrCreate(name: string, userId: string) {
    let category = await this.prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        OR: [{ userId: null }, { userId }],
      },
    });

    if (!category) {
      category = await this.prisma.category.create({
        data: {
          name,
          userId,
        },
      });
    }

    return category;
  }

  // Cập nhật danh mục của user
  async update(id: string, userId: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(
        'Không tìm thấy danh mục hoặc bạn không có quyền sửa',
      );
    }

    return await this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  // Xóa danh mục của user
  async remove(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(
        'Không tìm thấy danh mục hoặc bạn không có quyền xóa',
      );
    }

    // Kiểm tra xem có giao dịch nào đang dùng danh mục này không
    const transactionCount = await this.prisma.transaction.count({
      where: { categoryId: id },
    });

    if (transactionCount > 0) {
      throw new BadRequestException(
        'Không thể xóa danh mục đang có giao dịch liên kết',
      );
    }

    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
