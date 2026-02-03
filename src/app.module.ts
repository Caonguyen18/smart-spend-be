import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AiService } from './ai/ai.service';

@Module({
  imports: [TransactionsModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, AiService],
})
export class AppModule {}
