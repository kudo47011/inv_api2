import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BranchUpdateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  lat: string;

  @ApiProperty()
  lng: string;

  @ApiProperty()
  manager: string;

  @ApiProperty()
  user_update: string;
}