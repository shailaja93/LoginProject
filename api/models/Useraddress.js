/**
* Useraddress.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName: 'useraddress',
  attributes: {
       address_id: {
           type: 'INTEGER',
           primaryKey : true,
           autoincrement : true
        },
        address1: {
            type: 'STRING'
        },
        address2: {
            type: 'STRING'
        },
        user_id: {
        	type: 'STRING'
        }
  }
};

