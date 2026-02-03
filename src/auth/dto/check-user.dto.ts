import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CheckUserDto {
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  @IsEmail({}, { message: 'Định dạng Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @IsString()
  password: string;
}
