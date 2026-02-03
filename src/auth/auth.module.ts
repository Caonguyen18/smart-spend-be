import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' }, // Token có hiệu lực trong 1 ngày
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
