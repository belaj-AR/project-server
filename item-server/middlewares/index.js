require('dotenv').config();
const jwt = require('jsonwebtoken');


module.exports = {
    hasToken: (req, res, next) => {
        try {
            
            let decoded = jwt.verify(req.headers['token'], process.env.JWT_KEY);
            
            next();
            
        } catch (error) {

       
            res.status(401).json({ message: 'Please provide a valid token'})
        }
    },

    TestingToken: (req, res, next) => {
        try {  
            let decoded = jwt.verify(req.headers['token'], process.env.JWT_TESTING);
            next();
        } catch (error) {
            res.status(401).json({ message: 'Please provide a valid token'});
        }
    }
};