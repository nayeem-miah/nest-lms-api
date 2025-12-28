// dto/create-course.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { CourseLevel } from 'src/enums/course.enum';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;
    @IsString()
    category: string;

    @IsEnum(CourseLevel)
    level: CourseLevel;
}

