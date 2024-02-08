import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './utils/multer.config';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/user.schema';

@Module({
  imports: [
    MulterModule.register(multerConfig),
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Product.name,
        useFactory: () => {
          const schema = ProductSchema;
          schema.plugin(require('mongoose-delete'), {
            overrideMethods: true,
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
