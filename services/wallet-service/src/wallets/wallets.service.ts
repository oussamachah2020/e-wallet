import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wallet, WalletStatus } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async createWallet(
    createWalletDto: CreateWalletDto,
    userId: string,
  ): Promise<Wallet> {
    const existingWallet = await this.walletRepository.findOne({
      where: { userId: userId },
    });

    if (existingWallet) {
      throw new ConflictException('User already has a wallet');
    }

    const wallet = this.walletRepository.create({
      userId,
      currency: createWalletDto.currency || 'USD',
      balance: 0,
      status: WalletStatus.ACTIVE,
    });

    return await this.walletRepository.save(wallet);
  }

  async getWalletByUserId(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });

    if (!wallet) {
      throw new NotFoundException('Wallet not found for the given user ID');
    }

    return wallet;
  }

  async validateWalletStatus(walletId: string): Promise<void> {
    const wallet = await this.getWalletByUserId(walletId);

    if (wallet.status !== WalletStatus.ACTIVE) {
      throw new BadRequestException(`Wallet is ${wallet.status}`);
    }
  }

  async getBalance(
    userId: string,
  ): Promise<{ balance: number; currency: string }> {
    const wallet = await this.getWalletByUserId(userId);

    return {
      balance: Number(wallet.balance), // Convert from Decimal
      currency: wallet.currency,
    };
  }
}
