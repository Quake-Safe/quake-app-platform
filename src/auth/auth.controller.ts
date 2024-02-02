import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthService } from './auth.service';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { ApiOkResponseCommon } from 'src/common/decorators/api-ok-response-decorator';
import { AuthLoginResponseDto } from './dtos/auth-login-response.dto';
import { AuthRegisterResponseDto } from './dtos/auth-register-response.dto';
import { AuthRegisterDto } from './dtos/auth-register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: AuthLoginDto })
  @ApiOkResponseCommon(AuthLoginResponseDto)
  @Post('/login')
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<ApiResponseDto<AuthLoginResponseDto>> {
    try {
      const { email, password } = authLoginDto;
      const { session } = await this.authService.login(email, password);
      return ApiResponseDto.success({
        accessToken: session.access_token,
      });
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }

  @Post('/register')
  async register(
    @Body() authRegisterDto: AuthRegisterDto,
  ): Promise<ApiResponseDto<AuthRegisterResponseDto>> {
    try {
      const { email, password, username, role } = authRegisterDto;
      const { session } = await this.authService.register(email, password, {
        username,
        role,
      });

      return ApiResponseDto.success({
        accessToken: session.access_token,
      });
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }
}
