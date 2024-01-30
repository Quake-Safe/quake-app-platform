import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { CommonModule } from 'src/common/common.module';

/**
 * This class will handle the media module.
 *
 * Which will be used to handle the media files.
 */
@Module({
  imports: [CommonModule],
  exports: [MediaService],
  providers: [MediaService],
})
export class MediaModule {}
