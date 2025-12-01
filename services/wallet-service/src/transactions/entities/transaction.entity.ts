import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TransactionType {
  CREDIT = 'credit', // Money in (funding)
  DEBIT = 'debit', // Money out (withdrawal)
  TRANSFER = 'transfer', // P2P transfer
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_wallet_id', type: 'uuid', nullable: true })
  fromWalletId: string;

  @ManyToOne(() => Wallet, (waller) => waller.sentTransactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'from_wallet_id' })
  fromWallet: Wallet;

  @Column({ name: 'to_wallet_id', type: 'uuid', nullable: true })
  toWalletId: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.receivedTransactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'to_wallet_id' })
  toWallet: Wallet;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  // Unique reference for idempotency
  @Column({ unique: true })
  @Index()
  reference: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Extra data (JSON)
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;
}
