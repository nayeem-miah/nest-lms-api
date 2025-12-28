
import { IsOptional, IsString } from 'class-validator';

export class QueryCourseDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;
}
