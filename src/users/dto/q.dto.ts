import { IsString } from 'class-validator';

export class searchUserDTO {
  @IsString()
  q: string = '';
}
