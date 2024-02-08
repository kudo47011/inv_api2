import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BranchCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  lat: string;

  @ApiProperty()
  @IsNotEmpty()
  lng: string;

  @ApiProperty()
  @IsNotEmpty()
  manager: string;

  @ApiProperty()
  @IsNotEmpty()
  user_create: string;
}