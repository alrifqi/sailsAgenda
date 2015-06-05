/**
* Agenda.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName: 'agendaJobs',
	attributes: {
                id: {type: 'objectid'},
                status: {type: 'integer'},
                name: {type: 'string'},
                priority: {type: 'integer'},
                data: {type: 'string'},
                type: {type: 'string'},
                command: {
                        model: 'JobCommand'
                }
	}
};

