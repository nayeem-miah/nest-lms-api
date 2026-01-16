import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { CoursesModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewsModule } from './review/review.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    UserModule,
    MongooseModule.forRoot(configuration().database.url as string),
    AuthModule,
    CoursesModule,
    EnrollmentModule,
    PaymentModule,
    ReviewsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
