const express = require('express');
const { getOneTodo, createTodo, updateTodo, deleteTodo, getAllTodo } = require('../controllers/todo');
const router = express.Router();
const sTodo = require('../models/todo');

  
router.get('/', getAllTodo);

router.post('/', createTodo);  
router.get('/:id', getOneTodo);
router.put('/:id', updateTodo);  
router.delete('/:id', deleteTodo);

module.exports = router;