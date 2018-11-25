const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const matchSchema = new Schema({
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps:true});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;