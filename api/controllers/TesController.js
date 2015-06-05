/**
 * TesController
 *
 * @description :: Server-side logic for managing tes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `TesController.find()`
   */
  find: function (req, res) {
    var data = [];
    var datana = [];
    for (var i = 1; i <= 1000; i++) {
      data.push({firstname: 'Person '+i, lastname: 'Person '+i, email: 'person'+i+'@person.com', phone: '+62850'});
    };
    return res.json(data);
    
  },


  /**
   * `TesController.create()`
   */
  create: function (req, res) {
    return res.json({
      todo: 'create() is not implemented yet!'
    });
  },


  /**
   * `TesController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },


  /**
   * `TesController.destroy()`
   */
  destroy: function (req, res) {
    return res.json({
      todo: 'destroy() is not implemented yet!'
    });
  }
};

