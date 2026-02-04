const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateCreateUser, validateUpdateUser } = require('../middleware/authValidator');
const { authMiddleware } = require('../middleware/authMiddleware'); // ⚡ ton middleware JWT

// lister tous les utilisateurs (protégé)
router.get('/', authMiddleware, authController.getAll);

// afficher un utilisateur par son id (protégé)
router.get('/:id', authMiddleware, authController.getById);

// profil utilisateur connecté (protégé)
router.get('/profile', authMiddleware, authController.profile);
// mise à jour d’un utilisateur (protégé)
router.put('/:id', authMiddleware, validateUpdateUser, authController.update);

// supprimer un utilisateur (protégé)
router.delete('/:id', authMiddleware, authController.delete);

// inscription (création d’un utilisateur) → public
router.post('/signin', validateCreateUser, authController.signIn);

// login → public
router.post('/login', authController.login);

// logout → avec JWT, ce n’est plus nécessaire (on supprime juste le token côté client)
// tu peux garder pour compatibilité
router.post('/logout', authController.logout);


module.exports = router;
