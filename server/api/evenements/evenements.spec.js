'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/evenements', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/evenements')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        //because should return an empty object at startup
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
