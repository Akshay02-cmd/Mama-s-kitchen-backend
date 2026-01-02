import  jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/index.js';
 
const auth = async (req, res, next)=>{
   const authheader = req.cookies.token || req.headers.authorization;
    if(!authheader || !authheader.startsWith('Bearer ')){
        throw new UnauthorizedError('Authentication invalid');
    }
    const token = authheader.split(' ')[1];
    try{
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId: payload.userId, name: payload.username};
        next();
    }catch(error){
        throw new UnauthorizedError('Authentication invalid');
    }
}

export default auth; 