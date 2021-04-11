const sUser = require('../models/user');
const bcrypt = require('bcrypt')

exports.register = async (req, res, next) => {
    
    let hash = await bcrypt.hash(req.body.password, 10);
    
    const user = new sUser({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });

    user.save()
    .then(() => res.status(201).json({ message: 'Crée !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
    sUser.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur introuvable' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
          }
          res.status(200).json({
            userId: user._id,
            token: 'FUTUR_TOKEN'
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};