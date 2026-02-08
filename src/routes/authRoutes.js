const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateCreateUser, validateUpdateUser } = require('../middleware/authValidator');
const { authMiddleware } = require('../middleware/authMiddleware'); // ⚡ ton middleware JWT


// Routes publiques
router.post("/register", validateCreateUser, authController.register);
router.post("/login", authController.login);
router.post("/forgot-password",validateCreateUser, authController.forgotPassword);
router.post("/check-email", authController.checkEmailExists);
router.post("/logout", authController.logout);

// Routes protégées
router.get("/profile", authMiddleware, authController.profile);
router.get("", authMiddleware, authController.getAll);
router.get("/:id", authMiddleware, authController.getById);
router.put("/:id", authMiddleware, validateUpdateUser, authController.update);
router.post("/change-password",authMiddleware,validateUpdateUser, authController.changePassword)
router.delete("/:id", authMiddleware, authController.delete);

module.exports = router;



module.exports = router;
