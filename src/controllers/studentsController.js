// StudentsControllers

const studentsController={
    getAll:(req,res)=>{
        const query='SELECT * FROM students ORDER BY created_at DESC';
        req.db.query(query,(err,results)=>{
            if (err){
                return res.status(500).json({error:err.message });
            }
            res.json({
                success:true,
                data:results,
                count: results.length
            });
        });
    },

    getById:(req,res)=>{
        const query='SELECT * FROM students WHERE id = ? ';

        req.db.query(query,[req.params.id],(err,results)=>{
            if (err){
                return res.status(500).json({error:err.message});

            }
            if (results.length===0){
                res.status(404).json({
                    success:false,
                    message: 'Etudiant non trouvé'
                });
            }
            res.json({
                success:true,
                data:results[0]
            });
        });
    },

    create: (req,res)=>{
        const {nom,prenom,age,telephone,email,profile_url,filiere,sexe,adresse}=req.body;

        const query= 'INSERT INTO students (nom,prenom,age,telephone,email,profile_url,filiere,sexe,adresse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        req.db.query(query,[nom,prenom,age,telephone,email,profile_url,filiere,sexe,adresse],(err,result)=>{
            if (err){
                return res.status(500).json({error:err.message});

            }

            req.db.query('SELECT * FROM students WHERE id = ?' , [result.insertId],(err,results)=>{
                if (err){
                   return res.status(500).json({error:err.message});

                }
                res.status(201).json({
                    success:true,
                    message: 'Etudiant créé avec succès!',
                    data:results[0]
                });
            });
        });
    },
    update: (req,res)=>{
        const {nom,prenom,age,telephone,email,profile_url,filiere,sexe,adresse}=req.body;
        const studentId=req.params.id;
        const query='UPDATE students SET nom=?, prenom=?, age=?, telephone=?, email=?, profile_url=?, filiere=?, sexe=?, adresse=? WHERE id = ?';
        req.db.query(query,[nom,prenom,age,telephone,email,profile_url,filiere,sexe,adresse,studentId],(err,result)=>{
            if (err){
                return res.status(500).json({error:err.message});
            }
            if (result.affectedRows===0){
                res.status(404).json({
                    success:false,
                    message:'L\'etudiant specifié n\'a pas été trouvé'
                });
            }
            req.db.query('SELECT * FROM students WHERE id=?',[studentId],(err,results)=>{
                if (err){
                   return res.status(500).json({error:err.message});
                }
                res.status(200).json({
                    success:true,
                    message:'Etudiant mis à jour avec succès',
                    data:results[0]
                });
            });
        });


    },

    delete : (req,res)=>{
        const studentId=req.params.id;
        const query='DELETE FROM students WHERE id=?';
        req.db.query(query,[studentId],(err,result)=>{
            if (err){
                return res.status(500).json({error:err.message});
            }
            if(result.affectedRows===0){
                res.status(404).json({
                    success:false,
                    message:'L\'etudiant à supprimer n\'existe pas ou n\a pas été retrouvé!'
                });
            }
            res.status(200).json({
                success:true,
                message:'Etudiant supprimé avec succès!'
            });

        });
    }
};
module.exports=studentsController;