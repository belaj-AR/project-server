const Item = require('../models/item');
const client = require('redis').createClient();
const { getErrMessage } = require('../helpers');


module.exports = {
    getAll: (req, res) => {
        client.get('ar-models', (err, reply) => {
            if(reply) {
                res.status(200).json(JSON.parse(reply));
            } else {
                module.exports.getAllAndCache(res);
            }
        });
    },

    getAllAndCache: (res) => {
        Item.find({}).then((result) => {

            let response = {
                message: 'item successfully fetched',
                data: result
            }
            
            client.set('ar-models', JSON.stringify(response), 'EX', 10);
            
            if (res) {
                res.status(200).json(response);
            }
        }).catch((err) => {
            res.status(500).json({
                message: 'unable to fetch the item'
            });
        });
    },



    getOne: (req, res) => {
        Item.findOne({_id: req.params.id}).then((result) => {
            res.status(200).json({
                message: 'item successfully fetched',
                data: result
            })
        }).catch((err) => {
            res.status(400).json({
                message: 'unable to find the item'
            });
        });
    },

    addItem: (req, res) => {
        let { name, source, textures, element, theme } = req.body ;

        let newItem = new Item({
            name: name,
            source: source,
            textures: textures,
            element: element,
            theme: theme
        });

        newItem.save().then((item) => {
            module.exports.getAllAndCache();
            res.status(201).json({
                message: 'item has been successfully added'
            });
        }).catch((err) => {
            res.status(400).json({
                message: getErrMessage(err.message) || err.message
            });
        });
    },

    removeItem: (req, res) => {
        module.exports.getAllAndCache();
        Item.deleteOne({_id: req.params.id}).then((result) => {
            res.status(200).json({
                message: 'item has been deleted',
                data: result
            });
        }).catch((err) => {
            res.status(400).json({
                message: 'unable to delete the data'
            });
        });
    },

    updateItem: (req, res) => {
        let { name, source, textures, element, theme } = req.body;
        
        Item.updateOne({_id: req.params.id}, {
            name: name,
            source: source,
            textures: textures,
            element: element,
            theme: theme
        }, {runValidators: true}).then((result) => {
            module.exports.getAllAndCache();
            res.status(200).json({
                message: 'item has been updated',
                data: result
            });
        }).catch((err) => {
            res.status(400).json({
                message: getErrMessage(err.message) || err.message
            });
        });
    },   
};