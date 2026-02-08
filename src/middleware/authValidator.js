// middleware/UserValidator.js

const validateCreateUser = (req, res, next) => {
    const { nom_utilisateur, email, password, role } = req.body;
    const errors = {};

    if (!nom_utilisateur || nom_utilisateur.trim().length < 2) {
        errors.nom_utilisateur = "Le nom d'utilisateur doit contenir au moins 2 caractères.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
        errors.email = "Format d'email invalide.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])[A-Za-z\d!@#$%^&*()_\-+=<>?{}[\]~]{8,16}$/;
    if (!passwordRegex.test(password)) {
        errors.password = "Le mot de passe doit contenir entre 8 et 16 caractères, avec au moins une majuscule, un chiffre et un caractère spécial.";
    }

    // Normalisation du rôle
    let normalizedRole = role ? role.toLowerCase() : "student";
    if (normalizedRole === "enseignant") {
        normalizedRole = "teacher";
    }

    const allowedRoles = ["admin", "teacher", "student"];
    if (!allowedRoles.includes(normalizedRole)) {
        errors.role = "Le rôle doit être 'admin', 'teacher' ou 'student'.";
    }
    req.body.role = normalizedRole;

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    next();
};

const validateUpdateUser = (req, res, next) => {
    const { nom_utilisateur, nom, prenom, email, password, profile_url, role } = req.body;
    const errors = {};

    if (nom_utilisateur !== undefined && nom_utilisateur.trim().length < 2) {
        errors.nom_utilisateur = "Le nom d'utilisateur doit contenir au moins 2 caractères.";
    }
    if (nom !== undefined && nom.trim().length < 2) {
        errors.nom = "Le nom doit contenir au moins 2 caractères.";
    }
    if (prenom !== undefined && prenom.trim().length < 2) {
        errors.prenom = "Le prénom doit contenir au moins 2 caractères.";
    }

    if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = "Format d'email invalide.";
        }
    }

    if (password !== undefined) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])[A-Za-z\d!@#$%^&*()_\-+=<>?{}[\]~]{8,12}$/;
        if (!passwordRegex.test(password)) {
            errors.password = "Le mot de passe doit contenir entre 8 et 12 caractères, avec au moins une majuscule, un chiffre et un caractère spécial.";
        }
    }

    // Normalisation du rôle
    let normalizedRole = role ? role.toLowerCase() : "student";
    if (normalizedRole === "enseignant") {
        normalizedRole = "teacher";
    }

    const allowedRoles = ["admin", "teacher", "student"];
    if (!allowedRoles.includes(normalizedRole)) {
        errors.role = "Le rôle doit être 'admin', 'teacher' ou 'student'.";
    }
    req.body.role = normalizedRole;

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    next();
};

module.exports = { validateCreateUser, validateUpdateUser };
