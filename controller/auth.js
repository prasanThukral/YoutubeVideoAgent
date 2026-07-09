import {registerSchema,loginSchema} from '../validations/joiSchema.js'
import {userModel,refreshModel} from '../models/UserModel.js'
import { StatusCodes } from 'http-status-codes'
import jwt from "jsonwebtoken";
import { BadRequestError } from '../error/badRequestError.js';
import dotenv from 'dotenv'
dotenv.config() 


    export class AuthController{

    static async register(req,res){
        const {username,password,birth_year,email} =req.body
        await registerSchema.validateAsync(req.body)
        userModel.create({username,password,birth_year,email})
        res.status(StatusCodes.CREATED).json({success:"Account Successfully Created "})

    }

    static async delRefreshToken(req,res){
        const {refreshToken} = req.body
        refreshModel.deleteOne({token:refreshToken})
        res.status(StatusCodes.ACCEPTED).json({success:"Successfully deleted"})
    }

    static async login(req,res){
        await loginSchema.validateAsync(req.body);
        const {email,password} =req.body
        const data = await userModel.findOne({email})
        const isPasswordCorrect = await data.compareHash(password);
        if(!isPasswordCorrect) throw BadRequestError('Password was wrong')
        const accessToken = await data.generateAccessToken();
        
        const refreshToken = jwt.sign({user_id:data._id},process.env.REFRESH_TOKEN_SECRET);

        const saveToken = refreshModel.create({
            user_id:data._id,
            token:refreshToken,
            issuedAt: new Date()
        })

        res.status(StatusCodes.ACCEPTED).json({accessToken,refreshToken})


    }

}
