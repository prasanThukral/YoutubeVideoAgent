import dotenv from 'dotenv'
dotenv.config()
import {authRouter} from './router/route.js'
import { errorHandlingMiddleware } from './middleware/errorHandling.js'
import express from 'express'
const app = express();

import {connectDB} from './db/mongoDB.js'

app.use(express.json())

app.use('/auth',authRouter)
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