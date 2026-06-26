import {registerSchema,loginSchema} from '../validations/joiSchema.js'


export class AuthController{

    static async register(req,res){
        const r = await registerSchema.validateAsync(req.body)
        



        
    }
}
