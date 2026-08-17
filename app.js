import dotenv from 'dotenv'
dotenv.config()
import {authRouter} from './router/authRoute.js'
import { errorHandlingMiddleware } from './middleware/errorHandling.js'
import express from 'express'
import cors from 'cors'
const app = express();

import {connectDB} from './db/mongoDB.js'
import { aiRouter } from './router/aiRoute.js'

app.use(cors())
app.use(express.json())

app.use('/auth',authRouter)
app.use('/ai',aiRouter)
app.use(errorHandlingMiddleware)

const start = async ()=>{
 try{
    await connectDB(process.env.MONGO_URI)
    app.listen(3000,()=>console.log('app is listed on 3000'))
 }catch(error){
    console.log(error)
 }

}


start();