'use strict';

describe('Directive: fitNav', function () {

  // load the directive's module
  beforeEach(module('designEnRechercheApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  // it('should make hidden element visible', inject(function ($compile) {
  //   element = angular.element('<fit-nav></fit-nav>');
  //   element = $compile(element)(scope);
  //   expect(element.text()).toBe('this is the fitNav directive');
  // }));
});
