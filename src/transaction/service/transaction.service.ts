import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from '../schema/transaction.schema';
import { Model } from 'mongoose';
import * as ModelDel from 'mongoose-delete'
import { TransactionDto } from '../dto/request-transaction.dto';
import { InventoryService } from 'src/inventory/service/inventory.service';
import { InventoryDto } from 'src/inventory/dto/create-inventory.dto';
import { UserService } from 'src/user/service/user.service';
import { Role } from 'src/utils/role.enum';
import { BranchService } from 'src/branch/service/branch.service';
import { TransactionGateway } from 'src/ws/transaction.gateway';
import * as Moment from 'moment'
import { DriverHistory, DriverHistoryDocument } from '../schema/driver-history.schema';
import { ProductService } from 'src/product/service/product.service';
@Injectable()
export class TransactionService {

    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        @InjectModel(Transaction.name) private transactionModelDel: ModelDel<TransactionDocument>,
        @InjectModel(DriverHistory.name) private driverHistoryModel: Model<DriverHistoryDocument>,
        @Inject(forwardRef(() => InventoryService))
        private readonly inventoryService: InventoryService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => BranchService))
        private readonly branchService: BranchService,
        @Inject(forwardRef(() => TransactionGateway))
        private readonly transactionWs: TransactionGateway,
        @Inject(forwardRef(() => ProductService))
        private readonly productService: ProductService,
    ) {}

    async request(dto: TransactionDto) {
        await this.transactionWs.sendMessage('request');
        const transaction = await this.transactionModel.create(dto);
        return await transaction.save();
    }

    async approveRequest(id: string, status: string, user_updated) {
        try {
            if (status == 'Success') {
                const transaction = await this.transactionModel.findOne({ _id: id })
                const {product, amount, branch} = transaction;
                const payload = {
                    product, amount, branch
                }
                const user = await this.userService.findOne(user_updated)
                if (user.role == Role.Driver) {
                    await this.userService.increaseOrder(user_updated)
                    await this.addHistoryDriver(id, user_updated);
                }
                await this.inventoryService.addStock(payload)
            } else if (status == 'In progress') await this.transactionWs.sendMessage('approve')
            return await this.transactionModel.updateOne({ _id: id }, { status: status, user_updated: user_updated })
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async cancelRequest(id, user_updated) {
        await this.transactionWs.sendMessage('cancel');
        return  await this.transactionModel.updateOne({ _id: id }, { status: 'Cancel', user_updated: user_updated })
    }

    async getTransactionByManagerOfBranch(branch_id) {
        const request = await this.transactionModel.find({branch: branch_id}).exec();
        if (!request) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return request;
    }

    //admin
    async getWaitingTransaction() {
        const inv = await this.transactionModel.find({ status: 'Waiting' }).populate('product').populate('branch').populate('user_created').sort({createdAt: -1})
        return inv
    }

    async getProgressTransaction() {
        const inv = await this.transactionModel.find({ status: 'In progress' }).populate('product').populate('branch').populate('user_created').populate('user_updated').sort({createdAt: -1})
        return inv
    }

    async getSuccessTransaction() {
        const inv = await this.transactionModel.find({ status: 'Success' }).populate('product').populate('branch').populate('user_created').populate('user_updated').sort({createdAt: -1})
        return inv
    }

    //manager
    async getAllTransaction(user_id) {
        const my_branch = await this.branchService.getBranchByManager(user_id);
        let data = []
        for (let item of my_branch) {
            const transaction = await this.transactionModel.find({branch: item._id}).populate('product').populate('branch').populate('user_created').populate('user_updated')
            for (let index = 0; index < transaction.length; index++) {
                data.push(transaction[index])
            }
        }
        return data.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
    }

    //driver history
    async addHistoryDriver(transaction_id, user_id) {
        const transaction = await this.transactionModel.findById(transaction_id)
        const now = Moment()
        const duration = Moment.duration(now.diff(transaction['createdAt']));
        const hours = duration.hours();
        const minutes = duration.minutes();
        
        let hours_txt
        let minutes_txt

        if (hours < 10) {
            hours_txt = `0${hours}`
        }
        if (minutes < 10) {
            minutes_txt = `0${minutes}`
        }

        let obj = new DriverHistory();
        obj.time = `${hours_txt}:${minutes_txt}`
        obj.transaction = transaction_id
        obj.user = user_id
        obj.end_time = now.toDate();
        await this.driverHistoryModel.create(obj);
    }

    async getDriverHistory(user_id) {
        let his = await this.driverHistoryModel.find({ user: user_id }).populate('transaction').sort({ createdAt: -1 })
        for (let index = 0; index < his.length; index++) {
            const product = await this.productService.findOne(his[index].transaction.product)
            const branch = await this.branchService.findOne(his[index].transaction.branch)
            his[index].transaction.product = product;
            his[index].transaction.branch = branch;
        }
        return his;
    }
    
}
