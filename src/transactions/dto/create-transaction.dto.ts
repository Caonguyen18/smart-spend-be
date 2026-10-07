import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'Số tiền phải là con số cụ thể' })
  @Min(0, { message: 'Số tiền không được âm' })
  @IsNotEmpty({ message: 'Số tiền không được để trống' })
  amount: number;

  @IsEnum(TransactionType, { message: 'Kiểu giao dịch không hợp lệ' })
  @IsNotEmpty({ message: 'Kiểu giao dịch không được để trống' })
  type: TransactionType;

  @IsString()
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  categoryId: string;

  @IsString()
  @IsOptional()
  note?: string;
}
