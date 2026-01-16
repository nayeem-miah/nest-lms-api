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
import emailSender from 'src/common/utils/emailSender';

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
    const session = await this.reviewModel.startSession();
    session.startTransaction();

    try {
      const { courseId, rating, comment } = dto;

      const enrolled = await this.enrollmentModel.findOne(
        {
          userId: new Types.ObjectId(userId),
          courseId: new Types.ObjectId(courseId),
        },
        null,
        { session }
      );

      if (!enrolled) {
        throw new ForbiddenException('You are not enrolled in this course');
      }

      const existing = await this.reviewModel.findOne(
        { userId, courseId },
        null,
        { session }
      );

      if (existing) {
        throw new ConflictException('You already reviewed this course');
      }

      const result = await this.reviewModel.create(
        [
          {
            userId,
            courseId,
            rating,
            comment,
          },
        ],
        { session }
      );

      const review = await this.reviewModel.findById(result[0]._id, null, {
        session,
      });

      if (!review) throw new NotFoundException('Review not found');

      await review.save({ session });

      const course = await this.courseModel.findById(review.courseId, null, {
        session,
      });

      if (!course) throw new NotFoundException('Course not found');

      const newTotalReviews = course.totalReviews + 1;
      const newAvg =
        (course.ratingAvg * course.totalReviews + review.rating) /
        newTotalReviews;

      course.totalReviews = newTotalReviews;
      course.ratingAvg = Number(newAvg.toFixed(1));

      await course.save({ session });

      await session.commitTransaction();
      session.endSession();

      return review;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // ! not using transactions
  // async createReview(userId: string, dto: CreateReviewDto) {
  //   const { courseId, rating, comment } = dto;

  //   const enrolled = await this.enrollmentModel.findOne({
  //     userId: new Types.ObjectId(userId),
  //     courseId: new Types.ObjectId(courseId),
  //   });


  //   if (!enrolled) {
  //     throw new ForbiddenException('You are not enrolled in this course');
  //   }

  //   const existing = await this.reviewModel.findOne({ userId, courseId });

  //   if (existing) {
  //     throw new ConflictException('You already reviewed this course');
  //   }


  //   const result = await this.reviewModel.create({
  //     userId,
  //     courseId,
  //     rating,
  //     comment,
  //   });


  //   const review = await this.reviewModel.findById(result._id);
  //   if (!review) throw new NotFoundException('Review not found');

  //   await review.save();

  //   const course = await this.courseModel.findById(review.courseId);
  //   if (!course) throw new NotFoundException('Course not found');

  //   const newTotalReviews = course.totalReviews + 1;
  //   const newAvg =
  //     (course.ratingAvg * course.totalReviews + review.rating) /
  //     newTotalReviews;

  //   course.totalReviews = newTotalReviews;
  //   course.ratingAvg = Number(newAvg.toFixed(1));

  //   await course.save();

  //   const user = await this.reviewModel.findOne({ _id: userId });
  //   if (!user) throw new NotFoundException('User not found');


  //   const html = `
  //   <h2>New Course Review ⭐</h2>
  //   <p>A new review has been submitted.</p>
  //   <p><b>Course:</b> ${course.title}</p>
  //   <p><b>Rating:</b> ${dto.rating}</p>
  //   <p><b>Comment:</b> ${dto.comment}</p>
  // `;

  //   await emailSender(
  //     'New Course Review Received',
  //     user.email,
  //     html
  //   );


  //   return review;

  // }



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
