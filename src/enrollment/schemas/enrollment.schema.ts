import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class Enrollment {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Course', required: true, index: true })
    courseId: Types.ObjectId;

    @Prop({ type: Number, default: 0, min: 0, max: 100 })
    progress: number;

    @Prop({ type: Date, default: Date.now })
    enrolledAt: Date;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

/**
 ** Prevent duplicate enrollment
 ** one user -> one course -> one enrollment
 */
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
