
CREATE DATABASE IF NOT EXISTS studify_db;

USE studify_db;



CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_utilisateur VARCHAR(100) NOT NULL DEFAULT 'user',
    nom VARCHAR(100) NULL ,
    prenom VARCHAR(100) NULL ,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_url VARCHAR(255)  NULL DEFAULT 'https://ui-avatars.com/api/?name=User+Default&background=0D8ABC&color=fff',
    role ENUM('admin','teacher','student') NOT NULL DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP


);




CREATE TABLE IF NOT EXISTS students(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    age INT ,
    telephone VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    profile_url VARCHAR(255) NULL,
    filiere VARCHAR(100) NOT NULL,
    sexe CHAR(1),
    adresse VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_sexe CHECK (sexe IN ('M','F')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE

);
