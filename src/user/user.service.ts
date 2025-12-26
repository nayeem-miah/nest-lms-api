import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';
import { UserRole } from './user.types';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  async create(createUserDto: CreateUserDto) {
    const exitsUser = await this.userModel.findOne({ email: createUserDto.email });

    if (exitsUser) {
      throw new BadRequestException('User already exists with this email');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, configuration().bcrypt.saltRounds);

    const user = await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashPassword,
      role: createUserDto.role ?? UserRole.STUDENT,
      isActive: true,
      devices: [],
    });

    return user;
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  // ! task file upload update user
  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
