const express = require("express");
const app = express();
const TodosRouter = require("./routers/TodosRouter");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use('/todos', TodosRouter);

app.get('/', (req , res) => {res.send('hello')});


app.listen(PORT, () => {console.log('server is running on port ${PORT}')});