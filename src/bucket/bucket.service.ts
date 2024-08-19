import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class BucketService {
  private client: S3Client;

  constructor(private configService: ConfigService) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get<string>('ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('SECRET_ACCESS_KEY'),
      },
    });
  }

  async getObject(folder: string, key: string): Promise<StreamableFile> {
    try {
      const fullKey = `${folder}/${key}`;
      const command = new GetObjectCommand({
        Bucket: 'tahap3-labpro',
        Key: fullKey,
      });

      const response = await this.client.send(command);

      if (response.Body instanceof Readable) {
        const stream = response.Body as Readable;

        return new StreamableFile(stream, {
          type: response.ContentType,
        });
      }

      throw new Error('Unable to stream file from S3');
    } catch (error) {
      console.error('Error fetching object from S3:', error);
      throw error;
    }
  }

  async putObject(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: 'tahap3-labpro',
        Key: key,
        Body: body,
        ContentType: contentType,
      });

      await this.client.send(command);

      return key;
    } catch (error) {
      console.error('Error uploading object to S3:', error.message);
      throw error;
    }
  }

  async deleteObject(folder: string, key: string): Promise<void> {
    try {
      const fullKey = `${folder}/${key}`;
      const command = new DeleteObjectCommand({
        Bucket: 'tahap3-labpro',
        Key: fullKey,
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error deleting object from S3:', error.message);
      throw error;
    }
  }
}
