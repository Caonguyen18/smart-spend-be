import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { categoryTransactionType, TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'Số tiền phải là con số cụ thể' })
  @Min(0, { message: 'Số tiền không được âm' })
  @IsNotEmpty({ message: 'Số tiền không được để trống' })
  amount: number;

  @IsEnum(TransactionType, {
    message: 'Sai kiểu của giao dịch',
  })
  @IsNotEmpty()
  type: TransactionType;

  @IsEnum(categoryTransactionType, {
    message: 'Sai kiểu danh mục của giao dịch',
  })
  @IsNotEmpty()
  category: categoryTransactionType;

  @IsString()
  @IsOptional()
  note?: string;
}
