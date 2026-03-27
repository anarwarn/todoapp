const express = require('express');

const getTodos = (req, res) => {
  
  res.json({ todos: [] }).send('hello');
};

const addTodo = (req, res) => {
  const todo = req.body;
  res.status(201).json({ added: todo });
};

const deleteById = (req, res) => {
  const { id } = req.params;
  res.json({ deletedId: id });
};

module.exports = {
  getTodos,
  addTodo,
  deleteById
}