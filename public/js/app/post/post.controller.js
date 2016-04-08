(function() {
  "use strict";

  angular
    .module("app")
    .controller("PostController", PostController);

  PostController.$inject = ["$log", "authService", "$http", "$state"];

  function PostController($log, authService, $http, $state) {
    $log.info("PostController loaded");
    var vm = this;
    vm.authService = authService;

    // Initializing variables for posts
    vm.formOpen           = false;
    vm.posts              = [];
    vm.myPosts            = [];
    vm.newPost            = {};
    vm.newPost.skillLevel = "";
    vm.skillLevels        = ["beginner", "intermediate", "advanced"];

    // Binding for Translations
    vm.newTranslate = {};
    vm.translations = [];

    // MomentJS to transform date
    vm.formatDate = function(date) {
      return moment(date).fromNow();
    };

    // Post functions
    vm.createPost = function() {
      var newPost = {
        body:       vm.newPost.body,
        language:   vm.newPost.language,
        skillLevel: vm.newPost.skillLevel,
        author:     authService.currentUser(),
      };
      $http({
        method: "POST",
        url:    "/api/posts",
        data:   newPost
      })
      .then(function(res) {
        vm.getPosts();
        vm.formOpen = !vm.formOpen;
        $state.go("posts.all");
      },
      function(err) {
        $log.debug("Error: ", err);
      });
      vm.newPost = {};
    }

    vm.getPosts = function() {
      $http({
        method: "GET",
        url:    "api/posts"
      })
      .then(function(res) {
        vm.posts = res.data.reverse();
        vm.myPosts = res.data.filter(function(post) {
          return post.author.email === authService.currentUser().email;
        })
      },
      function(err) {
        $log.info("Error: ", err);
      });
    }

    vm.getPosts();

    vm.deletePost = function(post) {
      $http({
        method: "DELETE",
        url:    "api/posts/" + post._id,
      })
      .then(function(res) {
        var index = vm.posts.indexOf(post);
        vm.posts.splice(index, 1);
      },
      function(err) {
        $log.debug(err);
      })
    }
  }
})();
