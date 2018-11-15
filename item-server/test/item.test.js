const app = require('../app');
const Item = require('../models/item');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const token = jwt.sign({foo:'bar'}, process.env.JWT_KEY);

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
                expect(res.body.message).to.equal('Please provide a valid token');
                done();
            });    
    });

    it ('should return status 201 if inputs are valid', (done) => {
        

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
        
        
        prototype.name = '';
        prototype.source = '';

        chai.request(app)
            .post('/')
            .set({token: token})
            .send(prototype)
            .end( (err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("name can't be empty");
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

describe('/GET ONE DATA', function(done) {
    
    it('should return status 200 if some spesific data is fetched', (done) => {
        

        let newItem = new Item({name: 'testing', source: 'test'});

        newItem.save().then((item) => {
            
            let id = item._id;

            chai.request(app)
                .get(`/${id}`)
                .set({token: token})
                .end( (err, res) => {
                   
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('item successfully fetched');


                    Item.deleteMany({}).then((result) => {
                        done()
                    }).catch((err) => {
                        console.log(err);
                    });
                });
        });
        
    });

    it('should return status 400 if params is not found', (done) => {
        chai.request(app)
            .get('/1')
            .set({token: token})
            .end( (err, res) => {
                
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('unable to find the item');

                done();
            })
    });
    

});

describe('/DELETE item', function(done) {

    it('should return status 200 if item is deleted', (done) => {
        let newItem = new Item({name: 'bar', source: 'foo'});

        newItem.save().then((item) => {
            
            let id = item._id;

            chai.request(app)
                .del(`/${id}`)
                .set({token: token})
                .end( (err, res) => {
                   
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('item has been deleted');

                    done();
                });
        });
    });

    it('should return status 400 if item is not found', (done) => {
        chai.request(app)
            .del(`/1`)
            .set({token: token})
            .end( (err, res) => {
                
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('unable to delete the data');

                done();
            });
    });
});

describe('/PUT item', function(done) {
    let updatedData = {
        name: 'updated',
        source: 'updated'
    }

    it('should successfully update the item if the input is valid', (done) => {
        
        let itemToUpdate = new Item({name: 'testing', source: 'test'});

        itemToUpdate.save().then((item) => {
            
            let id = item._id;
            
            chai.request(app)
                .put(`/${id}`)
                .send(updatedData)
                .set({token: token})
                .end( (err, res) => {
                   
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('item has been updated');

                    Item.deleteMany({}).then((result) => {
                        done()
                    }).catch((err) => {
                        console.log(err);
                    });
                });
        });
    });

    it('should fail to update the item if the id is invalid', (done) => {
        chai.request(app)
                .put(`/1`)
                .send(updatedData)
                .set({token: token})
                .end( (err, res) => {
                    console.log(res.body);
                    expect(res.status).to.equal(400);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('unable to find and update the data');

                    done();
                });
    });

    it('should fail to update the item if the input is invalid', (done) => {
        
        let itemToUpdate = new Item({name: 'testing', source: 'test'});
        
        itemToUpdate.save().then((item) => {
            
            let id = item._id;
            
            chai.request(app)
                .put(`/${id}`)
                .send()
                .set({token: token})
                .end( (err, res) => {
                   
                    expect(res.status).to.equal(400);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal("name can't be empty");

                    Item.deleteMany({}).then((result) => {
                        done()
                    }).catch((err) => {
                        console.log(err);
                    });
                });
        });
    });
    
    

});