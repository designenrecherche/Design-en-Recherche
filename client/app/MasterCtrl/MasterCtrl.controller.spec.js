'use strict';

describe('Controller: MasterCtrl', function () {

  // load the controller's module
  beforeEach(module('designEnRechercheApp'));

  var MasterCtrlCtrl, scope, $location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$location_) {
    scope = $rootScope.$new();
    $location = _$location_;
    MasterCtrlCtrl = $controller('MasterCtrl', {
      $scope: scope
    });
  }));

  it('should go to search page when asked', function () {
    scope.globalSearch = 'coucou';

    scope.goToSearchPage();
    expect($location.path()).toEqual('/recherche');
    expect($location.search().q).toBeDefined();
    expect($location.search().q).toEqual('coucou');

  });
});
