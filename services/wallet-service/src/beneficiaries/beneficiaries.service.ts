import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Beneficiary } from './entities/beneficiary.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';
import { AddBeneficiaryDto } from './dto/add-beneficiary.dto';

@Injectable()
export class BeneficiariesService {
  constructor(
    @InjectRepository(Beneficiary)
    private beneficiaryRepository: Repository<Beneficiary>,

    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async addBeneficiary(
    userId: string,
    addBeneficiaryDto: AddBeneficiaryDto,
  ): Promise<Beneficiary> {
    // Verify recipient wallet exists
    const recipientWallet = await this.walletRepository.findOne({
      where: { accountNumber: addBeneficiaryDto.accountNumber },
    });

    if (!recipientWallet) {
      throw new NotFoundException('Recipient account not found');
    }

    // Prevent adding own wallet as beneficiary
    const ownWallet = await this.walletRepository.findOne({
      where: { userId },
    });

    if (
      ownWallet &&
      ownWallet.accountNumber === addBeneficiaryDto.accountNumber
    ) {
      throw new BadRequestException('Cannot add yourself as beneficiary');
    }

    // Check if already saved
    const existing = await this.beneficiaryRepository.findOne({
      where: {
        userId,
        accountNumber: addBeneficiaryDto.accountNumber,
      },
    });

    if (existing) {
      throw new ConflictException('Beneficiary already saved');
    }

    // Create beneficiary
    const beneficiary = this.beneficiaryRepository.create({
      userId,
      recipientUserId: recipientWallet.userId,
      accountNumber: addBeneficiaryDto.accountNumber,
    });

    return await this.beneficiaryRepository.save(beneficiary);
  }

  async getBeneficiaries(userId: string): Promise<Beneficiary[]> {
    return await this.beneficiaryRepository.find({
      where: { userId },
      order: {
        lastTransactionAt: 'DESC', // Then by recent usage
        createdAt: 'DESC', // Then by creation date
      },
    });
  }

  async searchBeneficiaries(
    userId: string,
    query: string,
  ): Promise<Beneficiary[]> {
    return await this.beneficiaryRepository
      .createQueryBuilder('beneficiary')
      .where('beneficiary.user_id = :userId', { userId })
      .andWhere(
        '(beneficiary.nickname ILIKE :query OR beneficiary.account_number LIKE :query)',
        { query: `%${query}%` },
      )
      .addOrderBy('beneficiary.last_transaction_at', 'DESC')
      .getMany();
  }

  async getBeneficiaryById(
    userId: string,
    beneficiaryId: string,
  ): Promise<Beneficiary> {
    const beneficiary = await this.beneficiaryRepository.findOne({
      where: { id: beneficiaryId, userId },
    });

    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }

    return beneficiary;
  }

  async updateBeneficiary(
    userId: string,
    beneficiaryId: string,
    updateDto: UpdateBeneficiaryDto,
  ): Promise<Beneficiary> {
    const beneficiary = await this.getBeneficiaryById(userId, beneficiaryId);

    if (updateDto.nickname !== undefined) {
      beneficiary.nickname = updateDto.nickname;
    }

    return await this.beneficiaryRepository.save(beneficiary);
  }

  async removeBeneficiary(
    userId: string,
    beneficiaryId: string,
  ): Promise<void> {
    const beneficiary = await this.getBeneficiaryById(userId, beneficiaryId);
    await this.beneficiaryRepository.remove(beneficiary);
  }

  async updateLastTransactionDate(
    userId: string,
    toUserId: string,
  ): Promise<void> {
    const toWallet = await this.walletRepository.findOne({
      where: { userId: toUserId },
    });

    await this.beneficiaryRepository.update(
      { userId, accountNumber: toWallet?.accountNumber },
      { lastTransactionAt: new Date() },
    );
  }
}
