//NB : this script is used for karma unit testing using angularytics.
//Indeed, without it, karma test of the app all failed throwing "Reference Error : ga is not defined"
//I supposed this error was raised because when testing angularytics-composed app, index.html is not set and so neither google analytics base script which is required by angularytics
//Karma unit tests are working with this patch now, so I guess I was right !
(function(i,s,o,g,r,a,m) {i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-55178362-1', 'auto'); ga('send', 'pageview');
