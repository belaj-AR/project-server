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
        theme: req.body.theme
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

  removeItem: (req, res) => {
    axios({
      method: 'DELETE',
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

  updateItem: (req, res) => {
    
    axios({
      method: 'PUT',
      url: `${uriServerItem}/${req.params.id}`,
      data: {
        name: req.body.name,
        source: req.body.source,
        element: req.body.element,
        textures: req.body.textures,
        theme: req.body.theme
      },
      headers: {
        token: req.auth.token
      }
    }).then((result) => {
      res.status(200).json({
        data: result.data
      })
    }).catch((err) => {
      let { message } = err.response.data;

      res.status(500).json({
        message: message
      });

    });
  },   
}