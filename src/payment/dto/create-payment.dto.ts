import { IsEnum, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
    @IsMongoId()
    courseId: string;

    @IsOptional()
    @IsMongoId()
    subscriptionId?: string;
}
