import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.user({
      email: email,
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
