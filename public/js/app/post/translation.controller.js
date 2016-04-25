(function() {
  "use strict";

  angular
    .module("app")
    .controller("TranslationController", TranslationController);

  TranslationController.$inject = ["$log", "authService", "$http", "$state", "$stateParams"];

  function TranslationController($log, authService, $http, $state, $stateParams) {
    $log.info("TranslationController loaded:");
    var vm = this;

    getPost($stateParams.id);

    vm.authService = authService;

    // vm.formOpen           = false;
    vm.skillLevels        = ["beginner", "intermediate", "advanced"];

    // Binding for Translations
    vm.newTranslate = {};
    vm.createTranslate   = createTranslate;
    vm.deleteTranslation = deleteTranslation;

    // MomentJS to transform date
    vm.formatDate = function(date) {
      return moment(date).fromNow();
    };

    // Translation functions
    function getPost(id) {
      $http({
        method: "GET",
        url:    `api/posts/${id}/translations`
      })
      .then(function(res) {
        vm.post = res.data;
      },
      function(err) {
        $log.info("Error: ", err);
      })
    }

    function createTranslate() {
      var newTranslate = {
        body:   vm.newTranslate.body,
        author: authService.currentUser(),
      }
      $http({
        method: "POST",
        url:    `/api/posts/${$stateParams.id}/translations`,
        data:   newTranslate
      })
      .then(function(res) {
        vm.newTranslate = {};
        vm.post = res.data;
      }, function(err) { $log.info(err); })
    }

    function deleteTranslation(post, translation) {
      $http({
        method: "DELETE",
        url:    `api/posts/${post._id}/translations/${translation._id}`,
        data:   { postId: post._id }
      })
      .then(function(res) {
        var index = vm.post.translations.indexOf(translation);
        vm.post.translations.splice(index, 1);
      },
      function(err) {
        $log.debug(err);
      })
    }

  }
})();
