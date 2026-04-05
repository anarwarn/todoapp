const express = require('express');

const getTodos = (req, res) => {
  // TODO: Fetch todos from database
  res.json({ todos: [] });
};

const addTodo = (req, res) => {
  const todo = req.body;
  // TODO: Save todo to database
  res.status(201).json({ added: todo });
};

const deleteById = (req, res) => {
  const { id } = req.params;
  // TODO: Delete todo from database
  res.json({ deletedId: id });
};

module.exports = {
  getTodos,
  addTodo,
  deleteById
}