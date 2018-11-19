const Match = require('../models/match');
const User = require('../models/userModel');

module.exports = {
    addMatch: (req, res) => {
        Match.create({
            winner: req.body.winner,
            loser: req.body.loser
        }).then((result) => {
            let updateWinner = User.updateOne({ _id: req.body.winner }, { $push: {win: result} });
            let updateLoser = User.updateOne({ _id: req.body.loser }, { $push: {lose: result} });

            Promise.all([updateWinner, updateLoser]).then((result) => {
                res.status(201).json({message: 'match history has been created' });
            }).catch((err) => {
                res.status(400).json({message: err.message});
            });           
        }).catch((err) => {
            res.status(400).json({message: err.message});
        });    
    },
    //TODO CHANGE BODY TO DECODED
    getMatchHistory: (req, res) => {
        Match.find({$or: [{winner: req.body.id}, {loser: req.body.id}]}).then((result) => {
            res.status(200).json({message: 'getting match data succeeds', data: result});
        }).catch((err) => {
            res.status(400).json({message: err.message});
        });
    },

    getOneMatch: (req, res) => {
        Match.findOne({_id: req.params.id}).then((result) => {
            res.status(200).json({message: 'getting match data succeeds', data: result});
        }).catch((err) => {
            res.status(400).json({message: err.message});
        });
    },

    removeMatch: (req, res) => {
        Match.deleteOne({_id: req.params.id}).then((result) => {
            res.status(200).json({message: 'match has been deleted', data: result});
        }).catch((err) => {
            res.status(400).json({message: err.message});
        });
    }
};
