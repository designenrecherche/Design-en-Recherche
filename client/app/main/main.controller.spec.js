'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('designEnRechercheApp'));

  var MainCtrl,
      scope,
      $httpBackend;


  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should have an intro status', function () {
    expect(scope.introStatus).toBe('loading');
  });

  it('should have set parent route id as main', function () {
    expect(scope.$parent.routeId).toBe('main');
  });
});
