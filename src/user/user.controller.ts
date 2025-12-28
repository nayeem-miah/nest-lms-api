import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req, Request, UseInterceptors, UploadedFile, FileTypeValidator, ParseFilePipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { sendResponse } from 'src/common/utils/sendResponse';
import type { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './user.types';
import { RolesGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from 'src/common/utils/cloudinary.storage';
import configuration from 'src/config/configuration';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response
  ) {
    const result = await this.userService.create(createUserDto);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'User created successfully',
      data: result
    })

  }


  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.userService.findAll();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Users fetched successfully',
      data: result
    })
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Request() req, @Res() res: Response) {
    const { sub } = req.user;
    const user = await this.userService.me(sub);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User fetched successfully',
      data: user
    })
  }


  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userService.findOne(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User fetched successfully',
      data: result
    })
  }

  @Patch('update-profile')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      storage: cloudinaryStorage,
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )

  async updateProfile(
    @Req() req: any,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const user = await this.userService.updateProfile(
      req.user.sub,
      body,
      file,
    );

    return sendResponse(req.res, {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: user
    });
  }


  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userService.remove(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User deleted successfully',
      data: result
    })
  }

  @Post('/seed-admin')
  async seedAdmins(@Res() res: Response) {
    const email = configuration().admin.email as string;
    const password = configuration().admin.password as string;
    const role = UserRole.ADMIN;
    const name = 'Admin';

    const dto = { email, password, role, name };

    const result = await this.userService.seedAdmin(dto);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admins seeded successfully',
      data: result
    })
  }

  @Patch('/update-status/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(@Param('id') id: string, @Res() res: Response, @Req() req: any) {
    const result = await this.userService.updateStatus(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User role updated successfully',
      data: result
    })
  }


  @Patch('/update-role/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateRole(@Param('id') id: string, @Res() res: Response, @Req() req: any) {
    const result = await this.userService.updateRole(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User role updated successfully',
      data: result
    })
  }
}
