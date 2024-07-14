const mongoose =require("mongoose");
const bcrypt =require ("bcryptjs");

// defining schema of the table to store data in this format
const student_schema =new mongoose.Schema({      
    Name :{
        type:String,
        required:true
    },

    Email :{
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

    }

})





student_schema.pre("save",async function(next) {

    if(this.isModified("password")){
    
     
// Hasing of password
      console.log(` the current password is ${this.password}`);
      this.password =await bcrypt.hash(this.password,10);
      console.log(` the incrypted password is ${this.password}`);
      
      
      this.confirm_password = undefined;  //delete this element from student _schema after confirmation
    }

    next();
})


// Now we need to create a collections

const Register = new mongoose.model("Register",student_schema);
module.exports = Register;
