import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId;

    @Prop({ min: 1, max: 5, required: true })
    rating: number;

    @Prop({ trim: true })
    comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// 🚫 Prevent duplicate review
ReviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });
