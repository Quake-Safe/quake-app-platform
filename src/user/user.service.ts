import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async user(input: Prisma.UserWhereInput): Promise<User | null> {
    return this.db.user.findFirst({
      where: input,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    return await this.db.user.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async createOne(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({
      data,
    });
  }
}
