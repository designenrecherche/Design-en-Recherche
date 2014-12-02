'use strict';

describe('Controller: ReseauCtrl', function () {

  // load the controller's module
  beforeEach(module('derCleanApp'));

  var ReseauCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReseauCtrl = $controller('ReseauCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
