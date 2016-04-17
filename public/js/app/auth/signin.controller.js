(function() {
  "use strict";

  angular
    .module("app")
    .controller("SignInController", SignInController);

  SignInController.$inject = ["$log", "authService", "userService", "$state"];

  function SignInController($log, authService, userService, $state) {
    var vm = this;

    // BINDINGS
    vm.submitSignUp = submitSignUp;
    vm.submitLogIn = submitLogIn;
    vm.conflict = false;

    // FUNCTIONS
    function submitSignUp() {
      userService
        .create(vm.signUp)
        .then(function(res) {
          return authService.logIn(vm.signUp);
        })
        .then(
          // on success
          function(decodedToken) {
            $log.debug('Logged in!', decodedToken);
            $state.go('profile');
          },
          // on error
          function(err) {
            if (err.status === 409) vm.conflict = true;
            $log.debug('Error:', err);
          }
        );
    }

    function submitLogIn() {
      authService
        .logIn(vm.logIn)
        .then(
          // on success
          function(decodedToken) {
            $log.debug('Logged in!', decodedToken);
            $state.go('posts.all');
          },
          // on error
          function(err) {
            $log.debug('Error:', err);
          }
        );
    }

    $log.debug("SignInController loaded!");
  }
})();
