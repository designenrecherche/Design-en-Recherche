'use strict';

describe('Service: ngTranslate', function () {

  // load the service's module
  beforeEach(module('derCleanApp'));

  // instantiate service
  var ngTranslate;
  beforeEach(inject(function (_ngTranslate_) {
    ngTranslate = _ngTranslate_;
  }));

  it('should do something', function () {
    expect(!!ngTranslate).toBe(true);
  });

});
