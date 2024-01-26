import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async createOne(input: Prisma.UserProfileCreateInput) {
    return this.db.userProfile.create({
      data: input,
    });
  }

  async findOne(where: Prisma.UserProfileWhereUniqueInput) {
    return this.db.userProfile.findUnique({
      where,
    });
  }
}
