import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Branch, BranchDocument } from '../schema/branch.schema';
import { Model } from 'mongoose';
import * as ModelDel from 'mongoose-delete'
import { BranchCreateDto } from '../dto/create-branch.dto';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class BranchService {
    constructor(
        @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @InjectModel(Branch.name) private branchModelDel: ModelDel<BranchDocument>,
    ) {}

    async create(branchCreateDto: BranchCreateDto) {
        const dup = await this.branchModel.findOne({ name: branchCreateDto.name })
        if (dup) throw new HttpException('ชื่อสาขาซ้ำกับในระบบ', HttpStatus.BAD_REQUEST);
        const branch = await this.branchModel.create(branchCreateDto);
        return await branch.save();
    }

    async update(branch_id, branchUpdateDto) {
        return await this.branchModel.updateOne({ _id: branch_id }, branchUpdateDto)
    }

    async remove(branch_id) {
        const branch = await this.branchModelDel.findById(branch_id).exec();
        if (!branch) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return await branch.delete();
    }

    async findOne(branch_id) {
        const branch = await this.branchModel.findById(branch_id);
        return branch;
    }

    async findAll(page: number, limit: number, query: string) {
        const [total, items] = await Promise.all([
            this.branchModel
              .countDocuments()
              .exec(),
            this.branchModel
              .find()
              .populate('manager')
              .sort({ createdAt: -1 })
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

    async findAll2() {
        return await this.branchModel.find().populate('manager')
    }

    async getBranchByManager(user_id) {
        const user = await this.userService.findOne(user_id)
        if (user.role == 'admin') {
            return await this.branchModel.find().populate('manager')
        } else {
            return await this.branchModel.find({manager: user_id}).populate('manager')
        } 
    }
}
