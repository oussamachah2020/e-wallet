import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('wallets')
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createWallet(
    @Body() createWalletDto: CreateWalletDto,
    @CurrentUser('id') id: string,
  ) {
    return this.walletsService.createWallet({ ...createWalletDto }, id);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchWallet(@Query('accountNumber') accountNumber: string) {
    return this.walletsService.searchWallet(accountNumber);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getWalletByUserId(@CurrentUser('id') id: string) {
    return this.walletsService.getWalletByUserId(id);
  }

  @Get('user/balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@CurrentUser('id') id: string) {
    return this.walletsService.getBalance(id);
  }
}
