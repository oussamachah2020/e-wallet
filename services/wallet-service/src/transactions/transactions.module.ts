import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeneficiariesModule } from 'src/beneficiaries/beneficiaries.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Wallet]),
    BeneficiariesModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
