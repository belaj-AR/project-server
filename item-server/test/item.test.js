const app = require('../app');
const Item = require('../models/item');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = require('chai').expect;
