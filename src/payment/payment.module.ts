import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { CoursesModule } from 'src/course/course.module';
import { UserModule } from 'src/user/user.module';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
    ]),
    forwardRef(() => CoursesModule),
    UserModule,
    forwardRef(() => EnrollmentModule),
    forwardRef(() => CoursesModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule { }
