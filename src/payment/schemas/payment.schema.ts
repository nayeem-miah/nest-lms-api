import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus } from 'src/enums/paymentStatus';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Course' })
    courseId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Subscription' })
    subscriptionId?: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: 'USD' })
    currency: string;


    @Prop({
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    })
    status: string;

    @Prop()
    transactionId: string;

    @Prop()
    invoiceUrl?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
