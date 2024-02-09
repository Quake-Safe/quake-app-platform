import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false, type: 'number', default: 1 })
  @IsInt()
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ required: false, type: 'number', default: 10 })
  @IsInt()
  @Type(() => Number)
  limit: number = 10;
}
