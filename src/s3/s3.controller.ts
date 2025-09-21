import { Controller, Get, Query } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Get('presigned-url')
  async getUrl(
    @Query('fileName') fileName: string,
    @Query('contentType') contentType: string,
  ) {
    const key = `posters/${Date.now()}-${fileName}`;
    const url = await this.s3Service.getPresignedUrl(key, contentType);
    return { url, key };
  }
}
