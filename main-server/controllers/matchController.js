const axios = require('axios');
const { uriServerMatch } = require('../config');

module.exports = {
    addMatch: (req, res) => {
        axios({
            method: 'POST',
            url: uriServerMatch,
            data: {
                winner: req.body.winner,
                loser: req.body.loser
            },
            headers: {
                token: req.headers.token
            }
        }).then((result) => {
            res.status(200).json(result.data);
        }).catch((err) => {
            let error = err.response
            res.status(400).json({
                message: error.message
            });
        });
    },
    getMatchHistory: (req, res) => {
        axios({
            method: 'GET',
            url: uriServerMatch,
            headers: {
                token: req.headers.token
            }
        }).then((result) => {
            res.status(200).json(result.data);
        }).catch((err) => {
            let error = err.response
            res.status(400).json({
                message: error.message
            });
        });
    },

    getOneMatch: (req, res) => {
       axios({
            method: 'GET',
            url: `${uriServerMatch}/${req.params.id}`,
            headers: {
                token: req.headers.token
            }
       }).then((result) => {
            res.status(200).json(result.data);
       }).catch((err) => {
            let error = err.response
            res.status(400).json({
                message: error.message
            });
       });
    },
};
