import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';
import { UserRole } from './user.types';
import cloudinary from 'src/config/cloudinary.config';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  async create(createUserDto: CreateUserDto) {
    const exitsUser = await this.userModel.findOne({ email: createUserDto.email });

    if (exitsUser) {
      throw new BadRequestException('User already exists with this email');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password as string, configuration().bcrypt.saltRounds);

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

  async me(_id: string) {
    return await this.userModel.findById({ _id });
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async updateProfile(
    userId: string,
    payload: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (payload.name) {
      user.name = payload.name;
    }

    if (file && file.path) {
      if (user.profilePhoto) {
        try {
          const publicId = user.profilePhoto
            .split('/')
            .slice(-2)
            .join('/')
            .split('.')[0];

          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      user.profilePhoto = file.path;
    }

    await user.save();
    return user;
  }


  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  };

  async addDevice(userId: string, deviceId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.devices.includes(deviceId)) {
      return user;
    }

    //  max 3 devices rule
    if (user.devices.length >= 3) {
      throw new ForbiddenException(
        'Maximum 3 devices allowed. Please logout from another device.',
      );
    }

    user.devices.push(deviceId);
    await user.save();

    return user;
  }

  async removeDevice(userId: string, deviceId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.devices = user.devices.filter(
      (id) => id !== deviceId,
    );

    await user.save();

    return {
      success: true,
      message: 'Device logged out successfully',
    };
  }


  async seedAdmin(createUserDto: CreateUserDto) {

    const exitsUser = await this.userModel.findOne({ email: createUserDto.email });

    if (exitsUser) {
      throw new BadRequestException('User already exists with this email');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password as string, configuration().bcrypt.saltRounds);

    createUserDto.password = hashPassword;
    createUserDto.role = UserRole.ADMIN;

    return await this.userModel.create(createUserDto);
  }
}
