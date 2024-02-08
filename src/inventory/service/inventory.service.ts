import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory, InventoryDocument } from '../schema/inventory.schema';
import { Model } from 'mongoose';
import * as ModelDel from 'mongoose-delete'
import { InventoryDto } from '../dto/create-inventory.dto';

@Injectable()
export class InventoryService {

    constructor(
        @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
        @InjectModel(Inventory.name) private inventoryModelDel: ModelDel<InventoryDocument>
    ) {}

    async addStock(dto: InventoryDto) {
        const chk = await this.inventoryModel.findOne({product: dto.product, branch: dto.branch})
        if (chk) {
            return await this.inventoryModel.updateOne({_id: chk._id}, { amount: chk.amount + dto.amount })
        }
    }

    async editStock(id: string, amount: number) {
        return await this.inventoryModel.updateOne({_id: id}, { amount: amount })
    }

    async getStockByBranch(page: number, limit: number, branch_id: string) {
        const [total, items] = await Promise.all([
            this.inventoryModel
              .countDocuments({branch: branch_id})
              .exec(),
            this.inventoryModel
              .find({branch: branch_id})
              .populate('branch')
              .populate('product')
              .sort({ amount: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .exec(),
          ]);
      
          return {
            items,
            total: total,
            page,
            last_page: Math.ceil(total / limit),
          };
    }
}
