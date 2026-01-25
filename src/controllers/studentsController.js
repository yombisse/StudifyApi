// StudentsControllers

const studentsController={
    getAll: (req, res) => {
        const { search, sort = 'created_at', order = 'desc', limit = 20, offset = 0 } = req.query;

        let query = 'SELECT * FROM students';
        const params = [];

        // 🔍 Recherche multi-champs
        if (search) {
            query += ' WHERE nom LIKE ? OR prenom LIKE ? OR email LIKE ? OR filiere LIKE ?';
            const like = `%${search}%`;
            params.push(like, like, like, like);
        }

        // 🔃 Tri sécurisé
        const allowedSortFields = ['nom', 'prenom', 'age', 'created_at', 'filiere'];
        const allowedOrder = ['asc', 'desc'];

        if (allowedSortFields.includes(sort.toLowerCase()) && allowedOrder.includes(order.toLowerCase())) {
            query += ` ORDER BY ${sort} ${order.toUpperCase()}`;
        } else {
            query += ' ORDER BY created_at DESC';
        }

        // 📑 Pagination
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        req.db.query(query, params, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                success: true,
                data: results,
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

    getStats: async (req, res) => {
        try {
            // Stats globales
            const [globalStats] = await req.db.promise().query(`
                SELECT 
                    COUNT(*) AS total_etudiants,
                    AVG(age) AS age_moyen,
                    MIN(age) AS age_min,
                    MAX(age) AS age_max,
                    SUM(CASE WHEN sexe = 'M' THEN 1 ELSE 0 END) AS total_hommes,
                    SUM(CASE WHEN sexe = 'F' THEN 1 ELSE 0 END) AS total_femmes
                FROM students
            `);

            // Répartition par filière
            const [filiereStats] = await req.db.promise().query(`
                SELECT filiere, COUNT(*) AS total
                FROM students
                GROUP BY filiere
                ORDER BY total DESC
                LIMIT 5
            `);

            // Évolution par mois
            const [evolutionStats] = await req.db.promise().query(`
                SELECT DATE_FORMAT(created_at, '%Y-%m') AS mois, COUNT(*) AS total
                FROM students
                GROUP BY mois
                ORDER BY mois DESC
            `);

            res.json({
                success: true,
                stats: {
                    global: globalStats[0],
                    par_filiere: filiereStats,
                    evolution: evolutionStats
                }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
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