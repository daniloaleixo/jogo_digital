var app = angular.module('calcadasApp', [
'ngRoute'
]);

app.controller('blaCtrl', function($scope){
  $scope.bla = 1;
});


// app.config(function($stateProvider, $urlRouterProvider) {

//   // Ionic uses AngularUI Router which uses the concept of states
//   // Learn more here: https://github.com/angular-ui/ui-router
//   // Set up the various states which the app can be in.
//   // Each state's controller can be found in controllers.js


//   $stateProvider
    

//   .state('creditos', {
//     url: '/creditos',
//     templateUrl: 'features/creditos.html'
//   })


//   .state('sobre', {
//     url: '/sobre',
//     templateUrl: 'features/sobre.html'
//   })


//   .state('ajustes', {
//     url: '/ajustes',
//     templateUrl: 'features/ajustes.html'
//   })

// $urlRouterProvider.otherwise('/home')

  

// });