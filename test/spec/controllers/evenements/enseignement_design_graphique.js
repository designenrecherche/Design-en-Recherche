'use strict';

describe('Controller: EvenementsEnseignementDesignGraphiqueCtrl', function () {

  // load the controller's module
  beforeEach(module('derCleanApp'));

  var EvenementsEnseignementDesignGraphiqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EvenementsEnseignementDesignGraphiqueCtrl = $controller('EvenementsEnseignementDesignGraphiqueCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
