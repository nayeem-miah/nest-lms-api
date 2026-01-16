import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { CoursesService } from './course.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/enums/user.types';
import { courseThumbnailStorage } from 'src/common/utils/cloudinary.storage';
import { sendResponse } from 'src/common/utils/sendResponse';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: courseThumbnailStorage,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body('data') data: string, createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Res() res
  ) {

    try {
      createCourseDto = JSON.parse(data);
    } catch {
      throw new BadRequestException('Invalid JSON format');
    }

    const result = await this.coursesService.create(createCourseDto, req.user.sub, file);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Course created successfully',
      data: result
    })
  }


  @Get()
  async findAll(@Query() queryDto: QueryCourseDto, @Res() res: any) {
    const result = await this.coursesService.findAll(queryDto);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Courses fetched successfully',
      data: result?.data,
      meta: result?.meta
    })
  }

  @Get('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllCoursesByAdmin(@Query() queryDto: QueryCourseDto, @Res() res: any) {
    const result = await this.coursesService.findAllCoursesByAdmin(queryDto);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Courses fetched successfully',
      data: result?.data,
      meta: result?.meta
    })
  }


  @Get('my-courses')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async findMyCourses(@Request() req, @Query() queryDto: QueryCourseDto, @Res() res: any) {
    const result = await this.coursesService.findInstructorCourses(
      req.user.sub,
      queryDto,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'My courses fetched successfully',
      data: result?.data,
      meta: result?.meta

    })
  }


  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: any) {
    const result = await this.coursesService.findOne(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Course fetched successfully',
      data: result
    })
  }


  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: courseThumbnailStorage,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body('data') data: string, updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Res() res
  ) {
    try {
      updateCourseDto = JSON.parse(data);
    } catch (err) {
      throw new BadRequestException('Invalid JSON format');
    }
    const result = await this.coursesService.update(
      id,
      updateCourseDto,
      req.user.sub,
      req.user.role,
      file,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Course updated successfully',
      data: result
    })
  }


  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async remove(@Param('id') id: string, @Request() req, @Res() res: any) {
    const result = await this.coursesService.remove(id, req.user.sub, req.user.role);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Course deleted successfully',
      data: result
    })
  }


  @Patch(':id/toggle-publish')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async togglePublish(@Param('id') id: string, @Request() req, @Res() res: any) {
    const result = await this.coursesService.togglePublish(
      id,
      req.user.sub,
      req.user.role,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.isPublished
        ? 'Course published successfully'
        : 'Course unpublished successfully',
      data: result
    })
  }
}