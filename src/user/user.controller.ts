import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { sendResponse } from 'src/common/utils/sendResponse';
import type { Response } from 'express';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
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
}
