'use strict';

describe('Controller: PerdudanslebrouillarddudesignCtrl', function () {

  // load the controller's module
  beforeEach(module('derCleanApp'));

  var PerdudanslebrouillarddudesignCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PerdudanslebrouillarddudesignCtrl = $controller('PerdudanslebrouillarddudesignCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
