import { CustomError } from '../error/customError.js'
import { StatusCodes } from 'http-status-codes'

export const errorHandlingMiddleware = (err, req, res, next) => {

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            message: err.message
        })
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message })
}