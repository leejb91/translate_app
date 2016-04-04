(function() {
  "use strict";

  angular
    .module("app")
    .controller("PostController", PostController);

  PostController.$inject = ["$log", "authService", "$http"];

  function PostController($log, authService, $http) {
    $log.info("PostController loaded");
    var vm = this;
    vm.getPosts   = getPosts;
    vm.createPost = createPost;
    vm.deletePost = deletePost;

    vm.posts = [];

    vm.getPosts();

    function createPost() {
      var newPost = {
        body:     vm.newPost.body,
        language: vm.newPost.language,
        author:   authService.currentUser()._id,
      };

      $http({
        method: "POST",
        url:    "/api/posts",
        data:   newPost
      })
      .then(function(res) {
        $log.info(res.data);
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
        $log.info(res.data.posts);
        vm.posts = res.data.posts;
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
        var index = posts.indexOf(post);
        posts.splice(index, 1);
      })
    }

  }
})();
