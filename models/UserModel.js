import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        maxlength:50,
        minlength:3
    },
    password:{
        type:String,
        required: true,
        minlength:8
    },
    
    birth_year:{
        type:Number,
        required: true,
        min:1900,
        max:2013
    },
    email:{
        type:String,
        required: true,
        unique:true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
    }
})

const refreshTokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    issuedAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7 // 7 days, adjust to your actual refresh token lifetime
    }
});

userSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10m'})
    
} 
userSchema.methods.compareHash = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password)
}

const userModel = mongoose.model('userSchema',userSchema)
const refreshModel = mongoose.model('refreshToken',refreshTokenSchema)

export {userModel,refreshModel}