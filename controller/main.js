import { Agent } from "../AIstuff/mains.js";
import crypto from 'crypto'
import { aiChatSchema } from "../validations/joiSchema.js";
import { StatusCodes } from 'http-status-codes'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export class AgenticAPI{

    static async talk(req,res) {

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(!token) return res.status(StatusCodes.FORBIDDEN).json({message:'Invalid access'});

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            console.log(err);
            if(err) res.status(StatusCodes.FORBIDDEN).json({message:'Invalid access'});
            req.user =user
        })
        const {model,content} = req.body
        await aiChatSchema.validateAsync()

        const random = crypto.randomUUID()
        const response = await Agent.chat(model,random,content)
        res.status(200).json({response:response})
    }
}


