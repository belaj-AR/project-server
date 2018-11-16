const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    textures: [{type: String}],
    theme: {
        type: String
    },
    element: { 
        type: String 
    },
    image: {
        type: String
    }
}, {timestamps:true});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;