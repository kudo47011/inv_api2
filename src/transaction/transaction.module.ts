import { Module } from '@nestjs/common';
import { TransactionController } from './controller/transaction.controller';
import { TransactionService } from './service/transaction.service';
import { UserModule } from 'src/user/user.module';
import { BranchModule } from 'src/branch/branch.module';
import { ProductModule } from 'src/product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { InventoryModule } from 'src/inventory/inventory.module';
import { WsModule } from 'src/ws/ws.module';
import { DriverHistory, DriverHistorySchema } from './schema/driver-history.schema';

@Module({
  imports: [
    UserModule,
    BranchModule,
    ProductModule,
    InventoryModule,
    WsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Transaction.name,
        useFactory: () => {
          const schema = TransactionSchema;
          schema.plugin(require('mongoose-delete'), {
            overrideMethods: true,
          });
          return schema;
        },
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: DriverHistory.name,
        useFactory: () => {
          const schema = DriverHistorySchema;
          schema.plugin(require('mongoose-delete'), {
            overrideMethods: true,
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
