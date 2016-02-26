'use strict';

describe('Controller: RechercheCtrl', function () {

  // load the controller's module
  beforeEach(module('designEnRechercheApp'));

  var RechercheCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RechercheCtrl = $controller('RechercheCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
