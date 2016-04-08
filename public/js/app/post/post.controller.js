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

    // MomentJS to transform date
    vm.formatDate = function(date) {
      return moment(date).fromNow();
    };

    // Translation functions
    vm.createTranslate = function() {
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

    vm.deleteTranslation = function(post, translation) {
      $log.info("deleting translation", post._id, translation._id);
      $http({
        method: "DELETE",
        url:    `api/posts/${post._id}/translations/${translation._id}`,
        data:   { postId: post._id }
      })
      .then(function(res) {
        $log.info("splicing the stuff??");
        var index = vm.translations.indexOf(translation);
        vm.translations.splice(index, 1);
      },
      function(err) {
        $log.debug(err);
      })
    }

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
