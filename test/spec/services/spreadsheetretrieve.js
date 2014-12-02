'use strict';

describe('Service: SpreadsheetRetrieve', function () {

  // load the service's module
  beforeEach(module('derCleanApp'));

  // instantiate service
  var SpreadsheetRetrieve;
  beforeEach(inject(function (_SpreadsheetRetrieve_) {
    SpreadsheetRetrieve = _SpreadsheetRetrieve_;
  }));

  it('should do something', function () {
    expect(!!SpreadsheetRetrieve).toBe(true);
  });

});
