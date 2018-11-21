const Item = require('../models/item');
const client = require('redis').createClient();

module.exports = {
    resetDBTest: (req, res) => {
        Item.deleteMany().then((result) => {
            res.status(200).json({message: 'db test has been reseted'});
        }).catch((err) => {
            res.status(400).json({message: 'unable to reset db test'});
        });
    }
};
