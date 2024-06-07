import express from 'express';
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cors from "cors";
var app = express();
app.use(bodyParser.json());
app.use(cors());
//gannouchimehrez0411
//LPYiAIgjKNOEgyY8
const MONGO_URL_CONN = "mongodb+srv://gannouchimehrez0411:LPYiAIgjKNOEgyY8@cluster0.byfbotf.mongodb.net/main";
const PORT = 5000;
//import User from "./models/users.js";
import userRoute from "./routes/user.route.js";
import passwordResetRoute from "./routes/resetPassword.route.js";

app.use("/user", userRoute);
app.use("/reset", passwordResetRoute)



app.get('/', function (req, res) {
  res.send({
    "url": MONGO_URL_CONN
  });
});

mongoose
  .connect(MONGO_URL_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server runnig on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
 
mongoose.set("strictQuery", false);