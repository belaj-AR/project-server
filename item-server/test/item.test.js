const app = require('../app');
const Item = require('../models/item');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = require('chai').expect;
const jwt = require('jsonwebtoken');

describe('/POST items', function() {

    let prototype =  {
        name: 'fakeModel',
        source: 'model',
    };

    

    this.beforeEach( function(done) {
        Item.deleteOne({name: 'fakeModel', source: 'model'}).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });

        prototype =  {
            name: 'fakeModel',
            source: 'model',
        };

    });

    it('should return status 401 if token header is not provided', (done) => {
        
        chai.request(app)
            .post('/')
            .send(prototype)
            .end( (err, res) => {
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('token is required for adding a new item');
                done();
            });    
    });

    it ('should return status 201 if inputs are valid', (done) => {
        let token = jwt.sign({foo:'bar'}, process.env.JWT_KEY);

        chai.request(app)
            .post('/')
            .send(prototype)
            .set({token: token})
            .end( (err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('item has been successfully added');
                done();
            });

    });

    it ('should return status 400 if inputs are invalid', (done) => {
        let token = jwt.sign({foo:'bar'}, process.env.JWT_KEY);
        
        prototype.name = '';
        prototype.source = '';

        chai.request(app)
            .post('/')
            .set({token: token})
            .send(prototype)
            .end( (err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('input is invalid');
                done();
            });

    });

});

describe('/GET items', function(done) {

    beforeEach( function(done) {
        Item.create({
            name:'foo',
            source: 'test.com'
        }).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    });

    afterEach( function(done) {
        Item.deleteOne({name: 'foo'}).then((result) => {
            done();
        }).catch((err) => {
            console.log(err);
        });
    });

    it( 'should return status 200 if data is succesfully fetched', (done) => {
        let token = jwt.sign({foo:'bar'}, process.env.JWT_KEY);
        
        chai.request(app)
            .get('/')
            .set({token: token})
            .end( (err, res) => {
                
                let fetchedData = res.body.data[0];

                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('item successfully fetched');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.be.a('array');
                expect(res.body.data.length).to.equal(1);
                expect(fetchedData).to.have.property('name');
                expect(fetchedData.name).to.equal('foo');
                expect(fetchedData).to.have.property('source');
                expect(fetchedData.source).to.equal('test.com');
                done();
            });
    });
    

})
