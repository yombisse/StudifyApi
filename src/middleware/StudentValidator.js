const { parsePhoneNumberFromString } = require('libphonenumber-js');

const validateCreateStudent = (req, res, next) => {
  const { nom, prenom, age, telephone, email, profile_url, filiere, sexe, adresse } = req.body;

  const errors = {};

  if (!nom || nom.trim().length < 2) {
    errors.nom = "Le nom doit contenir au moins 2 caractères.";
  }
  if (!prenom || prenom.trim().length < 2) {
    errors.prenom = "Le prénom doit contenir au moins 2 caractères.";
  }
  if (!age || age < 16 || age > 100) {
    errors.age = "L'âge doit être compris entre 16 et 100 ans.";
  }
  if (!telephone) {
    errors.telephone = "Le téléphone est obligatoire.";
  } else {
    const number = parsePhoneNumberFromString(telephone);
    if (!number || !number.isValid()) {
      errors.telephone = "Le téléphone doit être un numéro valide au format international (ex: +2266913191).";
    }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Format d'email invalide.";
  }
  if (!filiere || filiere.trim().length < 2) {
    errors.filiere = "La filière doit contenir au moins 2 caractères.";
  }
  if (!sexe || !["M", "F"].includes(sexe.toUpperCase())) {
    errors.sexe = "Le sexe doit être M ou F.";
  }
  if (adresse && adresse.trim().length < 2) {
    errors.adresse = "L'adresse doit contenir au moins 2 caractères.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateUpdateStudent = (req, res, next) => {
    const {
        nom,
        prenom,
        age,
        telephone,
        email,
        profile_url,
        filiere,
        sexe,
        adresse
    } = req.body;

    const errors = {};

    // ✅ Nom (optionnel mais si fourni, doit être valide)
    if (nom !== undefined && nom.trim().length < 2) {
        errors.nom = "Le nom doit contenir au moins 2 caractères.";
    }

    // ✅ Prénom
    if (prenom !== undefined && prenom.trim().length < 2) {
        errors.prenom = "Le prénom doit contenir au moins 2 caractères.";
    }

    // ✅ Âge
    if (age !== undefined && (age < 16 || age > 100)) {
        errors.age = "L'âge doit être compris entre 16 et 100 ans.";
    }

    // ✅ Téléphone
    if (telephone !== undefined) { 
        const number = parsePhoneNumberFromString(telephone); 
        if (!number || !number.isValid()) { 
            errors.telephone = "Le téléphone doit être un numéro valide au format international (ex: +2266913191)."; 
        }
    }

    // ✅ Email
    if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = "Format d'email invalide.";
        }
    }

    // ✅ Filière
    if (filiere !== undefined && filiere.trim().length < 2) {
        errors.filiere = "La filière doit contenir au moins 2 caractères.";
    }

    // ✅ Sexe
    if (sexe !== undefined && !["M", "F"].includes(sexe.toUpperCase())) {
        errors.sexe = "Le sexe doit être M ou F.";
    }

    // ✅ Adresse (optionnel mais si fourni, doit être non vide)
    if (adresse !== undefined && adresse.trim().length < 2) {
        errors.adresse = "L'adresse doit contenir au moins 2 caractères.";
    }

    // ⚡ Gestion des erreurs
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    next();
};

module.exports = {validateCreateStudent, validateUpdateStudent };

 