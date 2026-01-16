
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { CoursesController } from './course.controller';
import { CoursesService } from './course.service';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    forwardRef(() => EnrollmentModule)
  ],

  controllers: [CoursesController],
  providers: [CoursesService, CloudinaryService],
  exports: [CoursesService, MongooseModule],
})
export class CoursesModule { }