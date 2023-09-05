const jwt = require("jsonwebtoken")

let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
let jwtSecretKey = process.env.JWT_SECRET_KEY;

const validateToken = (req, res, next) => {
    try {
        console.log('headers',req.headers.authorization)
        const authHeaders = req.headers.authorization
        const token = authHeaders.split(" ")[1]
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
           return next()
        }else{
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
}

const generateToken = (userData) => {
    const token = jwt.sign({
        userData,
    }, jwtSecretKey, { expiresIn: '1h' });
    return token
}

module.exports = {
    validateToken,
    generateToken
}