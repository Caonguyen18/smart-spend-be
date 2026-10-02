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
import { AiService } from 'src/ai/ai.service';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly aiService: AiService,
  ) {}

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
  async aiExtract(@Body('description') description: string, @Req() req: any) {
    const userId = req.user.sub;
    const extracted =
      await this.aiService.extractTransactionFromText(description);
    return this.transactionsService.create({ ...extracted, userId: userId });
  }
}
