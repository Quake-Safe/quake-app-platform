import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { UserModule } from 'src/user/user.module';
import { UserProfileService } from './user-profile.service';

@Module({
  imports: [UserModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
