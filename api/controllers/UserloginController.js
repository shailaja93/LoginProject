/**
 * UserloginController
 *
 * @description :: Server-side logic for managing Userlogins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');

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
    
   //        console.log(data);
           res.view('view_profile',{'userinfo' : data});
        });
       });  
  },
	
	afterlogin_authenticate: function(req,res) {

		    var param = req.allParams();           
        var pass = param.password;
        var uname = param.username;
        // console.log(pass);
        // console.log(uname);
        
        //-------------------TO FLASH A MESSAGE ON SCREEN FOR NOT ENTERING USERNAME AND PASSWORD-----------------
        // if(!req.param('username') || !req.param('password'))
        // {
        //   var UnamepassRequiredError = [{name:'UsernamePasswordRequired',message:'You must enter both Useraname and Password'}];
        //   req.session.flash = {
        //     err : UnamepassRequiredError
        //   }
        //   return res.redirect("index.html");
        // }
        //--------------------------------------------------------------------------------------------------------

          
        Userinfo.find({username: uname}, {select: ['username','id','password']})
        .exec(function(err, user1) {
        if(err) {
           return res.send(err);
        }
        // console.log("----------After Authentication-------------");
        // console.log(user1);
        // console.log("-------------------------------------------");

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
          var p = getValueByKey('password', data.Count_user);

          req.session.authenticated = true;
          req.session.userid = uid;
          req.session.username = uname;
          
          bcrypt.compare(pass, p, function(err, valid) {
                if(err || !valid)
                    return res.send('Invalid username and password combination!', 500)
                else
                  res.view('welcome');
          });
        }
        else
        {
           return res.send("Please enter a valid email/password!");
        }  
        });   
  },     

  register_user: function(req,res){

        var param = req.allParams();           
        var pass = param.password;
        var uname = param.username;
        var fnm = param.fname;
        var lnm = param.lname;
        var add1 = param.address1;
        var add2 = param.address2;
        //var password = "";
 
       bcrypt.hash(pass, 10, function(err, hash) {
       if(err) return cb(err);
       pass = hash
      // console.log(bcrypt.getSalt(hash));
      // console.log(pass);
       //});

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
                    
                         // console.log(userid);
                         var l = data.user_data.length; 
                         // console.log(l);
        
//-----------------------------------------------------------------------
                          function getValueByKey(key, data) {
                          // console.log(l);
                     
                          for (var i = 0; i < l; i++) {
                             if (data[i] && data[i].hasOwnProperty(key)) {
                                 return data[i][key];
                             }
                          }

                          return -1;
                          }
                          var uid = getValueByKey('id', data.user_data);
                          // console.log(uid);

//-----------------------------------------------------------------------------
                
                          Useraddress.create({                                // if name is unique,enter the records into the database
                          address1: add1,
                          address2: add2,
                          user_id: uid                      }).exec(function (err, u) {
                          // console.log("---------------------------");
                          res.redirect('index.html');
                      });         
                      });
                      });
       }        
       });    
  });
 },

  destroy_session : function(req,res)
  {
    req.session.destroy();
    console.log(req.session);
    res.redirect('index.html');
  },

  afterlogin_updation : function(req,res)
  {
     var param = req.allParams();
     var fnm = param.Fname;
     var lnm = param.Lname;
     var add1 = param.Add1;
     var add2 = param.Add2;
     var uid = req.session.userid;
     
     Userinfo.update({id : uid}, {fname:fnm,lname :lnm}).exec(function(err,data) { 
     if (err) {
           return res.send(err);
     }
     Useraddress.update({user_id : uid}, {address1:add1,address2 :add2}).exec(function(err,data) { 
     if (err) {
           return res.send(err);
     }
     req.session.status = "Updated";
     return res.redirect('/UserloginController/afterlogin_viewprofile');
     });
   });
  },

  afterlogin_resetpassword : function(req,res)
  {
     var param = req.allParams();
     var opass = param.oldpass;
     var npass = param.newpass;
     var uid = req.session.userid;
     
     Userinfo.find({id: uid}, {select: ['password']})
        .exec(function(err, user1) {
        if(err) {
           return res.send(err);
        }
        // console.log("--------STORED PASSWORD-----------");
        // console.log(user1[0].password);
        // console.log("----------------------------------");
        bcrypt.compare(opass, user1[0].password, function(err, valid) {
                if(err || !valid)
                    return res.send('Old password not correct!', 500)
                else
                   bcrypt.hash(npass, 10, function(err, hash) {
                   if(err) return cb(err);
                   npass = hash
                   
                  // console.log("--------STORING NEW PASSWORD-----------");
                  // console.log(npass);
                  // console.log("----------------------------------");

                  Userinfo.update({id : uid}, {password :npass})
                  .exec(function(err,data)
                  {        
                      if (err) {
                         return res.send(err);
                      }
                      return res.send("Changed");
                  });
                });
               });
              });    
  }
};

