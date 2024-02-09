import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputDto } from './paginated-output.dto';

export class ApiPaginatedResponseDto<T> {
  @ApiProperty({
    description: 'The status of the response.',
  })
  status: string;
  @ApiProperty({
    description: 'The message of the response.',
  })
  message: string;

  @ApiProperty({
    type: 'array',
    description: 'The paginated data of the response.',
  })
  data: T[] | null;

  @ApiProperty({
    description: 'The meta of the response.',
  })
  meta: PaginatedOutputDto<T>['meta'] | null;

  constructor(
    status: string,
    message: string,
    data: T[] | null,
    meta: PaginatedOutputDto<T>['meta'] | null,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static success<T>(
    data: T[],
    meta: PaginatedOutputDto<T>['meta'],
    message = 'Success',
  ): ApiPaginatedResponseDto<T> {
    return new ApiPaginatedResponseDto<T>('success', message, data, meta);
  }

  static error<T>(
    message = 'Error',
    data: T[] | null = null,
    meta: PaginatedOutputDto<T>['meta'] | null = null,
  ): ApiPaginatedResponseDto<T> {
    return new ApiPaginatedResponseDto<T>('error', message, data, meta);
  }
}
