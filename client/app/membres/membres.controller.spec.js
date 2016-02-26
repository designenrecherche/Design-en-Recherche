'use strict';

describe('Controller: MembresCtrl', function () {

  // load the controller's module
  beforeEach(module('designEnRechercheApp'));

  var MembresCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MembresCtrl = $controller('MembresCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
