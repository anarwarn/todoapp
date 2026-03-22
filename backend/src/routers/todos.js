const express = require('express');
const router = express.Router();
const {addTodo,getTodos,deleteById} = require('../controllers/todosController')


router.get('/', getTodos);
router.post('/add_todo', addTodo);
router.delete('/delete_movie/:id', deleteById);

module.exports = router;