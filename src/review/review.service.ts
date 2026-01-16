import {
  Injectable,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './schema/review.schema';
import { Enrollment, EnrollmentDocument } from 'src/enrollment/schemas/enrollment.schema';
import { Course } from 'src/course/schemas/course.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,

    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,

    @InjectModel(Course.name)
    private courseModel: Model<Course>,
  ) { }

  async createReview(userId: string, dto: CreateReviewDto) {
    const { courseId, rating, comment } = dto;

    const enrolled = await this.enrollmentModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });


    if (!enrolled) {
      throw new ForbiddenException('You are not enrolled in this course');
    }

    const existing = await this.reviewModel.findOne({ userId, courseId });

    if (existing) {
      throw new ConflictException('You already reviewed this course');
    }

    return this.reviewModel.create({
      userId,
      courseId,
      rating,
      comment,
    });
  }

  async getReviews(courseId: string) {
    const reviews = await this.reviewModel
      .find({ courseId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    return {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: reviews.length,
      reviews,
    };
  }



}
