import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from '../schema/transaction.schema';
import { Model } from 'mongoose';
import * as ModelDel from 'mongoose-delete'
import { TransactionDto } from '../dto/request-transaction.dto';
import { InventoryService } from 'src/inventory/service/inventory.service';
import { InventoryDto } from 'src/inventory/dto/create-inventory.dto';

@Injectable()
export class TransactionService {

    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        @InjectModel(Transaction.name) private transactionModelDel: ModelDel<TransactionDocument>,
        @Inject(forwardRef(() => InventoryService))
        private readonly inventoryService: InventoryService,
    ) {}

    async request(dto: TransactionDto) {
        const transaction = await this.transactionModel.create(dto);
        return await transaction.save();
    }

    async approveRequest(id: string, status: string) {
        if (status == 'Success') {
            const transaction = await this.transactionModel.findOne({ _id: id })
            const {product, amount, branch} = transaction;
            const payload = {
                product, amount, branch
            }
            await this.inventoryService.addStock(payload)
        }
        return await this.transactionModel.updateOne({ _id: id }, { status: status })
    }

    async getTransactionByManagerOfBranch() {

    }

    async getWaitingTransaction() {

    }

    async getProgressTransaction() {

    }

    async getSuccessTransaction() {

    }
}
