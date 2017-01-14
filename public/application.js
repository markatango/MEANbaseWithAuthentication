var mainApplicationModuleName = "mean";

var mainApplicationModule = angular.module(mainApplicationModuleName, ['ngResource', 'ngRoute', 'users', 'example', 'articles', 'chat']); // creates the angular module.

/*

ngRoute is injected in module,'example' also, so redundant here

*/

mainApplicationModule.config(['$locationProvider', function($locationProvider){
    $locationProvider.hashPrefix('!');
}]);

if (window.location.hash === '#_=_' || window.location.hash === '#') {
    //Fixing facebook bug with redirect
    window.location.hash = '#!';
  } else if(window.location.hash.length === 0) {
    // Without this, after G+ auth we started taking:
    // Uncaught Error: [$location:ihshprfx] Invalid url "https://streetspin.com/#", missing hash prefix "#!"
    // needs to be root caused at some point
    window.location.hash = '#!/';
  }



angular.element(document).ready(function(){
    angular.bootstrap(document, [mainApplicationModuleName]);
});

