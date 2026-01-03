import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/enums/user.types';
import { Roles } from 'src/auth/roles.decorator';
import { sendResponse } from 'src/common/utils/sendResponse';
import { QueryPaymentDto } from './dto/QueryPaymentDto';


@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async createPayment(@Req() req, @Body() dto: CreatePaymentDto, @Res() res: any) {
    const result = await this.paymentService.createPayment({
      userId: req.user.sub,
      ...dto,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payment created successfully',
      data: result
    })
  }


  @Post('stripe/webhook')
  stripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleStripeWebhook(req.body, signature);
  }



  @Get('me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async getMyPayments(@Req() req, @Res() res: any) {
    const result = await this.paymentService.getUserPayments(req.user.sub);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'My payments fetched successfully',
      data: result
    })
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllPayments(
    @Query() queryDto: QueryPaymentDto,
    @Res() res: any,
  ) {
    const result = await this.paymentService.getAllPayments(queryDto);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payments fetched successfully',
      data: result.data,
      meta: result.meta,
    });
  }

}
