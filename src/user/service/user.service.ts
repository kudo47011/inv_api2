import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import * as ModelDel from 'mongoose-delete'
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from '../dto/create-user.dto';
import { Role } from 'src/utils/role.enum';
import { UserUpdateDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(User.name) private userModelDel: ModelDel<UserDocument>,
    ) {
        this.initialUser();
    }

    async initialUser() {
        const admin = await this.userModel.findOne({username: 'admin'})
        if (!admin) {
            const dto = {
                firstname: 'admin',
                lastname: 'admin',
                username: 'admin',
                password: '123456',
                role: Role.Admin
            }
            this.create(dto)
        }
    }

    async create(createUserDto: UserCreateDto) {
        try {
            const dup_username = await this.userModel.findOne({username: createUserDto.username});
            if (dup_username) throw new HttpException('Username ซ้ำกับในระบบ', HttpStatus.BAD_REQUEST);
            createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
            const user = await this.userModel.create(createUserDto);
            return await user.save();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(user_id, updateUserDto: UserUpdateDto) {
        try {
            return await this.userModel.updateOne({ _id: user_id }, updateUserDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async increaseOrder(user_id) {
        try {
            const user = await this.userModel.findById(user_id);
            return await this.userModel.updateOne({ _id: user_id }, {order: user.order + 1});
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async newPassword(user_id: string, new_pass: string) {
        try {
            const bcrypt_pass = await bcrypt.hash(new_pass, 10);
            return await this.userModel.updateOne(
                { _id: user_id },
                { $set: { password: bcrypt_pass } },
            );
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: string) {
        const user = await this.userModelDel.findById(id).exec();
        if (!user) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return await user.delete();
    }

    async findAll(page: number, limit: number, query: string) {
        const [total, items] = await Promise.all([
            this.userModel
              .countDocuments({
                $or: [
                  { lastname: new RegExp(query, 'i') },
                  { firstname: new RegExp(query, 'i') },
                ],
              })
              .exec(),
            this.userModel
              .find({
                $or: [
                  { lastname: new RegExp(query, 'i') },
                  { firstname: new RegExp(query, 'i') },
                ],
              })
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean()
              .exec(),
          ]);

          console.log(page);
          console.log(limit);
          
      
          return {
            items,
            total: total,
            page,
            last_page: Math.ceil(total / limit),
          };
    }

    async findToSelectManager() {
        return await this.userModel.find({role: Role.Manager});
    }

    async findAllNotAdmin() {
        return await this.userModel.find({role: { $ne: Role.Admin } });
    }

    async findByUsername(username): Promise<User> {
        return await this.userModel.findOne({username: username}).exec();
    }

    async findOne(id) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new HttpException('Not found', HttpStatus.NOT_FOUND);
            }
            return user
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
