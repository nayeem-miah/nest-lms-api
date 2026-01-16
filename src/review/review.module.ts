import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { Enrollment, EnrollmentSchema } from 'src/enrollment/schemas/enrollment.schema';
import { Course, CourseSchema } from 'src/course/schemas/course.schema';
import { ReviewsController } from './review.controller';
import { ReviewsService } from './review.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule { }
