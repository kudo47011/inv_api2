import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
} from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  query: string;

  time_query: {
    start: Date;
    end: Date;
  };
}