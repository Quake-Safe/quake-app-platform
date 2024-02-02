import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileUpdateDto {
  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  middleName?: string;

  @ApiPropertyOptional()
  fullName?: string;

  @ApiPropertyOptional()
  shortName?: string;
}
