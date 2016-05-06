(function() {
  "use strict";

  angular
    .module("app")
    .factory("authErrorRedirect", authErrorRedirect);

  authErrorRedirect.$inject = ["$log", "$q"];

  function authErrorRedirect($log, $q) {
    return {
      responseError: readStatusAndHandleAuthError
    };

    function readStatusAndHandleAuthError(err) {
      var status = err.status;

      if (err.status === 401 || err.status === 403) {
        $log.debug(`${status} response received! Redirecting user to signin.`);
        $state.go('signin');
      }

      return($q.reject(err));
    }
  }

})();
