/**
 * UserloginController
 *
 * @description :: Server-side logic for managing Userlogins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  afterlogin_viewprofile: function(req,res) {
 
        var userid = req.session.userid;
        Userinfo.find({id : userid }, {select: ['username','password','id','fname','lname']})
        .exec(function(err, user1) {
        if(err) {
           return res.send(err);
        }
        var data = {
                  Count_user : user1
        };

        Useraddress.find({user_id: userid},{select: ['address1','address2']}).exec(function(err,useradd){
           if(err) {
           return res.send(err);
           }
        
           data.Count_user2 = useradd; 
    
           console.log(data);
           res.view('view_profile',{'userinfo' : data});
        });
       });  
  },
	
	afterlogin_authenticate: function(req,res) {

		    var param = req.allParams();           
        var pass = param.password;
        var uname = param.username;
        console.log(pass);
        console.log(uname);
        req.session.username = '';
        req.session.password = '';

        if(req.session.username != '' && req.session.password != '')
        {
        Userinfo.find({username: uname, password : pass }, {select: ['username','id']})
        .exec(function(err, user1) {
        if(err) {
           return res.send(err);
        }
        console.log("----------Session is not expired-------------");
        console.log(user1);
        console.log("-------------------------------------------");

        var data = {
                  Count_user : user1
        };
        res.view('welcome',{'user' : data.Count_user});
        });  
        }
        else
        {
        Userinfo.find({username: uname, password : pass }, {select: ['username','id']})
        .exec(function(err, user1) {
        if(err) {
           return res.send(err);
        }
        console.log("----------After Authentication-------------");
        console.log(user1);
        console.log("-------------------------------------------");

        var data = {
                  Count_user : user1
        };
        
        var len = data.Count_user.length;
        if(len == 1) 
        {
          function getValueByKey(key, data) {
   
          for (var i = 0; i < len; i++) {
             if (data[i] && data[i].hasOwnProperty(key)) {
                 return data[i][key];
             }
            }
          return -1;
          }
          var uid = getValueByKey('id', data.Count_user);

          req.session.userid = uid;
          req.session.username = uname;
          req.session.password = pass;
          console.log("----------After getting ID----------");
          console.log(req.session);
          console.log("------------------------------------");
          res.view('welcome',{'user' : data.Count_user});
        }
        else
        {
           return res.send("Please enter a valid email/password!");
        }  
      });
      }  
  },     

  register_user : function(req,res)
  {
        var param = req.allParams();           
        var pass = param.password;
        var uname = param.username;
        var fnm = param.fname;
        var lnm = param.lname;
        var add1 = param.address1;
        var add2 = param.address2;

        // console.log(pass);
        // console.log(uname);
        // console.log(fnm);
        // console.log(lnm);
        // console.log(add1);
        // console.log(add2);
        

       Userinfo.find({username: uname}, {select: ['username']})      //find() to check if username exists or not
       .exec(function(err, user) {
       if(err) {
           res.badRequest('reason');
       }
       var data = {                        // Obtain value inside the JSON object
                     user_data : user
                  };
       var len = data.user_data.length;
     
       if(len == 1)                                  // if the username exists -- > enter unique id
       {
          res.send("Username already taken!");
       }
       else
       {
          Userinfo.create({                                // if name is unique,enter the records into the database
                          username: uname,
                          password : pass,
                          fname : fnm,
                          lname : lnm                       }).exec(function (err, usercreate) {
                          console.log("---------------------------");
                          
                          Userinfo.find({username: uname}, {select: ['id']})      //find() to check if username exists or not
                         .exec(function(err, userid) {
                         if(err) {
                             res.badRequest('reason');
                         }
                         var data = {                        // Obtain value inside the JSON object
                                       user_data : userid
                                    };
                         var len = data.user_data.length;
                    
                         console.log(userid);
                         var l = data.user_data.length; 
                         console.log(l);
        
//-----------------------------------------------------------------------
                          function getValueByKey(key, data) {
                          console.log(l);
                     
                          for (var i = 0; i < l; i++) {
                             if (data[i] && data[i].hasOwnProperty(key)) {
                                 return data[i][key];
                             }
                          }

                          return -1;
                          }
                          var uid = getValueByKey('id', data.user_data);
                          console.log(uid);

//-----------------------------------------------------------------------------
                
                          Useraddress.create({                                // if name is unique,enter the records into the database
                          address1: add1,
                          address2: add2,
                          user_id: uid                      }).exec(function (err, u) {
                          console.log("---------------------------");
                          res.redirect('index.html');
                      });         
                      });
                      });
       }        
       });    
  }
};

