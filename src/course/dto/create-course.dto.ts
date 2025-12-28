// dto/create-course.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CourseLevel } from 'src/enums/course.enum';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsString()
    category: string;

    @IsEnum(CourseLevel)
    level: CourseLevel;
}

