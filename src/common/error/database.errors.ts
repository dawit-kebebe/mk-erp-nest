import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseStatus } from '../response.interface.js';
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryFailedError } from 'typeorm';
import type { ErrorResponse } from '../error-response.interface.js';

interface MysqlError extends Error {
    code?: string; // MySQL error code (e.g., 'ER_DUP_ENTRY')
    errno?: number; // MySQL error number (e.g., 1062)
    sqlMessage?: string; // Detailed SQL error message
}

@Catch(QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError) // Add other common DB errors from your ORM/driver if needed
export class DatabaseExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(DatabaseExceptionFilter.name);

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'A database error occurred.';

        if (exception instanceof QueryFailedError) {
            const dbError = exception as QueryFailedError & { driverError?: MysqlError };

            switch (dbError.driverError?.errno) {
                case 1062: // ER_DUP_ENTRY (Unique violation)
                    statusCode = HttpStatus.CONFLICT;
                    message = 'A record with this unique identifier already exists.';
                    //errorCode = 'DB_UNIQUE_CONSTRAINT';
                    
                    if (dbError.driverError?.sqlMessage) {
                        const match = dbError.driverError.sqlMessage.match(/Duplicate entry '(.+)' for key '(.+)'/);
                        if (match) {
                            message = `'${match[1]}' already exists (duplicate entry for key '${match[2]}').`;
                        }
                    }
                    break;

                case 1451: // ER_ROW_IS_REFERENCED_2 (Foreign key constraint fails - cannot delete/update parent row)
                case 1452: // ER_NO_REFERENCED_ROW_2 (Foreign key constraint fails - cannot add/update child row)
                    statusCode = HttpStatus.BAD_REQUEST; // Or HttpStatus.CONFLICT, depending on context
                    message = 'Related data could not be found or is in use.';
                    // errorCode = 'DB_FOREIGN_KEY_VIOLATION';
                    break;

                case 1048: // ER_BAD_NULL_ERROR (Not null violation)
                    statusCode = HttpStatus.BAD_REQUEST;
                    message = 'A required field is missing.';
                    // errorCode = 'DB_NOT_NULL_VIOLATION';
                    break;
                    
                default:
                    statusCode = HttpStatus.BAD_REQUEST;
                    message = 'Invalid request or query.';
                    // errorCode = 'DB_QUERY_FAILED';
                    break;
            }

        } else if (exception instanceof EntityNotFoundError) {

            statusCode = HttpStatus.NOT_FOUND;
            message = 'The requested resource was not found.';
            // errorCode = 'DB_ENTITY_NOT_FOUND';

        } else if (exception instanceof CannotCreateEntityIdMapError) {
            statusCode = HttpStatus.UNPROCESSABLE_ENTITY; // 422 Unprocessable Entity
            message = 'Unable to insert data due to invalid data structure or relationships.';
            // errorCode = 'DB_CANNOT_CREATE_ENTITY';
        }

        const errorResponseBody: ErrorResponse = {
            status: ResponseStatus.FAILURE,
            statusCode: statusCode,
            message: message,
            timestamp: new Date().toISOString(),
        };

        // [DB] - Method - route - message - stack trace

        this.logger.error(
            `[DB] - ${request.method} ${request.url}: ${exception.message}`,
            exception.stack,
        );

        response.status(statusCode).json(errorResponseBody);
    }
}