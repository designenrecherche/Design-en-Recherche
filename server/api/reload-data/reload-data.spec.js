'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/reload-data/', function() {

  setTimeout(function(){
    it('should redirect', function(done) {
      request(app)
        .get('/api/reload-data/')
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          res.header['location'].should.include('/')
          done();
        });
    });
  }, 5000);
});
