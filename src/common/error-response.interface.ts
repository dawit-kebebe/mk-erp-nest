import { Response, ResponseStatus } from "./response.interface";

export interface ErrorResponse extends Response {
    status: ResponseStatus.FAILURE
}