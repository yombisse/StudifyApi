# StudifyAPI

API RESTful pour la gestion des utilisateurs et étudiants.

## 🚀 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd StudifyApi

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations
```

## 📁 Structure du projet

```
StudifyApi/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # Contrôleurs d'authentification
│   │   └── studentsController.js  # Contrôleurs d'étudiants
│   ├── middleware/
│   │   ├── authMiddleware.js      # Middleware JWT
│   │   ├── authValidator.js       # Validation utilisateurs
│   │   └── StudentValidator.js    # Validation étudiants
│   ├── models/
│   │   └── db.js                  # Configuration base de données
│   └── routes/
│       ├── authRoutes.js           # Routes authentification
│       └── students.js             # Routes étudiants
├── server.js                       # Point d'entrée
├── .env                            # Variables d'environnement
└── package.json
```

## 🔧 Configuration (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=studify
JWT_SECRET=votre_secret_jwt
PORT=3000
```

## 📚 API Endpoints

### 🔐 Authentification

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/api/auth/register` | Créer un compte | Public |
| POST | `/api/auth/login` | Connexion | Public |
| POST | `/api/auth/logout` | Déconnexion | Public |
| POST | `/api/auth/forgot-password` | Mot de passe oublié | Public |
| POST | `/api/auth/check-email` | Vérifier email | Public |
| GET | `/api/auth/profile` | Profil utilisateur | Protégé |
| GET | `/api/auth` | Lister tous les utilisateurs | Protégé |
| GET | `/api/auth/:id` | Obtenir un utilisateur | Protégé |
| PUT | `/api/auth/:id` | Modifier un utilisateur | Protégé |
| POST | `/api/auth/change-password` | Changer le mot de passe | Protégé |
| DELETE | `/api/auth/:id` | Supprimer un utilisateur | Protégé |

### 🎓 Étudiants

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/students` | Lister tous les étudiants | Public |
| GET | `/api/students/stats` | Statistiques | Public |
| GET | `/api/students/:id` | Obtenir un étudiant | Public |
| POST | `/api/students` | Créer un étudiant | Public |
| PUT | `/api/students/:id` | Modifier un étudiant | Public |
| DELETE | `/api/students/:id` | Supprimer un étudiant | Public |

## 📋 Format des Réponses

### Succès

```json
{
  "success": true,
  "data": { ... },
  "message": "Opération réussie"
}
```

### Erreur

```json
{
  "success": false,
  "errors": {
    "general": "Message d'erreur générale",
    "champ": "Message d'erreur spécifique"
  }
}
```

### Exemples d'erreurs

```json
// Erreur 404 - Ressource non trouvée
{
  "success": false,
  "errors": { "general": "Utilisateur non trouvé" }
}

// Erreur 400 - Validation
{
  "success": false,
  "errors": {
    "email": "Format d'email invalide",
    "password": "Le mot de passe doit contenir..."
  }
}

// Erreur 500 - Serveur
{
  "success": false,
  "errors": { "general": "Erreur interne du serveur" }
}
```

## 🔐 Authentification JWT

Toutes les routes protégées nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

### Structure du Token

```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "admin"
}
```

## ✅ Validation des Données

### Utilisateur (create)

| Champ | Règle |
|-------|-------|
| nom_utilisateur | Minimum 2 caractères |
| email | Format email valide |
| password | 8-12 caractères, 1 majuscule, 1 chiffre, 1 spécial |
| role | admin, teacher, student |

### Étudiant (create)

| Champ | Règle |
|-------|-------|
| nom | Minimum 2 caractères |
| prenom | Minimum 2 caractères |
| age | 16 - 100 ans |
| telephone | Format international valide (ex: +2266913191) |
| email | Format email valide |
| filiere | Minimum 2 caractères |
| sexe | M ou F |

## 🛠️ Technologies

- **Express.js** - Framework web
- **MySQL** - Base de données
- **MySQL2** - Driver MySQL
- **JWT** - Authentification
- **Bcryptjs** - Hachage de mots de passe
- **Cors** - Gestion CORS
- **Libphonenumber-js** - Validation téléphone

## 📦 Scripts NPM

```bash
npm start          # Démarrer le serveur
npm test           # Exécuter les tests
```
## Service en ligne
url: https://studify-latest.onrender.com
## 📄 Licence

ISC

