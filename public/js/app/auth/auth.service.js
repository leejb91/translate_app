(function () {
  'use strict';

  angular
    .module('app')
    .factory("authService", authService);

  authService.$inject = ["$log", "tokenService", "$http"];

  function authService($log, token, $http) {
    $log.debug("authService loaded!");

    var service = {
      logIn:        logIn,
      isLoggedIn:   isLoggedIn,
      logOut:       logOut,
      currentUser:  currentUser,
      refreshToken: refreshToken
    };
    return service;

    function refreshToken() {
      var promise = $http({
        method: 'POST',
        url:    '/api/users/me/token'
      })
      .then(function(res) {
        token.store(res.data.token);
        return token.decode();
      });

      return promise;
    }

    function currentUser() {
      var tokenData = token.decode();

      if (tokenData) {
        tokenData.expiresAt = Date(tokenData.exp);

        delete tokenData.exp;
        delete tokenData.iat;
      }

      $log.debug("Current user retrieved:", tokenData);

      return tokenData;
    }

    function logOut() {
      token.destroy();
      $log.debug("Logged out…");
    }

    function isLoggedIn() {
      $log.debug('running is logged in');
      return (token.retrieve() != null);
    }

    function logIn(data) {
      var promise = $http({
        method: 'POST',
        url:    '/api/token',
        data:   data
      })
      .then(
        function(res) {
          token.store(res.data.token);
          return token.decode();
        }
      );

      return promise;
    }
  }

})();
