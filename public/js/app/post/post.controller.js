(function() {
  "use strict";

  angular
    .module("app")
    .controller("PostController", PostController);

  PostController.$inject = ["$log", "authService", "$http", "$state"];

  function PostController($log, authService, $http, $state) {
    $log.info("PostController loaded");
    var vm = this;
    vm.getPosts     = getPosts;
    vm.createPost   = createPost;
    vm.deletePost   = deletePost;
    vm.showPost     = showPost;
    // vm.selectedPost = {};

    vm.posts = [];

    vm.getPosts();

    function createPost() {
      var newPost = {
        body:     vm.newPost.body,
        language: vm.newPost.language,
        author:   authService.currentUser(),
      };
      $http({
        method: "POST",
        url:    "/api/posts",
        data:   newPost
      })
      .then(function(res) {
        getPosts();
      },
      function(err) {
        $log.debug("Error: ", err);
      });
      vm.newPost = {};
    }

    function getPosts() {
      $http({
        method: "GET",
        url:    "api/posts"
      })
      .then(function(res) {
        vm.posts = res.data.posts.reverse();
        vm.selectedPost = "";
      },
      function(err) {
        $log.info("Error: ", err);
      });
    }

    function deletePost(post) {
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

    function showPost(post) {
      vm.selectedPost = post;
      $log.info("the selected post", vm.selectedPost);
      vm.posts = [];
    }

  }
})();
