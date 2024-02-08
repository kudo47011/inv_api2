import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  product: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  @IsNotEmpty()
  branch: string;

  @ApiProperty()
  user_created: string;

  @ApiProperty({ default: 'Waiting' })
  status: string;
}