import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';
import { CoursesService } from 'src/course/course.service';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentStatus } from 'src/enums/paymentStatus';
import { Course } from 'src/course/schemas/course.schema';


@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,

    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,

    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,

    private readonly coursesService: CoursesService,

  ) { }


  async enrollCourse(userId: string, courseId: string) {
    const course = await this.coursesService.findOne(courseId);

    if (!course || !course.isPublished) {
      throw new NotFoundException('Course not available');
    }

    const alreadyEnrolled = await this.enrollmentModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });


    if (alreadyEnrolled) {
      throw new ConflictException('Already enrolled in this course');
    }


    const payment = await this.paymentService.verifyCoursePayment(
      userId,
      courseId,
    );

    if (!payment || payment.status !== PaymentStatus.PAID) {
      throw new ForbiddenException('Payment not completed');
    }


    const enrollment = await this.enrollmentModel.create({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    await this.courseModel.findByIdAndUpdate(
      courseId,
      {
        $inc: { totalEnrollments: 1 },
      }
    );
    return {
      message: 'Enrollment successful',
      enrollment,
    };
  }


  async getUserEnrollments(userId: string) {
    return await this.enrollmentModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .populate('courseId', 'title category price')
      .sort({ createdAt: -1 });
  }

  async getSingleEnrollment(enrollmentId: string, userId: string) {
    const enrollment = await this.enrollmentModel.findById(enrollmentId);
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    if (enrollment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only access your own enrollment');
    }

    // get course details
    const course = await this.coursesService.findOne(
      enrollment.courseId.toString(),
    );

    return { enrollment, course };
  }


  // update progress
  async updateProgress(
    enrollmentId: string,
    userId: string,
    progress: number,
  ) {
    const enrollment = await this.enrollmentModel.findOne({
      _id: enrollmentId,
      userId,
      isActive: true,
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    enrollment.progress = progress;
    await enrollment.save();

    return {
      message: 'Progress updated',
      progress: enrollment.progress,
    };
  }
}
