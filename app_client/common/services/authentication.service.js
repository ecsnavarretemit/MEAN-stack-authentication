(function () {

  angular
    .module('meanApp')
    .service('authentication', authentication)
    .factory('jwtInjector', jwtInjector)
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('jwtInjector');
    }])
    ;

  jwtInjector.$inject = ['$window'];
  function jwtInjector($window) {
    return {
      request: function(config) {

        // inject JWT token in the HTTP request headers using the header field: Authorization
        if (
          typeof $window.localStorage['mean-token'] !== 'undefined' &&
          typeof config.jwt !== 'undefined' &&
          config.jwt === true
        ) {
          config.headers['Authorization'] = 'Bearer ' + $window.localStorage['mean-token'];
        }

        return config;
      }
    };
  }

  authentication.$inject = ['$http', '$window'];
  function authentication ($http, $window) {

    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mean-token'];
    };

    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };

    register = function(user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken(data.token);
      });
    };

    login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken(data.token);
      });
    };

    logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout
    };
  }


})();