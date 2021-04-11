const sUser = require('../models/user');

exports.register = (req, res, next) => {
    res.status(200).json({route : 'register'})
};

exports.login = (req, res, next) => {
    res.status(200).json({route : 'login'})
};