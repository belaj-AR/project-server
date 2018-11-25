require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const axios = require('axios');
const expect = require('chai').expect;
const { uriServerUserAdmin, uriServerMatch, uriServerUser } = require('../config/index');


const jwt = require('jsonwebtoken');
const app = require('../app');
let adminToken = jwt.sign({foo:'bar'}, process.env.JWT_TESTING)

describe('/POST Matches', function(done) {

    let userIdOne = '';
    let userIdTwo = '';
    let tokenOne = '';
    let tokenTwo = '';
    
    
    beforeEach((done) => {
        let createUserOne = axios({
            method: 'POST',
            url: `${uriServerUser}`,
            data: {
                fname: 'john',
                lname: 'doe',
                email: 'johndoe@gmail.com',
                uid: '123456'
            }
        });
        
        let createUserTwo = axios({
            method: 'POST',
            url: `${uriServerUser}`,
            data: {
                fname: 'doe',
                lname: 'john',
                email: 'doejohn@gmail.com',
                uid: '654321'
            }
        });
        
        Promise.all([createUserOne, createUserTwo]).then((result) => {

            let loginOne = axios({
                method: 'POST',
                url: `${uriServerUser}/token`,
                data: {
                    email: 'johndoe@gmail.com',
                    uid: '123456'
                }
            });

            let loginTwo = axios({
                method: 'POST',
                url: `${uriServerUser}/token`,
                data: {
                    email: 'doejohn@gmail.com',
                    uid: '654321'
                }
            });

            Promise.all([loginOne, loginTwo]).then((result) => {
                
                tokenOne = result[0].data.token
                tokenTwo = result[1].data.token

                let getUserIdOne = axios({
                    method: 'GET',
                    url: `${uriServerUser}`,
                    headers: {
                        token : tokenTwo
                    }
                })
                
                let getUserIdTwo = axios({
                    method: 'GET',
                    url: `${uriServerUser}`,
                    headers: {
                        token : tokenTwo
                    }
                })

                Promise.all([getUserIdOne, getUserIdTwo]).then((result) => {
                    userIdOne = result[0].data.data.id;
                    userIdTwo = result[1].data.data.id;
                    done();
                })
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });

    });

    afterEach((done) => {
        axios({
            method: 'POST',
            url: uriServerUserAdmin,
            headers: {
                token: adminToken
            }
        }).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    });

    it('should return status 201 if match has been registered', (done) => {
        chai.request(app)
            .post('/matches')
            .set({token: tokenOne})
            .send({
                winner: userIdOne,
                loser: userIdTwo
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('match history has been created');
                done();
            });
    });

    it('should return status 400 if winner is not specified', (done) => {
        chai.request(app)
            .post('/matches')
            .set({token: tokenOne})
            .send({
                winner: '',
                loser: userIdTwo
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('winner and loser must be specified');
                done();
            });
    }); 
    
    it('should return status 200 if match history has been fetched', (done) => {
        chai.request(app)
            .get('/matches')
            .set({token: tokenOne})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('data');
                done();
            });
    })

    it('should return status 400 if token is invalid', (done) => {
        chai.request(app)
            .get('/matches')
            .set({token: 'fake'})
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('failed');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('wrong token')
                done();
            });
    });

    it('should return status 400 if token is not provided', (done) => {
        chai.request(app)
            .get('/matches')
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('failed');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('You need to login first');
                done();
            });
    });

    it('should return status 400 if match is not found', (done) => {
        chai.request(app)
            .get(`/matches/123`)
            .set({token: tokenOne})
            .end((err, res) => {
                expect(res.status).to.equal(400);
                done();
            });
    });
})
