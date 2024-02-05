import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { PostModule } from './post/post.module';
import { MediaModule } from './media/media.module';
import { PostCommentModule } from './post-comment/post-comment.module';

const config = ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: joi.object({
    DATABASE_URL: joi.string().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    PORT: joi.number().default(3000),
    SUPABASE_KEY: joi.string().required(),
    SUPABASE_URL: joi.string().required(),
    SUPABASE_JWT_SECRET: joi.string().required(),
  }),
  validationOptions: {
    abortEarly: true,
  },
});
@Module({
  imports: [
    config,
    UserModule,
    AuthModule,
    UserProfileModule,
    PostModule,
    MediaModule,
    PostCommentModule,
  ],
})
export class AppModule {}
