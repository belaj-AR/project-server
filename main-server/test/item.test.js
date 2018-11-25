require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const axios = require('axios');
const expect = require('chai').expect;
const { uriServerItem, uriServerItemAdmin } = require('../config/index');


const jwt = require('jsonwebtoken');
const app = require('../app');
let adminToken = jwt.sign({foo:'bar'}, process.env.JWT_TESTING);
let userToken = jwt.sign({foo:'bar'}, process.env.JWT_SECRET);
let crudToken = jwt.sign({header: 'upstream'}, process.env.CRUD_SECRET);
let itemTofind = '';

describe('/POST items', function(done) {
    

    after((done) => {
        axios({
            method: 'POST',
            url: uriServerItemAdmin,
            headers: {
                token: adminToken
            }
        }).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    });

    it('should return status 200 if item is successfully created', (done) => {
        chai.request(app)
            .post('/items')
            .set({token: userToken})
            .send({
                name: 'foo0',
                source: 'barrr'
            })
            .end((err, res) => {
                expect(res.status).to.equal(201);
                done();
            });
    });

    it('should return status 401 if token is not provided', (done) => {
        chai.request(app)
            .post('/items')
            .set({token: ''})
            .send({
                name: 'foo0',
                source: 'barrr'
            })
            .end((err, res) => {
                expect(res.status).to.equal(500);
                done();
            });
    });

    it('should return status 400 if name is empty', (done) => {
        chai.request(app)
            .post('/items')
            .set({token: userToken})
            .send({
                name: '',
                source: 'barrr'
            })
            .end((err, res) => {
                expect(res.status).to.equal(500);
                done();
            });
    });
});

describe('/get items', function(done) {
    after((done) => {
        axios({
            method: 'POST',
            url: uriServerItemAdmin,
            headers: {
                token: adminToken
            }
        }).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    });

    
    

    it('should return status 200 if item is successfully fetched', (done) => {
        chai.request(app)
            .get('/items')
            .set({token: userToken})
            .send({
                name: 'fooo',
                source: 'barrr'
            })
            .end((err, res) => {
                itemTofind = res.body.data.data[0]._id
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('should return status 200 if spesific item is fetched', (done) => {
        chai.request(app)
            .get(`/items/${itemTofind}`)
            .set({token: userToken})
            .send({
                name: 'fooo',
                source: 'barrr'
            })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('should return status 500 if spesific item is failed to fetch', (done) => {
        chai.request(app)
            .get(`/items/123`)
            .set({token: userToken})
            .send({
                name: 'fooo',
                source: 'barrr'
            })
            .end((err, res) => {
                expect(res.status).to.equal(500);
                done();
            });
    });

});




describe('/delete items', function(done) {
    after((done) => {
        axios({
            method: 'POST',
            url: uriServerItemAdmin,
            headers: {
                token: adminToken
            }
        }).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    });

    
    it('should return status 200 if item is failed to delete', (done) => {
        console.log(itemTofind);
        chai.request(app)
            .delete(`${uriServerItemAdmin}/${itemTofind}`)
            .set({token: userToken})
            .end((err, res) => {
                done();
            });
    });

})

