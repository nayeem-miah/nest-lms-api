import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { UserRole } from 'src/enums/user.types';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private cloudinaryService: CloudinaryService,
  ) { }


  async create(
    createCourseDto: CreateCourseDto,
    instructorId: string,
    file?: Express.Multer.File,
  ) {
    let thumbnailUrl = 'https://via.placeholder.com/1280x720?text=No+Thumbnail';
    let thumbnailPublicId = '';

    if (file) {
      thumbnailUrl = (file as any).path;
      thumbnailPublicId = (file as any).filename;
    }

    const courseData = {
      ...createCourseDto,
      thumbnail: thumbnailUrl,
      instructorId: new Types.ObjectId(instructorId),
      thumbnailPublicId: thumbnailPublicId,
    };

    const course = await this.courseModel.create(courseData);
    return course;
  }


  async findAll(queryDto: QueryCourseDto) {
    const { search, category, page = 1, limit = 10 } = queryDto;

    const filter: any = { isPublished: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.courseModel
        .find(filter)
        .populate('instructorId', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.courseModel.countDocuments(filter),
    ]);


    return {
      data: courses,
      meta: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async findAllCoursesByAdmin(queryDto: QueryCourseDto) {
    const { search, category, page = 1, limit = 10 } = queryDto;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.courseModel
        .find(filter)
        .populate('instructorId', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.courseModel.countDocuments(filter),
    ]);


    return {
      data: courses,
      meta: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      }
    };
  }


  async findOne(id: string): Promise<Course> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid course ID');
    }

    const course = await this.courseModel
      .findById(id)
      .populate('instructorId', 'name email')
      .exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }


  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
    userRole: string,
    file?: Express.Multer.File,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid course ID');
    }

    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }


    if (userRole !== UserRole.ADMIN && course.instructorId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    if (file) {
      if (
        course.thumbnailPublicId &&
        !course.thumbnail.includes('placeholder')
      ) {
        await this.cloudinaryService.deleteFile(course.thumbnailPublicId);
      }

      course.thumbnail = (file as any).path;
      course.thumbnailPublicId = (file as any).filename;
    }

    Object.assign(course, updateCourseDto);

    return await this.courseModel.findByIdAndUpdate(id, course, { new: true });
  }


  async remove(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid course ID');
    }

    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (userRole !== UserRole.ADMIN && course.instructorId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }


    if (
      course.thumbnailPublicId &&
      !course.thumbnail.includes('placeholder')
    ) {
      await this.cloudinaryService.deleteFile(course.thumbnailPublicId);
    }

    await this.courseModel.findByIdAndDelete(id);

    return { message: 'Course deleted successfully' };
  }


  async findInstructorCourses(instructorId: string, queryDto: QueryCourseDto) {
    const { page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.courseModel
        .find({ instructorId: new Types.ObjectId(instructorId) })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.courseModel.countDocuments({
        instructorId: new Types.ObjectId(instructorId),
      }),
    ]);

    return {
      data: courses,
      meta: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      }
    };
  }


  async togglePublish(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<Course> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid course ID');
    }

    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (userRole !== UserRole.ADMIN && course.instructorId.toString() !== userId) {
      throw new ForbiddenException(
        'You can only publish/unpublish your own courses',
      );
    }

    course.isPublished = !course.isPublished;
    return await course.save();
  }
}