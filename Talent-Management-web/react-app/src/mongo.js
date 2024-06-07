const mongoose =require('mongoose');

mongoose.connect("mongodb://localhost:27017/talan-hr-management")
.then(()=>{console.log("connected to the database")})
.catch((err)=>{console.error(err)});

module.exports = mongoose;