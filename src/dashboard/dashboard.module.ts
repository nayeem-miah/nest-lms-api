import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/course/schemas/course.schema';
import { Payment, PaymentSchema } from 'src/payment/schemas/payment.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { AdminDashboardController } from './dashboard.controller';
import { AdminDashboardService } from './dashboard.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class DashboardModule { }
