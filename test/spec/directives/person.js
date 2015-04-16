'use strict';

describe('Directive: person', function () {

  // load the directive's module
  beforeEach(module('derCleanApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<person></person>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the person directive');
  }));
});
