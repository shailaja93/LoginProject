/**
 * UserloginController
 *
 * @description :: Server-side logic for managing Userlogins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	afterlogin_authenticate: function(req,res) {

		var param = req.allParams();            // getting the login params
        var pass = param.password;
        var uname = param.username;
        console.log(pass);
        console.log(uname);
 
//-----------------------------------------------------------------------

        Userinfo.find({username: uname, password : pass }, {select: ['username','password','id','fname','lname']})
        .exec(function(err, user) {
        if(err) {
           return res.send(err);
        }
        console.log(user);


        var data = {
                  Count_user : user
        };
   
        var len = data.Count_user.length; 
        
/**-----------------------------------------------------------------------
        function getValueByKey(key, data) {
        console.log(len);
   
        for (var i = 0; i < len; i++) {
           if (data[i] && data[i].hasOwnProperty(key)) {
               return data[i][key];
           }
        }

        console.log(len);
        return -1;
        }
        var uid = getValueByKey('id', data.Count_user);
        console.log(uid);
                
-------------------------------------------------------------------------*/

        if(len == 1)
        {
            //write raw query
           var query = 
           Useraddress.find({user_id: uid},{select: ['address1','address2']}).exec(function(err,u){
           if(err) {
           return res.send(err);
           }
           console.log(u);
//-----------------------------------------------------------------------------  

           var data1 = {
                  Count_user1 : user
           };
    
           res.view('view_profile',{'userinfo' : ret});
        });
        }
        else
        {
           return res.send("Please enter a valid email/password!");
        }
    });
	}
};

