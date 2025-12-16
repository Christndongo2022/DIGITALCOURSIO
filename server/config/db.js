
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: '../.env' }); // Ajustez le chemin selon l'emplacement de votre fichier .env

// Création du pool de connexion
// Le pool permet de gérer plusieurs connexions simultanées et de les réutiliser
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'digital_coursio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// On exporte une version "Promesse" du pool pour pouvoir utiliser async/await
// C'est beaucoup plus propre que les callbacks classiques
const db = pool.promise();

// Test de la connexion au démarrage
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données MySQL:', err.code);
    console.error('   Vérifiez que WAMP/XAMPP/MAMP est lancé et que les identifiants sont corrects.');
  } else {
    console.log('✅ Connecté avec succès à la base de données MySQL [digital_coursio]');
    connection.release();
  }
});

module.exports = db;
