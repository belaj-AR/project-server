require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/userModel')

chai.use(chaiHttp);

let userData1 = {
  fname: 'John',
  lname: 'Doe',
  email: 'johndoe@gmail.com',
  uid: '123123'
};

let userData2 = {
  fname: 'Jane',
  lname: 'Doe',
  email: 'johndoe@gmail.com',
  uid: '123123'
};

describe('Creating an account', () => {

  afterEach(done => {
      User.deleteMany({})
        .then(() => {
          done()
        })
    });

    afterEach(done => {
    userData1 = {
      fname: 'John',
      lname: 'Doe',
      email: 'johndoe@gmail.com',
      uid: '123'
    };

    userData2 = {
      fname: 'Jane',
      lname: 'Doe',
      email: 'johndoe@gmail.com',
      uid: '123'
    };
    done()
  })

  it("should return msg 'First name required' response error if fname is empty", done => {

    userData1.fname = ''

    chai
      .request(app)
      .post('/users')
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('First name required');
        expect(res.body.status).to.equal('failed');
        done();
      });
  })

  
});
