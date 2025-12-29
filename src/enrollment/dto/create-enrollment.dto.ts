import { IsMongoId } from 'class-validator';

export class CreateEnrollmentDto {
    @IsMongoId()
    userId: string;

    @IsMongoId()
    courseId: string;
}
