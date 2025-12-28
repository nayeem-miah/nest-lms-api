import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CourseLevel } from 'src/enums/course.enum';

@Schema({ timestamps: true })
export class Course {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ index: true })
    category: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    instructorId: Types.ObjectId;

    @Prop({ required: true })
    thumbnail: string;

    @Prop()
    thumbnailPublicId: string;

    @Prop({ enum: CourseLevel, default: CourseLevel.BEGINNER })
    level: CourseLevel;

    @Prop({ default: false })
    isPublished: boolean;

    @Prop({ default: 0 })
    ratingAvg: number;

    @Prop({ default: 0 })
    totalEnrollments: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);