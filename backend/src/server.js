const express = require("express");
const app = express();
const TodosRouter = require("./routers/TodosRouter");
const userRouter = require("./routers/UserRoute");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config({path: './config.env'});

mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err)); 

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/todos', TodosRouter);
app.use('/users', userRouter);  
app.get('/', (req , res) => {res.send('hello')});

app.listen(PORT, () => {console.log('server is running on port ' + PORT)});