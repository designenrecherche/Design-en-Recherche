'use strict';

describe('Directive: derLogo', function () {

  // load the directive's module
  beforeEach(module('derCleanApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<der-logo></der-logo>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the derLogo directive');
  }));
});
