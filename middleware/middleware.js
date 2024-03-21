const zod = require("zod");

const jwt=require("jsonwebtoken");

const JWT_SECRET = process.env.secret_key;
const authentication = (req,res,next) =>{
    const authToken=req.headers['authorization'];
    
    // console.log(authToken);
    if(!authToken || !authToken.startsWith("Bearer")){
        return res.status(403).json({});
    }
    const token=authToken.split(" ")[1];
    try{
        const verified=jwt.verify(token,JWT_SECRET);
        console.log(verified);
        if(verified){
            req.userId=verified.userId;
            next();
        }else{
            return res.status(403).json({
                jwt:"Incorrect JWT token"
            });
        }
    }catch(err){
        console.log("err");
        return res.status(403).json(err);
    }
}

module.exports = {
    authentication
}