import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import * as crypto from 'crypto';
import { FundWalletDto } from 'src/wallets/dto/fund-wallet.dto';
import { TransferMoneyDto } from 'src/wallets/dto/transfer-money.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,

    private dataSource: DataSource,
  ) {}

  private generateReference(): string {
    return `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  async fundWallet(
    userId: string,
    fundWalletDto: FundWalletDto,
  ): Promise<Transaction> {
    const wallet = await this.walletRepository.findOne({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (wallet.status !== 'active') {
      throw new BadRequestException('Wallet is not active');
    }

    const reference = this.generateReference();

    return await this.dataSource.transaction(async (manager) => {
      const transaction = manager.create(Transaction, {
        fromWalletId: undefined,
        toWalletId: wallet.id,
        amount: fundWalletDto.amount,
        type: TransactionType.CREDIT,
        status: TransactionStatus.PENDING,
        reference,
        description: fundWalletDto.description || 'Wallet Funding',
      });

      wallet.balance = Number(wallet.balance) + fundWalletDto.amount;

      await manager.save(wallet);

      transaction.status = TransactionStatus.COMPLETED;
      transaction.completedAt = new Date();
      await manager.save(transaction);

      return transaction;
    });
  }

  async transferMoney(
    fromUserId: string,
    transferDto: TransferMoneyDto,
  ): Promise<Transaction> {
    if (fromUserId === transferDto.toUserId) {
      throw new BadRequestException('Cannot transfer money to the same wallet');
    }

    const fromWallet = await this.walletRepository.findOne({
      where: { userId: fromUserId },
    });

    if (!fromWallet) {
      throw new BadRequestException('Sender wallet not found');
    }

    const toWallet = await this.walletRepository.findOne({
      where: { userId: transferDto.toUserId },
    });

    if (!toWallet) {
      throw new BadRequestException('Recipient wallet not found');
    }

    if (fromWallet.status !== 'active' || toWallet.status !== 'active') {
      throw new BadRequestException(
        'Both wallets must be active to perform transfer',
      );
    }

    if (Number(fromWallet.balance) < transferDto.amount) {
      throw new BadRequestException('Insufficient funds in sender wallet');
    }

    const reference = this.generateReference();

    return await this.dataSource.transaction(async (manager) => {
      const lockedFromWallet = await manager.findOne(Wallet, {
        where: { id: fromWallet.id },
        lock: { mode: 'pessimistic_write' },
      });

      const lockedToWallet = await manager.findOne(Wallet, {
        where: { id: toWallet.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (Number(lockedFromWallet?.balance) < transferDto.amount) {
        throw new BadRequestException('Insufficient funds in sender wallet');
      }

      const transaction = manager.create(Transaction, {
        fromWalletId: fromWallet.id,
        toWalletId: toWallet.id,
        amount: transferDto.amount,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.PENDING,
        reference,
        description: transferDto.description || 'Money transfer',
      });

      await manager.save(transaction);

      lockedFromWallet!.balance =
        Number(lockedFromWallet?.balance) - transferDto.amount;
      await manager.save(lockedFromWallet);

      lockedToWallet!.balance =
        Number(lockedToWallet?.balance) + transferDto.amount;
      await manager.save(lockedToWallet);

      transaction.status = TransactionStatus.COMPLETED;
      transaction.completedAt = new Date();
      await manager.save(transaction);

      return transaction;
    });
  }

  async getTransactionHistory(userId: string): Promise<Transaction[]> {
    const wallet = await this.walletRepository.findOne({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    const transactions = await this.transactionRepository.find({
      where: [{ fromWalletId: wallet.id }, { toWalletId: wallet.id }],
      order: { createdAt: 'DESC' },
    });

    return transactions;
  }

  async getTransactionByReference(reference: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { reference },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
