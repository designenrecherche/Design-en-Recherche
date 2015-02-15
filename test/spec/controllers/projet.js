'use strict';

describe('Controller: ProjetCtrl', function () {

  // load the controller's module
  beforeEach(module('derCleanApp'));

  var ProjetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjetCtrl = $controller('ProjetCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
