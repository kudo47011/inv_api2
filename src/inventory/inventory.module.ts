import { Module } from '@nestjs/common';
import { InventoryService } from './service/inventory.service';
import { InventoryController } from './controller/inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schema/inventory.schema';
import { BranchModule } from 'src/branch/branch.module';
import { ProductModule } from 'src/product/product.module';
import { Summary, SummarySchema } from './schema/summay.schema';
import { UserModule } from 'src/user/user.module';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [
    BranchModule,
    ProductModule,
    UserModule,
    WsModule,
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
    MongooseModule.forFeatureAsync([
      {
        name: Summary.name,
        useFactory: () => {
          const schema = SummarySchema;
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
