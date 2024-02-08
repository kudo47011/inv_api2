import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Branch } from 'src/branch/schema/branch.schema';
import { Product } from 'src/product/schema/user.schema';

export class InventoryDto {
  @ApiProperty()
  @IsNotEmpty()
  product: Product;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  branch: Branch;
}