import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../auth/decorators/current-user.decorator';
import { AddBeneficiaryDto } from './dto/add-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';

@Controller('beneficiaries')
@UseGuards(JwtAuthGuard)
export class BeneficiariesController {
  constructor(private beneficiariesService: BeneficiariesService) {}

  @Post('add')
  async addBeneficiary(
    @CurrentUser() user: CurrentUserPayload,
    @Body() addBeneficiaryDto: AddBeneficiaryDto,
  ) {
    return this.beneficiariesService.addBeneficiary(user.id, addBeneficiaryDto);
  }

  @Get()
  async getBeneficiaries(@CurrentUser() user: CurrentUserPayload) {
    return this.beneficiariesService.getBeneficiaries(user.id);
  }

  @Get('search')
  async searchBeneficiaries(
    @CurrentUser() user: CurrentUserPayload,
    @Query('q') query: string,
  ) {
    return this.beneficiariesService.searchBeneficiaries(user.id, query);
  }

  @Get(':id')
  async getBeneficiaryById(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') beneficiaryId: string,
  ) {
    return this.beneficiariesService.getBeneficiaryById(user.id, beneficiaryId);
  }

  @Patch(':id')
  async updateBeneficiary(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') beneficiaryId: string,
    @Body() updateDto: UpdateBeneficiaryDto,
  ) {
    return this.beneficiariesService.updateBeneficiary(
      user.id,
      beneficiaryId,
      updateDto,
    );
  }

  @Delete('remove/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBeneficiary(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') beneficiaryId: string,
  ) {
    await this.beneficiariesService.removeBeneficiary(user.id, beneficiaryId);
  }
}
