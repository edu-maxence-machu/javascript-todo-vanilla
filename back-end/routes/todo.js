const express = require('express');
const { getOneTodo, createTodo, updateTodo, deleteTodo, getAllTodo } = require('../controllers/todo');
const router = express.Router();
const sTodo = require('../models/todo');

const mAuth = require('../middlewares/auth');

router.get('/', getAllTodo);

router.post('/', mAuth, createTodo);  
router.get('/:id', getOneTodo);
router.put('/:id', updateTodo);  
router.delete('/:id', deleteTodo);

module.exports = router;