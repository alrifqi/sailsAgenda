/**
 * JobCommandControllerController
 *
 * @description :: Server-side logic for managing Jobcommandcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Agenda = require('agenda');

module.exports = {
  /**
   * `JobCommandControllerController.find()`
   */
  find: function (req, res) {
  sails.sockets.blast('newsServer','hallo');
	if(req.param('id')){
        var command = JobCommand.find({id: req.param('id')}).exec(function(err, data){
            JobCommand.count().exec(function(errCount, dataCount){
                return res.json(data);
            });
        });
    }else{
      if(req.param('limitPage')){
        var command = JobCommand.find().paginate({page:req.param('startPage'), limit:req.param('limitPage')}).exec(function(err, data){
            JobCommand.count().exec(function(errCount, dataCount){
                return res.json({data:data, total:dataCount});
            });
        });
      }else{
        var command = JobCommand.find().exec(function(err, data){
            JobCommand.count().exec(function(errCount, dataCount){
                return res.json({data:data, total:dataCount});
            });
        });
      }
    }
  },


  /**
   * `JobCommandControllerController.create()`
   */
  create: function (req, res) {
    JobCommand.create({
        name: req.body.name,
        type: req.body.commandType,
        command: req.body.command,
        file: req.body.filename,
        }).exec(function(err, detail){
          sails.sockets.blast('newCommand',{commandName: req.body.name });
          return res.json({
            info: 'Job Command Success Added'
          });
        });


  },


  /**
   * `JobCommandControllerController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },


  /**
   * `JobCommandControllerController.destroy()`
   */
  destroy: function (req, res) {
    AgendaJobs.find({command: req.param('id')}).exec(function(err, data){
      console.log(data.length);
      if(data.length > 0){
        return res.json({
          status: 'gagal',
          pesan: 'Job Command Digunakan, Hapus Dulu Job Scheduler Yang Berkaitan'
        });
      }else{
        JobCommand.destroy({id: req.param('id')}).exec(function(err, data){
          console.log(data);
          console.log(err);
          console.log('removed');
        });
        return res.json({
          status: 'sukses',
          pesan: 'Job Telah Diapus'
        });
      }
    });
    // agenda.cancel({id: req.body.id}, function(err, numRemoved){
    //   console.log(err);
    //   console.log(numRemoved);
    //   return res.json({
    //     status: 'sukses'
    //   });
    // });
  },
  uploadFile: function (req, res){
    var fs = require('fs');
    req.file('file').upload(function(err, files){
      if(err)
        console.log(res.serverError(err));

      fs.rename(files[0].fd, 'assets/upload/'+files[0].filename, function(err){
        if(err){
          res.json({message:"File Not Uploaded"})
        }else{
          res.json({filename: files[0].filename, message:"File Uploaded"});
        }
          
      });

    });
  },
  subscribe: function(req, res){
	JobCommand.find(function foundJobCommand(err, jobs){
	  JobCommand.subscribe(req.socket);
	  
	  JobCommand.subscribe(req.socket, jobs);
	});
	
  },
  findOnJobProgress: function(req, res){
      JobCommand.find().limit(10).exec(function(err, data){
        return res.json(data);
      });
  }
};

