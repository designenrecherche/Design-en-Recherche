'use strict';

describe('Controller: EvenementsCtrl', function () {

  // load the controller's module
  beforeEach(module('designEnRechercheApp'));

  var EvenementsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EvenementsCtrl = $controller('EvenementsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
