require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/userModel')

chai.use(chaiHttp);

