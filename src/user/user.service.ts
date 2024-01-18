import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

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
}
