import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { AiModule } from 'src/ai/ai.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [AiModule, CategoriesModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
