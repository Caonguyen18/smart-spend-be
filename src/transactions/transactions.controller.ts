import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getTransactions(@Query('userId') userId: string) {
    return this.transactionsService.findAll(userId);
  }

  @Post()
  async createTransaction(
    @Body() createDto: CreateTransactionDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.transactionsService.create({ ...createDto, userId: userId });
  }

  @Post('ai-extract')
  async aiExtract(@Body() description: string, @Req() _req: any) {
    return this.aiService.extractTransactionFromText(description);
  }
}
