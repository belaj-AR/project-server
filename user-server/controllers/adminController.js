const User = require('../models/userModel');
const Match = require('../models/match');

module.exports = {
    resetDBTest: (req, res) => {
        let clearUser = User.deleteMany();
        let clearMatches = Match.deleteMany();

        Promise.all([clearUser, clearMatches]).then((result) => {
            res.status(200).json({message: 'db test has been reseted'});
        }).catch((err) => {
            res.status(400).json({message: 'unable to reset db test'});
        });
    }
};
