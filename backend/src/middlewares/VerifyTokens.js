import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // load .env variables

export function verifyToken(request,response,next) {
    const authHeader = request.get("Authorization"); // Bearer jwt token

    if(authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.SECRET_KEY,(error, payload)=>{
            if(error){
               response.status(401).send({message:'Token is invalid'}); 
            }
            else{
                console.log(payload);
                request.user_id = payload.user_id;
                request.role = payload.role;
               next(); 
            }
        });
    }
    else{
       response.status(401).send({message:'Token is missing'}); 
    }
}

export function authorize(allowedRoles){
    return (request,response,next)=>{
        if(allowedRoles.includes(request.role)){
            next();
        } else {
            response.status(403).send("Accesss Denied");
        }
    }
}