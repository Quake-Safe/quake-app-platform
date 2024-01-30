import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Media } from '@prisma/client';

export class PostMediaDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty()
  publicUrl: string;

  @ApiProperty({
    type: 'string',
    enum: $Enums.MediaType,
  })
  type: $Enums.MediaType;

  public static fromMedia(media: Media) {
    const dto = new PostMediaDto();
    dto.id = media.id;
    dto.createdAt = media.createdAt;
    dto.updatedAt = media.updatedAt;
    dto.deletedAt = media.deletedAt;
    dto.publicUrl = media.publicUrl;
    dto.type = media.type;

    return dto;
  }
}
