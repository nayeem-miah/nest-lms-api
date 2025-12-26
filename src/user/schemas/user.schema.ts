import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../user.types';

export type UserDocument = User & Document;



@Schema({
    timestamps: true,
})
export class User {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        trim: true,
    })
    email: string;

    @Prop({
        required: true,
        select: false,
    })
    password: string;

    @Prop({
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.STUDENT,
    })
    role: UserRole;

    @Prop({ default: null })
    profilePhoto?: string;

    @Prop({
        type: [String],
        default: [],
    })
    devices: string[];

    @Prop({ default: true })
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
