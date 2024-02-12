import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory, InventoryDocument } from '../schema/inventory.schema';
import { Model } from 'mongoose';
import * as ModelDel from 'mongoose-delete'
import { InventoryDto } from '../dto/create-inventory.dto';
import * as Moment from 'moment';
import { Summary, SummaryDocument } from '../schema/summay.schema';
import { Role } from 'src/utils/role.enum';
import { UserService } from 'src/user/service/user.service';
import { TransactionGateway } from 'src/ws/transaction.gateway';
import { BranchService } from 'src/branch/service/branch.service';

@Injectable()
export class InventoryService {

    constructor(
        @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
        @InjectModel(Inventory.name) private inventoryModelDel: ModelDel<InventoryDocument>,
        @InjectModel(Summary.name) private summaryModel: Model<SummaryDocument>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => TransactionGateway))
        private readonly transactionWs: TransactionGateway,
        @Inject(forwardRef(() => BranchService))
        private readonly branchService: BranchService,
    ) {}

    async addStock(dto: InventoryDto) {
        const chk = await this.inventoryModel.findOne({product: dto.product, branch: dto.branch})
        if (chk) {
            await this.inventoryModel.updateOne({_id: chk._id}, { amount: chk.amount + dto.amount })
        } else {
            const stock = await this.inventoryModel.create(dto);
            await stock.save();
        }
        await this.stockSummary(dto.amount, dto.branch)
        await this.transactionWs.sendMessage('add');
    }

    async stockSummary(amount, branch) {
        const { start, end } = await this.getDay();
        const has_sum = await this.summaryModel.findOne({
            data_of_date: { $gte: start.toDate(), $lte: end.toDate() }, branch: branch
        });

        if (has_sum) {
            has_sum.amount = has_sum.amount + amount;
            await has_sum.save();
        } else {
            let obj = new Summary();
            obj.amount = amount;
            obj.branch = branch;
            obj.data_of_date = start.toDate();
            await this.summaryModel.create(obj);
        }
    }

    async getDay() {
        const start = Moment().startOf('day');
        const end = Moment().endOf('day');
    
        return {
          start,
          end,
        };
      }

    async editStock(id: string, amount: number) {
        return await this.inventoryModel.updateOne({_id: id}, { amount: amount })
    }

    async getStockByBranch(branch_id: string) {
        return await this.inventoryModel
              .find({branch: branch_id})
              .populate('branch')
              .populate('product')
              .sort({ amount: -1 })
    }

    async getAllStock() {
        return await this.inventoryModel
              .find()
              .populate('branch')
              .populate('product')
              .sort({ amount: -1 })
    }

    async getDataReport(user_id) {
        let date_list = [];
        for (let index = 0; index < 7; index++) {
          date_list.push({ data_of_date: Moment().subtract(index, 'days').startOf('day').toDate(), branch: [] });
        }

        const user = await this.userService.findOne(user_id);
        if (user.role == Role.Admin) {
            let summary = await this.summaryModel.find({
                data_of_date: {
                  $gte: date_list[6].data_of_date,
                },
            }).sort({ data_of_date: 1 }).populate('branch')

            for (let index = 0; index < summary.length; index++) {
                const branch = await this.branchService.findOne(summary[index].branch)
                if (!branch) {
                    summary[index]['isRemove'] = true;
                }
            }

            for (let index = 0; index < summary.length; index++) {
                if (summary[index]['isRemove']) {
                    delete summary[index]
                }
            }

            summary = summary.reduce((acc, value) => {
                if (value !== null) {
                  acc.push(value);
                }
                return acc;
              }, []);
    
            for (let index = 0; index < date_list.length; index++) {
                for (let item of summary) {
                    if (Moment(date_list[index].data_of_date).isSame(item.data_of_date, 'day')) {
                        date_list[index].branch.push(item)
                    }
                }
            }
            for (let index = 0; index < date_list.length; index++) {
                date_list[index].data_of_date = Moment(date_list[index].data_of_date).format('YYYY-MM-DD')
            }
            return date_list.sort((a, b) => Moment(a.data_of_date).valueOf() - Moment(b.data_of_date).valueOf());;
        } else {

        }
    }
}
