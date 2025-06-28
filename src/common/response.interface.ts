import { HttpStatus } from "@nestjs/common"

export enum ResponseStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE"
}

export interface Response {
    status: ResponseStatus
    statusCode: HttpStatus,
    message: string | string[],
    timestamp: string | Date
}
