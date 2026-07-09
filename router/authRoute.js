
import express from 'express';
const authRouter = express.Router();
import {AuthController} from '../controller/auth.js'


authRouter.post('/login',AuthController.login)
authRouter.post('/registration',AuthController.register)
authRouter.delete('/logout',AuthController.delRefreshToken)

export {authRouter}