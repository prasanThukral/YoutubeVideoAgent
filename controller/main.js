import { Agent } from "../AIstuff/mains.js";
import crypto from 'crypto'
import { aiChatSchema } from "../validations/joiSchema.js";
import { StatusCodes } from 'http-status-codes'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import { convoIdModel } from '../models/UserModel.js';


export class AgenticAPI {


    static async talk(req, res) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid access' });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

            if (err) res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid access' });
            req.user = user
        })
        let { model, content, thread_id } = req.body
        await aiChatSchema.validateAsync(req.body)
        let newId = false
        if (!thread_id) {
            thread_id = crypto.randomUUID()
            newId = true
        }

        const response = await Agent.chat(model, thread_id, content)


        if (newId)
            convoIdModel.create({ thread_id, user_id: req.user.userId })
        res.status(200).json({ response: response })
    }

}


