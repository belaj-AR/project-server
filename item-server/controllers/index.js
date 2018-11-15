const Item = require('../models/item');
const { getErrMessage } = require('../helpers');


module.exports = {
    getAll: (req, res) => {
        Item.find({}).then((result) => {
            res.status(200).json({
                message: 'item successfully fetched',
                data: result
            });
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
        let { name, source, textures, element } = req.body ;

        let newItem = new Item({
            name: name,
            source: source,
            textures: textures,
            element: element
        });

        newItem.save().then((item) => {
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
        let { name, source, textures, element } = req.body;

        Item.updateOne({_id: req.params.id}, {
            name: name,
            source: source,
            textures: textures,
            element: element
        }, {runValidators: true}).then((result) => {
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