require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const axios = require('axios');
const expect = require('chai').expect;
const { uriServerUserAdmin } = require('../config/index');


const jwt = require('jsonwebtoken');
const app = require('../app');
let token = jwt.sign({foo:'bar'}, process.env.JWT_TESTING)

describe('register user', function(done) {
    
    afterEach((done) => {
       axios({
           method: 'POST',
           url: uriServerUserAdmin,
           headers: {
               token: token
           }
       }).then((result) => {
           done();
       }).catch((err) => {
           console.log(err);
       });

    });

    it('should register the user successfully', (done) => {
        chai.request(app)
            .post('/users/register')
            .send({
                fname: 'john',
                lname: 'doe',
                email: 'johndoe@gmail.com',
                uid: '123'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("status");
                expect(res.body).to.have.property("message");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("fname");
                expect(res.body.data).to.have.property("lname");
                expect(res.body.data).to.have.property("email");
                expect(res.body.data.fname).to.equal('john');
                expect(res.body.data.lname).to.equal('doe');
                expect(res.body.data.email).to.equal('johndoe@gmail.com');
                expect(res.body.status).to.equal("success");
                expect(res.body.message).to.equal(
                    `success creating new account with email johndoe@gmail.com`
                );
                done();
            });

    })

    it('should fail to register if input is invalid', (done) => {
        chai.request(app)
            .post('/users/register')
            .send({
                fname: '',
                lname: '',
                email: '',
                uid: ''
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('First name required');
                done();
            });

    });
});

describe('login user', function(done) {
    before((done) => {
        chai.request(app)
        .post('/users/register')
        .send({
            fname: 'john',
            lname: 'doe',
            email: 'johndoe@gmail.com',
            uid: '123'
        }).end((err, res) => {
            done();
        })
    });

    after((done) => {
        axios({
            method: 'POST',
            url: uriServerUserAdmin,
            headers: {
                token: token
            }
        }).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    })
    

    it('should login the user successfully', (done) => {
        chai.request(app)
            .post('/users/login')
            .send({
                email: 'johndoe@gmail.com',
                uid: '123'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should fail to login the user if input is invalid', (done) => {
        chai.request(app)
            .post('/users/login')
            .send({
                email: 'johndo@gmail.com',
                uid: '12'
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('wrong user data');
                done();
            });
    });  
});

describe('get user data', function(done) {
    let dataToken = '';

    before((done) => {
        chai.request(app)
        .post('/users/register')
        .send({
            fname: 'john',
            lname: 'doe',
            email: 'johndoe@gmail.com',
            uid: '123'
        }).end((err, res) => {
            chai.request(app)
            .post('/users/login')
            .send({
                email: 'johndoe@gmail.com',
                uid: '123'
            })
            .end((err, res) => {
                dataToken = res.body.token;
                done();
            });
        })
    });

    after((done) => {
        axios({
            method: 'POST',
            url: uriServerUserAdmin,
            headers: {
                token: token
            }
        }).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    })
    

    it('should get the user data successfully', (done) => {
        chai.request(app)
            .get('/users')
            .set({token: dataToken})
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body.data.email).to.equal('johndoe@gmail.com');
                expect(res.body.data.fname).to.equal('john');
                done();
            });
    });
});