'use strict';

/**
 * @ngdoc overview
 * @name derCleanApp
 * @description
 * # derCleanApp
 *
 * Main module of the application.
 */
angular
  .module('derCleanApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'angularytics'
  ])
  .config(function ($routeProvider, $translateProvider, AngularyticsProvider) {
    
    //AngularyticsProvider.setEventHandlers(['Console', 'GoogleUniversal']);

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/membres', {
        templateUrl: 'views/membres.html',
        controller: 'MembresCtrl'
      })
      .when('/reseau', {
        templateUrl: 'views/reseau.html',
        controller: 'ReseauCtrl'
      })
      .when('/evenements', {
        templateUrl: 'views/evenements.html',
        controller: 'EvenementsCtrl'
      })
      .when('/evenements/methodes', {
        templateUrl: 'views/methodes.html',
        controller: 'EvenementsMethodesCtrl'
      })
      .when('/evenements/projet', {
            templateUrl: 'views/projet.html',
            controller: 'ProjetCtrl'
        })
      .when('/membres/:name', {
        templateUrl: 'views/personne.html',
        controller: 'PersonneNameCtrl'
      })
      .when('/personne/:name', {
        redirectTo:'/membres/:name'
      })
      .when('/perdudanslebrouillarddudesign', {
        templateUrl: 'views/perdudanslebrouillarddudesign.html',
        controller: 'PerdudanslebrouillarddudesignCtrl'
      })
      .otherwise({
        redirectTo: '/perdudanslebrouillarddudesign'
      });


      //traductions
      // On stocke les valeurs courantes dans cet objet
    $translateProvider.translations('en', {

        "RESEAUBASELINE" : "réseau des jeunes chercheurs en design",
        'TOOGLENAV' : 'ouvrir/fermer la navigation',
        'NETWORKNAV' : 'à propos',
        'ABOUTNAV' : 'À propos',
        'MEMBERSNAV' : 'Annuaire des membres',
        'EVENTSNAV' : 'les évènements',
        'CONTACTNAV' : 'Contact',

        'CONTACTTEXT' : 'Contactez-nous via : designenrecherche[at]gmail.com',


        'PRESENTATION' : 'Le groupe de travail « Design en recherche », formé en mars 2013, est un réseau de doctorant-e-s et jeunes docteur-e-s dont les recherches portent sur les thématiques émergentes d’étude et de pratique du design. Constituée en association (loi 1901) depuis décembre 2013, nous sommes persuadé-e-s de l’intérêt scientifique des espaces de collaboration entre les jeunes chercheur-e-s issu(e)s d’horizons disciplinaires, institutionnels et géographiques divers, mais travaillant sur des thèmes communs.',

        'TWITTERFEED' : 'Derniers tweets des membres',
        'TWITTERGO' : 'Se rendre sur le compte du réseau',


        'SEARCHTEXT' : 'Chercher un membre',
        'ORDERBY' : 'Ordonner par',
        'DIRECTORYNAME' : 'nom',
        'DIRECTORYLAB' : 'laboratoire',
        'DIRECTORYUNIVERSITY' : 'université',
        'DIRECTORYSUPERVISOR' : 'directeur de recherche',

        'MOREINFO' : 'plus d\'informations',


        'BLOGGO' : 'Aller sur le carnet de recherches',
        'BLOGINFOS' : 'Hypotheses est une plateforme de carnets de recherches en sciences humaines et sociales. Nous y postons nos actualités et productions.',

        
        'BLOGNAV' :  'carnet hypothèses',
        'TWITTERNAV' :  'twitter',
        'LANGUAGENAV' : 'Fr',
        'LANGUAGENAV2' : 'En',

        'ABOUT' : 'à propos test',
        'DEMO' : 'test de la demo',
        'ANIMATION' : 'des tas d\'animations'
        
        /*"RESEAUBASELINE" : "young french design researchers network",
        'TOOGLENAV' : 'toogle navigation',
        'NETWORKNAV' : 'about',
        'ABOUTNAV' : 'À propos',
        'MEMBERSNAV' : 'members directory',
        'EVENTSNAV' : 'the events',

        'CONTACTNAV' : 'Contact',

        'BLOGNAV' :  'scholarly blog',
        'TWITTERNAV' :  'twitter',
        'LANGUAGENAV' : 'En',
        'LANGUAGENAV2' : 'Fr',


        'TWITTERFEED' : 'Last members\' tweets',
        'TWITTERGO' : 'Go to the network\'s account',

        'BLOGGO' : 'Go to the scholarly blog',
        'BLOGINFOS' : 'Hypotheses is a scholarly platform for humanities and social sciences blogging communities. We post here our different news and productions.',

        'PRESENTATION' : 'Design en recherche is a network of young researchers dedicated to design research. It aims at disseminating scientific information, creating conditions for collaboration between young researchers and initiating a methodological and theoretical dialogue on design research on a national scale (even international) and to gather the various actors of this research, whatever their institutions.',

        'CONTACTTEXT' : 'Contact us via : designenrecherche[at]gmail.com',


        'SEARCHTEXT' : 'Search member',
        'ORDERBY' : 'Order by',
        'DIRECTORYNAME' : 'name',
        'DIRECTORYLAB' : 'laboratory',
        'DIRECTORYUNIVERSITY' : 'university',
        'DIRECTORYSUPERVISOR' : 'supervisor',

        'MOREINFO' : 'more informations',

        'ABOUT' :  'test_en',
        'DEMO' : 'test of the english version',
        'ANIMATION' : 'tons of animations'*/
    });   

    $translateProvider.translations('fr', {
        "RESEAUBASELINE" : "Le réseau des jeunes chercheurs en design",
        'TOOGLENAV' : 'ouvrir/fermer la navigation',
        'NETWORKNAV' : 'à propos',
        'ABOUTNAV' : 'À propos',
        'MEMBERSNAV' : 'Annuaire des membres',
        'EVENTSNAV' : 'les évènements',
        'CONTACTNAV' : 'Contact',

        'CONTACTTEXT' : 'Contactez-nous via : designenrecherche[at]gmail.com',


        'PRESENTATION' : 'Le groupe de travail « Design en recherche », formé en mars 2013, est un réseau de doctorant-e-s et jeunes docteur-e-s dont les recherches portent sur les thématiques émergentes d’étude et de pratique du design. Constituée en association (loi 1901) depuis décembre 2013, nous sommes persuadé-e-s de l’intérêt scientifique des espaces de collaboration entre les jeunes chercheur-e-s issu(e)s d’horizons disciplinaires, institutionnels et géographiques divers, mais travaillant sur des thèmes communs.',

        'TWITTERFEED' : 'Derniers tweets des membres',
        'TWITTERGO' : 'Se rendre sur le compte du réseau',


        'SEARCHTEXT' : 'Chercher un membre',
        'ORDERBY' : 'Ordonner par',
        'DIRECTORYNAME' : 'nom',
        'DIRECTORYLAB' : 'laboratoire',
        'DIRECTORYUNIVERSITY' : 'université',
        'DIRECTORYSUPERVISOR' : 'directeur de recherche',

        'MOREINFO' : 'plus d\'informations',


        'BLOGGO' : 'Aller sur le carnet de recherches',
        'BLOGINFOS' : 'Hypotheses est une plateforme de carnets de recherches en sciences humaines et sociales. Nous y postons nos actualités et productions.',

        
        'BLOGNAV' :  'carnet hypothèses',
        'TWITTERNAV' :  'twitter',
        'LANGUAGENAV' : 'Fr',
        'LANGUAGENAV2' : 'En',

        'ABOUT' : 'à propos test',
        'DEMO' : 'test de la demo',
        'ANIMATION' : 'des tas d\'animations'
    });   

    $translateProvider.preferredLanguage('fr');
  })
.run(function(Angularytics) {
    Angularytics.init();
  });


