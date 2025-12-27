import { Body, Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import type { Response } from 'express';
import { sendResponse } from '../common/utils/sendResponse';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async create(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    const result = await this.authService.login(createAuthDto);

    // set token in cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ?
        "none" : "lax",
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ?
        "none" : "lax",
    })

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User logged in successfully',
      data: result
    })
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Res() res: Response, @Request() req) {
    const { sub } = req.user
    const { deviceId } = req.user
    const result = await this.authService.logout(sub, deviceId);

    //  Clear cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User logged out successfully',
      data: result
    })
  }
}
