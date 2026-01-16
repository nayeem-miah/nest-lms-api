import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './review.service';
import { sendResponse } from 'src/common/utils/sendResponse';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/enums/user.types';
import { Roles } from 'src/auth/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async createReview(@Req() req: any, @Res() res: any, @Body() dto: CreateReviewDto) {
    const result = await this.reviewsService.createReview(req.user.sub, dto);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Review created successfully',
      data: result
    })
  }

  @Get('course/:courseId')
  async getCourseReviews(@Param('courseId') courseId: string, @Res() res: any) {
    const result = await this.reviewsService.getReviews(courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Reviews fetched successfully',
      data: result
    })
  }
}
