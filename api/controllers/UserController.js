/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `UserController.find()`
   */
  find: function (req, res) {
    var result = '';
    if(req.param('id')){
      var user = User.find({id: req.param('id')}).exec(function(err, data){
          return res.json(data);
      });
    }else{
      var user = User.find().paginate({page:req.param('startPage'), limit:req.param('limitPage')}).exec(function(err, data){
          User.count().exec(function(errCount, dataCount){
            return res.json({data:data, total:dataCount});
          });  
      });  
    }
    

    // User.find().exec(function(err, users){
    //   return res.json(users);
    // });
    
  },


  /**
   * `UserController.create()`
   */
  create: function (req, res) {
    // var bcrypt = require('bcrypt');
    // bcrypt.genSalt(10, function(err, salt){
    //   bcrypt.hash(req.body.password, salt, function(err, hash){
    //     req.body.genPass = hash;
    //     User.create({
    //         username: req.body.username,
    //         passwod: hash,
    //         email: req.body.email,
    //         role: req.body.role,
    //         aktif: '1'
    //         }).exec(function(err, detail){
    //           return res.json(req.body);          
    //         });
    //   });
    // });
    User.find({username: req.body.username}).exec(function(err, data){
      if(data > 1){
        User.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          role: req.body.role,
          aktif: '1'
          }).exec(function(err, detail){
            return res.json({
              status: 'sukses',
              pesan: 'User '+req.body.username+' Berhasil ditambah'
            });          
        });
      }else{
        return res.json({
              status: 'gagal',
              pesan: 'User '+req.body.username+' telah ada'
            });
      }
      
    });
  },


  /**
   * `UserController.update()`
   */
  update: function (req, res) {
    if(req.body.password === ''){
      User.update({id: req.body.id},{
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        aktif: '1'
        }).exec(function(err, detail){
          return res.json(req.body);          
        });
    }else{
      User.update({id: req.body.id},{
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        aktif: '1'
        }).exec(function(err, detail){
          return res.json(req.body);          
        });  
    }
    
  },


  /**
   * `UserController.destroy()`
   */
  destroy: function (req, res) {
    User.destroy({id: req.param('id')}).exec(function(err, data){
          console.log(data);
          console.log(err);
          return res.json({
            status: 'sukses',
            pesan: 'Job Telah Diapus'
          });
        });
  },
  login: function (req, res){
    return res.view('home/redirect');
  }
};

