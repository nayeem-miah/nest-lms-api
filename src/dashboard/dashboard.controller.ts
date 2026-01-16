import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { sendResponse } from "src/common/utils/sendResponse";
import { AdminDashboardService } from "./dashboard.service";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { UserRole } from "src/enums/user.types";

@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(
    private readonly adminDashboardService: AdminDashboardService,
  ) { }

  @Get('summary')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getSummary(@Res() res: any) {
    const result = await this.adminDashboardService.getDashboardSummary();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dashboard summary fetched successfully',
      data: result
    })
  }
}
