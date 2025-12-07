import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController - Critical Tests', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    refreshAccessToken: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('should call login service', async () => {
    mockAuthService.login.mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
    });

    const mockRes = { cookie: jest.fn() } as any;

    await controller.login(
      { email: 'test@test.com', password: 'pass' },
      mockRes,
    );

    expect(service.login).toHaveBeenCalled();
  });
});
