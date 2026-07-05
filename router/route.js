
import express from 'express';
const authRouter = express.Router();
import {AuthController} from '../controller/auth.js'


authRouter.post('/login',AuthController.login)
authRouter.post('/registration',AuthController.register)

export {authRouter}