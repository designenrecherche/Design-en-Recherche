'use strict';

angular.module('designEnRechercheApp')
  .directive('twitterTimeline', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      cssUrl: "@",
      autoResize: "=",
      twitterLoaded : "="
    },
    link: function (scope, element, attrs) {
      $('body').removeAttr('data-twttr-rendered');
      var reloadCount = 0;


      element
      .attr('id', 'twitter-feed')
      .attr("width", "100%" || attrs.width)
      .attr('data-chrome', 'noheader transparent')
      .attr('data-widget-id', attrs.twitterTimeline)
      .addClass('twitter-timeline');

      function render() {
        var body = $('.twitter-timeline').contents().find('body');

        if(!body.length && reloadCount < 10){
          reloadCount++;
          console.log('reload, ', reloadCount);
          $timeout(render, 500);
          return;
        }else{
          scope.twitterLoaded = true;
        }

        if (scope.cssUrl) {
          body.append($('<link/>', { rel: 'stylesheet', href: scope.cssUrl, type: 'text/css' }));
        }

        // function setHeight() {
        //   if (body.find('.stream').length == 0) {
        //     setTimeout(setHeight, 100);
        //   } else {
        //     body.find('.stream').addClass('stream-new').removeClass('stream').css('height', 'auto').css('width', '100%');
        //     $('.twitter-timeline').css('height', (body.height() + 20) + 'px');
        //   }
        // }

        // if (scope.autoResize) {
        //   setHeight();
        // }
      }

      if (!$('#twitter-wjs').length) {
        $.getScript((/^http:/.test(document.location)?'http':'https') + '://platform.twitter.com/widgets.js', function() {
          render();
          $('.twitter-timeline').load(render);
        });
      }
    }
  };
 });
