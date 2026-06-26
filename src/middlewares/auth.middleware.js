const jwt = require("jsonwebtoken");

async function authArtist(req, res, next) {
    // Support cookies and Authorization header; guard against undefined
    const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "Only artists can upload music" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid token" });
    }
}

async function authUser(req , res, next){
    const token = req.cookies.token;
    if(!token){
        res.status(400).json({
            message: "unauthorized"
        })

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if(deccoded.role !== "user"){
                return res.status(403).json({
                  message: "access denied"
                })
            }

            req.user = decoded;
            next()
        }
        catch(err){
            console.log(err);
            return res.status(400).json({
               message: "unauthorized"
            })
        }
    }
}



module.exports = { authArtist , authUser};