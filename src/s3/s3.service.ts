import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.s3 = new S3({
      region: this.config.get('AWS_REGION'),
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      signatureVersion: 'v4',
    });
    this.bucket = this.config.get('AWS_S3_BUCKET') as string;
  }

  async getPresignedUrl(key: string, contentType: string): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: 60,
      ContentType: contentType,
    };
    return this.s3.getSignedUrlPromise('putObject', params);
  }
}
