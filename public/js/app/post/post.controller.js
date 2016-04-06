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

    // Binding for Posts
    vm.selectedPost       = {};
    vm.formOpen           = false;
    vm.posts              = [];
    vm.myPosts            = [];
    vm.newPost            = {};
    vm.newPost.skillLevel = "";
    vm.skillLevels        = ["beginner", "intermediate", "advanced"];

    // Binding for Translations
    vm.newTranslate = {};
    vm.translations = [];

    vm.languageColor = {
      KR: "red",
      JP: "blue"
    }

    vm.formatDate = function(date) {
      return moment(date).fromNow();
    };

    // Translation helper functions
    vm.createTranslate = function() {
      $log.info("trying to create a translate")
      var newTranslate = {
        body:   vm.newTranslate.body,
        author: authService.currentUser(),
      }
      $http({
        method: "POST",
        url:    `/api/posts/${vm.selectedPost._id}/translations`,
        data:   newTranslate
      })
      .then(function(res) {
        $log.info(res);
        vm.newTranslate = "";
        vm.getTranslations();
      });
    }

    vm.getTranslations = function() {
      $http({
        method: "GET",
        url:    `api/posts/${vm.selectedPost._id}/translations`
      })
      .then(function(res) {
        vm.translations = res.data.translations;
      },
      function(err) {
        $log.info("Error: ", err)
      })
    }


    // Post helper functions
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
        $state.go("posts");
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
        vm.selectedPost = "";
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

    vm.showPost = function(post) {
      vm.selectedPost = post;
      vm.getTranslations(vm.selectedPost);
    }

  }
})();
