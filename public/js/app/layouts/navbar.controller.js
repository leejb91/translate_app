(function() {
  "use strict";

  angular
    .module("app")
    .controller("NavbarController", NavbarController);

  NavbarController.$inject = ["$log", "authService", "$state"];

  function NavbarController($log, authService, $state) {
    var vm = this;

    vm.authService = authService;
    vm.logOut      = logOut;

    function logOut() {
      authService.logOut();
      $state.go('welcome');
    }

    $log.debug("NavbarController loaded!");
  }
})();
