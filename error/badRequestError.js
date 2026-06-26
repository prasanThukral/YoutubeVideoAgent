import { CustomError } from "./customError"
import {StatusCodes} from "http-status-codes"
export class BadRequestError extends CustomError{

    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}