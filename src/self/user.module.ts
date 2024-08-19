import { Module } from '@nestjs/common';
import { SelfService } from './user.service';
import { SelfController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SelfService],
  controllers: [SelfController],
})
export class SelfModule {}
