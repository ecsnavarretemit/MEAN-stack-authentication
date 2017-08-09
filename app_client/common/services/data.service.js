(function() {

  angular
    .module('meanApp')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'authentication'];
  function meanData ($http, authentication) {

    var getProfile = function () {
      // set jwt to true to inject the Authorization header automatically
      return $http.get('/api/profile', {
        jwt: true
      });
    };

    return {
      getProfile : getProfile
    };
  }

})();