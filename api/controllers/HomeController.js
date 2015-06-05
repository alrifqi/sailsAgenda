/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');
module.exports = {
	


  /**
   * `HomeController.find()`
   */
  find: function (req, res) {
    return res.json({
      todo: 'find() is not implemented yet!'
    });
  },


  /**
   * `HomeController.create()`
   */
  create: function (req, res) {
    return res.json({
      todo: 'create() is not implemented yet!'
    });
  },


  /**
   * `HomeController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },


  /**
   * `HomeController.destroy()`
   */
  destroy: function (req, res) {
    return res.json({
      todo: 'destroy() is not implemented yet!'
    });
  },

  index: function(req, res){
    // if(req.session.passport.user){
      return res.view({
        title: 'Job Scheduler Application',
        description: 'Job Scheduler Application'
      }); 
    // }else{
    //   res.redirect('login');
    // }
  }
};

