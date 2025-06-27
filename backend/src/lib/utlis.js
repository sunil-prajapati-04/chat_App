import jwtToken from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const secrectKey = process.env.SECRECT_KEY;
export const genToken = (payload)=>{
    try {
        const token = jwtToken.sign(payload,secrectKey,{
            expiresIn:"7d"
        });
        return token;
    } catch (error) {
        return error; 
    }
}
