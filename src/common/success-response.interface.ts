import type { Response, ResponseStatus } from "./response.interface";

export interface SuccessResponse extends Response {
    status: ResponseStatus.SUCCESS,
    data: any
}