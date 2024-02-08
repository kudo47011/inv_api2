import { Module } from '@nestjs/common';
import { InventoryService } from './service/inventory.service';
import { InventoryController } from './controller/inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schema/inventory.schema';
import { BranchModule } from 'src/branch/branch.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    BranchModule,
    ProductModule,
    MongooseModule.forFeatureAsync([
      {
        name: Inventory.name,
        useFactory: () => {
          const schema = InventorySchema;
          schema.plugin(require('mongoose-delete'), {
            overrideMethods: true,
          });
          return schema;
        },
      },
    ]),
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService]
})
export class InventoryModule {}
