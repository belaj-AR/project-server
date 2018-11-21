require('dotenv').config();
const jwt = require('jsonwebtoken');

const TestingToken = (req, res, next) => {
    try {  
        let decoded = jwt.verify(req.headers['token'], process.env.JWT_TESTING);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please provide a valid token'});
    }
}

module.exports = TestingToken;