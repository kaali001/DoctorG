
const exp = require('constants');
const express = require ('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const bcrypt = require('bcryptjs');


const {json} = require("express");
const {log, Console} = require("console");
const { constants } = require('buffer');


const port = process.env.PORT || 3000;

require("./src/db/conn");  // to connect the file of the database
const Register = require("./src/models/patients");
const Admin = require("./src/models/doctors");


// Public static path
const static_path =path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views")
const partials_path = path.join(__dirname,"../templates/partials")


//used to get no error on getting the json data
app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.set('view engine', 'hbs');
app.set('views',template_path);
hbs.registerPartials(partials_path);
app.use(express.static(static_path))


// Routing
app.get("",(req,res)=>{
    res.render('index')
})

app.get("/home",(req,res)=>{
    res.render('index')
})
app.get("/about",(req,res)=>{
    res.render('about')
})


app.get("/login",(req,res)=>{
    res.render('login')
})


app.get("/signup",(req,res)=>{
    res.render('signup')
})


app.get("/contact",(req,res)=>{
    res.render('contact')
})

// for report 

app.get("/reports",(req,res)=>{
    res.render('reports')
})
// for doctor page
app.get("/doctors",(req,res)=>{
    res.render('doctor')
})


app.get("*",(req,res)=>{
    res.render('404error')
})






// create a new user in our database 
app.post("/signup",async(req,res) =>{     //user can send his data
    try{
         const password = req.body.password;
         const confirm_password = req.body.cpassword;
         const Email =req.body.email;
        
        const hidden_value= req.body['hidden_value'];
 
 
        if(password === confirm_password ){
         
            if(hidden_value==="admin"){
                const Admindata= new Admin({    //To store in the database
                   Name: req.body.Name,
                   Email: req.body.email,    
                   College_unique_id: req.body.unique_id,              //after req.body.* part is defined in the 'Name'
                   password: req.body.password,            // attribute of the all input box of Form page
                   confirm_password: req.body.cpassword
                 })
                  
           //       console.log("the success part is " +Admindata);
            //      const token = await Admindata.generateAuthToken();
                 // console.log("the token part is " +token);

                  const regist = await Admindata.save();
          //        console.log("the page part is here");
                  res.status(201).render('doctor');  // Show the page after successful login
                                                                         
             }
 
             else{
                
                 const registeredEmployee = new Register({    //To store in the database
                     Name: req.body.Name,
                     Email: req.body.email,    
                     password: req.body.password,            // attribute of the all input box of Form page
                     confirm_password: req.body.cpassword
 
                 })
      
                 const registered = await registeredEmployee.save();
                 res.status(201).render('patient');  // Show the page after successful login                                                          
                  
             }
 
         }
 
        else{
           res.send("Invalid Credintial")  // Show this if fail to login
 
         }
    } 
 
 
    catch(error){
        res.status(400).send("Failed to create account. ");
 
     }
   
 })
 
 
 
 // Login validity check
 
 app.post("/login",async(req,res)=>{
     try{
            
         const check= req.body['check_box'];
          
         if(check==="admin"){
 
             const Password = req.body.password;
             const user_email=await Admin.findOne({Email:req.body.email}); // "Email" of Signup database compares with email entered bu user on login page.
         
             // it will mach password and give output in true or false
             const isMatch = await bcrypt.compare(req.body.password,user_email.password);
 
             if(isMatch){
                 res.status(210).render("doctor");
             }
             else{
                 res.send("invalid password details");
             }
 
         }
 
         else{
 
                 /* "req.body.email" and "req.body.password"is coming from login page  */
 
             const Password = req.body.password;
             const user_email=await Register.findOne({Email:req.body.email}); // "Email" of Signup database compares with email entered bu user on login page.
         
             // it will mach password and give output in true or false
             const isMatch = await bcrypt.compare(req.body.password,user_email.password);
 
             if(isMatch){
                 res.status(210).render("patient");
             }
             else{
                 res.send("invalid password details");
             }
 
         }
       
     } 
 
     catch{
         res.status(400).send("invalid Login Details");
     }
 });
 

// To display all the Alumni members






 
app.listen(port, ()=>{
    console.log(`listening to port at ${port}`)
})
