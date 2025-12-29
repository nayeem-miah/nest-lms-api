import { IsMongoId, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class EnrollmentQueryDto {
    @IsOptional()
    @IsMongoId()
    userId?: string;

    @IsOptional()
    @IsMongoId()
    courseId?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}
