const bcrypt = require("bcryptjs");

const usersController = {
    // 🔑 Login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Vérifier si l'utilisateur existe
            const [results] = await req.db.promise().query(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
            }

            const user = results[0];

            // Vérifier le mot de passe
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
            }

            // ✅ Stocker l'utilisateur en session
            req.session.user = { id: user.id, email: user.email, role: user.role };

            return res.json({
                success: true,
                message: "Connexion réussie",
                user: req.session.user
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    // 🚪 Logout
    logout: async (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Erreur lors de la déconnexion" });
                }
                res.clearCookie("connect.sid"); // ⚡ supprime le cookie de session
                return res.json({ success: true, message: "Déconnecté avec succès" });
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },
    // 🔑 Mot de passe oublié
    forgotPassword: async (req, res) => {
        try {
            const { email, newPassword } = req.body;

            // Vérifier si l'utilisateur existe
            const [results] = await req.db.promise().query(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: "Email introuvable" });
            }

            // ⚡ Hash du nouveau mot de passe
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await req.db.promise().query(
                "UPDATE users SET password=? WHERE email=?",
                [hashedPassword, email]
            );

            return res.json({
                success: true,
                message: "Mot de passe réinitialisé avec succès"
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    // 👤 Route profile
    profile: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({
                    success: false,
                    message: "Non connecté"
                });
            }

            const [results] = await req.db.promise().query(
                "SELECT id, nom_utilisateur, nom, prenom, email, profile_url, role FROM users WHERE id = ?",
                [req.session.user.id]
            );

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Utilisateur introuvable"
                });
            }

            return res.json({
                success: true,
                data: results[0]
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    // ... tes autres méthodes (login, logout, create, update, delete, etc.)


    // 🔍 Récupérer tous les utilisateurs
    getAll: async (req, res) => {
        try {
            let query = "SELECT * FROM users";
            const [results] = await req.db.promise().query(query);

            return res.json({
                success: true,
                data: results,
                count: results.length
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    // 🔍 Récupérer par ID
    getById: async (req, res) => {
        try {
            const [results] = await req.db.promise().query("SELECT * FROM users WHERE id = ?", [req.params.id]);

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
            }

            return res.json({ success: true, data: results[0] });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    // ➕ Créer
    signIn: async (req, res) => {
        try {
            const { nom_utilisateur, nom, prenom, email, password, profile_url, role } = req.body;

            // ⚡ Hash du mot de passe avant insertion
            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await req.db.promise().query(
                "INSERT INTO users (nom_utilisateur, nom, prenom, email, password, profile_url, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [nom_utilisateur, nom, prenom, email, hashedPassword, profile_url, role]
            );

            const [results] = await req.db.promise().query("SELECT * FROM users WHERE id = ?", [result.insertId]);

            return res.status(201).json({
                success: true,
                message: "Utilisateur créé avec succès!",
                data: results[0]
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    // ✏️ Mettre à jour
    update: async (req, res) => {
        try {
            const { nom_utilisateur, nom, prenom, email, password, profile_url, role } = req.body;
            const userId = req.params.id;

            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

            const [result] = await req.db.promise().query(
                "UPDATE users SET nom_utilisateur=?, nom=?, prenom=?, email=?, password=?, profile_url=?, role=? WHERE id = ?",
                [nom_utilisateur, nom, prenom, email, hashedPassword, profile_url, role, userId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
            }

            const [results] = await req.db.promise().query("SELECT * FROM users WHERE id=?", [userId]);

            return res.status(200).json({
                success: true,
                message: "Utilisateur mis à jour avec succès",
                data: results[0]
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    // 🗑️ Supprimer
    delete: async (req, res) => {
        try {
            const userId = req.params.id;
            const [result] = await req.db.promise().query("DELETE FROM users WHERE id=?", [userId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
            }

            return res.status(200).json({ success: true, message: "Utilisateur supprimé avec succès!" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
};

module.exports = usersController;
