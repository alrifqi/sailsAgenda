/**
 * AgendaController
 *
 * @description :: Server-side logic for managing agenda
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var JobAgenda = require('agenda');
var sys = require('sys');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/agenda-example", {native_parser:true});

module.exports = {
	


  /**
   * `AgendaController.find()`
   */
  find: function (req, res) {
    today = new Date();
    var startPage,limitPage;
    if(req.param('limitPage')){
      limitPage = parseInt(req.param('limitPage'));
    }else{
      limitPage = 10;
    }
    if(req.param('startPage')){
      startPage = parseInt(req.param('startPage'));
    }else{
      startPage = 0;
    }

    if(req.param('status')){
        if(req.param('status') == 'waiting'){
          Agenda.find({nextRunAt: {$ne: null}}).paginate({page:req.param('startPage'), limit:req.param('limitPage')}).exec(function(err, result){
            db.collection('agendaJobs').find({nextRunAt: {$ne: null}}).count(function(errC, resultC){
              try{
                result[0]['total'] = resultC;  
              }catch(err){
                console.log(err);
              }

              return res.json(result);  
            });
          });
        }else{
          db.collection('agendaJobs').find({status: parseInt(req.param('status'))}).toArray(function(err, result){
              return res.json(result);
          });
        }  
    }else if(req.param('id')){
        Agenda.find({id: req.param('id')}).populate('command').exec(function(err, r){
          return res.json(r[0]);
        })
    }else if(req.param('forSection') == 'dashboard'){
      Agenda.find({status: {$ne: 0}}).paginate({page:req.param('startPage'), limit:req.param('limitPage')}).exec(function(err, result){
          db.collection('agendaJobs').count(function(errC, resultC){
            result[0]['total'] = resultC;
            return res.json(result);  
          });
      });
    }else{
      Agenda.find().paginate({page:req.param('startPage'), limit:req.param('limitPage')}).exec(function(err, result){
          db.collection('agendaJobs').count(function(errC, resultC){
            result[0]['total'] = resultC;
            return res.json(result);  
          });
      });
    } 
  },
  /**
   * `AgendaController.create()`
   */
  create: function (req, res) {

    var agenda = new JobAgenda({db: { address: 'localhost:27017/agenda-example'}});
    var dir = require('direktor');
    var session = new dir.Session();
    var task = new dir.Task();

    var jobName = req.body.name;
    var jobCommand = req.body.command;
    var jobPriority = req.body.priority;
    var jobInterval = req.body.interval;
    var timeConfig = new Date(req.body.timeConfig);
    var time = timeConfig.getHours()+':'+timeConfig.getMinutes()+':'+timeConfig.getSeconds();

    agenda.define(jobName, {priority: jobPriority, command: jobCommand, status: 0}, function(job, done){
        JobCommand.find({id: jobCommand}).exec(function(err, data){
            if(data[0].type === 'script'){
                module.exports.executeCommand(data[0].command, job.attrs['_id'], req);
            }else{
                module.exports.executeCommandFile(data[0].file, job.attrs['_id'], req);
            }
        });
     done();
    });
    if(jobInterval === 'satu_kali'){
      agenda.schedule(time,jobName);
    }else{
      agenda.every(req.body.priode, jobName);
    }
    agenda.start();
      sails.sockets.blast('newJob',{jobName: req.body.name });
      return res.json({
      info: 'Agenda '+jobName+' success created'
    });
  },


  /**
   * `AgendaController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },


  /**
   * `AgendaController.destroy()`
   */
  destroy: function (req, res) {
    console.log(req.param('name'));
    var agenda = new JobAgenda({db: { address: 'localhost:27017/agenda-example'}});
    agenda.cancel({name: req.param('name')}, function(err, numRemoved){
        return res.json({
          status: 'sukses'
        });
    });
  },
  tesConnection: function (req, res){
    var dir = require('direktor');
    var session = new dir.Session();
    var task = new dir.Task({
        host : '172.5.50.10',
        port : 20000,
        username : 'reza_aks3s',
        password : 'r3zapasswordnyainiaja'
    });
    task.before = 'echo mulai';
    task.commands = "mkdir test";
    task.after = 'echo selesai';
    session.tasks.push(task);
    session.execute(function(err){
      console.log(err);
    });
  },
  executeCommand: function(command, idJob, req){
      var exec = require('child_process').exec,
          child;

      db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: 2}},function(err, result){
          if(!err){
              sails.sockets.blast('commandStartExec',result);
          }
      });
      var child = exec(command, function(error, stdout, stderr){
          db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$push': {result:{outputVal: stdout, errorVal:stderr, time:today}}}, function(err, result){
            
          });
      }).on('close',function(code){
        if(code == 0){
          db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: 1}},function(err, result){
            db.collection('agendaJobs').find({_id:mongo.helper.toObjectID(idJob)}).toArray(function(err, result){
                sails.sockets.blast('commandSuccessExec',result);
            });
          });
        }else{
          db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: -1}},function(err, result){
            db.collection('agendaJobs').find({_id:mongo.helper.toObjectID(idJob)}).toArray(function(err, result){
                sails.sockets.blast('commandFailedExec',result);
            });
          });
        }
      });
     // var exec = require('child_process').exec,
     //     child;
     // db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: 2}},function(err, result){
     //    sails.sockets.blast('commandStartExec',result);
     // });

     // child = exec(command);
     // child.stdout.on('data',function(data){
     //     db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: 1}},function(err, result){
     //        db.collection('agendaJobs').find({_id:mongo.helper.toObjectID(idJob)}).toArray(function(err, result){
     //            sails.sockets.blast('commandSuccessExec',result);
     //        });
            
     //     });
         
     // });
     // child.stderr.on('data',function(data){
     //     console.log('stderr: '+data);
     //     db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: -1}},function(err, result){
     //        db.collection('agendaJobs').find({_id:mongo.helper.toObjectID(idJob)}).toArray(function(err, result){
     //            sails.sockets.blast('commandFailedExec',result);
     //        });
     //     });
         
     // });
  },
  executeCommandFile: function(file, idJob, req){
      var fs = require('fs');
      var exec = require('child_process').exec,
          child,
          locationFile;

      db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: 2}},function(err, result){
          if(!err){
              sails.sockets.blast('commandStartExec',result);
          }
      });
      locationFile = "assets/upload/"+file;

      var child = exec("php "+locationFile, function(error, stdout, stderr){
          db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$push': {result:{outputVal: stdout, errorVal:stderr, time:today}}}, function(err, result){
            
          });
      }).on('close',function(code){
        if(code == 0){
          db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: 1}},function(err, result){
            db.collection('agendaJobs').find({_id:mongo.helper.toObjectID(idJob)}).toArray(function(err, result){
                sails.sockets.blast('commandSuccessExec',result);
            });
          });
        }else{
          db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: -1}},function(err, result){
            db.collection('agendaJobs').find({_id:mongo.helper.toObjectID(idJob)}).toArray(function(err, result){
                sails.sockets.blast('commandFailedExec',result);
            });
          });
        }
      });

      // child.on('close', function(code){
      //   console.log(code);
      //   if(code == 0){
      //     db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: 1}},function(err, result){
      //       db.collection('agendaJobs').find({_id:mongo.helper.toObjectID(idJob)}).toArray(function(err, result){
      //           sails.sockets.blast('commandSuccessExec',result);
      //       });
      //     });
      //   }else{
      //     db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: -1}},function(err, result){
      //       db.collection('agendaJobs').find({_id:mongo.helper.toObjectID(idJob)}).toArray(function(err, result){
      //           sails.sockets.blast('commandFailedExec',result);
      //       });
      //     });
      //   }
        
      // });

      // fs.readFile('assets/upload/Setting Server.txt',function(err, data){
      //     var buffer = data.toString();
      //     child = exec(buffer);
      //     child.stdout.on('data',function(data){
      //         console.log('stdout: '+data);
      //         db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: 1}},function(err, result){
      //           sails.sockets.blast('commandSuccessExec',result);
      //         });
              
      //     });
      //     child.stderr.on('data',function(data){
      //         console.log('stderr: '+data);
      //         db.collection('agendaJobs').update({_id:mongo.helper.toObjectID(idJob)},{'$set':{status: -1}},function(err, result){
      //           sails.sockets.blast('commandFailedExec',result);
      //         });
              
      //     });
      //     child.on('close',function(code){
              
      //     });
      // });
  },
  emitFailed: function(req, res){
    db.collection('agendaJobs').find({status: parseInt(-1)}).toArray(function(err, result){
            sails.sockets.blast('commandFailedExec',result);
        });
  },
  emitSuccess: function(req, res){
    db.collection('agendaJobs').find({status: parseInt(1)}).toArray(function(err, result){
            sails.sockets.blast('commandSuccessExec',result);
        });
  },
  emitStart: function(req, res){
    db.collection('agendaJobs').find({status: parseInt(2)}).toArray(function(err, result){
            sails.sockets.blast('commandStartExec',result);
        });
  }
};
