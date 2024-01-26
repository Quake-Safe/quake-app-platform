import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}
}
