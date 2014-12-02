'use strict';

describe('Controller: PersonneNameCtrl', function () {

  // load the controller's module
  beforeEach(module('derCleanApp'));

  var PersonneNameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersonneNameCtrl = $controller('PersonneNameCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
