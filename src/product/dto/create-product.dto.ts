import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProductCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  @IsNotEmpty()
  user_created: string;
}