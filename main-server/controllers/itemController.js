const axios = require('axios');
const { uriServerItem } = require('../config');

module.exports = {
  getAll: (req, res) => {

    axios({
      method: 'GET',
      url: uriServerItem,
      headers: {
        token: req.auth.token
      }
    }).then((result) => {
      res.status(200).json({
        data: result.data
      });
    }).catch((err) => {
      let { message } = err.response.data;

      res.status(500).json({
        message: message
      });
    });
  },

  getOne: (req, res) => {
    axios({
      method: 'GET',
      url: `${uriServerItem}/${req.params.id}`,
      headers: {
        token: req.auth.token
      }
    }).then((result) => {
      res.status(200).json({
        data: result.data
      });
    }).catch((err) => {
      let { message } = err.response.data;

      res.status(500).json({
        message: message
      });
    });
  },

  addItem: (req, res) => {
    axios({
      method: 'POST',
      url: `${uriServerItem}`,
      data: {
        name: req.body.name,
        source: req.body.source,
        textures: req.body.textures,
        element: req.body.element,
        theme: req.body.theme,
        image: req.body.image
      },
      headers: {
        token: req.auth.token
      }
    }).then((result) => {
      res.status(201).json({
        data: result.data
      });
    }).catch((err) => {
      let { message } = err.response.data;

      res.status(500).json({
        message: message
      });
    });
  },
}