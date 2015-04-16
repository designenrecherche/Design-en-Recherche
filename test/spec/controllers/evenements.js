'use strict';

describe('Controller: EvenementsCtrl', function () {

  // load the controller's module
  beforeEach(module('derCleanApp'));

  var EvenementsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EvenementsCtrl = $controller('EvenementsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
