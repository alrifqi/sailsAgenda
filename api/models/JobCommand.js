/**
* JobCommand.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName: 'jobCommand',
	attributes: {
	    name: {type: 'string'},
	    type: {type: 'string'},
	    command: {type: 'string'},
	    file: {type: 'string'},
	    agenda: {
	    	collection: 'Agenda',
	    	via: 'command'
	    }
  	}
};

