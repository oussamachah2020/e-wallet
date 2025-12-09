import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('beneficiaries')
@Index(['userId', 'accountNumber'], { unique: true }) // User can't save same recipient twice
export class Beneficiary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string; // Who saved this beneficiary

  @Column({ name: 'recipient_user_id', type: 'uuid' })
  recipientUserId: string; // Recipient user ID

  @Column({ name: 'account_number', length: 10 })
  @Index()
  accountNumber: string; // Recipient's account number

  @Column({ nullable: true })
  nickname: string; // Custom name: "Mom", "Landlord", "John"

  @Column({ name: 'last_transaction_at', nullable: true })
  lastTransactionAt: Date; // Track when last used

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
