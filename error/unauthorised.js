import { CustomError } from "./customError"
import {StatusCodes} from "http-status-codes"
export class UnauthorisedError extends CustomError{

    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}