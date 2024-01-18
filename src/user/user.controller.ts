import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user-dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOkResponse({
    type: UserDto,
    isArray: true,
    status: 200,
  })
  async getAll(): Promise<UserDto[]> {
    const users = await this.userService.users({});
    return users.map(
      (user) =>
        ({
          email: user.email,
          name: user.name,
        }) satisfies UserDto,
    );
  }
}
