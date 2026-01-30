const express=require('express');
const router=express.Router();
const studentsController=require('../controllers/studentsController');
const { validateCreateStudent, validateUpdateStudent } = require('../middleware/StudentValidator');


// Routes ou endpoints

// lister tous les etudiants
router.get('/',studentsController.getAll);
// afficher les statistiques
router.get('/stats',studentsController.getStats);
// afficher un etudiant par son id
router.get('/:id',studentsController.getById);


//ajouter ou creer un etudiant

router.post('/', validateCreateStudent, studentsController.create);


router.put('/:id', validateUpdateStudent, studentsController.update);


router.delete('/:id', studentsController.delete);

module.exports = router;