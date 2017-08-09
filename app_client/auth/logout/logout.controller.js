(function () {

  angular
  .module('meanApp')
  .controller('logoutCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', 'authentication'];
  function loginCtrl($location, authentication) {
    // logout the user
    authentication.logout();

    // redirect to the homepage
    $location.path('/');
  }

})();