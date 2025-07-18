import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    Logger
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { ResponseStatus } from 'src/common/response.interface';
import { ErrorResponse } from '../error-response.interface';

@Catch(Array)
export class ValidationExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ValidationExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = 400;
        let message: string[] = ['Validation failed'];

        if (
            Array.isArray(exception) &&
            exception.every((err) => err instanceof ValidationError)
        ) {
            message = this.formatValidationErrors(exception);
        }

        const errorResponse: ErrorResponse = {
            status: ResponseStatus.FAILURE,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
        };

        this.logger.error(
            `[VALIDATION] ${status} - ${request.method} ${request.url}: ${JSON.stringify(
                message,
            )}`,
        );

        response.status(status).json(errorResponse);
    }

    private formatValidationErrors(errors: ValidationError[]): string[] {
        const messages: string[] = [];

        const recurse = (errs: ValidationError[], parent = '') => {
            for (const err of errs) {
                const prop = parent ? `${parent}.${err.property}` : err.property;

                if (err.constraints) {
                    for (const msg of Object.values(err.constraints)) {
                        messages.push(`${prop}: ${msg}`);
                    }
                }

                if (err.children && err.children.length > 0) {
                    recurse(err.children, prop);
                }
            }
        };

        recurse(errors);
        return messages;
    }
}
