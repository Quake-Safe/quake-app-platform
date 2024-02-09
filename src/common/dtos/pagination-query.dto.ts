import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({ required: false, type: 'number', default: 1 })
  page: number;
  @ApiProperty({ required: false, type: 'number', default: 10 })
  limit: number;
}
