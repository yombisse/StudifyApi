//middleware
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const validateCreateStudent=(req,res,next)=>{
    const {nom,prenom,age,telephone,email,profile_url,filiere,sexe,adresse}=req.body;

    const errors=[];
    if(!nom || nom.trim().length< 2){
        errors.push('Le nom doit contenir au moins 2 carractères.');
    }
    if(!prenom || prenom.trim().length< 2){
        errors.push('Le prenom doit contenir au moins 2 carractères.');
    }
    if(!age || age< 16 || age>100){
        errors.push('L\'age  doit etre compris entre 16 et 20  ans .');
    }

    if (!telephone) { 
        errors.push("Le téléphone est obligatoire."); 

    } 
    else { 
        const number = parsePhoneNumberFromString(telephone); 
        if (!number || !number.isValid()) { 
            errors.push("Le téléphone doit être un numéro valide au format international (ex: +2266913191)."); 
        } 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
        errors.push( "Format d'email invalide" ); 
    }

    if(!filiere || filiere.trim().length< 2){
        errors.push('La filière doit contenir au moins 2 carractères.');
    }

    if (!sexe || !['M', 'F'].includes(sexe.toUpperCase())) {
            errors.push('Le sexe doit être M ou F');
        }

        if (errors.length > 0) {
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

    const errors = [];

    // ✅ Nom (optionnel mais si fourni, doit être valide)
    if (nom !== undefined && nom.trim().length < 2) {
        errors.push("Le nom doit contenir au moins 2 caractères.");
    }

    // ✅ Prénom
    if (prenom !== undefined && prenom.trim().length < 2) {
        errors.push("Le prénom doit contenir au moins 2 caractères.");
    }

    // ✅ Âge
    if (age !== undefined && (age < 16 || age > 100)) {
        errors.push("L'âge doit être compris entre 16 et 100 ans.");
    }

    // ✅ Téléphone
    if (telephone !== undefined) { 
        const number = parsePhoneNumberFromString(telephone); 
        if (!number || !number.isValid()) { 
            errors.push("Le téléphone doit être un numéro valide au format international (ex: +2266913191)."); 
        }
    }

    // ✅ Email
    if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Format d'email invalide.");
        }
    }

    // ✅ Filière
    if (filiere !== undefined && filiere.trim().length < 2) {
        errors.push("La filière doit contenir au moins 2 caractères.");
    }

    // ✅ Sexe
    if (sexe !== undefined && !["M", "F"].includes(sexe.toUpperCase())) {
        errors.push("Le sexe doit être M ou F.");
    }

    // ✅ Adresse (optionnel mais si fourni, doit être non vide)
    if (adresse !== undefined && adresse.trim().length < 2) {
        errors.push("L'adresse doit contenir au moins 2 caractères.");
    }

    // ⚡ Gestion des erreurs
    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    next();
};

module.exports = {validateCreateStudent, validateUpdateStudent };

 