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

  it("should return msg 'Last name must be contained with characther only' response error if  input ' a32'", done => {
    userData1.lname = 'a32';
    chai
      .request(app)
      .post('/users')
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(
          'Last name must be contained with characther only'
        );
        expect(res.body.status).to.equal('failed');
        done();
      });
  });

  it("should return response with properties status, message, and data new user if data complete", done => {

    chai
      .request(app)
      .post('/users')
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("status");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.have.property("fname");
        expect(res.body.data).to.have.property("lname");
        expect(res.body.data).to.have.property("email");
        expect(res.body.data.fname).to.equal(userData1.fname);
        expect(res.body.data.lname).to.equal(userData1.lname);
        expect(res.body.data.email).to.equal(userData1.email);
        expect(res.body.status).to.equal("success");
        expect(res.body.message).to.equal(
          `success creating new account with email ${userData1.email}`
        );
        done();
      })
  })

  it("should return msg 'Email already taken' response error if input with same email with another user ", done => {

    let user = new User(userData1)

    user.save().then(() => {})

    chai
      .request(app)
      .post('/users')
      .send(userData1)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.status).to.equal('failed');
        expect(res.body.message).to.equal("uid already exist");
        done();
      })
  })
});

describe('Generate Token', () => {

  afterEach(done => {
    User.deleteMany({})
      .then(() => {
        done()
      })
  });
  
  it('should return object with property token', done => {

    let user = new User(userData1)
    user.save().then(() => {})

    let dataUser = {
      email: userData1.email,
      uid: userData1.uid
    }

    chai
      .request(app)
      .post('/users/token')
      .send(dataUser)
      .end((err, res) => {
        expect(res).to.have.status(201)
        expect(res.body).to.have.property('token')
        done()
      })
  })

  it("should return msg 'wrong user data' response error if input with random non registered data", done => {

    let dataUser = {
      email: 'johndo@mail.com',
      uid: 123
    }

    chai
      .request(app)
      .post('/users/token')
      .send(dataUser)
      .end((err, res) => {
        expect(res).to.have.status(500)
        expect(res.body).to.have.property('message')
        expect(res.body.message).to.equal('wrong user data')
        done()
      })
  })
})

describe('get user data', () => {

  afterEach(done => {
    User.deleteMany({})
      .then(() => {
        done()
      })
  });
  
  it('should return current user data with properties id and fname', done => {

    let token = ''
    let user = new User(userData1)

    user.save()
      .then(({ _id, email, uid }) => {
        token = jwt.sign({
          id: _id,
          email: email,
          uid: userData1.uid
        }, process.env.JWT_SECRET)

        chai
          .request(app)
          .get('/users')
          .set({
            token
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('id');
            expect(res.body.data).to.have.property('fname');
            expect(res.body.data).to.have.property('avatar');
            expect(res.body.data).to.have.property('role');
            done();
          })
      })
  })

  it("should return error with message 'user not found' if input with random unregistered data ", done => {

    let token = ''

    token = jwt.sign({
      id: '5bec2f3c9d06a81e5d47381b',
      email: userData1.email,
      uid: userData1.uid
    }, process.env.JWT_SECRET)

    chai
      .request(app)
      .get('/users')
      .set({
        token
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('user not found')
        done();
      })
  })

  it("should return error with message 'wrong token or user not found' if input with random number data on id ", done => {

    let token = ''

    token = jwt.sign({
      id: 123,
      email: userData1.email,
      uid: userData1.uid
    }, process.env.JWT_SECRET)

    chai
      .request(app)
      .get('/users')
      .set({
        token
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('wrong token or user not found')
        done();
      })
  })

})

