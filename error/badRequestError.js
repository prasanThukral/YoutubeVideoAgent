import { CustomError } from "./customError.js"
import {StatusCodes} from "http-status-codes"
export class BadRequestError extends CustomError{

    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}