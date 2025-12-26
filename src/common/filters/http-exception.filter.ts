import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const errorResponse = exception.getResponse();

            message =
                typeof errorResponse === 'string'
                    ? errorResponse
                    : (errorResponse as any).message;
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
            timestamp: new Date().toISOString(),
        });
    }
}
