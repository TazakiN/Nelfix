import { IsNotEmpty, IsString } from 'class-validator';

export class idUserDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
