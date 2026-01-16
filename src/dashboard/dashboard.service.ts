import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Course } from "src/course/schemas/course.schema";
import { PaymentStatus } from "src/enums/paymentStatus";
import { Payment } from "src/payment/schemas/payment.schema";
import { User } from "src/user/schemas/user.schema";

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) { }

  async getDashboardSummary() {
    const [totalUsers, totalCourses, totalRevenue] = await Promise.all([
      this.userModel.countDocuments({}),
      this.courseModel.countDocuments({}),
      this.paymentModel.aggregate([
        { $match: { status: PaymentStatus.PAID } },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalRevenue: totalRevenue[0]?.total || 0,
    };
  }
}
