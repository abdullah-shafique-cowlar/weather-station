const jwt = require("jsonwebtoken");

const jwtVerify = async (req, res, next) => {
    try {
        let token = req.headers['authorization'].split(" ")[1];
        let decoded = jwt.verify(token,process.env.SECRET);
        req.user = decoded;
        next();
    } catch(err){
        res.status(401).json({"msg":"Couldnt Authenticate"});
    }
}

module.exports = jwtVerify;