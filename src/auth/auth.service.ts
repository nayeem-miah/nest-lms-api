import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';


@Injectable()
export class AuthService {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private UserModule: Model<User>
  ) { }

  async login(createAuthDto: CreateAuthDto) {
    const user = await this.UserModule.findOne({ email: createAuthDto.email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(createAuthDto.password, user.password as string);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    // device limit
    await this.UserService.addDevice(user._id.toString(), createAuthDto.deviceId);


    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      deviceId: createAuthDto.deviceId
    };


    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: configuration().jwt.refreshTokenSecret
      })
    };
  }


  async logout(userId: string, deviceId: string) {

    await this.UserService.removeDevice(userId, deviceId);
    return { message: 'Logged out successfully' };
  }


  // * google login implement
  async googleLogin(googleUser: any) {
    const { email, name, profilePhoto } = googleUser;


    let user = await this.UserModule.findOne({ email });

    if (!user) {
      user = await this.UserModule.create({
        email,
        name,
        profilePhoto
      });
    }


    // device limit
    await this.UserService.addDevice(user._id.toString(), googleUser.deviceId);

    const payload = {
      sub: user?._id.toString(),
      email: user?.email,
      role: user?.role,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

}
