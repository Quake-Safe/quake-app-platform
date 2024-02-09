import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    description: 'The status of the response.',
  })
  status: string;
  @ApiProperty({
    description: 'The message of the response.',
  })
  message: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'The data of the response.',
  })
  data: T | null;

  constructor(status: string, message: string, data: T | null) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = 'Success'): ApiResponseDto<T> {
    return new ApiResponseDto<T>('success', message, data);
  }

  static error<T>(message = 'Error', data: T | null = null): ApiResponseDto<T> {
    return new ApiResponseDto<T>('error', message, data);
  }
}
