import { Module } from '@nestjs/common';
import { BranchService } from './service/branch.service';
import { BranchController } from './controller/branch.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './schema/branch.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Branch.name,
        useFactory: () => {
          const schema = BranchSchema;
          schema.plugin(require('mongoose-delete'), {
            overrideMethods: true,
          });
          return schema;
        },
      },
    ]),
  ],
  providers: [BranchService],
  controllers: [BranchController]
})
export class BranchModule {}
