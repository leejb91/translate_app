var express = require('express'),
    router  = new express.Router();

// Require controllers.
var usersCtrl = require('../controllers/users');
var postsCtrl = require('../controllers/posts');
var transCtrl = require('../controllers/translations');

// Require token authentication.
var token = require('../config/token_auth');

// users resource paths:
router.post('/users',    usersCtrl.create);
router.get( '/users/me', token.authenticate, usersCtrl.me);
router.put( '/users/me', token.authenticate, usersCtrl.update);

router.post('/token',          token.create);
router.post('/users/me/token', token.authenticate, token.refresh);

// posts resource paths:
router.get(   '/posts',     postsCtrl.index);
router.get(   '/posts/:id', postsCtrl.show);
router.post(  '/posts',     postsCtrl.create);
router.delete('/posts/:id', postsCtrl.destroy);


// translations resource paths:
router.get(   '/posts/:id/translations',           transCtrl.index);
router.post(  '/posts/:id/translations',           transCtrl.create);
router.put(   '/posts/:id/translations/:trans_id', transCtrl.update);
router.delete('/posts/:id/translations/:trans_id', transCtrl.destroy);

module.exports = router;
