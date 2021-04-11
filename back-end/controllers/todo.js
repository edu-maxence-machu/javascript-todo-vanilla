const sTodo = require('../models/todo');

exports.createTodo = (req, res, next) => {

    const todo = new sTodo({...req.body});
    todo.save().then(() => {
      res.status(201).json({
        message: 'Todo enregistrée'
      })
    }).catch((error) => {
      res.status(400).json({error})
    })
}

exports.getAllTodo = (req, res, next) => {
    sTodo.find()
    .then(todos => res.status(200).json(todos))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneTodo = (req, res, next) => {
    sTodo.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
}

exports.updateTodo = (req, res, next) => {
    sTodo.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Todo modifiée'}))
      .catch(error => res.status(400).json({ error }));
}

exports.deleteTodo = (req, res, next) => {
    sTodo.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Todo supprimée'}))
      .catch(error => res.status(400).json({ error }));
}