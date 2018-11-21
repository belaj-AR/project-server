const jwt = require('jsonwebtoken');


module.exports = {

    isLogin: (req, res, next) => {

        let token = req.headers.token
        
        if (token) {

            jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
                if (!err) {
                    req.decoded = decoded
                    next();
                } else {
                    res.status(500).json({
                        status: 'failed',
                        message: 'wrong token'
                    });
                }
            });
        } else { 
            res.status(500).json({
                status: 'failed',
                message: 'You need to login first'
            });
        }
         
    },

    getCRUDToken: (req, res, next) => {
        let token = jwt.sign({header:'upstream'}, process.env.CRUD_SECRET);
        req.auth = { token: token }
        next();
    }
    
    
};
