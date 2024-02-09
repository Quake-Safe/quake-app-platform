import { ApiProperty } from '@nestjs/swagger';

export class PaginatedOutputDto<T> {
  @ApiProperty({
    type: 'array',
    items: { type: 'object' },
  })
  data: T[];
  @ApiProperty({
    type: 'object',
    properties: {
      total: { type: 'number' },
      lastPage: { type: 'number' },
      currentPage: { type: 'number' },
      perPage: { type: 'number' },
      prev: { type: 'number', nullable: true },
      next: { type: 'number', nullable: true },
    },
  })
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };

  constructor(
    data: T[],
    meta: {
      total: number;
      lastPage: number;
      currentPage: number;
      perPage: number;
      prev: number | null;
      next: number | null;
    },
  ) {
    this.data = data;
    this.meta = meta;
  }
}
