const express = require("express");
const app = express();
const TodosRouter = require("./routers/TodosRouter");
const userRouter = require("./routers/UserRoute");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");

dotenv.config({path: path.join(__dirname, '../config.env')});

mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err)); 

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'simple-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const PORT = process.env.PORT || 3000;

app.use('/todos', TodosRouter);
app.use('/users', userRouter);  
app.get('/', (req , res) => {res.send('hello')});

app.listen(PORT, () => {console.log('server is running on port ' + PORT)});