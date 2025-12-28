// courses.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { CoursesController } from './course.controller';
import { CoursesService } from './course.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, CloudinaryService],
  exports: [CoursesService],
})
export class CoursesModule { }