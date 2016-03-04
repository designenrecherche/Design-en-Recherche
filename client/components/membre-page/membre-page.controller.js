'use strict';

angular.module('designEnRechercheApp')
  .controller('MembreController', function ($scope) {
    if($scope.membre){
      for(var i in $scope.membre){
        var val = $scope.membre[i];
        delete $scope.membre[i];
        $scope.membre[i.toLowerCase().replace(/([\W+])/g, '')] = val;
      }
      formatMembre();
    }

    console.log($scope.membre);

    function formatMembre(){
      $scope.membre.site = $scope.membre['urlpersonalwebsiteaboutyourresearch'];
      if($scope.membre.phonepublic){
        if(($scope.membre.phonepublic+"").charAt(0) == '6')
          $scope.membre.phonepublic = '+33' + $scope.membre.phonepublic;
        else if(($scope.membre.phonepublic+"").charAt(0) == '0')
          $scope.membre.phonepublic = '+33' + $scope.membre.phonepublic.substring(1, $scope.membre.phonepublic.length);
      }

      //sites
      var sites= $scope.membre['urlotherwebsitesseparatedbycomasacademiatwitteretc'].split(',');
      var outputSites = [];
      for(var i in sites){
        var site = sites[i],out = {};
        out.url = site.trim();
        if(site.indexOf('facebook')> -1)
          out.text = "Facebook";
        else if(site.indexOf('twitter')> -1)
          out.text = "Twitter";
        else if(site.indexOf('linkedin')> -1)
          out.text = "LinkedIn";
        else if(site.indexOf('academia')> -1)
          out.text = "Academia";
        else if(site.indexOf('flickr')> -1)
          out.text = "Flickr";
        else out.text = site.trim();
        if(out.text){
          outputSites.push(out);
        }
      }
      $scope.membre.sites = outputSites;
    }

    $scope.pageClass = 'page-personne';


    $scope.buildAffiliation = function(){
        if($scope.membre){

            var m = $scope.membre;
            var affiliation1 = "";
            var output = "";

            if(m.etablissement1){
                affiliation1 += m.etablissement1;
                if(m.laboratoire1)
                    affiliation1 += ", " + m.laboratoire1;
                if(m["équipe1"])
                    affiliation1 += ", " + m["équipe1"];
            }
            if(affiliation1!="")
                output += "<li>" + affiliation1 + ".</li>";

            var affiliation2 = "";
            if(m.etablissement2){
                affiliation2 += m.etablissement2;
                if(m.laboratoire2)
                    affiliation2 += ", " + m.laboratoire2;
                if(m["équipe2"])
                    affiliation2 += ", " + m["équipe2"];
            }
            if(affiliation2!="")
                output += "<li>" + affiliation2 + ".</li>";

            var affiliation3 = "";
            if(m.etablissement3){
                affiliation3 += m.etablissement1;
                if(m.laboratoire3)
                    affiliation3 += ", " + m.laboratoire3;
                if(m["équipe1"])
                    affiliation3 += ", " + m["équipe3"];
            }
            if(affiliation3!="")
                output += "<li>" + affiliation3 + ".</li>";


            return '<ul class="affiliations">' + output + '</ul>';
        }
        return "";

    }


    $scope.contactVisible = function(){
      if($scope.membre)
      return $scope.membre["e-mailpublic"] != "" || $scope.membre.phonepublic != ""
      || $scope.membre.urlpersonalwebsiteaboutyourresearch != "";
      else return false;
    }
  });
