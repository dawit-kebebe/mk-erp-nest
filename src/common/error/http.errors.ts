import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseStatus } from 'src/common/response.interface';
import { ErrorResponse } from '../error-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message: string | string[];
        // let code: string | undefined; // In case of custom codes

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if (
            typeof exceptionResponse === 'object' &&
            'message' in exceptionResponse &&
            typeof exceptionResponse['message'] === 'string'
        ) {
            message = exceptionResponse['message'];
        } else {
            message = 'An unexpected HTTP error occurred.';
        }

        const errorResponseBody: ErrorResponse = {
            status: ResponseStatus.FAILURE,
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString()
        };

        // // [HTTP] - Time Stamp - statusCode - Method route - message - stack trace
        
        this.logger.error(
            `[HTTP] ${status} - ${request.method} ${request.url}: ${JSON.stringify(message)}`,
            exception.stack
        );

        response.status(status).json(errorResponseBody);
    }
}