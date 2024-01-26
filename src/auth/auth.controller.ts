import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthService } from './auth.service';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { User } from '@supabase/supabase-js';
import { ApiOkResponseCommon } from 'src/common/decorators/api-ok-response-decorator';
import { AuthUserDto } from './dtos/auth-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: AuthLoginDto })
  @ApiOkResponseCommon(AuthUserDto)
  @Post('/login')
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<ApiResponseDto<User | null>> {
    try {
      const { email, password } = authLoginDto;
      const user = await this.authService.login(email, password);

      return ApiResponseDto.success(user);
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }
}
