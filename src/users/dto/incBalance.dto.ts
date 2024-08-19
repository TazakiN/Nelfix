import { IsNotEmpty, IsNumber } from 'class-validator';

export class incBalanceDTO {
  @IsNotEmpty()
  @IsNumber()
  increment: number;
}
