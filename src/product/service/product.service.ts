import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import * as ModelDel from 'mongoose-delete'
import { ProductCreateDto } from '../dto/create-product.dto';
import { ProductUpdateDto } from '../dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Product.name) private productModelDel: ModelDel<ProductDocument>
    ) {}

    async create(productCreateDto: ProductCreateDto) {
        try {
            const pdt = await this.productModel.create(productCreateDto)
            return pdt.save();
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async update(id: string, productUpdateDto: ProductUpdateDto) {
        return await this.productModel.updateOne({ _id: id }, productUpdateDto)
    }

    async remove(id: string) {
        const product = await this.productModelDel.findById(id).exec();
        if (!product) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return await product.delete();
    } 

    async findOne(id) {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return product;
    }

    async findAll() {
        return await this.productModel.find().populate('user_created');
    }
}
