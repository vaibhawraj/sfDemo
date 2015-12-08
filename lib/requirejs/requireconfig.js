//requireconfig.js


requirejs.config({
    baseUrl: 'lib',
    paths: {
        main : '../js',
        jquery : 'jquery/jquery',
        jqueryMobile : 'jquery-mobile/jquery.mobile-1.4.5',
        angularjs : 'angularjs/angular.min.js',
        forceTk : 'forcetk/forcetk.js',
        helper: '../js/helper',
        utility: '../js/helper/utility'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['main/main']);