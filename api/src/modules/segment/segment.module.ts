import { Module } from '@nestjs/common';
import { BobtailConfigModule } from '@module-config';
import { SegmentService } from './services/segment.service';
import { AWSModule } from '@module-aws';
import { SegmentCredentialsService, segmentServiceProvider } from './services';

@Module({
  imports: [BobtailConfigModule, AWSModule],
  providers: [
    SegmentService,
    segmentServiceProvider,
    SegmentCredentialsService,
  ],
  exports: [SegmentService],
})
export class SegmentModule {}
