import {
  Body,
  Controller,
  Header,
  Headers,
  Post,
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



  @Post('me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  getMyPayments(@Req() req) {
    return this.paymentService.getUserPayments(req.user.sub);
  }
}
