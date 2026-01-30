const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { validateCreateUser, validateUpdateUser } = require('../middleware/UserValidator');

// lister tous les utilisateurs
router.get('/', usersController.getAll);

// afficher un utilisateur par son id
router.get('/:id', usersController.getById);

// inscription (création d’un utilisateur)
router.post('/signin', validateCreateUser, usersController.signIn);

// login
router.post('/login', usersController.login);

// logout
router.post('/logout', usersController.logout);

// profil utilisateur connecté
router.get('/profile', usersController.profile);

// mise à jour d’un utilisateur
router.put('/:id', validateUpdateUser, usersController.update);

// supprimer un utilisateur
router.delete('/:id', usersController.delete);

module.exports = router;
