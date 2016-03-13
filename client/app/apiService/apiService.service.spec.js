'use strict';

describe('Service: apiService', function () {


  // load the service's module
  beforeEach(module('designEnRechercheApp'));

  // instantiate service
  var apiService,
      $httpBackend,
      scope;

  var baseUrl       = '/api/',
        evenements    = 'evenements/',
        membres       = 'membres/',
        aPropos       = 'a-propos/',
        contact       = 'contact/',
        prochainsEvts = 'prochains-evenements/',
        search        = 'search',
        introduction  = 'introduction',
        reseaux       = 'reseaux',
        factory       = {};

  beforeEach(inject(function (_apiService_, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    apiService = _apiService_;
    $httpBackend = _$httpBackend_;

    var mockListeEvenements = [];
    $httpBackend.whenGET(baseUrl + evenements).respond(200, mockListeEvenements);;
    $httpBackend.whenGET(baseUrl + evenements + 'pimpalou').respond(404, undefined);

    var lesMethodesMock = {title : 'les méthodes mock'};
    $httpBackend.whenGET(baseUrl + evenements + 'les-methodes').respond(200, lesMethodesMock);


  }));


  afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
  });


  it('should have all functions exposed', function () {
    expect(apiService.getEvenements).toBeDefined();
    expect(apiService.getMembres).toBeDefined();
    expect(apiService.getAPropos).toBeDefined();
    expect(apiService.getContact).toBeDefined();
    expect(apiService.getIntroduction).toBeDefined();
    expect(apiService.getProchainsEvts).toBeDefined();
    expect(apiService.getReseaux).toBeDefined();
    expect(apiService.search).toBeDefined();
  });

  it('should get evenements list', function(){

      apiService.getEvenements(undefined, function(e, d){
        expect(d).toBeDefined();
        expect(d).toBeArray();
      });

      $httpBackend.flush();
  });


  it('should get an evenement that exists', function(){
    apiService.getEvenements('les-methodes', function(e, d){
        expect(d.title).toBeDefined();
      });
    $httpBackend.flush();
  });

  it('should not get an evenement that does not exist', function(){
    apiService.getEvenements('pimpalou', function(e, d){
        expect(d).not.toBeDefined();
      });
    $httpBackend.flush();
  });

  //other endpoints have exactly the same behaviour so I guess it is not urgent to test all of them


});
