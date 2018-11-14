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

  it("should return msg 'Email required' response error if email is empty", done => {
    
    userData1.email = ''

    chai
      .request(app)
      .post('/users')
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Email required');
        expect(res.body.status).to.equal('failed');
        done();
      });
  });

  it("should return msg 'Email is invalid' if input 'johndoe.com' ", done => {
    userData1.email = "johndoe.com";
    chai
      .request(app)
      .post("/users")
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property("status");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Email is invalid");
        expect(res.body.status).to.equal("failed");
        done();
      });
  });

  it("should return msg 'Email is invalid' response error if input 'gsta.comndry@ean' ", done => {
    userData1.email = "john.doe@ean";
    chai
      .request(app)
      .post('/users')
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Email is invalid');
        expect(res.body.status).to.equal('failed');
        done();
      });
  });

  it("should return msg 'First name length must be greater than 2' if fname length must greater than 2 ", done => {
    userData1.fname = 'a';
    chai
      .request(app)
      .post('/users')
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(
          'First name length must be greater than 2'
        );
        expect(res.body.status).to.equal('failed');
        done();
      });
  });

  it("should return 'First name must be contained with characther only' response error if input contains number ", done => {
    userData1.fname = 'an4'
    chai
      .request(app)
      .post('/users')
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(
          'First name must be contained with characther only'
        );
        expect(res.body.status).to.equal('failed');
        done();
      });
  });

  it("should return response success if lname not filled ", done => {
    userData1.lname = "";
    chai
      .request(app)
      .post("/users")
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("status");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          `success creating new account with email ${userData1.email}`
        );
        expect(res.body.status).to.equal("success");
        done();
      });
  })

  it("should return msg 'Last name length must be greater than 2' response error if lname length must be greater than 2 if input 'a' ", done => {
    userData1.lname = "a";
    chai
      .request(app)
      .post('/users')
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(
          'Last name length must be greater than 2'
        );
        expect(res.body.status).to.equal('failed');
        done();
      });
  });

  
});
