require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const jwt = require('jsonwebtoken');
const app = require('../app');
let adminToken = jwt.sign({foo:'bar'}, process.env.JWT_TESTING);


chai.use(chaiHttp);


describe('/POST admin', function(done) {
    
    it('should clear the testing database', (done) => {
        chai.request(app)
        .post('/admin')
        .set({token: adminToken})
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('db test has been reseted');
            done();
        });
    });

    it('should fail to clear the database if the token is invalid', (done) => {
        chai.request(app)
        .post('/admin')
        .set({token: 'fake'})
        .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Please provide a valid token');
            done();
        });
    })
    

})