import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { FundWalletDto } from '../wallets/dto/fund-wallet.dto';
import { TransferMoneyDto } from '../wallets/dto/transfer-money.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('fund')
  @UseGuards(JwtAuthGuard)
  async fundWallet(
    @CurrentUser('id') id: string,
    @Body() fundWalletDto: FundWalletDto,
  ) {
    return this.transactionsService.fundWallet(id, fundWalletDto);
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  async transferMoney(
    @CurrentUser('id') id: string,
    @Body() transferDto: TransferMoneyDto,
  ) {
    return this.transactionsService.transferMoney(id, transferDto);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getTransactionHistory(@CurrentUser('id') id: string) {
    return this.transactionsService.getTransactionHistory(id);
  }

  @Get('reference/:reference')
  @UseGuards(JwtAuthGuard)
  async getTransactionByReference(@Param('reference') reference: string) {
    return this.transactionsService.getTransactionByReference(reference);
  }
}
