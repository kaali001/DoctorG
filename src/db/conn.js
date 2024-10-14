const mongoose = require("mongoose");
const path = require('path');
const dotenv = require("dotenv");

dotenv.config({ path: './config.env' });

mongoose
 
   .connect(process.env.DB)
   .then(() =>console.log(`Database connection Successful.`))
   .catch((error) => console.log(`Database Not Connected.`,error));
