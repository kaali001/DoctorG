const mongoose =require("mongoose");
const bcrypt =require ("bcryptjs");

const jwt = require("jsonwebtoken");


// defining schema of the table to store data in this format
const admin_schema =new mongoose.Schema({      
    Name :{
        type:String,
        required:true
    },

    Email :{
        type:String,
        required:true,
        unique:true
    },
    College_unique_id:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true  
    },

    confirm_password :{
        type:String,
        required:true

    },
    tokens:[{                // to store the auth token for each user
        token:{
            type:String,
            required:true
        }
    }] 

})


// to creating the auth token
// admin_schema.methods.generateAuthToken =async function(){
     
//     try {
        
//         console.log(this._id);
//         const token = jwt.sign({_id:this._id.toString()}, "mynameisjohn");
        
//         this.tokens = this.tokens.concat({token:token})
//         await this.save();
//         return token;

//     }  catch(error){
//         res.send("The error part" + error);
//         console.log("The error part " + error);
//     }

// }

admin_schema.pre("save",async function(next) {

    if(this.isModified("password")){
    
    
     // Hashing of password
      console.log(` the current password is ${this.password}`);
      this.password =await bcrypt.hash(this.password,10);
      console.log(` the incrypted password is ${this.password}`);
      
      
      this.confirm_password = undefined;  //delete this element from student _schema after confirmation
    }

    next();
})



// Now we need to create a collections

const Admin = new mongoose.model("Admin",admin_schema);
module.exports = Admin;


