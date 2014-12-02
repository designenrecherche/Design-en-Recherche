'use strict';

describe('Controller: MembresCtrl', function () {

  // load the controller's module
  beforeEach(module('derCleanApp'));

  var MembresCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MembresCtrl = $controller('MembresCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
