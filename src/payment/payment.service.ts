import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { PaymentStatus } from 'src/enums/paymentStatus';
import { CoursesService } from 'src/course/course.service';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import configuration from 'src/config/configuration';
import { stripe } from 'src/common/utils/stripe';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { QueryPaymentDto } from './dto/QueryPaymentDto';


@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    private readonly courseService: CoursesService,
    private readonly userService: UserService,

    @Inject(forwardRef(() => EnrollmentService))
    private readonly enrollmentService: EnrollmentService,
  ) { }




  async createPayment(payload: {
    userId: string;
    courseId: string;
    subscriptionId?: string;
  }) {
    let amount = 0;

    const userInfo = await this.userService.findOne(payload.userId);

    const course = await this.courseService.findOne(payload.courseId);
    if (!course || !course.isPublished) {
      throw new NotFoundException("Course not available");
    }

    amount = course.price;
    if (amount <= 0) {
      throw new BadRequestException("Invalid payment amount");
    }

    const payment = await this.paymentModel.create({
      userId: new Types.ObjectId(payload.userId),
      courseId: new Types.ObjectId(payload.courseId),
      amount,
      status: PaymentStatus.PENDING,
    });

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      customer_email: userInfo?.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `payment #${userInfo?.name} for course ${course.title}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: payment._id.toString(),
        userId: userInfo?._id.toString() as string,
      },
      success_url: `${configuration().frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${configuration().frontendUrl}/payment/cancel`,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    payment.transactionId = session.id;
    await payment.save();

    return {
      checkoutUrl: session.url,
    };
  }

  async handleStripeWebhook(rawBody: any, signature: string) {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        configuration().stripe.webhookSecret as string,
      );

    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const payment = await this.paymentModel.findOne({
        transactionId: session.id,
      });

      if (!payment) return { received: true };


      if (payment.status === 'PAID') {
        return { received: true };
      }


      payment.status = PaymentStatus.PAID;
      await payment.save();


      const updateData = await this.enrollmentService.enrollCourse(
        payment.userId.toString(),
        payment.courseId.toString(),
      );
    }
    return { received: true };
  }


  //  verify payment
  async verifyCoursePayment(userId: string, courseId: string) {
    return this.paymentModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      status: PaymentStatus.PAID,
    });
  }

  // verify payment
  async verifySubscriptionPayment(userId: string) {
    return this.paymentModel.findOne({
      userId: new Types.ObjectId(userId),
      subscriptionId: { $exists: true },
      status: PaymentStatus.PAID,
    });
  }



  async markPaymentSuccess(
    transactionId: string,
    invoiceUrl?: string,
  ) {
    return this.paymentModel.findOneAndUpdate(
      { transactionId },
      {
        status: PaymentStatus.PAID,
        invoiceUrl,
      },
      { new: true },
    );
  }


  async markPaymentFailed(transactionId: string) {
    return this.paymentModel.findOneAndUpdate(
      { transactionId },
      { status: PaymentStatus.PENDING },
      { new: true },
    );
  }


  async markPaymentRefunded(transactionId: string) {
    return this.paymentModel.findOneAndUpdate(
      { transactionId },
      { status: PaymentStatus.REFUNDED },
      { new: true },
    );
  }


  async getUserPayments(userId: string) {
    return this.paymentModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate({
        path: 'userId',
        select: 'name email profilePhoto',
      })
      .populate({
        path: 'courseId',
        select: 'title  category thumbnail level ratingAvg totalEnrollments',
      })
      .select('-__v');
  }

  async getAllPayments(queryDto: QueryPaymentDto) {
    const {
      search,
      status,
      currency,
      userId,
      courseId,
      page = 1,
      limit = 10,
    } = queryDto;

    const filter: any = {};

    //  Basic filters
    if (status) filter.status = status;
    if (currency) filter.currency = currency;
    if (userId) filter.userId = userId;
    if (courseId) filter.courseId = courseId;

    //  Search (transactionId only – fast & safe)
    if (search) {
      filter.transactionId = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.paymentModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'userId',
          select: 'name email profilePhoto',
        })
        .populate({
          path: 'courseId',
          select: 'title category price thumbnail level ratingAvg totalEnrollments',
        })
        .select('-__v')
        .exec(),
      this.paymentModel.countDocuments(filter),
    ]);

    return {
      data: payments,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

}
