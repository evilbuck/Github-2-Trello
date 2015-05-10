require('mocha');
var chai = require('chai');
var request = require('supertest');
var server = require('../server');
expect = chai.expect;

before(function() {
  console.log('starting tests');
  server();
});

it('expects true to be true', function() {
  expect(true).toEqual(true);
});

it('expects true to not be true', function() {
  expect(true).toEqual(false);
});
