import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';

const config = ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: joi.object({
    DATABASE_URL: joi.string().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    PORT: joi.number().default(3000),
    JWT_SECRET: joi.string().required(),
  }),
  validationOptions: {
    abortEarly: true,
  },
});
@Module({
  imports: [config, UserModule],
  providers: [],
})
export class AppModule {}
