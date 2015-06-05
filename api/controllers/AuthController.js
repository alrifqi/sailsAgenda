/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');
module.exports = {
	


  /**
   * `AuthController.find()`
   */
  find: function (req, res) {
    return res.json({
      todo: 'find() is not implemented yet!'
    });
  },


  /**
   * `AuthController.create()`
   */
  create: function (req, res) {
    return res.json({
      todo: 'create() is not implemented yet!'
    });
  },


  /**
   * `AuthController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },


  /**
   * `AuthController.destroy()`
   */
  destroy: function (req, res) {
    return res.json({
      todo: 'destroy() is not implemented yet!'
    });
  },
  login: function(req, res){
    if(req.session.passport.user){
      res.redirect('/');
    }else{
      res.view();
    }
    
  },
  process: function(req, res){
    passport.authenticate('local', {session: true}, function(err, user,info){
      if((err) || (!user)){
        return res.send({
          message: 'login failed'
        });
        res.send(err);
      }
      req.logIn(user, function(err){
        if(err) res.send(err);
        res.redirect('/');
      });
    }) (req, res);
  },
  logout: function(req, res){
    req.logout();
    res.send('logout successfull');
    res.redirect('/login');
  }
};

