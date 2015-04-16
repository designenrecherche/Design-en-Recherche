'use strict';

describe('Controller: AnnuaireCtrl', function () {

  // load the controller's module
  beforeEach(module('derCleanApp'));

  var AnnuaireCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnnuaireCtrl = $controller('AnnuaireCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
