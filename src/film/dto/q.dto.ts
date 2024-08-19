import { IsNotEmpty, IsString } from 'class-validator';

export class queryDTO {
  @IsString()
  @IsNotEmpty()
  q: string;
}
