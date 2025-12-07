import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { hashSync, compare } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(RefreshToken)
    private tokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<{ message: string }> {
    if (!data) {
      throw new BadRequestException('Invalid registration data');
    }

    const existingUser = await this.userRepository.findOneBy({
      email: data.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = hashSync(data.password, 10);

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return {
      message: 'Account created successfully !',
    };
  }

  async login(
    credentials: LoginDto,
    res: Response,
  ): Promise<{ accessToken: string }> {
    if (!credentials) {
      throw new BadRequestException('Missing credentials');
    }

    const foundUser = await this.userRepository.findOneBy({
      email: credentials.email,
    });

    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatching = await compare(
      credentials.password,
      foundUser.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(foundUser);
    const refreshToken = await this.generateRefreshToken(foundUser);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return {
      accessToken,
    };
  }

  async logout(token: string) {
    if (!token) {
      throw new BadRequestException('Missing refresh token');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const result = await this.tokenRepository.delete({ token: hashedToken });

    if (result.affected === 0) {
      throw new BadRequestException('Invalid refresh token');
    }

    return { message: 'Logged out successfully' };
  }

  async refreshAccessToken(token: string, res: Response) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const storedToken = await this.tokenRepository.findOne({
      where: { token: hashedToken },
      relations: ['user'],
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > storedToken.expiresAt) {
      await this.tokenRepository.remove(storedToken);
      throw new UnauthorizedException('Refresh token has expired');
    }

    const accessToken = await this.generateAccessToken(storedToken.user);

    const newToken = crypto.randomBytes(40).toString('hex');
    const hashedNewToken = crypto
      .createHash('sha256')
      .update(newToken)
      .digest('hex');

    storedToken.token = hashedNewToken;
    storedToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.tokenRepository.save(storedToken);

    res.cookie('refreshToken', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return {
      accessToken,
    };
  }

  async logoutAllDevices(userId: string) {
    await this.tokenRepository.delete({ userId });

    return { message: 'Logged out from all devices' };
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id, email: user.email });
  }

  async generateRefreshToken(user: User): Promise<string> {
    const token = crypto.randomBytes(40).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const existingToken = await this.tokenRepository.findOneBy({
      userId: user.id,
    });

    if (!existingToken) {
      await this.tokenRepository.save({
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    return token;
  }
}
