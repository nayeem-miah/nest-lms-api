import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from 'src/enums/paymentStatus';

export class PaymentWebhookDto {
    @IsString()
    transactionId: string;

    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @IsOptional()
    @IsString()
    invoiceUrl?: string;
}
