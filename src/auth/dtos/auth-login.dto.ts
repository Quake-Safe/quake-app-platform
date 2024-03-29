import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    default: 'email@email.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password',
    default: 'password',
  })
  password: string;
}
