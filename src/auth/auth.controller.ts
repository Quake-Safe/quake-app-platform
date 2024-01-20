import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dtos/auth-login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: AuthLoginDto })
  @Post('/login')
  async login(@Request() req: any) {
    console.log('Request from Login: ', req.user);
    return req.user;
  }
}
