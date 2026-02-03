import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  async create(data: CreateUserDto) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new Error('Email đã tồn tại');

    // Mã hóa mật khẩu
    const saltRounds = 10; // Độ phức tạp của mã hóa
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Lưu vào Database với mật khẩu đã mã hóa
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
}
