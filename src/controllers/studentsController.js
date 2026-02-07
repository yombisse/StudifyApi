// StudentsControllers

const studentsController={
    getAll: async (req, res) => {
        try {
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
            const [results]= await req.db.promise().query(query,params);
        
                return res.json({
                    success: true,
                    data: results,
                    count: results.length
                });
        } catch (err){
           
           return res.status(500).json({ success: false, errors: { general: err.message } });
        }
    },


    getById: async (req,res)=>{
        try {
            
            const [results] = await req.db.promise().query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        
            if (results.length===0){
                return res.status(404).json({
                    success:false,
                    errors: { general: 'Etudiant non trouvé' }
                });
            }
            return res.json({
                success:true,
                data:results[0]
            });
            
        } catch (err) {
            return res.status(500).json({error:err.message});
        }
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
            res.status(500).json({ success: false, errors: { general: err.message } });
        }
    },


    create: async (req, res) => {
        try {
            const { user_id,nom, prenom, age, telephone, email, profile_url, filiere, sexe, adresse } = req.body;

            const [result] = await req.db.promise().query(
                'INSERT INTO students (user_id,nom, prenom, age, telephone, email, profile_url, filiere, sexe, adresse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [user_id,nom, prenom, age, telephone, email, profile_url, filiere, sexe, adresse]
            );

            const [results] = await req.db.promise().query('SELECT * FROM students WHERE id = ?', [result.insertId]);

            return res.status(201).json({
                success: true,
                message: 'Etudiant créé avec succès!',
                data: results[0]
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    // ✏️ Mettre à jour
    update: async (req, res) => {
        try {
            const { user_id,nom, prenom, age, telephone, email, profile_url, filiere, sexe, adresse } = req.body;
            const studentId = req.params.id;

            const [result] = await req.db.promise().query(
                'UPDATE students SET user_id=?, nom=?, prenom=?, age=?, telephone=?, email=?, profile_url=?, filiere=?, sexe=?, adresse=? WHERE id = ?',
                [user_id, nom, prenom, age, telephone, email, profile_url, filiere, sexe, adresse, studentId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, errors: { general: "L'étudiant spécifié n'a pas été trouvé" } });
            }

            const [results] = await req.db.promise().query('SELECT * FROM students WHERE id=?', [studentId]);

            return res.status(200).json({
                success: true,
                message: 'Etudiant mis à jour avec succès',
                data: results[0]
            });
        } catch (err) {
            return res.status(500).json({ success: false, errors: { general: err.message } });
        }
    },

    // 🗑️ Supprimer
    delete: async (req, res) => {
        try {
            const studentId = req.params.id;
            const [result] = await req.db.promise().query('DELETE FROM students WHERE id=?', [studentId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, errors: { general: "L'étudiant à supprimer n'a pas été trouvé" } });
            }

            return res.status(200).json({ success: true, message: 'Etudiant supprimé avec succès!' });
        } catch (err) {
            return res.status(500).json({ success: false, errors: { general: err.message } });
        }
    }
};

module.exports = studentsController;
