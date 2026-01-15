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
import { EnrollmentService } from './enrollment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/enums/user.types';
import { UpdateProgressDto } from './dto/update-enrollment.dto';
import { sendResponse } from 'src/common/utils/sendResponse';


@Controller('enrollments')
@UseGuards(AuthGuard, RolesGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) { }

  // Enroll after payment success Student only
  @Post(':courseId')
  @Roles(UserRole.STUDENT)
  async enrollCourse(@Req() req, @Param('courseId') courseId: string) {
    return await this.enrollmentService.enrollCourse(
      req.user.sub,
      courseId,
    );
  }

  //  get my payment history
  @Get('me')
  @Roles(UserRole.STUDENT)
  async getMyEnrollments(@Req() req, @Res() res: any) {
    const result = await this.enrollmentService.getUserEnrollments(req.user.sub);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'My enrollments fetched successfully',
      data: result
    })
  }

  // update progress
  @Patch(':id/progress')
  @Roles(UserRole.STUDENT)
  updateProgress(
    @Req() req,
    @Param('id') enrollmentId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.enrollmentService.updateProgress(
      enrollmentId,
      req.user.sub,
      dto.progress,
    );
  }
}
