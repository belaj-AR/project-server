require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const app = require('../app');
const Match = require('../models/match');
const User = require('../models/userModel')


chai.use(chaiHttp);


describe('/GET Matches', function(done) {
    let userIdOne = '';
    let userIdTwo = '';
    let token = '';
    let fakeToken = '';
    let matchIdToFind = '';

    before((done) => {
        let userOne = User.create({
            fname: 'anon',
            lname: 'doe',
            email: 'anon@mail.com',
            uid: '123456'
        });
        
        let userTwo = User.create({
            fname: 'john',
            lname: 'doe',
            email: 'john@mail.com',
            uid: '654321'
        });

        Promise.all([userOne, userTwo]).then((result) => {
            userIdOne = result[0]._id;
            userIdTwo = result[1]._id
            token = jwt.sign({id:userIdOne}, process.env.JWT_SECRET);
            fakeToken = jwt.sign({id:'123'}, process.env.JWT_SECRET);
            done()
        }).catch((err) => {
            console.log(err);
        });
        
    });

    after((done) => {
        let deleteOne = User.deleteOne({_id: userIdOne});
        let deleteTwo = User.deleteOne({_id: userIdTwo});

        Promise.all([deleteOne, deleteTwo]).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    });

  
    beforeEach((done) => {
        Match.create({
            winner: userIdOne,
            loser: userIdTwo
        }).then((result) => {
            matchIdToFind = result._id;
            done();
        }).catch((err) => {
            console.log(err);
        });
        
    });

    afterEach( (done) => {
        
        Match.deleteOne({winner: userIdOne}).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
        
    });

    it('should return status 200 if match is found', (done) => {
        chai.request(app)
            .get('/matches')
            .set({token:token})
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('getting match data succeeds');
                expect(res.body).to.have.property('data');
                expect(res.body.data[0].winner.fname).to.equal('anon');
                expect(res.body.data[0].loser.fname).to.equal('john');
                done();
            });
    });

    it('should return status 200 if a specified match is found', (done) => {
        chai.request(app)
            .get(`/matches/${matchIdToFind}`)
            .set({token:token})
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('getting match data succeeds');
                expect(res.body).to.have.property('data');
                expect(res.body.data.winner.fname).to.equal('anon');
                expect(res.body.data.loser.fname).to.equal('john');
                done();
            });
    });

    it('should return status 400 if a specified match is not found', (done) => {
        chai.request(app)
            .get(`/matches/123`)
            .set({token:token})
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('unable to find the match');
                done();
            });
    });

    it('should return status 500 if token is not provided', (done) => {
        chai.request(app)
            .get('/matches')
            .end((err, res) => {
                expect(res.status).to.equal(500);
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('failed');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('You need to login first');
                done();
            });
    });

    it('should return status 500 if token is invalid', (done) => {
        chai.request(app)
            .get('/matches')
            .set({token:'foo'})
            .end((err, res) => {
                expect(res.status).to.equal(500);
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('failed');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('wrong token');
                done();
            });
    });


    it('should return status 400 if user id is invalid', (done) => {
        chai.request(app)
            .get('/matches')
            .set({token:fakeToken})
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('unable to find the match');
                done();
            });
    });
});

describe('/POST Matches', function(done) {
    let userIdOne = '';
    let userIdTwo = '';
    let token = '';
    let fakeToken = '';

    before((done) => {
        let userOne = User.create({
            fname: 'anon',
            lname: 'doe',
            email: 'anon@mail.com',
            uid: '123456'
        });
        
        let userTwo = User.create({
            fname: 'john',
            lname: 'doe',
            email: 'john@mail.com',
            uid: '654321'
        });

        Promise.all([userOne, userTwo]).then((result) => {
            userIdOne = result[0]._id;
            userIdTwo = result[1]._id
            token = jwt.sign({id:userIdOne}, process.env.JWT_SECRET);
            fakeToken = jwt.sign({id:'123'}, process.env.JWT_SECRET);
            done()
        }).catch((err) => {
            console.log(err);
        });
        
    });

    after((done) => {
        let deleteOne = User.deleteOne({_id: userIdOne});
        let deleteTwo = User.deleteOne({_id: userIdTwo});
        let clearMatches = Match.deleteMany();

        Promise.all([deleteOne, deleteTwo, clearMatches]).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    });

    afterEach((done) => {
        Match.deleteMany().then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });

    })

    it('should return status 201 if match has been added', (done) => {
        chai.request(app)
            .post('/matches')
            .send({
                winner: userIdOne,
                loser: userIdTwo
            })
            .set({token: token})
            .end( (err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('match history has been created');
                done();
            });
    });

    it('should return status 400 if winner is not provided', (done) => {
        chai.request(app)
            .post('/matches')
            .send({
                winner: '',
                loser: userIdTwo
            })
            .set({token: token})
            .end( (err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('winner and loser must be specified');
                done();
            });
    });

    it('should return status 400 if winner Id is not valid', (done) => {
        chai.request(app)
            .post('/matches')
            .send({
                winner: '1234',
                loser: userIdTwo
            })
            .set({token: token})
            .end( (err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('winner and loser must be specified');
                done();
            });
    });
    
    
})
  